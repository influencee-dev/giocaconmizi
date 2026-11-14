// Il registro di ciò che è stato prodotto (content/registro-prodotto.json).
//
//   node scripts/registro.mjs aggiungi --tipo articolo --titolo "..." --dove "https://..." --chi "Claude (routine 9:00)" [--piano 12] [--note "..."] [--data AAAA-MM-GG]
//   node scripts/registro.mjs ultimi [n]
//
// tipo: articolo | canzone | post | pagina | foto | gioco | guida | piano | altro
// Ogni cosa prodotta per il piano editoriale = una riga. Mai email, telefoni o
// altri dati personali: il repo è pubblico.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../content/registro-prodotto.json");
const TIPI = ["articolo", "canzone", "post", "pagina", "foto", "gioco", "guida", "piano", "altro"];
const registro = JSON.parse(fs.readFileSync(FILE, "utf8"));
const [comando, ...resto] = process.argv.slice(2);
const opz = (nome) => {
  const i = resto.indexOf(`--${nome}`);
  return i >= 0 ? resto[i + 1] : undefined;
};

if (comando === "aggiungi") {
  const voce = {
    data: opz("data") ?? new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" }),
    tipo: opz("tipo"),
    titolo: opz("titolo"),
    dove: opz("dove") ?? "",
    chi: opz("chi") ?? "Claude",
    piano: opz("piano") ? Number(opz("piano")) : null,
    note: opz("note") ?? "",
  };
  if (!TIPI.includes(voce.tipo) || !voce.titolo) {
    console.error(`Uso: aggiungi --tipo <${TIPI.join("|")}> --titolo "..." [--dove ...] [--chi ...] [--piano id] [--note ...]`);
    process.exit(2);
  }
  if (/[^\s@]+@[^\s@]+\.[a-z]{2,}/i.test(`${voce.titolo} ${voce.note} ${voce.dove}`)) {
    console.error("Niente indirizzi email nel registro: il repo è pubblico.");
    process.exit(2);
  }
  const doppia = registro.voci.find((v) => v.tipo === voce.tipo && v.titolo === voce.titolo);
  if (doppia) {
    console.log(`Già registrato il ${doppia.data}: ${voce.titolo}`);
    process.exit(0);
  }
  registro.voci.push(voce);
  fs.writeFileSync(FILE, `${JSON.stringify(registro, null, 2)}\n`);
  console.log(`Registrato: ${voce.data} · ${voce.tipo} · ${voce.titolo}`);
} else if (comando === "ultimi") {
  for (const v of registro.voci.slice(-Number(resto[0] ?? 10))) console.log(`${v.data} · ${v.tipo} · ${v.titolo}`);
} else {
  console.error("Uso: registro.mjs aggiungi … | ultimi [n]");
  process.exit(2);
}
