# Musichetta originale per il video: marimba, basso e un piccolo sonaglio.
# Giro di accordi semplice (Do - La min - Fa - Sol), arpeggi in croma, 104 bpm.
import numpy as np, wave
SR = 44100
DUR = 96.5
BPM = 104
beat = 60 / BPM
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)

def nota(f):
    return 440 * 2 ** ((f - 69) / 12)

def marimba(freq, dur, vol):
    t = np.arange(int(SR * dur)) / SR
    s = (np.sin(2*np.pi*freq*t) + .35*np.sin(2*np.pi*freq*4*t)*np.exp(-t*30) + .12*np.sin(2*np.pi*freq*10*t)*np.exp(-t*60))
    env = np.exp(-t * 5.5) * np.minimum(1, t * 400)
    return s * env * vol

def basso(freq, dur, vol):
    t = np.arange(int(SR * dur)) / SR
    s = np.sin(2*np.pi*freq*t) + .25*np.sin(2*np.pi*freq*2*t)
    env = np.exp(-t * 2.2) * np.minimum(1, t * 200)
    return s * env * vol

def sonaglio(dur, vol):
    n = int(SR * dur); t = np.arange(n) / SR
    rumore = np.random.default_rng(7).standard_normal(n)
    rumore = np.diff(np.concatenate([[0], rumore]))  # più acuto
    return rumore * np.exp(-t * 45) * vol

def metti(buf, s, at, pan=0):
    i = int(at * SR); j = min(N, i + len(s))
    if i >= N: return
    L[i:j] += s[:j-i] * (1 - max(0, pan)); R[i:j] += s[:j-i] * (1 + min(0, pan))

# accordi (note MIDI): Do, La min, Fa, Sol
ACCORDI = [[60, 64, 67, 72], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]]
BASSI = [36, 33, 29, 31]
SCHEMA = [0, 2, 1, 3, 2, 1, 3, 2]  # ordine dell'arpeggio sulle 8 crome della battuta
melodia = [[76, None, 74, 72, 74, None, 76, None], [72, None, 71, 69, 71, None, 72, None],
           [69, None, 72, 74, 72, None, 69, None], [71, None, 74, 76, 74, 72, 71, None]]
t = 0; battuta = 0
while t < DUR - 2:
    k = battuta % 4
    acc = ACCORDI[k]
    for c in range(8):
        tc = t + c * beat / 2
        metti(L, marimba(nota(acc[SCHEMA[c]]), 1.2, .16), tc, pan=-.25 if c % 2 else .25)
        if c % 2 == 1: metti(L, sonaglio(.12, .05), tc, pan=.4)
    metti(L, basso(nota(BASSI[k]), beat * 2, .32), t)
    metti(L, basso(nota(BASSI[k]), beat * 2, .26), t + beat * 2)
    # la melodia entra dalla quinta battuta e si ferma ogni tanto
    if battuta >= 4 and (battuta // 8) % 2 == 0:
        for c, m in enumerate(melodia[k]):
            if m: metti(L, marimba(nota(m + 12), 1.0, .07), t + c * beat / 2)
    t += beat * 4; battuta += 1

mix = np.stack([L, R], 1)
mix /= np.max(np.abs(mix)) + 1e-9
fade = np.ones(N); fi = int(SR * 1.5); fo = int(SR * 3)
fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
mix *= fade[:, None] * .9
with wave.open('musica.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok', DUR)
