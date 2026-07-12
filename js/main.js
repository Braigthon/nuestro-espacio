const PIN_CORRECTO = '1207';

document.addEventListener('DOMContentLoaded', () => {
  renderTextos();
  renderAventuras();
  renderSeries();
  setupTabs();
  setupCandado();
  setupPreguntaFinal();
  if (typeof setupGaleria === 'function') setupGaleria();
});

function renderTextos() {
  document.getElementById('header-title').textContent = `Para ${CONTENIDO.nombre}`;
  document.getElementById('carta-inicio-texto').textContent = CONTENIDO.cartaInicio;
  document.getElementById('carta-especial-texto').textContent = CONTENIDO.cartaEspecial;
  document.getElementById('pregunta-texto').textContent = CONTENIDO.pregunta;
}

function renderAventuras() {
  const contenedor = document.getElementById('lista-aventuras');
  contenedor.innerHTML = '';
  CONTENIDO.aventuras.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'tarjeta-item' + (item.hecho ? ' hecho' : '');
    div.innerHTML = `
      <svg class="huella-mini" width="22" height="22" aria-hidden="true"><use href="#icon-huella"></use></svg>
      <div>
        <h3>${escapeHtml(item.titulo)}</h3>
        <p>${escapeHtml(item.descripcion)}</p>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

function renderSeries() {
  const contenedor = document.getElementById('lista-series');
  contenedor.innerHTML = '';
  CONTENIDO.series.forEach((item, i) => {
    const div = document.createElement('label');
    div.className = 'checklist-item' + (item.vista ? ' vista' : '');
    div.innerHTML = `
      <input type="checkbox" ${item.vista ? 'checked' : ''} data-index="${i}">
      <span class="titulo">${escapeHtml(item.titulo)}</span>
      <span class="plataforma">${escapeHtml(item.plataforma)}</span>
    `;
    const checkbox = div.querySelector('input');
    checkbox.addEventListener('change', () => {
      CONTENIDO.series[i].vista = checkbox.checked;
      div.classList.toggle('vista', checkbox.checked);
    });
    contenedor.appendChild(div);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function setupTabs() {
  const botones = document.querySelectorAll('.tab-btn');
  botones.forEach((btn) => {
    btn.addEventListener('click', () => {
      botones.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}

function setupCandado() {
  const lockScreen = document.getElementById('lock-screen');
  const especialContent = document.getElementById('especial-content');
  const form = document.getElementById('pin-form');
  const input = document.getElementById('pin-input');
  const error = document.getElementById('pin-error');

  if (localStorage.getItem('fer_unlocked') === '1') {
    lockScreen.hidden = true;
    especialContent.hidden = false;
  }

  form.addEventListener('submit', (e) => {
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

function setupPreguntaFinal() {
  const btnSi = document.getElementById('btn-si');
  const btnNo = document.getElementById('btn-no');
  const contenedor = document.getElementById('botones-pregunta');
  const preguntaFinal = document.getElementById('pregunta-final');
  const celebracion = document.getElementById('celebracion');

  let contador = 0;
  const mensajes = CONTENIDO.mensajesNo;

  function escaparNo() {
    contador++;
    const rect = contenedor.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();
    const margenX = (btnRect.width / rect.width) * 100;
    const margenY = (btnRect.height / rect.height) * 100;
    const x = margenX + Math.random() * (100 - margenX * 2);
    const y = margenY + Math.random() * (100 - margenY * 2);
    btnNo.style.left = x + '%';
    btnNo.style.top = y + '%';

    const texto = mensajes[(contador % (mensajes.length - 1)) + 1];
    btnNo.textContent = texto;

    const escala = Math.min(1 + contador * 0.12, 2.2);
    btnSi.style.transform = `translate(-50%, -50%) scale(${escala})`;
  }

  btnNo.addEventListener('mouseenter', escaparNo);
  btnNo.addEventListener('focus', escaparNo);
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    escaparNo();
  }, { passive: false });

  btnSi.addEventListener('click', () => {
    preguntaFinal.hidden = true;
    celebracion.hidden = false;
    document.getElementById('mensaje-si').textContent = CONTENIDO.mensajeSi;
    lanzarConfeti();
  });
}

function lanzarConfeti() {
  const contenedor = document.getElementById('confeti');
  contenedor.innerHTML = '';
  const iconos = ['#icon-corazon'];
  const colores = ['#b5566f', '#d68aa0', '#7a3347'];

  for (let i = 0; i < 26; i++) {
    const size = 14 + Math.random() * 12;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.classList.add('confeti-pieza');
    svg.style.left = Math.random() * 100 + '%';
    svg.style.color = colores[Math.floor(Math.random() * colores.length)];
    svg.style.animationDuration = 2 + Math.random() * 2 + 's';
    svg.style.animationDelay = Math.random() * 1.2 + 's';

    const use = document.createElementNS(svgNS, 'use');
    use.setAttribute('href', iconos[Math.floor(Math.random() * iconos.length)]);
    svg.appendChild(use);
    contenedor.appendChild(svg);
  }
}
