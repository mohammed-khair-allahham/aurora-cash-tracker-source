import { useState } from "react";
import GlassCard from "../components/GlassCard";
import GlowBg from "../components/GlowBg";
import { IconWallet, IconArrowUp, IconPlus } from "../components/Icons";
import { fmtAmt, todayStr, fmtDate } from "../utils";

export default function WalletScreen({ expenses, settings, walletTxns, onTopUp, onSettingsChange, theme, isDark, t, lang, curr }) {
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpNote, setTopUpNote] = useState("");

  const fmt = (n) => fmtAmt(n, curr.symbol, lang, curr.code);
  const walletBalance = settings.walletBalance || 0;

  const totalTopUps = walletTxns.reduce((s, tx) => s + Number(tx.amount), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);

  // Sort top-ups by date (newest first)
  const sorted = [...walletTxns].sort((a, b) => {
    const dc = b.date.localeCompare(a.date);
    if (dc !== 0) return dc;
    return String(b.id).localeCompare(String(a.id));
  });

  const handleTopUp = () => {
    const amt = Number(topUpAmount);
    if (!amt || amt <= 0) return;
    onTopUp({ amount: amt, note: topUpNote, date: todayStr() });
    setTopUpAmount("");
    setTopUpNote("");
    setShowTopUp(false);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <GlowBg theme={theme} style={{ position: "fixed" }} />

      {/* Header */}
      <div style={{ padding: "56px 24px 20px", flexShrink: 0, position: "relative", zIndex: 1, background: theme.bg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <IconWallet size={24} color={theme.text} />
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 26, color: theme.text }}>{t.walletScreen}</h2>
        </div>

        {/* Balance card */}
        <GlassCard theme={theme} variant="wallet" style={{ padding: 0, marginBottom: 16, overflow: "hidden" }}>
          <div style={{ height: 3, background: theme.walletAccent }} />
          <div style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
              {t.walletBalance}
            </div>
            <div style={{
              fontSize: 38, fontWeight: 900, lineHeight: 1.1,
              color: walletBalance >= 0 ? theme.accent1 : "#ef4444",
              marginBottom: 16,
            }}>
              {fmt(walletBalance)}
            </div>

            {/* Summary row */}
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{
                flex: 1, padding: "10px 12px", borderRadius: 14,
                background: isDark ? "rgba(0,229,160,0.08)" : "rgba(5,150,105,0.06)",
                border: `1px solid ${isDark ? "rgba(0,229,160,0.15)" : "rgba(5,150,105,0.12)"}`,
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", marginBottom: 4 }}>
                  {t.totalTopUps}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: theme.accent1 }}>
                  +{fmt(totalTopUps)}
                </div>
              </div>
              <div style={{
                flex: 1, padding: "10px 12px", borderRadius: 14,
                background: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)",
                border: `1px solid ${isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.12)"}`,
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", marginBottom: 4 }}>
                  {t.totalExpenses}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#ef4444" }}>
                  -{fmt(totalExpenses)}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Top Up button */}
        {!showTopUp ? (
          <button onClick={() => setShowTopUp(true)} style={{
            width: "100%", padding: "14px",
            background: theme.btnGrad,
            border: "none", borderRadius: 16,
            color: "#fff", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: "0 4px 16px rgba(56,189,248,0.2)",
            marginBottom: 16,
          }}>
            <IconPlus size={18} color="#fff" style={{ strokeWidth: 2.5 }} />
            {t.topUp}
          </button>
        ) : (
          <GlassCard theme={theme} variant="elevated" style={{ padding: "16px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.textSub, marginBottom: 10 }}>
              {t.topUpHint}
            </div>
            <input
              type="number"
              value={topUpAmount}
              onChange={e => setTopUpAmount(e.target.value)}
              placeholder={t.topUpAmount}
              autoFocus
              style={{
                width: "100%", boxSizing: "border-box",
                background: theme.inputBg,
                border: `1px solid ${theme.inputBorder}`,
                borderRadius: 12, padding: "12px 14px",
                color: theme.text, fontSize: 16, fontWeight: 700,
                fontFamily: "inherit", outline: "none",
                marginBottom: 8,
              }}
            />
            <input
              value={topUpNote}
              onChange={e => setTopUpNote(e.target.value)}
              placeholder={lang === "ar" ? "ملاحظة (اختياري)" : "Note (optional)"}
              style={{
                width: "100%", boxSizing: "border-box",
                background: theme.inputBg,
                border: `1px solid ${theme.inputBorder}`,
                borderRadius: 12, padding: "12px 14px",
                color: theme.text, fontSize: 14,
                fontFamily: "inherit", outline: "none",
                marginBottom: 12,
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowTopUp(false)} style={{
                flex: 1, padding: "11px",
                background: theme.glass, border: `1px solid ${theme.glassBorder}`,
                borderRadius: 12, color: theme.text,
                cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13,
              }}>{t.cancel}</button>
              <button onClick={handleTopUp} style={{
                flex: 1, padding: "11px",
                background: Number(topUpAmount) > 0 ? theme.btnGrad : theme.glass,
                border: Number(topUpAmount) > 0 ? "none" : `1px solid ${theme.glassBorder}`,
                borderRadius: 12, color: Number(topUpAmount) > 0 ? "#fff" : theme.textMuted,
                cursor: Number(topUpAmount) > 0 ? "pointer" : "not-allowed",
                fontFamily: "inherit", fontWeight: 700, fontSize: 13,
              }}>{t.topUp}</button>
            </div>
          </GlassCard>
        )}

        {/* Monthly budget */}
        <GlassCard theme={theme} style={{ padding: "12px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.textSub }}>{t.monthlyBudget}</div>
            <input
              type="number"
              value={settings.monthlyBudget || ""}
              onChange={e => onSettingsChange(s => ({ ...s, monthlyBudget: e.target.value === "" ? 0 : Number(e.target.value) }))}
              placeholder="0"
              style={{
                width: 120, boxSizing: "border-box",
                background: theme.inputBg,
                border: `1px solid ${theme.inputBorder}`,
                borderRadius: 10, padding: "8px 12px",
                color: theme.text, fontSize: 14, fontWeight: 700,
                fontFamily: "inherit", outline: "none",
                textAlign: "center",
                colorScheme: isDark ? "dark" : "light",
              }}
            />
          </div>
        </GlassCard>

        {/* Section label */}
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>
          {t.topUps}
        </div>
      </div>

      {/* Top-ups list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px", paddingBottom: 100, position: "relative", zIndex: 1 }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 24px", color: theme.textMuted }}>
            <div style={{
              width: 72, height: 72, borderRadius: 22,
              background: theme.glass, border: `1px solid ${theme.glassBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 18px",
            }}>
              <IconWallet size={32} color={theme.textMuted} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: theme.textSub }}>{t.noWalletActivity}</div>
            <div style={{ fontSize: 13 }}>{t.noWalletActivityHint}</div>
          </div>
        ) : sorted.map(tx => {
          const color = theme.accent1;
          const bgColor = isDark ? "rgba(0,229,160,0.12)" : "rgba(5,150,105,0.08)";
          const borderColor = isDark ? "rgba(0,229,160,0.25)" : "rgba(5,150,105,0.2)";
          const borderSide = lang === "ar" ? "borderRight" : "borderLeft";

          return (
            <GlassCard key={tx.id} theme={theme} style={{
              padding: "12px 14px", marginBottom: 8,
              [borderSide]: `3px solid ${color}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: bgColor, border: `1px solid ${borderColor}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <IconArrowUp size={20} color={color} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 700, fontSize: 13, color: theme.text,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {tx.note || t.topUp}
                  </div>
                  <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
                    {tx.date === todayStr() ? t.today : fmtDate(tx.date, lang, t.months)}
                  </div>
                </div>

                <div style={{ fontWeight: 800, fontSize: 16, color, flexShrink: 0 }}>
                  +{fmt(tx.amount)}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
