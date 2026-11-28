/** Solo indirizzi interni del sito come ritorno dopo il pagamento (niente redirect verso altri siti). */
export const ritornoSicuro = (r: unknown) =>
  typeof r === "string" && /^\/(profilo|cerca|la-tua-scheda\/[A-Za-z0-9_-]{8,80})$/.test(r) ? r : "/profilo";
