(() => {
  "use strict";

  const D = window.DATOS;
  const CAPITULOS = ["carta", "acertijos", "wrapped", "cielo"];
  const ROMANOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const CAP_BASE = {
    carta: { titulo: "La carta", sub: "Donde empieza todo" },
    acertijos: { titulo: "Los acertijos", sub: "Veamos cuánto recuerdas" },
    wrapped: { titulo: "Nuestro Wrapped", sub: "Lo nuestro, en números" },
    cielo: { titulo: "El cielo", sub: "Mira hacia arriba" },
  };
  const EASE = {
    salida: "cubic-bezier(0.23, 1, 0.32, 1)",
    vaiven: "cubic-bezier(0.77, 0, 0.175, 1)",
    cajon: "cubic-bezier(0.32, 0.72, 0, 1)",
    resorte: "cubic-bezier(0.34, 1.36, 0.64, 1)",
    entrada: "cubic-bezier(0.55, 0, 1, 0.45)",
  };
  const NS = "http://www.w3.org/2000/svg";

  const $ = (id) => document.getElementById(id);
  const calmado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ── Utilidades ──────────────────────────────────────────── */
  function el(tag, { dataset, ...props } = {}, hijos = []) {
    const n = Object.assign(document.createElement(tag), props);
    Object.assign(n.dataset, dataset);
    for (const h of [].concat(hijos)) if (h != null) n.append(h);
    return n;
  }

  function icono(id, clase = "i") {
    const s = document.createElementNS(NS, "svg");
    s.setAttribute("class", clase);
    s.setAttribute("aria-hidden", "true");
    const u = document.createElementNS(NS, "use");
    u.setAttribute("href", `#${id}`);
    s.append(u);
    return s;
  }

  // "Hola *mundo*" → Hola <em>mundo</em>
  function enfasis(texto) {
    const f = document.createDocumentFragment();
    String(texto).split(/\*(.+?)\*/g).forEach((parte, i) => {
      if (parte) f.append(i % 2 ? el("em", { textContent: parte }) : document.createTextNode(parte));
    });
    return f;
  }
  const sinEnfasis = (t) => String(t).replace(/\*/g, "");
  const escapar = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const fechaLocal = (iso) => new Date(`${iso}T00:00:00`);
  const vibrar = (patron) => { try { navigator.vibrate?.(patron); } catch {} };

  // Destello radial precalculado (mucho más barato que dibujar sombras en cada cuadro)
  const halos = new Map();
  function halo(rgb) {
    if (halos.has(rgb)) return halos.get(rgb);
    const t = 64;
    const c = Object.assign(document.createElement("canvas"), { width: t, height: t });
    const g = c.getContext("2d");
    const r = g.createRadialGradient(t / 2, t / 2, 0, t / 2, t / 2, t / 2);
    r.addColorStop(0, `rgba(${rgb},1)`);
    r.addColorStop(0.16, `rgba(${rgb},.5)`);
    r.addColorStop(0.42, `rgba(${rgb},.1)`);
    r.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = r;
    g.fillRect(0, 0, t, t);
    halos.set(rgb, c);
    return c;
  }

  // Animación con Web Animations API. Con movimiento reducido: solo desvanecidos.
  function anim(nodo, cuadros, { dur = 700, ease = EASE.salida, delay = 0, fill = "both" } = {}) {
    if (!nodo) return Promise.resolve();
    if (calmado) {
      const conOpacidad = cuadros.some((c) => "opacity" in c);
      cuadros = conOpacidad ? cuadros.map((c) => ("opacity" in c ? { opacity: c.opacity } : {})) : cuadros;
      dur = conOpacidad ? Math.min(dur, 320) : 1;
      ease = "ease";
    }
    return nodo.animate(cuadros, { duration: dur, easing: ease, delay, fill }).finished.catch(() => {});
  }
  const entrar = (n, o = {}) =>
    anim(n, [
      { opacity: 0, transform: `translateY(${o.y ?? 16}px)`, filter: `blur(${o.blur ?? 6}px)` },
      { opacity: 1, transform: "none", filter: "blur(0px)" },
    ], { dur: o.dur ?? 900, delay: o.delay ?? 0, ease: o.ease ?? EASE.salida, fill: "backwards" });
  async function salir(n, o = {}) {
    await anim(n, [
      { opacity: 1, transform: "none", filter: "blur(0px)" },
      { opacity: 0, transform: `translateY(${o.y ?? -10}px)`, filter: "blur(6px)" },
    ], { dur: o.dur ?? 500, fill: "forwards" });
    n.hidden = true;
    n.getAnimations().forEach((a) => a.cancel());
  }

  /* ── Progreso (solo modo QR) ─────────────────────────────── */
  const CLAVE = "nuestra-historia-progreso";
  const vacio = () => ({ desbloqueado: -1, completado: -1 });
  const leer = () => { try { return JSON.parse(localStorage.getItem(CLAVE)) || vacio(); } catch { return vacio(); } };
  const guardar = (p) => { try { localStorage.setItem(CLAVE, JSON.stringify(p)); } catch {} };

  const params = new URLSearchParams(location.search);
  const modoQR = D.modo === "qr";
  let progreso = modoQR ? leer() : { desbloqueado: CAPITULOS.length - 1, completado: -1 };

  if (params.has("reiniciar")) {
    progreso = modoQR ? vacio() : progreso;
    guardar(vacio());
  }
  const llave = (params.get("llave") || "").trim().toLowerCase();
  if (modoQR && llave) {
    const i = CAPITULOS.findIndex((c) => (D.llaves?.[c] || "").toLowerCase() === llave);
    if (i > progreso.desbloqueado) progreso.desbloqueado = i;
    guardar(progreso);
  }
  if (params.has("llave") || params.has("reiniciar")) history.replaceState(null, "", location.pathname);

  /* ── Navegación entre escenas ────────────────────────────── */
  let actual = null;
  let ocupado = false;

  async function mostrar(id, capitulo) {
    if (ocupado) return;
    ocupado = true;
    if (actual) await salir(actual, { dur: 600 });
    if (id !== "acertijos") ambiente(null);
    if (capitulo != null) await intertitulo(capitulo);
    const escena = $(id);
    actual = escena;
    escena.hidden = false;
    window.scrollTo(0, 0);
    INICIOS[id]?.();
    entrar(escena, { dur: 1000, y: 18, blur: 8 });
    ocupado = false;
  }

  function irA(i) {
    if (i >= CAPITULOS.length) return;
    if (i > progreso.desbloqueado) return bloqueo(i);
    if (i === 0) return mostrar("portada");
    mostrar(CAPITULOS[i], i);
  }

  function terminar(i) {
    progreso.completado = Math.max(progreso.completado, i);
    if (modoQR) guardar(progreso);
    irA(i + 1);
  }

  function bloqueo(i) {
    $("bloqueo-capitulo").textContent = `Capítulo ${ROMANOS[i]}`;
    $("bloqueo-pista").textContent =
      D.pistasQR?.[CAPITULOS[i]] || (i === 0 ? "Busca el primer código." : "Busca el siguiente código.");
    mostrar("bloqueo");
  }

  function capitulo(i) {
    const c = CAPITULOS[i];
    return { ...CAP_BASE[c], ...(D.capitulos?.[c] || {}) };
  }

  function intertitulo(i) {
    const c = capitulo(i);
    const caja = $("intertitulo");
    $("inter-numero").textContent = `Capítulo ${ROMANOS[i]}`;
    $("inter-titulo").textContent = c.titulo;
    $("inter-sub").textContent = c.sub;
    caja.hidden = false;

    return new Promise((resolver) => {
      let listo = false;
      const cerrar = async () => {
        if (listo) return;
        listo = true;
        caja.onclick = null;
        await anim(caja, [{ opacity: 1 }, { opacity: 0 }], { dur: 700, fill: "forwards" });
        caja.hidden = true;
        caja.getAnimations().forEach((a) => a.cancel());
        resolver();
      };
      caja.onclick = cerrar;
      anim(caja, [{ opacity: 0 }, { opacity: 1 }], { dur: 700, fill: "backwards" });
      entrar($("inter-numero"), { delay: 250, y: 8, blur: 4 });
      anim($("inter-titulo"), [{ transform: "translateY(110%)" }, { transform: "none" }], { dur: 1300, delay: 400, ease: EASE.cajon, fill: "backwards" });
      anim($("inter-linea"), [{ transform: "scaleX(0)", opacity: 0 }, { transform: "scaleX(1)", opacity: 1 }], { dur: 1200, delay: 900, fill: "backwards" });
      entrar($("inter-sub"), { delay: 1150, y: 8 });
      setTimeout(cerrar, 3300);
    });
  }

  /* ── Portada ─────────────────────────────────────────────── */
  function iniciarPortada() {
    $("portada-nombre").textContent = D.nombre;
    $("portada-de").textContent = `De ${D.tuNombre}, con amor`;
    $("portada-sonido").hidden = !D.wrapped?.cancion?.audio;
    document.querySelectorAll("#portada [data-entrada]").forEach((n) => {
      const k = Number(n.dataset.entrada);
      if (n.id === "portada-nombre") {
        anim(n, [{ opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0 0% 0 0)" }], { dur: 2000, delay: 700, ease: EASE.vaiven, fill: "backwards" });
      } else {
        entrar(n, { delay: k < 2 ? 300 + k * 250 : 1600 + k * 220, dur: 1100 });
      }
    });
    $("portada-comenzar").onclick = () => {
      reproducirCancion();
      pantallaCompleta();
      mostrar("carta", 0);
    };
  }

  /* ── Capítulo I: la carta ────────────────────────────────── */
  function selloSVG(iniciales) {
    // Contorno irregular de cera, siempre igual
    const n = 22, pts = [];
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2;
      const r = 46 + Math.sin(k * 2.7) * 1.9 + Math.cos(k * 1.3) * 1.6;
      pts.push([50 + r * Math.cos(a), 50 + r * Math.sin(a)]);
    }
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const f = (p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
    let d = `M${f(mid(pts[0], pts[1]))}`;
    for (let k = 1; k <= n; k++) d += `Q${f(pts[k % n])} ${f(mid(pts[k % n], pts[(k + 1) % n]))}`;
    const ini = escapar(iniciales || "");
    const t = ini.replace(/&amp;/g, "&").length <= 2 ? 25 : ini.length <= 7 ? 21 : 15;
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="${d}Z" fill="url(#g-cera)"/>
      <circle cx="50" cy="50" r="31" fill="url(#g-cera-centro)" stroke="#5c0c1d" stroke-opacity=".55" stroke-width="2.4"/>
      <circle cx="50" cy="50" r="26.5" fill="none" stroke="#ffc9d2" stroke-opacity=".22" stroke-width=".8"/>
      <text x="49.4" y="57.4" text-anchor="middle" font-family="Instrument Serif, serif" font-style="italic" font-size="${t}" fill="#ffc2cd" fill-opacity=".38">${ini}</text>
      <text x="50" y="58" text-anchor="middle" font-family="Instrument Serif, serif" font-style="italic" font-size="${t}" fill="#4d0816" fill-opacity=".8">${ini}</text>
    </svg>`;
  }

  function iniciarCarta() {
    const inicio = fechaLocal(D.wrapped.fechaInicio);
    const ayuda = (t) => { const a = $("sobre-ayuda"); a.textContent = t; a.style.visibility = t ? "" : "hidden"; };

    $("sobre-remitente").textContent = `De: ${D.tuNombre}`;
    $("sobre-nombre").textContent = D.nombre;
    $("estampilla-fecha").textContent = `${inicio.getDate()}·${ROMANOS[inicio.getMonth()]}·${String(inicio.getFullYear()).slice(2)}`;
    $("matasellos-texto").textContent = `${D.wrapped.ciudad} · ${inicio.getDate()} ${MESES[inicio.getMonth()]} ${inicio.getFullYear()} · `.toUpperCase();
    $("sobre-carta-para").textContent = D.nombre;
    document.querySelectorAll(".sello-mitad").forEach((m) => (m.innerHTML = selloSVG(D.iniciales)));

    $("hoja-monograma").textContent = D.iniciales || "";
    $("hoja-saludo").textContent = D.carta.saludo;
    $("hoja-cuerpo").replaceChildren(...D.carta.parrafos.map((t) => el("p", {}, enfasis(t))));
    $("hoja-despedida").textContent = D.carta.despedida || "";
    $("hoja-firma").textContent = D.tuNombre;
    $("carta-siguiente-texto").textContent = D.carta.boton;
    ayuda("Toca el sobre");

    const sobre = $("sobre");
    const flotar = $("sobre-flotar");
    let fase = 0;

    const voltear = async () => {
      if (fase !== 0) return;
      fase = 1;
      ayuda("");
      vibrar(10);
      flotar.classList.add("quieto");
      sobre.removeAttribute("role");
      sobre.removeAttribute("tabindex");
      sobre.removeAttribute("aria-label");
      sobre.style.cursor = "default";
      await anim(sobre, [
        { transform: "perspective(1400px) rotateY(0deg) scale(1)" },
        { transform: "perspective(1400px) rotateY(90deg) scale(1.06)" },
      ], { dur: 420, ease: EASE.entrada });
      $("sobre-anverso").hidden = true;
      $("sobre-reverso").hidden = false;
      await anim(sobre, [
        { transform: "perspective(1400px) rotateY(90deg) scale(1.06)" },
        { transform: "perspective(1400px) rotateY(180deg) scale(1)" },
      ], { dur: 700, ease: EASE.salida });
      sobre.classList.add("plano");
      sobre.getAnimations().forEach((a) => a.cancel());
      flotar.classList.remove("quieto");
      ayuda("Rompe el sello");
      $("sello").focus({ preventScroll: true });
    };

    const abrir = async (e) => {
      e.stopPropagation();
      if (fase !== 1) return;
      fase = 2;
      ayuda("");
      vibrar([8, 40, 16]);
      flotar.classList.add("quieto");
      const sello = $("sello");
      sello.classList.add("roto");
      sello.disabled = true;
      await esperar(calmado ? 0 : 320);

      const solapa = $("sobre-solapa");
      await anim(solapa, [{ transform: "perspective(900px) rotateX(0deg)" }, { transform: "perspective(900px) rotateX(90deg)" }], { dur: 380, ease: EASE.entrada });
      solapa.classList.add("volteada", "abierta");
      await anim(solapa, [{ transform: "perspective(900px) rotateX(90deg)" }, { transform: "perspective(900px) rotateX(180deg)" }], { dur: 560, ease: EASE.salida });
      sello.hidden = true;

      await anim($("sobre-carta"), [{ transform: "translateY(0)" }, { transform: "translateY(-56%)" }], { dur: 1200, delay: 120, ease: EASE.cajon });
      await esperar(calmado ? 200 : 650);
      await salir($("sobre-escena"), { y: 40, dur: 550 });
      leerCarta();
    };

    sobre.onclick = voltear;
    sobre.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); voltear(); } };
    $("sello").onclick = abrir;
  }

  function leerCarta() {
    const papel = $("carta-papel");
    papel.hidden = false;
    anim(papel.querySelector(".hoja"), [
      { opacity: 0, transform: "translateY(48px) scale(.97)", filter: "blur(10px)" },
      { opacity: 1, transform: "none", filter: "blur(0px)" },
    ], { dur: 1100, fill: "backwards" });
    $("hoja-saludo").focus({ preventScroll: true });

    const partes = [$("hoja-monograma"), $("hoja-saludo"), ...$("hoja-cuerpo").children, $("hoja-despedida")];
    partes.forEach((p, k) => entrar(p, { delay: 500 + k * 560, dur: 1100, y: 10, blur: 5 }));
    const tFirma = 500 + partes.length * 560 + 150;
    anim($("hoja-firma"), [
      { clipPath: "inset(0 100% 0 0)", opacity: 1 },
      { clipPath: "inset(0 0% 0 0)", opacity: 1 },
    ], { dur: 1700, delay: tFirma, ease: "cubic-bezier(.45,.05,.55,.95)", fill: "backwards" });
    entrar($("carta-siguiente"), { delay: tFirma + 1500 });
    $("carta-siguiente").onclick = () => terminar(0);
  }

  /* ── Capítulo II: acertijos ──────────────────────────────── */
  function iniciarAcertijos() {
    const lista = D.acertijos;
    const prog = $("acertijo-progreso");
    const pad = (k) => String(k).padStart(2, "0");
    let n = 0;
    prog.replaceChildren(...lista.map(() => el("li")));

    const pintar = (primera) => {
      const a = lista[n];
      $("acertijo-numero").textContent = `Acertijo ${pad(n + 1)} / ${pad(lista.length)}`;
      $("acertijo-pregunta").replaceChildren(enfasis(a.pregunta));
      $("acertijo-pista").hidden = true;
      const ops = $("acertijo-opciones");
      ops.classList.remove("resuelto");
      ops.replaceChildren(
        ...a.opciones.map((texto, i) => {
          const marca = icono("i-check", "i opcion-marca");
          marca.innerHTML = '<path d="M5 12.5l4.2 4.2L19 7" pathLength="1"/>';
          const b = el("button", { className: "opcion", type: "button" }, [
            el("span", { className: "opcion-num", textContent: `${ROMANOS[i]}.`, ariaHidden: "true" }),
            el("span", { className: "opcion-texto", textContent: texto }),
            marca,
          ]);
          b.onclick = () => responder(b, i);
          return b;
        })
      );
      [...prog.children].forEach((li, k) => li.classList.toggle("hecho", k < n));
      $("recuerdo").hidden = true;
      const bloque = $("acertijo");
      bloque.hidden = false;
      ambiente(null);
      if (!primera) {
        entrar(bloque, { dur: 900 });
        $("acertijo-pregunta").focus({ preventScroll: true });
      }
      [...ops.children].forEach((b, k) => entrar(b, { delay: 350 + k * 70, y: 10, blur: 3, dur: 800 }));
    };

    const responder = async (boton, i) => {
      const a = lista[n];
      if (i !== a.correcta) {
        boton.classList.remove("mal");
        void boton.offsetWidth; // reinicia la animación
        boton.classList.add("mal");
        vibrar(40);
        const pista = $("acertijo-pista");
        if (a.pista && pista.hidden) {
          pista.replaceChildren(icono("i-luz"), el("span", { textContent: a.pista }));
          pista.hidden = false;
          entrar(pista, { y: 8, dur: 800 });
        }
        return;
      }
      boton.classList.add("bien");
      const ops = $("acertijo-opciones");
      ops.classList.add("resuelto");
      ops.querySelectorAll("button").forEach((b) => (b.disabled = true));
      prog.children[n].classList.add("hecho");
      vibrar([14, 50, 24]);
      await esperar(1200);
      await salir($("acertijo"));
      mostrarRecuerdo(a.recuerdo);
    };

    const mostrarRecuerdo = (r) => {
      $("recuerdo-fecha").textContent = r.fecha;
      $("recuerdo-lugar").textContent = r.lugar;
      $("recuerdo-titulo").replaceChildren(enfasis(r.titulo));
      $("recuerdo-texto").textContent = r.texto;
      $("recuerdo-foto").replaceChildren(foto(r.foto, sinEnfasis(r.titulo)));
      $("recuerdo-siguiente-texto").textContent = n < lista.length - 1 ? "Siguiente acertijo" : "Continuar";
      ambiente(r.foto);
      const fig = $("recuerdo");
      fig.hidden = false;
      window.scrollTo(0, 0);
      anim($("polaroid"), [
        { opacity: 0, transform: "translateY(-70px) rotate(-10deg) scale(.9)" },
        { opacity: 1, transform: "rotate(-2.2deg)" },
      ], { dur: 1400, ease: EASE.resorte, fill: "backwards" });
      [$("recuerdo-lugar"), $("recuerdo-titulo"), $("recuerdo-texto"), $("recuerdo-siguiente")].forEach((p, k) =>
        entrar(p, { delay: 1000 + k * 180 })
      );
      $("recuerdo-titulo").focus({ preventScroll: true });
    };

    $("recuerdo-siguiente").onclick = async () => {
      if (n >= lista.length - 1) return terminar(1);
      n++;
      await salir($("recuerdo"));
      pintar(false);
    };
    pintar(true);
  }

  function foto(ruta, alt) {
    const vacia = () => {
      const d = el("div", { className: "sin-foto" }, [icono("i-camara"), el("span", { textContent: "Aquí va su foto" })]);
      d.append(el("small", { textContent: ruta || "fotos/…" }));
      return d;
    };
    if (!ruta) return vacia();
    const img = el("img", { alt, decoding: "async", className: "revelando" });
    img.onload = () => setTimeout(() => img.classList.add("revelada"), calmado ? 0 : 900);
    img.onerror = () => img.replaceWith(vacia());
    img.src = ruta;
    return img;
  }

  function ambiente(src) {
    const a = $("ambiente");
    if (!src) return a.classList.remove("visible");
    const img = new Image();
    img.onload = () => {
      a.style.backgroundImage = `url("${encodeURI(src)}")`;
      a.classList.add("visible");
    };
    img.src = src;
  }

  /* ── Capítulo III: Wrapped ───────────────────────────────── */
  let pararWrapped = () => {};

  function diferencia(desde, hasta) {
    let y = hasta.getFullYear() - desde.getFullYear();
    let m = hasta.getMonth() - desde.getMonth();
    let d = hasta.getDate() - desde.getDate();
    if (d < 0) { m--; d += new Date(hasta.getFullYear(), hasta.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    return { y, m, d, h: hasta.getHours(), mi: hasta.getMinutes(), s: hasta.getSeconds() };
  }

  function iniciarWrapped() {
    const w = D.wrapped;
    const inicio = fechaLocal(w.fechaInicio);
    const dias = Math.max(0, Math.floor((Date.now() - inicio) / 864e5));
    const largaFecha = inicio.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
    const anio = new Date().getFullYear();
    const eyebrow = (t) => el("p", { className: "w-eyebrow r", textContent: t });

    // Reloj en vivo
    const casillas = [["y", "Años"], ["m", "Meses"], ["d", "Días"], ["h", "Horas"], ["mi", "Min"], ["s", "Seg"]].map(([k, t]) => {
      const b = el("b");
      return { k, b, nodo: el("div", {}, el("span", {}, [b, el("small", { textContent: t })])) };
    });
    const tic = () => {
      const d = diferencia(inicio, new Date());
      casillas.forEach(({ k, b }) => (b.textContent = ["h", "mi", "s"].includes(k) ? String(d[k]).padStart(2, "0") : d[k]));
    };
    tic();

    // Lluvia de emoji
    const lluvia = el("div", { className: "emoji-lluvia", ariaHidden: "true" },
      Array.from({ length: 16 }, (_, k) =>
        el("span", {
          textContent: w.emoji,
          style: `left:${(k * 6.3 + (k % 3) * 7) % 96}%;--t:${18 + ((k * 7) % 22)}px;--d:${5 + (k % 5)}s;--r:${-(k * 0.61).toFixed(2)}s;--g:${k % 2 ? 24 : -18}deg`,
        })
      )
    );

    const funda = el("div", { className: "funda" + (w.cancion.portada ? " con-portada" : "") }, el("span", { textContent: D.iniciales || "" }));
    if (w.cancion.portada) funda.style.backgroundImage = `url("${encodeURI(w.cancion.portada)}")`;

    const H = [
      {
        tema: "h-ciruela",
        nodos: [
          el("div", { className: "forma anillos", innerHTML: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor"><circle cx="100" cy="100" r="96" stroke-width=".5"/><circle cx="100" cy="100" r="78" stroke-width=".6" stroke-dasharray="1.5 5"/><circle cx="100" cy="100" r="60" stroke-width=".5"/><circle cx="100" cy="100" r="42" stroke-width=".6" stroke-dasharray="1 4"/><circle cx="100" cy="4" r="2.4" fill="currentColor"/><circle cx="160" cy="100" r="1.8" fill="currentColor"/></svg>' }),
          el("p", { className: "pastilla r", textContent: `Edición ${anio}` }),
          el("div", { className: "w-centro r" }, el("h2", { className: "w-mega", style: "font-size:clamp(76px,22vw,118px)" }, ["Nuestro", el("em", { textContent: "Wrapped" })])),
          el("p", { className: "w-texto r", textContent: `Todo lo que hemos vivido, ${D.nombre}, en unas cuantas pantallas. Toca para avanzar.` }),
        ],
      },
      {
        tema: "h-champan", claro: true,
        nodos: [
          el("div", { className: "forma circulo-borde" }),
          eyebrow("Desde que nos conocimos"),
          el("div", { className: "w-centro r" }, [
            el("p", { className: "w-mega", textContent: "0", dataset: { contar: dias } }),
            el("p", { className: "w-titulo" }, el("em", { textContent: "días" })),
          ]),
          el("p", { className: "w-texto r", textContent: `Todo empezó el ${largaFecha}, en ${w.ciudad}.` }),
        ],
      },
      {
        tema: "h-rubor", claro: true, dur: 8500,
        nodos: [
          el("div", { className: "forma circulo-lleno" }),
          eyebrow("Para ser exactos"),
          el("div", { className: "w-centro r" }, [
            el("h2", { className: "w-titulo" }, enfasis("Y seguimos *contando*")),
            el("div", { className: "reloj" }, casillas.map((c) => c.nodo)),
          ]),
          el("p", { className: "w-texto r", textContent: "Cada segundo contigo cuenta." }),
        ],
      },
      {
        tema: "h-tinta",
        nodos: [
          eyebrow("Nuestra canción"),
          el("div", { className: "w-centro r" }, [
            el("div", { className: "disco-zona", ariaHidden: "true" }, [el("div", { className: "vinilo" }), funda]),
            el("h2", { className: "w-titulo", textContent: w.cancion.titulo }),
            el("div", { className: "cancion-fila" }, [
              el("span", { className: "ecualizador", ariaHidden: "true" }, [el("i"), el("i"), el("i"), el("i")]),
              el("span", { className: "w-texto", style: "opacity:1", textContent: w.cancion.artista }),
            ]),
          ]),
          el("p", { className: "w-texto r", textContent: w.cancion.pie || "La que siempre nos regresa a ese momento." }),
        ],
      },
      {
        tema: "h-marfil", claro: true,
        nodos: [
          lluvia,
          eyebrow(w.emojiTexto),
          el("div", { className: "w-centro r", style: "align-items:center" }, el("p", { className: "emoji-grande", textContent: w.emoji, role: "img", ariaLabel: w.emojiTexto })),
          el("p", { className: "w-titulo r", style: "font-size:clamp(34px,9vw,44px)" }, enfasis(w.emojiPie || "")),
        ],
      },
      {
        tema: "h-ciruela",
        nodos: [
          eyebrow("Nuestro top"),
          el("div", { className: "w-centro r" },
            el("ol", { className: "top" }, w.datos.map((d, k) =>
              el("li", {}, [
                el("span", { className: "top-n", textContent: k + 1 }),
                el("span", { className: "top-valor", textContent: d.valor }),
                el("span", { className: "top-texto", textContent: d.texto }),
              ])
            ))
          ),
          el("p", { className: "w-texto r", textContent: "Datos 100% verificados. Más o menos." }),
        ],
      },
      {
        tema: "h-tinta", dur: 0,
        nodos: [
          eyebrow("Y ahora"),
          el("div", { className: "w-centro r" }, el("h2", { className: "w-titulo", style: "font-size:clamp(48px,14vw,72px)" }, enfasis("Pero todavía falta *lo más importante.*"))),
          el("div", { className: "r" }, el("button", { className: "boton", type: "button", onclick: () => { pararWrapped(); terminar(2); } }, [
            el("span", { textContent: "Mirar al cielo" }),
            el("span", { className: "boton-icono" }, icono("i-chispa", "i i-lleno")),
          ])),
        ],
      },
    ];

    const marco = $("historias");
    const cont = $("wrapped-historias");
    const barras = $("wrapped-barras");
    cont.replaceChildren(...H.map((h) => el("div", { className: `historia ${h.tema}` }, h.nodos)));
    barras.replaceChildren(...H.map(() => el("span", {}, el("i"))));

    const DUR = 6500;
    let i = -1, temporizador = 0, restante = 0, marca = 0, pausado = false;

    const programar = (ms) => {
      clearTimeout(temporizador);
      restante = ms;
      marca = performance.now();
      temporizador = setTimeout(() => ir(i + 1), ms);
    };
    const pausar = () => {
      if (pausado || !(H[i].dur ?? DUR)) return;
      pausado = true;
      clearTimeout(temporizador);
      restante -= performance.now() - marca;
      marco.classList.add("pausa");
    };
    const reanudar = () => {
      if (!pausado) return;
      pausado = false;
      marco.classList.remove("pausa");
      programar(Math.max(400, restante));
    };
    const ir = (k) => {
      if (k < 0 || k >= H.length || k === i) return;
      i = k;
      pausado = false;
      marco.classList.remove("pausa");
      [...cont.children].forEach((h, j) => h.classList.toggle("activa", j === i));
      const dur = H[i].dur ?? DUR;
      [...barras.children].forEach((b, j) => {
        b.classList.toggle("hecho", j < i || (j === i && !dur));
        b.classList.remove("activa");
      });
      if (dur) {
        const b = barras.children[i];
        b.style.setProperty("--duracion", `${dur}ms`);
        void b.offsetWidth;
        b.classList.add("activa");
        programar(dur);
      } else clearTimeout(temporizador);
      marco.classList.toggle("claro", !!H[i].claro);
      cont.children[i].querySelectorAll("[data-contar]").forEach(contar);
      $("wrapped-adelante").hidden = i === H.length - 1;
    };

    // Toque corto = avanzar/retroceder · mantener presionado = pausa
    let presion = 0, largo = false;
    const bajar = () => {
      const id = ++presion;
      largo = false;
      setTimeout(() => { if (presion === id) { largo = true; pausar(); } }, 280);
    };
    const subir = () => { presion++; if (largo) reanudar(); };
    for (const z of [$("wrapped-adelante"), $("wrapped-atras")]) {
      z.onpointerdown = bajar;
      z.onpointerup = z.onpointercancel = z.onpointerleave = subir;
      z.oncontextmenu = (e) => e.preventDefault();
    }
    $("wrapped-adelante").onclick = () => { if (!largo) ir(i + 1); };
    $("wrapped-atras").onclick = () => { if (!largo) ir(i - 1); };

    const teclas = (e) => {
      if (e.key === "ArrowRight") ir(i + 1);
      if (e.key === "ArrowLeft") ir(i - 1);
    };
    const visibilidad = () => (document.hidden ? pausar() : reanudar());
    document.addEventListener("keydown", teclas);
    document.addEventListener("visibilitychange", visibilidad);
    const reloj = setInterval(tic, 1000);

    pararWrapped = () => {
      clearTimeout(temporizador);
      clearInterval(reloj);
      document.removeEventListener("keydown", teclas);
      document.removeEventListener("visibilitychange", visibilidad);
    };
    ir(0);
  }

  function contar(nodo) {
    const meta = Number(nodo.dataset.contar);
    const fmt = (x) => x.toLocaleString("es-MX");
    if (calmado) { nodo.textContent = fmt(meta); return; }
    const t0 = performance.now();
    const paso = (t) => {
      const p = Math.min(1, (t - t0 - 400) / 2200);
      nodo.textContent = fmt(Math.round(meta * (p <= 0 ? 0 : 1 - Math.pow(1 - p, 4))));
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  /* ── Capítulo IV: el cielo ───────────────────────────────── */
  // Curva del corazón en un cuadro de 100×100
  const corazon = (t) => [
    50 + 16 * Math.sin(t) ** 3 * 2.75,
    44 - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 2.75,
  ];

  function iniciarCielo() {
    const c = D.cielo;
    const palabras = c.palabras;
    const N = palabras.length;
    const M = Math.max(24, N * 6);
    const puntos = Array.from({ length: M }, (_, k) => corazon((k / M) * Math.PI * 2));
    const indices = Array.from({ length: N }, (_, k) => Math.round((k * M) / N) % M);
    const cons = $("constelacion");
    const trazo = $("trazo");
    let reveladas = 0;

    $("cielo-intro").textContent = c.intro;
    const contador = () => ($("cielo-contador").textContent = `${reveladas} de ${N}`);
    contador();
    $("cielo-frase").replaceChildren();
    trazo.setAttribute("d", `M${puntos.map((p) => p.map((v) => v.toFixed(2)).join(" ")).join("L")}Z`);
    cons.querySelectorAll(".punto, .estrella").forEach((n) => n.remove());

    const rellenos = [];
    puntos.forEach((p, k) => {
      if (indices.includes(k)) return;
      const s = el("span", { className: "punto", style: `left:${p[0]}%;top:${p[1]}%` });
      rellenos.push([k, s]);
      cons.append(s);
    });

    const estrellas = indices.map((k, j) => {
      const p = puntos[k];
      const b = el("button", {
        className: "estrella",
        type: "button",
        ariaLabel: `Estrella ${j + 1} de ${N}`,
        style: `left:${p[0]}%;top:${p[1]}%;--retraso:${(-j * 0.73).toFixed(2)}s`,
      }, icono("i-chispa", "i-lleno"));
      b.onclick = () => tocar(b);
      cons.append(b);
      return b;
    });
    rellenos.forEach(([, s], k) => entrar(s, { delay: 600 + k * 40, y: 0, blur: 2, dur: 900 }));
    estrellas.forEach((b, j) => anim(b, [{ opacity: 0, transform: "scale(.4)" }, { opacity: 1, transform: "none" }], { dur: 1000, delay: 1100 + j * 260, ease: EASE.resorte, fill: "backwards" }));
    $("cielo-intro").focus({ preventScroll: true });

    const tocar = (b) => {
      if (b.classList.contains("encendida")) return;
      b.classList.add("encendida");
      b.disabled = true;
      vibrar(12);
      const onda = el("span", { className: "estrella-onda" });
      b.append(onda);
      anim(onda, [{ transform: "scale(1)", opacity: 0.9 }, { transform: "scale(3.4)", opacity: 0 }], { dur: 1200 }).then(() => onda.remove());

      const palabra = el("span", { textContent: palabras[reveladas++] });
      $("cielo-frase").append(el("span", { className: "mascara" }, palabra));
      anim(palabra, [
        { transform: "translateY(105%)", filter: "blur(6px)", opacity: 0 },
        { transform: "none", filter: "blur(0px)", opacity: 1 },
      ], { dur: 1100, ease: EASE.cajon, fill: "backwards" });
      contador();
      if (reveladas === N) completar();
    };

    const completar = async () => {
      await esperar(1000);
      $("cielo-cabeza").classList.add("fuera");
      const DUR = calmado ? 1 : 2800;
      anim(trazo, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { dur: DUR, ease: "cubic-bezier(.35,.1,.65,.9)", fill: "forwards" });
      rellenos.forEach(([k, s]) => setTimeout(() => s.classList.add("encendido"), (k / M) * DUR));
      await esperar(DUR + 300);
      cons.classList.add("latiendo");
      vibrar([20, 90, 20]);
      await esperar(2400);
      mostrarFinal();
    };
  }

  /* ── Final ───────────────────────────────────────────────── */
  function boton(texto, id, alPulsar, fantasma) {
    return el("button", { className: `boton${fantasma ? " boton-fantasma" : ""}`, type: "button", onclick: alPulsar }, [
      el("span", { textContent: texto }),
      el("span", { className: "boton-icono" }, icono(id, "i i-lleno")),
    ]);
  }

  function mostrarFinal() {
    const c = D.cielo;
    const f = $("final");
    const q = $("final-pregunta");
    f.hidden = false;
    anim($("cielo"), [{ opacity: 1 }, { opacity: 0 }], { dur: 1400, fill: "forwards" });
    anim(f, [{ opacity: 0 }, { opacity: 1 }], { dur: 1600, fill: "backwards" });
    emblema();

    if (D.final === "mirame") {
      q.textContent = "Mírame";
      q.classList.add("mirame");
      entrar(q, { delay: 1500, dur: 1800, blur: 12 });
      q.focus({ preventScroll: true });
      return;
    }

    q.replaceChildren(enfasis(c.pregunta || palabrasPregunta()));
    entrar(q, { delay: 1400, dur: 1600, y: 24, blur: 12 });
    const botones = $("final-botones");
    botones.replaceChildren(
      boton(c.botonSi, "i-corazon", aceptar),
      boton(c.botonSi2 || `¡${c.botonSi}!`, "i-chispa", aceptar, true)
    );
    [...botones.children].forEach((b, k) => entrar(b, { delay: 2900 + k * 160 }));
    q.focus({ preventScroll: true });
  }
  const palabrasPregunta = () => D.cielo.palabras.join(" ");

  // El corazón de estrellas del cielo, en pequeño y dorado
  function emblema() {
    const svg = $("emblema-svg");
    const M = 24;
    const pts = Array.from({ length: M }, (_, k) => corazon((k / M) * Math.PI * 2));
    const d = `M${pts.map((p) => p.map((v) => v.toFixed(2)).join(" ")).join("L")}Z`;
    const grandes = [0, 6, 12, 18];
    const chispa = "M0-1C.07-.42.42-.07 1 0 .42.07.07.42 0 1-.07.42-.42.07-1 0-.42-.07-.07-.42 0-1z";
    svg.innerHTML = `
      <defs><radialGradient id="g-emblema" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#ecd9b8" stop-opacity=".28"/><stop offset="1" stop-color="#ecd9b8" stop-opacity="0"/></radialGradient></defs>
      <path d="${d}" fill="url(#g-emblema)" class="emblema-relleno"/>
      <path d="${d}" class="emblema-trazo" pathLength="1"/>
      ${pts.map((p, k) => (grandes.includes(k) ? "" : `<circle class="emblema-punto" cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="1.1"/>`)).join("")}
      ${grandes.map((k) => `<path class="emblema-estrella" transform="translate(${pts[k][0].toFixed(2)} ${pts[k][1].toFixed(2)}) scale(5)" d="${chispa}"/>`).join("")}
      ${[[18, 6, 3.2], [88, 18, 4], [76, 78, 2.6]].map(([x, y, e], k) => `<g transform="translate(${x} ${y}) scale(${e})"><path class="destello" style="animation-delay:${-k * 0.8}s" fill="#fff" d="${chispa}"/></g>`).join("")}`;

    const caja = $("emblema");
    caja.classList.remove("latiendo");
    entrar(caja, { delay: 400, dur: 1400, y: 20, blur: 8 });
    anim(svg.querySelector(".emblema-trazo"), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { dur: 2000, delay: 700, ease: EASE.vaiven, fill: "both" });
    anim(svg.querySelector(".emblema-relleno"), [{ opacity: 0 }, { opacity: 1 }], { dur: 1400, delay: 2200, fill: "backwards" });
    svg.querySelectorAll(".emblema-punto").forEach((c, k) => anim(c, [{ opacity: 0 }, { opacity: 1 }], { dur: 500, delay: 700 + (k / M) * 2000, fill: "backwards" }));
    svg.querySelectorAll(".emblema-estrella").forEach((c, k) => anim(c, [{ opacity: 0 }, { opacity: 1 }], { dur: 700, delay: 800 + k * 480, fill: "backwards" }));
    setTimeout(() => caja.classList.add("latiendo"), calmado ? 0 : 2900);
  }

  async function aceptar() {
    const c = D.cielo;
    const botones = $("final-botones");
    if (botones.dataset.hecho) return;
    botones.dataset.hecho = "1";
    vibrar([30, 60, 30, 60, 90]);
    celebrar();
    await anim(botones, [{ opacity: 1 }, { opacity: 0, transform: "translateY(10px)" }], { dur: 450, fill: "forwards" });
    botones.hidden = true;

    const ahora = new Date();
    $("final-si").textContent = c.tituloSi || "Dijiste que sí";
    $("final-etiqueta").textContent = c.etiquetaFecha || "Nuestro día 1";
    $("final-fecha").textContent = `${ahora.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })} · ${ahora.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`;
    $("final-mensaje").textContent = c.mensajeFinal;
    $("final-recuerdo").hidden = false;
    anim($("final-si"), [{ clipPath: "inset(0 100% 0 0)", opacity: 1 }, { clipPath: "inset(0 0% 0 0)", opacity: 1 }], { dur: 1900, ease: "cubic-bezier(.45,.05,.55,.95)", fill: "backwards" });
    entrar($("final-etiqueta"), { delay: 1400 });
    entrar($("final-fecha"), { delay: 1600 });
    entrar($("final-mensaje"), { delay: 1900, dur: 1200 });
    try { localStorage.setItem("nuestra-historia-si", ahora.toISOString()); } catch {}
  }

  /* ── Celebración: polvo dorado, chispas y corazones ──────── */
  function celebrar() {
    const cv = $("celebracion");
    const ctx = cv.getContext("2d");
    const ajustar = () => {
      const r = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = innerWidth * r;
      cv.height = innerHeight * r;
      ctx.setTransform(r, 0, 0, r, 0, 0);
    };
    ajustar();
    addEventListener("resize", ajustar);
    if (calmado) return;

    const caja = $("emblema").getBoundingClientRect();
    const ox = caja.left + caja.width / 2;
    const oy = caja.top + caja.height * 0.3;
    const colores = ["248,236,212", "236,217,184", "227,194,131", "255,255,255", "232,167,161", "243,213,150"];
    const azar = (a, b) => a + Math.random() * (b - a);

    const particula = (explota) => {
      const ang = Math.random() * Math.PI * 2;
      const v = explota ? azar(1.5, 10) : 0;
      const r = Math.random();
      return {
        x: explota ? ox : azar(0, innerWidth),
        y: explota ? oy : innerHeight + 20,
        vx: Math.cos(ang) * v,
        vy: explota ? Math.sin(ang) * v - 2.5 : -azar(0.35, 1.1),
        g: explota ? 0.1 : 0,
        t: azar(1, 3.4),
        c: colores[(Math.random() * colores.length) | 0],
        forma: r < (explota ? 0.22 : 0.12) ? "corazon" : r < 0.55 ? "chispa" : "punto",
        vida: 0,
        max: explota ? azar(140, 260) : azar(420, 720),
        rot: azar(0, 6.28),
        vr: azar(-0.05, 0.05),
        fase: azar(0, 6.28),
      };
    };

    const P = Array.from({ length: 220 }, () => particula(true));
    const t0 = performance.now();

    const chispa = (s) => {
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0, 0, s, 0);
      ctx.quadraticCurveTo(0, 0, 0, s);
      ctx.quadraticCurveTo(0, 0, -s, 0);
      ctx.quadraticCurveTo(0, 0, 0, -s);
      ctx.fill();
    };
    const corazonC = (s) => {
      ctx.beginPath();
      ctx.moveTo(0, s * 0.35);
      ctx.bezierCurveTo(-s * 1.1, -s * 0.35, -s * 0.5, -s * 1.1, 0, -s * 0.45);
      ctx.bezierCurveTo(s * 0.5, -s * 1.1, s * 1.1, -s * 0.35, 0, s * 0.35);
      ctx.fill();
    };

    const paso = (t) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      if (t - t0 > 1400 && P.length < 70 && Math.random() < 0.35) P.push(particula(false));
      ctx.globalCompositeOperation = "lighter";
      for (let k = P.length - 1; k >= 0; k--) {
        const p = P[k];
        p.vida++;
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + p.g;
        p.x += p.vx + (p.g ? 0 : Math.sin(p.vida / 45 + p.fase) * 0.35);
        p.y += p.vy;
        p.rot += p.vr;
        if (p.vida > p.max || p.y < -40) { P.splice(k, 1); continue; }
        const alfa = Math.min(1, p.vida / 14) * (1 - p.vida / p.max) * (0.65 + 0.35 * Math.sin(p.vida / 7 + p.fase));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `rgb(${p.c})`;
        if (p.forma === "punto") {
          const R = p.t * 5;
          ctx.globalAlpha = alfa * 0.6;
          ctx.drawImage(halo(p.c), -R, -R, R * 2, R * 2);
          ctx.globalAlpha = alfa;
          ctx.beginPath(); ctx.arc(0, 0, p.t * 0.8, 0, 6.283); ctx.fill();
        } else {
          ctx.globalAlpha = alfa;
          p.forma === "chispa" ? chispa(p.t * 3) : corazonC(p.t * 3.4);
        }
        ctx.restore();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  /* ── Fondo: cielo que gira despacio + estrellas fugaces ──── */
  function fondo() {
    const cv = $("estrellas");
    const ctx = cv.getContext("2d");
    let W = 0, H = 0, estrellas = [], fugaz = null;

    const medir = () => {
      const r = Math.min(window.devicePixelRatio || 1, 2);
      W = innerWidth;
      H = innerHeight;
      cv.width = W * r;
      cv.height = H * r;
      ctx.setTransform(r, 0, 0, r, 0, 0);
      const n = Math.round((W * H * 1.96) / 2300);
      estrellas = Array.from({ length: n }, () => {
        const z = Math.random();
        return {
          x: Math.random() * W * 1.4 - W * 0.2,
          y: Math.random() * H * 1.4 - H * 0.2,
          r: z * z * 1.4 + 0.25,
          a: 0.25 + z * 0.75,
          f: Math.random() * 6.28,
          v: 0.0005 + Math.random() * 0.0016,
          calida: Math.random() < 0.25,
          halo: z > 0.94,
        };
      });
      if (calmado) dibujar(0);
    };

    const dibujar = (t) => {
      ctx.clearRect(0, 0, W, H);
      const ang = t * 1.4e-7;
      const cx = W * 0.5, cy = H * 1.5;
      const cos = Math.cos(ang), sin = Math.sin(ang);
      for (const s of estrellas) {
        const dx = s.x - cx, dy = s.y - cy;
        const x = cx + dx * cos - dy * sin;
        const y = cy + dx * sin + dy * cos;
        const brillo = calmado ? 1 : 0.55 + 0.45 * Math.sin(s.f + t * s.v);
        const rgb = s.calida ? "255,241,214" : "232,236,255";
        ctx.fillStyle = `rgb(${rgb})`;
        if (s.halo) {
          const R = s.r * 7;
          ctx.globalAlpha = s.a * brillo * 0.45;
          ctx.drawImage(halo(rgb), x - R, y - R, R * 2, R * 2);
        }
        ctx.globalAlpha = s.a * brillo;
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.283); ctx.fill();
      }
      if (!calmado) {
        if (!fugaz && Math.random() < 0.0022) {
          fugaz = { x: W * (0.3 + Math.random() * 0.7), y: H * Math.random() * 0.4, vx: -(7 + Math.random() * 4), vy: 2.6 + Math.random() * 1.6, vida: 0 };
        }
        if (fugaz) {
          const f = fugaz;
          f.vida++;
          f.x += f.vx;
          f.y += f.vy;
          const alfa = Math.sin((f.vida / 46) * Math.PI);
          const g = ctx.createLinearGradient(f.x, f.y, f.x - f.vx * 12, f.y - f.vy * 12);
          g.addColorStop(0, `rgba(255,248,230,${alfa})`);
          g.addColorStop(1, "rgba(255,248,230,0)");
          ctx.globalAlpha = 1;
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x - f.vx * 12, f.y - f.vy * 12); ctx.stroke();
          if (f.vida > 46) fugaz = null;
        }
        requestAnimationFrame(dibujar);
      }
      ctx.globalAlpha = 1;
    };

    medir();
    addEventListener("resize", medir);
    if (!calmado) requestAnimationFrame(dibujar);
  }

  /* ── Música y pantalla completa ──────────────────────────── */
  function reproducirCancion() {
    const src = D.wrapped?.cancion?.audio;
    if (!src) return;
    const a = $("audio");
    a.src = src;
    a.volume = 0;
    a.play().then(() => {
      const t0 = performance.now();
      const subirVol = (t) => { a.volume = Math.min(0.6, ((t - t0) / 4000) * 0.6); if (a.volume < 0.6) requestAnimationFrame(subirVol); };
      requestAnimationFrame(subirVol);
    }).catch(() => {});
  }

  function pantallaCompleta() {
    if (!matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.requestFullscreen?.({ navigationUI: "hide" }).catch(() => {});
  }

  /* ── Arranque ────────────────────────────────────────────── */
  const INICIOS = { portada: iniciarPortada, carta: iniciarCarta, acertijos: iniciarAcertijos, wrapped: iniciarWrapped, cielo: iniciarCielo };

  document.title = `Para ${D.nombre}`;
  fondo();

  const listo = Promise.race([document.fonts?.ready ?? Promise.resolve(), esperar(1500)]);
  listo.then(() => {
    document.body.classList.remove("cargando");
    // ?capitulo=acertijos (o carta, wrapped, cielo, final) → salta directo para probar
    const salto = params.get("capitulo");
    const i = CAPITULOS.indexOf(salto);
    if (!modoQR && salto === "final") {
      mostrar("cielo").then(mostrarFinal);
    } else if (!modoQR && i >= 0) {
      mostrar(CAPITULOS[i], i);
    } else {
      irA(progreso.completado + 1);
    }
  });
})();
