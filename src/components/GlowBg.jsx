export default function GlowBg({ theme, style = {} }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", ...style }}>
      <div style={{
        position: "absolute", width: 280, height: 280, borderRadius: "50%",
        background: `radial-gradient(circle, ${theme.bgGlow1}, transparent 65%)`,
        top: -80, right: -60,
      }} />
      <div style={{
        position: "absolute", width: 220, height: 220, borderRadius: "50%",
        background: `radial-gradient(circle, ${theme.bgGlow2}, transparent 65%)`,
        bottom: 60, left: -60,
      }} />
      <div style={{
        position: "absolute", width: 180, height: 180, borderRadius: "50%",
        background: `radial-gradient(circle, ${theme.bgGlow3}, transparent 65%)`,
        top: "40%", right: "30%",
      }} />
    </div>
  );
}
