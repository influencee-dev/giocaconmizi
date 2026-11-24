# La voce di Mizi: python3 voce.py <scheda.json> <cartella-lavoro>
# Decisione di Giorgia del 15/11/2026: voce «sage», pinguina-bambina di ~10 anni.
# Tutto il testo in UNA registrazione (la voce resta uguale); poi whisper-1 dà i
# tempi delle parole e si taglia frase per frase in <cartella>/voce/<n>.wav.
import json, subprocess, re, unicodedata, os, sys, difflib
spec, cart = json.load(open(sys.argv[1])), sys.argv[2]
os.makedirs(f"{cart}/voce", exist_ok=True)
VOCE = 'sage'
ISTR = ("Sei Mizi, una piccola pinguina dei cartoni animati: hai la voce di una bambina di circa dieci anni, allegra, curiosa e gentile. "
        "Sorridi mentre parli, sei entusiasta ma non urli, e spieghi le cose con calma perché tutti capiscano. "
        "Parla un italiano perfetto, con accento neutro, ritmo naturale e piccole pause dopo le virgole. Niente toni da pubblicità. "
        "Fai una pausa di un secondo tra un paragrafo e l'altro.")
testi = [s["voce"] for s in spec["scene"]]
def curl(args, out=None):
    return subprocess.run(["curl", "-sS", "-m", "300", *args] + (["-o", out] if out else []), capture_output=True, text=True, check=True).stdout
intera, parole_json = f"{cart}/intera.wav", f"{cart}/parole.json"
if not os.path.exists(intera):
    curl(["https://api.openai.com/v1/audio/speech", "-H", "Authorization: Bearer proxy-injected", "-H", "Content-Type: application/json",
          "-d", json.dumps({"model": "gpt-4o-mini-tts", "voice": VOCE, "input": "\n\n".join(testi), "instructions": ISTR, "response_format": "wav"})], intera)
if not os.path.exists(parole_json):
    open(parole_json, "w").write(curl(["https://api.openai.com/v1/audio/transcriptions", "-H", "Authorization: Bearer proxy-injected",
        "-F", f"file=@{intera}", "-F", "model=whisper-1", "-F", "language=it", "-F", "response_format=verbose_json", "-F", "timestamp_granularities[]=word"]))
tr = json.load(open(parole_json))
norm = lambda w: re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFD", w.lower()).encode("ascii", "ignore").decode())
parole = [p for p in ((norm(w["word"]), w["start"], w["end"]) for w in tr["words"]) if p[0]]
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
    fine_frase = inizi[n + 1] if n + 1 < len(inizi) else dur + 1
    b = max(p[2] for p in parole if p[1] < fine_frase)
    # whisper a volte dà alla prima parola un inizio troppo tardi (durata zero: «Scegli» → «egli»):
    # si parte fino a 0,4 s prima, ma mai prima della fine della frase precedente
    fine_prima = max([p[2] for p in parole if p[2] <= a - 0.02], default=0)
    a, b = max(0, fine_prima + 0.05, a - 0.4) if n else 0, min(dur, b + 0.25)
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
