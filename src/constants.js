const MONO_DARK_BG  = "rgba(148,163,184,";
const MONO_LIGHT_BG = "rgba(100,116,139,";

export const CATEGORIES = [
  { id: "food",          emoji: "🍔", colorDark: "#cbd5e1", colorLight: "#475569", bg: MONO_DARK_BG, bgLight: MONO_LIGHT_BG },
  { id: "transport",     emoji: "🚗", colorDark: "#cbd5e1", colorLight: "#475569", bg: MONO_DARK_BG, bgLight: MONO_LIGHT_BG },
  { id: "groceries",     emoji: "🛒", colorDark: "#cbd5e1", colorLight: "#475569", bg: MONO_DARK_BG, bgLight: MONO_LIGHT_BG },
  { id: "entertainment", emoji: "🎉", colorDark: "#cbd5e1", colorLight: "#475569", bg: MONO_DARK_BG, bgLight: MONO_LIGHT_BG },
  { id: "health",        emoji: "💊", colorDark: "#cbd5e1", colorLight: "#475569", bg: MONO_DARK_BG, bgLight: MONO_LIGHT_BG },
  { id: "home",          emoji: "🏠", colorDark: "#cbd5e1", colorLight: "#475569", bg: MONO_DARK_BG, bgLight: MONO_LIGHT_BG },
  { id: "shopping",      emoji: "👕", colorDark: "#cbd5e1", colorLight: "#475569", bg: MONO_DARK_BG, bgLight: MONO_LIGHT_BG },
  { id: "other",         emoji: "➕", colorDark: "#cbd5e1", colorLight: "#475569", bg: MONO_DARK_BG, bgLight: MONO_LIGHT_BG },
];

// Muted slate/teal ramp for charts only — reused by index across pie/bar segments.
export const CHART_RAMP = [
  "#0D9488", "#475569", "#64748B", "#0F766E", "#334155", "#94A3B8", "#115E59", "#1E293B",
];
export const CHART_WARN = "#B45309";

export const CURRENCIES = [
  { code: "SYP", symbol: "ل.س", name: "Syrian Pound" },
  { code: "USD", symbol: "$",   name: "US Dollar" },
];

export const SCREENS = { HOME: "home", ADD: "add", WALLET: "wallet", ALL: "all", REPORTS: "reports", SETTINGS: "settings" };

export const DARK = {
  bg:          "#0E1116",
  surface:     "#15181F",
  surface2:    "#1C2029",
  // Unused-but-kept keys so any stray consumer still resolves:
  bgGlow1: "transparent", bgGlow2: "transparent", bgGlow3: "transparent", bgGlow4: "transparent", bgGlow5: "transparent",
  glass:       "#15181F",
  glassBorder: "rgba(255,255,255,0.08)",
  glassBg2:    "#1C2029",
  glassShadow: "none",
  glassInner:  "none",
  cardGrad:    "#15181F",
  walletGrad:  "#15181F",
  walletAccent:"#10B981",
  text:        "#F4F4F5",
  textSub:     "rgba(244,244,245,0.60)",
  textMuted:   "rgba(244,244,245,0.38)",
  accent1:     "#10B981",
  accent2:     "#10B981",
  navBg:       "#15181F",
  navActive:   "rgba(16,185,129,0.12)",
  navIndicator:"#10B981",
  navText:     "rgba(244,244,245,0.45)",
  inputBg:     "#1C2029",
  inputBorder: "rgba(255,255,255,0.08)",
  btnGrad:     "#10B981",
  totalGrad:   "#10B981",
  sectionBg:   "#1C2029",
  divider:     "rgba(255,255,255,0.08)",
  border:      "rgba(255,255,255,0.08)",
  fabGlow:     "0 4px 12px rgba(0,0,0,0.4)",
  fabPulse:    "0 4px 12px rgba(0,0,0,0.4)",
  progressRing:{ track: "rgba(255,255,255,0.08)", g1: "#10B981", g2: "#10B981" },
};

export const LIGHT = {
  bg:          "#FAFAFA",
  surface:     "#FFFFFF",
  surface2:    "#F4F4F5",
  bgGlow1: "transparent", bgGlow2: "transparent", bgGlow3: "transparent", bgGlow4: "transparent", bgGlow5: "transparent",
  glass:       "#FFFFFF",
  glassBorder: "rgba(14,17,22,0.08)",
  glassBg2:    "#F4F4F5",
  glassShadow: "none",
  glassInner:  "none",
  cardGrad:    "#FFFFFF",
  walletGrad:  "#FFFFFF",
  walletAccent:"#059669",
  text:        "#0E1116",
  textSub:     "rgba(14,17,22,0.60)",
  textMuted:   "rgba(14,17,22,0.38)",
  accent1:     "#059669",
  accent2:     "#059669",
  navBg:       "#FFFFFF",
  navActive:   "rgba(5,150,105,0.10)",
  navIndicator:"#059669",
  navText:     "rgba(14,17,22,0.55)",
  inputBg:     "#F4F4F5",
  inputBorder: "rgba(14,17,22,0.08)",
  btnGrad:     "#059669",
  totalGrad:   "#059669",
  sectionBg:   "#F4F4F5",
  divider:     "rgba(14,17,22,0.08)",
  border:      "rgba(14,17,22,0.08)",
  fabGlow:     "0 4px 12px rgba(14,17,22,0.12)",
  fabPulse:    "0 4px 12px rgba(14,17,22,0.12)",
  progressRing:{ track: "rgba(14,17,22,0.08)", g1: "#059669", g2: "#059669" },
};

export function cat(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES.find(c => c.id === "other");
}
