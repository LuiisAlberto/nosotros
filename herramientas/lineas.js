/* Saca de index.html el texto de cada línea, tal como la narración lo dice.
   Uso: node herramientas/lineas.js > herramientas/lineas.json */
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto("file://" + path.resolve(__dirname, "../index.html"));
  const lineas = await p.evaluate(() => {
    const out = [];
    TRACKS.forEach((t, k) => vistas[k + 1].el.querySelectorAll("[data-letra] .ly:not(.blk)").forEach(ly => {
      const palabras = ly._w.map(w => decir(w.textContent));
      out.push({ clave: k + "-" + ly.dataset.n, track: t.titulo, palabras });
    }));
    return out;
  });
  console.log(JSON.stringify(lineas, null, 1));
  await b.close();
})();
