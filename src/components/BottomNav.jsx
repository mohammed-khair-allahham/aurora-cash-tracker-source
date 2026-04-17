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
    <nav style={{
      position: "fixed", bottom: 0,
      left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      background: theme.navBg,
      borderTop: `1px solid ${theme.border}`,
      display: "flex", justifyContent: "space-around", alignItems: "center",
      padding: "10px 0 18px",
      zIndex: 200,
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
          }}>
            {active && (
              <div style={{
                position: "absolute", top: -2,
                left: "50%", transform: "translateX(-50%)",
                width: 24, height: 3, borderRadius: 2,
                background: theme.navIndicator,
              }} />
            )}
            <Icon
              size={22}
              color={active ? theme.navIndicator : theme.navText}
            />
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: active ? theme.navIndicator : theme.navText,
            }}>
              {nav.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
