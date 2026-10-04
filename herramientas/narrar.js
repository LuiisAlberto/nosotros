/* Genera la narración con ElevenLabs: un mp3 por línea + tiempos por palabra.
   Uso: ELEVENLABS_API_KEY=… node herramientas/narrar.js [prefijo de clave, p. ej. "0-"]
   Salta las líneas que ya tienen mp3 (para no gastar créditos dos veces). */
const fs = require("fs");
const path = require("path");
const VOZ = "iP95p4xoKVk53GoZ742B"; /* Chris, la que eligió Luis */
const AJUSTES = { model_id: "eleven_multilingual_v2", language_code: "es", voice_settings: { stability: 0.5, similarity_boost: 0.75 } };
const dir = path.resolve(__dirname, "../audio");
const lineas = require("./lineas.json");
const filtro = process.argv[2] || "";
const archTiempos = path.join(dir, "tiempos.json");
fs.mkdirSync(dir, { recursive: true });
const tiempos = fs.existsSync(archTiempos) ? JSON.parse(fs.readFileSync(archTiempos)) : {};
const texto = l => l.palabras.filter(Boolean).join(" ");
const r2 = x => Math.round(x * 100) / 100;

(async () => {
  for (const [i, l] of lineas.entries()) {
    if (!l.clave.startsWith(filtro)) continue;
    const mp3 = path.join(dir, l.clave + ".mp3");
    if (fs.existsSync(mp3) && tiempos[l.clave]) continue;
    const txt = texto(l);
    const vecina = j => lineas[j] && lineas[j].track === l.track ? texto(lineas[j]) : undefined;
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOZ}/with-timestamps?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ text: txt, previous_text: vecina(i - 1), next_text: vecina(i + 1), ...AJUSTES })
    });
    if (!r.ok) { console.error(l.clave, r.status, (await r.text()).slice(0, 300)); process.exit(1); }
    const d = await r.json();
    const al = d.alignment;
    /* de tiempos por carácter a [inicio, fin] por palabra (en segundos) */
    let c = 0;
    const tw = l.palabras.map(p => {
      if (!p) { const t = c ? al.character_end_times_seconds[c - 1] : 0; return [r2(t), r2(t)]; }
      const ini = al.character_start_times_seconds[c], fin = al.character_end_times_seconds[c + p.length - 1];
      c += p.length + 1;
      return [r2(ini), r2(fin)];
    });
    fs.writeFileSync(mp3, Buffer.from(d.audio_base64, "base64"));
    tiempos[l.clave] = tw;
    fs.writeFileSync(archTiempos, JSON.stringify(tiempos));
    console.log(l.clave, txt.length, "car.", tw[tw.length - 1][1] + "s");
  }
})();
