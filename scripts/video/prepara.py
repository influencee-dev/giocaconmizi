# Unisce il modello delle scene (video.html) con le posizioni dei bottoni
# (box.json), le durate della voce e i testi: ne esce video-pronto.html.
import json, subprocess, sys
cartella = sys.argv[1] if len(sys.argv) > 1 else '.'
v = [float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'{cartella}/voce/{i}.wav'],capture_output=True,text=True).stdout) for i in range(9)]
testi = [t.replace('giocamizi punto it', 'giocamizi.it') for t in json.load(open(f'{cartella}/testi.json'))]
h = open(f'{cartella}/video.html').read().replace('__BOX__', open(f'{cartella}/box.json').read()).replace('__VOCI__', json.dumps(v)).replace('__TESTI__', json.dumps(testi, ensure_ascii=False))
open(f'{cartella}/video-pronto.html', 'w').write(h)
