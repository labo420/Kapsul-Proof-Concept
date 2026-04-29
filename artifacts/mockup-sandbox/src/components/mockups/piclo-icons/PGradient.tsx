import React, { useEffect } from 'react';

export function PGradient() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Lilita+One&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div
      style={{
        width: "400px",
        height: "400px",
        backgroundColor: "#1a1a2e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "320px",
          height: "320px",
          backgroundColor: "#08060F",
          borderRadius: "72px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: "190px",
            fontFamily: "'Lilita One', cursive",
            background: "linear-gradient(135deg, #6366F1 0%, #EC4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "inline-block",
            lineHeight: 1,
          }}
        >
          P
        </span>
      </div>
    </div>
  );
}

export default PGradient;
