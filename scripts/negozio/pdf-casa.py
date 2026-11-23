#!/usr/bin/env python3
"""I PDF del negozio, da stampare a casa, partendo dall'interno del libro (docs/negozio.md).

Il libro della collana è quadrato (8,5 × 8,5 pollici, 32 pagine): le pagine 5, 7, … 27
sono le dodici tavole, le pari prima di ognuna il testo. Da quell'unico PDF escono:

  libretto-A4.pdf         il libro intero, una pagina quadrata per foglio A4
  libretto-A5.pdf         il libro a doppie pagine: due pagine per foglio A4 orizzontale,
                          testo a sinistra e disegno a destra, linea di taglio al centro
  disegni-A4.pdf          solo i dodici disegni, uno per foglio A4
  disegni-A5.pdf          solo i disegni, due per foglio A4 orizzontale da tagliare
  disegno-NN-A4.pdf       ogni disegno da solo (NN = 01…12)
  anteprime/disegno-NN.webp   anteprime piccole per la pagina del negozio (480 px)
  report.txt              pagine, misure, pesi e risoluzione delle tavole

Uso:
  python3 scripts/negozio/pdf-casa.py --interno V01_interno_32p.pdf --codice v01 \\
      --titolo "Mizi e la stella che non voleva accendersi" [--uscita /tmp/negozio/v01] [--carica]

Con --carica i file vanno negli archivi di Supabase («negozio», privato, e
«negozio-anteprime», pubblico): serve SUPABASE_SERVICE_ROLE_KEY nell'ambiente.
PDF e immagini non entrano mai nel repo (è pubblico).
"""

from __future__ import annotations

import argparse
import io
import os
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from pypdf import PageObject, PdfReader, PdfWriter, Transformation
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

RADICE = Path(__file__).resolve().parents[2]
CARATTERI = RADICE / "lib/social/caratteri"
pdfmetrics.registerFont(TTFont("Nunito", str(CARATTERI / "nunito-600.ttf")))
pdfmetrics.registerFont(TTFont("NunitoBold", str(CARATTERI / "nunito-800.ttf")))

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").strip() or "https://wrkderhcbzlppkveknyd.supabase.co"
PAGINE_TAVOLE = list(range(5, 28, 2))  # 5, 7, … 27 (numeri di pagina da 1)
NOTA = "giocamizi.it · per la famiglia e la classe, non si rivende"


def ferma(testo: str) -> None:
    print(f"FERMO: {testo}", file=sys.stderr)
    sys.exit(1)


# ---------- il libro su fogli A4 (vettoriale: i testi restano testi) ----------

def fondo(larghezza: float, altezza: float, taglio: bool) -> PageObject:
    """Un foglio con la nota in basso (e la linea di taglio al centro, se serve)."""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(larghezza, altezza))
    c.setFont("Nunito", 7.5)
    c.setFillGray(0.45)
    if taglio:
        c.setDash(2, 4)
        c.setLineWidth(0.4)
        c.setStrokeGray(0.6)
        c.line(larghezza / 2, 6 * mm, larghezza / 2, altezza - 6 * mm)
        for meta in (0, 1):
            c.drawCentredString(larghezza / 4 + meta * larghezza / 2, 7 * mm, NOTA)
    else:
        c.drawCentredString(larghezza / 2, 8 * mm, NOTA)
    c.showPage()
    c.save()
    return PdfReader(io.BytesIO(buf.getvalue())).pages[0]


def libretto_a4(libro: PdfReader, uscita: Path) -> None:
    w, h = A4
    lato = w - 2 * 14 * mm
    out = PdfWriter()
    for src in libro.pages:
        s = lato / float(src.mediabox.width)
        foglio = PageObject.create_blank_page(width=w, height=h)
        foglio.merge_page(fondo(w, h, False))
        foglio.merge_transformed_page(src, Transformation().scale(s).translate((w - lato) / 2, (h - lato) / 2 + 4 * mm))
        out.add_page(foglio)
    out.write(uscita / "libretto-A4.pdf")


def libretto_a5(libro: PdfReader, uscita: Path) -> None:
    """Doppie pagine come nel libro: (–,1) (2,3) (4,5) … (32,–)."""
    w, h = landscape(A4)
    meta = w / 2
    lato = meta - 2 * 10 * mm
    pagine = list(libro.pages)
    coppie = [(None, 0)] + [(i, i + 1 if i + 1 < len(pagine) else None) for i in range(1, len(pagine), 2)]
    out = PdfWriter()
    for sinistra, destra in coppie:
        foglio = PageObject.create_blank_page(width=w, height=h)
        foglio.merge_page(fondo(w, h, True))
        for lato_foglio, indice in ((0, sinistra), (1, destra)):
            if indice is None:
                continue
            src = pagine[indice]
            s = lato / float(src.mediabox.width)
            x = lato_foglio * meta + (meta - lato) / 2
            foglio.merge_transformed_page(src, Transformation().scale(s).translate(x, (h - lato) / 2 + 3 * mm))
        out.add_page(foglio)
    out.write(uscita / "libretto-A5.pdf")


# ---------- i disegni da colorare ----------

def tavole(libro: PdfReader) -> list[Image.Image]:
    if len(libro.pages) != 32:
        ferma(f"l'interno ha {len(libro.pages)} pagine, ne servono 32 (la collana è fissa).")
    elenco = []
    for n in PAGINE_TAVOLE:
        imm = libro.pages[n - 1].images
        if len(imm) != 1:
            ferma(f"a pagina {n} mi aspetto una sola tavola, ne trovo {len(imm)}.")
        im = imm[0].image.convert("L")
        if im.width != im.height:
            ferma(f"la tavola di pagina {n} non è quadrata ({im.width}×{im.height}).")
        elenco.append(im)
    return elenco


def foglio_disegno(c: canvas.Canvas, im: Image.Image, x0: float, larghezza: float, altezza: float,
                   titolo: str, n: int, totale: int, margine: float) -> None:
    lato = larghezza - 2 * margine
    y = (altezza - lato) / 2 + 3 * mm
    c.drawImage(ImageReader(im), x0 + margine, y, lato, lato)
    grande = larghezza > 160 * mm
    c.setFillGray(0.1)
    c.setFont("NunitoBold", 12 if grande else 9.5)
    c.drawCentredString(x0 + larghezza / 2, y + lato + 6 * mm, titolo)
    c.setFont("Nunito", 9.5 if grande else 8)
    c.drawString(x0 + margine, y - 8 * mm, "Colorato da " + "_" * (28 if grande else 18))
    c.setFillGray(0.45)
    c.drawRightString(x0 + larghezza - margine, y - 8 * mm, f"disegno {n} di {totale} · giocamizi.it")


def disegni_a4(ims: list[Image.Image], titolo: str, percorso: Path, numeri: list[int]) -> None:
    w, h = A4
    c = canvas.Canvas(str(percorso), pagesize=A4)
    c.setTitle(titolo)
    for n in numeri:
        foglio_disegno(c, ims[n - 1], 0, w, h, titolo, n, len(ims), 12 * mm)
        c.showPage()
    c.save()


def disegni_a5(ims: list[Image.Image], titolo: str, percorso: Path) -> None:
    w, h = landscape(A4)
    c = canvas.Canvas(str(percorso), pagesize=(w, h))
    c.setTitle(titolo)
    for i in range(0, len(ims), 2):
        for k in (0, 1):
            if i + k < len(ims):
                foglio_disegno(c, ims[i + k], k * w / 2, w / 2, h, titolo, i + k + 1, len(ims), 10 * mm)
        c.setDash(2, 4)
        c.setLineWidth(0.4)
        c.setStrokeGray(0.6)
        c.line(w / 2, 6 * mm, w / 2, h - 6 * mm)
        c.setDash()
        c.showPage()
    c.save()


def anteprime(ims: list[Image.Image], cartella: Path) -> None:
    cartella.mkdir(parents=True, exist_ok=True)
    carattere = ImageFont.truetype(str(CARATTERI / "nunito-800.ttf"), 20)
    for n, im in enumerate(ims, 1):
        a = im.convert("RGB").resize((480, 480), Image.LANCZOS)
        d = ImageDraw.Draw(a)
        testo = "ANTEPRIMA · giocamizi.it"
        lw = d.textlength(testo, font=carattere)
        d.rounded_rectangle((480 - lw - 26, 444, 470, 474), radius=10, fill=(155, 109, 214))
        d.text((480 - lw - 16, 447), testo, font=carattere, fill="white")
        a.save(cartella / f"disegno-{n:02d}.webp", "WEBP", quality=72, method=6)


# ---------- caricamento su Supabase Storage ----------

def carica(file: Path, contenitore: str, percorso: str, tipo: str) -> None:
    chiave = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if not chiave:
        ferma("per --carica serve SUPABASE_SERVICE_ROLE_KEY nell'ambiente.")
    req = urllib.request.Request(
        f"{SUPABASE_URL}/storage/v1/object/{contenitore}/{percorso}",
        data=file.read_bytes(),
        method="POST",
        headers={"Authorization": f"Bearer {chiave}", "apikey": chiave, "Content-Type": tipo, "x-upsert": "true"},
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        if r.status >= 300:
            ferma(f"caricamento di {percorso} non riuscito ({r.status}).")
    print(f"  caricato {contenitore}/{percorso}")


def main() -> None:
    a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("--interno", required=True, help="il PDF dell'interno del libro (32 pagine quadrate)")
    a.add_argument("--codice", required=True, help="il codice del volume, es. v01 (come in content/negozio/catalogo.json)")
    a.add_argument("--titolo", required=True)
    a.add_argument("--uscita", help="cartella di lavoro (predefinita /tmp/negozio/<codice>)")
    a.add_argument("--carica", action="store_true", help="carica i file negli archivi di Supabase")
    o = a.parse_args()

    if not o.codice.startswith("v") or not o.codice[1:].isdigit():
        ferma("il codice è «v» più il numero del volume, es. v01.")
    uscita = Path(o.uscita or f"/tmp/negozio/{o.codice}")
    uscita.mkdir(parents=True, exist_ok=True)
    libro = PdfReader(o.interno)

    ims = tavole(libro)
    libretto_a4(libro, uscita)
    libretto_a5(libro, uscita)
    disegni_a4(ims, o.titolo, uscita / "disegni-A4.pdf", list(range(1, len(ims) + 1)))
    disegni_a5(ims, o.titolo, uscita / "disegni-A5.pdf")
    for n in range(1, len(ims) + 1):
        disegni_a4(ims, o.titolo, uscita / f"disegno-{n:02d}-A4.pdf", [n])
    anteprime(ims, uscita / "anteprime")

    righe = [f"Volume {o.codice} · {o.titolo}", f"Interno: {o.interno}, {len(libro.pages)} pagine"]
    dpi_a4 = min(im.width for im in ims) / ((A4[0] - 24 * mm) / 72)
    dpi_a5 = min(im.width for im in ims) / ((landscape(A4)[0] / 2 - 20 * mm) / 72)
    righe.append(f"Tavole: {len(ims)}, {ims[0].width}×{ims[0].height} px → {dpi_a4:.0f} dpi in A4, {dpi_a5:.0f} dpi in A5")
    problemi = []
    if dpi_a4 < 300:
        problemi.append(f"tavole sotto i 300 dpi in A4 ({dpi_a4:.0f})")
    for f in sorted(uscita.glob("*.pdf")):
        pagine = len(PdfReader(f).pages)
        kb = f.stat().st_size // 1024
        righe.append(f"{f.name}: {pagine} pagine, {kb} KB")
        if kb > 20 * 1024:
            problemi.append(f"{f.name} supera i 20 MB dell'archivio")
    righe.append("PROBLEMI: " + "; ".join(problemi) if problemi else "Controlli: tutto in ordine")
    (uscita / "report.txt").write_text("\n".join(righe) + "\n", encoding="utf-8")
    print("\n".join(righe))
    if problemi:
        sys.exit(1)

    if o.carica:
        for f in sorted(uscita.glob("*.pdf")):
            carica(f, "negozio", f"{o.codice}/{f.name}", "application/pdf")
        for f in sorted((uscita / "anteprime").glob("*.webp")):
            carica(f, "negozio-anteprime", f"{o.codice}/{f.name}", "image/webp")


if __name__ == "__main__":
    main()
