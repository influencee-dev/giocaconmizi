#!/usr/bin/env python3
"""Un volume della collana Giocamizi per Amazon KDP, da una scheda, con un comando.

  npm run libro -- <codice> [--lavoro <cartella>]        (esempio: npm run libro -- v02)

Legge content/libri/<codice>.json e content/libri/_collana.json. Nella cartella di lavoro (fuori dal repo,
predefinita /tmp/libri/<codice>) si aspetta in/ con il fronte della copertina e le 12 tavole. Produce in out/:
interno, copertina, anteprime e report. Esce con errore, e dice perché, se manca qualcosa o un controllo fallisce.
Procedura e regole: docs/libri-kdp.md.
"""
import argparse, glob, io, json, math, os, random, re, subprocess, sys, tarfile

RADICE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CACHE = os.environ.get("LIBRI_CACHE", "/tmp/libri/_strumenti")
DPI = 300
MAX_DRIVE = 3_000_000          # il connettore Drive carica circa 3 MB per file
CARATTERI = {"londrina-solid": {"latin-900-normal": "londrina-900"},
             "roboto": {"latin-500-normal": "roboto-500", "latin-700-normal": "roboto-700"},
             "poppins": {"latin-400-normal": "poppins-400", "latin-300-italic": "poppins-300i",
                         "latin-600-normal": "poppins-600", "latin-500-normal": "poppins-500"}}
MODELLO = "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.2.4/RealESRGAN_x4plus_anime_6B.pth"
CREMA, NOTTE, BLU, GIALLO = (255, 243, 230), (31, 36, 48), (24, 30, 92), (255, 214, 64)
problemi, avvisi, fatti = [], [], []


def fermati(msg):
    print("\nFERMO: " + msg, file=sys.stderr); sys.exit(2)


# ---------------------------------------------------------------- strumenti (caratteri, modello, librerie)
def prepara_strumenti(serve_modello):
    os.makedirs(CACHE + "/font", exist_ok=True)
    try:
        import PIL, reportlab, pypdf, fontTools  # noqa: F401
    except ImportError:
        subprocess.run([sys.executable, "-m", "pip", "install", "-q", "pillow", "reportlab", "pypdf", "fonttools", "brotli"], check=True)
    from fontTools.ttLib import TTFont
    for pacco, voci in CARATTERI.items():
        if all(os.path.exists(f"{CACHE}/font/{n}.ttf") for n in voci.values()):
            continue
        subprocess.run(["npm", "pack", "--silent", f"@fontsource/{pacco}"], cwd=CACHE + "/font", check=True, stdout=subprocess.DEVNULL)
        with tarfile.open(glob.glob(f"{CACHE}/font/fontsource-{pacco}-*.tgz")[0]) as t:
            for m in t.getmembers():
                for chiave, nome in voci.items():
                    if m.name.endswith(f"{pacco}-{chiave}.woff2"):
                        f = TTFont(io.BytesIO(t.extractfile(m).read())); f.flavor = None; f.save(f"{CACHE}/font/{nome}.ttf")
    if serve_modello:
        try:
            import torch, spandrel  # noqa: F401
        except ImportError:
            subprocess.run([sys.executable, "-m", "pip", "install", "-q", "torch", "spandrel"], check=True)
        if not os.path.exists(CACHE + "/anime6B.pth"):
            subprocess.run(["curl", "-sL", "-o", CACHE + "/anime6B.pth", MODELLO], check=True)


def ingrandisci(ingresso, uscita, lato):
    """Real-ESRGAN 4x in locale (modello per illustrazioni), a tasselli, poi riduzione al lato chiesto."""
    import numpy as np, torch
    from PIL import Image
    from spandrel import ModelLoader
    modello = ModelLoader().load_from_file(CACHE + "/anime6B.pth").eval()
    im = np.asarray(Image.open(ingresso).convert("RGB"), dtype=np.float32) / 255
    h, w, _ = im.shape; S, T, M = modello.scale, 320, 24
    out = np.zeros((h * S, w * S, 3), np.float32)
    with torch.no_grad():
        for y in range(0, h, T):
            for x in range(0, w, T):
                y0, x0, y1, x1 = max(y - M, 0), max(x - M, 0), min(y + T + M, h), min(x + T + M, w)
                r = modello(torch.from_numpy(im[y0:y1, x0:x1]).permute(2, 0, 1)[None])[0].permute(1, 2, 0).clamp(0, 1).numpy()
                hh, ww = (min(y + T, h) - y) * S, (min(x + T, w) - x) * S
                out[y * S:y * S + hh, x * S:x * S + ww] = r[(y - y0) * S:(y - y0) * S + hh, (x - x0) * S:(x - x0) * S + ww]
    Image.fromarray((out * 255).round().astype(np.uint8)).resize((lato, lato), Image.LANCZOS).save(uscita)


# ---------------------------------------------------------------- scheda e file in ingresso
def leggi_scheda(codice):
    percorso = f"{RADICE}/content/libri/{codice.lower()}.json"
    if not os.path.exists(percorso):
        fermati(f"manca la scheda {percorso}. Copia content/libri/_modello.json e compilala.")
    s = json.load(open(percorso, encoding="utf-8")); c = json.load(open(f"{RADICE}/content/libri/_collana.json", encoding="utf-8"))
    manca = [k for k in ("codice", "volume", "anno", "titolo", "titolo_righe", "dedica", "quarta", "scene", "attivita", "parliamone") if not s.get(k)]
    if manca: fermati("nella scheda mancano: " + ", ".join(manca))
    if len(s["scene"]) != 12: fermati(f"le scene devono essere 12, sono {len(s['scene'])}")
    if "".join(s["titolo_righe"]).replace(" ", "").lower() != s["titolo"].replace(" ", "").lower():
        fermati("«titolo_righe» non ricompone esattamente «titolo»")
    for k in ("disegna", "racconta", "labirinto"):
        if not s["attivita"].get(k): fermati(f"manca attivita.{k}")
    def valori(x):
        if isinstance(x, str): yield x
        elif isinstance(x, dict): yield from (v for y in x.values() for v in valori(y))
        elif isinstance(x, list): yield from (v for y in x for v in valori(y))
    for v in valori(s):
        if re.search(r"\[|\]|SEGNAPOSTO|DA CONFERMARE|TODO|\.\.\.", v):
            fermati(f"nella scheda c'è un dato non definitivo: «{v[:60]}»")
    return s, c


def trova_ingressi(cartella):
    from PIL import Image
    immagini = [f for f in sorted(glob.glob(cartella + "/*")) if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))]
    def migliore(candidati):
        return max(candidati, key=lambda f: Image.open(f).size[0]) if candidati else None
    fronte = migliore([f for f in immagini if re.search(r"cover|fronte|copertina", os.path.basename(f), re.I) and "esrgan" not in f.lower()])
    tavole = [migliore([f for f in immagini if re.search(rf"(?<![0-9A-Za-z])S0?{n}(?![0-9])", os.path.basename(f), re.I) and "esrgan" not in f.lower()]) for n in range(1, 13)]
    manca = (["il fronte della copertina (nome con COVER o fronte)"] if not fronte else []) + [f"la tavola S{n:02d}" for n, t in enumerate(tavole, 1) if not t]
    if manca: fermati(f"in {cartella} mancano: " + "; ".join(manca))
    for f in [fronte] + tavole:
        w, h = Image.open(f).size
        if abs(w - h) > 2: fermati(f"{os.path.basename(f)} non è quadrata ({w}×{h}): non si deforma, va rifatta quadrata")
    return fronte, tavole


# ---------------------------------------------------------------- interno
def costruisci_interno(s, c, tavole, uscita, logo_grigio):
    from reportlab.pdfgen import canvas
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.lib.utils import ImageReader
    for nome, f in (("Pop", "poppins-400"), ("PopI", "poppins-300i"), ("PopB", "poppins-600"), ("PopM", "poppins-500")):
        pdfmetrics.registerFont(TTFont(nome, f"{CACHE}/font/{f}.ttf"))
    L = c["formato"]["lato_pollici"] * 72
    k = canvas.Canvas(uscita, pagesize=(L, L), initialFontName="Pop")
    k.setTitle(s["titolo"]); k.setAuthor("Giorgia Palazzo")
    LOGO = ImageReader(logo_grigio); lw, lh = LOGO.getSize()
    M = 30                                             # cornice a 30 punti dal bordo

    def stella(x, y, r, spess=1.1):
        k.setLineWidth(spess); p = k.beginPath()
        for i in range(10):
            a = math.pi / 2 + i * math.pi / 5; rr = r if i % 2 == 0 else r * 0.45
            (p.moveTo if i == 0 else p.lineTo)(x + rr * math.cos(a), y + rr * math.sin(a))
        p.close(); k.drawPath(p)

    def cornice(numero=None, ghirlanda=True):
        k.setStrokeGray(0); k.setFillGray(0); k.setLineWidth(1.6); k.roundRect(M, M, L - 2 * M, L - 2 * M, 18)
        if ghirlanda:
            y0 = L - M - 22; k.setLineWidth(1.1); p = k.beginPath(); p.moveTo(M + 22, y0)
            p.curveTo(L * 0.33, y0 - 26, L * 0.67, y0 - 26, L - M - 22, y0); k.drawPath(p)
            for i in range(7):
                t = (i + 1) / 8; x = M + 22 + t * (L - 2 * M - 44); y = y0 - 26 * 3 * t * (1 - t) - 0.5
                k.setLineWidth(0.9); k.line(x, y, x, y - 12)
                if i % 2 == 0: stella(x, y - 24, 11, 1.4)
                else:
                    k.setLineWidth(1.4); k.circle(x, y - 22, 9); k.line(x - 8, y - 22, x + 8, y - 22)
        if numero:
            stella(M + 26, M + 26, 12); k.setFont("Pop", 7); k.drawCentredString(M + 26, M + 23.5, str(numero))
            stella(L - M - 26, M + 26, 9); stella(L - M - 46, M + 20, 6)

    def a_capo(testo, font, corpo, larghezza):
        righe, riga = [], ""
        for parola in testo.split():
            prova = (riga + " " + parola).strip()
            if pdfmetrics.stringWidth(prova, font, corpo) <= larghezza: riga = prova
            else: righe.append(riga); riga = parola
        return righe + [riga]

    # 1 frontespizio
    cornice(); w = 140; k.drawImage(LOGO, (L - w) / 2, 372, w, w * lh / lw)
    corpo = 30
    while max(pdfmetrics.stringWidth(r, "PopB", corpo) for r in s["titolo_righe"][:1] + [" ".join(s["titolo_righe"][1:])]) > L - 2 * M - 60: corpo -= 1
    k.setFont("PopB", corpo); k.drawCentredString(L / 2, 330, s["titolo_righe"][0]); k.drawCentredString(L / 2, 330 - corpo * 1.25, " ".join(s["titolo_righe"][1:]))
    k.setFont("Pop", 12); k.drawCentredString(L / 2, 248, f"{c['collana']} · Volume {s['volume']}")
    stella(L / 2, 150, 46, 1.6); stella(L / 2 - 110, 128, 20, 1.3); stella(L / 2 + 110, 128, 20, 1.3); k.showPage()
    # 2 dedica e crediti
    k.setFont("PopI", 13)
    for i, r in enumerate(s["dedica"]): k.drawCentredString(L / 2, L / 2 + 10.5 * (len(s["dedica"]) - 1) - 21 * i, r)
    y = 140; k.setFont("PopB", 10.5); k.drawCentredString(L / 2, y, s["titolo"]); y -= 24; k.setFont("Pop", 9.5)
    for r in c["crediti"]: k.drawCentredString(L / 2, y, r.format(anno=s["anno"])); y -= 16
    k.showPage()
    # 3 questo libro è di
    cornice(3); k.setFont("PopB", 24); k.drawCentredString(L / 2, 400, "Questo libro è di")
    k.setLineWidth(1.2); k.line(L / 2 - 150, 330, L / 2 + 150, 330)
    for dx in (-60, 0, 60): stella(L / 2 + dx, 250, 14, 1.3)
    k.showPage()
    # 4-27 dodici coppie testo + tavola
    lato_tav = 531                                     # 7,375 pollici: 2550 px danno 346 dpi
    for n, (testo, tav) in enumerate(zip(s["scene"], tavole)):
        cornice(4 + 2 * n); corpo = 19; larg = L - 2 * M - 110
        righe = a_capo(testo, "Pop", corpo, larg)
        while len(righe) > 9: corpo -= 1; righe = a_capo(testo, "Pop", corpo, larg)
        k.setFont("Pop", corpo); passo = corpo * 1.6; y = L / 2 + passo * (len(righe) - 1) / 2 - corpo * 0.35
        for r in righe: k.drawString(M + 55, y, r); y -= passo
        k.showPage()
        k.drawImage(ImageReader(tav), (L - lato_tav) / 2, (L - lato_tav) / 2, lato_tav, lato_tav); k.showPage()
    # 28 disegna · 29 racconta · 30 labirinto
    def titolo_attivita(t, numero):
        cornice(numero, ghirlanda=False); corpo = 20
        while pdfmetrics.stringWidth(t, "PopB", corpo) > L - 2 * M - 50: corpo -= 1
        k.setFont("PopB", corpo); k.drawCentredString(L / 2, L - M - 52, t)
    titolo_attivita(s["attivita"]["disegna"], 28); k.setLineWidth(1.4); k.roundRect(70, 92, L - 140, 400, 10)
    for x, y in ((70, 92), (L - 70, 92), (70, 492), (L - 70, 492)):
        k.setFillGray(1); stella(x, y, 10, 1.2); k.setFillGray(0)
    k.showPage()
    titolo_attivita(s["attivita"]["racconta"], 29); k.setLineWidth(1.4)
    k.roundRect(70, 300, 220, 190, 10); k.roundRect(L - 290, 300, 220, 190, 10); k.roundRect(L / 2 - 110, 92, 220, 190, 10)
    stella(110, 150, 16, 1.3); stella(L - 110, 150, 16, 1.3); k.showPage()
    titolo_attivita(s["attivita"]["labirinto"], 30)
    col, rig, lato = 9, 7, 52; x0, y0 = (L - col * lato) / 2, 98 + (390 - rig * lato) / 2
    rnd = random.Random(1000 * s["volume"] + 26); visti = {(0, 0)}; pila = [(0, 0)]
    muri = {(x, y, d) for x in range(col) for y in range(rig) for d in "NE"}
    while pila:
        x, y = pila[-1]
        vicini = [(x + dx, y + dy, d) for dx, dy, d in ((0, 1, "N"), (1, 0, "E"), (0, -1, "S"), (-1, 0, "O"))
                  if 0 <= x + dx < col and 0 <= y + dy < rig and (x + dx, y + dy) not in visti]
        if not vicini: pila.pop(); continue
        nx, ny, d = rnd.choice(vicini)
        muri.discard({"N": (x, y, "N"), "E": (x, y, "E"), "S": (nx, ny, "N"), "O": (nx, ny, "E")}[d])
        visti.add((nx, ny)); pila.append((nx, ny))
    k.setLineWidth(2.4); k.setLineCap(1); k.rect(x0, y0, col * lato, rig * lato)
    for x, y, d in muri:
        if d == "N" and y < rig - 1: k.line(x0 + x * lato, y0 + (y + 1) * lato, x0 + (x + 1) * lato, y0 + (y + 1) * lato)
        if d == "E" and x < col - 1: k.line(x0 + (x + 1) * lato, y0 + y * lato, x0 + (x + 1) * lato, y0 + (y + 1) * lato)
    cx, cy = x0 + lato / 2, y0 + (rig - 0.5) * lato; k.setLineWidth(1.6); k.circle(cx, cy, 9)
    for i in range(8): k.line(cx + 12 * math.cos(i * math.pi / 4), cy + 12 * math.sin(i * math.pi / 4), cx + 17 * math.cos(i * math.pi / 4), cy + 17 * math.sin(i * math.pi / 4))
    stella(x0 + (col - 0.5) * lato, y0 + lato / 2 - 1, 17, 1.6); k.showPage()
    # 31 parliamone
    cornice(31, ghirlanda=False); k.setFont("PopB", 22); k.drawCentredString(L / 2, L - M - 52, "Parliamone")
    k.setFont("Pop", 10); k.drawCentredString(L / 2, L - M - 70, "(per i grandi)"); y = 440
    for d in s["parliamone"]:
        stella(84, y + 4, 7, 1.1); k.setFont("PopM", 13)
        for r in a_capo(d, "PopM", 13, L - 200): k.drawString(100, y, r); y -= 19
        k.setLineWidth(0.8)
        for _ in range(2): y -= 16; k.line(100, y, L - 90, y)
        y -= 44
    k.showPage()
    # 32 colophon
    cornice(32); w = 170; k.drawImage(LOGO, (L - w) / 2, 320, w, w * lh / lw)
    k.setFont("PopM", 14); k.drawCentredString(L / 2, 250, c["sito"]); stella(L / 2, 150, 24, 1.4); k.showPage()
    k.save()


# ---------------------------------------------------------------- copertina
def costruisci_copertina(s, c, fronte, cartella_out, cod):
    from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageStat
    f = c["formato"]; TRIM, ABB = f["lato_pollici"], f["abbondanza_pollici"]; DORSO = f["pagine"] * f["spessore_pagina_pollici"]
    px = lambda p: round(p * DPI)
    W, H = px(ABB + TRIM + DORSO + TRIM + ABB), px(TRIM + 2 * ABB)
    XR0, XR1, XF0, XF1, Y0, Y1 = px(ABB), px(ABB + TRIM), px(ABB + TRIM + DORSO), px(ABB + 2 * TRIM + DORSO), px(ABB), px(ABB + TRIM)
    SIC = px(0.375); F = lambda n, corpo: ImageFont.truetype(f"{CACHE}/font/{n}.ttf", corpo)
    arte = Image.open(fronte).convert("RGB").resize((H, H), Image.LANCZOS)
    logo = Image.open(f"{RADICE}/{c['logo']}").convert("RGBA")
    tela = Image.new("RGB", (W, H), NOTTE)
    retro = ImageEnhance.Brightness(arte.transpose(Image.FLIP_LEFT_RIGHT).filter(ImageFilter.GaussianBlur(46))).enhance(0.62)
    retro = Image.blend(retro, Image.new("RGB", retro.size, BLU), 0.38)
    tela.paste(retro, (W - 2 * H, 0)); tela.paste(arte, (W - H, 0))
    chiaro = lambda zona: ImageStat.Stat(tela.crop(zona).convert("L")).mean[0] > 150

    def scritta(xy, testo, font, colore, ancora="la", ombra=False, bordo=None, spess=0):
        if ombra:
            st = Image.new("RGBA", tela.size, (0, 0, 0, 0))
            ImageDraw.Draw(st).text((xy[0] + 6, xy[1] + 10), testo, font=font, fill=(10, 14, 50, 150), anchor=ancora)
            st = st.filter(ImageFilter.GaussianBlur(10)); tela.paste(st, (0, 0), st)
        ImageDraw.Draw(tela).text(xy, testo, font=font, fill=colore, anchor=ancora, stroke_width=spess, stroke_fill=bordo)

    # fronte: logo in alto a destra, titolo in alto a sinistra adattato allo spazio, firma in basso
    lw = 690; lh = round(lw * logo.height / logo.width); lx = XF1 - SIC - lw + 30
    lg = logo.resize((lw, lh), Image.LANCZOS); tela.paste(lg, (lx, Y0 + SIC - 60), lg)
    x_t, y_t = XF0 + SIC, Y0 + SIC - 40
    righe = [r.upper() for r in s["titolo_righe"]]; corpi = []
    for i, r in enumerate(righe):
        corpo, spazio = (258 if i == 0 else 214), ((lx - 40 - x_t) if i == 0 else (XF1 - SIC - x_t) * 0.62)
        while F("londrina-900", corpo).getlength(r) > spazio: corpo -= 4
        corpi.append(corpo)
    if len(corpi) > 2: corpi[1:] = [min(corpi[1:])] * (len(corpi) - 1)
    alto_chiaro = chiaro((x_t, y_t, x_t + 1400, y_t + 600))
    if alto_chiaro: avvisi.append("La parte alta del fronte è chiara: titolo scritto in blu. Guardare l'anteprima.")
    for i, (r, corpo) in enumerate(zip(righe, corpi)):
        scritta((x_t, y_t), r, F("londrina-900", corpo), BLU if alto_chiaro else (GIALLO if i == 0 else CREMA), ombra=not alto_chiaro)
        y_t += round(corpo * 0.93)
    cxf = (XF0 + XF1) // 2 + 150; zona = (cxf - 800, Y1 - SIC - 170, cxf + 800, Y1 - SIC)
    scuro = not chiaro(zona); col, bordo = (CREMA, BLU) if scuro else (BLU, (255, 255, 255))
    scritta((cxf, Y1 - SIC - 108), c["firma"][0], F("roboto-700", 56), col, "ms", bordo=bordo, spess=5)
    scritta((cxf, Y1 - SIC - 12), c["firma"][1], F("roboto-700", 84), col, "ms", bordo=bordo, spess=6)
    # quarta: logo, testo, foto e storia, riquadro del codice a barre
    cx = (XR0 + XR1) // 2; bw = 860; bh = round(bw * logo.height / logo.width)
    lg = logo.resize((bw, bh), Image.LANCZOS); tela.paste(lg, (cx - bw // 2, Y0 + SIC - 20), lg)
    y = Y0 + SIC + bh + 40; fq = F("roboto-500", 68)
    def righe_pari(par, larg_max=1700):
        def spezza(larg):
            out, riga = [], ""
            for parola in par.split():
                prova = (riga + " " + parola).strip()
                if fq.getlength(prova) <= larg: riga = prova
                else: out.append(riga); riga = parola
            return out + [riga]
        base = spezza(larg_max); larg = larg_max
        while larg > 900 and len(spezza(larg - 40)) == len(base): larg -= 40
        return spezza(larg)
    for par in s["quarta"]:
        for riga in righe_pari(par): scritta((cx, y), riga, fq, CREMA, "ma", ombra=True); y += 98
        y += 50
    D = 470; cb_w, cb_h = px(2.0), px(1.2); cb_x1, cb_y1 = XR1 - px(0.25), Y1 - px(0.25)
    fy = Y1 - SIC - D + 20
    if y - 50 > fy - 40: problemi.append("Il testo di quarta è troppo lungo: arriva sulla foto e sulla storia. Accorciarlo.")
    ImageDraw.Draw(tela).rectangle((cb_x1 - cb_w, cb_y1 - cb_h, cb_x1, cb_y1), fill=(255, 255, 255))
    foto = Image.open(f"{RADICE}/{c['foto_autrici']}").convert("RGB"); lato = min(foto.size)
    foto = foto.crop(((foto.width - lato) // 2, 0, (foto.width - lato) // 2 + lato, lato)).resize((D, D), Image.LANCZOS)
    m = Image.new("L", (D * 4, D * 4), 0); ImageDraw.Draw(m).ellipse((0, 0, D * 4 - 1, D * 4 - 1), fill=255); m = m.resize((D, D), Image.LANCZOS)
    fx = XR0 + SIC; ImageDraw.Draw(tela).ellipse((fx - 10, fy - 10, fx + D + 10, fy + D + 10), fill=CREMA); tela.paste(foto, (fx, fy), m)
    tx, ty = fx + D + 60, fy + 20
    scritta((tx, ty), c["storia_titolo"].upper(), F("londrina-900", 78), GIALLO, ombra=True); ty += 104
    for r in c["storia"]: scritta((tx, ty), r, F("roboto-500", 47), CREMA, ombra=True); ty += 66
    base = f"{cartella_out}/{cod}_copertina_wrap"; q = 92
    while True:
        tela.save(base + ".pdf", "PDF", resolution=DPI, quality=q)
        if os.path.getsize(base + ".pdf") <= MAX_DRIVE or q <= 78: break
        q -= 4
    g = tela.copy(); gd = ImageDraw.Draw(g)
    for a, b in ((XR0, XR1), (XF0, XF1)):
        gd.rectangle((a, Y0, b, Y1), outline=(255, 0, 0), width=5); gd.rectangle((a + SIC, Y0 + SIC, b - SIC, Y1 - SIC), outline=(0, 220, 0), width=4)
    gd.rectangle((XR1, 0, XF0, H), outline=(255, 220, 0), width=3); gd.rectangle((cb_x1 - cb_w, cb_y1 - cb_h, cb_x1, cb_y1), outline=(0, 160, 255), width=6)
    g.resize((W // 3, H // 3), Image.LANCZOS).save(f"{cartella_out}/{cod}_copertina_anteprima_guide.jpg", quality=88)
    tela.resize((W // 3, H // 3), Image.LANCZOS).save(f"{cartella_out}/{cod}_copertina_anteprima.jpg", quality=90)
    return base + ".pdf", (W / DPI, H / DPI, DORSO)


# ---------------------------------------------------------------- controlli
def controlla(s, c, interno, copertina, misure, tavole, fronte_px):
    from pypdf import PdfReader
    from PIL import Image
    L = c["formato"]["lato_pollici"] * 72; r = PdfReader(interno)
    def esito(ok, testo): (fatti if ok else problemi).append(testo)
    esito(len(r.pages) == c["formato"]["pagine"], f"Interno: {len(r.pages)} pagine (attese {c['formato']['pagine']})")
    esito(all(abs(float(p.mediabox.width) - L) < 0.5 and abs(float(p.mediabox.height) - L) < 0.5 for p in r.pages), "Interno: tutte le pagine 8,5 × 8,5 pollici")
    font = set()
    for p in r.pages:
        for f in (p.get("/Resources", {}).get("/Font", {}) or {}).values(): font.add(str(f.get_object().get("/BaseFont")))
    esito(all("+" in f for f in font), "Interno: caratteri tutti incorporati (" + ", ".join(sorted(f.split('+')[-1] for f in font)) + ")")
    testo = "\n".join(p.extract_text() for p in r.pages)
    esito(not re.search(r"\[|SEGNAPOSTO|DA CONFERMARE|TODO", testo), "Interno: nessun segnaposto nel testo")
    piatto = re.sub(r"\s+", "", testo)
    esito(all(re.sub(r"\s+", "", sc) in piatto for sc in s["scene"]), "Interno: i 12 testi sono identici alla scheda")
    minimo = min(Image.open(t).size[0] for t in tavole); dpi = minimo / 7.375
    esito(dpi >= 300, f"Tavole: lato minimo {minimo} px = {dpi:.0f} dpi stampati a 7,375 pollici")
    cp = PdfReader(copertina).pages[0].mediabox; w, h = float(cp.width) / 72, float(cp.height) / 72
    esito(abs(w - misure[0]) < 0.01 and abs(h - misure[1]) < 0.01, f"Copertina: {w:.3f} × {h:.3f} pollici, dorso {misure[2]:.4f} pollici, senza testo sul dorso")
    esito(fronte_px >= round(misure[1] * DPI), f"Copertina: fronte a {fronte_px} px = {fronte_px / misure[1]:.0f} dpi")
    for f in (interno, copertina):
        peso = os.path.getsize(f)
        (fatti if peso <= MAX_DRIVE else avvisi).append(f"{os.path.basename(f)}: {peso / 1e6:.1f} MB" + ("" if peso <= MAX_DRIVE else " (oltre i 3 MB: su Drive non si carica dal connettore, va consegnato a Giorgia in chat)"))


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("codice"); ap.add_argument("--lavoro"); a = ap.parse_args()
    s, c = leggi_scheda(a.codice); cod = s["codice"]; lavoro = a.lavoro or f"/tmp/libri/{cod.lower()}"
    os.makedirs(lavoro + "/in", exist_ok=True); os.makedirs(lavoro + "/out", exist_ok=True)
    fronte, tavole = trova_ingressi(lavoro + "/in")
    from PIL import Image
    lato_cop = round((c["formato"]["lato_pollici"] + 2 * c["formato"]["abbondanza_pollici"]) * DPI)
    piccole = [t for t in tavole if Image.open(t).size[0] < 2213]; fronte_piccolo = Image.open(fronte).size[0] < lato_cop
    prepara_strumenti(serve_modello=bool(piccole) or fronte_piccolo)
    if fronte_piccolo:
        nuovo = f"{lavoro}/out/{cod}_fronte_DERIVATO_{lato_cop}px_esrgan.png"
        if not os.path.exists(nuovo): ingrandisci(fronte, nuovo, lato_cop)
        avvisi.append(f"Fronte ingrandito da {Image.open(fronte).size[0]} a {lato_cop} px con Real-ESRGAN: è un derivato, confrontarlo da vicino con l'originale.")
        fronte = nuovo
    for i, t in enumerate(tavole):
        if t in piccole:
            nuovo = f"{lavoro}/out/{cod}_S{i + 1:02d}_DERIVATO_2550px_esrgan.png"
            if not os.path.exists(nuovo): ingrandisci(t, nuovo, 2550)
            Image.open(nuovo).convert("L").save(nuovo)
            avvisi.append(f"Tavola S{i + 1:02d} ingrandita a 2550 px con Real-ESRGAN: derivato, da guardare."); tavole[i] = nuovo
    logo = Image.open(f"{RADICE}/{c['logo']}").convert("RGBA"); bianco = Image.new("RGBA", logo.size, (255, 255, 255, 255)); bianco.alpha_composite(logo)
    logo_grigio = f"{lavoro}/out/_logo_grigio.png"; bianco.convert("L").resize((760, round(760 * logo.height / logo.width)), Image.LANCZOS).save(logo_grigio)
    tav_grigie = []
    for i, t in enumerate(tavole):
        g = f"{lavoro}/out/_tav{i + 1:02d}.png"; Image.open(t).convert("L").save(g, optimize=True); tav_grigie.append(g)
    interno = f"{lavoro}/out/{cod}_interno_32p.pdf"; costruisci_interno(s, c, tav_grigie, interno, logo_grigio)
    copertina, misure = costruisci_copertina(s, c, fronte, lavoro + "/out", cod)
    controlla(s, c, interno, copertina, misure, tavole, Image.open(fronte).size[0])
    subprocess.run(["pdftoppm", "-r", "30", "-png", interno, f"{lavoro}/out/_p"], check=False)
    pagine = sorted(glob.glob(f"{lavoro}/out/_p-*.png"))
    if pagine:
        w, h = Image.open(pagine[0]).size; prov = Image.new("RGB", (w * 8 + 54, h * 4 + 30), (120, 120, 120))
        for i, p in enumerate(pagine): prov.paste(Image.open(p), (6 + (i % 8) * (w + 6), 6 + (i // 8) * (h + 6)))
        prov.save(f"{lavoro}/out/{cod}_interno_provino.png")
    for f in glob.glob(f"{lavoro}/out/_*"): os.remove(f)
    stato = "FERMO" if problemi else "REVIEW"
    righe = [f"{cod} · {s['titolo']} · REPORT", f"STATO: {stato}" + (" (pronto per l'approvazione di Giorgia, poi anteprima KDP e copia di prova)" if not problemi else ""), "",
             "CONTROLLI PASSATI"] + ["- " + x for x in fatti] + ["", "DA GUARDARE"] + (["- " + x for x in avvisi] or ["- niente"]) + ["", "PROBLEMI"] + (["- " + x for x in problemi] or ["- nessuno"]) + [
             "", "SU KDP si caricano due file separati: l'interno e la copertina.",
             "Impostazioni: copertina morbida, 8,5 × 8,5 pollici, interno bianco e nero su carta bianca senza abbondanza, copertina lucida, 32 pagine."]
    open(f"{lavoro}/out/{cod}_report.txt", "w", encoding="utf-8").write("\n".join(righe) + "\n")
    print("\n".join(righe)); print(f"\nFile in {lavoro}/out")
    sys.exit(1 if problemi else 0)


if __name__ == "__main__":
    main()
