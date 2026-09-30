/*
 * ─────────────────────────────────────────────────────────────
 *  TUS DATOS
 *  Este es el ÚNICO archivo que tienes que editar.
 *  Todo lo que está aquí es de ejemplo: cámbialo por lo de ustedes.
 *  Respeta las comillas "" y las comas , al final de cada línea.
 * ─────────────────────────────────────────────────────────────
 */
window.DATOS = {
  // Cómo le dices (aparece en el sobre y en varias partes)
  nombre: "Mi amor",
  // Tu nombre (firma de la carta)
  tuNombre: "Luis",

  // "sencilla" → todo seguido en tu celular (cena)
  // "qr"       → cada capítulo se desbloquea escaneando un QR escondido
  modo: "sencilla",

  // Cómo termina:
  // "pregunta" → las estrellas forman la pregunta en pantalla
  // "mirame"   → aparece "Mírame" y tú se lo preguntas en persona
  final: "pregunta",

  // ── Capítulo 1: La carta ──────────────────────────────────
  carta: {
    saludo: "Hola, mi amor:",
    parrafos: [
      "Hay algo que llevo tiempo queriendo decirte.",
      "Pero no te lo voy a decir así nada más… te lo vas a tener que ganar.",
      "Prepárate: vamos a recorrer nuestra historia, capítulo por capítulo.",
    ],
    firma: "Con todo mi corazón,",
    boton: "Acepto el reto",
  },

  // ── Capítulo 2: Los acertijos ─────────────────────────────
  // 3 o 4 preguntas. "correcta" es la posición de la respuesta buena
  // empezando en 0 (0 = la primera, 1 = la segunda, etc.)
  // "foto" es la ruta a una imagen dentro de la carpeta fotos/
  acertijos: [
    {
      pregunta: "¿Dónde fue nuestra primera cita?",
      opciones: ["En el cine", "En un café del centro", "En la playa", "En un parque"],
      correcta: 1,
      pista: "Había olor a pan recién hecho…",
      recuerdo: {
        titulo: "Nuestra primera cita",
        fecha: "14 de febrero de 2021",
        lugar: "Café La Esquina",
        texto: "Pediste un capuchino, yo no sabía qué decir y terminamos hablando cuatro horas.",
        foto: "fotos/recuerdo-1.jpg",
      },
    },
    {
      pregunta: "¿Qué canción sonaba en nuestro primer baile?",
      opciones: ["Perfect", "Tu jardín con enanitos", "Coldplay – Yellow", "La de la boda de tu prima"],
      correcta: 2,
      pista: "Es de un color…",
      recuerdo: {
        titulo: "El primer baile",
        fecha: "Mayo de 2021",
        lugar: "La sala de tu casa",
        texto: "Sin música buena, sin espacio, sin saber bailar. Y aun así, perfecto.",
        foto: "fotos/recuerdo-2.jpg",
      },
    },
    {
      pregunta: "¿Cuál fue nuestro primer viaje juntos?",
      opciones: ["Oaxaca", "Cancún", "San Miguel de Allende", "Guadalajara"],
      correcta: 0,
      pista: "Mole, mezcal y mucho calor.",
      recuerdo: {
        titulo: "Nuestro primer viaje",
        fecha: "Diciembre de 2021",
        lugar: "Oaxaca",
        texto: "Nos perdimos tres veces y fue lo mejor del viaje.",
        foto: "fotos/recuerdo-3.jpg",
      },
    },
    {
      pregunta: "¿Qué es lo que más me gusta de ti?",
      opciones: ["Tu risa", "Tu risa", "Tu risa", "Todas las anteriores"],
      correcta: 3,
      pista: "Es una pregunta con trampa.",
      recuerdo: {
        titulo: "Todo de ti",
        fecha: "Todos los días",
        lugar: "Donde estés tú",
        texto: "Tu risa, tu forma de cuidarme y cómo haces que todo parezca más fácil.",
        foto: "fotos/recuerdo-4.jpg",
      },
    },
  ],

  // ── Capítulo 3: Nuestro Wrapped ───────────────────────────
  wrapped: {
    // Fecha en que empezaron (AAAA-MM-DD) → se calculan los días juntos
    fechaInicio: "2021-02-14",
    ciudad: "Ciudad de México",
    cancion: {
      titulo: "Yellow",
      artista: "Coldplay",
      // Opcional: pon un mp3 en fotos/ y escribe la ruta. Si no, déjalo "".
      audio: "",
    },
    emoji: "🥺",
    emojiTexto: "El emoji que más nos mandamos",
    // Datos curiosos. Si exportas su chat de WhatsApp puedes poner números reales.
    datos: [
      { valor: "48,213", texto: "mensajes de WhatsApp" },
      { valor: "3,102", texto: "veces que dijimos “te amo”" },
      { valor: "127", texto: "veces que me dijiste “ya llegué”" },
      { valor: "1", texto: "vez que admitiste que yo tenía razón" },
    ],
  },

  // ── Capítulo 4: El cielo ──────────────────────────────────
  cielo: {
    intro: "Toca las estrellas",
    // Cada estrella revela una parte de la pregunta
    palabras: ["¿Te", "quieres", "casar", "conmigo?"],
    botonSi: "Sí",
    mensajeFinal: "Esta es la mejor historia que me ha pasado. Gracias por escribirla conmigo.",
  },

  // ── Solo para modo "qr" ───────────────────────────────────
  // Palabras secretas de cada QR. Cámbialas por las que quieras
  // (sin espacios ni acentos). Luego genera los QRs con herramientas/qrs.html
  llaves: {
    carta: "luna",
    acertijos: "cafe",
    wrapped: "baile",
    cielo: "estrella",
  },
  pistasQR: {
    acertijos: "La siguiente pista está donde guardamos las tazas.",
    wrapped: "Busca debajo de tu almohada.",
    cielo: "Sal al balcón y mira hacia arriba.",
  },
};
