import type { Metadata } from "next";
import { caratteri, HubCarattere } from "@/components/storie/HubCarattere";

const carattere = caratteri.minuscolo;

export const metadata: Metadata = {
  title: carattere.titolo,
  description: carattere.descrizione,
  alternates: { canonical: "/storie/minuscolo" },
};

export default function StorieMinuscoloPage() {
  return <HubCarattere carattere={carattere} />;
}
