# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install --legacy-peer-deps   # Required: vite-plugin-pwa@1.2.0 doesn't declare Vite 8 support
npm run dev       # Start Vite dev server (default port 5173; use -- --port 3000 if blocked)
npm run build     # Production build → /dist (includes PWA service worker + manifest)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

No test framework is configured.

## Architecture

**Aurora Cash Tracker** is a zero-backend PWA for personal expense tracking. All data lives in `localStorage`; there are no API calls.

### File layout

The app was originally a single-file monolith but has since been split into focused modules. [src/App.jsx](src/App.jsx) is now a thin root (~290 lines) that owns all state and routes to screens.

```
src/
  App.jsx             # root: state, persistence, routing, FAB, guide overlay
  main.jsx            # Vite entry
  i18n.js             # T: en/ar translations (single default export)
  constants.js        # CATEGORIES, CURRENCIES, SCREENS, DARK, LIGHT theme tokens, cat()
  utils.js            # ls/lsSet, todayStr, yesterdayStr, fmtDate, fmtAmt, getDaysInMonth, getWeekStartStr, fmtShortDate
  components/
    BottomNav.jsx     # fixed bottom nav
    GlassCard.jsx     # glassmorphism card wrapper (supports variant="wallet")
    GlowBg.jsx        # animated aurora background orbs
    Icons.jsx         # inline SVG icon set
  screens/
    HomeScreen.jsx    # dashboard: unified card, today/week stats, recent list
    AddScreen.jsx     # add/edit expense form (used for both via editing prop)
    WalletScreen.jsx  # wallet balance, top-ups, top-up history
    AllScreen.jsx     # all expenses with month switcher and filtering
    ReportsScreen.jsx # Recharts pie + bar + smart forecast vs budget
    SettingsScreen.jsx# settings (currency, lang, theme, reminder, week start, clear)
    GuideScreen.jsx   # 8-step onboarding / on-demand help overlay
```

When adding a new screen, follow the same pattern: create `src/screens/Foo.jsx`, add an entry to `SCREENS` in [constants.js](src/constants.js), import + render it conditionally in [App.jsx](src/App.jsx), and add an entry to [BottomNav.jsx](src/components/BottomNav.jsx) if it should appear in the nav.

### Screen routing

Routing is pure React state (`screen` ∈ `SCREENS` from [constants.js:17](src/constants.js#L17)) — there is no router library. Screens: `HOME`, `ADD`, `WALLET`, `ALL`, `REPORTS`, `SETTINGS`. The `GuideScreen` is an overlay (not in the screen enum) shown when `showOnboarding` or `guideOpen` is true.

A floating **FAB** (bottom-right, or bottom-left in RTL) is rendered in [App.jsx](src/App.jsx) on every screen except `ADD`, `SETTINGS`, and while the guide is open.

### State & persistence

All state lives in the root `App` component and is passed down as props. `commonProps = { theme, isDark, t, lang, curr }` is spread into every screen.

localStorage keys:

| Key | Purpose |
|---|---|
| `ct_expenses` | expense list |
| `ct_wallet_txns` | wallet top-up history |
| `ct_settings` | user settings (merged over defaults) |
| `ct_subcategories` | `{ [categoryId]: string[] }` user-defined subcategories |
| `ct_onboarded` | `true` once the first-run guide is dismissed |
| `iosHintDismissed` | iOS install banner dismissal (read in HomeScreen) |

`ls(key, fallback)` / `lsSet(key, val)` in [utils.js](src/utils.js) wrap reads/writes with JSON parsing.

**Expense shape:** `{ id, amount, category, subcategory?, note, date }` — `date` is `"YYYY-MM-DD"`.
**Wallet top-up shape:** `{ id, amount, note, date }`.
**Settings shape:** `{ currency, lang, theme, reminderTime, weekStart?, walletBalance?, monthlyBudget? }`.

**Wallet balance invariant:** `walletBalance` is maintained in `settings` as a running total. Adding/editing/deleting an expense or top-up must adjust `walletBalance` accordingly — see `saveExpense`, `deleteExpense`, `addTopUp`, `deleteTopUp` in [App.jsx:99-128](src/App.jsx#L99-L128). Any new mutation path touching expenses or top-ups must preserve this invariant.

### Styling

All styles are inline JavaScript objects — no CSS files, no CSS modules, no Tailwind. Theme tokens are `DARK` and `LIGHT` in [constants.js](src/constants.js); the active theme is passed to every component as `theme`. Always read colors from `theme.*`, never hardcode.

- [GlassCard.jsx](src/components/GlassCard.jsx) — glassmorphism card wrapper; `variant="wallet"` switches to the wallet gradient.
- [GlowBg.jsx](src/components/GlowBg.jsx) — animated aurora background orbs.
- Global keyframes (`fadeSlideIn`, `fabPulse`, `shimmer`) are declared once in [App.jsx](src/App.jsx) inside a `<style>` tag.

### i18n & RTL

All strings live in [src/i18n.js](src/i18n.js) (`T.en` / `T.ar`), imported as a default export. `T[lang].dir` drives `dir="ltr"` / `dir="rtl"` on the root. Arabic uses the "Cairo" font, English uses "Plus Jakarta Sans" / "DM Sans" — both loaded from Google Fonts at runtime in [App.jsx](src/App.jsx).

When adding user-facing copy, add **both** `en` and `ar` keys to `T`. Any layout that uses `left`/`right` or `marginLeft`/`marginRight` must branch on `lang === "ar"` — see the FAB positioning in [App.jsx:264](src/App.jsx#L264) for the pattern.

### PWA & notifications

[vite.config.js](vite.config.js) uses `vite-plugin-pwa` to generate the service worker and `manifest.webmanifest` at build time. Icons are in [public/icons/](public/icons/).

Daily reminders are scheduled **twice** in [App.jsx](src/App.jsx):
1. A `setTimeout` in the main thread (works while the app is open, re-schedules itself each fire).
2. A `SCHEDULE_NOTIFICATION` postMessage to the service worker via `navigator.serviceWorker.ready`. The SW script [public/sw-push.js](public/sw-push.js) prefers the `TimestampTrigger` (Notification Triggers API) for OS-level scheduling on Chrome — fires even when the browser is closed — and falls back to SW `setTimeout` elsewhere.

iOS install guide: a dismissible banner in [HomeScreen.jsx](src/screens/HomeScreen.jsx) detects iOS Safari not-installed and shows Share → Add to Home Screen instructions. [SettingsScreen.jsx](src/screens/SettingsScreen.jsx) shows an iOS 16.4+ note under "Enable reminders".

### Charts

[ReportsScreen.jsx](src/screens/ReportsScreen.jsx) uses **Recharts** for a category pie and a daily bar chart. No other charting library is used. It also computes a smart forecast (projected month total vs `settings.monthlyBudget`).

### Deployment

This repo auto-deploys to GitHub Pages on every push to `master` via GitHub Actions. Live URL: https://mohammed-khair-allahham.github.io/aurora-cash-tracker-source/. See [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) for Netlify / Vercel alternatives.
