import type { Metadata } from "next";
import { Contenitore } from "@/components/ui";
import { Carrello } from "@/components/negozio/Carrello";
import { stripeDiProva } from "@/lib/negozio/stripe";

export const metadata: Metadata = {
  title: "Il tuo carrello",
  robots: { index: false, follow: false },
};

export default function CarrelloPage() {
  return (
    <Contenitore className="max-w-2xl py-10">
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">Il tuo carrello</h1>
      <Carrello prova={stripeDiProva()} />
    </Contenitore>
  );
}
