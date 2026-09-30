# Nuestra historia 💍

Una experiencia web para pedir matrimonio, en 4 capítulos:

1. **La carta** — un sobre con su nombre que se abre y la reta: *"te lo vas a tener que ganar"*.
2. **Los acertijos** — preguntas sobre ustedes; cada respuesta correcta revela un recuerdo con foto.
3. **Nuestro Wrapped** — historias estilo Spotify: días juntos, su canción, su emoji, datos curiosos.
4. **El cielo** — un cielo estrellado; cada estrella que toca revela una palabra de la pregunta.

Dura 10–15 minutos. Funciona en el celular, sin instalar nada.

## Cómo personalizarla

Solo tienes que tocar **dos cosas**:

1. **`datos.js`** — su nombre, la carta, los acertijos, fechas, canción, datos del Wrapped y la pregunta final.
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

- Ver un capítulo directo: `?capitulo=carta`, `?capitulo=acertijos`, `?capitulo=wrapped` o `?capitulo=cielo` (solo modo sencilla).
- Borrar el progreso del modo QR: agrega `?reiniciar` a la dirección.
- En tu computadora: `python3 -m http.server` dentro de la carpeta y abre `http://localhost:8000`.

## Consejos

- Pocos recuerdos muy buenos > muchos regulares. 4 acertijos es el punto ideal.
- Pruébala completa en tu celular antes del día, con el brillo al máximo.
- Si pones su canción (`wrapped.cancion.audio`), empieza a sonar al abrir el sobre.
