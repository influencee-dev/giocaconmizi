"""Il foglio del piano editoriale (Excel con più schede) da caricare su Drive.

    python scripts/piano-foglio.py <file-di-uscita.xlsx>

Legge content/piano-editoriale.json, content/canzoni-mizi.json e
content/registro-prodotto.json e scrive un foglio con le schede:
  «00 Prompt per l'AI»  le istruzioni per chi rifà il piano successivo
  «Riepilogo»           quanti argomenti per categoria e per stato
  «Piano articoli»      gli argomenti vivi, in ordine di uscita
  «Canzoni»             le canzoni di Mizi, una a settimana
  «Prodotto»            tutto ciò che è stato prodotto (il registro)
  «Sostituiti»          gli argomenti tolti e il perché
Su Drive si carica come versione nuova con la data nel titolo; la vecchia
prende «zz_SUPERATO — » davanti (regola del LEGGIMI). Serve openpyxl.
"""

import json
import sys
from collections import Counter
from datetime import date
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill

RADICE = Path(__file__).resolve().parent.parent
piano = json.loads((RADICE / "content/piano-editoriale.json").read_text(encoding="utf-8"))
canzoni = json.loads((RADICE / "content/canzoni-mizi.json").read_text(encoding="utf-8"))
registro = json.loads((RADICE / "content/registro-prodotto.json").read_text(encoding="utf-8"))

NOMI = {
    "guide-giochi": "Guide ai giochi",
    "confronti": "Confronti",
    "sicurezza-digitale": "Sicurezza digitale",
    "tavolo-offline": "Tavolo e giochi offline",
    "famiglia-abitudini": "Famiglia e abitudini",
    "mamme-imprenditrici": "Mamme imprenditrici",
    "feste-compleanni": "Feste e compleanni",
    "fuori-casa": "Fuori casa e territorio",
    "stagionali": "Stagione",
    "rubrica": "Rubrica di Giorgia",
}

PROMPT = [
    "PROMPT PER L'AI CHE PREPARA IL PIANO EDITORIALE SUCCESSIVO",
    "",
    "Sei la redazione di Giocamizi (giocamizi.it): giochi educativi gratuiti per bambini 3-12 anni, guide per genitori, feste per città, directory di attività e associazioni, canzoni di Mizi. Il sito è di Giorgia Palazzo; Mizi è SOLO la pinguina; Domiziana è la figlia (Domi o Dodò).",
    "",
    "COSA HAI IN QUESTO FOGLIO",
    "• «Piano articoli»: gli argomenti ancora vivi, in ordine di uscita, con stato (da-fare, bozza, bloccato, pubblicato).",
    "• «Canzoni»: le canzoni di Mizi, una a settimana, con stato.",
    "• «Prodotto»: tutto quello che è già uscito o è stato preparato, con data e link. È la memoria: non riproporre ciò che c'è già.",
    "• «Sostituiti»: gli argomenti tolti e il motivo. Non rimetterli senza una ragione nuova.",
    "• «Riepilogo»: l'equilibrio attuale tra le categorie.",
    "",
    "COSA DEVI FARE",
    "1. Leggi tutte le schede. Conta cosa è uscito per categoria e cosa resta da fare.",
    "2. Prepara il piano successivo (prossimi 30 articoli e prossime 10 canzoni), riorganizzando ciò che resta e aggiungendo argomenti nuovi.",
    "3. Rispetta l'equilibrio deciso da Giorgia il 14/11/2026, salvo sua indicazione nuova: schermi e sicurezza digitale circa un terzo; poi tavolo e offline, famiglia e abitudini, feste e compleanni, fuori casa e territorio, mamme imprenditrici, stagione.",
    "4. Segui il calendario: le ricorrenze (Natale, Carnevale, Pasqua, fine scuola, estate, rientro) vanno 2-4 settimane prima della data. Le canzoni escono una a settimana insieme al post.",
    "5. Ogni argomento deve servire a qualcosa: un gioco del sito da collegare, una pagina feste o directory da far scoprire, una domanda reale dei genitori. Indica il collegamento.",
    "6. Niente doppioni con «Prodotto» e con le guide già online: se due argomenti si somigliano, uniscili.",
    "",
    "REGOLE CHE NON SI CAMBIANO",
    "• Tono: affettuoso ma ironico, sdrammatizza, niente «mamma chioccia», niente prediche.",
    "• Mai inventare esperienze, dialoghi o ricordi di Giorgia e Domi: il vissuto entra solo se Giorgia lo fornisce.",
    "• Niente personaggi o marchi protetti nelle canzoni e nelle immagini; testi e melodie originali.",
    "• Mai dati personali (email, telefoni, nomi di bambini) nel piano.",
    "",
    "COME CONSEGNARE",
    "Una tabella con le stesse colonne di «Piano articoli» (ordine, data, titolo, keyword, categoria, età, intento, priorità, collegamento) e una con le stesse colonne di «Canzoni». In fondo, 5 righe: cosa hai cambiato e perché.",
]

BLU = PatternFill("solid", fgColor="2B2D5C")
BIANCO = Font(bold=True, color="FFFFFF")


def intestazione(ws, colonne, larghezze):
    ws.append(colonne)
    for i, cella in enumerate(ws[1]):
        cella.fill = BLU
        cella.font = BIANCO
        ws.column_dimensions[cella.column_letter].width = larghezze[i]
    ws.freeze_panes = "A2"


wb = Workbook()

ws = wb.active
ws.title = "00 Prompt per l'AI"
ws.column_dimensions["A"].width = 140
for riga in PROMPT:
    ws.append([riga])
ws["A1"].font = Font(bold=True, size=14)
for cella in ws["A"]:
    cella.alignment = Alignment(wrap_text=True, vertical="top")
    if cella.value and cella.value.isupper():
        cella.font = Font(bold=True)

vivi = [a for a in piano["argomenti"] if a["stato"] != "sostituito"]
ws = wb.create_sheet("Riepilogo")
intestazione(ws, ["Categoria", "Totale", "Pubblicati", "Da fare", "In bozza o bloccati"], [30, 10, 12, 10, 20])
per = Counter(a["categoria"] for a in vivi)
for cat, tot in per.most_common():
    stati = Counter(a["stato"] for a in vivi if a["categoria"] == cat)
    ws.append([NOMI.get(cat, cat), tot, stati["pubblicato"], stati["da-fare"], stati["bozza"] + stati["bloccato"]])
ws.append([])
ws.append(["Canzoni", len(canzoni["canzoni"]), sum(c["stato"] == "pubblicata" for c in canzoni["canzoni"])])
ws.append(["Voci nel registro «Prodotto»", len(registro["voci"])])
ws.append(["Foglio generato il", date.today().isoformat()])

ws = wb.create_sheet("Piano articoli")
intestazione(
    ws,
    ["Ordine", "Data prevista", "Titolo", "Keyword", "Categoria", "Età", "Intento", "Priorità", "Stato", "Pubblicato il", "Slug", "ID"],
    [8, 13, 60, 36, 24, 8, 13, 9, 12, 13, 40, 6],
)
for a in sorted(vivi, key=lambda x: x["ordine"]):
    ws.append([
        a["ordine"], a.get("dataPianificata"), a["titolo"], a["keyword"], NOMI.get(a["categoria"], a["categoria"]),
        f'{a["etaMin"]}-{a["etaMax"]}', a["intento"], a["priorita"], a["stato"], a.get("pubblicataIl"), a["slug"], a["id"],
    ])

ws = wb.create_sheet("Canzoni")
intestazione(ws, ["NN", "Settimana dal", "Titolo", "Tema", "Età", "Stato", "File atteso"], [6, 14, 36, 14, 8, 16, 40])
for c in canzoni["canzoni"]:
    ws.append([c["nn"], c["settimana"], c["titolo"], c["tema"], c["eta"], c["stato"], f'canzone-{c["nn"]}-{c["slug"]}.mp4'])

ws = wb.create_sheet("Prodotto")
intestazione(ws, ["Data", "Tipo", "Titolo", "Dove", "Chi", "ID piano", "Note"], [12, 11, 60, 60, 26, 9, 60])
for v in sorted(registro["voci"], key=lambda x: x["data"]):
    ws.append([v["data"], v["tipo"], v["titolo"], v["dove"], v["chi"], v.get("piano"), v.get("note", "")])

ws = wb.create_sheet("Sostituiti")
intestazione(ws, ["ID", "Titolo", "Categoria", "Motivo"], [6, 60, 24, 80])
for a in piano["argomenti"]:
    if a["stato"] == "sostituito":
        ws.append([a["id"], a["titolo"], NOMI.get(a["categoria"], a["categoria"]), a.get("nota", "")])

uscita = Path(sys.argv[1] if len(sys.argv) > 1 else "piano-editoriale.xlsx")
wb.save(uscita)
print(f"Scritto {uscita} · {len(vivi)} argomenti vivi · {len(canzoni['canzoni'])} canzoni · {len(registro['voci'])} voci prodotte")
