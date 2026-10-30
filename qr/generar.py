"""Genera el QR de «Nosotros» y sus tarjetas para imprimir o mandar.

Uso:  python3 qr/generar.py [URL]          (requiere: pip install segno)
Crea:
  qr/qr.svg                   solo el código, en tinta, con un corazón al centro
  qr/tarjeta-boleto.html      entrada de concierto «Nosotros · en vivo»; el QR va en el talón
  qr/tarjeta-contra.html      contraportada del disco: lista de canciones y el QR como etiqueta
  qr/tarjeta-polaroid.html    la portada del disco con el QR dentro de la polaroid
Las tarjetas se pasan a PNG (1080×1350 a doble resolución) con:  node qr/capturar.js
"""
import sys
import segno

URL = sys.argv[1] if len(sys.argv) > 1 else "https://luiisalberto.github.io/nosotros/"

# mismos colores que el sitio
TINTA, PAPEL, BLANCO = "#24211D", "#FBF7EF", "#FFFFFF"
AZUL, AZUL_CLARO, NARANJA, NARANJA_OS = "#2F6BD8", "#AFC9F4", "#F2892B", "#C9581A"
AMARILLO, VERDE, CINTA = "#FFC93D", "#34A56F", "rgba(255, 201, 61, .78)"

qr = segno.make(URL, error="h")
m = [list(fila) for fila in qr.matrix]
n = len(m)
c = n // 2
HUECO = 3  # módulos libres alrededor del centro (corrección «H» aguanta de sobra)


def en_ojo(x, y):
    return (x < 7 and y < 7) or (x >= n - 7 and y < 7) or (x < 7 and y >= n - 7)


def qr_svg(fondo="none"):
    """El código dibujado en tinta: puntos redondeados, ojos como marcos y un corazón al centro."""
    piezas = []
    for y in range(n):
        for x in range(n):
            if not m[y][x] or en_ojo(x, y):
                continue
            if abs(x - c) <= HUECO and abs(y - c) <= HUECO:
                continue
            piezas.append(f'<rect x="{x + .08}" y="{y + .08}" width=".84" height=".84" rx=".34"/>')
    ojos = "".join(
        f'<rect x="{ox + .5}" y="{oy + .5}" width="6" height="6" rx="1.9" fill="none" stroke="{TINTA}" stroke-width="1"/>'
        f'<rect x="{ox + 2}" y="{oy + 2}" width="3" height="3" rx="1" fill="{TINTA}"/>'
        for ox, oy in [(0, 0), (n - 7, 0), (0, n - 7)])
    cx = c + .5
    centro = (f'<circle cx="{cx}" cy="{cx}" r="{HUECO - .15}" fill="{PAPEL}" stroke="{TINTA}" stroke-width=".38"/>'
              f'<path transform="translate({cx} {cx + .35}) scale(.2)" d="M0 6 C -11 -4 -8 -13 0 -7 C 8 -13 11 -4 0 6 Z" '
              f'fill="{NARANJA}" stroke="{TINTA}" stroke-width="1.9" stroke-linejoin="round"/>')
    pad = 2
    fondo_rect = f'<rect x="{-pad}" y="{-pad}" width="{n + 2 * pad}" height="{n + 2 * pad}" fill="{fondo}"/>' if fondo != "none" else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {-pad} {n + 2 * pad} {n + 2 * pad}" role="img" aria-label="Código QR">'
            f'{fondo_rect}<g fill="{TINTA}">{"".join(piezas)}</g>{ojos}{centro}</svg>')


with open("qr/qr.svg", "w") as f:
    f.write(qr_svg(BLANCO))

# ---------- dibujitos (los mismos trazos que en el sitio) ----------
def estrella(x, y, s=1, c=AMARILLO):
    return (f'<path transform="translate({x} {y}) scale({s})" fill="{c}" stroke="{TINTA}" stroke-width="2" stroke-linejoin="round" '
            f'd="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4 Z"/>')


def corazon(x, y, s=1, c=NARANJA):
    return (f'<path transform="translate({x} {y}) scale({s})" fill="{c}" stroke="{TINTA}" stroke-width="2" stroke-linejoin="round" '
            f'd="M0 6 C -11 -4 -8 -13 0 -7 C 8 -13 11 -4 0 6 Z"/>')


def nota(x, y, s=1, c=TINTA):
    return (f'<g transform="translate({x} {y}) scale({s})"><path d="M0 0 V-26 L14 -30 V-4" fill="none" stroke="{TINTA}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<ellipse cx="-4" cy="1" rx="6" ry="4.6" fill="{c}"/><ellipse cx="10" cy="-3" rx="6" ry="4.6" fill="{c}"/></g>')


def capa(w, h, contenido, clase="capa"):
    return f'<svg class="{clase}" viewBox="0 0 {w} {h}" aria-hidden="true">{contenido}</svg>'


FUENTES = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700'
           '&family=Figtree:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400;1,9..144,500'
           '&family=Unbounded:wght@600;700;800&display=swap">')

BASE = f"""
* {{ box-sizing: border-box; }} body {{ margin: 0; }}
.t {{ width: 1080px; height: 1350px; position: relative; overflow: hidden; font-family: Figtree, sans-serif; color: {TINTA}; }}
.capa {{ position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }}
.cinta {{ position: absolute; height: 64px; background: {CINTA}; box-shadow: 0 2px 6px rgba(0,0,0,.08); }}
.qr svg {{ display: block; width: 100%; height: 100%; }}
.maq {{ font-family: 'Courier Prime', monospace; }}
.script {{ font-family: Fraunces, serif; font-style: italic; font-weight: 500; }}
.display {{ font-family: Unbounded, sans-serif; font-weight: 800; letter-spacing: -.04em; }}
"""


def pagina(titulo, css, cuerpo):
    return (f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Nosotros · {titulo}</title>{FUENTES}'
            f'<style>{BASE}{css}</style></head><body><div class="t">{cuerpo}</div></body></html>')


QR = qr_svg()

# ---------- 1. boleto ----------
boleto_css = f"""
.t {{ background: {AZUL}; }}
.boleto {{ position: absolute; left: 110px; top: 120px; width: 860px; height: 1110px; transform: rotate(-2deg);
  filter: drop-shadow(0 26px 40px rgba(16, 28, 66, .45)); }}
.boleto .forma {{ position: absolute; inset: 0; width: 100%; height: 100%; }}
.arriba {{ position: absolute; left: 70px; right: 70px; top: 74px; }}
.arriba small {{ font-size: 24px; letter-spacing: .32em; text-transform: uppercase; color: {NARANJA_OS}; font-weight: 700; }}
.arriba h1 {{ margin: 16px 0 0; font-size: 112px; line-height: .86; }}
.arriba .vivo {{ display: block; font-size: 56px; color: {AZUL}; margin: 4px 0 0 6px; }}
.arriba .quien {{ margin: 16px 0 0; font-size: 30px; font-weight: 700; }}
.datos {{ position: absolute; left: 70px; right: 70px; top: 500px; display: grid; grid-template-columns: 1fr 1fr; gap: 18px 40px; }}
.datos div {{ border-top: 3px solid {TINTA}; padding-top: 10px; }}
.datos span {{ display: block; font-size: 20px; letter-spacing: .2em; text-transform: uppercase; color: #5E574D; font-weight: 700; }}
.datos b {{ display: block; font-size: 33px; font-weight: 700; margin-top: 4px; }}
.talon {{ position: absolute; left: 70px; right: 70px; bottom: 64px; height: 330px; display: flex; align-items: center; gap: 44px; }}
.talon .qr {{ width: 330px; height: 330px; flex: none; }}
.talon h2 {{ margin: 0; font-size: 50px; line-height: .95; }}
.talon p {{ margin: 10px 0 0; font-size: 40px; line-height: 1.1; color: {AZUL}; }}
.talon .letra {{ margin-top: 26px; font-size: 19px; line-height: 1.5; color: #5E574D; letter-spacing: .04em; }}
"""
# silueta del boleto: rectángulo con muescas a la altura del corte
W, H, R, CORTE = 860, 1110, 34, 716
forma = (f'<path d="M{R} 0 H{W - R} Q{W} 0 {W} {R} V{CORTE - 34} A34 34 0 0 0 {W} {CORTE + 34} V{H - R} Q{W} {H} {W - R} {H} '
         f'H{R} Q0 {H} 0 {H - R} V{CORTE + 34} A34 34 0 0 0 0 {CORTE - 34} V{R} Q0 0 {R} 0 Z" fill="{PAPEL}" stroke="{TINTA}" stroke-width="5"/>'
         f'<path d="M54 {CORTE} H{W - 54}" stroke="{TINTA}" stroke-width="4" stroke-dasharray="2 16" stroke-linecap="round"/>'
         f'{estrella(780, 96, 2.2)}{corazon(752, 330, 2.6)}{nota(700, 230, 1.6, AZUL)}{estrella(640, 400, 1.3, VERDE)}')
fondo_boleto = capa(1080, 1350,
    f'<circle cx="1040" cy="90" r="250" fill="{NARANJA}"/><circle cx="60" cy="1300" r="210" fill="{VERDE}"/>'
    f'{estrella(90, 90, 2.4)}{estrella(990, 1250, 2, BLANCO)}{corazon(980, 640, 2.2, AMARILLO)}{nota(70, 760, 1.8, AMARILLO)}')
boleto = pagina("boleto", boleto_css, f"""{fondo_boleto}
<div class="boleto">
  <svg class="forma" viewBox="0 0 {W} {H}" aria-hidden="true">{forma}</svg>
  <div class="cinta" style="left:290px;top:-28px;width:280px;transform:rotate(3deg)"></div>
  <div class="arriba">
    <small class="maq">Entrada · 1 persona</small>
    <h1 class="display">NOSO<br>TROS</h1>
    <span class="vivo script">en vivo</span>
    <p class="quien">Edith &amp; Luis · gira 2019 — siempre</p>
  </div>
  <div class="datos maq">
    <div><span>Fecha</span><b>13 · 12 · 2019</b></div>
    <div><span>Lugar</span><b>donde estés tú</b></div>
    <div><span>Fila</span><b>la primera</b></div>
    <div><span>Asiento</span><b>junto a mí</b></div>
  </div>
  <div class="talon">
    <div class="qr">{QR}</div>
    <div>
      <h2 class="display">Escanéame</h2>
      <p class="script">y dale play</p>
      <div class="letra maq">VÁLIDO PARA SIEMPRE<br>NO REEMBOLSABLE<br>NO TRANSFERIBLE · SOLO EDITH</div>
    </div>
  </div>
</div>""")

# ---------- 2. contraportada ----------
CANCIONES = ["Intro", "Efectos secundarios", "Misma hora, mismo lugar", "Plan B", "Aluminio", "Intermedio",
             "Medianoche", "Explanada", "Todas tus versiones", "Alternativos", "Ahora sí", "Hagamos cuentas",
             "Final (feat. Edith)"]  # la pista oculta no se anuncia: para eso es oculta
lista = "".join(f'<li><span>{i:02d}</span>{t}</li>' for i, t in enumerate(CANCIONES, 1))
contra_css = f"""
.t {{ background: {PAPEL}; }}
.vinilo {{ position: absolute; right: -250px; top: -250px; width: 640px; height: 640px; }}
.cab {{ position: absolute; left: 90px; top: 96px; }}
.cab small {{ font-size: 24px; letter-spacing: .3em; text-transform: uppercase; color: {NARANJA_OS}; font-weight: 700; }}
.cab h1 {{ margin: 14px 0 0; font-size: 104px; line-height: .9; }}
.cab p {{ margin: 16px 0 0; font-size: 32px; font-weight: 700; }}
.lado {{ position: absolute; left: 90px; top: 396px; font-size: 22px; letter-spacing: .3em; font-weight: 700; color: #5E574D; }}
ol {{ position: absolute; left: 90px; top: 440px; margin: 0; padding: 0; list-style: none; width: 520px; }}
li {{ display: flex; gap: 18px; align-items: baseline; font-size: 31px; font-weight: 600; line-height: 1.62; border-bottom: 2px dotted rgba(36,33,29,.25); }}
li span {{ font-family: 'Courier Prime', monospace; font-size: 22px; font-weight: 700; color: {NARANJA_OS}; width: 34px; flex: none; }}
.etiqueta {{ position: absolute; right: 86px; top: 560px; width: 370px; padding: 26px 26px 22px; background: {BLANCO};
  border: 4px solid {TINTA}; border-radius: 22px; transform: rotate(3deg); box-shadow: 0 18px 30px rgba(36,33,29,.18); text-align: center; }}
.etiqueta .qr {{ width: 314px; height: 314px; }}
.etiqueta b {{ display: block; margin-top: 14px; font-size: 30px; }}
.etiqueta i {{ display: block; font-size: 28px; color: {AZUL}; }}
.pie {{ position: absolute; left: 90px; right: 90px; bottom: 70px; padding-top: 18px; border-top: 3px solid {TINTA};
  display: flex; justify-content: space-between; font-size: 19px; line-height: 1.55; color: #5E574D; letter-spacing: .03em; }}
"""
vinilo = (f'<svg class="vinilo" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="98" fill="{TINTA}"/>'
          + "".join(f'<circle cx="100" cy="100" r="{r}" fill="none" stroke="#3B3731" stroke-width="1.2"/>' for r in (88, 78, 68, 58, 48))
          + f'<circle cx="100" cy="100" r="36" fill="{NARANJA}"/><path d="M64 100 A36 36 0 0 0 136 100 Z" fill="{AZUL}"/>'
          f'<circle cx="100" cy="100" r="5" fill="{PAPEL}"/></svg>')
fondo_contra = capa(1080, 1350, f'{estrella(640, 150, 2.4)}{corazon(980, 1080, 2.4)}{nota(700, 300, 1.6, VERDE)}{estrella(560, 1150, 1.6, AZUL_CLARO)}')
contra = pagina("contraportada", contra_css, f"""{vinilo}{fondo_contra}
<div class="cab"><small class="maq">Álbum · Lado A</small><h1 class="display">NOSO<br>TROS</h1><p>Edith &amp; Luis</p></div>
<ol>{lista}</ol>
<div class="etiqueta">
  <div class="cinta" style="left:110px;top:-30px;width:150px;height:52px;transform:rotate(-4deg)"></div>
  <div class="qr">{QR}</div>
  <b class="display">Escanéame</b><i class="script">y dale play</i>
</div>
<div class="pie maq"><span>℗ 2019 — hoy · Edith &amp; Luis<br>Grabado en CDMX y Pachuca</span><span style="text-align:right">Hecho a mano<br>para Edith</span></div>""")

# ---------- 3. polaroid ----------
pola_css = f"""
.t {{ background: {NARANJA}; }}
.polaroid {{ position: absolute; left: 175px; top: 170px; width: 730px; padding: 44px 44px 0; background: {BLANCO};
  transform: rotate(-3deg); box-shadow: 0 30px 50px rgba(60, 25, 0, .35); }}
.polaroid .foto {{ background: {PAPEL}; padding: 48px; }}
.polaroid .qr {{ width: 546px; height: 546px; }}
.polaroid .pie {{ height: 150px; display: flex; align-items: center; justify-content: center; gap: 18px; font-size: 54px; }}
.marca {{ position: absolute; left: 86px; bottom: 76px; font-size: 128px; line-height: .86; }}
.dale {{ position: absolute; right: 90px; bottom: 96px; text-align: right; }}
.dale b {{ display: block; font-size: 38px; font-weight: 800; color: {TINTA}; }}
.dale span {{ display: block; margin-top: 4px; font-family: 'Courier Prime', monospace; font-size: 24px; letter-spacing: .1em; color: {TINTA}; }}
"""
fondo_pola = capa(1080, 1350,
    f'<circle cx="1010" cy="260" r="330" fill="#E8701A"/><path d="M0 820 Q330 760 560 1350 H0 Z" fill="{AZUL}"/>'
    f'<circle cx="930" cy="1080" r="170" fill="{VERDE}"/>{estrella(120, 130, 2.6)}{estrella(960, 640, 1.8, BLANCO)}'
    f'{corazon(130, 700, 2.2, AMARILLO)}{nota(900, 120, 1.8)}')
pola = pagina("polaroid", pola_css, f"""{fondo_pola}
<div class="polaroid">
  <div class="cinta" style="left:250px;top:-34px;width:240px;transform:rotate(2deg)"></div>
  <div class="foto"><div class="qr">{QR}</div></div>
  <div class="pie script">para Edith <svg width="52" height="48" viewBox="-12 -14 24 22" aria-hidden="true">{corazon(0, 0, 1)}</svg></div>
</div>
<div class="marca display">NOSO<br>TROS</div>
<div class="dale"><b>Escanéame y dale play</b><span>EDITH &amp; LUIS · 2019 — HOY</span></div>""")

for nombre, html in [("boleto", boleto), ("contra", contra), ("polaroid", pola)]:
    with open(f"qr/tarjeta-{nombre}.html", "w") as f:
        f.write(html)
print("QR para:", URL, "| módulos:", n)
