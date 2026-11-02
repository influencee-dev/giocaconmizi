/**
 * Uno ZIP nel browser, senza librerie: archivio "store" (senza compressione,
 * tanto i WebP sono già compressi). Basta a scaricare tutte le immagini
 * ottimizzate in un file solo.
 */

const TABELLA = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(dati: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < dati.length; i++) c = TABELLA[(c ^ dati[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function creaZip(file: { nome: string; dati: Uint8Array }[]): Blob {
  const parti: Uint8Array[] = [];
  const centrale: Uint8Array[] = [];
  const codifica = new TextEncoder();
  let posizione = 0;

  for (const f of file) {
    const nome = codifica.encode(f.nome);
    const crc = crc32(f.dati);
    const locale = new DataView(new ArrayBuffer(30));
    locale.setUint32(0, 0x04034b50, true);
    locale.setUint16(4, 20, true);
    locale.setUint16(6, 0x0800, true); // nomi in UTF-8
    locale.setUint32(14, crc, true);
    locale.setUint32(18, f.dati.length, true);
    locale.setUint32(22, f.dati.length, true);
    locale.setUint16(26, nome.length, true);
    parti.push(new Uint8Array(locale.buffer), nome, f.dati);

    const voce = new DataView(new ArrayBuffer(46));
    voce.setUint32(0, 0x02014b50, true);
    voce.setUint16(4, 20, true);
    voce.setUint16(6, 20, true);
    voce.setUint16(8, 0x0800, true);
    voce.setUint32(16, crc, true);
    voce.setUint32(20, f.dati.length, true);
    voce.setUint32(24, f.dati.length, true);
    voce.setUint16(28, nome.length, true);
    voce.setUint32(42, posizione, true);
    centrale.push(new Uint8Array(voce.buffer), nome);

    posizione += 30 + nome.length + f.dati.length;
  }

  const lunghezzaCentrale = centrale.reduce((a, p) => a + p.length, 0);
  const fine = new DataView(new ArrayBuffer(22));
  fine.setUint32(0, 0x06054b50, true);
  fine.setUint16(8, file.length, true);
  fine.setUint16(10, file.length, true);
  fine.setUint32(12, lunghezzaCentrale, true);
  fine.setUint32(16, posizione, true);

  return new Blob([...parti, ...centrale, new Uint8Array(fine.buffer)] as BlobPart[], { type: "application/zip" });
}
