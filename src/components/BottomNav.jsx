import { SCREENS } from "../constants";

export default function BottomNav({ screen, onNavigate, theme, isDark, t }) {
  const navItems = [
    { id: SCREENS.HOME,     emoji: "🏠", label: t.home },
    { id: SCREENS.ALL,      emoji: "📋", label: t.all },
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
      {navItems.map(nav => (
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
