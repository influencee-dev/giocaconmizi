"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { VideoIncorporato } from "@/lib/scheda-campi";

const NOME = { instagram: "Instagram", youtube: "YouTube", tiktok: "TikTok" } as const;

/**
 * Reel e video dell'attività con il player UFFICIALE della piattaforma (come
 * fanno Google e le app di AI): niente si scarica né si copia. Finché la mamma
 * non tocca, nella pagina non c'è codice dei social, quindi nessun cookie di terzi.
 */
export function VideoAlTocco({ video, nome }: { video: VideoIncorporato; nome: string }) {
  const [aperto, setAperto] = useState(false);
  const verticale = video.piattaforma !== "youtube" || video.url.includes("/shorts/");

  if (!aperto) {
    return (
      <button
        type="button"
        data-video={video.piattaforma}
        onClick={() => setAperto(true)}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-[1.4rem] border-2 border-crema-scuro bg-crema px-4 text-center transition-colors hover:border-viola ${
          verticale ? "aspect-[9/14] max-w-[16rem]" : "aspect-video"
        }`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-viola text-white shadow-md">
          <Play className="ml-1 h-7 w-7" fill="currentColor" aria-hidden />
        </span>
        <span className="font-extrabold text-notte">Guarda su {NOME[video.piattaforma]}</span>
        <span className="text-xs text-notte-tenue">Il player di {NOME[video.piattaforma]} e i suoi cookie partono solo al tocco.</span>
      </button>
    );
  }

  return (
    <iframe
      src={video.incorpora}
      title={`Video di ${nome} su ${NOME[video.piattaforma]}`}
      className={`w-full rounded-[1.4rem] border border-notte/10 bg-white ${verticale ? "aspect-[9/16] max-w-[20rem]" : "aspect-video"}`}
      loading="lazy"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );
}
