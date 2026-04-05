import { useState } from "react";
import GlassCard from "../components/GlassCard";
import GlowBg from "../components/GlowBg";
import { cat } from "../constants";
import { todayStr, fmtAmt, ls, lsSet } from "../utils";

export default function HomeScreen({ expenses, settings, theme, isDark, t, lang, curr, notif, onRequestNotif, onEdit, onDelete }) {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  const [iosDismissed, setIosDismissed] = useState(() => ls('iosHintDismissed', false));
  const fmt = (n) => fmtAmt(n, curr.symbol, lang);
  const catColor = (id) => isDark ? cat(id).colorDark : cat(id).colorLight;

  const todayExp = expenses.filter(e => e.date === todayStr());
  const todayTotal = todayExp.reduce((s, e) => s + Number(e.amount), 0);

  // Wallet & budget
  const walletBalance = settings.walletBalance || 0;
  const budget = settings.monthlyBudget || 0;
  const now = new Date();
  const monthSpent = expenses
    .filter(e => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
    .reduce((s, e) => s + Number(e.amount), 0);
  const budgetRemaining = budget - monthSpent;
  const budgetPct = budget > 0 ? Math.min((monthSpent / budget) * 100, 100) : 0;

  // Category totals for today
  const todayCats = Object.entries(
    todayExp.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + Number(e.amount); return acc; }, {})
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <GlowBg theme={theme} style={{ position: "fixed" }} />

      {/* Header — fixed in place, never scrolls */}
      <div style={{ padding: "56px 24px 20px", flexShrink: 0, position: "relative", zIndex: 1, background: theme.bg }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, flexShrink: 0,
            background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(56,189,248,0.35)",
          }}>
            <span style={{ fontSize: 22 }}>💸</span>
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{
              fontSize: 20, fontWeight: 900, letterSpacing: -0.5,
              background: "linear-gradient(90deg, #38bdf8, #818cf8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {lang === "ar" ? "مصروفي" : "MK Tracker"}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, marginTop: 2 }}>
              {lang === "ar" ? "MK Tracker" : "مصروفي"}
            </div>
          </div>
        </div>

        {/* iOS install banner */}
        {isIOS && !isStandalone && !iosDismissed && (
          <div style={{
            background: isDark ? "rgba(251,191,36,0.12)" : "rgba(234,179,8,0.10)",
            border: `1px solid ${isDark ? "rgba(251,191,36,0.3)" : "rgba(234,179,8,0.35)"}`,
            borderRadius: 12, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10,
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 16 }}>📲</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? "#fde68a" : "#92400e", flex: 1 }}>{t.iosInstallHint}</span>
            <button onClick={() => { lsSet('iosHintDismissed', true); setIosDismissed(true); }} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 700, color: isDark ? "#fde68a" : "#92400e",
              padding: "4px 8px", borderRadius: 6,
              backdropFilter: "blur(4px)",
            }}>{t.iosInstallDismiss}</button>
          </div>
        )}

        {/* Notification banner */}
        {!notif && (!isIOS || isStandalone) && (
          <div onClick={onRequestNotif} style={{
            background: isDark ? "rgba(251,191,36,0.12)" : "rgba(234,179,8,0.10)",
            border: `1px solid ${isDark ? "rgba(251,191,36,0.3)" : "rgba(234,179,8,0.35)"}`,
            borderRadius: 12, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10,
            cursor: "pointer", marginBottom: 20,
          }}>
            <span style={{ fontSize: 16 }}>🔔</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? "#fde68a" : "#92400e" }}>{t.notifOff}</span>
          </div>
        )}

        {/* Wallet card */}
        <GlassCard theme={theme} style={{ padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
            💰 {t.walletBalance}
          </div>
          <div style={{
            fontSize: 28, fontWeight: 900,
            color: walletBalance >= 0 ? theme.accent1 : "#ef4444",
            lineHeight: 1.1,
          }}>
            {fmt(walletBalance)}
          </div>
          {budget > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>
                <span style={{ color: theme.textSub }}>{t.monthlyBudget}: {fmt(budget)}</span>
                <span style={{ color: budgetRemaining >= 0 ? theme.accent1 : "#ef4444", fontWeight: 700 }}>
                  {budgetRemaining >= 0 ? t.remaining : t.overBudget}: {fmt(Math.abs(budgetRemaining))}
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: theme.divider, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 3,
                  background: budgetRemaining >= 0 ? theme.btnGrad : "linear-gradient(90deg, #ef4444, #f97316)",
                  width: `${budgetPct}%`, transition: "width 0.4s",
                }} />
              </div>
            </div>
          )}
        </GlassCard>

        {/* Today's total */}
        <div style={{ fontSize: 12, fontWeight: 600, color: theme.textSub, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>
          {t.todayTotal}
        </div>
        <div style={{
          fontSize: lang === "ar" ? 44 : 50, fontWeight: 900, letterSpacing: -1,
          background: theme.totalGrad,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          lineHeight: 1.05, marginBottom: 8,
        }}>
          {fmt(todayTotal)}
        </div>
        <div style={{ fontSize: 13, color: theme.textMuted }}>
          {todayExp.length} {t.transactions}
        </div>

        {/* Category chips */}
        {todayCats.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
            {todayCats.map(([catId, total]) => {
              const c = cat(catId);
              const color = catColor(catId);
              return (
                <div key={catId} style={{
                  background: c.bg + (isDark ? "0.15)" : "0.12)"),
                  border: `1px solid ${c.bg + (isDark ? "0.30)" : "0.25)")}`,
                  borderRadius: 20, padding: "5px 12px",
                  fontSize: 12, fontWeight: 700, color,
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <span>{c.emoji}</span>
                  <span>{fmt(total)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction list — only this scrolls (today only) */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px", paddingBottom: 100, position: "relative", zIndex: 1 }}>
        {todayExp.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", color: theme.textMuted }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>💸</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: theme.textSub }}>{t.noTransactions}</div>
            <div style={{ fontSize: 13 }}>{t.noTransactionsHint}</div>
          </div>
        ) : todayExp.map(exp => {
          const c = cat(exp.category);
          const color = catColor(exp.category);
          return (
            <GlassCard key={exp.id} theme={theme} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "13px 14px", marginBottom: 8,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 13, flexShrink: 0,
                background: c.bg + (isDark ? "0.18)" : "0.14)"),
                border: `1px solid ${c.bg + (isDark ? "0.30)" : "0.22)")}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
              }}>{c.emoji}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: theme.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {exp.note || t.cats[exp.category]}
                </div>
                <div style={{ fontSize: 11, color: theme.textSub, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                  {t.cats[exp.category]}
                  {exp.subcategory && (
                    <span style={{
                      fontSize: 10, color: catColor(exp.category), fontWeight: 600,
                      background: c.bg + (isDark ? "0.12)" : "0.10)"),
                      borderRadius: 6, padding: "1px 6px",
                    }}>{exp.subcategory}</span>
                  )}
                </div>
              </div>

              <div style={{ textAlign: lang === "ar" ? "left" : "right", flexShrink: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color }}>{fmt(exp.amount)}</div>
                <div style={{ display: "flex", gap: 5, marginTop: 5, justifyContent: lang === "ar" ? "flex-start" : "flex-end" }}>
                  <button onClick={() => onEdit(exp)} style={{
                    background: theme.glassBg2, border: `1px solid ${theme.glassBorder}`,
                    borderRadius: 7, color: theme.textSub, fontSize: 11,
                    padding: "3px 8px", cursor: "pointer",
                  }}>✏️</button>
                  <button onClick={() => onDelete(exp.id)} style={{
                    background: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: 7, color: "#ef4444", fontSize: 11,
                    padding: "3px 8px", cursor: "pointer",
                  }}>🗑️</button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
