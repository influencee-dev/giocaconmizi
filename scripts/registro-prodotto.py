# Il «Piano editoriale Giocamizi» per Drive: un file Excel con quattro schede
# (Drive lo converte in Foglio Google), ricostruito ogni volta dal repo.
#
#   00 Leggimi e prompt  come si legge il file + il prompt per fare il piano successivo
#   Piano                gli argomenti ancora da scrivere (content/piano-editoriale.json)
#   Prodotto             il registro di ciò che è stato prodotto, giorno per giorno
#   Inventario           tutto ciò che è online oggi (articoli, guide, giochi, storie,
#                        feste per città, biglietti, rete mamme, Natale) con l'indirizzo
#
#   npm run registro -- <cartella di uscita>
#
# Il connettore Drive crea ma non modifica: ogni giro carica un file nuovo con
# la data nel titolo e rinomina il precedente «zz_SUPERATO — …» (docs/registro-prodotto.md).
# Nessun dato personale: solo titoli, indirizzi pubblici e messaggi dei commit.
import json
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill

RADICE = Path(__file__).resolve().parent.parent
SITO = "https://giocamizi.it"
OGGI = date.today().isoformat()


def leggi(percorso: str) -> str:
    return (RADICE / percorso).read_text(encoding="utf-8")


def campo(testo: str, nome: str) -> str:
    m = re.search(rf'^{nome}:\s*"?(.*?)"?\s*$', testo, re.M)
    return m.group(1) if m else ""


# ── Articoli approfonditi (content/guide/*.md) ───────────────────────────────
articoli = []
for f in sorted((RADICE / "content/guide").glob("*.md")):
    testa = f.read_text(encoding="utf-8").split("\n---", 1)[0]
    if campo(testa, "stato") != "pubblicata":
        continue
    articoli.append(
        {
            "slug": f.stem,
            "titolo": campo(testa, "titolo"),
            "keyword": campo(testa, "keyword"),
            "categoria": campo(testa, "categoria"),
            "eta": f'{campo(testa, "etaMin")}–{campo(testa, "etaMax")}',
            "data": campo(testa, "pubblicata"),
        }
    )
slug_articoli = {a["slug"] for a in articoli}

# ── Guide brevi (lib/guide.ts) e giochi (games/registry.ts) ──────────────────
guide = [
    {"slug": m.group(1), "titolo": re.sub(r"\\u([0-9a-fA-F]{4})", lambda u: chr(int(u.group(1), 16)), m.group(2))}
    for m in re.finditer(r'^    slug: "([a-z0-9-]+)",\n(?:.*\n){0,2}?    titolo: "([^"]+)"', leggi("lib/guide.ts"), re.M)
    if m.group(1) not in slug_articoli
]
giochi = [
    {"slug": m.group(1), "titolo": m.group(2), "eta": f"{m.group(3)}–{m.group(4)}", "abilita": m.group(5)}
    for m in re.finditer(
        r'\{ slug: "([a-z0-9-]+)", title: "([^"]+)", ageMin: (\d+), ageMax: (\d+), skill: "([^"]+)".*?status: "live"',
        leggi("games/registry.ts"),
    )
]

# ── Storie, feste per città e pagine fisse (richiesta del 14/11) ──────────────
def nata_il(percorso: str) -> str:
    """Il giorno in cui il file è entrato nel repo (vuoto se la storia git è tagliata)."""
    r = subprocess.run(["git", "log", "--diff-filter=A", "--format=%as", "--", percorso], cwd=RADICE, capture_output=True, text=True)
    righe = r.stdout.split()
    return righe[-1] if righe else ""


storie = []
for f in sorted((RADICE / "content/stories").glob("*.md")):
    if f.name.startswith("_"):
        continue
    testa = f.read_text(encoding="utf-8").split("\n---", 1)[0]
    storie.append({"slug": f.stem, "titolo": campo(testa, "title"), "eta": campo(testa, "age"), "tema": campo(testa, "theme"), "data": nata_il(f"content/stories/{f.name}")})

citta_feste = [
    {"slug": m.group(1), "citta": m.group(2), "data": m.group(3)}
    for m in re.finditer(r"""^    slug: ["']([a-z0-9-]+)["'],\n    citta: ["']([^"'\n]+)["'],\n    aggiornata: ["']([0-9-]+)["']""", leggi("lib/feste.ts"), re.M)
]

# Pagine fisse che i post usano come punto di partenza: [tipo, titolo, indirizzo, età, tema, file della pagina]
PAGINE = [
    ["Rete mamme", "La rete delle mamme", "/per-le-mamme", "", "famiglie", "app/(public)/per-le-mamme/page.tsx"],
    ["Biglietti", "Biglietti di compleanno", "/biglietti", "1–12", "feste", "app/(public)/biglietti/page.tsx"],
    ["Biglietti", "Crea un invito o un biglietto", "/biglietti/crea", "1–12", "feste", "app/(public)/biglietti/crea/page.tsx"],
    ["Biglietti", "Il kit della festa", "/biglietti/kit-festa", "1–12", "feste", "app/(public)/biglietti/kit-festa/page.tsx"],
    ["Natale", "Il Natale di Mizi", "/natale", "3–10", "Natale", "app/(public)/natale/page.tsx"],
    ["Natale", "La letterina a Babbo Natale", "/natale/letterina-babbo-natale", "3–10", "Natale", "app/(public)/natale/letterina-babbo-natale/page.tsx"],
    ["Natale", "Biglietti di Natale", "/natale/biglietti-di-natale", "1–12", "Natale", "app/(public)/natale/biglietti-di-natale/page.tsx"],
    ["Natale", "Eventi di Natale per bambini", "/natale/eventi", "", "Natale", "app/(public)/natale/eventi/page.tsx"],
]
pagine = [r for r in PAGINE if (RADICE / r[5]).exists()]

# ── Il piano: cosa resta da scrivere ─────────────────────────────────────────
piano = json.loads(leggi("content/piano-editoriale.json"))
da_fare = sorted((a for a in piano["argomenti"] if a["stato"] != "pubblicato" and a["stato"] != "sostituito"), key=lambda a: a["ordine"])

# ── Il registro: i commit di main, senza quelli solo tecnici ─────────────────
TIPI = [
    (r"articol", "Articolo"),  # gli articoli entrano dal loro file, con indirizzo e keyword
    (r"^foto (di domani|della sera)", None),  # prenotazioni: non sono un prodotto
    (r"^foto", "Foto"),
    (r"^gioc", "Gioco"),
    (r"^bigliett|^tema|^qr|^scenette", "Biglietti"),
    (r"^guid", "Guida"),
    (r"natale", "Natale"),
    (r"^feste|feste a ", "Feste e territorio"),
    (r"^directory|^risorse|^dati", "Directory e risorse"),
    (r"^seo|^sitemap|^redirect|^ricerca", "SEO"),
    (r"^social|instagram", "Social"),
    (r"^email|^posta", "Email"),
    (r"^testi|^chi siamo|^voce|^privacy", "Testi del sito"),
    (r"^pannello", "Pannello"),
]
SALTA = re.compile(r"^(date[ -]|date-pagine|verifiche|note:|claude\.md|merge|unisci|second brain|bacheca|piano:|fonti e foto)", re.I)


def tipo_di(messaggio: str):
    if SALTA.search(messaggio):
        return None
    for regola, tipo in TIPI:
        if re.search(regola, messaggio, re.I):
            return tipo
    return "Sito"


log = subprocess.run(
    ["git", "log", "--no-merges", "--date=short", "--format=%ad\t%s"],
    cwd=RADICE, capture_output=True, text=True, encoding="utf-8", check=True,
).stdout.splitlines()
prodotto = []
for riga in log:
    giorno, messaggio = riga.split("\t", 1)
    tipo = tipo_di(messaggio)
    if tipo and tipo != "Articolo":
        prodotto.append([giorno, tipo, messaggio, "", ""])
for a in articoli:
    prodotto.append([a["data"], "Articolo", a["titolo"], f'{SITO}/guide/{a["slug"]}', f'keyword: {a["keyword"]} · {a["categoria"]} · {a["eta"]} anni'])
prodotto.sort(key=lambda r: r[0], reverse=True)

# ── Il prompt per il piano successivo ────────────────────────────────────────
PROMPT = f"""Sei l'editor di Giocamizi (giocamizi.it), un sito italiano e gratuito di giochi educativi per bambini da 3 a 12 anni, senza pubblicità. Devi preparare il PROSSIMO piano editoriale partendo da quello che è già stato prodotto. Tutto in italiano.

1. Leggi questo file: la scheda «Prodotto» (il registro di tutto ciò che è uscito, giorno per giorno), la scheda «Inventario» (tutto ciò che è online oggi, con gli indirizzi) e la scheda «Piano» (gli argomenti già previsti e non ancora scritti).
2. Riorganizza quello che trovi: raggruppa il prodotto per tema (schermi e sicurezza digitale, scuola e compiti, feste e compleanni, fuori casa e territorio, stagione e ricorrenze, famiglia e abitudini, giochi), conta quanto è uscito per ogni tema e scrivi in tre righe cosa è coperto bene e cosa manca.
3. Proponi il piano successivo per 4 settimane, in una tabella: data, canale (articolo del sito, post Instagram, canzone di Mizi, email «Posta di Mizi»), titolo, tema, età, da quale contenuto già online parte (indirizzo preso dall'Inventario) e perché adesso (stagione, ricorrenza, buco da coprire).
4. Regole: non riproporre un argomento già presente in «Prodotto» o in «Inventario»; gli argomenti della scheda «Piano» vanno tenuti e messi in ordine, non riscritti; ogni post social parte da un contenuto che esiste già sul sito; equilibrio tra i temi (non più di due contenuti di fila sugli schermi); attenzione al calendario italiano (scuola, feste, Natale, Carnevale, estate).
5. Mai personaggi o marchi protetti nelle immagini, mai esperienze o frasi inventate a nome di Giorgia o di sua figlia, mai dati personali. Mizi è la pinguina mascotte.
6. Consegna: la tabella del piano, poi un elenco «Da decidere con Giorgia» con le scelte che spettano a lei. Non modificare questo file: se una proposta richiede una modifica al sito, scrivila come richiesta nella cartella Drive «Giocamizi / 0 Richieste di Giorgia»."""

LEGGIMI = [
    ("Piano editoriale Giocamizi", "titolo"),
    (f"Fotografia del {OGGI.split('-')[2]}/{OGGI.split('-')[1]}/{OGGI.split('-')[0]}. La prepara Claude dal sito: non si modifica a mano, perché a ogni giro viene sostituita da una versione nuova con la data nel titolo (la vecchia prende «zz_SUPERATO» davanti).", None),
    ("", None),
    ("Le schede", "sezione"),
    ("Piano: gli argomenti previsti e non ancora scritti, in ordine di uscita.", None),
    ("Prodotto: il registro di quello che è stato prodotto, dal più recente. Ogni cosa nuova (articolo, foto, gioco, biglietto, pagina) finisce qui.", None),
    ("Inventario: tutto quello che è online oggi, con l'indirizzo. Serve per scegliere da dove parte un post o una email.", None),
    ("", None),
    ("Prompt per fare il piano successivo (da dare a ChatGPT o a Claude insieme a questo file)", "sezione"),
    (PROMPT, "prompt"),
]

# ── Scrittura del file ───────────────────────────────────────────────────────
LILLA = PatternFill("solid", fgColor="9B6DD6")
CREMA = PatternFill("solid", fgColor="FFF3E6")
A_CAPO = Alignment(wrap_text=True, vertical="top")


def scheda(wb, nome, intestazioni, righe, larghezze):
    ws = wb.create_sheet(nome)
    ws.append(intestazioni)
    for c in ws[1]:
        c.font = Font(bold=True, color="FFFFFF")
        c.fill = LILLA
        c.alignment = A_CAPO
    for r in righe:
        ws.append(r)
    for i, largo in enumerate(larghezze):
        ws.column_dimensions[chr(65 + i)].width = largo
    for riga in ws.iter_rows(min_row=2):
        for c in riga:
            c.alignment = A_CAPO
            if isinstance(c.value, str) and c.value.startswith("https://"):
                c.hyperlink = c.value
                c.font = Font(color="3D5BD6", underline="single")
    ws.freeze_panes = "A2"
    return ws


wb = Workbook()
ws = wb.active
ws.title = "00 Leggimi e prompt"
ws.column_dimensions["A"].width = 130
for testo, stile in LEGGIMI:
    ws.append([testo])
    c = ws.cell(row=ws.max_row, column=1)
    c.alignment = A_CAPO
    if stile == "titolo":
        c.font = Font(bold=True, size=16)
    elif stile == "sezione":
        c.font = Font(bold=True, color="FFFFFF")
        c.fill = LILLA
    elif stile == "prompt":
        c.fill = CREMA

scheda(
    wb, "Piano",
    ["Ordine", "Titolo", "Keyword", "Categoria", "Età", "Voce", "Stato", "Data prevista"],
    [[a["ordine"], a["titolo"], a["keyword"], a["categoria"], f'{a["etaMin"]}–{a["etaMax"]}', a.get("voce", ""), a["stato"], a.get("dataPianificata") or ""] for a in da_fare],
    [8, 60, 34, 22, 8, 12, 12, 14],
)
scheda(wb, "Prodotto", ["Data", "Tipo", "Cosa", "Indirizzo", "Dettagli"], prodotto, [12, 20, 80, 52, 50])
inventario = (
    [["Articolo", a["titolo"], f'{SITO}/guide/{a["slug"]}', a["eta"], a["categoria"], a["data"]] for a in sorted(articoli, key=lambda a: a["data"], reverse=True)]
    + [["Guida", g["titolo"], f'{SITO}/guide/{g["slug"]}', "", "", ""] for g in guide]
    + [["Gioco", g["titolo"], f'{SITO}/giochi/{g["slug"]}', g["eta"], g["abilita"], ""] for g in giochi]
    + [["Storia", st["titolo"], f'{SITO}/storie/{st["slug"]}', st["eta"], st["tema"], st["data"]] for st in storie]
    + [["Feste in città", f'Feste di compleanno a {c["citta"]}', f'{SITO}/feste/{c["slug"]}', "", "feste", c["data"]] for c in sorted(citta_feste, key=lambda c: c["citta"])]
    + [[t, titolo, f"{SITO}{indirizzo}", eta, tema, nata_il(file)] for t, titolo, indirizzo, eta, tema, file in pagine]
)
scheda(wb, "Inventario", ["Tipo", "Titolo", "Indirizzo", "Età", "Tema o abilità", "Pubblicato il"], inventario, [12, 62, 60, 8, 24, 14])

uscita = Path(sys.argv[1] if len(sys.argv) > 1 else ".") / f"Piano editoriale Giocamizi · {OGGI}.xlsx"
uscita.parent.mkdir(parents=True, exist_ok=True)
wb.save(uscita)
print(json.dumps({"file": str(uscita).replace("\\", "/"), "piano": len(da_fare), "prodotto": len(prodotto), "articoli": len(articoli), "guide": len(guide), "giochi": len(giochi), "storie": len(storie), "citta": len(citta_feste), "pagine": len(pagine)}, ensure_ascii=False))
