import { useState } from "react";
import GlassCard from "../components/GlassCard";
import GlowBg from "../components/GlowBg";
import { cat } from "../constants";
import { todayStr, yesterdayStr, fmtDate, fmtAmt, ls, lsSet } from "../utils";

export default function HomeScreen({ expenses, theme, isDark, t, lang, curr, notif, onRequestNotif, onEdit, onDelete }) {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  const [iosDismissed, setIosDismissed] = useState(() => ls('iosHintDismissed', false));
  const fmt = (n) => fmtAmt(n, curr.symbol, lang);
  const catColor = (id) => isDark ? cat(id).colorDark : cat(id).colorLight;

  const todayExp = expenses.filter(e => e.date === todayStr());
  const todayTotal = todayExp.reduce((s, e) => s + Number(e.amount), 0);

  // Group expenses by date (most recent 60)
  const grouped = [];
  const seen = {};
  expenses.slice(0, 60).forEach(e => {
    if (!seen[e.date]) { seen[e.date] = true; grouped.push({ date: e.date, items: [] }); }
    grouped.find(g => g.date === e.date).items.push(e);
  });

  // Category totals for today
  const todayCats = Object.entries(
    todayExp.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + Number(e.amount); return acc; }, {})
  );

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <GlowBg theme={theme} />

      {/* Header */}
      <div style={{ padding: "56px 24px 20px", position: "relative", zIndex: 1 }}>

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

      {/* Transaction list */}
      <div style={{ padding: "0 16px", position: "relative", zIndex: 1 }}>
        {grouped.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", color: theme.textMuted }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>💸</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: theme.textSub }}>{t.noTransactions}</div>
            <div style={{ fontSize: 13 }}>{t.noTransactionsHint}</div>
          </div>
        ) : grouped.map(group => (
          <div key={group.date}>
            {/* Date header */}
            <div style={{
              fontSize: 11, fontWeight: 700, color: theme.textMuted,
              letterSpacing: 1.2, textTransform: "uppercase",
              padding: "8px 8px 6px", marginTop: 4,
            }}>
              {group.date === todayStr() ? t.today
                : group.date === yesterdayStr() ? t.yesterday
                : fmtDate(group.date, lang, t.months)}
              <span style={{ marginInlineStart: 8, fontWeight: 800, color: theme.accent1, fontSize: 12 }}>
                {fmt(group.items.reduce((s, e) => s + Number(e.amount), 0))}
              </span>
            </div>

            {/* Expense rows */}
            {group.items.map(exp => {
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
                    <div style={{ fontSize: 11, color: theme.textSub, marginTop: 2 }}>{t.cats[exp.category]}</div>
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
        ))}
      </div>
    </div>
  );
}
