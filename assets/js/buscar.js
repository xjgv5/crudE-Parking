import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, get, set, remove } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

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
  console.log("El DOM ha sido completamente cargado.");

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
  });

  // Verifica si el modal y el formulario existen antes de agregar eventos
  const modal = document.getElementById('modalEditar');
  const formEditar = document.getElementById('formEditar');
  const btnCerrarModal = document.getElementById('btnCerrarModal');

  if (modal && formEditar && btnCerrarModal) {
    // Función para abrir el modal de edición
    window.abrirModalEditar = (registro) => {
      modal.style.display = "flex";

      // Llena el formulario con los datos del registro
      document.getElementById('editNumeroTag').value = registro.numeroTag || "";
      document.getElementById('editNumeroAlta').value = registro.numeroAlta || "";
      document.getElementById('editNombreLocal').value = registro.nombreLocal || "";
      document.getElementById('editNombreSolicitante').value = registro.nombreSolicitante || "";
      document.getElementById('editEmpresaProyecto').value = registro.empresaProyecto || "";
      document.getElementById('editStatusActivacion').value = registro.statusActivacion || "";
      document.getElementById('editStatusEntrega').value = registro.statusEntrega || "";
      document.getElementById('editFechaAlta').value = registro.fechaAlta || "";
      document.getElementById('editTelefono').value = registro.telefono || "";
      document.getElementById('editCorreo').value = registro.correo || "";
      document.getElementById('editModelo').value = registro.modelo || "";
      document.getElementById('editColor').value = registro.color || "";
      document.getElementById('editPlacas').value = registro.placas || "";
      document.getElementById('editAño').value = registro.año || "";

      // Guarda el ID del registro en un atributo del modal
      modal.setAttribute('data-id', registro.id || "");
      console.log("ID del registro a editar:", registro.id);
    };

    // Función para cerrar el modal
    btnCerrarModal.addEventListener('click', () => {
      modal.style.display = "none";
    });

    // Función para guardar los cambios en Firebase
    formEditar.addEventListener('submit', (e) => {
      e.preventDefault();

      const idRegistro = modal.getAttribute('data-id');
      console.log("ID del registro a actualizar:", idRegistro);

      if (idRegistro) {
        const registroActualizado = {
          numeroTag: document.getElementById('editNumeroTag').value,
          numeroAlta: document.getElementById('editNumeroAlta').value,
          nombreLocal: document.getElementById('editNombreLocal').value,
          nombreSolicitante: document.getElementById('editNombreSolicitante').value,
          empresaProyecto: document.getElementById('editEmpresaProyecto').value,
          statusActivacion: document.getElementById('editStatusActivacion').value,
          statusEntrega: document.getElementById('editStatusEntrega').value,
          fechaAlta: document.getElementById('editFechaAlta').value,
          telefono: document.getElementById('editTelefono').value,
          correo: document.getElementById('editCorreo').value,
          modelo: document.getElementById('editModelo').value,
          color: document.getElementById('editColor').value,
          placas: document.getElementById('editPlacas').value,
          año: document.getElementById('editAño').value,
        };

        console.log("Datos actualizados:", registroActualizado);

        // Actualiza el registro en Firebase
        set(ref(database, `registros/${idRegistro}`), registroActualizado)
          .then(() => {
            alert("Registro actualizado correctamente.");
            modal.style.display = "none"; // Cierra el modal
            buscarRegistros(""); // Recarga los resultados
          })
          .catch((error) => {
            console.error("Error al actualizar el registro:", error);
          });
      } else {
        console.error("No se encontró el ID del registro.");
      }
    });
  } else {
    console.error("El modal, el formulario o el botón de cerrar no fueron encontrados en el DOM.");
  }
});

// Función para buscar registros
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

      // Verifica que los campos existan antes de usar `includes`
      const camposBusqueda = [
        registro.numeroTag,
        registro.numeroAlta,
        registro.nombreSolicitante,
        registro.placas,
        registro.modelo
      ];

      // Busca en los campos especificados
      if (
        camposBusqueda.some((campo) => campo && campo.includes(termino))
      ) {
        resultados.push({ ...registro, id }); // Guarda el ID del registro
      }
    }

    // Muestra los resultados en la tabla
    mostrarResultadosModal(resultados);
    console.log("Registros encontrados:", resultados);
  } else {
    console.log("No se encontraron registros.");
  }
}

// Función para mostrar los resultados en la tabla
function mostrarResultadosModal(resultados) {
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
      btnEditar.addEventListener('click', () => abrirModalEditar(registro));
      celdaAcciones.appendChild(btnEditar);

      // Agrega un botón "Eliminar"
      const btnEliminar = document.createElement('button');
      btnEliminar.textContent = "Eliminar";
      btnEliminar.addEventListener('click', () => eliminarRegistro(registro.id));
      celdaAcciones.appendChild(btnEliminar);
    });
  } else {
    const fila = tablaResultados.insertRow();
    const celda = fila.insertCell();
    celda.colSpan = 16; // Ajusta el colspan según el número de columnas
    celda.textContent = "No se encontraron resultados.";
  }
}

// Función para eliminar un registro
function eliminarRegistro(idRegistro) {
  if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
    const registroRef = ref(database, `registros/${idRegistro}`);

    remove(registroRef)
      .then(() => {
        alert("Registro eliminado correctamente.");
        buscarRegistros(""); // Recarga los resultados
      })
      .catch((error) => {
        console.error("Error al eliminar el registro:", error);
      });
  }
}