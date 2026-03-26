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

export const SCREENS = { HOME: "home", ADD: "add", REPORTS: "reports", SETTINGS: "settings" };

export const DARK = {
  bg:          "#090e18",
  bgGlow1:     "rgba(56,189,248,0.18)",
  bgGlow2:     "rgba(139,92,246,0.15)",
  bgGlow3:     "rgba(99,102,241,0.12)",
  glass:       "rgba(255,255,255,0.055)",
  glassBorder: "rgba(255,255,255,0.10)",
  glassBg2:    "rgba(255,255,255,0.035)",
  text:        "#f1f5f9",
  textSub:     "rgba(255,255,255,0.45)",
  textMuted:   "rgba(255,255,255,0.25)",
  accent1:     "#38bdf8",
  accent2:     "#818cf8",
  navBg:       "rgba(9,14,24,0.92)",
  inputBg:     "rgba(255,255,255,0.06)",
  inputBorder: "rgba(255,255,255,0.10)",
  btnGrad:     "linear-gradient(135deg,#0ea5e9,#6366f1)",
  totalGrad:   "linear-gradient(135deg,#38bdf8,#818cf8)",
  sectionBg:   "rgba(255,255,255,0.03)",
  divider:     "rgba(255,255,255,0.07)",
};

export const LIGHT = {
  bg:          "#eef6ff",
  bgGlow1:     "rgba(56,189,248,0.22)",
  bgGlow2:     "rgba(139,92,246,0.14)",
  bgGlow3:     "rgba(99,102,241,0.10)",
  glass:       "rgba(255,255,255,0.72)",
  glassBorder: "rgba(56,189,248,0.20)",
  glassBg2:    "rgba(255,255,255,0.50)",
  text:        "#0c1a2e",
  textSub:     "rgba(12,26,46,0.50)",
  textMuted:   "rgba(12,26,46,0.28)",
  accent1:     "#0369a1",
  accent2:     "#4f46e5",
  navBg:       "rgba(220,240,255,0.92)",
  inputBg:     "rgba(255,255,255,0.75)",
  inputBorder: "rgba(56,189,248,0.25)",
  btnGrad:     "linear-gradient(135deg,#0ea5e9,#4f46e5)",
  totalGrad:   "linear-gradient(135deg,#0369a1,#4f46e5)",
  sectionBg:   "rgba(255,255,255,0.45)",
  divider:     "rgba(56,189,248,0.12)",
};

export function cat(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES.find(c => c.id === "other");
}
