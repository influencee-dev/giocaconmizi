"use client";

import { useCallback, useRef, useState } from "react";
import { minuti, type Capitolo } from "@/lib/contenuti/tutorial-base";
import { VideoMizi, type FileVideo } from "./VideoMizi";

/**
 * Il video di un tutorial con i passi sotto: toccare un passo porta il video
 * a quel punto e lo fa partire. Il video è un file nostro (niente player di
 * terzi, niente cookie), con i sottotitoli già stampati nelle immagini: la traccia
 * .vtt resta spenta (accesa faceva il doppio sottotitolo) e serve a chi la sceglie.
 * Sul telefono si vede la versione verticale (VideoMizi).
 */
export function PlayerTutorial({
  t,
}: {
  t: { titolo: string; capitoli: Capitolo[]; video: { src: string; poster: string; sottotitoli: string }; verticale?: FileVideo };
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [ora, setOra] = useState(0);
  const attivo = [...t.capitoli].reverse().find((c) => ora >= c.da)?.da ?? 0;
  // ?t=36 nell'indirizzo (i «momenti chiave» di Google): il video parte da lì,
  // anche dopo il passaggio alla versione verticale sul telefono.
  const daIndirizzo = useCallback(() => {
    const t0 = Number(new URLSearchParams(window.location.search).get("t"));
    if (video.current && Number.isFinite(t0) && t0 > 0) video.current.currentTime = t0;
  }, []);
  const vai = (c: Capitolo) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = c.da;
    void v.play().catch(() => undefined);
  };
  return (
    <div>
      <VideoMizi
        ref={video}
        orizzontale={{ src: t.video.src, poster: t.video.poster }}
        verticale={t.verticale}
        sottotitoli={t.video.sottotitoli}
        onTimeUpdate={setOra}
        onCambio={daIndirizzo}
        datiVideo={{ "video-tutorial": "" }}
      />
      <nav aria-label={`I passi del video «${t.titolo}»`} className="mt-4">
        <ol className="flex flex-wrap gap-2">
          {t.capitoli.map((c) => (
            <li key={c.da}>
              <button
                type="button"
                onClick={() => vai(c)}
                aria-current={attivo === c.da ? "step" : undefined}
                className={`inline-flex min-h-12 items-center gap-2 rounded-bolla border-2 px-4 py-2 text-sm font-bold transition-colors ${
                  attivo === c.da ? "border-viola bg-viola text-white" : "border-crema-scuro bg-white text-notte hover:border-viola"
                }`}
              >
                <span className={attivo === c.da ? "text-white/85" : "text-viola"}>{minuti(c.da)}</span>
                {c.titolo}
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
