// I disegni di Natale da colorare (26/11/2026): node scripts/disegni-natale.mjs <cartella>
// La cartella ha 01.png … 10.png nell'ordine di lib/natale/disegni-natale.ts.
// Scrive in public/disegni-natale/: <slug>.webp (anteprima, 600 px), <slug>.pdf
// (A4, il disegno in mezzo con il margine) e tutti.pdf (i dieci, uno per pagina).
// Il PDF è scritto a mano come quello della letterina (lib/natale/natale-esporta.ts):
// per un'immagine a pagina piena bastano pochi oggetti, niente libreria.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const cartella = process.argv[2];
if (!cartella) throw new Error("uso: node scripts/disegni-natale.mjs <cartella con 01.png … 10.png>");
const slug = [...readFileSync("lib/natale/disegni-natale.ts", "utf8").matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
const USCITA = "public/disegni-natale";
mkdirSync(USCITA, { recursive: true });

// A4 a 150 dpi: basta per un disegno a linee grosse e tiene il PDF leggero.
const W = 1240, H = 1754, MARGINE = 90;

function pdf(pagine) {
  const A4 = { w: 595.28, h: 841.89 };
  const parti = [];
  const offset = [];
  let lunghezza = 0;
  const aggiungi = (p) => { const b = typeof p === "string" ? Buffer.from(p, "latin1") : p; parti.push(b); lunghezza += b.length; };
  const n = pagine.length;
  // 1 catalogo, 2 pagine, poi per ogni pagina: pagina, contenuto, immagine.
  const idPagina = (i) => 3 + i * 3;
  aggiungi("%PDF-1.4\n%\xe2\xe3\xcf\xd3\n");
  offset[1] = lunghezza; aggiungi("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  offset[2] = lunghezza; aggiungi(`2 0 obj\n<< /Type /Pages /Kids [${pagine.map((_, i) => `${idPagina(i)} 0 R`).join(" ")}] /Count ${n} >>\nendobj\n`);
  pagine.forEach((jpeg, i) => {
    const p = idPagina(i), c = p + 1, im = p + 2;
    offset[p] = lunghezza;
    aggiungi(`${p} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${A4.w} ${A4.h}] /Resources << /XObject << /Im0 ${im} 0 R >> >> /Contents ${c} 0 R >>\nendobj\n`);
    const disegno = `q ${A4.w} 0 0 ${A4.h} 0 0 cm /Im0 Do Q`;
    offset[c] = lunghezza;
    aggiungi(`${c} 0 obj\n<< /Length ${disegno.length} >>\nstream\n${disegno}\nendstream\nendobj\n`);
    offset[im] = lunghezza;
    aggiungi(`${im} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${W} /Height ${H} /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
    aggiungi(jpeg);
    aggiungi("\nendstream\nendobj\n");
  });
  const totale = 3 + n * 3;
  const xref = lunghezza;
  let righe = "";
  for (let k = 1; k < totale; k++) righe += `${String(offset[k]).padStart(10, "0")} 00000 n \n`;
  aggiungi(`xref\n0 ${totale}\n0000000000 65535 f \n${righe}trailer\n<< /Size ${totale} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return Buffer.concat(parti);
}

const tutte = [];
for (let i = 0; i < slug.length; i++) {
  const sorgente = `${cartella}/${String(i + 1).padStart(2, "0")}.png`;
  const disegno = await sharp(sorgente).flatten({ background: "#ffffff" }).grayscale()
    .resize({ width: W - 2 * MARGINE, height: H - 2 * MARGINE, fit: "inside" }).toBuffer();
  const foglio = await sharp({ create: { width: W, height: H, channels: 3, background: "#ffffff" } })
    .composite([{ input: disegno, gravity: "centre" }]).grayscale().jpeg({ quality: 82 }).toBuffer();
  const jpeg = await sharp(foglio).toColourspace("b-w").jpeg({ quality: 82 }).toBuffer();
  tutte.push(jpeg);
  writeFileSync(`${USCITA}/${slug[i]}.pdf`, pdf([jpeg]));
  await sharp(sorgente).flatten({ background: "#ffffff" }).resize({ width: 600 }).webp({ quality: 80 }).toFile(`${USCITA}/${slug[i]}.webp`);
  console.log(slug[i]);
}
writeFileSync(`${USCITA}/tutti.pdf`, pdf(tutte));
console.log(`disegni-natale: ${slug.length} disegni in ${USCITA}`);
