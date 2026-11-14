import { Disegno } from "@/games/_engine/arte";
import { aCapo } from "@/components/biglietti/Caccia";
import { FOGLIO_A4 } from "@/components/biglietti/Etichette";
import { CSS_DA_COLORARE, Sfondo, inchiostro, type Variante } from "@/components/biglietti/Sfondo";
import type { TestoLetterina } from "@/lib/natale/letterina";

/**
 * Il foglio della letterina: un A4 a 300 dpi con la cornice di Natale del
 * creatore di biglietti (Sfondo, tema «natale»), il foglio chiaro al centro,
 * il testo che si rimpicciolisce da solo per stare in pagina, Mizi in basso.
 * Due modi: «scritta» (il testo scelto nell'editor) e «righe» (un foglio a
 * righe da scrivere a mano, con l'inizio già pronto).
 */

export type ModoLetterina = "scritta" | "righe";

const { larghezza: W, altezza: H } = FOGLIO_A4;
const FAMIGLIA = "Nunito, ui-sans-serif, system-ui, sans-serif";

const PANNELLO = { x: W * 0.08, y: H * 0.06, w: W * 0.84, h: H * 0.875 };
const MARGINE = 140;
const TESTO_X = PANNELLO.x + MARGINE;
const TESTO_W = PANNELLO.w - MARGINE * 2;
const TITOLO_Y = PANNELLO.y + 300;
const CORPO_INIZIO = TITOLO_Y + 190;
const CORPO_FINE = PANNELLO.y + PANNELLO.h - 470;

type Riga = { testo: string; tipo: "testo" | "desiderio" | "seguito" | "intro" } | { tipo: "spazio" };

/** Le righe del testo a una certa grandezza, e quanto spazio occupano. */
function impagina(t: TestoLetterina, corpo: number) {
  const perRiga = Math.floor(TESTO_W / (corpo * 0.54));
  const righe: Riga[] = [];
  const paragrafo = (testo: string) => {
    for (const r of aCapo(testo, perRiga, 40)) righe.push({ testo: r, tipo: "testo" });
    righe.push({ tipo: "spazio" });
  };
  t.prima.forEach(paragrafo);
  if (t.desideri.length) {
    righe.push({ testo: "Per Natale vorrei:", tipo: "intro" });
    for (const d of t.desideri) {
      aCapo(d, perRiga - 4, 3).forEach((r, i) => righe.push({ testo: r, tipo: i === 0 ? "desiderio" : "seguito" }));
    }
    righe.push({ tipo: "spazio" });
  }
  t.dopo.forEach(paragrafo);
  while (righe.at(-1)?.tipo === "spazio") righe.pop();
  const passo = corpo * 1.45;
  const altezza = righe.reduce((h, r) => h + (r.tipo === "spazio" ? passo * 0.45 : passo), 0);
  return { righe, passo, altezza };
}

/** La grandezza più grande che fa stare tutto il testo nel foglio. */
function adatta(t: TestoLetterina) {
  for (let corpo = 92; corpo >= 50; corpo -= 3) {
    const prova = impagina(t, corpo);
    if (prova.altezza <= CORPO_FINE - CORPO_INIZIO) return { corpo, ...prova };
  }
  return { corpo: 50, ...impagina(t, 50) };
}

function Stellina({ x, y, lato, colore }: { x: number; y: number; lato: number; colore: string }) {
  const punti = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? lato / 2 : lato / 4.4;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
  }).join(" ");
  return <polygon points={punti} fill={colore} />;
}

export function FoglioLetterina({
  testo,
  variante,
  modo,
}: {
  testo: TestoLetterina;
  variante: Variante;
  modo: ModoLetterina;
}) {
  const colore = inchiostro("natale", variante === "colorato" ? "chiaro" : variante);
  const daColorare = variante === "colorare";
  const stella = daColorare ? "#FFFFFF" : "#E4A11B";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      xmlns="http://www.w3.org/2000/svg"
      data-foglio-letterina={modo}
      data-variante={variante}
    >
      {daColorare && <style>{CSS_DA_COLORARE}</style>}
      <Sfondo tema="natale" variante={variante} larghezza={W} altezza={H} />
      <rect
        x={PANNELLO.x}
        y={PANNELLO.y}
        width={PANNELLO.w}
        height={PANNELLO.h}
        rx="70"
        fill="#FFFFFF"
        fillOpacity={daColorare ? 1 : 0.94}
        stroke={daColorare ? "#1F2430" : "none"}
        strokeWidth={daColorare ? 6 : 0}
      />

      <text x={TESTO_X} y={TITOLO_Y} fontFamily={FAMIGLIA} fontSize="150" fontWeight="900" fill={colore} data-letterina-apertura>
        {testo.apertura}
      </text>

      {modo === "scritta" ? <Testo testo={testo} colore={colore} stella={stella} daColorare={daColorare} /> : <Righe colore={colore} />}

      {/* Firma in basso a destra; senza nome, la riga da completare a penna. */}
      <text
        x={PANNELLO.x + PANNELLO.w - MARGINE}
        y={PANNELLO.y + PANNELLO.h - 260}
        textAnchor="end"
        fontFamily={FAMIGLIA}
        fontSize="120"
        fontWeight="900"
        fill={colore}
        data-letterina-firma
      >
        {modo === "scritta" && testo.firma ? testo.firma : "________________"}
      </text>

      <g transform={`translate(${PANNELLO.x + 90} ${PANNELLO.y + PANNELLO.h - 440}) scale(${380 / 100})`}>
        <g className={daColorare ? "dc-linea dc-disegno" : undefined}>
          <Disegno id="pinguino" className="" lato={100} />
        </g>
      </g>

      <text
        x={W / 2}
        y={PANNELLO.y + PANNELLO.h - 70}
        textAnchor="middle"
        fontFamily={FAMIGLIA}
        fontSize="40"
        fontWeight="700"
        fill="#9AA1AD"
      >
        Scritta con Mizi · giocamizi.it
      </text>
    </svg>
  );
}

function Testo({
  testo,
  colore,
  stella,
  daColorare,
}: {
  testo: TestoLetterina;
  colore: string;
  stella: string;
  daColorare: boolean;
}) {
  const { corpo, righe, passo } = adatta(testo);
  let y = CORPO_INIZIO;
  return (
    <g data-letterina-testo data-corpo={corpo}>
      {righe.map((r, i) => {
        if (r.tipo === "spazio") {
          y += passo * 0.45;
          return null;
        }
        y += passo;
        const rientro = r.tipo === "desiderio" || r.tipo === "seguito" ? corpo * 1.3 : 0;
        return (
          <g key={i}>
            {r.tipo === "desiderio" && (
              <g className={daColorare ? "dc-linea dc-disegno" : undefined}>
                <Stellina x={TESTO_X + corpo * 0.45} y={y - corpo * 0.34} lato={corpo * 0.8} colore={stella} />
              </g>
            )}
            <text
              x={TESTO_X + rientro}
              y={y}
              fontFamily={FAMIGLIA}
              fontSize={corpo}
              fontWeight={r.tipo === "intro" ? 900 : 700}
              fill={colore}
              data-letterina-desiderio={r.tipo === "desiderio" ? "" : undefined}
            >
              {r.testo}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** Il foglio a righe: l'inizio già scritto, poi righe a puntini da riempire. */
function Righe({ colore }: { colore: string }) {
  const corpo = 76;
  const passo = 150;
  const righe: { y: number; etichetta?: string; stella?: boolean }[] = [];
  let y = CORPO_INIZIO + 40;
  righe.push({ y, etichetta: "Mi chiamo ______________ e ho ____ anni." });
  for (let i = 0; i < 6; i++) righe.push({ y: (y += passo) });
  righe.push({ y: (y += passo * 1.1), etichetta: "Per Natale vorrei:" });
  for (let i = 0; i < 5; i++) righe.push({ y: (y += passo), stella: true });
  return (
    <g data-letterina-righe>
      {righe.map((r, i) =>
        r.etichetta ? (
          <text key={i} x={TESTO_X} y={r.y} fontFamily={FAMIGLIA} fontSize={corpo} fontWeight={i === 0 ? 700 : 900} fill={colore}>
            {r.etichetta}
          </text>
        ) : (
          <g key={i}>
            {r.stella && (
              <polygon
                points={Array.from({ length: 10 }, (_, k) => {
                  const rr = k % 2 === 0 ? 25 : 11;
                  const a = -Math.PI / 2 + (k * Math.PI) / 5;
                  return `${TESTO_X + 30 + rr * Math.cos(a)},${r.y - 24 + rr * Math.sin(a)}`;
                }).join(" ")}
                fill="none"
                stroke={colore}
                strokeWidth="4"
              />
            )}
            <line
              x1={TESTO_X + (r.stella ? 90 : 0)}
              y1={r.y}
              x2={TESTO_X + TESTO_W}
              y2={r.y}
              stroke="#B9BFCC"
              strokeWidth="5"
              strokeDasharray="2 22"
              strokeLinecap="round"
            />
          </g>
        ),
      )}
    </g>
  );
}
