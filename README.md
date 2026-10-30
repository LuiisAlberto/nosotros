# Nosotros

Libro digital por capítulos: la historia de Edith y Luis, que termina con una pregunta.

- `index.html`: todo el libro (textos editables en el arreglo `CAPITULOS`).
- `fotos/`: fotos opcionales por capítulo (ver `fotos/LEEME.md`).

Para verlo: abre `index.html` en el navegador o publícalo con GitHub Pages (Settings → Pages → rama → `/root`).

## Código QR

- `qr/tarjeta-boleto.png`, `qr/tarjeta-contra.png` y `qr/tarjeta-polaroid.png`: tres tarjetas listas para imprimir
  o mandar (1080×1350, a doble resolución): boleto de concierto, contraportada del disco y polaroid de la portada.
- `qr/qr.svg`: solo el código, en tinta con un corazón al centro.
- Para regenerarlas con otro enlace: `python3 qr/generar.py "https://tu-enlace"` (requiere `pip install segno`)
  y luego `node qr/capturar.js` (Playwright) para pasarlas a PNG.

## Para que vuelva

- **Lado B**: canciones con fecha (`desde`) que se abren solas ese día. Para agregar otra, copia una entrada `tipo: "ladob"` en `index.html`.
- **App**: `manifest.webmanifest`, `sw.js` e íconos para agregarlo a la pantalla de inicio.
