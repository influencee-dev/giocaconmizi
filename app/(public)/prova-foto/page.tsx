import type { Metadata } from "next";
import { Contenitore } from "@/components/ui";
import { ProvaFoto } from "./ProvaFoto";

/** TEMPORANEA (15/11/2026): prova delle foto su un telefono dove non si vedono. Da togliere a guasto risolto. */
export const metadata: Metadata = { title: "Prova delle foto", robots: { index: false, follow: false } };

export default function Pagina() {
  return (
    <Contenitore className="py-8">
      <h1 className="text-3xl font-extrabold text-notte">Prova delle foto</h1>
      <ProvaFoto />
    </Contenitore>
  );
}
