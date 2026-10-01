// `npm run verifica`: build già fatta -> le tre batterie, un riassunto corto.
// Prima di un push vale la regola di Giorgia: si verifica TRE volte
// (typecheck+lint+build, questa batteria da mobile, gli sbordi).
import { spawnSync } from "node:child_process";
import { conServer } from "./comune.mjs";

const servito = await conServer(); // un server per tutte e tre
const esiti = {};
for (const nome of ["biglietti", "giochi", "sbordi"]) {
  const r = spawnSync("node", [`scripts/verifica/${nome}.mjs`], { encoding: "utf8" });
  esiti[nome] = r.status === 0;
  // in caso di guaio si stampa tutto, altrimenti solo l'ultima riga
  const righe = (r.stdout + r.stderr).trim().split("\n");
  console.log(r.status === 0 ? righe.at(-1) : righe.join("\n"));
}
if (servito) process.kill(-servito.pid);
const ko = Object.entries(esiti).filter(([, v]) => !v);
console.log(ko.length ? `VERIFICA FALLITA: ${ko.map(([k]) => k).join(", ")}` : "VERIFICA SUPERATA");
process.exit(ko.length ? 1 : 0);
