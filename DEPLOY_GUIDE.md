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

### What you get after installing:
- Fullscreen experience (no browser bar)
- Works offline (service worker caches everything)
- App icon on home screen
- Loads instantly on reopen
- Persists all your data in local storage

---

## Enabling Daily Reminders

After installing:
1. Open the app → go to **Settings (⚙️)**
2. Tap **"Enable Notifications"**
3. Allow when Android asks for permission
4. Set your preferred reminder time (default 9 PM)

> Note: For scheduled daily push notifications without a backend,
> you can use a free service like **OneSignal** (onesignal.com)
> and integrate it with a single script tag. Let me know if you want
> that added.

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

