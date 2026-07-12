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

Me tardé algo, sí lo admito, sucede que creo que nunca he hecho esto así. Y quería hacerlo especial, te quiero mucho, eso siempre lo has sabido.

Quería hacer algo completamente único y diferente para ti, porque te has vuelto alguien increíblemente especial en mi vida. Hice esta página pedacito a pedacito, pensando en nosotros, para decirte algo que llevo tiempo queriendo confesarte: me gustas muchísimo y te quiero un montón.

Podría ser por tu brujería en que has gastado millones, y sí, probablemente, tal vez, como dices, estoy perdidamente un poco enamorado de ti.

Desde que empezamos a hablar, todo ha sido diferente. Cada vez que conversamos o pasamos tiempo juntos, las horas se me pasan volando sin que me dé cuenta, y lo único que deseo es seguir compartiendo y construyendo más momentos a tu lado.

Preparé este espacio con mucho cariño para recordar todos los momentos que vivamos juntos. Date una vuelta por las demás pestañas cuando quieras, aún no hay mucho, de hecho prácticamente nada, pero es el punto ¿no?, construir algo juntos que te saquen una sonrisa. Al final de todo, en la última sección, hay una sorpresa esperándote... pero está bajo llave y vas a necesitar una contraseña muy especial para descubrirla. La pista no está en la pantalla, así que tendrás que buscarla en el mundo real.

Por último, esta es una página que quiero que siga creciendo para agregar nuevas secciones, adaptarla a nuestro gusto. Esta página es nuestra y podemos usarla y crecerla tanto como queramos.

Te veo donde nuestra primera cita; el lugar donde pudimos ver un hermoso atardecer y tomar algo de clericot, una de nuestras primeras citas. Ahí te entregaré la segunda carta.

Con cariño, Brayan.

Posdata:
Viendo el clima que ha surgido últimamente, si todo se complica por la lluvia, entonces te tendré que ver fuera de mi casa.`,

  // Carta más profunda dentro de la pestaña bloqueada
  cartaEspecial: `Si estás leyendo esto es porque encontraste la contraseña (o porque no aguantaste la curiosidad, cualquiera de las dos está bien).

Quería tener un espacio solo para ti, algo más mío, algo más real. Lo que siento por ti no es cosa de un día: me gusta cómo eres, me gusta hablar contigo, me gusta pensar en el futuro y verte ahí. Eres una persona maravillosa y me haces inmensamente feliz.

No sé decir todo lo que llevo dentro con palabras perfectas, así que prefiero dejar los rodeos de lado y preguntártelo directamente aquí, en este pequeño rincón que construí especialmente para los dos...`,

  pregunta: "Preciosa, ¿quieres ser mi novia?",

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
