export default function GlassCard({ children, style = {}, onClick, theme }) {
  return (
    <div onClick={onClick} style={{
      background: theme.glass,
      border: `1px solid ${theme.glassBorder}`,
      borderRadius: 16,
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      ...style,
    }}>
      {children}
    </div>
  );
}
