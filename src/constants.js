export const CATEGORIES = [
  { id: "food",          emoji: "🍔", colorDark: "#38bdf8", colorLight: "#0ea5e9", bg: "rgba(56,189,248," },
  { id: "transport",     emoji: "🚗", colorDark: "#a78bfa", colorLight: "#7c3aed", bg: "rgba(139,92,246," },
  { id: "groceries",     emoji: "🛒", colorDark: "#34d399", colorLight: "#059669", bg: "rgba(52,211,153," },
  { id: "entertainment", emoji: "🎉", colorDark: "#fb923c", colorLight: "#ea580c", bg: "rgba(251,146,60," },
  { id: "health",        emoji: "💊", colorDark: "#f472b6", colorLight: "#db2777", bg: "rgba(244,114,182," },
  { id: "home",          emoji: "🏠", colorDark: "#fbbf24", colorLight: "#d97706", bg: "rgba(251,191,36," },
  { id: "shopping",      emoji: "👕", colorDark: "#818cf8", colorLight: "#4f46e5", bg: "rgba(129,140,248," },
  { id: "other",         emoji: "➕", colorDark: "#94a3b8", colorLight: "#64748b", bg: "rgba(148,163,184," },
];

export const CURRENCIES = [
  { code: "SYP", symbol: "ل.س", name: "Syrian Pound" },
  { code: "USD", symbol: "$",   name: "US Dollar" },
];

export const SCREENS = { HOME: "home", ADD: "add", WALLET: "wallet", ALL: "all", REPORTS: "reports", SETTINGS: "settings", GUIDE: "guide" };

export const DARK = {
  bg:          "linear-gradient(170deg, #020d1c 0%, #030f20 55%, #010b16 100%)",
  bgGlow1:     "rgba(0,240,160,0.26)",    // aurora green
  bgGlow2:     "rgba(120,45,230,0.24)",   // aurora violet
  bgGlow3:     "rgba(0,210,235,0.22)",    // aurora cyan
  bgGlow4:     "rgba(210,50,200,0.18)",   // aurora magenta
  bgGlow5:     "rgba(180,230,255,0.10)",  // horizon cyan
  glass:       "rgba(255,255,255,0.055)",
  glassBorder: "rgba(0,240,160,0.14)",
  glassBg2:    "rgba(255,255,255,0.035)",
  glassShadow: "0 8px 32px rgba(0,0,0,0.3)",
  glassInner:  "inset 0 1px 0 rgba(255,255,255,0.06)",
  cardGrad:    "linear-gradient(135deg, rgba(0,229,160,0.08) 0%, rgba(167,139,250,0.08) 100%)",
  walletGrad:  "linear-gradient(135deg, #0c2d4d 0%, #1a1040 50%, #0d2a3f 100%)",
  walletAccent:"linear-gradient(135deg, #00e5a0, #38bdf8, #a78bfa)",
  text:        "#f1f5f9",
  textSub:     "rgba(255,255,255,0.45)",
  textMuted:   "rgba(255,255,255,0.25)",
  accent1:     "#00e5a0",
  accent2:     "#a78bfa",
  navBg:       "rgba(2,10,22,0.94)",
  navActive:   "rgba(0,229,160,0.15)",
  navIndicator:"#00e5a0",
  inputBg:     "rgba(255,255,255,0.06)",
  inputBorder: "rgba(0,240,160,0.15)",
  btnGrad:     "linear-gradient(135deg,#00c896,#7c3aed)",
  totalGrad:   "linear-gradient(135deg,#00e5a0,#a855f7)",
  sectionBg:   "rgba(255,255,255,0.03)",
  divider:     "rgba(0,240,160,0.10)",
  fabGlow:     "0 0 20px rgba(0,200,150,0.4), 0 4px 24px rgba(56,189,248,0.35)",
  fabPulse:    "0 0 30px rgba(0,200,150,0.5), 0 0 60px rgba(56,189,248,0.2)",
  progressRing:{ track: "rgba(255,255,255,0.08)", g1: "#00e5a0", g2: "#a78bfa" },
};

export const LIGHT = {
  bg:          "linear-gradient(170deg, #e0f5ff 0%, #edf8ff 50%, #e5efff 100%)",
  bgGlow1:     "rgba(0,200,130,0.22)",    // aurora green
  bgGlow2:     "rgba(120,45,215,0.18)",   // aurora violet
  bgGlow3:     "rgba(0,190,215,0.17)",    // aurora cyan
  bgGlow4:     "rgba(200,50,190,0.14)",   // aurora magenta
  bgGlow5:     "rgba(160,210,240,0.12)",  // horizon cyan
  glass:       "rgba(255,255,255,0.72)",
  glassBorder: "rgba(0,200,130,0.22)",
  glassBg2:    "rgba(255,255,255,0.50)",
  glassShadow: "0 8px 32px rgba(0,0,0,0.06)",
  glassInner:  "inset 0 1px 0 rgba(255,255,255,0.8)",
  cardGrad:    "linear-gradient(135deg, rgba(5,150,105,0.06) 0%, rgba(109,40,217,0.06) 100%)",
  walletGrad:  "linear-gradient(135deg, #e0f5ff 0%, #ede9fe 50%, #e0f5ff 100%)",
  walletAccent:"linear-gradient(135deg, #059669, #0ea5e9, #7c3aed)",
  text:        "#0c1a2e",
  textSub:     "rgba(12,26,46,0.50)",
  textMuted:   "rgba(12,26,46,0.28)",
  accent1:     "#059669",
  accent2:     "#6d28d9",
  navBg:       "rgba(210,245,255,0.94)",
  navActive:   "rgba(5,150,105,0.12)",
  navIndicator:"#059669",
  inputBg:     "rgba(255,255,255,0.75)",
  inputBorder: "rgba(0,200,130,0.25)",
  btnGrad:     "linear-gradient(135deg,#059669,#6d28d9)",
  totalGrad:   "linear-gradient(135deg,#059669,#7c3aed)",
  sectionBg:   "rgba(255,255,255,0.45)",
  divider:     "rgba(0,200,130,0.14)",
  fabGlow:     "0 0 20px rgba(5,150,105,0.3), 0 4px 24px rgba(14,165,233,0.25)",
  fabPulse:    "0 0 30px rgba(5,150,105,0.4), 0 0 60px rgba(14,165,233,0.15)",
  progressRing:{ track: "rgba(0,0,0,0.06)", g1: "#059669", g2: "#7c3aed" },
};

export function cat(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES.find(c => c.id === "other");
}
