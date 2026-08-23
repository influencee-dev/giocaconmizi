import type { Metadata } from "next";
import { caratteri, HubCarattere } from "@/components/storie/HubCarattere";

const carattere = caratteri.corsivo;

export const metadata: Metadata = {
  title: carattere.titolo,
  description: carattere.descrizione,
  alternates: { canonical: "/storie/corsivo" },
};

export default function StorieCorsivoPage() {
  return <HubCarattere carattere={carattere} />;
}
