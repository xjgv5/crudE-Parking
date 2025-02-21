import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, set, get, remove, update } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

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

  const formPension = document.getElementById('formPension');
  const tablaPensiones = document.getElementById('tablaPensiones').getElementsByTagName('tbody')[0];

  // Maneja el envío del formulario
  formPension.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtén los valores del formulario
    const numeroTag = document.getElementById('numeroTag').value;
    const statusActivacion = document.getElementById('statusActivacion').value;
    const nomenclaturaLocal = document.getElementById('nomenclaturaLocal').value;
    const nombreLocal = document.getElementById('nombreLocal').value;
    const nombreSolicitante = document.getElementById('nombreSolicitante').value;
    const solicitaFactura = document.getElementById('solicitaFactura').value;
    const metodoPago = document.getElementById('metodoPago').value;
    const fechaContratacion = document.getElementById('fechaContratacion').value;
    const statusPago = document.getElementById('statusPago').value;
    const mesesPagados = parseInt(document.getElementById('mesesPagados').value, 10);
    const fechaInicio = document.getElementById('fechaInicio').value;
    const lugar = document.getElementById('lugar').value;
    const telefono = document.getElementById('telefono').value;
    const correo = document.getElementById('correo').value;
    const modelo = document.getElementById('modelo').value;
    const color = document.getElementById('color').value;
    const placas = document.getElementById('placas').value;
    const año = document.getElementById('año').value;
    const notas = document.getElementById('notas').value;

    // Calcula la fecha de vencimiento
    const fechaContratacionObj = new Date(fechaContratacion);
    const fechaVencimientoObj = new Date(fechaContratacionObj);
    fechaVencimientoObj.setMonth(fechaContratacionObj.getMonth() + mesesPagados);
    const fechaVencimiento = fechaVencimientoObj.toISOString().split('T')[0];

    // Calcula los días por vencer
    const hoy = new Date();
    const diffTime = fechaVencimientoObj - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diasPorVencer = diffDays > 0 ? diffDays : 0;

    // Determina el estado
    const estado = diffDays > 0 ? "Vigente" : "Vencido";

    // Guarda los datos en Firebase
    const idRegistro = new Date().getTime().toString(); // ID único
    const registro = {
      numeroTag,
      statusActivacion,
      nomenclaturaLocal,
      nombreLocal,
      nombreSolicitante,
      solicitaFactura,
      metodoPago,
      fechaContratacion,
      statusPago,
      mesesPagados,
      fechaInicio,
      fechaVencimiento,
      diasPorVencer,
      estado,
      lugar,
      telefono,
      correo,
      modelo,
      color,
      placas,
      año,
      notas
    };

    set(ref(database, `pensiones/${idRegistro}`), registro)
      .then(() => {
        alert("Registro guardado correctamente.");
        formPension.reset(); // Limpia el formulario
        cargarPensiones(); // Recarga los datos en la tabla
      })
      .catch((error) => {
        console.error("Error al guardar el registro:", error);
      });
  });

  // Carga los datos de pensiones en la tabla
  function cargarPensiones() {
    const pensionesRef = ref(database, 'pensiones');
    get(pensionesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const pensiones = snapshot.val();
          mostrarPensionesEnTabla(pensiones);
        } else {
          console.log("No se encontraron registros de pensiones.");
        }
      })
      .catch((error) => {
        console.error("Error al cargar los registros:", error);
      });
  }

  // Muestra los datos de pensiones en la tabla
  function mostrarPensionesEnTabla(pensiones) {
    tablaPensiones.innerHTML = ""; // Limpia la tabla

    for (const id in pensiones) {
      const pension = pensiones[id];
      const fila = tablaPensiones.insertRow();

      fila.insertCell().textContent = pension.numeroTag || "";
      fila.insertCell().textContent = pension.statusActivacion || "";
      fila.insertCell().textContent = pension.nomenclaturaLocal || "";
      fila.insertCell().textContent = pension.nombreLocal || "";
      fila.insertCell().textContent = pension.nombreSolicitante || "";
      fila.insertCell().textContent = pension.solicitaFactura || "";
      fila.insertCell().textContent = pension.metodoPago || "";
      fila.insertCell().textContent = pension.fechaContratacion || "";
      fila.insertCell().textContent = pension.statusPago || "";
      fila.insertCell().textContent = pension.mesesPagados || "";
      fila.insertCell().textContent = pension.fechaInicio || "";
      fila.insertCell().textContent = pension.fechaVencimiento || "";
      fila.insertCell().textContent = pension.diasPorVencer || "";
      fila.insertCell().textContent = pension.estado || "";
      fila.insertCell().textContent = pension.lugar || "";
      fila.insertCell().textContent = pension.telefono || "";
      fila.insertCell().textContent = pension.correo || "";
      fila.insertCell().textContent = pension.modelo || "";
      fila.insertCell().textContent = pension.color || "";
      fila.insertCell().textContent = pension.placas || "";
      fila.insertCell().textContent = pension.año || "";
      fila.insertCell().textContent = pension.notas || "";

      // Agrega botones de "Editar" y "Eliminar"
      const celdaAcciones = fila.insertCell();
      const btnEditar = document.createElement('button');
      btnEditar.textContent = "Editar";
      btnEditar.classList.add('btn__fBuscar') 
      btnEditar.classList.add('btnEditar__fBuscar')
      btnEditar.addEventListener('click', () => abrirModalEditar(id, pension));
      celdaAcciones.appendChild(btnEditar);

      const btnEliminar = document.createElement('button');
      btnEliminar.textContent = "Eliminar";
      btnEliminar.classList.add('btn__fBuscar')
      btnEliminar.classList.add('btnEditar__fEliminar')
      btnEliminar.addEventListener('click', () => eliminarPension(id));
      celdaAcciones.appendChild(btnEliminar);
    }
  }

  // Función para abrir el modal de edición
  function abrirModalEditar(id, pension) {
    // Llena el formulario con los datos del registro
    document.getElementById('numeroTag').value = pension.numeroTag || "";
    document.getElementById('statusActivacion').value = pension.statusActivacion || "";
    document.getElementById('nomenclaturaLocal').value = pension.nomenclaturaLocal || "";
    document.getElementById('nombreLocal').value = pension.nombreLocal || "";
    document.getElementById('nombreSolicitante').value = pension.nombreSolicitante || "";
    document.getElementById('solicitaFactura').value = pension.solicitaFactura || "";
    document.getElementById('metodoPago').value = pension.metodoPago || "";
    document.getElementById('fechaContratacion').value = pension.fechaContratacion || "";
    document.getElementById('statusPago').value = pension.statusPago || "";
    document.getElementById('mesesPagados').value = pension.mesesPagados || "";
    document.getElementById('fechaInicio').value = pension.fechaInicio || "";
    document.getElementById('lugar').value = pension.lugar || "";
    document.getElementById('telefono').value = pension.telefono || "";
    document.getElementById('correo').value = pension.correo || "";
    document.getElementById('modelo').value = pension.modelo || "";
    document.getElementById('color').value = pension.color || "";
    document.getElementById('placas').value = pension.placas || "";
    document.getElementById('año').value = pension.año || "";
    document.getElementById('notas').value = pension.notas || "";

    // Cambia el botón de "Guardar" a "Actualizar"
    const btnGuardar = document.querySelector('#formPension button[type="submit"]');
    btnGuardar.textContent = "Actualizar";
    btnGuardar.onclick = (e) => {
      e.preventDefault();
      actualizarPension(id);
    };
  }

  // Función para actualizar un registro
  function actualizarPension(id) {
    // Obtén los valores del formulario
    const numeroTag = document.getElementById('numeroTag').value;
    const statusActivacion = document.getElementById('statusActivacion').value;
    const nomenclaturaLocal = document.getElementById('nomenclaturaLocal').value;
    const nombreLocal = document.getElementById('nombreLocal').value;
    const nombreSolicitante = document.getElementById('nombreSolicitante').value;
    const solicitaFactura = document.getElementById('solicitaFactura').value;
    const metodoPago = document.getElementById('metodoPago').value;
    const fechaContratacion = document.getElementById('fechaContratacion').value;
    const statusPago = document.getElementById('statusPago').value;
    const mesesPagados = parseInt(document.getElementById('mesesPagados').value, 10);
    const fechaInicio = document.getElementById('fechaInicio').value;
    const lugar = document.getElementById('lugar').value;
    const telefono = document.getElementById('telefono').value;
    const correo = document.getElementById('correo').value;
    const modelo = document.getElementById('modelo').value;
    const color = document.getElementById('color').value;
    const placas = document.getElementById('placas').value;
    const año = document.getElementById('año').value;
    const notas = document.getElementById('notas').value;

    // Calcula la fecha de vencimiento
    const fechaContratacionObj = new Date(fechaContratacion);
    const fechaVencimientoObj = new Date(fechaContratacionObj);
    fechaVencimientoObj.setMonth(fechaContratacionObj.getMonth() + mesesPagados);
    const fechaVencimiento = fechaVencimientoObj.toISOString().split('T')[0];

    // Calcula los días por vencer
    const hoy = new Date();
    const diffTime = fechaVencimientoObj - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diasPorVencer = diffDays > 0 ? diffDays : 0;

    // Determina el estado
    const estado = diffDays > 0 ? "Vigente" : "Vencido";

    // Crea el objeto con los datos actualizados
    const registroActualizado = {
      numeroTag,
      statusActivacion,
      nomenclaturaLocal,
      nombreLocal,
      nombreSolicitante,
      solicitaFactura,
      metodoPago,
      fechaContratacion,
      statusPago,
      mesesPagados,
      fechaInicio,
      fechaVencimiento,
      diasPorVencer,
      estado,
      lugar,
      telefono,
      correo,
      modelo,
      color,
      placas,
      año,
      notas
    };

    // Actualiza el registro en Firebase
    update(ref(database, `pensiones/${id}`), registroActualizado)
      .then(() => {
        alert("Registro actualizado correctamente.");
        cargarPensiones(); // Recarga los datos en la tabla
        // Restaura el botón de "Guardar"
        const btnGuardar = document.querySelector('#formPension button[type="submit"]');
        btnGuardar.textContent = "Guardar";
        btnGuardar.onclick = (e) => {
          e.preventDefault();
          formPension.dispatchEvent(new Event('submit'));
        };
      })
      .catch((error) => {
        console.error("Error al actualizar el registro:", error);
      });
  }

  // Función para eliminar un registro
  function eliminarPension(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      remove(ref(database, `pensiones/${id}`))
        .then(() => {
          alert("Registro eliminado correctamente.");
          cargarPensiones(); // Recarga los datos en la tabla
        })
        .catch((error) => {
          console.error("Error al eliminar el registro:", error);
        });
    }
  }

  // Carga los datos al cargar la página
  cargarPensiones();
});