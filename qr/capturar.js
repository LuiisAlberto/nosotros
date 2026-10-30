/* Pasa las tarjetas de qr/*.html a PNG (1080×1350 a doble resolución).
   Uso: node qr/capturar.js
   Si Google Fonts no carga (sin internet o detrás de un proxy), FUENTES=<carpeta> sirve
   las fuentes desde una copia local: local.css + los .woff2 que menciona. */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const TARJETAS = ["boleto", "contra", "polaroid"];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
  const local = process.env.FUENTES;
  if (local) {
    await p.route("https://fonts.googleapis.com/**", r => r.fulfill({ contentType: "text/css", body: fs.readFileSync(path.join(local, "local.css"), "utf8").replace(/url\((f\d+\.woff2)\)/g, "url(https://fonts.gstatic.com/local/$1)") }));
    await p.route("https://fonts.gstatic.com/**", r => r.fulfill({ contentType: "font/woff2", body: fs.readFileSync(path.join(local, path.basename(new URL(r.request().url()).pathname))) }));
  }
  for (const t of TARJETAS) {
    await p.goto("file://" + path.resolve(__dirname, `tarjeta-${t}.html`));
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    await p.locator(".t").screenshot({ path: path.resolve(__dirname, `tarjeta-${t}.png`) });
    console.log("listo", t);
  }
  await b.close();
})();
