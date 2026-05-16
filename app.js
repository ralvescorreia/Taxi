import { DAO } from './dao.js'; 

// =========================================
// MATRIZ DE ZONEAMENTO METROPOLITANO (80 ZONAS)
// =========================================
const mapeamentoZonas = {
    // === 1. BROOKLYN ===
    66:  { nome: "DUMBO / Vineyard", distrito: "Brooklyn", perfil: "Nobre" },
    25:  { nome: "Brooklyn Heights", distrito: "Brooklyn", perfil: "Nobre" },
    181: { nome: "Park Slope", distrito: "Brooklyn", perfil: "Nobre" },
    97:  { nome: "Fort Greene", distrito: "Brooklyn", perfil: "Nobre" },
    61:  { nome: "Crown Heights North", distrito: "Brooklyn", perfil: "Nobre" },
    34:  { nome: "Canarsie", distrito: "Brooklyn", perfil: "Periferia" },
    26:  { nome: "Brownsville", distrito: "Brooklyn", perfil: "Periferia" },
    76:  { nome: "East New York", distrito: "Brooklyn", perfil: "Periferia" },
    108: { nome: "Gravesend", distrito: "Brooklyn", perfil: "Periferia" },
    14:  { nome: "Bay Ridge", distrito: "Brooklyn", perfil: "Periferia" },

    // === 2. QUEENS ===
    193: { nome: "Long Island City", distrito: "Queens", perfil: "Nobre" },
    7:   { nome: "Astoria", distrito: "Queens", perfil: "Nobre" },
    134: { nome: "Sunny Side", distrito: "Queens", perfil: "Nobre" },
    95:  { nome: "Forest Hills", distrito: "Queens", perfil: "Nobre" },
    223: { nome: "Steinway", distrito: "Queens", perfil: "Nobre" },
    130: { nome: "Jamaica", distrito: "Queens", perfil: "Periferia" },
    93:  { nome: "Far Rockaway", distrito: "Queens", perfil: "Periferia" },
    216: { nome: "South Ozone Park", distrito: "Queens", perfil: "Periferia" },
    56:  { nome: "Corona", distrito: "Queens", perfil: "Periferia" },
    131: { nome: "Jamaica Estates", distrito: "Queens", perfil: "Periferia" },

    // === 3. MANHATTAN (Centro / Sul) ===
    236: { nome: "Upper East Side North", distrito: "Manhattan", perfil: "Nobre" },
    263: { nome: "Yorkville West", distrito: "Manhattan", perfil: "Nobre" },
    141: { nome: "Lenox Hill West", distrito: "Manhattan", perfil: "Nobre" },
    237: { nome: "Upper East Side South", distrito: "Manhattan", perfil: "Nobre" },
    142: { nome: "Lincoln Square Top", distrito: "Manhattan", perfil: "Nobre" },
    140: { nome: "Lenox Hill East", distrito: "Manhattan", perfil: "Periferia" },
    262: { nome: "Yorkville East", distrito: "Manhattan", perfil: "Periferia" },
    50:  { nome: "Clinton West", distrito: "Manhattan", perfil: "Periferia" },
    48:  { nome: "Clinton East", distrito: "Manhattan", perfil: "Periferia" },
    100: { nome: "Garment District", distrito: "Manhattan", perfil: "Periferia" },

    // === 4. NORTH MANHATTAN ===
    127: { nome: "Inwood", distrito: "North Manhattan", perfil: "Nobre" },
    244: { nome: "Washington Hts South", distrito: "North Manhattan", perfil: "Nobre" },
    243: { nome: "Washington Hts North", distrito: "North Manhattan", perfil: "Nobre" },
    116: { nome: "Hamilton Heights", distrito: "North Manhattan", perfil: "Nobre" },
    152: { nome: "Manhattanville", distrito: "North Manhattan", perfil: "Nobre" },
    41:  { nome: "Central Harlem", distrito: "North Manhattan", perfil: "Periferia" },
    74:  { nome: "East Harlem North", distrito: "North Manhattan", perfil: "Periferia" },
    75:  { nome: "East Harlem South", distrito: "North Manhattan", perfil: "Periferia" },
    43:  { nome: "Central Harlem North", distrito: "North Manhattan", perfil: "Periferia" },
    166: { nome: "Morningside Heights", distrito: "North Manhattan", perfil: "Periferia" },

    // === 5. BRONX ===
    259: { nome: "Woodlawn / Wake", distrito: "Bronx", perfil: "Nobre" },
    183: { nome: "Pelham Parkway", distrito: "Bronx", perfil: "Nobre" },
    242: { nome: "Van Nest / Morris", distrito: "Bronx", perfil: "Nobre" },
    126: { nome: "Hunts Point", distrito: "Bronx", perfil: "Nobre" },
    213: { nome: "Riverdale", distrito: "Bronx", perfil: "Nobre" },
    167: { nome: "Morrisania / Melrose", distrito: "Bronx", perfil: "Periferia" },
    119: { location: "Highbridge", distrito: "Bronx", perfil: "Periferia" },
    174: { nome: "Norwood", distrito: "Bronx", perfil: "Periferia" },
    182: { nome: "Pelham Bay", distrito: "Bronx", perfil: "Periferia" },
    200: { nome: "Rocklawn / Van Cort", distrito: "Bronx", perfil: "Periferia" },

    // === 6. STATEN ISLAND ===
    214: { nome: "South Beach / Dongan", distrito: "Staten Island", perfil: "Nobre" },
    221: { nome: "Stapleton", distrito: "Staten Island", perfil: "Nobre" },
    132: { nome: "Eltingville / Annadale", distrito: "Staten Island", perfil: "Nobre" },
    226: { nome: "Sunnyside (SI)", distrito: "Staten Island", perfil: "Nobre" },
    6:   { nome: "Arrochar / Fort Wadsworth", distrito: "Staten Island", perfil: "Nobre" },
    187: { nome: "Port Richmond", distrito: "Staten Island", perfil: "Periferia" },
    23:  { nome: "Bloomfield / Chelsea", distrito: "Staten Island", perfil: "Periferia" },
    156: { nome: "Mariners Harbor", distrito: "Staten Island", perfil: "Periferia" },
    110: { nome: "Great Kills", distrito: "Staten Island", perfil: "Periferia" },
    84:  { nome: "Eltingville South", distrito: "Staten Island", perfil: "Periferia" },

    // === 7. NEW JERSEY COAST ===
    31:  { nome: "Jersey City Medical", distrito: "New Jersey Coast", perfil: "Nobre" },
    32:  { nome: "Jersey City Riverfront", distrito: "New Jersey Coast", perfil: "Nobre" },
    124: { nome: "Hoboken Naval Base", distrito: "New Jersey Coast", perfil: "Nobre" },
    125: { nome: "Hoboken West Point", distrito: "New Jersey Coast", perfil: "Nobre" },
    133: { nome: "Jersey City Heights", distrito: "New Jersey Coast", perfil: "Nobre" },
    13:  { nome: "Bayonne North", distrito: "New Jersey Coast", perfil: "Periferia" },
    15:  { nome: "Bay Ridge Fringe", distrito: "New Jersey Coast", perfil: "Periferia" },
    247: { nome: "West New York Border", distrito: "New Jersey Coast", perfil: "Periferia" },
    248: { nome: "Secaucus / Bergen", distrito: "New Jersey Coast", perfil: "Periferia" },
    179: { nome: "North Bergen / Guttenberg", distrito: "New Jersey Coast", perfil: "Periferia" },

    // === 8. LONG ISLAND BORDER ===
    121: { nome: "Hillcrest / Fresh Meadows", distrito: "Long Island Border", perfil: "Nobre" },
    122: { nome: "Holliswood / Jamaica", distrito: "Long Island Border", perfil: "Nobre" },
    203: { nome: "Rosedale South", distrito: "Long Island Border", perfil: "Nobre" },
    204: { nome: "Rosedale North / Valley", distrito: "Long Island Border", perfil: "Nobre" },
    205: { nome: "Saint Albans East", distrito: "Long Island Border", perfil: "Nobre" },
    1:   { nome: "Newark Airport Extension", distrito: "Long Island Border", perfil: "Periferia" },
    2:   { nome: "Jamaica Bay Wildlife", distrito: "Long Island Border", perfil: "Periferia" },
    155: { nome: "Madison Fringe", distrito: "Long Island Border", perfil: "Periferia" },
    154: { nome: "Marine Park Border", distrito: "Long Island Border", perfil: "Periferia" },
    153: { nome: "Marble Hill Border", distrito: "Long Island Border", perfil: "Periferia" }
};

const meuDao = new DAO();
const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip');
let dadosGlobaisDoFluxo = [];

// INITIALIZATION
meuDao.carregarDadosDeFluxo()
    .then(dadosDoBanco => {
        dadosGlobaisDoFluxo = dadosDoBanco;
        console.log("Exemplo de dado do banco:", dadosDoBanco[0]);

        d3.select("#seletor-regiao").on("change", pipelineDeAtualizacao);
        d3.selectAll("input[name='filtro-dia']").on("change", pipelineDeAtualizacao);
        d3.selectAll("input[name='filtro-granularidade']").on("change", pipelineDeAtualizacao); 

        function pipelineDeAtualizacao() {
            const regiaoSelecionada = d3.select("#seletor-regiao").property("value");
            const tipoDiaSelecionado = d3.select("input[name='filtro-dia']:checked").property("value");
            const granularidadeSelecionada = d3.select("input[name='filtro-granularidade']:checked").property("value");

            atualizarPainelPorFiltros(regiaoSelecionada, tipoDiaSelecionado, granularidadeSelecionada);
        }

        // 🌟 MUDANÇA AQUI: Troque de "horas" para "periodos" para o gráfico nascer agregado!
        atualizarPainelPorFiltros("Brooklyn", "todos", "periodos");
        criarLegendaHtml();
    })
    .catch(error => console.error("Erro ao inicializar fluxo:", error));

// Helper para converter hora bruta no rótulo semântico do turno urbano
function mapearTurnoUrbano(hora) {
    if (hora >= 6 && hora <= 11) return "Manhã";
    if (hora >= 12 && hora <= 17) return "Tarde";
    if (hora >= 18 && hora <= 23) return "Noite";
    return "Madrugada";
}

// =========================================
// PIPELINE DE FILTRAGEM MULTI-NÍVEL
// =========================================
function atualizarPainelPorFiltros(distritoAlvo, tipoDiaAlvo, granularidadeAlva) {
    let dadosFiltrados = dadosGlobaisDoFluxo
        .map(d => {
            const infoZona = mapeamentoZonas[d.bairro];
            if (infoZona && infoZona.distrito === distritoAlvo) {
                return { ...d, bairro: infoZona.nome, perfil: infoZona.perfil };
            }
            return null;
        })
        .filter(d => d !== null);

    if (tipoDiaAlvo === "uteis") {
        dadosFiltrados = dadosFiltrados.filter(d => d.day_of_week >= 1 && d.day_of_week <= 5);
    } else if (tipoDiaAlvo === "fds") {
        dadosFiltrados = dadosFiltrados.filter(d => d.day_of_week === 0 || d.day_of_week === 6);
    }

    const todosBairrosDoDistrito = Object.values(mapeamentoZonas)
        .filter(zona => zona.distrito === distritoAlvo);

    const ordemNobres = [...new Set(todosBairrosDoDistrito
        .filter(zona => zona.perfil === "Nobre")
        .map(zona => zona.nome))];

    const ordemPeriferia = [...new Set(todosBairrosDoDistrito
        .filter(zona => zona.perfil === "Periferia")
        .map(zona => zona.nome))];

    const bairrosDesseDistrito = [...new Set(todosBairrosDoDistrito.map(zona => zona.nome))];
    const dadosCompletos = [];

    bairrosDesseDistrito.forEach(bairroNome => {
        const modeloBairro = todosBairrosDoDistrito.find(zona => zona.nome === bairroNome);
        const perfilDefinido = modeloBairro ? modeloBairro.perfil : "Periferia";

        if (granularidadeAlva === "horas") {
            for (let hora = 0; hora < 24; hora++) {
                const dadosDaHora = dadosFiltrados.filter(d => d.bairro === bairroNome && d.hour === hora);
                if (dadosDaHora.length > 0) {
                    const totalPickups = d3.sum(dadosDaHora, d => d.pickups);
                    const totalDropoffs = d3.sum(dadosDaHora, d => d.dropoffs);
                    const eficienciaMedia = totalDropoffs > 0 ? (totalPickups / totalDropoffs) : 1.0;

                    dadosCompletos.push({
                        bairro: bairroNome, tempoLabel: `${hora}h`, perfil: perfilDefinido,
                        pickups: totalPickups, dropoffs: totalDropoffs, eficiencia: eficienciaMedia
                    });
                } else {
                    dadosCompletos.push({
                        bairro: bairroNome, tempoLabel: `${hora}h`, perfil: perfilDefinido,
                        pickups: 0, dropoffs: 0, eficiencia: 1.0
                    });
                }
            }
        } else {
            // 🌟 FIXADO: Agora chama corretamente a função mestre mapearTurnoUrbano sem erros de escopo
            const turnos = ["Madrugada", "Manhã", "Tarde", "Noite"];
            turnos.forEach(turno => {
                const dadosDoTurno = dadosFiltrados.filter(d => d.bairro === bairroNome && mapearTurnoUrbano(d.hour) === turno);

                if (dadosDoTurno.length > 0) {
                    const totalPickups = d3.sum(dadosDoTurno, d => d.pickups);
                    const totalDropoffs = d3.sum(dadosDoTurno, d => d.dropoffs);
                    const eficienciaMedia = totalDropoffs > 0 ? (totalPickups / totalDropoffs) : 1.0;

                    dadosCompletos.push({
                        bairro: bairroNome, tempoLabel: turno, perfil: perfilDefinido,
                        pickups: totalPickups, dropoffs: totalDropoffs, eficiencia: eficienciaMedia
                    });
                } else {
                    dadosCompletos.push({
                        bairro: bairroNome, tempoLabel: turno, perfil: perfilDefinido,
                        pickups: 0, dropoffs: 0, eficiencia: 1.0
                    });
                }
            });
        }
    });

    const dadosPeriferiaGrafico = dadosCompletos.filter(d => d.perfil === "Periferia");
    const dadosNobresGrafico = dadosCompletos.filter(d => d.perfil === "Nobre");

    desenharGraficos(dadosPeriferiaGrafico, '#heatmap-periferia', ordemPeriferia);
    desenharGraficos(dadosNobresGrafico, '#heatmap-nobre', ordemNobres);
}

// =========================================================================
// 📊 MOTOR RENDERIZADOR D3 RECALIBRADO (CÉLULAS ADAPTATIVAS HORAS/PERÍODOS)
// =========================================================================
function desenharGraficos(data, idsvg, ordemBairros) {
    const svg = d3.select(idsvg);
    svg.selectAll("*").remove();

    const margin = { top: 25, right: 30, left: 160, bottom: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 160;

    const g = svg.attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Assegura a ordenação fixa do Eixo X no domínio dependendo do fluxo ativo
    const distinctTimes = [...new Set(data.map(d => d.tempoLabel))];
    if (distinctTimes.includes("Madrugada")) {
        distinctTimes.sort((a, b) => {
            const ordemTurnos = { "Madrugada": 1, "Manhã": 2, "Tarde": 3, "Noite": 4 };
            return ordemTurnos[a] - ordemTurnos[b];
        });
    } else {
        distinctTimes.sort((a, b) => parseInt(a) - parseInt(b));
    }

    const xScale = d3.scaleBand()
        .domain(distinctTimes)
        .range([0, width])
        .padding(0.08);

    const yScale = d3.scaleBand()
        .domain(ordemBairros)
        .range([0, height])
        .padding(0.12);

    const colorScale = d3.scaleLinear()
        .domain([0.0, 1.0, 2.0])
        .range(["#a50026", "#ffffbf", "#006837"])
        .clamp(true);

    const celulas = g.selectAll(".quadradinho")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "quadradinho")
        .attr("x", d => xScale(d.tempoLabel))
        .attr("y", d => yScale(d.bairro))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("rx", 3.5)
        .attr("ry", 3.5)
        .style("stroke", "none")
        .style("fill", "#fafafa")
        .on("mouseover", function (event, d) {
            celulas.style("opacity", 0.25);
            d3.select(this).style("opacity", 1);

            tooltip.style("opacity", 1)
                .html(`
                    <strong>${d.bairro}</strong><br/>
                    Período: <strong>${d.tempoLabel}</strong><br/>
                    <hr style='margin: 4px 0; border:0; border-top:1px solid #e1e8ed;'>
                    Pickups (Saídas): ${d.pickups}<br/>
                    Dropoffs (Chegadas): ${d.dropoffs}<br/>
                    Razão S/C: <strong>${d.eficiencia.toFixed(2)}</strong>
                `)
                .style("font-family", "'Inter', sans-serif");
        })
        .on("mousemove", function (event) {
            tooltip.style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseleave", function () {
            celulas.style("opacity", 1);
            tooltip.style("opacity", 0);
        });

    celulas.transition()
        .duration(450)
        .style("fill", d => colorScale(d.eficiencia));

    g.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickSize(0))
        .call(g => g.select(".domain").remove())
        .style("font-family", "'Inter', sans-serif")
        .style("font-size", "10px")
        .style("color", "#8898aa")
        .selectAll("text")
        .style("margin-top", "6px");

    g.append("g")
        .call(d3.axisLeft(yScale).tickSize(0))
        .call(g => g.select(".domain").remove())
        .style("font-family", "'Inter', sans-serif")
        .style("font-size", "11px")
        .style("color", "#1e293b")
        .selectAll("text")
        .style("font-weight", "500")
        .attr("dx", "-6px");
}

// =========================================================================
// 🎨 GERADOR DE LEGENDA HTML SIDEBAR
// =========================================================================
function criarLegendaHtml() {
    const container = d3.select("#container-legenda-html");
    container.selectAll("*").remove();

    const box = container.append("div")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("align-items", "stretch")
        .style("font-family", "'Inter', 'Segoe UI', sans-serif")
        .style("color", "#2f3542");

    box.append("div")
        .text("Eficiência de Fluxo (Razão S/C)")
        .style("font-size", "13px")
        .style("font-weight", "600")
        .style("margin-bottom", "10px");

    box.append("div")
        .style("width", "100%")
        .style("height", "14px")
        .style("border-radius", "4px")
        .style("background", "linear-gradient(to right, #a50026 0%, #ffffbf 50%, #006837 100%)")
        .style("border", "1px solid #e1e8ed")
        .style("margin-bottom", "12px");

    const labels = box.append("div")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("gap", "6px")
        .style("font-size", "11px")
        .style("color", "#747d8c");

    labels.append("div").html("<span style='display:inline-block; width:22px; font-weight:bold; color:#a50026;'>0.0</span> (Crítico / Retorno Vazio)");
    labels.append("div").html("<span style='display:inline-block; width:22px; font-weight:bold; color:#b5b57a;'>1.0</span> (Fluxo Neutro)");
    labels.append("div").html("<span style='display:inline-block; width:22px; font-weight:bold; color:#006837;'>2.0</span> (Superávit de Saídas)");
}