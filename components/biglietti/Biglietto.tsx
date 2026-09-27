import qrcode from "qrcode-generator";
import { Disegno } from "@/games/_engine/arte";
import { linkConferma, numeroWhatsApp } from "@/lib/biglietti";
import { Sfondo, inchiostro, type Variante } from "./Sfondo";
import { StickerDisegno, type StickerSulBiglietto } from "./stickers";

/**
 * Il biglietto disegnato. È un solo SVG: la stessa cosa che si vede in anteprima
 * viene poi trasformata in PNG dal browser, quindi non c'è nessuna sorpresa fra
 * quello che si guarda e quello che si scarica.
 */

export interface DatiBiglietto {
  tipo: "invito" | "auguri" | "ringraziamento";
  tema: string;
  variante: Variante;
  nome: string;
  eta: string;
  frase: string;
  data: string;
  ora: string;
  luogo: string;
  conferma: string;
  firma: string;
  conMizi: boolean;
  carattere: "tondo" | "stampatello";
  /** Adesivi appoggiati sul biglietto (facoltativi: i link vecchi non li hanno). */
  stickers?: StickerSulBiglietto[];
  /** Foto del festeggiato come data URL. Resta nel dispositivo: non va nei link. */
  foto?: string;
  /** QR di conferma sul biglietto: chi lo stampa può confermare inquadrandolo. */
  conQr?: boolean;
}

/**
 * Il QR della conferma: codifica il link wa.me con il messaggio già scritto,
 * così anche il biglietto STAMPATO ha la conferma a un tocco (basta inquadrare).
 * Il contenuto è un URL corto e tutto ASCII: il QR resta piccolo e leggibile.
 */
function QrConferma({ url, x, y, lato }: { url: string; x: number; y: number; lato: number }) {
  const qr = qrcode(0, "M");
  qr.addData(url);
  qr.make();
  const moduli = qr.getModuleCount();
  let percorso = "";
  for (let r = 0; r < moduli; r++) {
    for (let c = 0; c < moduli; c++) {
      if (qr.isDark(r, c)) percorso += `M${c} ${r}h1v1h-1z`;
    }
  }
  const margine = lato * 0.09; // zona quieta: serve ai lettori QR
  return (
    <g data-qr transform={`translate(${x} ${y})`}>
      <rect
        x={-margine}
        y={-margine}
        width={lato + margine * 2}
        height={lato + margine * 2 + lato * 0.3}
        rx={lato * 0.08}
        fill="#FFFFFF"
        stroke="#F6E3CF"
        strokeWidth={lato * 0.02}
      />
      <g transform={`scale(${lato / moduli})`}>
        <path d={percorso} fill="#1F2430" />
      </g>
      <text
        x={lato / 2}
        y={lato + margine + lato * 0.16}
        textAnchor="middle"
        fontFamily="Nunito, system-ui, sans-serif"
        fontSize={lato * 0.115}
        fontWeight="800"
        fill="#1F2430"
      >
        Inquadra e conferma
      </text>
    </g>
  );
}

/**
 * SVG non sa restringere il testo che non ci sta: lo taglia e basta.
 * Qui si stima la larghezza (0,55 em per carattere è vicino al vero per Nunito
 * grassetto) e si riduce il corpo finché la riga entra nello spazio utile.
 */
function corpoCheEntra(testo: string, corpoDesiderato: number, larghezzaUtile: number): number {
  if (!testo) return corpoDesiderato;
  const larghezzaStimata = testo.length * corpoDesiderato * 0.55;
  if (larghezzaStimata <= larghezzaUtile) return corpoDesiderato;
  return Math.max(corpoDesiderato * 0.45, (larghezzaUtile / testo.length) / 0.55);
}

const TITOLI: Record<DatiBiglietto["tipo"], string> = {
  invito: "SEI INVITATO",
  auguri: "TANTI AUGURI",
  ringraziamento: "GRAZIE",
};

export function Biglietto({
  dati,
  larghezza,
  altezza,
}: {
  dati: DatiBiglietto;
  larghezza: number;
  altezza: number;
}) {
  const testo = inchiostro(dati.tema, dati.variante);
  const centroX = larghezza / 2;

  // Tutte le misure sono relative all'altezza: lo stesso biglietto funziona in
  // A6, A5, verticale per WhatsApp e quadrato senza ritocchi.
  const u = altezza / 100;
  const stampatello = dati.carattere === "stampatello";
  const famiglia = "Nunito, ui-sans-serif, system-ui, sans-serif";

  const righeLuogo = [dati.luogo, dati.conferma].filter(Boolean);
  // Il testo non deve mai toccare la cornice decorata.
  const larghezzaUtile = larghezza * 0.8;
  const rigaQuando = [dati.data, dati.ora].filter(Boolean).join("  ·  ");

  return (
    <svg
      viewBox={`0 0 ${larghezza} ${altezza}`}
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Biglietto per ${dati.nome || "il compleanno"}`}
    >
      <Sfondo tema={dati.tema} variante={dati.variante} larghezza={larghezza} altezza={altezza} />

      {dati.foto && (
        <>
          <defs>
            <clipPath id="clip-foto">
              <circle cx={centroX} cy={u * 14} r={u * 8.5} />
            </clipPath>
          </defs>
          <circle cx={centroX} cy={u * 14} r={u * 9.3} fill="#FFFFFF" opacity="0.9" />
          <image
            href={dati.foto}
            x={centroX - u * 8.5}
            y={u * 5.5}
            width={u * 17}
            height={u * 17}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#clip-foto)"
          />
        </>
      )}

      <text
        x={centroX}
        y={u * 28}
        textAnchor="middle"
        fontFamily={famiglia}
        fontSize={corpoCheEntra(TITOLI[dati.tipo], u * 4.6, larghezzaUtile * 0.85)}
        fontWeight="800"
        letterSpacing={u * 0.35}
        fill={testo}
        opacity="0.75"
      >
        {TITOLI[dati.tipo]}
      </text>

      {dati.nome && (
        <text
          x={centroX}
          y={u * 39}
          textAnchor="middle"
          fontFamily={famiglia}
          fontSize={corpoCheEntra(dati.nome, u * 9.5, larghezzaUtile)}
          fontWeight="800"
          fill={testo}
        >
          {stampatello ? dati.nome.toUpperCase() : dati.nome}
        </text>
      )}

      {dati.eta && (
        <>
          <circle cx={centroX} cy={u * 51} r={u * 7.5} fill="#FFFFFF" opacity="0.85" />
          <text
            x={centroX}
            y={u * 54.6}
            textAnchor="middle"
            fontFamily={famiglia}
            fontSize={u * 10}
            fontWeight="800"
            fill={testo}
          >
            {dati.eta}
          </text>
        </>
      )}

      {dati.frase && (
        <ParagrafoSvg
          testo={dati.frase}
          x={centroX}
          y={u * 65}
          larghezzaMax={larghezza * 0.78}
          dimensione={u * 4}
          interlinea={u * 5.4}
          colore={testo}
          famiglia={famiglia}
        />
      )}

      {(dati.data || dati.ora) && (
        <text
          x={centroX}
          y={u * 79}
          textAnchor="middle"
          fontFamily={famiglia}
          fontSize={corpoCheEntra(rigaQuando, u * 4.2, larghezzaUtile)}
          fontWeight="800"
          fill={testo}
        >
          {rigaQuando}
        </text>
      )}

      {righeLuogo.map((riga, i) => (
        <text
          key={i}
          x={centroX}
          y={u * (84 + i * 5)}
          textAnchor="middle"
          fontFamily={famiglia}
          fontSize={corpoCheEntra(riga, u * 3.4, larghezzaUtile)}
          fill={testo}
          opacity="0.85"
        >
          {riga}
        </text>
      ))}

      {dati.firma && (
        <text
          x={centroX}
          y={u * (righeLuogo.length ? 84 + righeLuogo.length * 5 + 1 : 86)}
          textAnchor="middle"
          fontFamily={famiglia}
          fontSize={corpoCheEntra(dati.firma, u * 3.4, larghezzaUtile)}
          fontStyle="italic"
          fill={testo}
          opacity="0.85"
        >
          {dati.firma}
        </text>
      )}

      {dati.conMizi && (
        <g transform={`translate(${larghezza * 0.06} ${altezza * 0.78}) scale(${(altezza * 0.14) / 100})`}>
          <Disegno id="pinguino" className="" lato={100} />
        </g>
      )}

      {/* Adesivi: x/y in percentuale, così restano al loro posto in ogni formato.
          data-sticker permette all'editor di trascinarli col dito. */}
      {(dati.stickers ?? []).map((st, i) => {
        const lato = altezza * 0.1 * st.s;
        return (
          <g
            key={i}
            data-sticker={i}
            transform={`translate(${(st.x / 100) * larghezza - lato / 2} ${(st.y / 100) * altezza - lato / 2}) scale(${lato / 100})`}
            style={{ cursor: "grab" }}
          >
            {/* Zona di presa generosa: col dito serve. */}
            <rect x="-10" y="-10" width="120" height="120" fill="transparent" />
            <StickerDisegno id={st.id} />
          </g>
        );
      })}

      {/* QR sopra a tutto: se un adesivo ci finisce sotto, resta leggibile. */}
      {dati.tipo === "invito" && dati.conQr && numeroWhatsApp(dati.conferma) && (() => {
        const lato = altezza * 0.13;
        const margine = lato * 0.09;
        const bordo = altezza * 0.035;
        return (
          <QrConferma
            url={linkConferma(numeroWhatsApp(dati.conferma) as string, dati.nome)}
            x={larghezza - bordo - lato - margine}
            y={altezza - bordo - lato - margine - lato * 0.3}
            lato={lato}
          />
        );
      })()}
    </svg>
  );
}

/**
 * SVG non manda a capo da solo: il testo va spezzato a mano.
 * La stima della larghezza usa 0,52 em per carattere, che per Nunito è vicina
 * al vero e sbaglia sempre per eccesso — meglio una riga corta che una tagliata.
 */
function ParagrafoSvg({
  testo,
  x,
  y,
  larghezzaMax,
  dimensione,
  interlinea,
  colore,
  famiglia,
}: {
  testo: string;
  x: number;
  y: number;
  larghezzaMax: number;
  dimensione: number;
  interlinea: number;
  colore: string;
  famiglia: string;
}) {
  const perRiga = Math.max(12, Math.floor(larghezzaMax / (dimensione * 0.52)));
  const righe: string[] = [];
  let corrente = "";

  for (const parola of testo.split(/\s+/)) {
    const provvisoria = corrente ? `${corrente} ${parola}` : parola;
    if (provvisoria.length > perRiga && corrente) {
      righe.push(corrente);
      corrente = parola;
    } else {
      corrente = provvisoria;
    }
  }
  if (corrente) righe.push(corrente);

  const visibili = righe.slice(0, 4);

  return (
    <>
      {visibili.map((riga, i) => (
        <text
          key={i}
          x={x}
          y={y + i * interlinea}
          textAnchor="middle"
          fontFamily={famiglia}
          fontSize={dimensione}
          fill={colore}
        >
          {riga}
        </text>
      ))}
    </>
  );
}
