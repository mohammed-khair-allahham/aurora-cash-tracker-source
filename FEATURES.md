# Aurora Cash Tracker — All Features

A complete catalogue of features implemented in Aurora Cash Tracker, a zero-backend PWA for personal expense tracking. All data lives in `localStorage`; there are no API calls or accounts.

Live: https://mohammed-khair-allahham.github.io/aurora-cash-tracker-source/

---

## 1. Home Screen (Dashboard)

- **Unified dashboard card** — wallet balance, monthly budget, and budget utilization on a single glass card.
- **Balance display** — large number, turns red when negative.
- **Monthly budget tracking** — shows remaining amount or over-budget delta, color-coded.
- **Animated circular progress ring** — budget utilization %, color shifts on over-budget.
- **Today's totals** — total spent today + count of today's transactions.
- **Today's category chips** — one pill per category used today, with emoji + amount.
- **Today's transactions list** — tap a row to expand and reveal Edit / Delete actions.
- **Wallet switcher** — cyclic tap-to-switch button on the header when more than one wallet exists.
- **iOS install hint banner** — dismissible banner instructing Safari users to use "Share → Add to Home Screen".
- **Notifications banner** — clickable banner prompting the user to enable daily reminders.
- **Empty state** — friendly icon + copy when no transactions exist today.

## 2. Add / Edit Expense Screen

- **Unified add + edit** — same form is reused for both flows via an `editing` prop.
- **Amount input** — large numeric input with live currency symbol, decimal validation, and animated focus underline.
- **Stepper buttons** — `−10` / `+10` shortcuts to nudge the amount.
- **Category picker** — 4-column grid of emoji + label, active state highlighted.
- **Subcategory support** — per-category custom sub-tags; pill selector, inline add with `+` button and Enter-to-submit.
- **Note field** — optional freeform text.
- **Date picker** — native HTML date input (defaults to today).
- **Wallet selector** — pills that appear only when multiple wallets exist.
- **Validation** — Save button disabled until amount > 0.
- **Edit-aware title and CTA** — header and button text switch between Add and Edit.
- **Sticky footer** — Save / Cancel bar with safe-area inset padding.

## 3. Wallet Screen (Multi-Wallet + Top-Ups)

- **Multiple wallets** — create, switch, and delete wallets; each has its own name, currency, balance, and budget.
- **Horizontal wallet picker** — scrollable pills with checkmark on the active wallet.
- **Add wallet form** — inline form with name input and currency selector.
- **Set active wallet** — makes the selected wallet the default target for new expenses.
- **Delete wallet** — disabled (with explanation) while the wallet has any expenses or top-ups; also blocked when only one wallet remains.
- **Wallet summary cards** — total top-ups (green) and total expenses (red) for the selected wallet.
- **Per-wallet monthly budget** — editable inline; drives the forecast and progress ring elsewhere.
- **Top-up form** — amount + optional note; collapsible with toggle.
- **Top-up history list** — grouped per wallet, newest first, with date label (Today / Yesterday / formatted).
- **Delete top-up** — expandable row action; balance is auto-adjusted.
- **Wallet balance invariant** — every expense, edit, delete, top-up, and top-up delete adjusts the correct wallet's balance.

## 4. All Expenses Screen

- **Month switcher** — previous/next arrows with RTL-aware direction; next disabled on the current month.
- **Month header** — current month + year, total, and transaction count.
- **Wallet filter pills** — "All" + one pill per wallet (shown only when >1 wallet).
- **Date-grouped list** — expenses grouped under Today / Yesterday / formatted date headers with daily totals.
- **Expandable rows** — tap to reveal Edit / Delete.
- **Category + subcategory display** — emoji icon box, note (or category name), subcategory badge.
- **Per-expense currency** — amount is formatted using each expense's wallet currency.
- **Auto-sort** — by date (newest first), then ID.
- **Empty state** — when no expenses exist for the selected month + wallet.

## 5. Reports Screen

- **Month navigator** — previous/next with month + year.
- **Wallet filter** — scoped reports per wallet or across all wallets.
- **Monthly total card** — total spent + transaction count, plus remaining/over-budget indicator when a budget is set.
- **This week card** — week total + date range label, using the configured week-start day.
- **Smart forecast** (current month only):
  - Projected month total = daily average × days in month.
  - Daily average = spent / days elapsed.
  - Animated budget progress bar with ✅ / ⚠️ status.
  - "On track" vs "Will exceed by X" messaging.
  - "Days remaining" badge.
- **Category donut chart** — Recharts pie with total in the center and a legend showing top 5 categories (emoji, label, %, amount).
- **Daily bar chart** — Recharts responsive bar with rounded tops and hover tooltip.
- **Top Spend Days** — ranked list of the 5 highest-spending days with a relative-width bar and numbered badges.
- **Configurable week start** — Sat / Sun / Mon, honored in the weekly aggregation.

## 6. Settings Screen

- **Language** — English ↔ العربية toggle.
- **Theme** — Dark ↔ Light toggle with moon/sun icon.
- **Week start** — Saturday / Sunday / Monday.
- **Daily reminder**:
  - Enable via permission request.
  - Native time picker when enabled.
  - iOS 16.4+ note for install-required platforms.
- **PIN lock** (Security section):
  - Enable, change, disable flows — each requires verification of the current PIN where applicable.
  - 6-digit numeric PIN, visual dot indicator, error feedback, success checkmark.
  - SHA-256 hashing of the PIN before storage; plaintext is never persisted.
  - Warning that a forgotten PIN means data reset.
- **Data export** — downloads a versioned JSON backup of expenses, top-ups, settings, subcategories, and wallets.
- **Data import** — reads a JSON backup file, validates the version + shape, and replaces current data after confirmation.
- **Guide launcher** — reopens the onboarding guide on demand.
- **Clear data** — destructive action with an inline confirmation modal.
- **Version footer** — v2.0 + "All data stored locally on your device".

## 7. Guide / Onboarding Screen

- **First-run onboarding** — shown automatically until dismissed (`ct_onboarded` flag).
- **On-demand guide** — re-openable from Settings.
- **8 steps** — covers wallets, adding expenses, home dashboard, all-expenses view, reports, settings, reminders, and PIN lock.
- **Progress dots** — animated active dot (wider), clickable to jump to any step.
- **Prev / Next / Finish** — keyboard/tap navigation through the flow.
- **Skip** — available during first-run onboarding.
- **Close (×)** — available when reopened post-onboarding.
- **Step-by-step animation** — slide-in transition between steps.

## 8. Lock Screen (PIN Protection)

- **Automatic lock** — PIN prompt appears when the PIN is enabled and the app is reopened.
- **Auto re-lock on background** — listens on `visibilitychange`; re-locks whenever the app goes hidden.
- **6-digit PIN entry** — dot indicators + on-screen numpad (3×4 grid with backspace).
- **Auto-submit on 6th digit** — no "OK" button needed.
- **Shake animation + red dots** on wrong PIN; auto-clears for retry.
- **Reset App link** — destructive fallback when the PIN is forgotten, with confirm/cancel dialog; wipes all `localStorage` keys and reloads.

---

## Cross-Cutting Features

### PWA & Installation
- **Service worker** via `vite-plugin-pwa` with Workbox.
- **Web manifest** with standalone display, theme color, SVG + 192/512 PNG icons (including maskable).
- **Auto-update** registration so users always get the latest build.
- **Offline shell** — static assets (JS/CSS/HTML/PNG/SVG/WOFF2) precached.
- **Google Fonts caching** — `CacheFirst` for `fonts.googleapis.com` and `fonts.gstatic.com` with 1-year expiration.
- **iOS install guide** — dismissible banner + Settings hint specific to iOS Safari.

### Daily Reminders / Notifications
- **Dual scheduling strategy** — `setTimeout` in the main thread and a `SCHEDULE_NOTIFICATION` postMessage to the service worker.
- **OS-level Notification Triggers** (Chrome) — `TimestampTrigger` fires reminders even when the browser is closed.
- **Fallback SW `setTimeout`** on browsers without Notification Triggers.
- **Self-rescheduling** — after each fire, the next day's reminder is rescheduled.
- **Customizable time** — HH:MM picker in settings.
- **Tag-based dedup** — at most one pending reminder at a time.

### Multi-Wallet Data Model
- **One-time migration** from the legacy single-wallet model on first load; backfills `walletId` on existing expenses and top-ups.
- **Per-wallet currency** — SYP and USD supported.
- **Per-wallet budget** — replaces the old global `monthlyBudget` setting.
- **Active wallet pointer** — stored in `settings.activeWalletId`.

### Internationalization & RTL
- **English + Arabic** — all strings live in `src/i18n.js`.
- **Automatic RTL layout** — `dir="rtl"` on the root in Arabic; FAB, icons, month arrows, and margins all branch on `lang === "ar"`.
- **Locale-aware fonts** — Cairo for Arabic, Plus Jakarta Sans / DM Sans for English, loaded from Google Fonts at runtime.

### Theming
- **Dark (default) and Light** — full token set in `constants.js` (background, surfaces, accents, borders, progress ring, FAB glow, etc.).
- **System preference detection** — initial theme defaults to `prefers-color-scheme`.
- **Smooth theme transition** — 0.4s CSS transition on root background/color.
- **Inline styles only** — no CSS files, no Tailwind; colors always read from `theme.*`.

### Security
- **SHA-256 PIN hashing** via the Web Crypto API.
- **Re-lock on background** (see Lock Screen above).
- **Reset as recovery** — losing the PIN requires wiping all data; hash is never recoverable.

### Data Portability
- **JSON export** — versioned payload (currently v1.1) with timestamped filename (`aurora-backup-YYYY-MM-DD.json`).
- **JSON import** — validates version + required keys; replaces all in-memory and persisted state atomically; success/error toast.

### Persistence Keys (`localStorage`)
| Key | Purpose |
|---|---|
| `ct_expenses` | expense list |
| `ct_wallets` | wallets array |
| `ct_wallet_txns` | top-up history |
| `ct_settings` | user settings (language, theme, reminder time, week start, active wallet) |
| `ct_subcategories` | `{ [categoryId]: string[] }` |
| `ct_pin` | `{ enabled, hash }` |
| `ct_onboarded` | first-run dismissal flag |
| `iosHintDismissed` | iOS install banner dismissal |

### UX & Micro-Interactions
- **Global keyframes** — `fadeSlideIn`, `fabPulse`, `shimmer`, `shake`.
- **Screen transition** — fade-slide animation on every screen change (keyed on the `screen` state).
- **Expandable rows** — max-height + opacity transitions on Home / All / Wallet lists.
- **Animated progress bars and rings** — budget visualizations across Home and Reports.
- **Focus underline** on the amount input.
- **Safe-area inset awareness** — padding honors mobile notches and home indicators.
- **Hidden scrollbars** on horizontal scrollers (pills/chips).

### Floating Action Button (FAB)
- **Global quick-add** — always visible except on Add, Settings, and while the guide overlay is open.
- **RTL-aware positioning** — bottom-left in Arabic, bottom-right in English; respects the 430px max-width centered layout.

### Bottom Navigation
- **5 tabs** — Home, Wallet, All, Reports, Settings.
- **Hidden on Add** and during onboarding for focus.
- **Active indicator** — accent-colored pill with icon + label.

### Deployment
- **GitHub Pages** auto-deploy on every push to `master` via GitHub Actions.
- Alternative guides for Netlify / Vercel in `DEPLOY_GUIDE.md`.

---

## Data Shapes

```js
// Expense
{ id, amount, category, subcategory?, note, date, walletId }     // date: "YYYY-MM-DD"

// Wallet top-up
{ id, amount, note, date, walletId }

// Wallet
{ id, name, currency, balance, budget }

// Settings
{ lang, theme, reminderTime, weekStart?, activeWalletId? }
```

## Screens Enum

`HOME` · `ADD` · `WALLET` · `ALL` · `REPORTS` · `SETTINGS` (+ `GuideScreen` and `LockScreen` as overlays, not in the enum).
