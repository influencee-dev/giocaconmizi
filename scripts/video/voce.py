# La voce di Mizi (decisione di Giorgia del 15/11/2026: voce «sage», pinguina-bambina).
# Tutto il testo in UNA registrazione, così la voce resta uguale dall'inizio alla fine;
# poi si taglia frase per frase con i tempi delle parole (trascrizione whisper-1).
import json, subprocess, re, unicodedata
VOCE = 'sage'
ISTR = ("Sei Mizi, una piccola pinguina dei cartoni animati: hai la voce di una bambina di circa dieci anni, allegra, curiosa e gentile. "
        "Sorridi mentre parli, sei entusiasta ma non urli, e spieghi le cose con calma perché tutti capiscano. "
        "Parla un italiano perfetto, con accento neutro, ritmo naturale e piccole pause dopo le virgole. Niente toni da pubblicità. "
        "Fai una pausa di un secondo tra un paragrafo e l'altro.")
testi = json.load(open('testi.json'))
tutto = "\n\n".join(testi)
def curl(args, out=None):
    r = subprocess.run(["curl", "-sS", "-m", "300", *args] + (["-o", out] if out else []), capture_output=True, text=True, check=True)
    return r.stdout
import os
if not os.path.exists("intera.wav"): curl(["https://api.openai.com/v1/audio/speech", "-H", "Authorization: Bearer proxy-injected", "-H", "Content-Type: application/json",
      "-d", json.dumps({"model": "gpt-4o-mini-tts", "voice": VOCE, "input": tutto, "instructions": ISTR, "response_format": "wav"})], "intera.wav")
if not os.path.exists("parole.json"): open("parole.json", "w").write(curl(["https://api.openai.com/v1/audio/transcriptions", "-H", "Authorization: Bearer proxy-injected",
                      "-F", "file=@intera.wav", "-F", "model=whisper-1", "-F", "language=it", "-F", "response_format=verbose_json",
                      "-F", "timestamp_granularities[]=word"]))
tr = json.load(open("parole.json"))
norm = lambda w: re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFD", w.lower()).encode("ascii", "ignore").decode())
parole = [(norm(w["word"]), w["start"], w["end"]) for w in tr["words"]]
parole = [p for p in parole if p[0]]
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", "intera.wav"], capture_output=True, text=True).stdout)
# inizio di ogni frase: dove le prime parole della frase combaciano meglio, andando avanti
inizi = [0.0]; k = 0
for f in testi[1:]:
    attese = [norm(w) for w in f.split()][:3]
    attese = [a for a in attese if a]
    migliore = None
    for j in range(k, len(parole)):
        if parole[j][0] != attese[0]: continue  # la prima parola deve coincidere
        punti = sum(1 for a, p in zip(attese, parole[j:j + len(attese)]) if a == p[0] or (len(a) > 3 and a[:4] == p[0][:4]))
        if punti >= min(2, len(attese)):
            migliore = j; break
    if migliore is None: raise SystemExit(f"frase non trovata: {f[:40]}")
    k = migliore + 1
    inizi.append(parole[migliore][1])
fini = [parole[max(i for i, p in enumerate(parole) if p[1] < (inizi[n + 1] if n + 1 < len(inizi) else dur + 1))][2] for n in range(len(inizi))]
for n, (a, b) in enumerate(zip(inizi, fini)):
    a = max(0, a - 0.12); b = min(dur, b + 0.25)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", "intera.wav", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-af", "afade=t=out:st=%.3f:d=0.08" % max(0, b - a - 0.08), f"voce/{n}.wav"], check=True)
    print(n, round(a, 2), round(b, 2), round(b - a, 2))
