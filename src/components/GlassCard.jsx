export default function GlassCard({ children, style = {}, onClick, theme }) {
  const base = {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 16,
    boxShadow: "none",
  };

  return (
    <div onClick={onClick} style={{ ...base, ...style }}>
      {children}
    </div>
  );
}
