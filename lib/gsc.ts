import { createSign } from "node:crypto";

/**
 * Google Search Console: le ricerche che portano a una pagina (query,
 * impressioni, clic, posizione media). Si collega con un service account in
 * sola lettura, aggiunto come utente della proprietà in Search Console.
 *
 *   GSC_SERVICE_ACCOUNT  il JSON della chiave del service account (Vercel)
 *   GSC_PROPRIETA        facoltativa, di default "sc-domain:giocamizi.it"
 *
 * Senza variabili il pannello mostra le istruzioni invece dei dati.
 */

export const gscConfigurato = () => Boolean(process.env.GSC_SERVICE_ACCOUNT);

export interface RigaRicerca {
  query: string;
  clic: number;
  impressioni: number;
  posizione: number;
}

const b64url = (s: string | Buffer) => Buffer.from(s).toString("base64url");

async function token(): Promise<string | null> {
  try {
    const conto = JSON.parse(process.env.GSC_SERVICE_ACCOUNT ?? "") as { client_email: string; private_key: string };
    const ora = Math.floor(Date.now() / 1000);
    const testa = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const corpo = b64url(
      JSON.stringify({
        iss: conto.client_email,
        scope: "https://www.googleapis.com/auth/webmasters.readonly",
        aud: "https://oauth2.googleapis.com/token",
        iat: ora,
        exp: ora + 3600,
      }),
    );
    const firma = createSign("RSA-SHA256").update(`${testa}.${corpo}`).sign(conto.private_key);
    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: `${testa}.${corpo}.${b64url(firma)}`,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    const json = (await r.json()) as { access_token?: string };
    return json.access_token ?? null;
  } catch {
    return null;
  }
}

/** Le ricerche degli ultimi `giorni` giorni per una pagina (URL completo). null = errore. */
export async function ricerchePerPagina(pagina: string, giorni = 28): Promise<RigaRicerca[] | null> {
  if (!gscConfigurato()) return null;
  const accesso = await token();
  if (!accesso) return null;
  const proprieta = process.env.GSC_PROPRIETA ?? "sc-domain:giocamizi.it";
  const giorno = (d: number) => new Date(Date.now() - d * 86400000).toISOString().slice(0, 10);
  try {
    const r = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(proprieta)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${accesso}`, "content-type": "application/json" },
        body: JSON.stringify({
          // Search Console ha 2-3 giorni di ritardo.
          startDate: giorno(giorni + 3),
          endDate: giorno(3),
          dimensions: ["query"],
          dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "equals", expression: pagina }] }],
          rowLimit: 25,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!r.ok) return null;
    const json = (await r.json()) as { rows?: { keys: string[]; clicks: number; impressions: number; position: number }[] };
    return (json.rows ?? []).map((x) => ({
      query: x.keys[0],
      clic: x.clicks,
      impressioni: x.impressions,
      posizione: Math.round(x.position * 10) / 10,
    }));
  } catch {
    return null;
  }
}
