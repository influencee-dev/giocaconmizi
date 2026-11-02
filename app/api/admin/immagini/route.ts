import { NextResponse } from "next/server";
import { adminValido } from "@/lib/admin";
import { FEDELTA, ottimizza, type Fedelta } from "@/lib/immagini/ottimizza";

/**
 * Ottimizzatore immagini del pannello: riceve UNA foto (già girata e ridotta
 * dal browser se era enorme), restituisce il WebP più leggero che resta
 * identico a occhio, più le varianti responsive. Solo con il codice admin.
 * Niente viene salvato: la foto entra, il WebP esce.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTE = 4 * 1024 * 1024;
const LATI = [2560, 1920, 1440, 1080];
const LARGHEZZE_OK = [1440, 960, 800, 640, 480];

export async function POST(richiesta: Request) {
  if (!(await adminValido(richiesta.headers.get("x-admin-codice")))) {
    return NextResponse.json({ errore: "non autorizzato" }, { status: 401 });
  }

  let modulo: FormData;
  try {
    modulo = await richiesta.formData();
  } catch {
    return NextResponse.json({ errore: "richiesta non valida" }, { status: 400 });
  }
  const file = modulo.get("file");
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ errore: "manca l'immagine" }, { status: 400 });
  }
  if (file.size > MAX_BYTE) {
    return NextResponse.json({ errore: "immagine troppo grande (massimo 4 MB)" }, { status: 413 });
  }

  const lato = Number(modulo.get("latoMassimo"));
  const fedelta = String(modulo.get("fedelta") ?? "equilibrata") as Fedelta;
  const rapporto = Number(modulo.get("rapporto")) || undefined;
  const varianti = String(modulo.get("varianti") ?? "")
    .split(",")
    .map(Number)
    .filter((l) => LARGHEZZE_OK.includes(l));

  try {
    const r = await ottimizza(Buffer.from(await file.arrayBuffer()), {
      latoMassimo: LATI.includes(lato) ? lato : 1920,
      fedelta: fedelta in FEDELTA ? fedelta : "equilibrata",
      rapporto: rapporto && rapporto > 0.2 && rapporto < 5 ? rapporto : undefined,
      varianti,
    });
    const fuori = (v: typeof r.principale) => ({
      larghezza: v.larghezza,
      altezza: v.altezza,
      byte: v.byte,
      base64: v.dati.toString("base64"),
    });
    return NextResponse.json(
      { qualita: r.qualita, psnr: r.psnr, principale: fuori(r.principale), varianti: r.varianti.map(fuori) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ errore: "non riesco a leggere questa immagine" }, { status: 422 });
  }
}
