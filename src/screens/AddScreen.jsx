import { useState } from "react";
import GlassCard from "../components/GlassCard";
import { IconChevronLeft, IconChevronRight } from "../components/Icons";
import { CATEGORIES, CURRENCIES } from "../constants";
import { todayStr } from "../utils";

export default function AddScreen({ theme, isDark, t, lang, curr, editing, wallets, activeWalletId, onSave, onCancel, subcategories, onAddSubcategory }) {
  const [amount,      setAmount]      = useState(editing?.amount?.toString() || "");
  const [category,    setCategory]    = useState(editing?.category || "food");
  const [subcategory, setSubcategory] = useState(editing?.subcategory || "");
  const [note,        setNote]        = useState(editing?.note || "");
  const [date,        setDate]        = useState(editing?.date || todayStr());
  const [newSubInput, setNewSubInput] = useState("");
  const [amountFocused, setAmountFocused] = useState(false);
  const [walletId,    setWalletId]    = useState(editing?.walletId || activeWalletId || wallets[0]?.id);

  const selectedWallet = wallets.find(w => w.id === walletId) || wallets[0];
  const activeCurr = CURRENCIES.find(c => c.code === selectedWallet?.currency) || curr;

  const valid = amount && !isNaN(Number(amount)) && Number(amount) > 0;
  const selColor = theme.accent1;
  const catSubs = subcategories[category] || [];

  const handleCategoryChange = (catId) => {
    setCategory(catId);
    if (subcategory && !(subcategories[catId] || []).includes(subcategory)) {
      setSubcategory("");
    }
  };

  const handleAddSub = () => {
    const trimmed = newSubInput.trim();
    if (!trimmed) return;
    onAddSubcategory(category, trimmed);
    setSubcategory(trimmed);
    setNewSubInput("");
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: theme.inputBg,
    border: `1px solid ${theme.inputBorder}`,
    borderRadius: 14, padding: "14px 16px",
    color: theme.text, fontSize: 15,
    fontFamily: "inherit", outline: "none",
    transition: "border-color 0.2s",
  };

  const BackIcon = lang === "ar" ? IconChevronRight : IconChevronLeft;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "52px 20px 100px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <button onClick={onCancel} style={{
            background: theme.surface, border: `1px solid ${theme.border}`,
            borderRadius: 12, color: theme.text, padding: "9px 12px",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BackIcon size={18} color={theme.text} />
          </button>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: theme.text }}>
            {editing ? t.editExpense : t.addExpense}
          </h2>
        </div>

        {/* Wallet picker */}
        {wallets.length > 1 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
              {t.wallet}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {wallets.map(w => {
                const wCurr = CURRENCIES.find(c => c.code === w.currency);
                const active = walletId === w.id;
                return (
                  <button key={w.id} onClick={() => setWalletId(w.id)} style={{
                    padding: "9px 16px", borderRadius: 20,
                    background: active ? theme.accent1 : theme.surface,
                    border: `1px solid ${active ? theme.accent1 : theme.border}`,
                    color: active ? "#fff" : theme.textSub,
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    fontFamily: "inherit",
                  }}>
                    {w.name} · {wCurr?.symbol}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Amount */}
        <GlassCard theme={theme} style={{ padding: "22px 20px", marginBottom: 18, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
            {t.amount} · {activeCurr.code}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            {/* −10 stepper */}
            <button
              onPointerDown={e => { e.preventDefault(); setAmount(v => Math.max(0, (parseFloat(v) || 0) - 10).toString()); }}
              style={{
                flexShrink: 0,
                width: 46, height: 46, borderRadius: 14,
                background: theme.surface2,
                border: `1px solid ${theme.border}`,
                color: theme.textSub, fontSize: 15, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                userSelect: "none", fontFamily: "inherit",
              }}
            >−10</button>

            {/* Currency + input */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: theme.textMuted }}>{activeCurr.symbol}</span>
              <input
                type="text" inputMode="decimal" value={amount}
                onChange={e => {
                  const v = e.target.value;
                  if (v === "" || /^\d*\.?\d*$/.test(v)) setAmount(v);
                }}
                onFocus={() => setAmountFocused(true)}
                onBlur={() => setAmountFocused(false)}
                placeholder="0"
                style={{
                  background: "none", border: "none", outline: "none",
                  fontSize: lang === "ar" ? 38 : 44, fontWeight: 800,
                  color: valid ? theme.text : theme.textMuted,
                  width: "55%", textAlign: "center",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* +10 stepper */}
            <button
              onPointerDown={e => { e.preventDefault(); setAmount(v => ((parseFloat(v) || 0) + 10).toString()); }}
              style={{
                flexShrink: 0,
                width: 46, height: 46, borderRadius: 14,
                background: theme.surface2,
                border: `1px solid ${theme.border}`,
                color: theme.textSub, fontSize: 15, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                userSelect: "none", fontFamily: "inherit",
              }}
            >+10</button>
          </div>
          {/* Focus underline */}
          <div style={{
            height: 2, borderRadius: 1,
            background: amountFocused ? theme.accent1 : "transparent",
            width: amountFocused ? "60%" : "0%",
            margin: "8px auto 0",
            transition: "width 0.2s ease-out",
          }} />
        </GlassCard>

        {/* Category grid */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            {t.category}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {CATEGORIES.map(c => {
              const active = category === c.id;
              return (
                <button key={c.id} onClick={() => handleCategoryChange(c.id)} style={{
                  background: active ? theme.surface2 : theme.surface,
                  border: `1px solid ${active ? theme.accent1 : theme.border}`,
                  borderRadius: 14, padding: "12px 4px",
                  cursor: "pointer", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 5,
                  fontFamily: "inherit",
                }}>
                  <span style={{ fontSize: 22 }}>{c.emoji}</span>
                  <span style={{ fontSize: 10, color: active ? theme.text : theme.textSub, fontWeight: 600 }}>{t.cats[c.id]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subcategory */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            {t.subcategory}
          </div>
          {catSubs.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              {catSubs.map(sub => {
                const active = subcategory === sub;
                return (
                  <button key={sub} onClick={() => setSubcategory(active ? "" : sub)} style={{
                    background: active ? theme.surface2 : theme.surface,
                    border: `1px solid ${active ? selColor : theme.border}`,
                    borderRadius: 20, padding: "6px 14px",
                    cursor: "pointer", fontSize: 12, fontWeight: 600,
                    color: active ? theme.text : theme.textSub,
                    fontFamily: "inherit",
                  }}>
                    {sub}
                  </button>
                );
              })}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={newSubInput}
              onChange={e => setNewSubInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleAddSub(); }}
              placeholder={t.addSubcategory}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button onClick={handleAddSub} style={{
              background: theme.accent1, border: "none", borderRadius: 14,
              padding: "0 16px", color: "#fff", fontWeight: 700, fontSize: 18,
              cursor: "pointer", flexShrink: 0, fontFamily: "inherit",
            }}>+</button>
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            {t.note}
          </div>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder={t.notePlaceholder} style={inputStyle} />
        </div>

        {/* Date */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            {t.date}
          </div>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ ...inputStyle, colorScheme: isDark ? "dark" : "light" }} />
        </div>

      </div>

      {/* Sticky submit footer */}
      <div style={{
        padding: "12px 20px max(28px, env(safe-area-inset-bottom, 28px))",
        background: theme.navBg,
        borderTop: `1px solid ${theme.border}`,
        position: "fixed", bottom: 0,
        left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        zIndex: 200,
      }}>
        <button
          onClick={() => valid && onSave({ amount: Number(amount), category, subcategory: subcategory || undefined, note, date, walletId: walletId || wallets[0]?.id })}
          style={{
            width: "100%", padding: "16px",
            background: valid ? theme.accent1 : theme.surface2,
            border: valid ? "none" : `1px solid ${theme.border}`,
            borderRadius: 14,
            color: valid ? "#fff" : theme.textMuted,
            fontSize: 15, fontWeight: 700,
            cursor: valid ? "pointer" : "not-allowed",
            fontFamily: "inherit",
          }}
        >
          {editing ? t.save : t.add}
        </button>
      </div>
    </div>
  );
}
