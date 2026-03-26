export default function GlowBg({ theme, style = {} }) {
  return (
    <>
      <style>{`
        @keyframes aur1 {
          0%,100% { transform: scaleX(1.0) scaleY(1.0) skewX(-4deg); opacity: 0.75; }
          50%      { transform: scaleX(1.1) scaleY(1.25) skewX(4deg);  opacity: 1.0;  }
        }
        @keyframes aur2 {
          0%,100% { transform: scaleX(1.05) scaleY(1.0)  skewX(5deg);  opacity: 0.65; }
          50%      { transform: scaleX(0.93) scaleY(1.2)  skewX(-5deg); opacity: 0.95; }
        }
        @keyframes aur3 {
          0%,100% { transform: scaleX(1.0) scaleY(0.95) skewX(-3deg); opacity: 0.6;  }
          50%      { transform: scaleX(1.12) scaleY(1.15) skewX(3deg);  opacity: 0.9;  }
        }
        @keyframes aur4 {
          0%,100% { transform: scaleX(0.95) scaleY(1.1) skewX(6deg);  opacity: 0.55; }
          50%      { transform: scaleX(1.08) scaleY(1.0) skewX(-6deg); opacity: 0.85; }
        }
      `}</style>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", ...style }}>
        {/* Band 1: aurora green — upper sky */}
        <div style={{
          position: "absolute", width: "190%", height: 240,
          left: "-45%", top: "6%",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${theme.bgGlow1} 0%, transparent 68%)`,
          filter: "blur(28px)",
          animation: "aur1 9s ease-in-out infinite",
        }} />
        {/* Band 2: aurora violet — mid-upper */}
        <div style={{
          position: "absolute", width: "170%", height: 190,
          left: "-35%", top: "26%",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${theme.bgGlow2} 0%, transparent 68%)`,
          filter: "blur(32px)",
          animation: "aur2 11s ease-in-out infinite",
        }} />
        {/* Band 3: aurora cyan — mid-lower */}
        <div style={{
          position: "absolute", width: "160%", height: 160,
          left: "-30%", top: "48%",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${theme.bgGlow3} 0%, transparent 68%)`,
          filter: "blur(24px)",
          animation: "aur3 13s ease-in-out infinite",
        }} />
        {/* Band 4: aurora magenta — lower sky */}
        <div style={{
          position: "absolute", width: "180%", height: 210,
          left: "-40%", bottom: "4%",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${theme.bgGlow4} 0%, transparent 68%)`,
          filter: "blur(30px)",
          animation: "aur4 15s ease-in-out infinite",
        }} />
      </div>
    </>
  );
}
