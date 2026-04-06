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

export default function App() {
  const [screen,    setScreen]    = useState(SCREENS.HOME);
  const [expenses,  setExpenses]  = useState(() => ls("ct_expenses", []));
  const [walletTxns, setWalletTxns] = useState(() => ls("ct_wallet_txns", []));
  const [settings,  setSettings]  = useState(() => ({
    currency: "SYP", lang: "ar",
    theme: window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    reminderTime: "21:00",
    ...ls("ct_settings", {}),
  }));
  const [editingId, setEditingId] = useState(null);
  const [subcategories, setSubcategories] = useState(() => ls("ct_subcategories", {}));
  const [notif,     setNotif]     = useState(
    typeof Notification !== "undefined" && Notification.permission === "granted"
  );

  const lang   = settings.lang;
  const t      = T[lang];
  const isDark = settings.theme === "dark";
  const theme  = isDark ? DARK : LIGHT;
  const curr   = CURRENCIES.find(c => c.code === settings.currency) || CURRENCIES[0];

  useEffect(() => { lsSet("ct_expenses", expenses); }, [expenses]);
  useEffect(() => { lsSet("ct_settings", settings); }, [settings]);
  useEffect(() => { lsSet("ct_subcategories", subcategories); }, [subcategories]);
  useEffect(() => { lsSet("ct_wallet_txns", walletTxns); }, [walletTxns]);

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

  const addSubcategory = (categoryId, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSubcategories(prev => {
      const list = prev[categoryId] || [];
      if (list.includes(trimmed)) return prev;
      return { ...prev, [categoryId]: [...list, trimmed] };
    });
  };

  const saveExpense = (exp) => {
    if (editingId) {
      const oldExp = expenses.find(e => e.id === editingId);
      const diff = Number(exp.amount) - Number(oldExp?.amount || 0);
      setSettings(s => ({ ...s, walletBalance: (s.walletBalance || 0) - diff }));
      setExpenses(p => p.map(e => e.id === editingId ? { ...exp, id: editingId } : e));
      setEditingId(null);
    } else {
      setSettings(s => ({ ...s, walletBalance: (s.walletBalance || 0) - Number(exp.amount) }));
      setExpenses(p => [{ ...exp, id: Date.now().toString() }, ...p]);
    }
    setScreen(SCREENS.HOME);
  };

  const deleteExpense = (id) => {
    const exp = expenses.find(e => e.id === id);
    if (exp) setSettings(s => ({ ...s, walletBalance: (s.walletBalance || 0) + Number(exp.amount) }));
    setExpenses(p => p.filter(e => e.id !== id));
  };

  const addTopUp = (txn) => {
    setWalletTxns(prev => [{ ...txn, id: Date.now().toString() }, ...prev]);
    setSettings(s => ({ ...s, walletBalance: (s.walletBalance || 0) + Number(txn.amount) }));
  };

  const deleteTopUp = (id) => {
    const txn = walletTxns.find(t => t.id === id);
    if (txn) setSettings(s => ({ ...s, walletBalance: (s.walletBalance || 0) - Number(txn.amount) }));
    setWalletTxns(prev => prev.filter(t => t.id !== id));
  };

  const startEdit = (exp) => {
    setEditingId(exp.id);
    setScreen(SCREENS.ADD);
  };

  // Clear editingId when navigating to ADD via the nav bar (not via startEdit)
  const handleNavigate = (id) => {
    if (id === SCREENS.ADD) setEditingId(null);
    setScreen(id);
  };

  const editingExp = editingId ? expenses.find(e => e.id === editingId) : null;
  const commonProps = { theme, isDark, t, lang, curr };

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
            notif={notif}
            onRequestNotif={requestNotif}
            onEdit={startEdit}
            onDelete={deleteExpense}
          />
        )}
        {screen === SCREENS.ADD && (
          <AddScreen
            {...commonProps}
            editing={editingExp}
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
            onTopUp={addTopUp}
            onDeleteTopUp={deleteTopUp}
            onSettingsChange={setSettings}
          />
        )}
        {screen === SCREENS.ALL && (
          <AllScreen
            {...commonProps}
            expenses={expenses}
            onEdit={startEdit}
            onDelete={deleteExpense}
          />
        )}
        {screen === SCREENS.REPORTS && (
          <ReportsScreen
            {...commonProps}
            settings={settings}
            expenses={expenses}
          />
        )}
        {screen === SCREENS.SETTINGS && (
          <SettingsScreen
            {...commonProps}
            settings={settings}
            onChange={setSettings}
            notif={notif}
            onRequestNotif={requestNotif}
            onClear={() => { setExpenses([]); setWalletTxns([]); }}
            onOpenGuide={() => setScreen(SCREENS.GUIDE)}
          />
        )}
        {screen === SCREENS.GUIDE && (
          <GuideScreen
            {...commonProps}
            onBack={() => setScreen(SCREENS.SETTINGS)}
          />
        )}
      </div>

      {/* FAB */}
      {screen !== SCREENS.ADD && screen !== SCREENS.SETTINGS && screen !== SCREENS.GUIDE && (
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

      {screen !== SCREENS.GUIDE && (
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
