/**
 * Un disegno fatto apposta per i giochi: file in public/figure/<nome>.webp
 * (origine e regole in public/figure/LICENZA.txt). Serve quando la figura non
 * c'è nel catalogo SVG di arte.tsx e disegnarla in codice non renderebbe.
 */
export function Figura({ nome, alt, className = "h-36 w-36" }: { nome: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- file statico già della misura giusta, niente da ottimizzare
    <img
      src={`/figure/${nome}.webp`}
      alt={alt}
      width={384}
      height={384}
      decoding="async"
      draggable={false}
      data-figura={nome}
      className={`${className} select-none rounded-2xl object-contain`}
    />
  );
}
