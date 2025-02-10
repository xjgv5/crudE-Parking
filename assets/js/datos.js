document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se recargue

    // Capturar los valores de los campos del formulario
    let datosFormulario = {
        numeroTag: document.getElementById("numeroTag").value,
        numeroAlta: document.getElementById("numeroAlta").value,
        nombreLocal: document.getElementById("nombreLocal").value,
        nombreSolicitante: document.getElementById("nombreSolicitante").value,
        empresaProyecto: document.getElementById("empresaProyecto").value,
        statusActivacion: document.getElementById("statusActivacion").value,
        statusEntrega: document.getElementById("statusEntrega").value,
        fechaAlta: document.getElementById("fechaAlta").value,
        tel: document.getElementById("tel").value,
        correo: document.getElementById("correo").value,
        modelo: document.getElementById("modelo").value,
        color: document.getElementById("color").value,
        placas: document.getElementById("placas").value,
        anio: document.getElementById("anio").value
    };

    // URL del Web App de Google Apps Script
    const urlWebApp = "https://script.google.com/macros/s/AKfycbyWeCgsf0_8SISFBk3OoFNoHr0jWPwBo5Z9m13tcffORXn0MqfaWEZvguDkpnd4Y8uqwA/exec";

    // Enviar los datos a Google Sheets
    fetch(urlWebApp, {
        method: "POST",
        mode: "no-cors", // Evita bloqueos por CORS
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosFormulario)
    })
    .then(() => {
        alert("Datos enviados correctamente.");
        document.getElementById("formulario").reset(); // Limpiar el formulario
    })
    .catch(error => console.error("Error al enviar los datos:", error));
});
