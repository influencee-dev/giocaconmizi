import type { Metadata } from "next";
import { caratteri, HubCarattere } from "@/components/storie/HubCarattere";

const carattere = caratteri.stampatello;

export const metadata: Metadata = {
  title: carattere.titolo,
  description: carattere.descrizione,
  alternates: { canonical: "/storie/stampatello" },
};

export default function StorieStampatelloPage() {
  return <HubCarattere carattere={carattere} />;
}
