const PIN_CORRECTO = '1207';

function generarId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2);
}

function cargarDatos(clave, defecto) {
  const guardado = localStorage.getItem('fer_' + clave);
  if (guardado) return JSON.parse(guardado);
  return JSON.parse(JSON.stringify(defecto));
}

function guardarDatos(clave, datos) {
  localStorage.setItem('fer_' + clave, JSON.stringify(datos));
}

document.addEventListener('DOMContentLoaded', () => {
  renderTextos();
  setupSeries();
  setupAventuras();
  setupTabs();
  setupCandado();
  setupPreguntaFinal();
  setupLightbox();
  renderCollage();
  if (typeof setupGaleria === 'function') setupGaleria();
});

function renderTextos() {
  document.getElementById('header-title').textContent = 'Para ' + CONTENIDO.nombre;
  document.getElementById('carta-inicio-texto').textContent = CONTENIDO.cartaInicio;
  document.getElementById('carta-especial-texto').textContent = CONTENIDO.cartaEspecial;
  document.getElementById('pregunta-texto').textContent = CONTENIDO.pregunta;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── SERIES ──

function setupSeries() {
  const series = cargarDatos('series', CONTENIDO.series.map((s, i) => ({
    id: 'default-' + i, titulo: s.titulo, plataforma: s.plataforma, vista: s.vista
  })));
  const contenedor = document.getElementById('lista-series');
  const form = document.getElementById('form-nueva-serie');
  const inputTitulo = document.getElementById('input-nueva-serie-titulo');
  const inputPlataforma = document.getElementById('input-nueva-serie-plataforma');

  function render() {
    contenedor.innerHTML = '';
    if (series.length === 0) {
      contenedor.innerHTML = '<p class="vacio-mensaje">Agrega una serie para empezar.</p>';
      return;
    }
    series.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'checklist-item' + (item.vista ? ' vista' : '');
      div.innerHTML =
        '<input type="checkbox" ' + (item.vista ? 'checked' : '') + '>' +
        '<span class="titulo">' + escapeHtml(item.titulo) + '</span>' +
        (item.plataforma ? '<span class="plataforma">' + escapeHtml(item.plataforma) + '</span>' : '') +
        '<button class="btn-borrar" title="Borrar">&times;</button>';

      div.querySelector('input').addEventListener('change', function () {
        series[i].vista = this.checked;
        div.classList.toggle('vista', this.checked);
        guardarDatos('series', series);
      });
      div.querySelector('.btn-borrar').addEventListener('click', function (e) {
        e.stopPropagation();
        series.splice(i, 1);
        guardarDatos('series', series);
        render();
      });
      contenedor.appendChild(div);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var titulo = inputTitulo.value.trim();
    if (!titulo) return;
    series.push({ id: generarId(), titulo: titulo, plataforma: inputPlataforma.value.trim(), vista: false });
    guardarDatos('series', series);
    inputTitulo.value = '';
    inputPlataforma.value = '';
    render();
  });

  render();
}

// ── AVENTURAS ──

function setupAventuras() {
  var aventuras = cargarDatos('aventuras', CONTENIDO.aventuras.map(function (a, i) {
    return { id: 'default-' + i, titulo: a.titulo, descripcion: a.descripcion, ubicacion: '', fotos: [], hecho: a.hecho };
  }));

  var listaView = document.getElementById('aventuras-lista-view');
  var detalleView = document.getElementById('aventura-detalle-view');
  var contenedor = document.getElementById('lista-aventuras');
  var form = document.getElementById('form-nueva-aventura');
  var input = document.getElementById('input-nueva-aventura');
  var btnVolver = document.getElementById('btn-volver-aventuras');
  var aventuraActualIdx = null;

  function renderLista() {
    contenedor.innerHTML = '';
    if (aventuras.length === 0) {
      contenedor.innerHTML = '<p class="vacio-mensaje">Crea tu primera aventura.</p>';
      return;
    }
    aventuras.forEach(function (item, i) {
      var div = document.createElement('div');
      div.className = 'tarjeta-item' + (item.hecho ? ' hecho' : '');
      var fotosCount = (item.fotos || []).length;
      var subTexts = [];
      if (item.ubicacion) subTexts.push(item.ubicacion);
      if (fotosCount > 0) subTexts.push(fotosCount + ' foto' + (fotosCount === 1 ? '' : 's'));
      div.innerHTML =
        '<svg class="huella-mini" width="22" height="22" aria-hidden="true"><use href="#icon-huella"></use></svg>' +
        '<div class="tarjeta-info">' +
        '<h3>' + escapeHtml(item.titulo) + '</h3>' +
        (subTexts.length ? '<p class="tarjeta-sub">' + escapeHtml(subTexts.join(' · ')) + '</p>' : '') +
        '</div>' +
        '<button class="btn-borrar" title="Borrar">&times;</button>';

      div.querySelector('.tarjeta-info').addEventListener('click', function () {
        abrirDetalle(i);
      });
      div.querySelector('.btn-borrar').addEventListener('click', function (e) {
        e.stopPropagation();
        aventuras.splice(i, 1);
        guardarDatos('aventuras', aventuras);
        renderLista();
      });
      contenedor.appendChild(div);
    });
  }

  function abrirDetalle(idx) {
    aventuraActualIdx = idx;
    var av = aventuras[idx];
    listaView.hidden = true;
    detalleView.hidden = false;
    document.getElementById('aventura-detalle-titulo').textContent = av.titulo;
    document.getElementById('aventura-descripcion').value = av.descripcion || '';
    document.getElementById('aventura-ubicacion').value = av.ubicacion || '';
    renderMapaEmbed(av.ubicacion);
    renderFotosAventura();
  }

  function renderMapaEmbed(ubicacion) {
    var container = document.getElementById('aventura-mapa-container');
    container.innerHTML = '';
    if (!ubicacion) return;
    var iframe = document.createElement('iframe');
    iframe.className = 'aventura-mapa';
    iframe.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(ubicacion) + '&output=embed&z=12';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('allowfullscreen', '');
    container.appendChild(iframe);
  }

  function renderFotosAventura() {
    var grid = document.getElementById('aventura-fotos-grid');
    grid.innerHTML = '';
    var fotos = aventuras[aventuraActualIdx].fotos || [];
    if (fotos.length === 0) {
      grid.innerHTML = '<p class="vacio-mensaje">Aún no hay fotos.</p>';
      return;
    }
    fotos.forEach(function (url, fi) {
      var wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.display = 'inline-block';
      var img = document.createElement('img');
      img.src = url;
      img.alt = '';
      img.style.cursor = 'pointer';
      img.addEventListener('click', function () {
        if (typeof window.abrirLightbox === 'function') {
          window.abrirLightbox(fotos, fi);
        }
      });
      var del = document.createElement('button');
      del.className = 'btn-borrar';
      del.textContent = '×';
      del.style.position = 'absolute';
      del.style.top = '4px';
      del.style.right = '4px';
      del.style.background = 'rgba(251,243,230,0.85)';
      del.style.borderRadius = '50%';
      del.style.width = '24px';
      del.style.height = '24px';
      del.style.padding = '0';
      del.style.fontSize = '14px';
      del.style.opacity = '0.8';
      del.addEventListener('click', function () {
        aventuras[aventuraActualIdx].fotos.splice(fi, 1);
        guardarDatos('aventuras', aventuras);
        renderFotosAventura();
      });
      wrapper.appendChild(img);
      wrapper.appendChild(del);
      grid.appendChild(wrapper);
    });
  }

  function redimensionarImagen(file, maxDim, calidad) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var lector = new FileReader();
      lector.onload = function (e) { img.src = e.target.result; };
      lector.onerror = reject;
      img.onload = function () {
        var w = img.width, h = img.height;
        if (w > h && w > maxDim) { h = Math.round(h * (maxDim / w)); w = maxDim; }
        else if (h > maxDim) { w = Math.round(w * (maxDim / h)); h = maxDim; }
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob(function (blob) { resolve(blob); }, 'image/jpeg', calidad);
      };
      img.onerror = reject;
      lector.readAsDataURL(file);
    });
  }

  document.getElementById('btn-guardar-descripcion').addEventListener('click', function () {
    aventuras[aventuraActualIdx].descripcion = document.getElementById('aventura-descripcion').value;
    guardarDatos('aventuras', aventuras);
  });

  document.getElementById('btn-guardar-ubicacion').addEventListener('click', function () {
    var ub = document.getElementById('aventura-ubicacion').value.trim();
    aventuras[aventuraActualIdx].ubicacion = ub;
    guardarDatos('aventuras', aventuras);
    renderMapaEmbed(ub);
  });

  document.getElementById('input-aventura-fotos').addEventListener('change', async function () {
    var archivos = Array.from(this.files);
    if (archivos.length === 0) return;
    for (var f of archivos) {
      var blob = await redimensionarImagen(f, 800, 0.7);
      var dataUrl = await new Promise(function (res) {
        var r = new FileReader();
        r.onload = function (e) { res(e.target.result); };
        r.readAsDataURL(blob);
      });
      if (!aventuras[aventuraActualIdx].fotos) aventuras[aventuraActualIdx].fotos = [];
      aventuras[aventuraActualIdx].fotos.push(dataUrl);
    }
    guardarDatos('aventuras', aventuras);
    renderFotosAventura();
    this.value = '';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var titulo = input.value.trim();
    if (!titulo) return;
    aventuras.push({ id: generarId(), titulo: titulo, descripcion: '', ubicacion: '', fotos: [], hecho: false });
    guardarDatos('aventuras', aventuras);
    input.value = '';
    renderLista();
  });

  btnVolver.addEventListener('click', function () {
    detalleView.hidden = true;
    listaView.hidden = false;
    aventuraActualIdx = null;
    renderLista();
  });

  renderLista();
}

// ── TABS ──

function setupTabs() {
  var botones = document.querySelectorAll('.tab-btn');
  botones.forEach(function (btn) {
    btn.addEventListener('click', function () {
      botones.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}

// ── CANDADO ──

function setupCandado() {
  var lockScreen = document.getElementById('lock-screen');
  var especialContent = document.getElementById('especial-content');
  var form = document.getElementById('pin-form');
  var input = document.getElementById('pin-input');
  var error = document.getElementById('pin-error');

  if (localStorage.getItem('fer_unlocked') === '1') {
    lockScreen.hidden = true;
    especialContent.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value === PIN_CORRECTO) {
      localStorage.setItem('fer_unlocked', '1');
      lockScreen.hidden = true;
      especialContent.hidden = false;
    } else {
      error.textContent = 'Esa no es... intenta de nuevo';
      error.classList.remove('shake');
      void error.offsetWidth;
      error.classList.add('shake');
      input.value = '';
      input.focus();
    }
  });
}

// ── PREGUNTA FINAL ──

function setupPreguntaFinal() {
  var btnSi = document.getElementById('btn-si');
  var btnNo = document.getElementById('btn-no');
  var contenedor = document.getElementById('botones-pregunta');
  var preguntaFinal = document.getElementById('pregunta-final');
  var celebracion = document.getElementById('celebracion');

  var contador = 0;
  var mensajes = CONTENIDO.mensajesNo;

  function escaparNo() {
    contador++;
    var rect = contenedor.getBoundingClientRect();
    var btnW = btnNo.offsetWidth;
    var btnH = btnNo.offsetHeight;

    var zonaExcluidaX1 = 30;
    var zonaExcluidaX2 = 70;
    var zonaExcluidaY1 = 25;
    var zonaExcluidaY2 = 75;

    var x, y;
    var intentos = 0;
    do {
      x = (btnW / rect.width) * 100 + Math.random() * (100 - (btnW / rect.width) * 200);
      y = (btnH / rect.height) * 100 + Math.random() * (100 - (btnH / rect.height) * 200);
      intentos++;
    } while (
      intentos < 30 &&
      x > zonaExcluidaX1 && x < zonaExcluidaX2 &&
      y > zonaExcluidaY1 && y < zonaExcluidaY2
    );

    btnNo.style.left = x + '%';
    btnNo.style.top = y + '%';

    var texto = mensajes[(contador % (mensajes.length - 1)) + 1];
    btnNo.textContent = texto;

    var escala = Math.min(1 + contador * 0.12, 2.2);
    btnSi.style.transform = 'translate(-50%, -50%) scale(' + escala + ')';
  }

  btnNo.addEventListener('mouseenter', escaparNo);
  btnNo.addEventListener('focus', escaparNo);
  btnNo.addEventListener('touchstart', function (e) {
    e.preventDefault();
    escaparNo();
  }, { passive: false });

  btnSi.addEventListener('click', function () {
    preguntaFinal.hidden = true;
    celebracion.hidden = false;
    document.getElementById('mensaje-si').textContent = CONTENIDO.mensajeSi;
    lanzarConfeti();
  });
}

function lanzarConfeti() {
  var contenedor = document.getElementById('confeti');
  contenedor.innerHTML = '';
  var colores = ['#b5566f', '#d68aa0', '#7a3347'];

  for (var i = 0; i < 26; i++) {
    var size = 14 + Math.random() * 12;
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.classList.add('confeti-pieza');
    svg.style.left = Math.random() * 100 + '%';
    svg.style.color = colores[Math.floor(Math.random() * colores.length)];
    svg.style.animationDuration = 2 + Math.random() * 2 + 's';
    svg.style.animationDelay = Math.random() * 1.2 + 's';

    var use = document.createElementNS(svgNS, 'use');
    use.setAttribute('href', '#icon-corazon');
    svg.appendChild(use);
    contenedor.appendChild(svg);
  }
}

// ── LIGHTBOX ──

function setupLightbox() {
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var lbClose = document.getElementById('lightbox-close');
  var lbPrev = document.getElementById('lightbox-prev');
  var lbNext = document.getElementById('lightbox-next');
  var lbCounter = document.getElementById('lightbox-counter');
  var fotos = [];
  var idx = 0;

  function mostrar(i) {
    idx = i;
    lbImg.src = fotos[idx];
    lbCounter.textContent = (idx + 1) + ' / ' + fotos.length;
    lbPrev.style.display = fotos.length > 1 ? '' : 'none';
    lbNext.style.display = fotos.length > 1 ? '' : 'none';
  }

  window.abrirLightbox = function (listaFotos, indice) {
    fotos = listaFotos;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    mostrar(indice || 0);
  };

  lbClose.addEventListener('click', function () {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    }
  });

  lbPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    mostrar((idx - 1 + fotos.length) % fotos.length);
  });

  lbNext.addEventListener('click', function (e) {
    e.stopPropagation();
    mostrar((idx + 1) % fotos.length);
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') { lightbox.hidden = true; document.body.style.overflow = ''; }
    if (e.key === 'ArrowLeft') mostrar((idx - 1 + fotos.length) % fotos.length);
    if (e.key === 'ArrowRight') mostrar((idx + 1) % fotos.length);
  });
}

// ── COLLAGE EN INICIO ──

function recopilarTodasLasFotosLocal() {
  var todas = [];
  var aventuras = cargarDatos('aventuras', []);
  aventuras.forEach(function (a) {
    if (a.fotos) a.fotos.forEach(function (url) { todas.push(url); });
  });
  var galeria = JSON.parse(localStorage.getItem('fer_galeria') || '{"albumes":[]}');
  galeria.albumes.forEach(function (album) {
    if (album.fotos) album.fotos.forEach(function (f) {
      todas.push(typeof f === 'string' ? f : f.url);
    });
  });
  return todas;
}

function recopilarTodasLasFotos(callback) {
  var todas = recopilarTodasLasFotosLocal();
  if (!FIREBASE_HABILITADO || !db) {
    callback(todas);
    return;
  }
  db.collection('albumes').get().then(function (snap) {
    var promesas = [];
    snap.forEach(function (doc) {
      promesas.push(
        db.collection('albumes').doc(doc.id).collection('fotos').get()
      );
    });
    return Promise.all(promesas);
  }).then(function (resultados) {
    resultados.forEach(function (fotosSnap) {
      fotosSnap.forEach(function (fotoDoc) {
        var url = fotoDoc.data().url;
        if (url && todas.indexOf(url) === -1) todas.push(url);
      });
    });
    callback(todas);
  }).catch(function () {
    callback(todas);
  });
}

function renderCollage() {
  recopilarTodasLasFotos(function (todas) {
    var contenedor = document.getElementById('collage-recuerdos');
    contenedor.innerHTML = '';
    if (todas.length === 0) return;

    var seleccion = todas.slice();
    for (var i = seleccion.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = seleccion[i]; seleccion[i] = seleccion[j]; seleccion[j] = tmp;
    }
    seleccion = seleccion.slice(0, 6);

    seleccion.forEach(function (url, fi) {
      var div = document.createElement('div');
      div.className = 'collage-foto';
      var rotacion = (Math.random() - 0.5) * 12;
      div.style.transform = 'rotate(' + rotacion + 'deg)';
      var img = document.createElement('img');
      img.src = url;
      img.alt = '';
      div.appendChild(img);
      div.addEventListener('click', function () {
        abrirLightbox(seleccion, fi);
      });
      contenedor.appendChild(div);
    });
  });
}
