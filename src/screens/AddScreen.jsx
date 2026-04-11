import { useState } from "react";
import GlassCard from "../components/GlassCard";
import GlowBg from "../components/GlowBg";
import { IconChevronLeft, IconChevronRight } from "../components/Icons";
import { CATEGORIES, cat } from "../constants";
import { todayStr } from "../utils";

export default function AddScreen({ theme, isDark, t, lang, curr, editing, onSave, onCancel, subcategories, onAddSubcategory }) {
  const [amount,      setAmount]      = useState(editing?.amount?.toString() || "");
  const [category,    setCategory]    = useState(editing?.category || "food");
  const [subcategory, setSubcategory] = useState(editing?.subcategory || "");
  const [note,        setNote]        = useState(editing?.note || "");
  const [date,        setDate]        = useState(editing?.date || todayStr());
  const [newSubInput, setNewSubInput] = useState("");
  const [amountFocused, setAmountFocused] = useState(false);

  const valid = amount && !isNaN(Number(amount)) && Number(amount) > 0;
  const selColor = isDark ? cat(category).colorDark : cat(category).colorLight;
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
      <GlowBg theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "52px 20px 20px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <button onClick={onCancel} style={{
            background: theme.glass, border: `1px solid ${theme.glassBorder}`,
            borderRadius: 12, color: theme.text, padding: "9px 12px",
            cursor: "pointer", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BackIcon size={18} color={theme.text} />
          </button>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: theme.text }}>
            {editing ? t.editExpense : t.addExpense}
          </h2>
        </div>

        {/* Amount */}
        <GlassCard theme={theme} variant="elevated" style={{ padding: "22px 20px", marginBottom: 18, textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.textSub, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>
            {t.amount} · {curr.code}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: theme.textMuted }}>{curr.symbol}</span>
            <input
              type="number" value={amount}
              onChange={e => setAmount(e.target.value)}
              onFocus={() => setAmountFocused(true)}
              onBlur={() => setAmountFocused(false)}
              placeholder="0"
              style={{
                background: "none", border: "none", outline: "none",
                fontSize: lang === "ar" ? 44 : 50, fontWeight: 900,
                color: valid ? selColor : theme.textSub,
                width: "60%", textAlign: "center",
                fontFamily: "inherit", transition: "color 0.2s",
              }}
            />
          </div>
          {/* Animated focus underline */}
          <div style={{
            height: 2, borderRadius: 1,
            background: amountFocused ? theme.walletAccent : "transparent",
            width: amountFocused ? "60%" : "0%",
            margin: "8px auto 0",
            transition: "background 0.3s, width 0.3s ease-out",
          }} />
        </GlassCard>

        {/* Category grid */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>
            {t.category}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {CATEGORIES.map(c => {
              const color = isDark ? c.colorDark : c.colorLight;
              const active = category === c.id;
              return (
                <button key={c.id} onClick={() => handleCategoryChange(c.id)} style={{
                  background: active ? c.bg + (isDark ? "0.20)" : "0.15)") : theme.glass,
                  border: active ? `1.5px solid ${color}` : `1px solid ${theme.glassBorder}`,
                  borderRadius: 18, padding: "12px 4px",
                  cursor: "pointer", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 5,
                  backdropFilter: "blur(12px)",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: active ? "scale(1.05)" : "scale(1)",
                  boxShadow: active ? `0 0 16px ${c.bg}0.25)` : "none",
                }}>
                  <span style={{ fontSize: 22 }}>{c.emoji}</span>
                  <span style={{ fontSize: 10, color: active ? color : theme.textSub, fontWeight: 600 }}>{t.cats[c.id]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subcategory */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>
            {t.subcategory}
          </div>
          {catSubs.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              {catSubs.map(sub => {
                const active = subcategory === sub;
                return (
                  <button key={sub} onClick={() => setSubcategory(active ? "" : sub)} style={{
                    background: active ? cat(category).bg + (isDark ? "0.20)" : "0.15)") : theme.glass,
                    border: active ? `1.5px solid ${selColor}` : `1px solid ${theme.glassBorder}`,
                    borderRadius: 20, padding: "6px 14px",
                    cursor: "pointer", fontSize: 12, fontWeight: 600,
                    color: active ? selColor : theme.textSub,
                    backdropFilter: "blur(12px)",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: active ? "scale(1.03)" : "scale(1)",
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
              background: theme.btnGrad, border: "none", borderRadius: 14,
              padding: "0 16px", color: "#fff", fontWeight: 700, fontSize: 18,
              cursor: "pointer", flexShrink: 0,
            }}>+</button>
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>
            {t.note}
          </div>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder={t.notePlaceholder} style={inputStyle} />
        </div>

        {/* Date */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>
            {t.date}
          </div>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ ...inputStyle, colorScheme: isDark ? "dark" : "light" }} />
        </div>

      </div>

      {/* Sticky submit footer */}
      <div style={{
        padding: "12px 20px 28px",
        background: theme.navBg,
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        borderTop: `1px solid ${theme.glassBorder}`,
        position: "relative", zIndex: 10,
      }}>
        <button
          onClick={() => valid && onSave({ amount: Number(amount), category, subcategory: subcategory || undefined, note, date })}
          style={{
            width: "100%", padding: "17px",
            background: valid ? theme.btnGrad : theme.glass,
            backgroundSize: valid ? "200% 100%" : undefined,
            animation: valid ? "shimmer 3s ease-in-out infinite" : "none",
            border: valid ? "none" : `1px solid ${theme.glassBorder}`,
            borderRadius: 18,
            color: valid ? "#fff" : theme.textMuted,
            fontSize: 16, fontWeight: 800,
            cursor: valid ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            boxShadow: valid ? "0 4px 24px rgba(56,189,248,0.3)" : "none",
            transition: "all 0.2s",
          }}
        >
          {editing ? t.save : t.add}
        </button>
      </div>
    </div>
  );
}
