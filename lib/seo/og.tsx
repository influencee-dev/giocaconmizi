/**
 * Il modello delle immagini Open Graph (1200×630): l'anteprima che compare
 * quando una pagina viene condivisa su WhatsApp o sui social. Disegnata con
 * i colori del sito via next/og (satori): niente asset esterni, niente font
 * da scaricare. Ogni div con figli deve dichiarare display:flex (regola di
 * satori).
 */

export const dimensioniOg = { width: 1200, height: 630 };

export function ImmagineOg({ titolo, sottotitolo }: { titolo: string; sottotitolo: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#FFF3E6",
        padding: 64,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", width: 30, height: 30, borderRadius: 999, backgroundColor: "#F28AB2" }} />
        <div style={{ display: "flex", width: 30, height: 30, borderRadius: 999, backgroundColor: "#F9C846" }} />
        <div style={{ display: "flex", width: 30, height: 30, borderRadius: 999, backgroundColor: "#3DB5E6" }} />
        <div style={{ display: "flex", fontSize: 38, fontWeight: 800, color: "#1F2430", marginLeft: 14 }}>
          Gioca con <span style={{ color: "#9B6DD6", marginLeft: 12 }}>Mizi</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: titolo.length > 55 ? 56 : 68,
          fontWeight: 800,
          color: "#1F2430",
          lineHeight: 1.15,
          maxWidth: 1040,
        }}
      >
        {titolo}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            backgroundColor: "#FFFFFF",
            border: "3px solid #F6E3CF",
            borderRadius: 999,
            padding: "14px 30px",
            fontSize: 28,
            fontWeight: 700,
            color: "#4A5164",
          }}
        >
          {sottotitolo}
        </div>
        <div
          style={{
            display: "flex",
            backgroundColor: "#F28AB2",
            borderRadius: 999,
            padding: "14px 30px",
            fontSize: 28,
            fontWeight: 800,
            color: "#FFFFFF",
          }}
        >
          gratis · senza pubblicità
        </div>
      </div>
    </div>
  );
}
