# La voce di Mizi: python3 voce.py <scheda.json> <cartella-lavoro>
# Decisione di Giorgia del 15/11/2026: voce «sage», pinguina-bambina di ~10 anni.
# Dal 24/11/2026 anche «mamma» (voce «marin» dal 26/11) per i reel: campo «voce» della scheda.
# Tutto il testo in UNA registrazione (la voce resta uguale); poi whisper-1 dà i
# tempi delle parole e si taglia frase per frase in <cartella>/voce/<n>.wav.
import json, subprocess, re, unicodedata, os, sys, difflib
spec, cart = json.load(open(sys.argv[1])), sys.argv[2]
os.makedirs(f"{cart}/voce", exist_ok=True)
ISTR_MIZI = ("Sei Mizi, una piccola pinguina dei cartoni animati: hai la voce di una bambina di circa dieci anni, allegra, curiosa e gentile. "
        "Sorridi mentre parli, sei entusiasta ma non urli, e spieghi le cose con calma perché tutti capiscano. "
        "Parla un italiano perfetto, con accento neutro, ritmo naturale e piccole pause dopo le virgole. Niente toni da pubblicità. "
        "Fai una pausa di un secondo tra un paragrafo e l'altro.")
# Reel per Instagram (decisione di Giorgia del 24/11/2026): «voce»: «mamma» nella
# scheda = una voce artificiale di donna adulta che parla ad altre mamme. Il testo
# non racconta mai esperienze di Giorgia o di Domi: dice solo cosa fa il sito.
# Dal 26/11/2026 (Giorgia: «più naturale ed espressiva, una perfetta attrice»):
# voce «marin», scelta da lei fra coral, shimmer e marin, con una regia teatrale.
# Ogni scheda può aggiungere «regia»: un elenco con l'emozione di ogni paragrafo
# e le parole da calcare. Cambia solo COME si dice, mai il testo.
ISTR_MAMMA = ("Sei una grande attrice italiana di teatro e di doppiaggio. Interpreti una mamma di circa trentacinque anni, solare ed espansiva, "
              "che racconta alle amiche mamme una scoperta che la entusiasma. È una PERFORMANCE: recita con il corpo, con gli occhi, con il sorriso. "
              "Esagera un po', come a teatro, ma resta credibile e affettuosa.\n\n"
              "Regole di recitazione:\n"
              "- Dinamica ampia: passa da una voce piena e luminosa a un tono quasi sussurrato e confidenziale, e di nuovo su. Mai due frasi con la stessa melodia.\n"
              "- Enfasi marcata: allunga le vocali e appoggia la voce sulle parole chiave, come se le sottolineassi con le mani.\n"
              "- Pause teatrali: fermati mezzo secondo PRIMA delle parole importanti, per creare attesa.\n"
              "- Il sorriso si sente in ogni frase; nei punti più belli lascia scappare un piccolo sorriso udibile o un respiro di emozione.\n\n"
              "Niente tono da pubblicità, da annunciatrice o da lettura: è recitazione viva. Italiano perfetto, accento neutro. "
              "\"giocamizi punto it\" detto con naturalezza. Pausa di un secondo tra un paragrafo e l'altro. "
              "Leggi TUTTO il testo, parola per parola, fino all'ultima: il saluto finale si dice sempre, per intero.")
VOCI = {"mizi": ("sage", ISTR_MIZI), "mamma": ("marin", ISTR_MAMMA)}
VOCE, ISTR = VOCI[spec.get("voce", "mizi")]
if spec.get("regia"):
    ISTR += "\n\nArco emotivo, paragrafo per paragrafo:\n" + "\n".join(f"{i}. {r}" for i, r in enumerate(spec["regia"], 1))
testi = [s["voce"] for s in spec["scene"]]
def curl(args, out=None):
    return subprocess.run(["curl", "-sS", "-m", "300", *args] + (["-o", out] if out else []), capture_output=True, text=True, check=True).stdout
intera, parole_json = f"{cart}/intera.wav", f"{cart}/parole.json"
norm = lambda w: re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFD", w.lower()).encode("ascii", "ignore").decode())
# La voce a volte si ferma prima della fine (26/11/2026: tre reel su quattro senza
# «Buone feste!»). Si controlla che le ultime parole del testo ci siano davvero nella
# trascrizione; se mancano si registra di nuovo, fino a tre volte.
# Dal 27/11/2026 (sette prove su sette senza «Buone feste!») dopo l'ultima frase si
# registra anche una CODA di sicurezza: se il modello taglia la fine, taglia quella.
# La coda poi non si usa: l'ultima frase si chiude sull'ultima parola vera.
CODA = "Fine del video."
fine_testo = norm("".join(testi[-1].replace("giocamizi punto it", "giocamizi").split()[-2:]))
for prova in range(3):
    if not os.path.exists(intera):
        curl(["https://api.openai.com/v1/audio/speech", "-H", "Authorization: Bearer proxy-injected", "-H", "Content-Type: application/json",
              "-d", json.dumps({"model": "gpt-4o-mini-tts", "voice": VOCE, "input": "\n\n".join(testi + [CODA]), "instructions": ISTR, "response_format": "wav"})], intera)
    if not os.path.exists(parole_json):
        open(parole_json, "w").write(curl(["https://api.openai.com/v1/audio/transcriptions", "-H", "Authorization: Bearer proxy-injected",
            "-F", f"file=@{intera}", "-F", "model=whisper-1", "-F", "language=it", "-F", "response_format=verbose_json", "-F", "timestamp_granularities[]=word"]))
    tr = json.load(open(parole_json))
    coda = "".join(norm(w["word"]) for w in tr["words"][-12:])
    # whisper a volte storpia («giocanizzi»): basta un pezzo molto simile tra le ultime parole
    # (non solo in fondo: in fondo adesso c'è la coda)
    n = len(fine_testo)
    if fine_testo in coda or max((difflib.SequenceMatcher(None, coda[i:i + n], fine_testo).ratio() for i in range(max(1, len(coda) - n + 1))), default=0) >= 0.8: break
    print(f"la voce si è fermata prima della fine (manca «{testi[-1].split()[-2:]}»): registro di nuovo")
    os.remove(intera); os.remove(parole_json)
else:
    raise SystemExit("la voce si ferma prima della fine anche dopo tre registrazioni: controllare")
parole = [p for p in ((norm(w["word"]), w["start"], w["end"]) for w in tr["words"]) if p[0]]
# dove finisce il testo vero: le ultime due parole dell'ultima frase, cercate dalla fine
fine_vera = inizio_coda = None
for j in range(len(parole) - 1, -1, -1):
    seguito = "".join(p[0] for p in parole[j:j + 3])
    if seguito.startswith(fine_testo) or difflib.SequenceMatcher(None, seguito[:len(fine_testo)], fine_testo).ratio() >= 0.8:
        k, lette = j, parole[j][0]
        while len(lette) < len(fine_testo) - 1 and k + 1 < len(parole):
            k += 1; lette += parole[k][0]
        # «giocamizi punto it» si cerca come «giocamizi»: il «punto it» va tenuto
        while testi[-1].rstrip(" !.").endswith("punto it") and k + 1 < len(parole) and parole[k + 1][0] in ("punto", "it", "puntoit"):
            k += 1
        fine_vera = parole[k][2]
        inizio_coda = parole[k + 1][1] if k + 1 < len(parole) else None
        break
if fine_vera is None: raise SystemExit("non trovo la fine del testo nella registrazione: controllare")
parole = [p for p in parole if p[1] < fine_vera]
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", intera], capture_output=True, text=True).stdout)
inizi = [0.0]; k = 0
def cerca(parole_frase, k):
    """La prima parola della frase nella trascrizione, da k in poi (None se non c'è)."""
    # confronto le lettere di seguito (senza spazi né apostrofi): «un'attività»
    # trascritto «un attività» combacia lo stesso
    obiettivo = norm("".join(parole_frase))[:12]
    if len(obiettivo) < 6: return None
    for j in range(k, len(parole)):
        seguito = "".join(p[0] for p in parole[j:j + 6])
        # whisper a volte sbaglia una doppia («dicci» → «dici»): basta che quasi tutte le lettere combacino
        if seguito.startswith(obiettivo) or (len(obiettivo) >= 8 and seguito[:10] == obiettivo[:10]) \
                or (len(obiettivo) >= 10 and difflib.SequenceMatcher(None, seguito[:len(obiettivo)], obiettivo).ratio() >= 0.85):
            return j
    return None

for f in testi[1:]:
    pf = f.replace("giocamizi punto it", "giocamizi").split()
    trovato = cerca(pf, k)
    # se whisper ha sbagliato le prime parole («un paio» → «un taglio»), si cerca dalla
    # seconda o dalla terza parola e si torna indietro di altrettante parole trascritte
    for salto in (1, 2):
        if trovato is not None: break
        j = cerca(pf[salto:], k + salto)
        if j is not None: trovato = j - salto
    if trovato is None: raise SystemExit(f"frase non trovata nella registrazione: {f[:50]}")
    k = trovato + 1; inizi.append(parole[trovato][1])
for n, a in enumerate(inizi):
    fine_frase = inizi[n + 1] if n + 1 < len(inizi) else fine_vera
    b = max(p[2] for p in parole if p[1] < fine_frase)
    # whisper a volte dà alla prima parola un inizio troppo tardi (durata zero: «Scegli» → «egli»):
    # si parte fino a 0,4 s prima, ma mai prima della fine della frase precedente
    fine_prima = max([p[2] for p in parole if p[2] <= a - 0.02], default=0)
    # l'ultima frase si ferma a metà del silenzio prima della coda, mai dentro la coda
    tetto = dur if n + 1 < len(inizi) else min(dur, fine_vera + 0.25, (fine_vera + inizio_coda) / 2 if inizio_coda else dur)
    a, b = max(0, fine_prima + 0.05, a - 0.4) if n else 0, min(tetto, b + 0.25)
    # Il taglio si fa DENTRO il filtro e poi si riparte da zero (asetpts): così la
    # dissolvenza finale conta dall'inizio della frase. Prima (fino al 16/11/2026)
    # contava dall'inizio della registrazione e azzerava tutte le frasi dopo la prima.
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", intera, "-af",
                    f"atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS,afade=t=out:st={max(0, b - a - 0.08):.3f}:d=0.08",
                    f"{cart}/voce/{n}.wav"], check=True)
    print(f"frase {n}: {b - a:.1f} s")
    if b - a < 1.5: raise SystemExit(f"la frase {n} dura meno di 1,5 secondi: taglio sbagliato, controllare")
    # una frase muta è un taglio sbagliato: meglio fermarsi che fare un video senza voce
    picco = subprocess.run(["ffmpeg", "-v", "info", "-i", f"{cart}/voce/{n}.wav", "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.search(r"mean_volume: (-?[\d.]+|-inf) dB", picco)
    if not m or m.group(1) == "-inf" or float(m.group(1)) < -45: raise SystemExit(f"la frase {n} è muta: taglio sbagliato, controllare")
