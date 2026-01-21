const items = [
    {id:1, categoria:"ESPECIAS", objetivo:"canela", condicion:"nrp"},
    {id:2, categoria:"ANIMALES", objetivo:"caballo", condicion:"rp-"},
    {id:3, categoria:"MÚSICA", objetivo:"guitarra", condicion:"nrp"},
    {id:4, categoria:"PROFESIONES", objetivo:"bombero", condicion:"rp-"},
    {id:5, categoria:"ESPECIAS", objetivo:"azafrán", condicion:"nrp"},
    {id:6, categoria:"ANIMALES", objetivo:"tiburón", condicion:"rp-"},
    {id:7, categoria:"INSTRUMENTOS", objetivo:"flauta", condicion:"nrp"},
    {id:8, categoria:"ANIMALES", objetivo:"vaca", condicion:"rp-"},
    {id:9, categoria:"ESPECIAS", objetivo:"perejil", condicion:"nrp"},
    {id:10, categoria:"PROFESIONES", objetivo:"cocinero", condicion:"rp-"},
    {id:11, categoria:"INSTRUMENTOS", objetivo:"tambor", condicion:"nrp"},
    {id:12, categoria:"DEPORTE", objetivo:"ciclismo", condicion:"rp-"},
    {id:13, categoria:"ESPECIAS", objetivo:"romero", condicion:"nrp"},
    {id:14, categoria:"FRUTAS", objetivo:"banana", condicion:"rp-"},
    {id:15, categoria:"INSTRUMENTOS", objetivo:"violín", condicion:"nrp"},
    {id:16, categoria:"DEPORTE", objetivo:"atletismo", condicion:"rp-"},
    {id:17, categoria:"ESPECIAS", objetivo:"tomillo", condicion:"nrp"},
    {id:18, categoria:"FRUTAS", objetivo:"limón", condicion:"rp-"},
    {id:19, categoria:"INSTRUMENTOS", objetivo:"saxofón", condicion:"nrp"},
    {id:20, categoria:"PROFESIONES", objetivo:"fontanero", condicion:"rp-"},
    {id:21, categoria:"ESPECIAS", objetivo:"orégano", condicion:"nrp"},
    {id:22, categoria:"DEPORTE", objetivo:"patinaje", condicion:"rp-"},
    {id:23, categoria:"INSTRUMENTOS", objetivo:"clarinete", condicion:"nrp"},
    {id:24, categoria:"FRUTAS", objetivo:"melón", condicion:"rp-"},
    {id:25, categoria:"DEPORTE", objetivo:"boxeo", condicion:"rp+"},
    {id:26, categoria:"FRUTAS", objetivo:"naranja", condicion:"rp+"},
    {id:27, categoria:"DEPORTE", objetivo:"tenis", condicion:"rp+"},
    {id:28, categoria:"FRUTAS", objetivo:"fresa", condicion:"rp+"},
    {id:29, categoria:"PROFESIONES", objetivo:"dentista", condicion:"rp+"},
    {id:30, categoria:"DEPORTE", objetivo:"natación", condicion:"rp+"},
    {id:31, categoria:"FRUTAS", objetivo:"piña", condicion:"rp+"},
    {id:32, categoria:"ANIMALES", objetivo:"burro", condicion:"rp+"},
    {id:33, categoria:"PROFESIONES", objetivo:"veterinario", condicion:"rp+"},
    {id:34, categoria:"ANIMALES", objetivo:"paloma", condicion:"rp+"},
    {id:35, categoria:"ANIMALES", objetivo:"oveja", condicion:"rp+"},
    {id:36, categoria:"PROFESIONES", objetivo:"jardinero", condicion:"rp+"}
];

let chart = null;

function renderizarTablaItems() {
    const tbody = document.getElementById("tabla-items");
    if (!tbody) return;
    tbody.innerHTML = "";
    items.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.categoria}</td>
            <td>${item.objetivo}</td>
            <td><input type="number" min="0" max="1" id="resp-${index}" value="0"></td>
            <td><strong>${item.condicion.toUpperCase()}</strong></td>
        `;
        tbody.appendChild(row);
    });
}

function procesar() {
    const resultados = { "rp+": 0, "rp-": 0, "nrp": 0 };
    const totales = { "rp+": 0, "rp-": 0, "nrp": 0 };

    items.forEach((item, index) => {
        const valor = Number(document.getElementById(`resp-${index}`).value) || 0;
        totales[item.condicion]++;
        if (valor === 1) resultados[item.condicion]++;
    });

    const nombresLargo = { 
        "rp+": "Practicados (RP+)",
        "nrp": "No practicados (NRP)",
        "rp-": "No practicados pero Relacionados (RP-)"
    };
    const orden = ["rp+", "nrp", "rp-"];

    const tbodyRes = document.querySelector("#tabla-resultados tbody");
    tbodyRes.innerHTML = "";
    orden.forEach(c => {
        const porc = Math.round((resultados[c] / totales[c]) * 100) || 0;
        tbodyRes.innerHTML += `<tr><td>${nombresLargo[c]}</td><td>${porc}%</td><td>${resultados[c]} de ${totales[c]}</td></tr>`;
    });

   // 1. Calculamos los porcentajes de cada una
const porcentajeNRP = (resultados["nrp"] / totales["nrp"]) * 100 || 0;
const porcentajeRPmin = (resultados["rp-"] / totales["rp-"]) * 100 || 0;

// 2. Calculamos la diferencia
const diferencia = (porcentajeNRP - porcentajeRPmin).toFixed(1);

// 3. Mostramos el mensaje dinámico
let mensajeComparacion = "";
if (porcentajeNRP > porcentajeRPmin) {
    mensajeComparacion = `Efecto RIF detectado: NRP (${porcentajeNRP.toFixed(1)}%) es mayor que RP- (${porcentajeRPmin.toFixed(1)}%) por una diferencia de ${diferencia} puntos.`;
} else if (porcentajeNRP < porcentajeRPmin) {
    mensajeComparacion = `No se observa el efecto esperado: NRP (${porcentajeNRP.toFixed(1)}%) es menor que RP- (${porcentajeRPmin.toFixed(1)}%). Diferencia: ${diferencia} puntos.`;
} else {
    mensajeComparacion = `Ambas condiciones son iguales (${porcentajeNRP.toFixed(1)}%). No hay diferencia detectable.`;
}

// 4. Lo pintamos en el HTML
document.getElementById("condicionFinal").innerText = mensajeComparacion;

    dibujarGrafica(resultados, totales, orden);
}

function dibujarGrafica(res, tot, orden) {
    const ctx = document.getElementById("grafica").getContext("2d");
    if (chart) chart.destroy();

    const datosPorcentaje = orden.map(c => (res[c] / tot[c]) * 100 || 0);

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            // Aseguramos que las etiquetas coincidan con el orden de los datos
            labels: ["Practicados (RP+)", "No Practicados (NRP)", "Relacionados (RP-)"],
            datasets: [{
                data: datosPorcentaje,
                backgroundColor: ["#A8E6CF", "#AEC6EF", "#FF8B94"], // RP+ (Verde), NRP (Azul), RP- (Rojo)
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '% de Recuerdo', // AQUÍ ESTÁ EL TÍTULO
                        color: '#2c3e50',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) { return value + "%"; }
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Inicialización
window.onload = renderizarTablaItems;

// Inicialización
window.onload = renderizarTablaItems;
