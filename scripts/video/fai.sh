#!/usr/bin/env bash
# Un video di Mizi dall'inizio alla fine: bash scripts/video/fai.sh <slug> [cartella-lavoro]
# Legge content/video/<slug>.json; serve una build fresca (npm run build) e la chiave
# OpenAI nell'ambiente cloud. Produce:
#   public/video/<slug>.mp4 (16:9 per il sito), .webp (poster), .vtt (sottotitoli)
#   <cartella-lavoro>/<slug> · 16x9.mp4 e · 9x16.mp4 (da caricare su Drive e YouTube)
set -euo pipefail
SLUG="$1"
QUI="$(cd "$(dirname "$0")" && pwd)"
RADICE="$(cd "$QUI/../.." && pwd)"
LAVORO="${2:-${TMPDIR:-/tmp}/video-mizi/$SLUG}"
SPEC="$RADICE/content/video/$SLUG.json"
FPS=25
[ -f "$SPEC" ] || { echo "Manca $SPEC"; exit 1; }
mkdir -p "$LAVORO/asset" "$LAVORO/voce"
cp "$RADICE"/lib/social/caratteri/nunito-*.ttf "$RADICE"/public/mizi/mizi-intera.webp "$RADICE"/public/mizi/giocamizi-logo-orizzontale.webp "$RADICE"/public/icone/*.png "$LAVORO/asset/"

# 1. server di prova (con il codice di prova del pannello), se non è già acceso
AVVIATO=""
if ! curl -s -o /dev/null http://localhost:3100/robots.txt; then
  CODICE=$(cd "$RADICE" && node -e 'import("./scripts/verifica/comune.mjs").then(m=>{console.log(m.CODICE_ADMIN_PROVA);process.exit(0)})' | tail -1)
  (cd "$RADICE" && GIOCAMIZI_ADMIN_PROVA="$CODICE" npx next start -p 3100 >/dev/null 2>&1 &)
  for _ in $(seq 30); do sleep 1; curl -s -o /dev/null http://localhost:3100/robots.txt && break; done
  AVVIATO=1
fi
echo "· schermate"; node "$QUI/schermi.mjs" "$SPEC" "$LAVORO"
[ -n "$AVVIATO" ] && pkill -f next-server || true
echo "· voce di Mizi"; python3 "$QUI/voce.py" "$SPEC" "$LAVORO"
DUR=$(python3 "$QUI/prepara.py" "$SPEC" "$LAVORO")
echo "· musica e audio ($DUR s)"; python3 "$QUI/musica.py" "$DUR" "$LAVORO/musica.wav" >/dev/null; python3 "$QUI/audio.py" "$SPEC" "$LAVORO"
echo "· fotogrammi (16:9 e 9:16 insieme)"
rm -rf "$LAVORO/fotogrammi" "$LAVORO/fotogrammi-v"; mkdir -p "$LAVORO/fotogrammi" "$LAVORO/fotogrammi-v"
node "$QUI/rendi.mjs" "$LAVORO" > "$LAVORO/rendi-o.log" 2>&1 &
node "$QUI/rendi.mjs" "$LAVORO" v > "$LAVORO/rendi-v.log" 2>&1 &
wait
grep -h "ERR" "$LAVORO"/rendi-*.log && exit 1 || true
echo "· montaggio"
ffmpeg -y -v error -framerate $FPS -i "$LAVORO/fotogrammi/f%05d.jpg" -i "$LAVORO/audio.wav" -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -profile:v high -c:a aac -b:a 128k -movflags +faststart -shortest "$LAVORO/$SLUG · 16x9.mp4"
ffmpeg -y -v error -framerate $FPS -i "$LAVORO/fotogrammi-v/f%05d.jpg" -i "$LAVORO/audio.wav" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -profile:v high -c:a aac -b:a 160k -movflags +faststart -shortest "$LAVORO/$SLUG · 9x16.mp4"
python3 -c "from PIL import Image; Image.open('$LAVORO/fotogrammi/f00075.jpg').convert('RGB').resize((1280,720)).save('$LAVORO/poster.webp','WEBP',quality=80)"
mkdir -p "$RADICE/public/video"
cp "$LAVORO/$SLUG · 16x9.mp4" "$RADICE/public/video/$SLUG.mp4"
cp "$LAVORO/poster.webp" "$RADICE/public/video/$SLUG.webp"
cp "$LAVORO/sottotitoli.vtt" "$RADICE/public/video/$SLUG.vtt"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$LAVORO/$SLUG · 16x9.mp4" | xargs printf "· fatto: %.1f s\n"
ls -la "$LAVORO"/*.mp4
