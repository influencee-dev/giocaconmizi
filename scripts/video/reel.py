# Prepara un reel di Mizi: pagina delle scene (reel.html) e audio (voce + musica).
# python3 reel.py <scheda-reel.json> <cartella-lavoro>  →  reel-pronto.html, audio.wav; stampa la durata.
# I tempi sono gli stessi di reel.html: il gancio parte subito (0,05 s), poi
# anticipo e coda corti (0,15 / 0,25 s) perché il ritmo di un reel è veloce.
import json, subprocess, sys, os
spec_path, cart = sys.argv[1], sys.argv[2]
qui = os.path.dirname(os.path.abspath(__file__))
spec = json.load(open(spec_path))
scene = spec["scene"]
dur = lambda f: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)
# «tempoVoce» (es. 1.1): Mizi parla un po' più svelta, senza cambiare il tono (atempo)
TEMPO = spec.get("tempoVoce", 1)
os.makedirs(f'{cart}/voce-reel', exist_ok=True)
for i in range(len(scene)):
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', f'{cart}/voce/{i}.wav', '-af', f'atempo={TEMPO}', f'{cart}/voce-reel/{i}.wav'], check=True)
voci = [dur(f'{cart}/voce-reel/{i}.wav') for i in range(len(scene))]
ANT, CODA = spec.get("anticipo", .15), spec.get("coda", .25)
t, inizi = 0.0, []
for i, (s, v) in enumerate(zip(scene, voci)):
    a = .05 if i == 0 else ANT
    inizi.append(t + a)
    t += max(s.get("minimo", 0), v + a + CODA)
DURATA = t
h = open(f'{qui}/reel.html').read().replace('__SPEC__', json.dumps(spec, ensure_ascii=False)).replace('__VOCI__', json.dumps(voci))
open(f'{cart}/reel-pronto.html', 'w').write(h)
subprocess.run(['python3', f'{qui}/musica.py', str(DURATA), f'{cart}/musica.wav'], check=True, capture_output=True)
ing, filtri = [], []
for i, at in enumerate(inizi):
    ing += ['-i', f'{cart}/voce-reel/{i}.wav']
    filtri.append(f'[{i}:a]aresample=44100,aformat=channel_layouts=stereo,adelay={int(at*1000)}|{int(at*1000)}[v{i}]')
n = len(inizi)
filtri.append(''.join(f'[v{i}]' for i in range(n)) + f'amix=inputs={n}:normalize=0,apad=whole_dur={DURATA:.2f}[voce]')
ing += ['-i', f'{cart}/musica.wav']
filtri.append(f'[{n}:a]volume=0.30[mus]')
filtri.append('[voce]asplit=2[voce1][chiave]')
filtri.append('[mus][chiave]sidechaincompress=threshold=0.03:ratio=5:attack=30:release=300[musd]')
filtri.append(f'[voce1][musd]amix=inputs=2:normalize=0,atrim=0:{DURATA:.2f},afade=t=out:st={max(0, DURATA - .4):.2f}:d=0.4,loudnorm=I=-14:TP=-1.5:LRA=11[out]')
subprocess.run(['ffmpeg', '-y', '-v', 'error', *ing, '-filter_complex', ';'.join(filtri), '-map', '[out]', '-ar', '44100', f'{cart}/audio.wav'], check=True)
print(round(DURATA, 2))
