function setupGaleria() {
  const estado = document.getElementById('galeria-estado');
  const vistaAlbumes = document.getElementById('vista-albumes');
  const vistaAlbum = document.getElementById('vista-album');
  const albumesGrid = document.getElementById('albumes-grid');
  const fotosGrid = document.getElementById('fotos-grid');
  const formNuevaCarpeta = document.getElementById('form-nueva-carpeta');
  const inputNuevaCarpeta = document.getElementById('input-nueva-carpeta');
  const btnVolver = document.getElementById('btn-volver-albumes');
  const albumTitulo = document.getElementById('album-titulo');
  const inputSubirFoto = document.getElementById('input-subir-foto');

  let albumActualId = null;

  estado.textContent = FIREBASE_HABILITADO
    ? 'Sincronizado: las fotos se ven en cualquier dispositivo.'
    : 'Modo local: las fotos solo se ven en este navegador (configura Firebase para sincronizar en todos los dispositivos).';

  function generarId() {
    return (crypto.randomUUID) ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  function cargarLocal() {
    return JSON.parse(localStorage.getItem('fer_galeria') || '{"albumes":[]}');
  }

  function guardarLocal(data) {
    localStorage.setItem('fer_galeria', JSON.stringify(data));
  }

  function redimensionarImagen(file, maxDim, calidad) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const lector = new FileReader();
      lector.onload = (e) => { img.src = e.target.result; };
      lector.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round(height * (maxDim / width));
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round(width * (maxDim / height));
          height = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', calidad);
      };
      img.onerror = reject;
      lector.readAsDataURL(file);
    });
  }

  function blobADataUrl(blob) {
    return new Promise((resolve) => {
      const lector = new FileReader();
      lector.onload = (e) => resolve(e.target.result);
      lector.readAsDataURL(blob);
    });
  }

  async function listarAlbumes() {
    if (FIREBASE_HABILITADO) {
      const snap = await db.collection('albumes').orderBy('creado', 'asc').get();
      const resultados = [];
      for (const doc of snap.docs) {
        const fotosSnap = await db.collection('albumes').doc(doc.id).collection('fotos').get();
        resultados.push({ id: doc.id, nombre: doc.data().nombre, cantidad: fotosSnap.size });
      }
      return resultados;
    }
    const data = cargarLocal();
    return data.albumes.map((a) => ({ id: a.id, nombre: a.nombre, cantidad: a.fotos.length }));
  }

  async function crearAlbum(nombre) {
    if (FIREBASE_HABILITADO) {
      await db.collection('albumes').add({ nombre, creado: firebase.firestore.FieldValue.serverTimestamp() });
      return;
    }
    const data = cargarLocal();
    data.albumes.push({ id: generarId(), nombre, fotos: [] });
    guardarLocal(data);
  }

  async function listarFotos(albumId) {
    if (FIREBASE_HABILITADO) {
      const snap = await db.collection('albumes').doc(albumId).collection('fotos').orderBy('creado', 'asc').get();
      return snap.docs.map((d) => ({ id: d.id, url: d.data().url }));
    }
    const data = cargarLocal();
    const album = data.albumes.find((a) => a.id === albumId);
    return album ? album.fotos : [];
  }

  async function subirFoto(albumId, file) {
    const blob = await redimensionarImagen(file, 1200, 0.8);

    if (FIREBASE_HABILITADO) {
      const nombreArchivo = generarId() + '.jpg';
      const ref = storageRef.ref().child('fotos/' + albumId + '/' + nombreArchivo);
      await ref.put(blob);
      const url = await ref.getDownloadURL();
      await db.collection('albumes').doc(albumId).collection('fotos').add({
        url,
        storagePath: ref.fullPath,
        creado: firebase.firestore.FieldValue.serverTimestamp(),
      });
      return;
    }

    const dataUrl = await blobADataUrl(blob);
    const data = cargarLocal();
    const album = data.albumes.find((a) => a.id === albumId);
    album.fotos.push({ id: generarId(), url: dataUrl });
    guardarLocal(data);
  }

  async function renderAlbumes() {
    albumesGrid.innerHTML = '<p class="vacio-mensaje">Cargando...</p>';
    const albumes = await listarAlbumes();
    albumesGrid.innerHTML = '';
    if (albumes.length === 0) {
      albumesGrid.innerHTML = '<p class="vacio-mensaje">Aún no hay carpetas. Crea la primera arriba.</p>';
      return;
    }
    albumes.forEach((album) => {
      const div = document.createElement('div');
      div.className = 'album-card';
      div.innerHTML = `
        <svg width="40" height="40" aria-hidden="true"><use href="#icon-galeria"></use></svg>
        <div class="nombre">${escapeHtml(album.nombre)}</div>
        <div class="conteo">${album.cantidad} foto${album.cantidad === 1 ? '' : 's'}</div>
      `;
      div.addEventListener('click', () => abrirAlbum(album.id, album.nombre));
      albumesGrid.appendChild(div);
    });
  }

  async function abrirAlbum(id, nombre) {
    albumActualId = id;
    albumTitulo.textContent = nombre;
    vistaAlbumes.hidden = true;
    vistaAlbum.hidden = false;
    await renderFotos();
  }

  async function renderFotos() {
    fotosGrid.innerHTML = '<p class="vacio-mensaje">Cargando...</p>';
    const fotos = await listarFotos(albumActualId);
    fotosGrid.innerHTML = '';
    if (fotos.length === 0) {
      fotosGrid.innerHTML = '<p class="vacio-mensaje">Aún no hay fotos en esta carpeta.</p>';
      return;
    }
    const urls = fotos.map((f) => f.url);
    fotos.forEach((foto, i) => {
      const img = document.createElement('img');
      img.src = foto.url;
      img.alt = '';
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        if (typeof window.abrirLightbox === 'function') {
          window.abrirLightbox(urls, i);
        }
      });
      fotosGrid.appendChild(img);
    });
  }

  formNuevaCarpeta.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = inputNuevaCarpeta.value.trim();
    if (!nombre) return;
    inputNuevaCarpeta.value = '';
    await crearAlbum(nombre);
    await renderAlbumes();
  });

  btnVolver.addEventListener('click', () => {
    vistaAlbum.hidden = true;
    vistaAlbumes.hidden = false;
    albumActualId = null;
  });

  inputSubirFoto.addEventListener('change', async () => {
    const archivos = Array.from(inputSubirFoto.files);
    if (archivos.length === 0) return;
    fotosGrid.insertAdjacentHTML('afterbegin', '<p class="vacio-mensaje" id="subiendo-msg">Subiendo...</p>');
    for (const file of archivos) {
      await subirFoto(albumActualId, file);
    }
    inputSubirFoto.value = '';
    await renderFotos();
  });

  renderAlbumes();
}
