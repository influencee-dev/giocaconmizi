/** La freccia dei bottoni del template (anche nei componenti client). */
export function Freccia({ className = "h-5 w-5", indietro = false }: { className?: string; indietro?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d={indietro ? "M19 12H5M11 6l-6 6 6 6" : "M5 12h14M13 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
