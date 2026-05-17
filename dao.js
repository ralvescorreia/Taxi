// =========================================================================
// CAMADA DATA ACCESS OBJECT (DAO) - ARQUITETURA DE PERSISTÊNCIA
// Decisão de Implementação: Padrão de Projeto DAO utilizado para isolar e
// desacoplar completamente as consultas analíticas de banco de dados (SQL)
// das regras de negócio e renderização visual do arquivo principal (app.js).
// =========================================================================

// Importação da instância unificada do WebAssembly DuckDB gerenciada institucionalmente
import { loadDb } from './config.js'; 

export class DAO {  
    constructor() {
        this.db = null;    // Instância global da engine DuckDB-Wasm
        this.conn = null;  // Instância de conexão ativa para execução de queries
    }

    // =========================================================================
    // INICIALIZAÇÃO DO BANCO (MÉTODO ASSÍNCRONO / LAZY INITIALIZATION)
    // Decisão de Engenharia de Software: Singleton implícito e Singleton de conexão.
    // Garante que a pesada engine em WebAssembly só se conecte uma única vez,
    // otimizando o ciclo de vida da aplicação e reaproveitando a conexão aberta.
    // =========================================================================
    async inicializar() {
        if (this.conn) return; // Guard Clause: evita abertura de conexões redundantes na memória I/O

        // Carrega assincronamente o core do banco de dados configurado no arquivo config
        this.db = await loadDb();
        
        // Abre e armazena uma conexão ativa concorrente com o DuckDB
        this.conn = await this.db.connect();
    }

    // =========================================================================
    // PIPELINE ANALÍTICO DE EXTRAÇÃO E AGREGAÇÃO URBANA (BIG DATA PIPELINE)
    // Mapeia o nível "What" do framework. Transforma gigabytes de registros brutos 
    // de viagens contidos no arquivo Parquet em métricas consolidadas espaço-temporais.
    // =========================================================================
    async carregarDadosDeFluxo() {
        // Assegura a conexão ativa antes de despachar a query para o worker WebAssembly
        await this.inicializar();
        
        // Resolução dinâmica do endpoint do arquivo de dados colunares Parquet (Janeiro de 2026)
        const urlDoParquet = `${window.location.origin}/data/green_tripdata_2026-01.parquet`;

        // Execução da Query SQL OLAP de alta performance utilizando Expressões de Tabela Comuns (CTEs)
        const resultado = await this.conn.query(`
            -- CTE 1: Agrupamento massivo de saídas (pickups) por zona, hora do dia e dia da semana
            WITH saidas AS (
                SELECT 
                    PULocationID AS zona, 
                    EXTRACT(hour FROM lpep_pickup_datetime) AS hora, 
                    dayofweek(lpep_pickup_datetime) AS dia_semana, -- Decisão SQL: Extrai índice temporal (0 = Domingo, 6 = Sábado)
                    COUNT(*) AS qtd_pickups
                FROM read_parquet('${urlDoParquet}')
                GROUP BY zona, hora, dia_semana
            ),
            -- CTE 2: Agrupamento massivo de chegadas (dropoffs) espelhando a mesma janela espaço-temporal
            chegadas AS (
                SELECT 
                    DOLocationID AS zona, 
                    EXTRACT(hour FROM lpep_dropoff_datetime) AS hora, 
                    dayofweek(lpep_dropoff_datetime) AS dia_semana, 
                    COUNT(*) AS qtd_dropoffs
                FROM read_parquet('${urlDoParquet}')
                GROUP BY zona, hora, dia_semana
            )
            -- Mapeamento Principal: Consolidação das matrizes via FULL OUTER JOIN
            -- Justificativa Técnica: Garante que zonas que registraram apenas saídas ou apenas chegadas 
            -- em um determinado horário não sofram exclusão ou omissão estatística na visualização.
            SELECT 
                COALESCE(s.zona, c.zona) AS bairro,
                COALESCE(s.hora, c.hora) AS hour,
                COALESCE(s.dia_semana, c.dia_semana) AS day_of_week, -- Garante a preservação do atributo temporal indexado
                COALESCE(s.qtd_pickups, 0) AS pickups,                -- Substitui nulos (vazios de tráfego) por zero absoluto
                COALESCE(c.qtd_dropoffs, 0) AS dropoffs
            FROM saidas s
            FULL OUTER JOIN chegadas c ON s.zona = c.zona AND s.hora = c.hora AND s.dia_semana = c.dia_semana
            WHERE bairro IS NOT NULL
        `);

        // =========================================================================
        // TRATAMENTO, DESERIALIZAÇÃO E MAPEAR DE TIPOS (JAVASCRIPT / D3)
        // Converte o buffer binário de tabelas do DuckDB (Arrow Format) em uma coleção
        // nativa de objetos JSON tipados prontos para as escalas matemáticas do D3.
        // =========================================================================
        return resultado.toArray().map(r => {
            const linha = r.toJSON(); // Deserialização binária para objeto puramente Javascript
            
            // Cast de tipos: Garante conversão segura de BigInts do banco de dados para Double/Numbers do JS
            const p = Number(linha.pickups);
            const d = Number(linha.dropoffs);
            
            // Cálculo em tempo de mapeamento da Métrica Analítica Principal (Razão de Atendimento)
            // Tratamento de Divisão por Zero: Se não houver chegadas (dropoffs = 0), a razão é igualada 
            // ao volume bruto de saídas para sinalizar um superávit extremo ou isolamento voluntário.
            const razao = d > 0 ? (p / d) : p;

            // Retorno estruturado  (Input limpo para o nível What de Munzner)
            return {
                bairro: String(linha.bairro),       // Chave primária de LocationID para cruzamento no Zoneamento
                hour: Number(linha.hour),           // Eixo X discreto mapeado para o tempo linear [0h-23h]
                day_of_week: Number(linha.day_of_week), // Atributo relacional injetado para suporte a filtragem reativa de calendários
                pickups: p,                         // Métrica absoluta de engajamento produtivo de saídas
                dropoffs: d,                        // Métrica absoluta de atração logística de chegadas
                eficiencia: razao                   // Variável quantitativa contínua direcionada ao canal de cor (Luminância)
            };
        });
    }
}