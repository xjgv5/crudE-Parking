import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDAm6-dlmI2VC2Njf1lURUILRKIqy056yc",
  authDomain: "e-parking-bd.firebaseapp.com",
  databaseURL: "https://e-parking-bd-default-rtdb.firebaseio.com",
  projectId: "e-parking-bd",
  storageBucket: "e-parking-bd.firebasestorage.app",
  messagingSenderId: "1026877978625",
  appId: "1:1026877978625:web:0979a3ee2cc6ddee9aa800",
  measurementId: "G-T2RLWFEMDF"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log("hola")
  const btnBuscar = document.getElementById('btnBuscar');
  const inputBusqueda = document.getElementById('busqueda');
  const tablaResultados = document.getElementById('tablaResultados').getElementsByTagName('tbody')[0];

  // Maneja la búsqueda
  btnBuscar.addEventListener('click', () => {
    const terminoBusqueda = inputBusqueda.value.trim();

    if (terminoBusqueda) {
      buscarRegistros(terminoBusqueda);
    } else {
      alert("Por favor, ingresa un término de búsqueda.");
    }
    console.log("Término de búsqueda:", terminoBusqueda);

  });
});

// Función para buscar registros
async function buscarRegistros(termino) {
  const registrosRef = ref(database, 'registros');
  const snapshot = await get(registrosRef);

  if (snapshot.exists()) {
    const registros = snapshot.val();
    const resultados = [];

    // Recorre todos los registros
    for (const id in registros) {
      const registro = registros[id];

      // Busca en los campos especificados
      if (
        registro.numeroTag.includes(termino) ||
        registro.numeroAlta.includes(termino) ||
        registro.nombreSolicitante.includes(termino) ||
        registro.placas.includes(termino) ||
        registro.modelo.includes(termino)
      ) {
        resultados.push(registro);
      }
    }

    // Muestra los resultados en la tabla
    mostrarResultados(resultados);
console.log("Registros encontrados:", resultados);
  } else {
    console.log("No se encontraron registros.");
  }
}

// Función para mostrar los resultados en la tabla
function mostrarResultados(resultados) {
    const tablaResultados = document.getElementById('tablaResultados').getElementsByTagName('tbody')[0];
    tablaResultados.innerHTML = ""; // Limpia la tabla
  
    if (resultados.length > 0) {
      resultados.forEach((registro) => {
        const fila = tablaResultados.insertRow();
  
        fila.insertCell().textContent = registro.numeroTag || "";
        fila.insertCell().textContent = registro.numeroAlta || "";
        fila.insertCell().textContent = registro.nombreLocal || "";
        fila.insertCell().textContent = registro.nombreSolicitante || "";
        fila.insertCell().textContent = registro.empresaProyecto || "";
        fila.insertCell().textContent = registro.statusActivacion || "";
        fila.insertCell().textContent = registro.statusEntrega || "";
        fila.insertCell().textContent = registro.fechaAlta || "";
        fila.insertCell().textContent = registro.telefono || "";
        fila.insertCell().textContent = registro.correo || "";
        fila.insertCell().textContent = registro.modelo || "";
        fila.insertCell().textContent = registro.color || "";
        fila.insertCell().textContent = registro.placas || "";
        fila.insertCell().textContent = registro.año || "";
  
        // Agrega un botón "Editar"
        const celdaAcciones = fila.insertCell();
        const btnEditar = document.createElement('button');
        btnEditar.textContent = "Editar";
        btnEditar.addEventListener('click', () => cargarFormularioEdicion(registro));
        celdaAcciones.appendChild(btnEditar);
      });
    } else {
      const fila = tablaResultados.insertRow();
      const celda = fila.insertCell();
      celda.colSpan = 15; // Ajusta el colspan según el número de columnas
      celda.textContent = "No se encontraron resultados.";
    }
  }