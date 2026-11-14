// Lancia scripts/piano-foglio.py con il primo Python che ha openpyxl
// (python3 sui server, python su Windows).
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "piano-foglio.py");
for (const py of ["python3", "python"]) {
  const prova = spawnSync(py, ["-c", "import openpyxl"], { stdio: "ignore" });
  if (prova.error || prova.status !== 0) continue;
  const r = spawnSync(py, [script, ...process.argv.slice(2)], { stdio: "inherit" });
  process.exit(r.status ?? 1);
}
console.error("Serve Python 3 con openpyxl (pip install openpyxl).");
process.exit(1);
