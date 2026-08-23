import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hub } from "@/lib/content";
import { Contenitore, Prosa } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const contenuto = hub("metodo");
  return {
    title: contenuto?.title ?? "Il metodo",
    description:
      contenuto?.description ??
      "Come scegliamo e costruiamo i giochi: una competenza per gioco, niente timer, feedback gentile.",
    alternates: { canonical: "/metodo" },
  };
}

export default function MetodoPage() {
  const contenuto = hub("metodo");
  if (!contenuto) notFound();

  return (
    <Contenitore className="py-10">
      <Prosa html={contenuto.html} />
    </Contenitore>
  );
}
