"""Genera los QR de «Nosotros» y sus tarjetas para imprimir.

Uso:  python3 qr/generar.py [URL]          (requiere: pip install segno)
Crea:
  qr/qr.svg               solo el código (módulos redondeados, play al centro)
  qr/tarjeta-disco.html   tarjeta oscura, estilo reproductor
  qr/tarjeta-papel.html   tarjeta clara, minimalista
Las tarjetas se convierten a PNG tomando captura del HTML a 1080×1350.
"""
import sys
import segno

URL = sys.argv[1] if len(sys.argv) > 1 else "https://luiisalberto.github.io/nosotros/"
TINTA, VERDE = "#121212", "#1DB954"

qr = segno.make(URL, error="h")
m = [list(fila) for fila in qr.matrix]
n = len(m)
c = n // 2
HUECO = 3


def en_ojo(x, y):
    return (x < 7 and y < 7) or (x >= n - 7 and y < 7) or (x < 7 and y >= n - 7)


def qr_svg(color, centro):
    piezas = []
    for y in range(n):
        for x in range(n):
            if not m[y][x] or en_ojo(x, y):
                continue
            if abs(x - c) <= HUECO and abs(y - c) <= HUECO:
                continue
            piezas.append(f'<rect x="{x + .07}" y="{y + .07}" width=".86" height=".86" rx=".3"/>')
    ojos = "".join(
        f'<rect x="{ox + .5}" y="{oy + .5}" width="6" height="6" rx="1.7" fill="none" stroke="{color}" stroke-width="1"/>'
        f'<rect x="{ox + 2}" y="{oy + 2}" width="3" height="3" rx=".9" fill="{color}"/>'
        for ox, oy in [(0, 0), (n - 7, 0), (0, n - 7)])
    cx = c + .5
    mid = (f'<circle cx="{cx}" cy="{cx}" r="{HUECO + .1}" fill="{VERDE}"/>'
           f'<path d="M{cx - .9} {cx - 1.5} L{cx + 1.7} {cx} L{cx - .9} {cx + 1.5} Z" fill="{TINTA}"/>') if centro == "play" else (
           f'<path transform="translate({cx} {cx + .3}) scale(.27)" d="M0 6 C -11 -4 -8 -13 0 -7 C 8 -13 11 -4 0 6 Z" fill="#E4572E"/>')
    pad = 4
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {-pad} {n + 2 * pad} {n + 2 * pad}">'
            f'<rect x="{-pad}" y="{-pad}" width="{n + 2 * pad}" height="{n + 2 * pad}" fill="#fff"/>'
            f'<g fill="{color}">{"".join(piezas)}</g>{ojos}{mid}</svg>')


with open("qr/qr.svg", "w") as f:
    f.write(qr_svg(TINTA, "play"))
with open("qr/qr-papel.svg", "w") as f:
    f.write(qr_svg("#1C2541", "corazon"))

FUENTES = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700'
           '&family=Figtree:wght@500;700;800&family=Fraunces:ital,opsz,wght@1,9..144,500&family=Unbounded:wght@800&display=swap">')

disco = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Nosotros · QR disco</title>{FUENTES}
<style>
* {{ box-sizing: border-box; }} body {{ margin: 0; }}
.t {{ width: 1080px; height: 1350px; padding: 90px 96px; color: #fff; font-family: Figtree, sans-serif;
  background: linear-gradient(180deg, #2F5FB8 0%, #1B2F5C 46%, #121212 78%); display: flex; flex-direction: column; gap: 46px; }}
.top {{ display: flex; gap: 44px; align-items: center; }}
.arte {{ width: 300px; height: 300px; flex: none; border-radius: 10px; position: relative; overflow: hidden; background: #F2892B; box-shadow: 0 30px 60px rgba(0,0,0,.45); }}
.arte i {{ position: absolute; border-radius: 50%; }}
.a1 {{ width: 360px; height: 360px; background: #2F6BD8; left: -190px; bottom: -200px; }}
.a2 {{ width: 190px; height: 190px; background: #FFC93D; right: -44px; top: -44px; mix-blend-mode: multiply; }}
.a3 {{ width: 74px; height: 74px; background: #34A56F; left: 28px; top: 30px; }}
.arte b {{ position: absolute; left: 22px; bottom: 20px; font-family: Unbounded, sans-serif; font-size: 44px; line-height: .86; letter-spacing: -.04em; color: #1E1B17; }}
.info small {{ font-size: 26px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; opacity: .8; }}
.info h1 {{ margin: 10px 0 14px; font-family: Unbounded, sans-serif; font-size: 96px; line-height: .9; letter-spacing: -.04em; }}
.info p {{ margin: 0; font-size: 34px; color: #B3B3B3; font-weight: 500; }}
.panel {{ flex: 1; background: #fff; border-radius: 34px; padding: 40px 50px; display: flex; flex-direction: column; gap: 34px; align-items: center; justify-content: center; color: #121212; }}
.panel img {{ width: 540px; height: 540px; flex: none; }}
.panel .txt {{ text-align: center; }}
.panel h2 {{ margin: 0 0 6px; font-size: 46px; line-height: 1.02; font-weight: 800; letter-spacing: -.02em; }}
.panel p {{ margin: 0; font-family: Fraunces, serif; font-style: italic; font-size: 32px; line-height: 1.2; color: #4a4a4a; }}
.play {{ width: 110px; height: 110px; border-radius: 50%; background: {VERDE}; display: grid; place-items: center; }}
</style></head><body><div class="t">
  <div class="top">
    <div class="arte"><i class="a1"></i><i class="a2"></i><i class="a3"></i><b>NOSO<br>TROS</b></div>
    <div class="info"><small>Álbum · 2019 — hoy</small><h1>Nosotros</h1><p>Edith &amp; Luis · 14 canciones</p></div>
  </div>
  <div class="panel"><img src="qr.svg" alt="Código QR">
    <div class="txt"><h2>Escanéame y dale play</h2><p>Nuestra historia, canción por canción.</p></div>
  </div>
</div></body></html>"""

papel = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Nosotros · QR papel</title>{FUENTES}
<style>
* {{ box-sizing: border-box; }} body {{ margin: 0; }}
.t {{ width: 1080px; height: 1350px; background: #F6F1E7; color: #1C2541; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 54px; font-family: Figtree, sans-serif; position: relative; }}
.t::before, .t::after {{ content: ""; position: absolute; left: 70px; right: 70px; height: 2px; background: #1C2541; opacity: .18; }}
.t::before {{ top: 70px; }} .t::after {{ bottom: 70px; }}
small {{ font-family: 'Courier Prime', monospace; font-size: 28px; letter-spacing: .3em; text-transform: uppercase; color: #6B6457; }}
h1 {{ margin: -26px 0 0; font-family: Fraunces, serif; font-style: italic; font-weight: 500; font-size: 150px; line-height: 1; letter-spacing: -.02em; }}
.marco {{ background: #fff; padding: 26px; border-radius: 28px; box-shadow: 0 24px 50px rgba(28,37,65,.12); }}
.marco img {{ width: 600px; height: 600px; display: block; }}
p {{ margin: 0; font-family: 'Courier Prime', monospace; font-size: 34px; text-align: center; line-height: 1.5; }}
p b {{ font-weight: 700; }}
</style></head><body><div class="t">
  <small>Edith &amp; Luis · desde 2019</small>
  <h1>Nosotros</h1>
  <div class="marco"><img src="qr-papel.svg" alt="Código QR"></div>
  <p><b>escanéame</b><br>y ponle play a nuestra historia</p>
</div></body></html>"""

with open("qr/tarjeta-disco.html", "w") as f:
    f.write(disco)
with open("qr/tarjeta-papel.html", "w") as f:
    f.write(papel)
print("QR para:", URL, "| módulos:", n)
