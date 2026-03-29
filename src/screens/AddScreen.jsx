import { useState } from "react";
import GlassCard from "../components/GlassCard";
import GlowBg from "../components/GlowBg";
import { CATEGORIES, cat } from "../constants";
import { todayStr } from "../utils";

export default function AddScreen({ theme, isDark, t, lang, curr, editing, onSave, onCancel }) {
  const [amount,   setAmount]   = useState(editing?.amount?.toString() || "");
  const [category, setCategory] = useState(editing?.category || "food");
  const [note,     setNote]     = useState(editing?.note || "");
  const [date,     setDate]     = useState(editing?.date || todayStr());

  const valid = amount && !isNaN(Number(amount)) && Number(amount) > 0;
  const selColor = isDark ? cat(category).colorDark : cat(category).colorLight;

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: theme.inputBg,
    border: `1px solid ${theme.inputBorder}`,
    borderRadius: 14, padding: "14px 16px",
    color: theme.text, fontSize: 15,
    fontFamily: "inherit", outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", position: "relative" }}>
      <GlowBg theme={theme} />
      <div style={{ padding: "52px 20px 84px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <button onClick={onCancel} style={{
            background: theme.glass, border: `1px solid ${theme.glassBorder}`,
            borderRadius: 12, color: theme.text, padding: "9px 14px",
            cursor: "pointer", fontSize: 16, backdropFilter: "blur(12px)",
          }}>
            {lang === "ar" ? "→" : "←"}
          </button>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: theme.text }}>
            {editing ? t.editExpense : t.addExpense}
          </h2>
        </div>

        {/* Amount */}
        <GlassCard theme={theme} style={{ padding: "22px 20px", marginBottom: 18, textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.textSub, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>
            {t.amount} · {curr.code}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: theme.textMuted }}>{curr.symbol}</span>
            <input
              type="number" value={amount}
              onChange={e => setAmount(e.target.value)}
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
                <button key={c.id} onClick={() => setCategory(c.id)} style={{
                  background: active ? c.bg + (isDark ? "0.20)" : "0.15)") : theme.glass,
                  border: active ? `1.5px solid ${color}` : `1px solid ${theme.glassBorder}`,
                  borderRadius: 14, padding: "12px 4px",
                  cursor: "pointer", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 5,
                  backdropFilter: "blur(12px)",
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 22 }}>{c.emoji}</span>
                  <span style={{ fontSize: 10, color: active ? color : theme.textSub, fontWeight: 600 }}>{t.cats[c.id]}</span>
                </button>
              );
            })}
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

        {/* Submit */}
        <button
          onClick={() => valid && onSave({ amount: Number(amount), category, note, date })}
          style={{
            width: "100%", padding: "17px",
            background: valid ? theme.btnGrad : theme.glass,
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
