"""Copertina wrap KDP · V01 · bozza REVIEW. Uso: python3 copertina.py"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
DPI = 300
PAGINE = 32
TRIM = 8.5                      # pollici, quadrato
ABB = 0.125                     # abbondanza KDP
DORSO = PAGINE * 0.002252       # carta bianca, interno B/N (formula KDP)
LARG = ABB + TRIM + DORSO + TRIM + ABB
ALT = ABB + TRIM + ABB
px = lambda pollici: round(pollici * DPI)
W, H = px(LARG), px(ALT)
X_RETRO0, X_RETRO1 = px(ABB), px(ABB + TRIM)
X_FRONTE0, X_FRONTE1 = px(ABB + TRIM + DORSO), px(ABB + TRIM + DORSO + TRIM)
Y0, Y1 = px(ABB), px(ABB + TRIM)
SIC = px(0.375)                 # margine di sicurezza per testi e logo
CREMA, NOTTE = (255, 243, 230), (31, 36, 48)
F = lambda nome, corpo: ImageFont.truetype(f"font/{nome}.ttf", corpo)
LONDRINA, ROBOTO, ROBOTO7 = "londrina-900", "roboto-500", "roboto-700"

TITOLO = ["Mizi e la stella", "che non voleva", "accendersi"]
AUTORI = "Giorgia Palazzo e Domiziana Bonaccorso"
STORIA_TITOLO = "La nostra storia"
STORIA = [
    "Domi non aveva voglia di fare i compiti.",
    "Per spronarla ho iniziato a giocarci insieme,",
    "e da lì è nato Giocamizi. La pinguina l'ha voluta",
    "Domi: le abbiamo dato i suoi capelli, e il nome",
    "è un pezzetto del suo. Domiziana, Mizi.",
]
QUARTA = [
    "È la Vigilia di Natale e in cima al grande albero",
    "la stella non vuole accendersi.",
    "",
    "Mizi le prova tutte, poi scopre il perché:",
    "lassù, tutta sola, la stellina ha paura del buio.",
    "Con Tobia, Lilla e Nocciola, e con quattro",
    "piccole lanterne, le prepara una sorpresa.",
    "",
    "Una storia da leggere insieme e da colorare.",
]

arte = Image.open("in/fronte_2625_esrgan.png").convert("RGB").resize((H, H), Image.LANCZOS)
logo = Image.open("in/logo.png").convert("RGBA")
tela = Image.new("RGB", (W, H), NOTTE)

# Retro: lo stesso fronte specchiato, sfocato e scurito (nessuna immagine nuova)
retro = arte.transpose(Image.FLIP_LEFT_RIGHT).filter(ImageFilter.GaussianBlur(46))
retro = ImageEnhance.Brightness(retro).enhance(0.62)
velo = Image.new("RGB", retro.size, (24, 30, 92))
retro = Image.blend(retro, velo, 0.38)
x_arte = W - H
tela.paste(retro, (x_arte - H, 0))
tela.paste(arte, (x_arte, 0))
d = ImageDraw.Draw(tela)

def scritta(xy, testo, font, colore, bordo=None, spess=0, ombra=False, ancora="la"):
    if ombra:
        strato = Image.new("RGBA", tela.size, (0, 0, 0, 0))
        ImageDraw.Draw(strato).text((xy[0] + 6, xy[1] + 10), testo, font=font, fill=(10, 14, 50, 150),
                                    anchor=ancora, stroke_width=spess, stroke_fill=(10, 14, 50, 150))
        tela.paste(strato.filter(ImageFilter.GaussianBlur(10)), (0, 0), strato.filter(ImageFilter.GaussianBlur(10)))
    ImageDraw.Draw(tela).text(xy, testo, font=font, fill=colore, anchor=ancora, stroke_width=spess, stroke_fill=bordo)

# Fronte: titolo in maiuscolo, lettere piene come ritagliate a mano, senza bordo
x_t, y_t = X_FRONTE0 + SIC, Y0 + SIC - 40
GIALLO = (255, 214, 64)
for riga, corpo, passo, colore in zip(TITOLO, (258, 214, 214), (236, 200, 200), (GIALLO, CREMA, CREMA)):
    scritta((x_t, y_t), riga.upper(), F(LONDRINA, corpo), colore, ombra=True)
    y_t += passo
# Logo originale in alto a destra, sopra la stellina
lw = 690; lh = round(lw * logo.height / logo.width)
tela.paste(logo.resize((lw, lh), Image.LANCZOS), (X_FRONTE1 - SIC - lw + 30, Y0 + SIC - 60), logo.resize((lw, lh), Image.LANCZOS))
# Firma in basso, sulla neve
cxf = (X_FRONTE0 + X_FRONTE1) // 2 + 150
scritta((cxf, Y1 - SIC - 108), "UN LIBRO DI", F(ROBOTO7, 56), (24, 30, 92), bordo=(255, 255, 255), spess=5, ancora="ms")
scritta((cxf, Y1 - SIC - 12), AUTORI, F(ROBOTO7, 84), (24, 30, 92), bordo=(255, 255, 255), spess=6, ancora="ms")

# Retro: logo, testo di quarta, la nostra storia con la foto, riquadro per il codice a barre
cx = (X_RETRO0 + X_RETRO1) // 2
bw = 860; bh = round(bw * logo.height / logo.width)
tela.paste(logo.resize((bw, bh), Image.LANCZOS), (cx - bw // 2, Y0 + SIC - 20), logo.resize((bw, bh), Image.LANCZOS))
y = Y0 + SIC + bh + 40
for riga in QUARTA:
    if riga:
        scritta((cx, y), riga, F(ROBOTO, 68), CREMA, ancora="ma", ombra=True)
    y += 98 if riga else 50
cb_w, cb_h = px(2.0), px(1.2)
cb_x1, cb_y1 = X_RETRO1 - px(0.25), Y1 - px(0.25)
ImageDraw.Draw(tela).rectangle((cb_x1 - cb_w, cb_y1 - cb_h, cb_x1, cb_y1), fill=(255, 255, 255))
# Foto vera (quella della pagina Chi siamo) in un tondo, con la storia accanto
D = 470
foto = Image.open("in/giorgia-e-domiziana-giocamizi.webp").convert("RGB")
lato = min(foto.size); foto = foto.crop(((foto.width - lato) // 2, 0, (foto.width - lato) // 2 + lato, lato)).resize((D, D), Image.LANCZOS)
masch = Image.new("L", (D * 4, D * 4), 0); ImageDraw.Draw(masch).ellipse((0, 0, D * 4 - 1, D * 4 - 1), fill=255); masch = masch.resize((D, D), Image.LANCZOS)
fx, fy = X_RETRO0 + SIC, Y1 - SIC - D + 20
ImageDraw.Draw(tela).ellipse((fx - 10, fy - 10, fx + D + 10, fy + D + 10), fill=CREMA)
tela.paste(foto, (fx, fy), masch)
tx, ty = fx + D + 60, fy + 20
scritta((tx, ty), STORIA_TITOLO.upper(), F(LONDRINA, 78), (255, 214, 64), ombra=True)
ty += 104
for riga in STORIA:
    scritta((tx, ty), riga, F(ROBOTO, 47), CREMA, ombra=True); ty += 66

tela.save("out/V01_copertina_wrap_REVIEW_v05.png")
tela.save("out/V01_copertina_wrap_REVIEW_v05.pdf", "PDF", resolution=DPI, quality=90)

# Anteprima con le guide: rifilo (rosso), sicurezza (verde), dorso (giallo), codice a barre (azzurro)
g = tela.copy(); gd = ImageDraw.Draw(g)
for x0, x1 in ((X_RETRO0, X_RETRO1), (X_FRONTE0, X_FRONTE1)):
    gd.rectangle((x0, Y0, x1, Y1), outline=(255, 0, 0), width=5)
    gd.rectangle((x0 + SIC, Y0 + SIC, x1 - SIC, Y1 - SIC), outline=(0, 220, 0), width=4)
gd.rectangle((X_RETRO1, 0, X_FRONTE0, H), outline=(255, 220, 0), width=3)
gd.rectangle((cb_x1 - cb_w, cb_y1 - cb_h, cb_x1, cb_y1), outline=(0, 160, 255), width=6)
g.resize((W // 3, H // 3), Image.LANCZOS).save("out/V01_copertina_anteprima_guide_v05.jpg", quality=88)
tela.resize((W // 3, H // 3), Image.LANCZOS).save("out/V01_copertina_anteprima_v05.jpg", quality=90)
tela.crop((X_FRONTE0, Y0, X_FRONTE1, Y1)).resize((1275, 1275), Image.LANCZOS).save("out/V01_fronte_rifilato_v05.jpg", quality=90)
tela.crop((X_RETRO0, Y0, X_RETRO1, Y1)).resize((1275, 1275), Image.LANCZOS).save("out/V01_retro_rifilato_v05.jpg", quality=90)
print(f"tela {W}x{H}px = {W/DPI:.3f}x{H/DPI:.3f} in · dorso {DORSO:.4f} in = {DORSO*25.4:.2f} mm · fronte {arte.width/ALT:.0f} dpi (ingrandito 4x con Real-ESRGAN da 1254 px e ridotto)")
