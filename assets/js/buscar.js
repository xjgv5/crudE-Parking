document.getElementById("btnBuscar").addEventListener("click", function () {
    let inputBusqueda = document.getElementById("inputBusqueda").value.trim();

    if (inputBusqueda === "") {
        alert("Por favor, ingresa un término de búsqueda.");
        return;
    }

    let urlWebApp = "https://script.google.com/macros/s/AKfycbzu9WiRYETwDQAQ0TW0eNFZaIFjHe21UKkjeOmsBDTVWmD9RkW5taeq0A5FC8Ve203s3A/exec";
    
    fetch(`${urlWebApp}?query=${encodeURIComponent(inputBusqueda)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Datos recibidos:", data);
        mostrarResultados(data);
    })
    .catch(error => console.error("Error al obtener los datos:", error));
});

function mostrarResultados(datos) {
    let tabla = document.getElementById("tablaResultados");
    let tbody = tabla.querySelector("tbody");

    // Limpiar contenido anterior
    tbody.innerHTML = "";

    if (datos.length === 0) {
        let fila = tbody.insertRow();
        let celda = fila.insertCell(0);
        celda.colSpan = 6; // Ajusta según el número de columnas
        celda.textContent = "No se encontraron resultados.";
        celda.style.textAlign = "center";
        return;
    }

    datos.forEach(filaData => {
        let fila = tbody.insertRow();

        let celdaTag = fila.insertCell(0);
        celdaTag.textContent = filaData.numeroTag;

        let celdaNombre = fila.insertCell(1);
        celdaNombre.textContent = filaData.nombrePersona;

        let celdaPlacas = fila.insertCell(2);
        celdaPlacas.textContent = filaData.placasVehiculo;

        let celdaEmpresa = fila.insertCell(3);
        celdaEmpresa.textContent = filaData.empresa;

        let celdaOtroCampo1 = fila.insertCell(4);
        celdaOtroCampo1.textContent = filaData.otroCampo1; // Ajusta si hay más campos

        let celdaOtroCampo2 = fila.insertCell(5);
        celdaOtroCampo2.textContent = filaData.otroCampo2; // Ajusta si hay más campos
    });
}
