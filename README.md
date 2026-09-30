# Nuestra historia 💌

Una experiencia web para pedirle que sea tu novia, en 4 capítulos:

0. **Portada** — "Para *su nombre*" en caligrafía sobre un cielo nocturno.
1. **La carta** — un sobre con estampilla y matasellos. Se voltea, rompe el sello de cera con sus iniciales, se abre la solapa y sale una carta que se "escribe" sola.
2. **Los acertijos** — preguntas sobre ustedes; cada respuesta correcta revela una polaroid que se "revela" como foto instantánea.
3. **Nuestro Wrapped** — historias estilo Spotify: días desde que se conocieron, reloj en vivo, su canción en vinil, su emoji y sus datos. Mantén presionado para pausar.
4. **El cielo** — cada estrella que toca revela una palabra; al final se dibuja una constelación en forma de corazón y aparece la pregunta. Cuando dice que sí, queda guardado "Nuestro día 1" con la fecha y hora exactas.

Dura 10–15 minutos. Funciona en el celular, sin instalar nada y sin internet (las fuentes vienen incluidas).

## Cómo personalizarla

Solo tienes que tocar **dos cosas**:

1. **`datos.js`** — su nombre, sus iniciales (para el sello), la carta, los acertijos, fechas, canción, datos del Wrapped y la pregunta final.
   Pon palabras entre `*asteriscos*` para resaltarlas en cursiva dorada.
2. **`fotos/`** — una foto por recuerdo (lee `fotos/LEEME.md`).

## Dos modos

En `datos.js`, cambia `modo`:

| Modo | Para qué |
|------|----------|
| `"sencilla"` | Todo seguido en tu celular (por ejemplo, en una cena). |
| `"qr"` | Búsqueda del tesoro: cada capítulo se desbloquea al escanear un QR escondido. |

Para el modo QR:

1. Publica la página (ver abajo).
2. Abre `https://TU-USUARIO.github.io/nosotros/herramientas/qrs.html`, imprime los 4 QRs.
3. Escóndelos en orden. El texto de `pistasQR` le dice dónde buscar el siguiente.
4. El progreso se guarda en su celular: si cierra la página, sigue donde se quedó.

Y el `final`:

- `"pregunta"` → las estrellas forman la pregunta y aparecen los botones (los dos dicen *Sí*).
- `"mirame"` → aparece un gran **"Mírame"** y tú se lo preguntas en persona.

## Publicarla gratis (GitHub Pages)

1. En GitHub: **Settings → Pages**.
2. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` → **Save**.
3. En un par de minutos queda en `https://TU-USUARIO.github.io/nosotros/`.

> ⚠️ Si el repositorio es público, cualquiera con el enlace puede verla (y ella podría encontrarlo).
> Considera ponerlo privado hasta el día, o usar un nombre de repo que no delate nada.

## Probarla

- Ver un capítulo directo: `?capitulo=carta`, `?capitulo=acertijos`, `?capitulo=wrapped`, `?capitulo=cielo` o `?capitulo=final` (solo modo sencilla). También funciona con `#cielo`, `#final`, etc.
- Borrar el progreso del modo QR: agrega `?reiniciar` a la dirección.
- En tu computadora: `python3 -m http.server` dentro de la carpeta y abre `http://localhost:8000`.

## Consejos

- Pocos recuerdos muy buenos > muchos regulares. 4 acertijos es el punto ideal.
- Pruébala completa en tu celular antes del día, con el brillo al máximo.
- Si pones su canción (`wrapped.cancion.audio`), empieza a sonar suave al tocar "Comenzar".
- En Android se pone en pantalla completa sola. En iPhone, ábrela desde Safari → Compartir → "Agregar a inicio" para verla sin barras.
- Respeta el modo "reducir movimiento" del celular: si está activo, todo aparece con desvanecidos suaves.
