document.getElementById("miFormulario").addEventListener("submit", function(event) {
    event.preventDefault();

    const scriptURL = "https://script.google.com/macros/s/AKfycbwCA7zYgjEu9Wk5tOusHJLxPYpSvWUmxJLHTKgNNM4tc0PGPZ7R3JT8wZ6vnfoCRP50-Q/exec";
    const formData = new FormData(this);
    const jsonData = {};

    formData.forEach((value, key) => jsonData[key] = value);

    fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.text())
    .then(data => {
        alert("Datos enviados correctamente");
        document.getElementById("miFormulario").reset();
    })
    .catch(error => console.error("Error:", error));
})