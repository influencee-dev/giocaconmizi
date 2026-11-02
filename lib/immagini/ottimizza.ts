import sharp from "sharp";

/**
 * L'ottimizzatore delle immagini: la massima risoluzione utile con il minimo
 * peso. Lo usano il pannello (/admin/[codice]/immagini, via
 * /api/admin/immagini) e la riga di comando (npm run immagini).
 *
 * Come: invece di una qualità fissa uguale per tutte, cerca per ogni foto la
 * qualità WebP più bassa che resta identica a occhio, misurando il PSNR fra
 * l'originale e il WebP decodificato (38 dB, il valore «equilibrata», è già invisibile a occhio). Una
 * foto piena di dettagli prende una qualità più alta, una con campiture
 * piatte una più bassa: entrambe pesano il minimo possibile.
 * I metadati (EXIF, GPS della foto dal telefono) non vengono mai copiati.
 */

export const FEDELTA = {
  leggera: 35,
  equilibrata: 38,
  fedele: 41,
} as const;
export type Fedelta = keyof typeof FEDELTA;

export interface OpzioniOttimizza {
  /** Lato lungo massimo in pixel: la foto non viene mai ingrandita. */
  latoMassimo: number;
  fedelta: Fedelta;
  /** Ritaglio a un rapporto larghezza/altezza (es. 16/9), centrato. */
  rapporto?: number;
  /** Larghezze delle varianti responsive (oltre all'originale ridotto). */
  varianti?: number[];
}

export interface Variante {
  larghezza: number;
  altezza: number;
  byte: number;
  dati: Buffer;
}

export interface Risultato {
  qualita: number;
  psnr: number;
  principale: Variante;
  varianti: Variante[];
}

/** PSNR in dB fra due buffer raw della stessa forma. */
function psnr(a: Buffer, b: Buffer): number {
  let somma = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const d = a[i] - b[i];
    somma += d * d;
  }
  const mse = somma / n;
  return mse === 0 ? 99 : 10 * Math.log10((255 * 255) / mse);
}

const webp = (raw: Buffer, info: sharp.OutputInfo, qualita: number) =>
  sharp(raw, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .webp({ quality: qualita, effort: 5, smartSubsample: true })
    .toBuffer();

export async function ottimizza(ingresso: Buffer, o: OpzioniOttimizza): Promise<Risultato> {
  const meta = await sharp(ingresso).rotate().metadata();
  // Dopo rotate() le dimensioni "vere" sono quelle già girate.
  const girata = (meta.orientation ?? 1) >= 5;
  let w = (girata ? meta.height : meta.width) ?? 0;
  let h = (girata ? meta.width : meta.height) ?? 0;
  if (!w || !h) throw new Error("immagine non leggibile");

  // 1. Ritaglio al rapporto, poi riduzione al lato massimo (mai ingrandire).
  let base = sharp(ingresso).rotate();
  if (o.rapporto) {
    let cw = w;
    let ch = Math.round(w / o.rapporto);
    if (ch > h) {
      ch = h;
      cw = Math.round(h * o.rapporto);
    }
    base = base.extract({ left: Math.round((w - cw) / 2), top: Math.round((h - ch) / 2), width: cw, height: ch });
    w = cw;
    h = ch;
  }
  const scala = Math.min(1, o.latoMassimo / Math.max(w, h));
  const W = Math.round(w * scala);
  const H = Math.round(h * scala);
  const { data: raw, info } = await base.resize(W, H).raw().toBuffer({ resolveWithObject: true });

  // 2. Ricerca binaria della qualità più bassa sopra la soglia di fedeltà.
  const soglia = FEDELTA[o.fedelta];
  let basso = 35;
  let alto = 95;
  let migliore = { qualita: alto, dati: await webp(raw, info, alto), psnr: 0 };
  migliore.psnr = psnr(raw, await sharp(migliore.dati).raw().toBuffer());
  while (alto - basso > 2) {
    const q = Math.round((basso + alto) / 2);
    const dati = await webp(raw, info, q);
    const valore = psnr(raw, await sharp(dati).raw().toBuffer());
    if (valore >= soglia) {
      migliore = { qualita: q, dati, psnr: valore };
      alto = q;
    } else {
      basso = q;
    }
  }

  // 3. Varianti responsive alla stessa qualità (più piccole = ancora più nitide).
  const varianti: Variante[] = [];
  for (const l of [...new Set(o.varianti ?? [])].sort((a, b) => b - a)) {
    if (l >= W) continue;
    const alt = Math.round(l * (H / W));
    const dati = await sharp(raw, { raw: { width: info.width, height: info.height, channels: info.channels } })
      .resize(l, alt)
      .webp({ quality: migliore.qualita, effort: 5, smartSubsample: true })
      .toBuffer();
    varianti.push({ larghezza: l, altezza: alt, byte: dati.length, dati });
  }

  return {
    qualita: migliore.qualita,
    psnr: Math.round(migliore.psnr * 10) / 10,
    principale: { larghezza: W, altezza: H, byte: migliore.dati.length, dati: migliore.dati },
    varianti,
  };
}

/** Un nome file pulito e leggibile da Google: minuscolo, trattini, niente accenti. */
export function nomePulito(nome: string): string {
  return (
    nome
      .replace(/\.[a-z0-9]+$/i, "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "immagine"
  );
}
