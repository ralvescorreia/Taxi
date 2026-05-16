// 1. Importa a função que o professor criou no arquivo dele
import { loadDb } from './config.js'; 

export class DAO {  
    constructor() {
        this.db = null;
        this.conn = null;
    }

    // Método interno para pegar a instância do banco que o professor configurou
    async inicializar() {
        if (this.conn) return; // Se já tiver conectado, não faz nada

        // Pega o banco prontinho do arquivo do professor
        this.db = await loadDb();
        
        // Cria a conexão ativa com o DuckDB
        this.conn = await this.db.connect();
    }

    // A função que o seu app.js chama para alimentar o D3 da patroa
    // A função atualizada trazendo o dia da semana do DuckDB
    async carregarDadosDeFluxo() {
        await this.inicializar();
        const urlDoParquet = `${window.location.origin}/data/green_tripdata_2026-01.parquet`;

        // Modificamos as CTEs para extrair o dia da semana (0 = Domingo, 6 = Sábado)
        const resultado = await this.conn.query(`
            WITH saidas AS (
                SELECT 
                    PULocationID AS zona, 
                    EXTRACT(hour FROM lpep_pickup_datetime) AS hora, 
                    dayofweek(lpep_pickup_datetime) AS dia_semana, -- 🌟 Extrai o dia (0-6)
                    COUNT(*) AS qtd_pickups
                FROM read_parquet('${urlDoParquet}')
                GROUP BY zona, hora, dia_semana
            ),
            chegadas AS (
                SELECT 
                    DOLocationID AS zona, 
                    EXTRACT(hour FROM lpep_dropoff_datetime) AS hora, 
                    dayofweek(lpep_dropoff_datetime) AS dia_semana, -- 🌟 Extrai o dia (0-6)
                    COUNT(*) AS qtd_dropoffs
                FROM read_parquet('${urlDoParquet}')
                GROUP BY zona, hora, dia_semana
            )
            SELECT 
                COALESCE(s.zona, c.zona) AS bairro,
                COALESCE(s.hora, c.hora) AS hour,
                COALESCE(s.dia_semana, c.dia_semana) AS day_of_week, -- 🌟 Garante o campo no SELECT final
                COALESCE(s.qtd_pickups, 0) AS pickups,
                COALESCE(c.qtd_dropoffs, 0) AS dropoffs
            FROM saidas s
            FULL OUTER JOIN chegadas c ON s.zona = c.zona AND s.hora = c.hora AND s.dia_semana = c.dia_semana
            WHERE bairro IS NOT NULL
        `);

        return resultado.toArray().map(r => {
            const linha = r.toJSON();
            const p = Number(linha.pickups);
            const d = Number(linha.dropoffs);
            
            const razao = d > 0 ? (p / d) : p;

            return {
                bairro: String(linha.bairro),
                hour: Number(linha.hour),
                day_of_week: Number(linha.day_of_week), // 🌟 Agora o JavaScript recebe essa propriedade!
                pickups: p,
                dropoffs: d,
                eficiencia: razao 
            };
        });
    }
}