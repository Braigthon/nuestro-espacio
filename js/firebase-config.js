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
  apiKey: "AIzaSyAv_ReYofgdCRXXeikxTOWzaDirlCI5GB4",
  authDomain: "nuestrapagina-e19c3.firebaseapp.com",
  projectId: "nuestrapagina-e19c3",
  storageBucket: "nuestrapagina-e19c3.firebasestorage.app",
  messagingSenderId: "115699401942",
  appId: "1:115699401942:web:8e9739ff1fd8c389efb577",
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
