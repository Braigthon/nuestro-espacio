/*
  EDITA ESTE ARCHIVO para personalizar los textos.
  Todo lo que ve Fernanda en el sitio sale de aquí.
  No necesitas tocar el HTML, CSS ni el resto del JS.
*/

const CONTENIDO = {
  nombre: "Fernanda",
  apodo: "preciosa",

  // Carta que aparece en la pestaña de Inicio
  cartaInicio: `Hola, preciosa.

Hice esta página con cariño para decirte algo que llevo tiempo queriendo decirte: me gustas, mucho. Cada vez que hablamos se me pasa el tiempo sin darme cuenta, y quiero seguir construyendo momentos contigo.

Explora las demás pestañas cuando quieras. Hay una sorpresa esperándote al final, pero necesitas una contraseña para llegar a ella...`,

  // Carta más profunda dentro de la pestaña bloqueada
  cartaEspecial: `Si estás leyendo esto es porque encontraste la contraseña (o porque no aguantaste la curiosidad, cualquiera de las dos está bien).

Quería tener un espacio solo para ti, algo más mío, algo más real. Lo que siento por ti no es cosa de un día: me gusta cómo eres, me gusta hablar contigo, me gusta pensar en el futuro y verte ahí.

No sé decir todo lo que llevo dentro con palabras perfectas, así que mejor te lo pregunto directamente.`,

  pregunta: "Fernanda, ¿quieres ser mi novia?",

  // Frases que va diciendo el botón "No" cada vez que se mueve (se repiten en ciclo)
  mensajesNo: [
    "No",
    "¿Segura?",
    "Intenta otra vez",
    "¿En serio?",
    "Piénsalo bien",
    "Ya casi...",
    "Ya basta",
    "¿Ya te cansaste?",
    "Es un no rotundo",
    "Mejor presiona el Sí",
    "Vas a estar aquí toda la noche",
  ],

  mensajeSi: "Sabía que dirías que sí. Te quiero, preciosa.",

  // Lista editable de aventuras / viajes. Agrega, quita o edita libremente.
  aventuras: [
    { titulo: "Ver un atardecer juntos", descripcion: "En algún lugar tranquilo, sin prisa.", hecho: false },
    { titulo: "Viaje sorpresa", descripcion: "Un lugar nuevo para los dos.", hecho: false },
    { titulo: "Maratón de comida callejera", descripcion: "Probar todo lo que se pueda en un día.", hecho: false },
  ],

  // Lista editable de series pendientes. "vista: true" la marca como completada.
  series: [
    { titulo: "Serie 1", plataforma: "Netflix", vista: false },
    { titulo: "Serie 2", plataforma: "HBO Max", vista: false },
    { titulo: "Serie 3", plataforma: "Prime Video", vista: false },
  ],
};
