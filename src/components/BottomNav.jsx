import { SCREENS } from "../constants";
import { IconHome, IconWallet, IconList, IconChart, IconSettings } from "./Icons";

export default function BottomNav({ screen, onNavigate, theme, t }) {
  const navItems = [
    { id: SCREENS.HOME,     icon: IconHome,     label: t.home },
    { id: SCREENS.WALLET,   icon: IconWallet,   label: t.walletScreen },
    { id: SCREENS.ALL,      icon: IconList,     label: t.all },
    { id: SCREENS.REPORTS,  icon: IconChart,    label: t.reports },
    { id: SCREENS.SETTINGS, icon: IconSettings, label: t.settings },
  ];

  return (
    <>
      <style>{`
        @keyframes navPillGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      <nav style={{
        position: "fixed", bottom: 0,
        left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: theme.navBg,
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        borderTop: `1px solid rgba(255,255,255,0.08)`,
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "10px 0 18px",
        zIndex: 200,
        transition: "background 0.4s",
      }}>
        {navItems.map(nav => {
          const active = screen === nav.id;
          const Icon = nav.icon;
          return (
            <button key={nav.id} onClick={() => onNavigate(nav.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              position: "relative",
              padding: "4px 10px",
              transition: "transform 0.2s",
              transform: active ? "scale(1)" : "scale(0.95)",
            }}>
              {/* Active indicator pill */}
              {active && (
                <div style={{
                  position: "absolute", top: -2,
                  left: "50%", transform: "translateX(-50%)",
                  width: 24, height: 3, borderRadius: 2,
                  background: theme.navIndicator,
                  boxShadow: `0 0 10px ${theme.navIndicator}`,
                  animation: "navPillGlow 2s ease-in-out infinite",
                }} />
              )}
              <Icon
                size={22}
                color={active ? theme.navIndicator : theme.navText}
                style={{ transition: "color 0.2s", opacity: active ? 1 : 0.5 }}
              />
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: active ? theme.navIndicator : theme.navText,
                opacity: active ? 1 : 0.5,
                transition: "color 0.2s, opacity 0.2s",
              }}>
                {nav.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
