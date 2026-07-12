CÓMO ACTIVAR LA GALERÍA SINCRONIZADA (Firebase)
================================================

Mientras no hagas esto, la galería funciona en "modo local": cada quien ve
las fotos solo en su propio navegador. Sigue estos pasos para que se
sincronice de verdad entre tu celular y el de Fernanda.

1. Ve a https://console.firebase.google.com y entra con tu cuenta de Google.
2. Clic en "Agregar proyecto". Ponle el nombre que quieras (no es público).
3. Dentro del proyecto, clic en el ícono web "</>" para agregar una app web.
   Dale un nombre y crea la app.
4. Firebase te va a mostrar un bloque de código con valores como apiKey,
   authDomain, projectId, etc. Copia esos valores.
5. Abre el archivo js/firebase-config.js en este proyecto y reemplaza los
   valores de FIREBASE_CONFIG con los que copiaste.
6. En el menú de la izquierda de Firebase, entra a "Firestore Database" y
   clic en "Crear base de datos". Elige modo producción y cualquier región.
7. En el menú de la izquierda, entra a "Storage" y clic en "Comenzar".
   Elige modo producción.
8. Ve a la pestaña "Reglas" de Firestore y reemplaza el contenido por:

   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }

9. Ve a la pestaña "Reglas" de Storage y reemplaza el contenido por:

   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }

10. En el menú de la izquierda entra a "Authentication" > "Sign-in method"
    y activa el proveedor "Anónimo". Esto es lo que permite que cualquiera
    con el link pueda subir fotos sin necesitar una cuenta, pero solo
    después de pasar por la app (no cualquier bot de internet).

11. Guarda todo, recarga la página del sitio, y la galería debería decir
    "Sincronizado" en vez de "Modo local".

Nota: la apiKey que queda visible en el código es normal y esperado en
Firebase, no es un secreto — la protección real la dan las reglas de los
pasos 8 y 9.
