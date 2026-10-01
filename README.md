# Nosotros

Libro digital por capítulos: la historia de Edith y Luis, que termina con una pregunta.

- `index.html`: todo el libro (textos editables en el arreglo `CAPITULOS`).
- `fotos/`: fotos opcionales por capítulo (ver `fotos/LEEME.md`).

Para verlo: abre `index.html` en el navegador o publícalo con GitHub Pages (Settings → Pages → rama → `/root`).

## Código QR

- `qr/tarjeta-disco.png` y `qr/tarjeta-papel.png`: dos tarjetas listas para imprimir (1080×1350, a doble resolución).
- `qr/qr.png` / `qr/qr.svg` (play al centro) y `qr/qr-papel.svg` (corazón): solo el código.
- Apuntan a `https://luiisalberto.github.io/nosotros/` (GitHub Pages). Para otro enlace:
  `python3 qr/generar.py "https://tu-enlace"` (requiere `pip install segno`) y vuelve a tomar captura de las tarjetas HTML.

## Para que vuelva

- **Hoy** (portada): una razón distinta cada día (`RAZONES`), el contador y lo que falta para lo próximo; los días 13 tienen mensaje especial.
- **Lado B**: canciones con fecha (`desde`) que se abren solas ese día. Para agregar otra, copia una entrada `tipo: "ladob"` en `index.html`.
- **App**: `manifest.webmanifest`, `sw.js` e íconos para agregarlo a la pantalla de inicio.
