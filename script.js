const items = [
    {id:1, objetivo:"JUNCO", condicion:"Primed"},
    {id:2, objetivo:"POLEA", condicion:"Non-primed"},
    {id:3, objetivo:"PEREZA", condicion:"Non-primed"},
    {id:4, objetivo:"CATEDRAL", condicion:"Non-primed"},
    {id:5, objetivo:"GRAVA", condicion:"Non-primed"},
    {id:6, objetivo:"CUELLO", condicion:"Primed"},
    {id:7, objetivo:"INCENDIO", condicion:"Non-primed"},
    {id:8, objetivo:"ENTONCES", condicion:"Non-primed"},
    {id:9, objetivo:"BARATO", condicion:"Primed"},
    {id:10, objetivo:"SOBORNO", condicion:"Non-primed"},
    {id:11, objetivo:"CIEGO", condicion:"Primed"},
    {id:12, objetivo:"FERIA", condicion:"Primed"},
    {id:13, objetivo:"COMIDA", condicion:"Primed"},
    {id:14, objetivo:"LIMPIEZA", condicion:"Primed"},
    {id:15, objetivo:"SILBATO", condicion:"Primed"},
    {id:16, objetivo:"AMABLE", condicion:"Non-primed"},
    {id:17, objetivo:"SECTA", condicion:"Primed"},
    {id:18, objetivo:"PARTIDA", condicion:"Primed"},
    {id:19, objetivo:"TRONCO", condicion:"Primed"},
    {id:20, objetivo:"ESCOLTA", condicion:"Non-primed"},
    {id:21, objetivo:"SIMPATÍA", condicion:"Non-primed"},
    {id:22, objetivo:"CAMBIO", condicion:"Primed"},
    {id:23, objetivo:"ALBAÑIL", condicion:"Primed"},
    {id:24, objetivo:"GUANTE", condicion:"Primed"},
    {id:25, objetivo:"IMPUESTO", condicion:"Non-primed"},
    {id:26, objetivo:"TIRANTE", condicion:"Primed"},
    {id:27, objetivo:"DOMÉSTICA", condicion:"Non-primed"},
    {id:28, objetivo:"TRAJE", condicion:"Primed"},
    {id:29, objetivo:"NAVAJA", condicion:"Primed"},
    {id:30, objetivo:"ACTOR", condicion:"Non-primed"},
    {id:31, objetivo:"MASTÍN", condicion:"Non-primed"},
    {id:32, objetivo:"PUNTERA", condicion:"Non-primed"},
    {id:33, objetivo:"GRIFO", condicion:"Primed"},
    {id:34, objetivo:"FORJADO", condicion:"Non-primed"},
    {id:35, objetivo:"DIANA", condicion:"Non-primed"},
    {id:36, objetivo:"ESPOSA", condicion:"Non-primed"},
    {id:37, objetivo:"CANUTO", condicion:"Non-primed"},
    {id:38, objetivo:"BOMBILLA", condicion:"Primed"},
    {id:39, objetivo:"CONCEPTO", condicion:"Non-primed"},
    {id:40, objetivo:"DESPACHO", condicion:"Primed"}
];

let chart = null;

function renderizar() {
    const tbody = document.getElementById("tabla-items");
    items.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td style="text-align:left"><strong>${item.objetivo}</strong></td>
            <td><input type="number" min="0" max="1" id="resp-${index}" value="0" style="width:40px; text-align:center"></td>
            <td>${item.condicion.toUpperCase()}</td>
        `;
        tbody.appendChild(row);
    });
}

function procesar() {
    const aciertos = { "Primed": 0, "Non-primed": 0 };
    const totales = { "Primed": 0, "Non-primed": 0 };

    items.forEach((item, index) => {
        const val = Number(document.getElementById(`resp-${index}`).value) || 0;
        totales[item.condicion]++;
        if(val === 1) aciertos[item.condicion]++;
    });

    const p1 = (aciertos["Primed"] / totales["Primed"]) * 100 || 0;
    const p2 = (aciertos["Non-primed"] / totales["Non-primed"]) * 100 || 0;
    const diff = (p1 - p2).toFixed(1);

    document.getElementById("calculo-detallado").innerHTML = `
        <strong style="display:block; margin-bottom:10px">ANÁLISIS DE PROPORCIONES</strong>
        <div class="math-row"><span>Proporción Primed (Presentadas)</span> <span>${aciertos["Primed"]} / ${totales["Primed"]} = <strong>${p1.toFixed(1)}%</strong></span></div>
        <div class="math-row"><span>Proporción Línea Base (No presentadas)</span> <span>${aciertos["Non-primed"]} / ${totales["Non-primed"]} = <strong>${p2.toFixed(1)}%</strong></span></div>
        <div class="math-row" style="margin-top:10px; border-top:1px solid #eee; padding-top:10px">
            <strong>Efecto Priming (Primed - Línea Base)</strong> <strong>${diff}%</strong>
        </div>
    `;

    document.getElementById("seccion-resultados").style.display = "block";
    document.getElementById("val-primed").innerText = p1.toFixed(1) + "%";
    document.getElementById("val-nonprimed").innerText = p2.toFixed(1) + "%";
    
    const feedback = document.getElementById("condicionFinal");
    if (parseFloat(diff) > 0) {
        feedback.innerText = `Efecto de Priming detectado: facilitación del ${diff}%.`;
        feedback.style.backgroundColor = "#e3f2fd";
        feedback.style.borderLeftColor = "#3498db";
    } else {
        feedback.innerText = `No se ha encontrado el efecto priming (Diferencia: ${diff}%).`;
        feedback.style.backgroundColor = "#ffebee";
        feedback.style.borderLeftColor = "#ef5350";
    }

    dibujarGrafica(p1, p2);
}

function dibujarGrafica(p1, p2) {
    const ctx = document.getElementById("grafica").getContext("2d");
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Primed (Presentadas)', 'Baseline (No Presentadas)'],
            datasets: [{
                data: [p1, p2],
                backgroundColor: ['#A8E6CF', '#bdc3c7'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { 
                y: { 
                    beginAtZero: true, 
                    max: 100, 
                    title: { display: true, text: '% de compleción de raíces' } 
                } 
            }
        }
    });
}

window.onload = renderizar;