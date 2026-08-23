import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hub } from "@/lib/content";
import { Contenitore, Prosa } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const contenuto = hub("perche-lo-facciamo");
  return {
    title: contenuto?.title ?? "Perché lo facciamo",
    description:
      contenuto?.description ??
      "Perché Gioca con Mizi è gratis e senza pubblicità, e dove va una parte di quello che guadagniamo.",
    alternates: { canonical: "/perche-lo-facciamo" },
  };
}

export default function PercheLoFacciamoPage() {
  const contenuto = hub("perche-lo-facciamo");
  if (!contenuto) notFound();

  return (
    <Contenitore className="py-10">
      <Prosa html={contenuto.html} />
    </Contenitore>
  );
}
