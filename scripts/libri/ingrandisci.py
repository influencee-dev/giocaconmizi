"""Ingrandisce un'illustrazione 4x con Real-ESRGAN (modello per illustrazioni), a tasselli, sulla CPU.
Uso: python3 ingrandisci.py <ingresso.png> <uscita.png> <lato finale in pixel>"""
import sys, numpy as np, torch
from PIL import Image
from spandrel import ModelLoader
ingresso, uscita, lato = sys.argv[1], sys.argv[2], int(sys.argv[3])
modello = ModelLoader().load_from_file("modelli/anime6B.pth").eval()   # spandrel carica solo i pesi (weights_only)
im = np.asarray(Image.open(ingresso).convert("RGB"), dtype=np.float32) / 255
h, w, _ = im.shape; S, T, M = modello.scale, 320, 24
out = np.zeros((h * S, w * S, 3), np.float32)
torch.set_num_threads(4)
with torch.no_grad():
    for y in range(0, h, T):
        for x in range(0, w, T):
            y0, x0, y1, x1 = max(y - M, 0), max(x - M, 0), min(y + T + M, h), min(x + T + M, w)
            t = torch.from_numpy(im[y0:y1, x0:x1]).permute(2, 0, 1)[None]
            r = modello(t)[0].permute(1, 2, 0).clamp(0, 1).numpy()
            ty, tx = (y - y0) * S, (x - x0) * S
            hh, ww = (min(y + T, h) - y) * S, (min(x + T, w) - x) * S
            out[y * S:y * S + hh, x * S:x * S + ww] = r[ty:ty + hh, tx:tx + ww]
        print("riga", y, flush=True)
grande = Image.fromarray((out * 255).round().astype(np.uint8))
grande.resize((lato, lato), Image.LANCZOS).save(uscita)
print("fatto", grande.size, "->", lato)
