/*
  Configuración de Firebase para que la galería se sincronice entre dispositivos.

  Mientras no llenes estos datos, la galería funciona en "modo local":
  las fotos se guardan solo en el navegador donde se suban.

  Para activar la sincronización real:
  1. Crea un proyecto gratis en https://console.firebase.google.com
  2. Agrega una app web y copia aquí los valores que te da Firebase
  3. Activa Firestore Database y Storage en modo producción
  4. Pega las reglas de seguridad que están en README-firebase.txt
*/

const FIREBASE_CONFIG = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID",
};

const FIREBASE_HABILITADO = FIREBASE_CONFIG.apiKey !== "TU_API_KEY" && typeof firebase !== 'undefined';

let db = null;
let storageRef = null;

if (FIREBASE_HABILITADO) {
  firebase.initializeApp(FIREBASE_CONFIG);
  db = firebase.firestore();
  storageRef = firebase.storage();
  firebase.auth().signInAnonymously().catch((err) => {
    console.error('No se pudo iniciar sesión anónima en Firebase:', err);
  });
}
