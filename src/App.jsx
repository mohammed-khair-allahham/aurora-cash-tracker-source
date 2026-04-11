import { useState, useEffect, useRef } from "react";
import T from "./i18n";
import { SCREENS, CURRENCIES, DARK, LIGHT } from "./constants";
import { ls, lsSet } from "./utils";
import BottomNav from "./components/BottomNav";
import { IconPlus } from "./components/Icons";
import HomeScreen from "./screens/HomeScreen";
import AddScreen from "./screens/AddScreen";
import WalletScreen from "./screens/WalletScreen";
import ReportsScreen from "./screens/ReportsScreen";
import AllScreen from "./screens/AllScreen";
import SettingsScreen from "./screens/SettingsScreen";
import GuideScreen from "./screens/GuideScreen";
import LockScreen from "./screens/LockScreen";

async function hashPin(pin) {
  const data = new TextEncoder().encode(pin);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function App() {
  const [screen,    setScreen]    = useState(SCREENS.HOME);

  // ── Multi-wallet migration (runs once in initializer, before other state) ──
  const [wallets, setWallets] = useState(() => {
    if (ls("ct_wallets", null) === null) {
      const saved = ls("ct_settings", {});
      const defaultWallet = {
        id: "w1",
        name: saved.lang === "ar" ? "المحفظة الرئيسية" : "Main Wallet",
        currency: saved.currency || "SYP",
        balance: saved.walletBalance || 0,
      };
      // Backfill walletId on existing data
      lsSet("ct_expenses", (ls("ct_expenses", []) || []).map(e => e.walletId ? e : { ...e, walletId: "w1" }));
      lsSet("ct_wallet_txns", (ls("ct_wallet_txns", []) || []).map(t => t.walletId ? t : { ...t, walletId: "w1" }));
      // Strip old single-wallet fields from settings
      const { walletBalance: _wb, currency: _c, ...clean } = saved;
      lsSet("ct_settings", { ...clean, activeWalletId: "w1" });
      lsSet("ct_wallets", [defaultWallet]);
      return [defaultWallet];
    }
    return ls("ct_wallets", []);
  });

  const [expenses,  setExpenses]  = useState(() => ls("ct_expenses", []));
  const [walletTxns, setWalletTxns] = useState(() => ls("ct_wallet_txns", []));
  const [settings,  setSettings]  = useState(() => ({
    lang: "ar",
    theme: window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    reminderTime: "21:00",
    ...ls("ct_settings", {}),
  }));
  const [editingId, setEditingId] = useState(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !ls("ct_onboarded", false));
  const [subcategories, setSubcategories] = useState(() => ls("ct_subcategories", {}));
  const [notif,     setNotif]     = useState(
    typeof Notification !== "undefined" && Notification.permission === "granted"
  );

  // ── PIN lock ──
  const [isUnlocked, setIsUnlocked] = useState(() => !ls("ct_pin", {}).enabled);

  const lang   = settings.lang;
  const t      = T[lang];
  const isDark = settings.theme === "dark";
  const theme  = isDark ? DARK : LIGHT;

  // curr is derived from the active wallet's currency
  const activeWallet = wallets.find(w => w.id === settings.activeWalletId) || wallets[0];
  const curr = CURRENCIES.find(c => c.code === activeWallet?.currency) || CURRENCIES[0];

  // ── Persistence ──
  useEffect(() => { lsSet("ct_expenses", expenses); }, [expenses]);
  useEffect(() => { lsSet("ct_settings", settings); }, [settings]);
  useEffect(() => { lsSet("ct_subcategories", subcategories); }, [subcategories]);
  useEffect(() => { lsSet("ct_wallet_txns", walletTxns); }, [walletTxns]);
  useEffect(() => { lsSet("ct_wallets", wallets); }, [wallets]);

  // ── Re-lock when app goes to background ──
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden" && ls("ct_pin", {}).enabled) {
        setIsUnlocked(false);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // ── Notifications ──
  const notifTimerRef = useRef(null);
  useEffect(() => {
    clearTimeout(notifTimerRef.current);
    if (!notif) return;
    const schedule = () => {
      const [h, m] = settings.reminderTime.split(':').map(Number);
      const now = new Date();
      const next = new Date();
      next.setHours(h, m, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      notifTimerRef.current = setTimeout(() => {
        new Notification('💰 ' + t.appName, {
          body: t.reminderHint,
          icon: import.meta.env.BASE_URL + 'icons/icon-192.png',
        });
        schedule();
      }, next - now);
    };
    schedule();
    return () => clearTimeout(notifTimerRef.current);
  }, [notif, settings.reminderTime]);

  useEffect(() => {
    if (!notif) return;
    navigator.serviceWorker?.ready.then(reg => {
      reg.active?.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        time: settings.reminderTime,
        title: '💰 ' + t.appName,
        body: t.reminderHint,
        icon: import.meta.env.BASE_URL + 'icons/icon-192.png',
      });
    });
  }, [notif, settings.reminderTime]);

  const requestNotif = async () => {
    if ("Notification" in window) {
      const p = await Notification.requestPermission();
      if (p === "granted") {
        setNotif(true);
        new Notification("💰 " + t.appName, { body: t.reminderHint });
      }
    }
  };

  // ── Subcategory ──
  const addSubcategory = (categoryId, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSubcategories(prev => {
      const list = prev[categoryId] || [];
      if (list.includes(trimmed)) return prev;
      return { ...prev, [categoryId]: [...list, trimmed] };
    });
  };

  // ── Wallet balance helper ──
  const adjustBalance = (walletId, delta) => {
    setWallets(prev => prev.map(w =>
      w.id === walletId ? { ...w, balance: (w.balance || 0) + delta } : w
    ));
  };

  // ── Expense handlers ──
  const saveExpense = (exp) => {
    if (editingId) {
      const oldExp = expenses.find(e => e.id === editingId);
      if (oldExp) {
        const oldWalletId = oldExp.walletId || wallets[0]?.id;
        const newWalletId = exp.walletId;
        const oldAmt = Number(oldExp.amount);
        const newAmt = Number(exp.amount);
        setWallets(prev => prev.map(w => {
          if (w.id === oldWalletId && w.id === newWalletId) {
            return { ...w, balance: (w.balance || 0) + oldAmt - newAmt };
          }
          if (w.id === oldWalletId) return { ...w, balance: (w.balance || 0) + oldAmt };
          if (w.id === newWalletId) return { ...w, balance: (w.balance || 0) - newAmt };
          return w;
        }));
      }
      setExpenses(p => p.map(e => e.id === editingId ? { ...exp, id: editingId } : e));
      setEditingId(null);
    } else {
      adjustBalance(exp.walletId, -Number(exp.amount));
      setExpenses(p => [{ ...exp, id: Date.now().toString() }, ...p]);
    }
    setScreen(SCREENS.HOME);
  };

  const deleteExpense = (id) => {
    const exp = expenses.find(e => e.id === id);
    if (exp) adjustBalance(exp.walletId || wallets[0]?.id, Number(exp.amount));
    setExpenses(p => p.filter(e => e.id !== id));
  };

  // ── Top-up handlers ──
  const addTopUp = (txn) => {
    setWalletTxns(prev => [{ ...txn, id: Date.now().toString() }, ...prev]);
    adjustBalance(txn.walletId, Number(txn.amount));
  };

  const deleteTopUp = (id) => {
    const txn = walletTxns.find(t => t.id === id);
    if (txn) adjustBalance(txn.walletId || wallets[0]?.id, -Number(txn.amount));
    setWalletTxns(prev => prev.filter(t => t.id !== id));
  };

  // ── Wallet management ──
  const addWallet = (name, currency) => {
    const id = "w" + Date.now();
    setWallets(prev => [...prev, { id, name: name.trim(), currency, balance: 0 }]);
  };

  const deleteWallet = (id) => {
    const hasData = expenses.some(e => e.walletId === id) || walletTxns.some(t => t.walletId === id);
    if (hasData || wallets.length <= 1) return;
    setWallets(prev => {
      const remaining = prev.filter(w => w.id !== id);
      if (settings.activeWalletId === id) {
        setSettings(s => ({ ...s, activeWalletId: remaining[0]?.id }));
      }
      return remaining;
    });
  };

  const setActiveWallet = (id) => {
    setSettings(s => ({ ...s, activeWalletId: id }));
  };

  // ── Navigation ──
  const startEdit = (exp) => {
    setEditingId(exp.id);
    setScreen(SCREENS.ADD);
  };

  const handleNavigate = (id) => {
    if (id === SCREENS.ADD) setEditingId(null);
    setScreen(id);
  };

  // ── PIN lock handlers ──
  const unlockApp = async (pin) => {
    const pinData = ls("ct_pin", {});
    if (!pinData.hash) return false;
    const hash = await hashPin(pin);
    if (hash === pinData.hash) { setIsUnlocked(true); return true; }
    return false;
  };

  const savePin = async (pin) => {
    const hash = await hashPin(pin);
    lsSet("ct_pin", { enabled: true, hash });
  };

  const disablePin = () => {
    lsSet("ct_pin", { enabled: false, hash: "" });
  };

  const resetApp = () => {
    ["ct_expenses","ct_wallet_txns","ct_settings","ct_subcategories","ct_wallets","ct_onboarded","ct_pin","iosHintDismissed"]
      .forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  // ── Export / Import ──
  const handleExport = () => {
    const payload = {
      version: "1.1",
      exportedAt: new Date().toISOString(),
      data: { expenses, walletTxns, settings, subcategories, wallets },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aurora-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (file, onSuccess, onError) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const payload = JSON.parse(e.target.result);
        if (!payload.version || !payload.data?.expenses || !payload.data?.wallets) {
          throw new Error("Invalid format");
        }
        const { expenses: ie, walletTxns: iwt, settings: is, subcategories: isc, wallets: iw } = payload.data;
        const newExpenses = ie || [];
        const newTxns = iwt || [];
        const newWallets = iw || [];
        const newSubs = isc || {};
        const newSettings = { lang, theme: settings.theme, reminderTime: settings.reminderTime, ...is };
        setExpenses(newExpenses);
        setWalletTxns(newTxns);
        setWallets(newWallets);
        setSubcategories(newSubs);
        setSettings(newSettings);
        lsSet("ct_expenses", newExpenses);
        lsSet("ct_wallet_txns", newTxns);
        lsSet("ct_wallets", newWallets);
        lsSet("ct_subcategories", newSubs);
        lsSet("ct_settings", newSettings);
        onSuccess?.();
      } catch {
        onError?.();
      }
    };
    reader.onerror = () => onError?.();
    reader.readAsText(file);
  };

  const editingExp = editingId ? expenses.find(e => e.id === editingId) : null;
  const commonProps = { theme, isDark, t, lang, curr };

  // ── Lock screen ──
  if (!isUnlocked) {
    return (
      <div dir={t.dir} style={{
        fontFamily: lang === "ar"
          ? "'Cairo', 'Noto Sans Arabic', sans-serif"
          : "'Plus Jakarta Sans', 'DM Sans', sans-serif",
        background: theme.bg, minHeight: "100vh", maxWidth: 430,
        margin: "0 auto", color: theme.text,
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes shake {
            0%,100%{transform:translateX(0)}
            20%,60%{transform:translateX(-8px)}
            40%,80%{transform:translateX(8px)}
          }
        `}</style>
        <LockScreen
          {...commonProps}
          onUnlock={unlockApp}
          onReset={resetApp}
        />
      </div>
    );
  }

  return (
    <div dir={t.dir} style={{
      fontFamily: lang === "ar"
        ? "'Cairo', 'Noto Sans Arabic', sans-serif"
        : "'Plus Jakarta Sans', 'DM Sans', sans-serif",
      background: theme.bg,
      minHeight: "100vh",
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
      color: theme.text,
      display: "flex",
      flexDirection: "column",
      transition: "background 0.4s, color 0.4s",
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* Global keyframes */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fabPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%,60%{transform:translateX(-8px)}
          40%,80%{transform:translateX(8px)}
        }
      `}</style>

      {/* Screen content with fade-slide transition */}
      <div key={screen} style={{
        flex: 1, overflow: "hidden",
        display: "flex", flexDirection: "column",
        animation: "fadeSlideIn 0.25s ease-out",
      }}>
        {screen === SCREENS.HOME && (
          <HomeScreen
            {...commonProps}
            settings={settings}
            expenses={expenses}
            wallets={wallets}
            notif={notif}
            onRequestNotif={requestNotif}
            onEdit={startEdit}
            onDelete={deleteExpense}
            onSetActiveWallet={setActiveWallet}
          />
        )}
        {screen === SCREENS.ADD && (
          <AddScreen
            {...commonProps}
            editing={editingExp}
            wallets={wallets}
            activeWalletId={settings.activeWalletId || wallets[0]?.id}
            onSave={saveExpense}
            onCancel={() => { setEditingId(null); setScreen(SCREENS.HOME); }}
            subcategories={subcategories}
            onAddSubcategory={addSubcategory}
          />
        )}
        {screen === SCREENS.WALLET && (
          <WalletScreen
            {...commonProps}
            settings={settings}
            expenses={expenses}
            walletTxns={walletTxns}
            wallets={wallets}
            onTopUp={addTopUp}
            onDeleteTopUp={deleteTopUp}
            onAddWallet={addWallet}
            onDeleteWallet={deleteWallet}
            onSetActiveWallet={setActiveWallet}
            onSettingsChange={setSettings}
          />
        )}
        {screen === SCREENS.ALL && (
          <AllScreen
            {...commonProps}
            expenses={expenses}
            wallets={wallets}
            onEdit={startEdit}
            onDelete={deleteExpense}
          />
        )}
        {screen === SCREENS.REPORTS && (
          <ReportsScreen
            {...commonProps}
            settings={settings}
            expenses={expenses}
            wallets={wallets}
          />
        )}
        {screen === SCREENS.SETTINGS && (
          <SettingsScreen
            {...commonProps}
            settings={settings}
            onChange={setSettings}
            notif={notif}
            onRequestNotif={requestNotif}
            onClear={() => { setExpenses([]); setWalletTxns([]); setWallets([]); }}
            onOpenGuide={() => setGuideOpen(true)}
            onSavePin={savePin}
            onDisablePin={disablePin}
            onExport={handleExport}
            onImport={handleImport}
          />
        )}
      </div>

      {/* Guide overlay */}
      {(showOnboarding || guideOpen) && (
        <GuideScreen
          {...commonProps}
          onboarding={showOnboarding}
          onBack={() => setGuideOpen(false)}
          onFinish={() => {
            if (showOnboarding) { lsSet("ct_onboarded", true); setShowOnboarding(false); }
            setGuideOpen(false);
          }}
        />
      )}

      {/* FAB */}
      {!showOnboarding && !guideOpen && screen !== SCREENS.ADD && screen !== SCREENS.SETTINGS && (
        <button onClick={() => handleNavigate(SCREENS.ADD)} style={{
          position: "fixed",
          bottom: 90,
          [lang === "ar" ? "left" : "right"]: "max(16px, calc(50vw - 215px + 16px))",
          width: 60, height: 60, borderRadius: "50%",
          background: theme.btnGrad,
          border: "2px solid rgba(255,255,255,0.15)",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: theme.fabGlow,
          zIndex: 201,
          animation: "fabPulse 3s ease-in-out infinite",
          transition: "box-shadow 0.3s",
        }}>
          <IconPlus size={26} color="#fff" style={{ strokeWidth: 2.5 }} />
        </button>
      )}

      {!showOnboarding && screen !== SCREENS.ADD && (
        <BottomNav
          screen={screen}
          onNavigate={handleNavigate}
          theme={theme}
          t={t}
        />
      )}
    </div>
  );
}
