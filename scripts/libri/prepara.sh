#!/usr/bin/env bash
# Prepara la cartella di lavoro di un libro (fuori dal repo): caratteri, modello di ingrandimento, strumenti.
# Uso: scripts/libri/prepara.sh <cartella di lavoro>
set -euo pipefail
QUI="$(cd "$(dirname "$0")" && pwd)"
LAVORO="${1:?indica la cartella di lavoro}"
mkdir -p "$LAVORO"/{in,out,font,modelli}
cp "$QUI"/copertina.py "$QUI"/interno.py "$QUI"/ingrandisci.py "$LAVORO"/
pip install -q pillow reportlab pypdf fonttools brotli torch spandrel
cd "$LAVORO/font"
npm pack --silent @fontsource/londrina-solid @fontsource/roboto @fontsource/poppins
python3 - <<'PY'
import tarfile, glob, io
from fontTools.ttLib import TTFont
VOGLIO = {"londrina-solid-latin-900-normal": "londrina-900", "roboto-latin-500-normal": "roboto-500",
          "roboto-latin-700-normal": "roboto-700", "poppins-latin-400-normal": "poppins-400",
          "poppins-latin-300-italic": "poppins-300i", "poppins-latin-600-normal": "poppins-600"}
for pacco in glob.glob("*.tgz"):
    with tarfile.open(pacco) as t:
        for m in t.getmembers():
            nome = m.name.split("/")[-1].replace(".woff2", "")
            if m.name.endswith(".woff2") and nome in VOGLIO:
                f = TTFont(io.BytesIO(t.extractfile(m).read())); f.flavor = None; f.save(VOGLIO[nome] + ".ttf")
PY
cd ../modelli
[ -f anime6B.pth ] || curl -sL -o anime6B.pth https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.2.4/RealESRGAN_x4plus_anime_6B.pth
echo "Pronta: $LAVORO. Metti in in/ il fronte (fronte.png), il logo (logo.png), la foto e l'interno di partenza."
