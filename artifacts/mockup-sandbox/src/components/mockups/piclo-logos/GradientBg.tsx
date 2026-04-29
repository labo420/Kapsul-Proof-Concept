export function GradientBg() {
  const variants = [
    {
      label: "Sfondo app",
      bg: "#08060F",
      style: { background: "#08060F" },
    },
    {
      label: "Gradiente",
      bg: "gradient",
      style: {
        background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",
      },
    },
    {
      label: "Gradiente verticale",
      bg: "gradient-v",
      style: {
        background: "linear-gradient(180deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",
      },
    },
    {
      label: "Card",
      bg: "#130F1C",
      style: { background: "#130F1C" },
    },
  ];

  return (
    <div
      style={{ background: "#0D0A17" }}
      className="min-h-screen flex flex-col items-center justify-center gap-8 p-10"
    >
      <p style={{ color: "#9CA3AF", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>
        Logo · Varianti sfondo
      </p>
      <div className="flex flex-row flex-wrap items-center justify-center gap-6">
        {variants.map((v) => (
          <div
            key={v.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                ...v.style,
                width: 220,
                height: 220,
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <img
                src="/piclo-logo-white.png"
                alt="Piclo"
                style={{
                  width: 140,
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
            <span
              style={{
                color: "#9CA3AF",
                fontSize: 11,
                fontFamily: "Inter, sans-serif",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {v.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
