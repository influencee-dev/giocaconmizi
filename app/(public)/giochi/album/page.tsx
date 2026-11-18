import type { Metadata } from "next";
import { Contenitore } from "@/components/ui";
import { giochiBrevi } from "@/games/elenco";
import { AlbumMizi } from "@/components/giochi/AlbumMizi";

/** L'album di Mizi: le figurine dei giochi finiti. Vive sul telefono (lib/giochi/album.ts). */
export const metadata: Metadata = {
  title: "L'album di Mizi",
  description: "Le figurine dei giochi finiti: una per ogni gioco, più la coccarda del giorno.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/giochi/album" },
};

export default function AlbumPage() {
  return (
    <Contenitore largo className="pb-12 pt-8">
      <AlbumMizi giochi={giochiBrevi()} />
    </Contenitore>
  );
}
