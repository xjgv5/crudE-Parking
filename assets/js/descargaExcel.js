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

// Encabezados personalizados
const encabezadosRegistros = [
  { header: "Número de Tag", key: "numeroTag" },
  { header: "Número de Alta", key: "numeroAlta" },
  { header: "Nombre del Local", key: "nombreLocal" },
  { header: "Nombre del Solicitante", key: "nombreSolicitante" },
  { header: "Empresa / Proyecto", key: "empresaProyecto" },
  { header: "Status de Activación", key: "statusActivacion" },
  { header: "Status de Entrega", key: "statusEntrega" },
  { header: "Fecha de Alta", key: "fechaAlta" },
  { header: "Teléfono", key: "telefono" },
  { header: "Correo", key: "correo" },
  { header: "Modelo", key: "modelo" },
  { header: "Color", key: "color" },
  { header: "Placas", key: "placas" },
  { header: "Año", key: "año" }
];

const encabezadosPensiones = [
  { header: "Número de Tag", key: "numeroTag" },
  { header: "Status de Activación", key: "statusActivacion" },
  { header: "Nomenclatura del Local", key: "nomenclaturaLocal" },
  { header: "Nombre del Local", key: "nombreLocal" },
  { header: "Nombre del Solicitante", key: "nombreSolicitante" },
  { header: "Solicita Factura", key: "solicitaFactura" },
  { header: "Método de Pago", key: "metodoPago" },
  { header: "Fecha de Contratación", key: "fechaContratacion" },
  { header: "Status de Pago", key: "statusPago" },
  { header: "Meses Pagados", key: "mesesPagados" },
  { header: "Fecha de Inicio", key: "fechaInicio" },
  { header: "Fecha de Vencimiento", key: "fechaVencimiento" },
  { header: "Días por Vencer", key: "diasPorVencer" },
  { header: "Estado", key: "estado" },
  { header: "Lugar", key: "lugar" },
  { header: "Teléfono", key: "telefono" },
  { header: "Correo", key: "correo" },
  { header: "Modelo", key: "modelo" },
  { header: "Color", key: "color" },
  { header: "Placas", key: "placas" },
  { header: "Año", key: "año" },
  { header: "Notas", key: "notas" }
];

// Estilo para los encabezados
const estiloEncabezado = {
  font: { bold: true, color: { rgb: "FFFFFF" } }, // Texto en negrita y color blanco
  fill: { fgColor: { rgb: "4F81BD" } }, // Fondo azul
  alignment: { horizontal: "center" } // Texto centrado
};

// Función para crear una hoja con encabezados personalizados
function crearHojaConEncabezados(datos, encabezados) {
  // Convierte los datos a un arreglo de objetos
  const datosArray = Object.values(datos);

  // Crea una hoja de Excel con los datos
  const hoja = XLSX.utils.json_to_sheet(datosArray, { header: encabezados.map(e => e.key) });

  // Aplica estilos a los encabezados
  XLSX.utils.sheet_add_aoa(hoja, [encabezados.map(e => e.header)], { origin: "A1" });
  for (let i = 0; i < encabezados.length; i++) {
    hoja[XLSX.utils.encode_cell({ r: 0, c: i })].s = estiloEncabezado;
  }

  return hoja;
}

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

    // Crea un libro de Excel
    const workbook = XLSX.utils.book_new();

    // Crea una hoja para los registros
    const registrosSheet = crearHojaConEncabezados(registros, encabezadosRegistros);
    XLSX.utils.book_append_sheet(workbook, registrosSheet, "Registros");

    // Crea una hoja para las pensiones
    const pensionesSheet = crearHojaConEncabezados(pensiones, encabezadosPensiones);
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