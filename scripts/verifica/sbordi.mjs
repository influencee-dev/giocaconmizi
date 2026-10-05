// Sbordi orizzontali: le pagine principali a 6 larghezze, col biglietto pieno.
import { apriBrowser, conServer, BASE, B_PIENO } from "./comune.mjs";

const PAGINE = [
  "/", "/giochi", "/guide", "/guide/memorizzare-le-poesie", "/guide/ansia-da-verifica", "/coding", "/biglietti", "/giochi/eta/5-anni",
  `/biglietti/crea?b=${B_PIENO}`, `/biglietti/vedi?b=${B_PIENO}`,
];
const LARGHEZZE = [340, 375, 414, 768, 1024, 1440];

const servito = await conServer();
const b = await apriBrowser();
let problemi = 0;
for (const larghezza of LARGHEZZE) {
  const p = await b.newPage({ viewport: { width: larghezza, height: 900 } });
  for (const percorso of PAGINE) {
    await p.goto(BASE + percorso, { waitUntil: "networkidle" });
    await p.waitForTimeout(350);
    const brutti = await p.evaluate(() => {
      const fuori = [];
      const op = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      if (op > 1) fuori.push(`PAGINA overflow-x ${op}px`);
      for (const el of document.querySelectorAll("a, button, span, p, h1, h2, h3, div, li, dt, dd, label, img")) {
        if (getComputedStyle(el).overflowX !== "visible") continue;
        const extra = el.scrollWidth - el.clientWidth;
        if (extra > 2 && el.clientWidth > 0)
          fuori.push(`X+${extra}px <${el.tagName.toLowerCase()}> "${(el.textContent || "").trim().slice(0, 40)}"`);
      }
      return [...new Set(fuori)].slice(0, 5);
    });
    if (brutti.length) {
      problemi += brutti.length;
      console.log(`--- ${larghezza}px ${percorso.split("?")[0]}`);
      brutti.forEach((e) => console.log("   ", e));
    }
  }
  await p.close();
}
await b.close();
if (servito) process.kill(-servito.pid);
console.log(problemi ? `sbordi: ${problemi} PROBLEMI` : "sbordi: pulito");
process.exit(problemi ? 1 : 0);
