document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("miFormulario").addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío del formulario
        window.location.href = "index.html";
    });
});
