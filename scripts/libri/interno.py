"""Interno V01 v05: parte dal v02 su Drive, toglie i segnaposto e chiude le pagine 1, 2, 30, 32."""
import io, random
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream, NameObject
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image
for n, f in (("Pop", "poppins-400"), ("PopI", "poppins-300i"), ("PopB", "poppins-600")):
    pdfmetrics.registerFont(TTFont(n, f"font/{f}.ttf"))
L = 612
TITOLO = "Mizi e la stella che non voleva accendersi"
DEDICA = ("Alla mia dolcissima Domi,", "che mi aiuta da sempre", "a diventare una persona migliore.")
CREDITI = ("Testi: Giorgia Palazzo, con il supporto dell’intelligenza artificiale",
           "Illustrazioni: Giorgia Palazzo, con il supporto dell’intelligenza artificiale",
           "© 2026 Giorgia Palazzo")

# Logo originale in scala di grigi su bianco (derivato per l'interno in bianco e nero)
logo = Image.open("in/logo.png").convert("RGBA")
bianco = Image.new("RGBA", logo.size, (255, 255, 255, 255)); bianco.alpha_composite(logo)
grigio = bianco.convert("L").crop(logo.getbbox()); grigio = grigio.resize((760, round(760 * grigio.height / grigio.width)), Image.LANCZOS); grigio.save("out/logo_grigio_interno.png")
LOGO = ImageReader("out/logo_grigio_interno.png"); RAPP = grigio.height / grigio.width

def pulisci(pagina, lettore, via):
    """Toglie i blocchi di testo che contengono una delle stringhe in `via` e i riquadri tratteggiati."""
    ops = ContentStream(pagina.get_contents(), lettore).operations
    nuove, i = [], 0
    while i < len(ops):
        op = ops[i][1]
        if op in (b"BT", b"q"):
            fine = b"ET" if op == b"BT" else b"Q"
            j = i
            while ops[j][1] != fine: j += 1
            blocco = ops[i:j + 1]
            testo = " ".join(a[0].decode("latin-1") if isinstance(a[0], bytes) else str(a[0]) for a, o in blocco if o == b"Tj")
            tratteggio = any(o == b"d" and len(a[0]) > 0 for a, o in blocco)
            if (op == b"BT" and any(v in testo for v in via)) or (op == b"q" and tratteggio):
                i = j + 1; continue
        nuove.append(ops[i]); i += 1
    cs = ContentStream(None, lettore); cs.operations = nuove
    pagina[NameObject("/Contents")] = cs

def strato(disegna):
    b = io.BytesIO(); c = canvas.Canvas(b, pagesize=(L, L), initialFontName="Pop"); c.setFillGray(0); c.setStrokeGray(0)
    disegna(c); c.showPage(); c.save(); b.seek(0)
    return PdfReader(b).pages[0]

def stella(c, x, y, r, pieno=False):
    import math
    p = c.beginPath()
    for k in range(10):
        a = math.pi / 2 + k * math.pi / 5; rr = r if k % 2 == 0 else r * 0.45
        (p.moveTo if k == 0 else p.lineTo)(x + rr * math.cos(a), y + rr * math.sin(a))
    p.close(); c.drawPath(p, stroke=1, fill=1 if pieno else 0)

def pag1(c):
    w = 140; c.drawImage(LOGO, (L - w) / 2, 370, w, w * RAPP, mask=None)

def pag2(c):
    c.setFont("PopI", 13)
    for i, r in enumerate(DEDICA): c.drawCentredString(L / 2, L / 2 + 21 - 21 * i, r)
    y = 140
    c.setFont("PopB", 10.5); c.drawCentredString(L / 2, y, TITOLO); y -= 24
    c.setFont("Pop", 9.5)
    for r in CREDITI: c.drawCentredString(L / 2, y, r); y -= 16

def pag30(c):
    """Labirinto disegnato a tratti: dalla lucina (in alto a sinistra) alla stella (in basso a destra)."""
    col, rig, lato = 9, 7, 52
    x0, y0 = (L - col * lato) / 2, 98 + (390 - rig * lato) / 2
    rnd = random.Random(2026)
    visti = {(0, 0)}; muri = {(x, y, d) for x in range(col) for y in range(rig) for d in "NE"}
    pila = [(0, 0)]
    while pila:
        x, y = pila[-1]
        vicini = [(x + dx, y + dy, d) for dx, dy, d in ((0, 1, "N"), (1, 0, "E"), (0, -1, "S"), (-1, 0, "O"))
                  if 0 <= x + dx < col and 0 <= y + dy < rig and (x + dx, y + dy) not in visti]
        if not vicini: pila.pop(); continue
        nx, ny, d = rnd.choice(vicini)
        muri.discard({"N": (x, y, "N"), "E": (x, y, "E"), "S": (nx, ny, "N"), "O": (nx, ny, "E")}[d])
        visti.add((nx, ny)); pila.append((nx, ny))
    c.setLineWidth(2.4); c.setLineCap(1)
    c.rect(x0, y0, col * lato, rig * lato)
    for x, y, d in muri:
        if d == "N" and y < rig - 1: c.line(x0 + x * lato, y0 + (y + 1) * lato, x0 + (x + 1) * lato, y0 + (y + 1) * lato)
        if d == "E" and x < col - 1: c.line(x0 + (x + 1) * lato, y0 + y * lato, x0 + (x + 1) * lato, y0 + (y + 1) * lato)
    # partenza: una lucina (cerchio con raggi) nella casella in alto a sinistra
    import math
    cx, cy = x0 + lato / 2, y0 + (rig - 0.5) * lato
    c.setLineWidth(1.6); c.circle(cx, cy, 9)
    for k in range(8):
        a = k * math.pi / 4; c.line(cx + 12 * math.cos(a), cy + 12 * math.sin(a), cx + 17 * math.cos(a), cy + 17 * math.sin(a))
    # arrivo: la stella nella casella in basso a destra
    stella(c, x0 + (col - 0.5) * lato, y0 + lato / 2 - 1, 17)

def pag32(c):
    w = 170; c.drawImage(LOGO, (L - w) / 2, 330, w, w * RAPP, mask=None)

r = PdfReader("in/interno_v02.pdf"); w = PdfWriter()
for n, pagina in enumerate(r.pages, 1):
    if n == 1:
        pulisci(pagina, r, ("LOGO GIOCAMIZI", "da fornire", "[nome collana")); pagina.merge_page(strato(pag1))
    elif n == 2:
        pagina = strato(pag2)
    elif n == 30:
        pulisci(pagina, r, ("A30", "SEGNAPOSTO", "File atteso", "Area 6.54")); pagina.merge_page(strato(pag30))
    elif n == 32:
        pulisci(pagina, r, ("Altri titoli", "[Volume", "[eventuali")); pagina.merge_page(strato(pag32))
    w.add_page(pagina)
w.add_metadata({"/Title": TITOLO, "/Author": "Giorgia Palazzo"})
w.write("out/V01_interno_32p_REVIEW_v05.pdf")
