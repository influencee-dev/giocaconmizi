/**
 * Allinea i contenuti versionati (content/*.md + games/registry.ts) alle tabelle
 * Supabase usate per SEO e per le automazioni (piano §4.2 e §4.4).
 *
 *   npm run sync-content
 *
 * Il codice dice COME si gioca, il DB dice come si racconta: qui spingiamo la
 * seconda metà. Richiede SUPABASE_SERVICE_ROLE_KEY, quindi gira solo in CI o in
 * locale, mai nel browser.
 */

import { createClient } from "@supabase/supabase-js";
import { games } from "../games/registry";
import { testoGioco, tutteLeStorie } from "../lib/content";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error(
    "Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. Vedi .env.example.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRole, {
  auth: { persistSession: false },
});

async function sincronizzaGiochi() {
  const righe = games.map((g) => {
    const testo = testoGioco(g.slug);
    return {
      slug: g.slug,
      title: g.title,
      age_min: g.ageMin,
      age_max: g.ageMax,
      skill: g.skill,
      subskill: g.subskill,
      difficulty: g.difficulty,
      description: testo?.description ?? g.mechanic,
      status: g.status,
    };
  });

  const { error } = await supabase.from("games").upsert(righe, { onConflict: "slug" });
  if (error) throw new Error(`games: ${error.message}`);

  console.log(`Giochi sincronizzati: ${righe.length}`);
}

async function sincronizzaStorie() {
  const storie = tutteLeStorie();
  if (storie.length === 0) {
    console.log("Nessuna storia da sincronizzare.");
    return;
  }

  const righe = storie.map((s) => ({
    slug: s.slug,
    title: s.title,
    age_band: s.age,
    theme: s.theme,
    length_min: s.minutes,
    text: s.testo,
  }));

  const { error } = await supabase.from("stories").upsert(righe, { onConflict: "slug" });
  if (error) throw new Error(`stories: ${error.message}`);

  console.log(`Storie sincronizzate: ${righe.length}`);
}

async function main() {
  await sincronizzaGiochi();
  await sincronizzaStorie();
}

main().catch((errore) => {
  console.error(errore);
  process.exit(1);
});
