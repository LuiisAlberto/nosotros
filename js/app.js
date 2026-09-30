(() => {
  "use strict";

  const D = window.DATOS;
  const CAPITULOS = ["carta", "acertijos", "wrapped", "cielo"];
  const ROMANOS = ["I", "II", "III", "IV"];
  const $ = (id) => document.getElementById(id);
  const calmado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esperar = (ms) => new Promise((r) => setTimeout(r, calmado ? 0 : ms));

  const el = (tag, { dataset, ...props } = {}, hijos = []) => {
    const n = Object.assign(document.createElement(tag), props);
    Object.assign(n.dataset, dataset);
    for (const h of [].concat(hijos)) n.append(h);
    return n;
  };

  const ICONO_FOTO =
    '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/></svg>';
  const ICONO_ESTRELLA =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.9L22 9.3l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.9L2 9.3l7.1-.4z"/></svg>';

  /* ── Progreso (solo modo QR) ─────────────────────────────── */
  const CLAVE = "nuestra-historia-progreso";
  const leer = () => {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || { desbloqueado: -1, completado: -1 }; }
    catch { return { desbloqueado: -1, completado: -1 }; }
  };
  const guardar = (p) => { try { localStorage.setItem(CLAVE, JSON.stringify(p)); } catch {} };

  const params = new URLSearchParams(location.search);
  const modoQR = D.modo === "qr";
  let progreso = modoQR ? leer() : { desbloqueado: CAPITULOS.length - 1, completado: -1 };

  if (params.has("reiniciar")) {
    progreso = { desbloqueado: modoQR ? -1 : CAPITULOS.length - 1, completado: -1 };
    guardar(progreso);
  }
  const llave = (params.get("llave") || "").trim().toLowerCase();
  if (modoQR && llave) {
    const i = CAPITULOS.findIndex((c) => (D.llaves[c] || "").toLowerCase() === llave);
    if (i > progreso.desbloqueado) progreso.desbloqueado = i;
    guardar(progreso);
  }
  // Limpia la URL para que no se vea la llave
  if (params.has("llave") || params.has("reiniciar")) history.replaceState(null, "", location.pathname);

  /* ── Navegación ──────────────────────────────────────────── */
  let actual = null;

  async function mostrar(id) {
    if (actual) {
      actual.classList.add("saliendo");
      await esperar(450);
      actual.hidden = true;
      actual.classList.remove("saliendo");
    }
    actual = $(id);
    actual.hidden = false;
    window.scrollTo(0, 0);
    INICIOS[id]?.();
  }

  function terminar(i) {
    progreso.completado = Math.max(progreso.completado, i);
    guardar(progreso);
    irA(i + 1);
  }

  function irA(i) {
    if (i >= CAPITULOS.length) return;
    if (i <= progreso.desbloqueado) return mostrar(CAPITULOS[i]);
    $("bloqueo-capitulo").textContent = `Capítulo ${ROMANOS[i]}`;
    $("bloqueo-pista").textContent =
      (D.pistasQR && D.pistasQR[CAPITULOS[i]]) ||
      (i === 0 ? "Busca el primer código y escanéalo con tu cámara." : "Busca el siguiente código.");
    mostrar("bloqueo");
  }

  /* ── Capítulo I: la carta ────────────────────────────────── */
  function iniciarCarta() {
    $("sobre-nombre").textContent = D.nombre;
    $("carta-saludo").textContent = D.carta.saludo;
    $("carta-cuerpo").replaceChildren(
      ...D.carta.parrafos.map((t, i) => el("p", { textContent: t, style: `animation-delay:${0.8 + i * 0.9}s` }))
    );
    $("carta-firma").replaceChildren(D.carta.firma, el("strong", { textContent: D.tuNombre }));
    $("carta-siguiente").textContent = D.carta.boton;

    $("sobre-abrir").onclick = async () => {
      $("sobre").classList.add("abierto");
      $("sobre-ayuda").hidden = true;
      $("sobre-abrir").disabled = true;
      reproducirCancion();
      await esperar(900);
      $("sobre").hidden = true;
      $("carta-papel").hidden = false;
    };
    $("carta-siguiente").onclick = () => terminar(0);
  }

  /* ── Capítulo II: acertijos ──────────────────────────────── */
  function iniciarAcertijos() {
    const lista = D.acertijos;
    let n = 0;
    $("acertijo-progreso").replaceChildren(...lista.map(() => el("li")));

    const pintar = () => {
      const a = lista[n];
      [...$("acertijo-progreso").children].forEach((li, i) => li.classList.toggle("hecho", i < n));
      $("acertijo-numero").textContent = `Acertijo ${n + 1} de ${lista.length}`;
      $("acertijo-pregunta").textContent = a.pregunta;
      $("acertijo-pista").hidden = true;
      $("acertijo-tarjeta").hidden = false;
      $("recuerdo").hidden = true;
      $("acertijo-opciones").replaceChildren(
        ...a.opciones.map((texto, i) => {
          const b = el("button", { className: "opcion", textContent: texto, type: "button" });
          b.onclick = () => responder(b, i);
          return b;
        })
      );
    };

    const responder = async (boton, i) => {
      const a = lista[n];
      if (i !== a.correcta) {
        boton.classList.remove("mal");
        void boton.offsetWidth; // reinicia la animación
        boton.classList.add("mal");
        if (a.pista) {
          $("acertijo-pista").textContent = `Pista: ${a.pista}`;
          $("acertijo-pista").hidden = false;
        }
        return;
      }
      boton.classList.add("bien");
      $("acertijo-progreso").children[n].classList.add("hecho");
      $("acertijo-opciones").querySelectorAll("button").forEach((b) => (b.disabled = true));
      await esperar(700);
      mostrarRecuerdo(a.recuerdo);
    };

    const mostrarRecuerdo = (r) => {
      $("acertijo-tarjeta").hidden = true;
      $("recuerdo-fecha").textContent = r.fecha;
      $("recuerdo-lugar").textContent = r.lugar;
      $("recuerdo-titulo").textContent = r.titulo;
      $("recuerdo-texto").textContent = r.texto;
      $("recuerdo-foto").replaceChildren(foto(r.foto, r.titulo));
      $("recuerdo-siguiente").textContent = n < lista.length - 1 ? "Siguiente acertijo" : "Continuar";
      const fig = $("recuerdo");
      fig.hidden = true;
      void fig.offsetWidth;
      fig.hidden = false;
      window.scrollTo(0, 0);
    };

    $("recuerdo-siguiente").onclick = () => {
      if (++n < lista.length) pintar();
      else terminar(1);
    };
    pintar();
  }

  function foto(ruta, alt) {
    const vacio = () => {
      const d = el("div", { className: "sin-foto" });
      d.innerHTML = `${ICONO_FOTO}<span>Aquí va su foto<br><small>${ruta || "fotos/…"}</small></span>`;
      return d;
    };
    if (!ruta) return vacio();
    const img = el("img", { src: ruta, alt, decoding: "async" });
    img.onerror = () => img.replaceWith(vacio());
    return img;
  }

  /* ── Capítulo III: wrapped ───────────────────────────────── */
  function iniciarWrapped() {
    const w = D.wrapped;
    const inicio = new Date(w.fechaInicio + "T00:00:00");
    const dias = Math.max(0, Math.floor((Date.now() - inicio) / 864e5));
    const fmt = (x) => x.toLocaleString("es-MX");
    const anio = new Date().getFullYear();

    const historias = [
      [
        el("p", { className: "w-pre", textContent: "Nuestro" }),
        el("p", { className: "w-grande", textContent: "Wrapped" }),
        el("p", { className: "w-texto", textContent: `${D.nombre} & ${D.tuNombre} · edición ${anio}` }),
      ],
      [
        el("p", { className: "w-pre", textContent: "Llevamos juntos" }),
        el("p", { className: "w-grande", textContent: "0", dataset: { contar: dias } }),
        el("p", { className: "w-texto", textContent: `días. Todo empezó en ${w.ciudad}.` }),
      ],
      [
        el("p", { className: "w-pre", textContent: "Eso es aproximadamente" }),
        el("p", { className: "w-grande", textContent: "0", dataset: { contar: dias * 24 } }),
        el("p", { className: "w-texto", textContent: "horas pensando en ti (redondeando hacia abajo)." }),
      ],
      [
        el("p", { className: "w-pre", textContent: "Nuestra canción" }),
        el("div", { className: "disco", ariaHidden: "true" }),
        el("p", { className: "w-medio", textContent: w.cancion.titulo }),
        el("p", { className: "w-texto", textContent: w.cancion.artista }),
      ],
      [
        el("p", { className: "w-pre", textContent: w.emojiTexto }),
        el("p", { className: "w-emoji", textContent: w.emoji }),
      ],
      [
        el("p", { className: "w-pre", textContent: "En números" }),
        el("ul", { className: "w-lista" },
          w.datos.map((d) => el("li", {}, [el("b", { textContent: d.valor }), el("span", { textContent: d.texto })]))),
      ],
      [
        el("p", { className: "w-medio", textContent: "Pero todavía falta lo más importante…" }),
        el("button", { className: "boton", textContent: "Mirar al cielo", type: "button", onclick: () => { parar(); terminar(2); } }),
      ],
    ];

    const cont = $("wrapped-historias");
    const barras = $("wrapped-barras");
    cont.replaceChildren(...historias.map((h, i) => el("div", { className: `historia fondo-${(i % 6) + 1}` }, h)));
    barras.replaceChildren(...historias.map(() => el("span", {}, el("i"))));

    const DURACION = 6500;
    let i = 0;
    let temporizador;
    const parar = () => clearTimeout(temporizador);

    const ir = (k) => {
      i = Math.max(0, Math.min(historias.length - 1, k));
      [...cont.children].forEach((h, j) => h.classList.toggle("activa", j === i));
      [...barras.children].forEach((b, j) => {
        b.classList.toggle("hecho", j < i);
        b.classList.remove("activa");
        if (j === i) { void b.offsetWidth; b.classList.add("activa"); }
      });
      barras.style.setProperty("--duracion", `${DURACION}ms`);
      cont.children[i].querySelectorAll("[data-contar]").forEach(contar);
      const ultima = i === historias.length - 1;
      $("wrapped-adelante").hidden = ultima;
      $("wrapped-atras").style.width = ultima ? "0" : "";
      parar();
      if (!ultima) temporizador = setTimeout(() => ir(i + 1), DURACION);
    };

    $("wrapped-adelante").onclick = () => ir(i + 1);
    $("wrapped-atras").onclick = () => ir(i - 1);
    ir(0);
  }

  function contar(nodo) {
    const meta = Number(nodo.dataset.contar);
    if (calmado) { nodo.textContent = meta.toLocaleString("es-MX"); return; }
    const t0 = performance.now();
    const paso = (t) => {
      const p = Math.min(1, (t - t0) / 1800);
      nodo.textContent = Math.round(meta * (1 - Math.pow(1 - p, 3))).toLocaleString("es-MX");
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  /* ── Capítulo IV: el cielo ───────────────────────────────── */
  function iniciarCielo() {
    const c = D.cielo;
    $("cielo-intro").textContent = c.intro;
    $("cielo-frase").replaceChildren();
    const zona = $("cielo-estrellas");
    const posiciones = colocar(c.palabras.length);
    let reveladas = 0;

    zona.replaceChildren(
      ...c.palabras.map((palabra, i) => {
        const b = el("button", {
          className: "estrella",
          type: "button",
          ariaLabel: `Estrella ${i + 1}`,
          style: `left:${posiciones[i][0]}%;top:${posiciones[i][1]}%`,
        });
        b.innerHTML = ICONO_ESTRELLA;
        b.onclick = () => {
          b.classList.add("tocada");
          b.disabled = true;
          // Siempre en orden, sin importar qué estrella toque
          $("cielo-frase").append(el("span", { textContent: c.palabras[reveladas] }));
          if (++reveladas === c.palabras.length) setTimeout(mostrarFinal, calmado ? 0 : 1800);
        };
        return b;
      })
    );
  }

  function colocar(n) {
    // Reparte las estrellas en una cuadrícula con algo de azar para que no se encimen
    const cols = n <= 4 ? 2 : 3;
    const filas = Math.ceil(n / cols);
    const lugares = [];
    for (let k = 0; k < n; k++) {
      const col = k % cols, fila = Math.floor(k / cols);
      lugares.push([
        ((col + 0.5) / cols) * 80 + 10 + (Math.random() - 0.5) * 14,
        ((fila + 0.5) / filas) * 80 + 10 + (Math.random() - 0.5) * 12,
      ]);
    }
    return lugares.sort(() => Math.random() - 0.5);
  }

  function mostrarFinal() {
    const c = D.cielo;
    const pregunta = $("final-pregunta");
    const botones = $("final-botones");
    $("final").hidden = false;

    if (D.final === "mirame") {
      pregunta.textContent = "Mírame";
      pregunta.classList.add("mirame");
      botones.replaceChildren();
      return;
    }

    pregunta.textContent = c.palabras.join(" ");
    const si = () => {
      botones.hidden = true;
      $("final-mensaje").textContent = c.mensajeFinal;
      $("final-mensaje").hidden = false;
      celebrar();
    };
    // Dos botones... y los dos dicen que sí
    botones.replaceChildren(
      el("button", { className: "boton", type: "button", textContent: c.botonSi, onclick: si }),
      el("button", { className: "boton", type: "button", textContent: `¡${c.botonSi}!`, onclick: si })
    );
  }

  /* ── Música ──────────────────────────────────────────────── */
  function reproducirCancion() {
    const src = D.wrapped.cancion.audio;
    if (!src) return;
    const a = $("audio");
    a.src = src;
    a.volume = 0.6;
    a.loop = true;
    a.play().catch(() => {});
  }

  /* ── Fondo de estrellas ──────────────────────────────────── */
  function fondo() {
    const cv = $("estrellas-fondo");
    const ctx = cv.getContext("2d");
    let estrellas = [];
    const medir = () => {
      const r = devicePixelRatio || 1;
      cv.width = innerWidth * r;
      cv.height = innerHeight * r;
      ctx.setTransform(r, 0, 0, r, 0, 0);
      const n = Math.round((innerWidth * innerHeight) / 5000);
      estrellas = Array.from({ length: n }, () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: Math.random() * 1.3 + 0.2,
        f: Math.random() * Math.PI * 2,
        v: Math.random() * 0.002 + 0.0006,
      }));
    };
    const dibujar = (t) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const s of estrellas) {
        ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(s.f + t * s.v));
        ctx.fillStyle = "#fff8e7";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!calmado) requestAnimationFrame(dibujar);
    };
    medir();
    addEventListener("resize", medir);
    requestAnimationFrame(dibujar);
  }

  /* ── Celebración ─────────────────────────────────────────── */
  function celebrar() {
    const cv = $("celebracion");
    const ctx = cv.getContext("2d");
    const r = devicePixelRatio || 1;
    cv.width = innerWidth * r;
    cv.height = innerHeight * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
    if (calmado) return;

    const colores = ["#e8c27a", "#f3d596", "#f2a7b5", "#ffffff", "#d9546b"];
    const piezas = Array.from({ length: 160 }, () => ({
      x: innerWidth / 2,
      y: innerHeight * 0.45,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 14 - 4,
      t: Math.random() * 10 + 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      c: colores[(Math.random() * colores.length) | 0],
      corazon: Math.random() < 0.35,
    }));

    const corazon = (s) => {
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.4, -s * 0.4, -s, 0, -s * 0.4);
      ctx.bezierCurveTo(s * 0.4, -s, s, -s * 0.4, 0, s * 0.3);
      ctx.fill();
    };

    const t0 = performance.now();
    const paso = (t) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of piezas) {
        p.vy += 0.28;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        if (p.corazon) corazon(p.t);
        else ctx.fillRect(-p.t / 2, -p.t / 4, p.t, p.t / 2);
        ctx.restore();
      }
      if (t - t0 < 6000) requestAnimationFrame(paso);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    };
    requestAnimationFrame(paso);
    setTimeout(() => (piezas.forEach((p) => { p.x = Math.random() * innerWidth; p.y = -20; p.vy = Math.random() * 2; p.vx = (Math.random() - 0.5) * 3; })), 2200);
  }

  /* ── Arranque ────────────────────────────────────────────── */
  const INICIOS = { carta: iniciarCarta, acertijos: iniciarAcertijos, wrapped: iniciarWrapped, cielo: iniciarCielo };

  document.title = `Para ${D.nombre}`;
  fondo();

  // ?capitulo=cielo → salta directo (útil para probar)
  const salto = CAPITULOS.indexOf(params.get("capitulo"));
  if (salto >= 0 && !modoQR) mostrar(CAPITULOS[salto]);
  else irA(progreso.completado + 1);
})();
