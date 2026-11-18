# Unisce il motore delle scene (video.html) con la scheda, le posizioni e le durate della voce.
# python3 prepara.py <scheda.json> <cartella-lavoro>  →  <cartella>/video-pronto.html
import json, subprocess, sys, os, shutil
spec_path, cart = sys.argv[1], sys.argv[2]
qui = os.path.dirname(os.path.abspath(__file__))
spec = json.load(open(spec_path))
n = len(spec["scene"])
voci = [float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'{cart}/voce/{i}.wav'],capture_output=True,text=True).stdout) for i in range(n)]
h = open(f"{qui}/video.html").read().replace('__SPEC__', json.dumps(spec, ensure_ascii=False)).replace('__BOX__', open(f'{cart}/box.json').read()).replace('__VOCI__', json.dumps(voci))
open(f'{cart}/video-pronto.html', 'w').write(h)
print(round(sum(v + 1.1 for v in voci), 2))
