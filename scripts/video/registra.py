# Dopo la produzione di un video: python3 registra.py <slug> <cartella-lavoro>
#  1. salva content/video/<slug>.tempi.json (durata, inizio di ogni scena, data);
#  2. ricompila lib/tutorial-dati.json con tutti i video che hanno tempi E file
#     in public/video/: è quello che il sito legge (lib/tutorial.ts).
import json, subprocess, sys, os, glob, datetime
qui = os.path.dirname(os.path.abspath(__file__))
radice = os.path.abspath(os.path.join(qui, "..", ".."))
cartella_video = os.path.join(radice, "content", "video")
if len(sys.argv) > 2:
    slug, cart = sys.argv[1], sys.argv[2]
    spec = json.load(open(os.path.join(cartella_video, f"{slug}.json")))
    n = len(spec["scene"])
    voci = [float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'{cart}/voce/{i}.wav'],capture_output=True,text=True).stdout) for i in range(n)]
    inizi, t = [], 0.0
    for v in voci:
        inizi.append(round(t)); t += v + 1.1
    capitoli = []
    for sc, da in zip(spec["scene"], inizi):
        if sc["tipo"] == "finale": continue
        capitoli.append({"da": da, "titolo": "Ciao, sono Mizi" if sc["tipo"] == "intro" else (f'{sc["passo"]} · {sc["titolo"]}' if sc.get("passo") else sc["titolo"])})
    oggi = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=1))).date().isoformat()
    json.dump({"secondi": round(t), "caricato": oggi, "capitoli": capitoli}, open(os.path.join(cartella_video, f"{slug}.tempi.json"), "w"), ensure_ascii=False, indent=1)
# elenco per il sito
elenco = []
for p in sorted(glob.glob(os.path.join(cartella_video, "*.json"))):
    if p.endswith(".tempi.json"): continue
    s = json.load(open(p)); slug = s["slug"]
    tp = os.path.join(cartella_video, f"{slug}.tempi.json")
    if not (os.path.exists(tp) and os.path.exists(os.path.join(radice, "public", "video", f"{slug}.mp4")) and s.get("pagina")): continue
    tm = json.load(open(tp))
    m, sec = divmod(tm["secondi"], 60)
    elenco.append({
        "slug": slug, "gruppo": s["gruppo"], "titolo": s["titolo"], "ordine": s.get("ordine", 99),
        "descrizione": s["descrizione"], "rispostaBreve": s["rispostaBreve"],
        "video": {"src": f"/video/{slug}.mp4", "poster": f"/video/{slug}.webp", "sottotitoli": f"/video/{slug}.vtt",
                  "durata": f"PT{m}M{sec}S", "secondi": tm["secondi"], "caricato": tm["caricato"],
                  "testo": [sc["voce"].replace("giocamizi punto it", "giocamizi.it") for sc in s["scene"]]},
        "capitoli": tm["capitoli"], "pagina": s["pagina"], "faq": s.get("faq", []),
    })
elenco.sort(key=lambda x: (x["gruppo"], x["ordine"], x["titolo"]))
json.dump(elenco, open(os.path.join(radice, "lib", "tutorial-dati.json"), "w"), ensure_ascii=False, indent=1)
print("tutorial nel sito:", ", ".join(x["slug"] for x in elenco))
