import { useState } from "react";
import GlassCard from "../components/GlassCard";
import GlowBg from "../components/GlowBg";
import { IconWallet, IconEdit, IconTrash } from "../components/Icons";
import { cat } from "../constants";
import { todayStr, fmtAmt, ls, lsSet } from "../utils";

export default function HomeScreen({ expenses, settings, theme, isDark, t, lang, curr, notif, onRequestNotif, onEdit, onDelete }) {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  const [iosDismissed, setIosDismissed] = useState(() => ls('iosHintDismissed', false));
  const [expandedId, setExpandedId] = useState(null);
  const fmt = (n) => fmtAmt(n, curr.symbol, lang, curr.code);
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

  // Budget ring SVG values
  const ringR = 28;
  const ringC = 2 * Math.PI * ringR;
  const ringOffset = ringC * (1 - budgetPct / 100);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <GlowBg theme={theme} style={{ position: "fixed" }} />

      {/* Header — fixed in place, never scrolls */}
      <div style={{ padding: "56px 24px 20px", flexShrink: 0, position: "relative", zIndex: 1, background: theme.bg }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          {/* App icon — aurora-themed SVG mark */}
          <div style={{
            width: 46, height: 46, borderRadius: 14, flexShrink: 0,
            background: isDark
              ? "linear-gradient(135deg, #020d1c 0%, #0c2d4d 100%)"
              : "linear-gradient(135deg, #e0f5ff 0%, #ede9fe 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: isDark
              ? "0 4px 20px rgba(0,229,160,0.25), inset 0 1px 0 rgba(255,255,255,0.06)"
              : "0 4px 20px rgba(5,150,105,0.2), inset 0 1px 0 rgba(255,255,255,0.8)",
            border: `1px solid ${isDark ? "rgba(0,229,160,0.2)" : "rgba(5,150,105,0.15)"}`,
            position: "relative", overflow: "hidden",
          }}>
            {/* Aurora glow inside icon */}
            <div style={{
              position: "absolute", inset: 0,
              background: isDark
                ? "radial-gradient(circle at 30% 20%, rgba(0,229,160,0.3) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(167,139,250,0.25) 0%, transparent 60%)"
                : "radial-gradient(circle at 30% 20%, rgba(5,150,105,0.2) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(109,40,217,0.15) 0%, transparent 60%)",
            }} />
            {/* "A" lettermark */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ position: "relative", zIndex: 1 }}>
              <defs>
                <linearGradient id="auroraIconGrad" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0%" stopColor={isDark ? "#00e5a0" : "#059669"} />
                  <stop offset="100%" stopColor={isDark ? "#a78bfa" : "#7c3aed"} />
                </linearGradient>
              </defs>
              <path d="M12 3L4 21h3.5l1.5-3.5h6L16.5 21H20L12 3zm0 5.5L15 15H9l3-6.5z"
                fill="url(#auroraIconGrad)" />
            </svg>
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{
              fontSize: 20, fontWeight: 900, letterSpacing: -0.5,
              background: theme.totalGrad,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {lang === "ar" ? "أورورا تراكر" : "Aurora Tracker"}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, marginTop: 2 }}>
              {lang === "ar" ? "تتبّع مصاريفك بذكاء" : "Smart expense tracking"}
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

        {/* Premium Wallet Card */}
        <GlassCard theme={theme} variant="wallet" style={{ padding: 0, marginBottom: 16, overflow: "hidden" }}>
          {/* Gradient accent stripe */}
          <div style={{ height: 3, background: theme.walletAccent }} />

          <div style={{ padding: "16px 20px 18px" }}>
            {/* Wallet header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <IconWallet size={16} color={theme.textMuted} />
              <span style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>
                {t.walletBalance}
              </span>
            </div>

            {/* Balance + budget ring row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{
                  fontSize: 34, fontWeight: 900, lineHeight: 1.1,
                  color: walletBalance >= 0 ? theme.accent1 : "#ef4444",
                }}>
                  {fmt(walletBalance)}
                </div>
                {budget > 0 && (
                  <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 11, fontWeight: 600 }}>
                    <span style={{ color: theme.textSub }}>{t.monthlyBudget}: {fmt(budget)}</span>
                    <span style={{ color: budgetRemaining >= 0 ? theme.accent1 : "#ef4444", fontWeight: 700 }}>
                      {budgetRemaining >= 0 ? t.remaining : t.overBudget}: {fmt(Math.abs(budgetRemaining))}
                    </span>
                  </div>
                )}
              </div>

              {/* Circular budget ring */}
              {budget > 0 && (
                <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
                  <svg width={64} height={64} viewBox="0 0 64 64">
                    <circle cx={32} cy={32} r={ringR} fill="none" stroke={theme.progressRing.track} strokeWidth={5} />
                    <circle cx={32} cy={32} r={ringR} fill="none"
                      stroke="url(#budgetGrad)" strokeWidth={5}
                      strokeLinecap="round"
                      strokeDasharray={ringC}
                      strokeDashoffset={ringOffset}
                      transform="rotate(-90 32 32)"
                      style={{ transition: "stroke-dashoffset 0.8s ease" }}
                    />
                    <defs>
                      <linearGradient id="budgetGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={budgetRemaining >= 0 ? theme.progressRing.g1 : "#ef4444"} />
                        <stop offset="100%" stopColor={budgetRemaining >= 0 ? theme.progressRing.g2 : "#f97316"} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800,
                    color: budgetRemaining >= 0 ? theme.accent1 : "#ef4444",
                  }}>
                    {Math.round(budgetPct)}%
                  </div>
                </div>
              )}
            </div>
          </div>
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
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: theme.glass,
              border: `1px solid ${theme.glassBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", fontSize: 36,
            }}>
              💸
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, color: theme.textSub }}>{t.noTransactions}</div>
            <div style={{ fontSize: 13 }}>{t.noTransactionsHint}</div>
          </div>
        ) : todayExp.map(exp => {
          const c = cat(exp.category);
          const color = catColor(exp.category);
          const isExpanded = expandedId === exp.id;
          const borderSide = lang === "ar" ? "borderRight" : "borderLeft";
          return (
            <GlassCard key={exp.id} theme={theme} onClick={() => setExpandedId(isExpanded ? null : exp.id)} style={{
              padding: "13px 14px", marginBottom: 8,
              cursor: "pointer",
              [borderSide]: `3px solid ${color}`,
              transition: "transform 0.15s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                </div>
              </div>

              {/* Expandable action row */}
              <div style={{
                maxHeight: isExpanded ? 48 : 0,
                opacity: isExpanded ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.25s ease, opacity 0.2s ease",
              }}>
                <div style={{
                  display: "flex", gap: 8,
                  justifyContent: lang === "ar" ? "flex-start" : "flex-end",
                  paddingTop: 10,
                }}>
                  <button onClick={(e) => { e.stopPropagation(); onEdit(exp); }} style={{
                    background: theme.glassBg2, border: `1px solid ${theme.glassBorder}`,
                    borderRadius: 10, color: theme.textSub, fontSize: 12,
                    padding: "6px 14px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 5, fontWeight: 600,
                    fontFamily: "inherit",
                  }}>
                    <IconEdit size={14} color={theme.textSub} />
                    {lang === "ar" ? "تعديل" : "Edit"}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(exp.id); }} style={{
                    background: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: 10, color: "#ef4444", fontSize: 12,
                    padding: "6px 14px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 5, fontWeight: 600,
                    fontFamily: "inherit",
                  }}>
                    <IconTrash size={14} color="#ef4444" />
                    {lang === "ar" ? "حذف" : "Delete"}
                  </button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
