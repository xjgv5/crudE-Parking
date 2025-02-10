// URL del Web App de Google Apps Script
const urlWebApp = "URL_DEL_WEB_APP";

// Función para realizar la búsqueda
async function buscarDatos() {
    const query = document.getElementById("buscador").value.toLowerCase(); // Captura el término de búsqueda
    const tablaResultados = document.getElementById("resultados");
    tablaResultados.innerHTML = ""; // Limpia resultados previos

    try {
        const respuesta = await fetch(urlWebApp);
        const datos = await respuesta.json();

        // Filtra los datos por las columnas especificadas
        const resultados = datos.filter(dato => 
            dato["Número de Tag"].toLowerCase().includes(query) ||
            dato["Nombre del Solicitante"].toLowerCase().includes(query) ||
            dato["Placas"].toLowerCase().includes(query) ||
            dato["Empresa / Proyecto"].toLowerCase().includes(query)
        );

        // Renderiza los resultados en la tabla
        resultados.forEach(dato => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${dato["Número de Tag"]}</td>
                <td>${dato["Nombre del Solicitante"]}</td>
                <td>${dato["Placas"]}</td>
                <td>${dato["Empresa / Proyecto"]}</td>
            `;
            tablaResultados.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al buscar datos:", error);
    }
}
