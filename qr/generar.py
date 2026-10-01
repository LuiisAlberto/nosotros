"""Genera el QR personalizado de «Nosotros».

Uso:  python3 qr/generar.py [URL]
Crea qr/qr.svg (solo el código) y qr/tarjeta.html (tarjeta para imprimir).
"""
import sys
import segno

URL = sys.argv[1] if len(sys.argv) > 1 else "https://luiisalberto.github.io/nosotros/"
TINTA, AZUL, NARANJA = "#1C2541", "#2F6BD8", "#F2892B"

qr = segno.make(URL, error="h")
m = [list(fila) for fila in qr.matrix]
n = len(m)
centro = n // 2
hueco = 4 if n < 33 else 5           # radio del espacio para el corazón

def en_ojo(x, y):
    return (x < 7 and y < 7) or (x >= n - 7 and y < 7) or (x < 7 and y >= n - 7)

piezas = []
for y in range(n):
    for x in range(n):
        if not m[y][x] or en_ojo(x, y):
            continue
        if abs(x - centro) <= hueco and abs(y - centro) <= hueco:
            continue
        piezas.append(f'<circle cx="{x + .5}" cy="{y + .5}" r=".44"/>')

def ojo(ox, oy):
    return (f'<rect x="{ox + .5}" y="{oy + .5}" width="6" height="6" rx="1.9" fill="none" stroke="{AZUL}" stroke-width="1"/>'
            f'<rect x="{ox + 2}" y="{oy + 2}" width="3" height="3" rx="1" fill="{TINTA}"/>')

c = centro + .5
corazon = (f'<rect x="{c - hueco - .2}" y="{c - hueco - .2}" width="{2 * hueco + .4}" height="{2 * hueco + .4}" rx="2.2" fill="#fff"/>'
           f'<path transform="translate({c} {c + .4}) scale({hueco / 6.2})" d="M0 6 C -11 -4 -8 -13 0 -7 C 8 -13 11 -4 0 6 Z" '
           f'fill="{NARANJA}" stroke="{TINTA}" stroke-width="1.6" stroke-linejoin="round"/>')

pad = 4                              # margen blanco (zona de silencio)
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {-pad} {n + 2 * pad} {n + 2 * pad}" shape-rendering="geometricPrecision">'
       f'<rect x="{-pad}" y="{-pad}" width="{n + 2 * pad}" height="{n + 2 * pad}" fill="#fff"/>'
       f'<g fill="{TINTA}">{"".join(piezas)}</g>'
       f'{ojo(0, 0)}{ojo(n - 7, 0)}{ojo(0, n - 7)}{corazon}</svg>')

with open("qr/qr.svg", "w") as f:
    f.write(svg)

tarjeta = f"""<!doctype html><html lang="es"><head><meta charset="utf-8">
<title>Nosotros · QR</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Figtree:wght@500;700&family=Fraunces:ital,opsz,wght@1,9..144,500&family=Unbounded:wght@800&display=swap">
<style>
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; background: #e9e6df; }}
  .tarjeta {{ width: 1080px; height: 1350px; position: relative; overflow: hidden; background: {NARANJA}; font-family: Figtree, sans-serif; color: {TINTA}; }}
  .c1 {{ position: absolute; width: 1250px; height: 1250px; border-radius: 50%; background: {AZUL}; left: -690px; bottom: -560px; }}
  .c2 {{ position: absolute; width: 620px; height: 620px; border-radius: 50%; background: #FFC93D; right: -170px; top: -200px; mix-blend-mode: multiply; }}
  .c3 {{ position: absolute; width: 250px; height: 250px; border-radius: 50%; background: #34A56F; right: 70px; bottom: 300px; }}
  .arriba {{ position: absolute; left: 80px; top: 70px; font-family: 'Courier Prime', monospace; font-weight: 700; font-size: 30px; letter-spacing: .02em; }}
  .papel {{ position: absolute; left: 50%; top: 175px; width: 660px; padding: 24px 24px 30px; background: #FBF7EF; transform: translateX(-50%) rotate(-2.5deg); box-shadow: 0 30px 60px rgba(0,0,0,.28); text-align: center; }}
  .cinta {{ position: absolute; width: 230px; height: 62px; background: rgba(255,201,61,.85); top: -30px; left: 50%; transform: translateX(-50%) rotate(3deg); }}
  .papel img {{ width: 100%; display: block; }}
  .pie {{ margin-top: 22px; font-family: 'Courier Prime', monospace; font-size: 30px; }}
  .titulo {{ position: absolute; left: 80px; bottom: 150px; font-family: Unbounded, sans-serif; font-weight: 800; font-size: 150px; line-height: .86; letter-spacing: -.04em; color: #1E1B17; }}
  .sub {{ position: absolute; left: 84px; bottom: 82px; font-family: Fraunces, serif; font-style: italic; font-size: 44px; color: #fff; }}
  .play {{ position: absolute; right: 80px; bottom: 80px; width: 150px; height: 150px; border-radius: 50%; background: #34A56F; display: grid; place-items: center; box-shadow: 0 16px 34px rgba(0,0,0,.3); }}
</style></head><body>
<div class="tarjeta">
  <span class="c1"></span><span class="c2"></span><span class="c3"></span>
  <div class="arriba">un disco · 14 canciones · desde 2019</div>
  <div class="papel"><span class="cinta"></span><img src="qr.svg" alt="Código QR"><div class="pie">escanéame y dale play</div></div>
  <div class="titulo">NOSO<br>TROS</div>
  <div class="sub">Edith &amp; Luis</div>
  <div class="play"><svg width="62" height="62" viewBox="0 0 24 24"><path d="M7 4 L20 12 L7 20 Z" fill="#121212"/></svg></div>
</div></body></html>"""
with open("qr/tarjeta.html", "w") as f:
    f.write(tarjeta)
print("QR para:", URL, "| módulos:", n)
