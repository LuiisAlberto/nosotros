/*
 * ─────────────────────────────────────────────────────────────
 *  TUS DATOS
 *  Este es el ÚNICO archivo que tienes que editar.
 *  Todo lo que está aquí es de ejemplo: cámbialo por lo de ustedes.
 *  Respeta las comillas "" y las comas , al final de cada línea.
 *
 *  Truco: pon una palabra entre *asteriscos* para resaltarla
 *  en cursiva dorada. Ejemplo: "¿Dónde fue nuestra *primera cita*?"
 * ─────────────────────────────────────────────────────────────
 */
window.DATOS = {
  // Cómo le dices (aparece en la portada, el sobre y la carta)
  nombre: "Mi amor",
  // Tu nombre (firma de la carta)
  tuNombre: "Luis",
  // Iniciales para el sello de cera
  iniciales: "M&L",

  // "sencilla" → todo seguido en tu celular (cena)
  // "qr"       → cada capítulo se desbloquea escaneando un QR escondido
  modo: "sencilla",

  // Cómo termina:
  // "pregunta" → las estrellas forman la pregunta en pantalla
  // "mirame"   → aparece "Mírame" y tú se lo preguntas en persona
  final: "pregunta",

  // Títulos de cada capítulo (la pantalla que aparece entre uno y otro)
  capitulos: {
    carta: { titulo: "La carta", sub: "Donde empieza todo" },
    acertijos: { titulo: "Los acertijos", sub: "Veamos cuánto recuerdas" },
    wrapped: { titulo: "Nuestro Wrapped", sub: "Lo nuestro, en números" },
    cielo: { titulo: "El cielo", sub: "Mira hacia arriba" },
  },

  // ── Capítulo 1: La carta ──────────────────────────────────
  carta: {
    saludo: "Mi amor,",
    parrafos: [
      "Hay algo que llevo mucho tiempo queriendo decirte.",
      "Pero no te lo voy a decir así nada más… te lo vas a tener que ganar.",
      "Vamos a recorrer nuestra historia, capítulo por capítulo. Al final te espera una pregunta.",
    ],
    despedida: "Con todo mi corazón,",
    boton: "Acepto el reto",
  },

  // ── Capítulo 2: Los acertijos ─────────────────────────────
  // 3 o 4 preguntas. "correcta" es la posición de la respuesta buena
  // empezando en 0 (0 = la primera, 1 = la segunda, etc.)
  // "foto" es la ruta a una imagen dentro de la carpeta fotos/
  acertijos: [
    {
      pregunta: "¿Cómo nos *conocimos*?",
      opciones: ["En una fiesta", "En la escuela", "Por un amigo en común", "En el gym"],
      correcta: 2,
      pista: "Alguien tuvo que presentarnos…",
      recuerdo: {
        titulo: "Donde todo *empezó*",
        fecha: "14 de febrero, 2021",
        lugar: "Casa de Andrés",
        texto: "Yo ni quería ir ese día. Qué bueno que fui.",
        foto: "fotos/recuerdo-1.jpg",
      },
    },
    {
      pregunta: "¿Dónde fue nuestra *primera cita*?",
      opciones: ["En el cine", "En un café del centro", "En la playa", "En un parque"],
      correcta: 1,
      pista: "Había olor a pan recién hecho…",
      recuerdo: {
        titulo: "Nuestra *primera* cita",
        fecha: "marzo, 2021",
        lugar: "Café La Esquina",
        texto: "Pediste un capuchino, yo no sabía qué decir y terminamos hablando cuatro horas.",
        foto: "fotos/recuerdo-2.jpg",
      },
    },
    {
      pregunta: "¿Cuál es *nuestra canción*?",
      opciones: ["Perfect", "Tu jardín con enanitos", "Yellow", "La Macarena"],
      correcta: 2,
      pista: "Es de un color…",
      recuerdo: {
        titulo: "La canción de los *dos*",
        fecha: "abril, 2021",
        lugar: "En el coche, a todo volumen",
        texto: "No sabemos cantar, pero eso nunca nos ha detenido.",
        foto: "fotos/recuerdo-3.jpg",
      },
    },
    {
      pregunta: "¿Qué es lo que *más me gusta* de ti?",
      opciones: ["Tu risa", "Tu risa", "Tu risa", "Todas las anteriores"],
      correcta: 3,
      pista: "Es una pregunta con trampa.",
      recuerdo: {
        titulo: "Todo de *ti*",
        fecha: "todos los días",
        lugar: "Donde estés tú",
        texto: "Tu risa, tu forma de cuidarme y cómo haces que todo parezca más fácil.",
        foto: "fotos/recuerdo-4.jpg",
      },
    },
  ],

  // ── Capítulo 3: Nuestro Wrapped ───────────────────────────
  wrapped: {
    // Fecha en que se conocieron (AAAA-MM-DD) → se calculan los días desde entonces
    fechaInicio: "2021-02-14",
    ciudad: "Ciudad de México",
    cancion: {
      titulo: "Yellow",
      artista: "Coldplay",
      // Opcional: pon un .mp3 en fotos/ y escribe la ruta. Empieza a sonar
      // al tocar "Comenzar". Si no tienes, déjalo "".
      audio: "",
      // Opcional: portada del disco (imagen cuadrada en fotos/). Si no, "".
      portada: "",
    },
    emoji: "🥺",
    emojiTexto: "El emoji que más nos mandamos",
    emojiPie: "Y todavía funciona.",
    // Datos curiosos. Si exportas su chat de WhatsApp puedes poner números reales.
    datos: [
      { valor: "48,213", texto: "mensajes de WhatsApp" },
      { valor: "1,207", texto: "notas de voz" },
      { valor: "642", texto: "veces que nos dijimos “buenas noches”" },
      { valor: "1", texto: "vez que admitiste que yo tenía razón" },
    ],
  },

  // ── Capítulo 4: El cielo ──────────────────────────────────
  cielo: {
    intro: "Toca las estrellas",
    // Cada estrella revela una parte de la pregunta
    palabras: ["¿Quieres", "ser", "mi", "novia?"],
    // La pregunta como se ve al final (con *énfasis* si quieres)
    pregunta: "¿Quieres ser mi *novia*?",
    botonSi: "Sí",
    botonSi2: "¡Obvio sí!",
    tituloSi: "Dijiste que sí",
    // Aparece junto a la fecha y hora exactas en que dijo que sí
    etiquetaFecha: "Nuestro día 1",
    mensajeFinal: "Hoy empieza oficialmente lo nuestro. Gracias por escribir esta historia conmigo.",
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
    carta: "Tu primera pista te espera donde empieza el día.",
    acertijos: "La siguiente pista está donde guardamos las tazas.",
    wrapped: "Busca debajo de tu almohada.",
    cielo: "Sal al balcón y mira hacia arriba.",
  },
};
