#!/usr/bin/env bash
# Un reel di Mizi dall'inizio alla fine: bash scripts/video/reel.sh <slug> [cartella-lavoro]
# Legge content/video/reel/<slug>.json; serve una build fresca (npm run build) e la
# chiave OpenAI nell'ambiente cloud. Produce nella cartella di lavoro, in 9:16 1080×1920:
#   «<slug> · reel.mp4»                    voce di Mizi, musica, sottotitoli stampati
#   «<slug> · reel senza sottotitoli.mp4»  uguale, per chi accende i sottotitoli di Instagram
#   «<slug> · reel muto.mp4»               senza audio né sottotitoli, per l'audio di tendenza
# UN SOLO strato di testo: mai i sottotitoli insieme a quelli automatici di Instagram.
set -euo pipefail
SLUG="$1"
QUI="$(cd "$(dirname "$0")" && pwd)"
RADICE="$(cd "$QUI/../.." && pwd)"
LAVORO="${2:-${TMPDIR:-/tmp}/reel-mizi/$SLUG}"
SPEC="$RADICE/content/video/reel/$SLUG.json"
[ -f "$SPEC" ] || { echo "Manca $SPEC"; exit 1; }
mkdir -p "$LAVORO/asset" "$LAVORO/voce"
cp "$RADICE"/lib/social/caratteri/nunito-*.ttf "$RADICE"/public/mizi/mizi-intera.webp "$LAVORO/asset/"

AVVIATO=""
if ! curl -s -o /dev/null http://localhost:3100/robots.txt; then
  (cd "$RADICE" && npx next start -p 3100 >/dev/null 2>&1 &)
  for _ in $(seq 30); do sleep 1; curl -s -o /dev/null http://localhost:3100/robots.txt && break; done
  AVVIATO=1
fi
echo "· registrazioni"; node "$QUI/reel-clip.mjs" "$SPEC" "$LAVORO"
[ -n "$AVVIATO" ] && pkill -f next-server || true
echo "· voce di Mizi"; python3 "$QUI/voce.py" "$SPEC" "$LAVORO"
DUR=$(python3 "$QUI/reel.py" "$SPEC" "$LAVORO"); echo "· durata $DUR s"
rm -rf "$LAVORO/fotogrammi" "$LAVORO/fotogrammi-senza"; mkdir -p "$LAVORO/fotogrammi" "$LAVORO/fotogrammi-senza"
node "$QUI/reel-rendi.mjs" "$LAVORO" > "$LAVORO/rendi.log" 2>&1 &
node "$QUI/reel-rendi.mjs" "$LAVORO" senza > "$LAVORO/rendi-senza.log" 2>&1 &
wait
grep -h "ERR" "$LAVORO"/rendi*.log && exit 1 || true
V="-c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -profile:v high -movflags +faststart"
ffmpeg -y -v error -framerate 25 -i "$LAVORO/fotogrammi/f%05d.jpg" -i "$LAVORO/audio.wav" $V -c:a aac -b:a 192k -shortest "$LAVORO/$SLUG · reel.mp4"
ffmpeg -y -v error -framerate 25 -i "$LAVORO/fotogrammi-senza/f%05d.jpg" -i "$LAVORO/audio.wav" $V -c:a aac -b:a 192k -shortest "$LAVORO/$SLUG · reel senza sottotitoli.mp4"
ffmpeg -y -v error -framerate 25 -i "$LAVORO/fotogrammi-senza/f%05d.jpg" $V -an "$LAVORO/$SLUG · reel muto.mp4"
ls -la "$LAVORO"/*.mp4
