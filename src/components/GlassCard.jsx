export default function GlassCard({ children, style = {}, onClick, theme, variant = "default" }) {
  const base = {
    background: theme.glass,
    border: `1px solid ${theme.glassBorder}`,
    borderRadius: 20,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: theme.glassShadow,
  };

  if (variant === "elevated") {
    base.background = theme.cardGrad;
    base.boxShadow = `${theme.glassShadow}, ${theme.glassInner}`;
  } else if (variant === "wallet") {
    base.background = theme.walletGrad;
    base.boxShadow = `${theme.glassShadow}, ${theme.glassInner}`;
  }

  return (
    <div onClick={onClick} style={{ ...base, ...style }}>
      {children}
    </div>
  );
}
