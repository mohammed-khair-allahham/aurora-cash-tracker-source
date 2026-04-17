import { useState } from "react";
import GlassCard from "../components/GlassCard";
import { IconWallet, IconEdit, IconTrash } from "../components/Icons";
import { cat } from "../constants";
import { todayStr, fmtAmt, ls, lsSet } from "../utils";

export default function HomeScreen({ expenses, settings, wallets, theme, t, lang, curr, notif, onRequestNotif, onEdit, onDelete, onSetActiveWallet }) {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  const [iosDismissed, setIosDismissed] = useState(() => ls('iosHintDismissed', false));
  const [expandedId, setExpandedId] = useState(null);
  const fmt = (n) => fmtAmt(n, curr.symbol, lang, curr.code);

  // Active wallet
  const activeWallet = wallets.find(w => w.id === settings.activeWalletId) || wallets[0];
  const walletBalance = activeWallet?.balance || 0;

  // Wallet switcher: cycle to next wallet
  const switchWallet = () => {
    if (!wallets.length) return;
    const idx = wallets.findIndex(w => w.id === activeWallet?.id);
    const next = wallets[(idx + 1) % wallets.length];
    onSetActiveWallet(next.id);
  };

  // Filter today/month expenses by active wallet
  const todayExp = expenses.filter(e => e.date === todayStr() && e.walletId === activeWallet?.id);
  const todayTotal = todayExp.reduce((s, e) => s + Number(e.amount), 0);

  // Wallet & budget (per active wallet)
  const budget = activeWallet?.budget || 0;
  const now = new Date();
  const monthSpent = expenses
    .filter(e => {
      const d = new Date(e.date);
      return e.walletId === activeWallet?.id &&
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, e) => s + Number(e.amount), 0);
  const budgetRemaining = budget - monthSpent;
  const budgetPct = budget > 0 ? Math.min((monthSpent / budget) * 100, 100) : 0;

  // Category totals for today (already filtered by active wallet above)
  const todayCats = Object.entries(
    todayExp.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + Number(e.amount); return acc; }, {})
  );

  // Budget ring SVG values
  const ringR = 28;
  const ringC = 2 * Math.PI * ringR;
  const ringOffset = ringC * (1 - budgetPct / 100);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

      {/* Header — fixed in place, never scrolls */}
      <div style={{ padding: "56px 24px 20px", flexShrink: 0, position: "relative", zIndex: 1, background: theme.bg }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: theme.surface2,
            border: `1px solid ${theme.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="26" height="26" viewBox="0 0 512 512" fill="none">
              <g fill={theme.accent1} fillOpacity="0.22">
                <rect x="120" y="288" width="68" height="124" rx="34"/>
                <rect x="222" y="216" width="68" height="196" rx="34"/>
                <rect x="324" y="144" width="68" height="268" rx="34"/>
              </g>
              <path d="M154 288 L256 216 L358 144" stroke={theme.accent1} strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="358" cy="144" r="26" fill={theme.accent1}/>
            </svg>
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{
              fontSize: 19, fontWeight: 800, letterSpacing: -0.3,
              color: theme.text,
            }}>
              {lang === "ar" ? "أورورا تراكر" : "Aurora Tracker"}
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: theme.textMuted, marginTop: 3 }}>
              {lang === "ar" ? "تتبّع مصاريفك بذكاء" : "Smart expense tracking"}
            </div>
          </div>
        </div>

        {/* iOS install banner */}
        {isIOS && !isStandalone && !iosDismissed && (
          <div style={{
            background: theme.surface2,
            border: `1px solid ${theme.border}`,
            borderRadius: 12, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10,
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 14, color: theme.textSub }}>📲</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: theme.textSub, flex: 1 }}>{t.iosInstallHint}</span>
            <button onClick={() => { lsSet('iosHintDismissed', true); setIosDismissed(true); }} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 600, color: theme.textMuted,
              padding: "4px 8px", borderRadius: 6, fontFamily: "inherit",
            }}>{t.iosInstallDismiss}</button>
          </div>
        )}

        {/* Notification banner */}
        {!notif && (!isIOS || isStandalone) && (
          <div onClick={onRequestNotif} style={{
            background: theme.surface2,
            border: `1px solid ${theme.border}`,
            borderRadius: 12, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10,
            cursor: "pointer", marginBottom: 20,
          }}>
            <span style={{ fontSize: 14, color: theme.textSub }}>🔔</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: theme.textSub }}>{t.notifOff}</span>
          </div>
        )}

        {/* Unified Dashboard Card */}
        <GlassCard theme={theme} style={{ padding: 0, marginBottom: 16, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px 0" }}>
            {/* Wallet header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <IconWallet size={14} color={theme.textMuted} />
                <span style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>
                  {t.walletBalance}
                </span>
              </div>
              {wallets.length > 1 && (
                <button onClick={switchWallet} style={{
                  background: theme.surface2,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10, padding: "4px 10px",
                  color: theme.textSub, fontSize: 11, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  {activeWallet?.name} ↻
                </button>
              )}
              {wallets.length === 1 && activeWallet && (
                <span style={{ fontSize: 11, fontWeight: 500, color: theme.textMuted }}>{activeWallet.name}</span>
              )}
            </div>

            {/* Balance + budget ring row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 30, fontWeight: 800, lineHeight: 1.1,
                  color: walletBalance >= 0 ? theme.text : "#ef4444",
                }}>
                  {fmt(walletBalance)}
                </div>
                {budget > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8, fontSize: 11, fontWeight: 500 }}>
                    <span style={{ color: theme.textSub }}>{t.monthlyBudget}: {fmt(budget)}</span>
                    <span style={{ color: budgetRemaining >= 0 ? theme.accent1 : "#ef4444", fontWeight: 600 }}>
                      {budgetRemaining >= 0 ? t.remaining : t.overBudget}: {fmt(Math.abs(budgetRemaining))}
                    </span>
                  </div>
                )}
              </div>

              {/* Circular budget ring */}
              {budget > 0 && (
                <div style={{ position: "relative", width: 58, height: 58, flexShrink: 0, marginLeft: 12 }}>
                  <svg width={58} height={58} viewBox="0 0 64 64">
                    <circle cx={32} cy={32} r={ringR} fill="none" stroke={theme.progressRing.track} strokeWidth={5} />
                    <circle cx={32} cy={32} r={ringR} fill="none"
                      stroke={budgetRemaining >= 0 ? theme.accent1 : "#ef4444"}
                      strokeWidth={5}
                      strokeLinecap="round"
                      strokeDasharray={ringC}
                      strokeDashoffset={ringOffset}
                      transform="rotate(-90 32 32)"
                      style={{ transition: "stroke-dashoffset 0.8s ease" }}
                    />
                  </svg>
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                    color: budgetRemaining >= 0 ? theme.accent1 : "#ef4444",
                  }}>
                    {Math.round(budgetPct)}%
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: 1, margin: "16px 20px",
            background: theme.border,
          }} />

          {/* Today's spending box */}
          <div style={{ padding: "0 20px" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "4px 0",
            }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 600, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>
                  {t.todayTotal}
                </span>
                <div style={{
                  fontSize: 22, fontWeight: 800, lineHeight: 1.15,
                  color: theme.text, marginTop: 4,
                }}>
                  {fmt(todayTotal)}
                </div>
              </div>
              <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500 }}>
                {todayExp.length} {t.transactions}
              </div>
            </div>
          </div>

          {/* Category chips */}
          {todayCats.length > 0 && (
            <div style={{ padding: "14px 20px 0", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {todayCats.map(([catId, total]) => {
                const c = cat(catId);
                return (
                  <div key={catId} style={{
                    background: theme.surface2,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 20, padding: "4px 10px",
                    fontSize: 11, fontWeight: 600, color: theme.textSub,
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    <span style={{ fontSize: 12 }}>{c.emoji}</span>
                    <span>{fmt(total)}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom padding */}
          <div style={{ height: 18 }} />
        </GlassCard>
      </div>

      {/* Transaction list — only this scrolls (today only) */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px", paddingBottom: 100, position: "relative", zIndex: 1 }}>
        {todayExp.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", color: theme.textMuted }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              background: theme.surface2,
              border: `1px solid ${theme.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", fontSize: 32,
            }}>
              💸
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: theme.textSub }}>{t.noTransactions}</div>
            <div style={{ fontSize: 13 }}>{t.noTransactionsHint}</div>
          </div>
        ) : todayExp.map(exp => {
          const c = cat(exp.category);
          const isExpanded = expandedId === exp.id;
          return (
            <GlassCard key={exp.id} theme={theme} onClick={() => setExpandedId(isExpanded ? null : exp.id)} style={{
              padding: "13px 14px", marginBottom: 8,
              cursor: "pointer",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: theme.surface2,
                  border: `1px solid ${theme.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 19,
                }}>{c.emoji}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: theme.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {exp.note || t.cats[exp.category]}
                  </div>
                  <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                    {t.cats[exp.category]}
                    {exp.subcategory && (
                      <span style={{
                        fontSize: 10, color: theme.textSub, fontWeight: 500,
                        background: theme.surface2,
                        borderRadius: 6, padding: "1px 6px",
                      }}>{exp.subcategory}</span>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: lang === "ar" ? "left" : "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>{fmt(exp.amount)}</div>
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
                    background: theme.surface2, border: `1px solid ${theme.border}`,
                    borderRadius: 10, color: theme.textSub, fontSize: 12,
                    padding: "6px 14px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 5, fontWeight: 600,
                    fontFamily: "inherit",
                  }}>
                    <IconEdit size={14} color={theme.textSub} />
                    {lang === "ar" ? "تعديل" : "Edit"}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(exp.id); }} style={{
                    background: "transparent",
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
