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

export const SCREENS = { HOME: "home", ADD: "add", ALL: "all", REPORTS: "reports", SETTINGS: "settings" };

export const DARK = {
  bg:          "linear-gradient(170deg, #020d1c 0%, #030f20 55%, #010b16 100%)",
  bgGlow1:     "rgba(0,240,160,0.26)",    // aurora green
  bgGlow2:     "rgba(120,45,230,0.24)",   // aurora violet
  bgGlow3:     "rgba(0,210,235,0.22)",    // aurora cyan
  bgGlow4:     "rgba(210,50,200,0.18)",   // aurora magenta
  glass:       "rgba(255,255,255,0.055)",
  glassBorder: "rgba(0,240,160,0.14)",
  glassBg2:    "rgba(255,255,255,0.035)",
  text:        "#f1f5f9",
  textSub:     "rgba(255,255,255,0.45)",
  textMuted:   "rgba(255,255,255,0.25)",
  accent1:     "#00e5a0",
  accent2:     "#a78bfa",
  navBg:       "rgba(2,10,22,0.94)",
  inputBg:     "rgba(255,255,255,0.06)",
  inputBorder: "rgba(0,240,160,0.15)",
  btnGrad:     "linear-gradient(135deg,#00c896,#7c3aed)",
  totalGrad:   "linear-gradient(135deg,#00e5a0,#a855f7)",
  sectionBg:   "rgba(255,255,255,0.03)",
  divider:     "rgba(0,240,160,0.10)",
};

export const LIGHT = {
  bg:          "linear-gradient(170deg, #e0f5ff 0%, #edf8ff 50%, #e5efff 100%)",
  bgGlow1:     "rgba(0,200,130,0.22)",    // aurora green
  bgGlow2:     "rgba(120,45,215,0.18)",   // aurora violet
  bgGlow3:     "rgba(0,190,215,0.17)",    // aurora cyan
  bgGlow4:     "rgba(200,50,190,0.14)",   // aurora magenta
  glass:       "rgba(255,255,255,0.72)",
  glassBorder: "rgba(0,200,130,0.22)",
  glassBg2:    "rgba(255,255,255,0.50)",
  text:        "#0c1a2e",
  textSub:     "rgba(12,26,46,0.50)",
  textMuted:   "rgba(12,26,46,0.28)",
  accent1:     "#059669",
  accent2:     "#6d28d9",
  navBg:       "rgba(210,245,255,0.94)",
  inputBg:     "rgba(255,255,255,0.75)",
  inputBorder: "rgba(0,200,130,0.25)",
  btnGrad:     "linear-gradient(135deg,#059669,#6d28d9)",
  totalGrad:   "linear-gradient(135deg,#059669,#7c3aed)",
  sectionBg:   "rgba(255,255,255,0.45)",
  divider:     "rgba(0,200,130,0.14)",
};

export function cat(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES.find(c => c.id === "other");
}
