import type { Metadata } from "next";
import { Contenitore } from "@/components/ui";
import { IngressoAdmin } from "./IngressoAdmin";

/**
 * giocamizi.it/admin senza codice: invece di una pagina d'errore, il campo
 * per incollare il codice del pannello. Il codice non viene salvato da
 * nessuna parte: porta solo a /admin/<codice>, che lo controlla.
 */
export const metadata: Metadata = { title: "Pannello", robots: { index: false, follow: false } };

export default function AdminIngresso() {
  return (
    <Contenitore className="py-16">
      <h1 className="text-3xl font-extrabold text-notte">Pannello di Giocamizi</h1>
      <p className="mt-3 text-notte-tenue">
        Incolla il codice del pannello oppure il link intero che ti è stato dato (quello che comincia con giocamizi.it/admin/…).
      </p>
      <IngressoAdmin />
    </Contenitore>
  );
}
