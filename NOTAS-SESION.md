# Notas para continuar «Nosotros»

Sitio: https://luiisalberto.github.io/nosotros/ (GitHub Pages desde la rama `ccr-73ad139d-amf649`, carpeta raíz).
Todo el sitio vive en `index.html` (una sola página). Se lo entrega a Edith el **5 de octubre de 2026**.

## Qué es
Un "disco" estilo Spotify con la historia de Edith y Luis. Portada de álbum, lista de canciones (cada capítulo
es una canción), y dentro de cada canción la historia aparece línea por línea como letra sincronizada, con
recuerdos interactivos pegados como álbum de fotos. Termina en la «Pista oculta» con la pregunta
«¿Quieres ser mi novia? (otra vez)» en una servilleta, y el «Final (feat. Edith)».

## Dónde está cada cosa en `index.html`
- `CAPITULOS`: textos de las 10 canciones (escenas → líneas), preguntas (`quiz`) y canciones de Spotify.
- `TRACKS`: Intro + capítulos + «Hagamos cuentas» + «Pista oculta» + «Final (feat. Edith)» + Lado B
  (`tipo: "ladob"`, se abren solos en su fecha `desde`).
- `VALES`, `PREMIO_MAYOR`, `TELEFONO` (WhatsApp de Luis: 525648113759), `RAZONES` (razón del día), `PAPELITOS`.
- Reproductor: `irTrack`, `irLinea`, `siguienteLinea`, `bucle`, `reproducir`, `pausar`.
- Palabras que se iluminan: cada línea se parte en `<span class="w">` (`envolverPalabras`); `pintarLuz` las prende.
- Narración actual: voz del celular (`speechSynthesis`) con `hablar()`/`callar()`/`fallaVoz()`; botón «Narración»
  apagado por defecto (`mem` clave `narracion`). A Luis **no le gustó** cómo suena; tampoco las voces de Edge TTS.

## Narración con ElevenLabs (lista)
Luis creó cuenta (plan gratis, 10,000 créditos) y guardó la clave en el entorno como `ELEVENLABS_API_KEY`;
`api.elevenlabs.io` ya está en dominios permitidos. **Nunca imprimir ni subir la clave.**

- Plan gratis **no** deja usar voces de la biblioteca (las mexicanas) ni diseñar voces por API. Se probaron
  voces premade leyendo español; Luis eligió **Chris** (`iP95p4xoKVk53GoZ742B`, `eleven_multilingual_v2`).
- `herramientas/lineas.js` (Playwright) saca de `index.html` el texto de cada línea → `herramientas/lineas.json`
  (132 líneas, ~7,670 caracteres). Si cambia un texto, volver a correrlo y borrar ese mp3.
- `herramientas/narrar.js [prefijo]` genera `audio/<track>-<linea>.mp3` y `audio/tiempos.json`
  ([inicio, fin] en segundos por palabra). Salta lo que ya existe.
- **Hecho:** las 132 líneas (todas las canciones). Créditos usados: 8,352 / 10,000 (quedan ~1,650 para retoques).
- **Falta:** probar en el celular de verdad. La narración viene encendida por defecto (clave `narracion2` en `mem`).
- Reproductor: si hay `TIEMPOS[clave]` la línea usa `hablarGrabado()` (un solo `<audio>` reutilizado,
  palabras se prenden según `tiempos.json`); si no, cae a `speechSynthesis`. `sw.js` va en `nosotros-v9`
  y ya no guarda respuestas 206.
- Publicado en `ccr-73ad139d-amf649` (trabajado en `claude/elevenlab-voice-samples-mx-6b5ve5`).

## Otros pendientes
- **Fotos**: Luis las va a mandar. Van en `fotos/portada.jpg` y `fotos/cap-01.jpg` … `cap-10.jpg`
  (ver `fotos/LEEME.md`); el sitio las usa solas si existen.
- Premio mayor: el texto actual promete «una sorpresa que ya tengo preparada».
- Concierto de Little Jesus en Explanada: Luis dice 28 feb 2024; fuentes dicen 2025. En el sitio va sin año.

## Cómo publicar
Commit y push a `ccr-73ad139d-amf649`; GitHub Pages se actualiza en 1–2 minutos.
Para la vista previa en Claude se publica una copia sin `<!doctype>/<html>/<head>/<body>` ni los `<link>` del manifest.
