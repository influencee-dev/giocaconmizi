import type { Metadata } from "next";
import { PaginaProfilo } from "./PaginaProfilo";

/** Il profilo della mamma: vive sul telefono (lib/profilo.ts), qui si guarda e si cambia. */
export const metadata: Metadata = {
  title: "Il tuo profilo",
  robots: { index: false, follow: false },
};

export default function Profilo() {
  return <PaginaProfilo />;
}
