# Nosotros

Libro digital por capítulos: la historia de Edith y Luis, que termina con una pregunta.

- `index.html`: todo el libro (textos editables en el arreglo `CAPITULOS`).
- `fotos/`: fotos opcionales por capítulo (ver `fotos/LEEME.md`).

Para verlo: abre `index.html` en el navegador o publícalo con GitHub Pages (Settings → Pages → rama → `/root`).

## Código QR

- `qr/tarjeta.png`: tarjeta lista para imprimir (1080×1350, a doble resolución).
- `qr/qr.png` y `qr/qr.svg`: solo el código.
- Apunta a `https://luiisalberto.github.io/nosotros/` (GitHub Pages). Para otro enlace:
  `python3 qr/generar.py "https://tu-enlace"` (requiere `pip install segno`) y vuelve a tomar la imagen de `qr/tarjeta.html`.
