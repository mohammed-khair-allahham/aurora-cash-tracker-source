# Aurora Cash Tracker — Deploy & Install Guide

## What's in your ZIP files

- **aurora-cash-tracker-deploy.zip** — the built app, ready to upload (no Node.js needed)
- **aurora-cash-tracker-source.zip** — full source code if you want to edit and rebuild

---

## Option A — Netlify (Easiest, Free, 2 minutes)

1. Go to https://netlify.com and sign up free
2. On your dashboard click **"Add new site" → "Deploy manually"**
3. Extract **aurora-cash-tracker-deploy.zip**
4. Drag the **`dist`** folder into Netlify's upload box
5. Netlify gives you a live URL like `https://amazing-name-123.netlify.app`
6. ✅ Done — open that URL on your Android phone

---

## Option B — Vercel (Also free, also 2 minutes)

1. Go to https://vercel.com and sign up free
2. Click **"Add New → Project"**
3. Choose **"Upload"** tab
4. Upload the **`dist`** folder contents
5. You get a URL like `https://your-app.vercel.app`

---

## Option C — GitHub Pages with Auto-Deploy (Free, permanent)

This repo is already configured for automatic GitHub Pages deployment via GitHub Actions.
Every push to `master` triggers a fresh build and deploys it automatically.

**One-time setup:**
1. Push this repo to GitHub (any repo name, e.g. `aurora-cash-tracker-source`)
2. Go to repo **Settings → Pages → Build and deployment → Source → "GitHub Actions"**
3. Your app is live at `https://yourusername.github.io/your-repo-name/` after the first push

> **Note:** The base path in `vite.config.js` is set to `/aurora-cash-tracker-source/` to match
> the repo name. If you use a different repo name, update that value in `vite.config.js`.

---

## Installing as PWA on Android

Once your app is live at any URL above:

1. Open **Chrome** on your Android phone
2. Navigate to your app URL
3. Wait 2–3 seconds for the page to load fully
4. Tap the **3-dot menu (⋮)** in Chrome
5. Tap **"Add to Home screen"** or **"Install app"**
6. Confirm — the app icon appears on your home screen
7. Tap it — it opens fullscreen like a native app ✅

---

## Installing as PWA on iPhone / iPad (iOS)

> Requires iOS 16.4+ for notification support. The app itself works on any iOS version.

1. Open **Safari** on your iPhone (must be Safari, not Chrome)
2. Navigate to your app URL
3. The app shows a banner: **"Tap ⬆ Share → Add to Home Screen to install"**
4. Tap the **Share button (⬆)** at the bottom of Safari
5. Scroll down and tap **"Add to Home Screen"**
6. Tap **"Add"** — the app icon appears on your home screen
7. Tap it — it opens fullscreen like a native app ✅

### After installing on iOS:
- Open the app from the home screen icon
- Go to **Settings (⚙️)** → tap **"Enable reminders"** to grant notification permission

---

## Enabling Daily Reminders

After installing the PWA (Android or iOS 16.4+):

1. Open the app → go to **Settings (⚙️)**
2. Tap **"Enable reminders"** and allow when prompted
3. Set your preferred reminder time (default 9 PM)
4. The app schedules a daily notification at that time

**How reminders work:**
- **Chrome (Android & desktop):** uses the Notification Triggers API — the OS schedules the notification at the exact time, so it fires even when Chrome is fully closed. Re-schedules automatically each day when you interact with (or dismiss) the notification; also re-schedules whenever you open the app.
- **While the app is open:** a JavaScript timer fires at exactly your set time (all browsers).
- **iOS background:** notification fires while the app is open or in recent memory. iOS does not support OS-level scheduled notifications in PWAs.

> **iOS note:** Notifications on iOS require the app to be installed to the Home Screen and iOS 16.4 or later. The app shows a note in Settings if your device doesn't support it yet.

---

## Custom Domain (optional)

On Netlify: Site settings → Domain management → Add custom domain
On Vercel: Project settings → Domains → Add

---

## Updating the App

**With GitHub Pages (CI/CD — recommended):**
1. Edit `src/App.jsx`
2. Commit and push to `master`
3. GitHub Actions builds and deploys automatically (~60–90 seconds)
4. The PWA auto-updates on users' phones within minutes

**With Netlify/Vercel:**
1. Edit `src/App.jsx`
2. Run `npm install --legacy-peer-deps` then `npm run build`
3. Re-upload the `dist/` folder
4. The PWA auto-updates on users' phones within minutes

