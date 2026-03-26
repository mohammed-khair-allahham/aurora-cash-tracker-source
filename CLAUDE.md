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

### Intentional monolith

The entire application is `src/App.jsx` (~888 lines). This is by design — the file contains all screens, components, state, i18n translations, and theme tokens in one place. Do not split it into separate files unless explicitly asked.

### Screen routing

Routing is pure React state (`screen` ∈ `"home" | "add" | "reports" | "settings"`). There is no router library. The four screens are top-level functional components defined in App.jsx: `HomeScreen`, `AddScreen`, `ReportsScreen`, `SettingsScreen`.

### State & persistence

All state lives in the root `App` component and is passed down as props:

- `expenses[]` — persisted to `localStorage` key `ct_expenses`
- `settings{}` — persisted to `localStorage` key `ct_settings`

Helper functions `ls(key)` and `lsSet(key, value)` wrap localStorage reads/writes with JSON parsing.

**Expense shape:** `{ id, amount, category, note, date }` where `date` is `"YYYY-MM-DD"`.
**Settings shape:** `{ currency, lang, theme, reminderTime }`.

### Styling

All styles are inline JavaScript objects — there are no CSS files or CSS modules. Theme tokens are defined as `DARK` and `LIGHT` objects near the top of App.jsx. The active theme object is passed to every screen component and used for all color values.

The glassmorphism card effect is encapsulated in the `GlassCard` component. Background orbs are `GlowBg`.

### i18n & RTL

A single `T` translation object at the top of App.jsx holds all English and Arabic strings. Language selection (`lang: "en" | "ar"`) drives both the rendered strings and `dir="rtl"` / `dir="ltr"` on the root element. Arabic uses the "Cairo" font; English uses "Plus Jakarta Sans" / "DM Sans" — both loaded from Google Fonts at runtime.

### PWA

`vite.config.js` uses `vite-plugin-pwa` to auto-generate the service worker and `manifest.webmanifest` at build time. The built PWA artifacts end up in `/dist`. Icons are in `public/icons/`.

### Charts

`ReportsScreen` uses **Recharts** for a pie chart (category breakdown) and a bar chart (daily spending). No other charting library is used.
