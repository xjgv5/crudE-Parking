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
  console.log("El DOM ha sido completamente cargado.");

  const btnDescargarExcel = document.getElementById('btnDescargarExcel');

  // Maneja la descarga del archivo Excel
  btnDescargarExcel.addEventListener('click', () => {
    descargarBaseDeDatosEnExcel();
  });
});

// Función para descargar la base de datos en Excel
async function descargarBaseDeDatosEnExcel() {
  try {
    // Obtén los datos de los registros
    const registrosRef = ref(database, 'registros');
    const registrosSnapshot = await get(registrosRef);
    const registros = registrosSnapshot.exists() ? registrosSnapshot.val() : {};

    // Obtén los datos de las pensiones
    const pensionesRef = ref(database, 'pensiones');
    const pensionesSnapshot = await get(pensionesRef);
    const pensiones = pensionesSnapshot.exists() ? pensionesSnapshot.val() : {};

    // Convierte los datos a un formato compatible con SheetJS
    const registrosArray = Object.values(registros);
    const pensionesArray = Object.values(pensiones);

    // Crea un libro de Excel
    const workbook = XLSX.utils.book_new();

    // Crea una hoja para los registros
    const registrosSheet = XLSX.utils.json_to_sheet(registrosArray);
    XLSX.utils.book_append_sheet(workbook, registrosSheet, "Registros");

    // Crea una hoja para las pensiones
    const pensionesSheet = XLSX.utils.json_to_sheet(pensionesArray);
    XLSX.utils.book_append_sheet(workbook, pensionesSheet, "Pensiones");

    // Genera el archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Descarga el archivo
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'base_de_datos.xlsx';
    link.click();

    // Libera el objeto URL
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al descargar la base de datos en Excel:", error);
    alert("Ocurrió un error al descargar la base de datos en Excel.");
  }
}