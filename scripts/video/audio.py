# Voce al suo posto, musica sotto che si abbassa quando parla Mizi, sottotitoli WebVTT.
# python3 audio.py <scheda.json> <cartella-lavoro>  →  audio.wav, sottotitoli.vtt
import json, subprocess, re, sys
spec, cart = json.load(open(sys.argv[1])), sys.argv[2]
testi = [s["voce"].replace("giocamizi punto it", "giocamizi.it") for s in spec["scene"]]
n = len(testi)
v = [float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'{cart}/voce/{i}.wav'],capture_output=True,text=True).stdout) for i in range(n)]
ANT, CODA = .5, .6
t = 0; voci = []
for d in v:
    voci.append(t + ANT); t += d + ANT + CODA
DUR = t
ing, filtri = [], []
for i, at in enumerate(voci):
    ing += ['-i', f'{cart}/voce/{i}.wav']
    filtri.append(f'[{i}:a]aresample=44100,aformat=channel_layouts=stereo,adelay={int(at*1000)}|{int(at*1000)}[v{i}]')
filtri.append(''.join(f'[v{i}]' for i in range(n)) + f'amix=inputs={n}:normalize=0,apad=whole_dur={DUR:.2f}[voce]')
ing += ['-i', f'{cart}/musica.wav']
filtri.append(f'[{n}:a]volume=0.22[mus]')
filtri.append('[voce]asplit=2[voce1][chiave]')
filtri.append('[mus][chiave]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=500[musd]')
filtri.append(f'[voce1][musd]amix=inputs=2:normalize=0,atrim=0:{DUR:.2f},loudnorm=I=-16:TP=-1.5:LRA=11[out]')
subprocess.run(['ffmpeg','-y','-v','error',*ing,'-filter_complex',';'.join(filtri),'-map','[out]','-ar','44100',f'{cart}/audio.wav'], check=True)
def ts(x):
    return f'{int(x // 3600):02d}:{int(x % 3600 // 60):02d}:{x % 60:06.3f}'
righe = ['WEBVTT', '']
for i, f in enumerate(testi):
    pezzi, cur = [], []
    for p in f.split(' '):
        cur.append(p)
        if len(' '.join(cur)) > 46 or re.search(r'[.:!?]$', p): pezzi.append(' '.join(cur)); cur = []
    if cur: pezzi.append(' '.join(cur))
    tot = sum(len(p) for p in pezzi); acc = 0
    for p in pezzi:
        a = voci[i] + v[i] * acc / tot; acc += len(p); b = voci[i] + v[i] * acc / tot
        righe += [f'{ts(a)} --> {ts(b)}', p, '']
open(f'{cart}/sottotitoli.vtt', 'w').write('\n'.join(righe))
print('durata', round(DUR, 2))
