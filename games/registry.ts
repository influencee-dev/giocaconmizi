// Registro dei giochi — Gioca con Mizi
// Il codice dice COME si gioca (games/{slug}/Game.tsx), il .md in content/games dice come si racconta.
export type Skill =
  | "memoria" | "colori" | "forme" | "numeri" | "spazio" | "ascolto" | "logica" | "emozioni"
  | "fonetica" | "alfabeto" | "lettura" | "attenzione" | "matematica" | "ortografia" | "inglese"
  | "comprensione" | "coding" | "tempo";

export interface GameMeta {
  slug: string;
  title: string;
  ageMin: number;
  ageMax: number;
  skill: Skill;
  subskill: string;
  difficulty: 1 | 2 | 3;
  minutes: number;
  mechanic: string; // una riga: serve a Claude Code per costruire il gioco
  status: "planned" | "building" | "live";
}

export const games: GameMeta[] = [
  // 3–4 anni
  { slug: "memory-animali", title: "Memory degli animali", ageMin: 3, ageMax: 5, skill: "memoria", subskill: "memoria visiva", difficulty: 1, minutes: 4, mechanic: "Griglia 2x3 → 3x4 di carte coperte con animali; trova le coppie; Mizi esulta a ogni coppia.", status: "live" },
  { slug: "abbina-i-colori", title: "Abbina i colori", ageMin: 3, ageMax: 4, skill: "colori", subskill: "riconoscimento colori primari e secondari", difficulty: 1, minutes: 3, mechanic: "Oggetto colorato al centro; tocca il secchiello dello stesso colore tra 3 → 5 opzioni.", status: "live" },
  { slug: "trova-la-forma", title: "Trova la forma", ageMin: 3, ageMax: 5, skill: "forme", subskill: "cerchio, quadrato, triangolo, rettangolo, stella", difficulty: 1, minutes: 3, mechanic: "Voce dice la forma; tocca la forma giusta tra 3 → 6; poi trascina la forma nel buco giusto.", status: "live" },
  { slug: "conta-fino-a-10", title: "Conta fino a 10", ageMin: 3, ageMax: 5, skill: "numeri", subskill: "conteggio e corrispondenza quantità-numero", difficulty: 1, minutes: 4, mechanic: "Gruppo di pesci (1–10); tocca ogni pesce per contarli con la voce; poi scegli il numero giusto tra 3.", status: "live" },
  { slug: "puzzle-facile", title: "Puzzle facile", ageMin: 3, ageMax: 5, skill: "spazio", subskill: "orientamento e incastro", difficulty: 1, minutes: 4, mechanic: "Immagine divisa in 4 → 6 → 9 pezzi grandi; trascina nel posto giusto con magnete; immagine guida in trasparenza.", status: "live" },
  { slug: "il-suono-dell-animale", title: "Di chi è questo suono?", ageMin: 3, ageMax: 5, skill: "ascolto", subskill: "discriminazione uditiva", difficulty: 1, minutes: 3, mechanic: "Suona un verso (audio sintetico o onomatopea vocale); tocca l'animale giusto tra 3 → 4.", status: "live" },
  { slug: "grande-piccolo", title: "Grande o piccolo?", ageMin: 3, ageMax: 4, skill: "logica", subskill: "confronto di grandezze", difficulty: 1, minutes: 3, mechanic: "Due o tre oggetti uguali di misure diverse; voce chiede 'tocca il più grande / piccolo / medio'.", status: "live" },
  { slug: "le-emozioni-di-mizi", title: "Le emozioni di Mizi", ageMin: 3, ageMax: 6, skill: "emozioni", subskill: "riconoscere felice, triste, arrabbiato, spaventato, sorpreso", difficulty: 1, minutes: 4, mechanic: "Situazione breve detta a voce; tocca la faccia di Mizi con l'emozione giusta tra 3 → 5; poi 'cosa puoi fare per aiutarla?'.", status: "live" },
  // 5–6 anni
  { slug: "lettera-iniziale", title: "Con che lettera inizia?", ageMin: 5, ageMax: 6, skill: "fonetica", subskill: "suono iniziale", difficulty: 2, minutes: 4, mechanic: "Immagine + parola detta a voce; tocca la lettera iniziale tra 3 → 5 (stampatello maiuscolo).", status: "live" },
  { slug: "tocca-la-lettera", title: "Tocca la lettera", ageMin: 4, ageMax: 6, skill: "alfabeto", subskill: "riconoscimento lettere maiuscole", difficulty: 1, minutes: 3, mechanic: "Voce dice una lettera; griglia di 6 → 12 lettere; tocca quella giusta. Livello 2: minuscole.", status: "live" },
  { slug: "unisci-le-sillabe", title: "Unisci le sillabe", ageMin: 5, ageMax: 7, skill: "lettura", subskill: "sintesi sillabica", difficulty: 2, minutes: 5, mechanic: "Immagine; trascina 2 → 3 sillabe in ordine per formare la parola (CA-SA, PA-NE, TA-VO-LO). Voce legge il risultato.", status: "live" },
  { slug: "trova-le-differenze", title: "Trova le differenze", ageMin: 5, ageMax: 8, skill: "attenzione", subskill: "attenzione visiva", difficulty: 2, minutes: 5, mechanic: "Due scene SVG quasi uguali; tocca le 3 → 5 differenze; cerchio verde su ogni trovata.", status: "live" },
  { slug: "unisci-i-puntini", title: "Unisci i puntini", ageMin: 5, ageMax: 7, skill: "numeri", subskill: "sequenza numerica 1–20", difficulty: 2, minutes: 4, mechanic: "Puntini numerati; tocca in ordine; la linea si disegna e rivela una figura (stella, pesce, razzo).", status: "live" },
  { slug: "cosa-viene-dopo", title: "Cosa viene dopo?", ageMin: 4, ageMax: 7, skill: "coding", subskill: "pattern e sequenze", difficulty: 1, minutes: 4, mechanic: "Sequenza di forme/colori ABAB → ABCABC → AABB; tocca l'elemento che continua la serie tra 3.", status: "live" },
  { slug: "prime-parole-inglese", title: "Prime parole in inglese", ageMin: 5, ageMax: 8, skill: "inglese", subskill: "colori, animali, numeri 1–10", difficulty: 1, minutes: 4, mechanic: "Voce inglese dice la parola (Web Speech en-GB); tocca l'immagine giusta tra 3 → 4; ripeti con 'ascolta ancora'.", status: "live" },
  // 6–8 anni
  { slug: "addizioni-entro-20", title: "Addizioni entro 20", ageMin: 6, ageMax: 8, skill: "matematica", subskill: "addizione con supporto visivo", difficulty: 2, minutes: 5, mechanic: "Operazione 3+4 con pesci contabili; scegli il risultato tra 4; livello 2 entro 20 senza supporto.", status: "live" },
  { slug: "l-orologio", title: "Che ore sono?", ageMin: 6, ageMax: 9, skill: "tempo", subskill: "lettura orologio analogico", difficulty: 2, minutes: 5, mechanic: "Orologio SVG; livello 1 ore esatte, 2 mezz'ore, 3 quarti; scegli tra 4 orari scritti. Modalità inversa: sposta le lancette.", status: "live" },
  { slug: "ortografia-c-ch-g-gh", title: "C o CH? G o GH?", ageMin: 6, ageMax: 8, skill: "ortografia", subskill: "suoni duri e dolci", difficulty: 2, minutes: 5, mechanic: "Parola con buco (_ _ IESA); voce la pronuncia; tocca C o CH (poi G/GH, SC/SCH).", status: "live" },
  { slug: "tabelline", title: "Tabelline con Mizi", ageMin: 7, ageMax: 10, skill: "matematica", subskill: "tabelline 2–10", difficulty: 2, minutes: 6, mechanic: "Scegli la tabellina; 8 domande; risposta tra 4; dopo 3 giuste di fila Mizi salta. Livello mix.", status: "live" },
  { slug: "leggi-e-rispondi", title: "Leggi e rispondi", ageMin: 6, ageMax: 8, skill: "comprensione", subskill: "comprensione di un testo breve", difficulty: 2, minutes: 6, mechanic: "Testo 3–5 frasi in stampatello; 3 domande a scelta multipla con immagini.", status: "live" },
  // Coding
  { slug: "guida-mizi", title: "Guida Mizi", ageMin: 3, ageMax: 6, skill: "coding", subskill: "sequenze di istruzioni", difficulty: 1, minutes: 5, mechanic: "Griglia 3x3 → 5x5; trascina frecce (su/giù/sinistra/destra) nella barra; premi Via: Mizi esegue e arriva al pesce. Max frecce per livello.", status: "live" },
  { slug: "pixel-art", title: "Pixel art", ageMin: 4, ageMax: 9, skill: "coding", subskill: "coordinate e codifica", difficulty: 1, minutes: 6, mechanic: "Griglia 6x6 → 10x10; livello 1 colora seguendo la legenda per righe; livello 2 coordinate (B3 = rosso); livello 3 inventa e genera il codice.", status: "live" },
  { slug: "robot-ballerino", title: "Il robot ballerino", ageMin: 4, ageMax: 7, skill: "coding", subskill: "sequenza e ripetizione", difficulty: 1, minutes: 4, mechanic: "Componi 4 → 8 mosse (salta, gira, batti); Mizi le esegue a ritmo; livello 2 introduce 'ripeti x2'.", status: "live" },
  { slug: "labirinto-a-blocchi", title: "Il labirinto a blocchi", ageMin: 6, ageMax: 10, skill: "coding", subskill: "algoritmi, cicli, condizioni (Blockly)", difficulty: 2, minutes: 8, mechanic: "Blockly: blocchi avanti/gira; livelli 1–10 in games/coding/levels/labirinto/*.json; dal livello 5 'ripeti', dal 8 'se c'è un muro'. Pannello Vedi il codice.", status: "live" },
  { slug: "trova-l-errore", title: "Trova l'errore", ageMin: 6, ageMax: 9, skill: "coding", subskill: "debug", difficulty: 2, minutes: 5, mechanic: "Programma a blocchi già scritto ma con un errore; Mizi sbaglia strada; tocca il blocco sbagliato e correggilo.", status: "live" },
  { slug: "tartaruga", title: "Disegna con la tartaruga", ageMin: 8, ageMax: 12, skill: "coding", subskill: "cicli annidati e angoli (Logo)", difficulty: 3, minutes: 10, mechanic: "Blockly: avanti N, gira N gradi, ripeti; riproduci la figura target (quadrato, stella, fiore); modalità libera.", status: "live" },
  { slug: "crea-il-tuo-gioco", title: "Crea il tuo gioco", ageMin: 10, ageMax: 12, skill: "coding", subskill: "eventi, variabili, funzioni", difficulty: 3, minutes: 15, mechanic: "Blockly con eventi (quando tocchi, ogni secondo), variabili (punti), sprite Mizi; JS generato visibile e modificabile; salva nel link.", status: "live" },
  { slug: "sequenze-logiche", title: "Sequenze logiche", ageMin: 5, ageMax: 8, skill: "logica", subskill: "ordinare eventi nel tempo", difficulty: 2, minutes: 4, mechanic: "3 → 5 scene di una storia in disordine; trascina nell'ordine giusto; la voce legge la storia completa.", status: "live" },
];

export const byAge = (age: number) => games.filter(g => age >= g.ageMin && age <= g.ageMax);
export const bySkill = (skill: Skill) => games.filter(g => g.skill === skill);

/** La scheda di un gioco, per slug. Ogni cartella games/{slug}/meta.ts passa di qui. */
export const metaDi = (slug: string): GameMeta => {
  const trovato = games.find((g) => g.slug === slug);
  if (!trovato) throw new Error(`Gioco sconosciuto nel registry: ${slug}`);
  return trovato;
};
