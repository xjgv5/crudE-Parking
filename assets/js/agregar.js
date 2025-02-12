import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

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

// Obtén el formulario
const registroForm = document.getElementById('registroForm');

// Maneja el envío del formulario
registroForm.addEventListener('submit', (e) => {
  e.preventDefault(); 

  // Obtén los valores del formulario
  const numeroTag = document.getElementById('numeroTag').value;
  const numeroAlta = document.getElementById('numeroAlta').value;
  const nombreLocal = document.getElementById('nombreLocal').value;
  const nombreSolicitante = document.getElementById('nombreSolicitante').value;
  const empresaProyecto = document.getElementById('empresaProyecto').value;
  const statusActivacion = document.getElementById('statusActivacion').value;
  const statusEntrega = document.getElementById('statusEntrega').value;
  const fechaAlta = document.getElementById('fechaAlta').value;
  const telefono = document.getElementById('telefono').value;
  const correo = document.getElementById('correo').value;
  const modelo = document.getElementById('modelo').value;
  const color = document.getElementById('color').value;
  const placas = document.getElementById('placas').value;
  const año = document.getElementById('anio').value;

  // Genera un ID único para el registro
  const idUnico = new Date().getTime().toString();

  // Guarda los datos en Firebase
  set(ref(database, 'registros/' + idUnico), {
    numeroTag: numeroTag,
    numeroAlta: numeroAlta,
    nombreLocal: nombreLocal,
    nombreSolicitante: nombreSolicitante,
    empresaProyecto: empresaProyecto,
    statusActivacion: statusActivacion,
    statusEntrega: statusEntrega,
    fechaAlta: fechaAlta,
    telefono: telefono,
    correo: correo,
    modelo: modelo,
    color: color,
    placas: placas,
    año: año
  }).then(() => {
    mostrarToast("Registro guardado correctamente");
    registroForm.reset(); // Limpia el formulario
  }).catch((error) => {
    console.error("Error al guardar el registro:", error);
  });
});


// Funcion para el toast
function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  // Asigna el mensaje al toast
  toastMessage.textContent = mensaje;

  // Muestra el toast
  toast.classList.add('show');

  // Oculta el toast después de 3 segundos
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}


