"use client";

/* Site-wide backdrop: the faint ink grid from the Devi hero's "room",
   fading out towards the bottom of the viewport so content stays calm. */
export default function DotPatternBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden" style={{ backgroundColor: "var(--bg)" }}>
      <div
        className="absolute inset-0 poster-grid-bg"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
        }}
      />
    </div>
  );
}
