import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { createHmac, timingSafeEqual } from "node:crypto";
import { postDaId, type Slide } from "@/lib/social/post";

/**
 * Le slide Instagram: JPEG 1080×1350 (4:5, il formato verticale del feed),
 * disegnate con next/og (satori) negli stessi colori e nel carattere del
 * sito (Nunito, licenza in lib/social/caratteri/); ogni div con figli ha
 * display:flex. Non sono pubbliche:
 *  - anteprima nel pannello: /admin/<codice>/social/anteprima/<id>/<n>.jpg (codice admin)
 *  - prelievo di Meta: /social/<id>/<n>.jpg?f=<firma>, firma HMAC con il token
 *    Instagram (esiste solo su Vercel): senza firma giusta → 404.
 * I file letti a runtime (Mizi, foto, caratteri) sono inclusi nella funzione
 * da outputFileTracingIncludes in next.config.ts.
 */

/** La firma che apre una slide a Meta. Null se Instagram non è collegato. */
export function firmaSlide(id: string, n: number): string | null {
  const chiave = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!chiave) return null;
  return createHmac("sha256", chiave).update(`slide:${id}:${n}`).digest("hex").slice(0, 32);
}

export function firmaValida(id: string, n: number, firma: string | null): boolean {
  const giusta = firmaSlide(id, n);
  if (!giusta || !firma || firma.length !== giusta.length) return false;
  return timingSafeEqual(Buffer.from(firma), Buffer.from(giusta));
}

const caratteri = () =>
  ([600, 800] as const).map((weight) => ({
    name: "Nunito",
    data: fs.readFileSync(path.join(process.cwd(), "lib", "social", "caratteri", `nunito-${weight}.ttf`)),
    weight,
    style: "normal" as const,
  }));

const L = 1080;
const H = 1350;
const C = {
  crema: "#FFF3E6",
  cremaScuro: "#F6E3CF",
  notte: "#1F2430",
  notteTenue: "#4A5164",
  viola: "#9B6DD6",
  rosa: "#F28AB2",
  giallo: "#F9C846",
  azzurro: "#3DB5E6",
  lilla: "#EFE6FA",
};

const cache = new Map<string, string>();
/** Un file di public/ come data URI (satori non legge WebP: si converte). */
async function datoImmagine(rel: string, larghezza: number, formato: "png" | "jpeg") {
  const chiave = `${rel}|${larghezza}|${formato}`;
  const c = cache.get(chiave);
  if (c) return c;
  const grezzo = fs.readFileSync(path.join(process.cwd(), "public", rel));
  const img = sharp(grezzo).resize({ width: larghezza });
  const dati = formato === "png" ? await img.png().toBuffer() : await img.jpeg({ quality: 88 }).toBuffer();
  const uri = `data:image/${formato};base64,${dati.toString("base64")}`;
  cache.set(chiave, uri);
  return uri;
}

function Marchio({ chiaro = false }: { chiaro?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", width: 24, height: 24, borderRadius: 999, backgroundColor: C.rosa }} />
      <div style={{ display: "flex", width: 24, height: 24, borderRadius: 999, backgroundColor: C.giallo }} />
      <div style={{ display: "flex", width: 24, height: 24, borderRadius: 999, backgroundColor: C.azzurro }} />
      <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: chiaro ? "#FFFFFF" : C.notte, marginLeft: 10 }}>
        Gioca con <span style={{ color: chiaro ? C.giallo : C.viola, marginLeft: 10 }}>Mizi</span>
      </div>
    </div>
  );
}

function Pill({ testo, sfondo = "#FFFFFF", colore = C.notteTenue, bordo = true }: { testo: string; sfondo?: string; colore?: string; bordo?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignSelf: "flex-start",
        backgroundColor: sfondo,
        border: bordo ? `3px solid ${C.cremaScuro}` : "none",
        borderRadius: 999,
        padding: "12px 28px",
        fontSize: 30,
        fontWeight: 700,
        color: colore,
      }}
    >
      {testo}
    </div>
  );
}

const misuraTitolo = (t: string, grande: number) => (t.length > 70 ? grande - 22 : t.length > 45 ? grande - 10 : grande);

async function disegna(s: Slide, mizi: string) {
  const base = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    backgroundColor: C.crema,
    fontFamily: "Nunito",
    fontWeight: 600,
  };

  if (s.tipo === "copertina") {
    return (
      <div style={{ ...base, padding: 72, justifyContent: "space-between" }}>
        <Marchio />
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <Pill testo={s.occhiello} />
          <div style={{ display: "flex", fontSize: misuraTitolo(s.titolo, 86), fontWeight: 800, color: C.notte, lineHeight: 1.1, maxWidth: 900 }}>
            {s.titolo}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <Pill testo="Scorri →" sfondo={C.viola} colore="#FFFFFF" bordo={false} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mizi} width={330} height={330} alt="" style={{ objectFit: "contain" }} />
        </div>
      </div>
    );
  }

  if (s.tipo === "testo") {
    return (
      <div style={{ ...base, padding: 72, justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Marchio />
          {s.numero ? <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: C.viola }}>{s.numero}</div> : null}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            backgroundColor: "#FFFFFF",
            borderRadius: 48,
            padding: 64,
            border: `3px solid ${C.cremaScuro}`,
          }}
        >
          <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: C.viola, textTransform: "uppercase", letterSpacing: 2 }}>
            {s.occhiello}
          </div>
          <div style={{ display: "flex", fontSize: misuraTitolo(s.titolo, 60), fontWeight: 800, color: C.notte, lineHeight: 1.15 }}>{s.titolo}</div>
          <div style={{ display: "flex", fontSize: s.testo.length > 240 ? 36 : 40, color: C.notte, lineHeight: 1.45 }}>{s.testo}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: C.notteTenue }}>giocamizi.it</div>
      </div>
    );
  }

  if (s.tipo === "finale") {
    return (
      <div style={{ ...base, padding: 72, justifyContent: "space-between", alignItems: "center", backgroundColor: C.notte }}>
        <Marchio chiaro />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mizi} width={380} height={380} alt="" style={{ objectFit: "contain" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", fontSize: 62, fontWeight: 800, color: "#FFFFFF", textAlign: "center", lineHeight: 1.15, maxWidth: 880 }}>
            {s.titolo}
          </div>
          <div style={{ display: "flex", backgroundColor: C.rosa, borderRadius: 999, padding: "18px 40px", fontSize: 36, fontWeight: 800, color: "#FFFFFF" }}>
            Link in bio
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: C.cremaScuro }}>{s.link}</div>
        </div>
      </div>
    );
  }

  if (s.tipo === "foto") {
    const foto = await datoImmagine(s.foto, L, "jpeg");
    return (
      <div style={{ ...base }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={foto} width={L} height={Math.round((L * 9) / 16)} alt="" style={{ objectFit: "cover" }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: 64, gap: 26, justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <Pill testo={s.occhiello} />
            <div style={{ display: "flex", fontSize: misuraTitolo(s.titolo, 64), fontWeight: 800, color: C.notte, lineHeight: 1.12 }}>{s.titolo}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Marchio />
            <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: C.notteTenue }}>link in bio</div>
          </div>
        </div>
      </div>
    );
  }

  // gioco
  return (
    <div style={{ ...base, padding: 72, justifyContent: "space-between", backgroundColor: C.lilla }}>
      <Marchio />
      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        <Pill testo="Gioco gratuito · senza pubblicità" sfondo={C.viola} colore="#FFFFFF" bordo={false} />
        <div style={{ display: "flex", fontSize: misuraTitolo(s.titolo, 92), fontWeight: 800, color: C.notte, lineHeight: 1.08 }}>{s.titolo}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <Pill testo={s.eta} />
          <Pill testo={`${s.minuti} minuti`} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 860 }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 800, color: C.viola, textTransform: "uppercase", letterSpacing: 2 }}>Cosa allena</div>
          <div style={{ display: "flex", fontSize: 40, color: C.notte, lineHeight: 1.35 }}>{s.allena}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: C.viola }}>Si gioca dal telefono</div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: C.notteTenue }}>{s.link}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mizi} width={340} height={340} alt="" style={{ objectFit: "contain" }} />
      </div>
    </div>
  );
}

/** Il numero della slide da «3.jpg»; null se il nome non è valido. */
export function numeroSlide(file: string): number | null {
  const m = /^(\d{1,2})\.jpe?g$/i.exec(file);
  return m ? Number(m[1]) : null;
}

/** La slide n (da 1) del post `id` come JPEG, o null se non esiste. */
export async function slideJpeg(id: string, n: number): Promise<Buffer | null> {
  const slide = postDaId(id)?.slides[n - 1];
  if (!slide) return null;
  const mizi = await datoImmagine("mizi/mizi-intera.webp", 500, "png");
  const png = await new ImageResponse(await disegna(slide, mizi), { width: L, height: H, fonts: caratteri() }).arrayBuffer();
  return sharp(Buffer.from(png)).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
}

/** La risposta HTTP comune: mai in cache condivise, mai nei motori. */
export function rispostaSlide(jpeg: Buffer | null) {
  if (!jpeg) return new Response("Non trovata", { status: 404, headers: { "x-robots-tag": "noindex" } });
  return new Response(new Uint8Array(jpeg), {
    headers: { "content-type": "image/jpeg", "cache-control": "private, no-store", "x-robots-tag": "noindex, nofollow" },
  });
}
