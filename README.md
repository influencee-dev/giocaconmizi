# Gioca con Mizi — starter pack

Giochi educativi, storie, coding e biglietti di compleanno per bambini 3–12 anni. Gratis, senza pubblicità.

Stato: il progetto Next.js è in piedi, i **28 giochi del registry sono giocabili**, le **12 storie** sono scritte, il **creatore di biglietti** funziona e le pagine SEO sono generate. `npm run build` produce 256 pagine statiche.

## Per Claude Code: da dove partire
1. Leggi `docs/piano-progetto.md` (fonte di verità), `docs/GAME-DESIGN-CHECKLIST.md`, `docs/CONTENT-GUIDE.md`.
2. `games/registry.ts` contiene i 28 giochi con meccanica in una riga: costruiscili da lì, uno per volta, partendo da quelli con ageMin 3.
3. `cards/registry.ts` contiene i 50 sfondi e le frasi del tool biglietti.
4. `content/hubs/*.md` sono i testi già pronti delle pagine età, Metodo e Perché lo facciamo: renderizzali, non riscriverli.
5. Palette: rosa #F28AB2, giallo #F9C846, azzurro #3DB5E6, viola #9B6DD6, crema #FFF3E6, blu notte #1F2430, arancione #F59A23. Font Nunito.
6. Stack: Next.js 15 App Router + TypeScript + Tailwind + Supabase + Brevo + Vercel. Niente auth utente.

### Che cosa c'è già
| | |
|---|---|
| Giochi | 28, tutti giocabili, con testo SEO e FAQ |
| Storie | 12, con lettore a tre caratteri e sintesi vocale |
| Biglietti | creatore + 25 temi × 2 varianti + 133 pagine SEO |
| Pagine statiche | 256 |

### Che cosa manca
- Gli sfondi dei biglietti sono motivi SVG generati: le illustrazioni vere previste dalla §14.4 vanno sostituite in `components/biglietti/motivi.tsx`.
- L'export PDF (`npm run export-pdf`) è uno scheletro: manca il rendering vero.
- Supabase è configurato (progetto `giocaconmizi`, schema e RLS applicati): URL e anon key pubblici stanno in `.env.production`. Brevo richiede `BREVO_API_KEY` nelle Environment Variables di Vercel.
- Le automazioni Brevo vanno configurate a mano nella UI di Brevo, come previsto dal piano §4.4.

---

## Avvio in locale

```bash
npm install
cp .env.example .env.local   # e riempi le chiavi
npm run dev                  # http://localhost:3000
```

Il sito pubblico funziona anche **senza** chiavi Supabase o Brevo: i giochi e i contenuti non richiedono login. Senza chiavi, `/accedi` e `/account` mostrano un avviso invece di rompersi.

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Sviluppo su :3000 |
| `npm run build` | Build di produzione |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run sync-content` | Allinea `content/` e `games/registry.ts` alle tabelle Supabase |
| `npm run export-pdf` | Genera i PDF delle storie (da completare, giorno 2) |

## Struttura

Segue §4.3 del piano.

```
app/
  (public)/      home, giochi, storie, coding, biglietti, compiti-vacanze, metodo…
  (auth)/accedi  magic link, niente password
  (app)/account  area genitore
  auth/          callback e logout del magic link
  api/           brevo, progresso
  sitemap.ts robots.ts
games/           registry.ts + _template/ (scaffold per ogni nuovo gioco)
cards/           registry.ts (sfondi e frasi dei biglietti)
content/         hubs/*.md, stories/*.md, games/*.md
components/      ui, game-shell, font-switcher, progress, storie, seo/JsonLd
lib/             supabase/, brevo, seo, audio, content
scripts/         sync-content-to-db, export-pdf
public/          llms.txt, cards/, mascot/
docs/            piano-progetto, CONTENT-GUIDE, GAME-DESIGN-CHECKLIST
```

## Deploy su Vercel

1. Importa il repository su Vercel. Il framework viene riconosciuto da `vercel.json` (`nextjs`, regione `fra1`).
2. Imposta le variabili d'ambiente di `.env.example` in Project Settings → Environment Variables.
3. Dominio: `giocaconmizi.com` come primario, `giocaconmizi.it` in redirect (piano §0).
4. In Supabase → Authentication → URL Configuration aggiungi `https://giocaconmizi.com/auth/callback` fra i Redirect URL, insieme a `http://localhost:3000/auth/callback` per lo sviluppo.

`sitemap.xml`, `robots.txt` e `llms.txt` sono generati automaticamente dal registry e dai contenuti: un gioco nuovo entra in sitemap con il commit.

---
