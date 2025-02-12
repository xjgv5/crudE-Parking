  // Agregar un documento de prueba a Firestore
  db.collection("pruebas").add({
    nombre: "Ejemplo",
    edad: 25
  })
  .then(() => {
    console.log("Documento agregado correctamente");
  })
  .catch((error) => {
    console.error("Error al agregar documento:", error);
  });

  // Leer documentos de la colección "pruebas"
  db.collection("pruebas").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  });

