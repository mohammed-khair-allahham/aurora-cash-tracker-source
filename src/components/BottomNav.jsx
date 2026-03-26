import { SCREENS } from "../constants";

export default function BottomNav({ screen, onNavigate, theme, isDark, t }) {
  const navItems = [
    { id: SCREENS.HOME,     emoji: "🏠", label: t.home },
    { id: SCREENS.ADD,      emoji: "＋", label: t.addExpense, big: true },
    { id: SCREENS.REPORTS,  emoji: "📊", label: t.reports },
    { id: SCREENS.SETTINGS, emoji: "⚙️", label: t.settings },
  ];

  return (
    <nav style={{
      position: "fixed", bottom: 0,
      left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      background: theme.navBg,
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderTop: `1px solid ${theme.glassBorder}`,
      display: "flex", justifyContent: "space-around", alignItems: "center",
      padding: "10px 0 18px",
      zIndex: 200,
      transition: "background 0.4s",
    }}>
      {navItems.map(nav => nav.big ? (
        <button key={nav.id} onClick={() => onNavigate(nav.id)} style={{
          width: 56, height: 56, borderRadius: "50%",
          background: theme.btnGrad,
          border: "none", cursor: "pointer",
          fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 24px rgba(56,189,248,${isDark ? "0.4" : "0.3"})`,
          transform: screen === nav.id ? "scale(1.08)" : "scale(1)",
          transition: "transform 0.2s, box-shadow 0.2s",
          marginTop: -18, color: "#fff", fontWeight: 700,
        }}>+</button>
      ) : (
        <button key={nav.id} onClick={() => onNavigate(nav.id)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          opacity: screen === nav.id ? 1 : 0.4,
          transition: "opacity 0.2s",
          padding: "4px 18px",
        }}>
          <span style={{ fontSize: 20 }}>{nav.emoji}</span>
          <span style={{ fontSize: 10, color: screen === nav.id ? theme.accent1 : theme.textSub, fontWeight: 600 }}>
            {nav.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
