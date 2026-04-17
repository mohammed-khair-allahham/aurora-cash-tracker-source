import { useState, useMemo } from "react";
import GlassCard from "../components/GlassCard";
import { IconList, IconEdit, IconTrash, IconChevronLeft, IconChevronRight } from "../components/Icons";
import { cat, CURRENCIES } from "../constants";
import { todayStr, yesterdayStr, fmtDate, fmtAmt } from "../utils";

export default function AllScreen({ expenses, settings, wallets, theme, t, lang, curr, onEdit, onDelete }) {
  const now = new Date();
  const [selYear, setSelYear] = useState(now.getFullYear());
  const [selMonth, setSelMonth] = useState(now.getMonth());
  const [expandedId, setExpandedId] = useState(null);
  const [filterWalletId, setFilterWalletId] = useState(settings?.activeWalletId || wallets[0]?.id || "all");
  const walletCurrFor = (walletId) => {
    const w = wallets.find(x => x.id === walletId);
    return CURRENCIES.find(c => c.code === w?.currency) || curr;
  };
  const filterCurr = filterWalletId === "all" ? curr : walletCurrFor(filterWalletId);
  const fmt = (n) => fmtAmt(n, filterCurr.symbol, lang, filterCurr.code);
  const fmtExp = (exp) => {
    const c = filterWalletId === "all" ? walletCurrFor(exp.walletId) : filterCurr;
    return fmtAmt(exp.amount, c.symbol, lang, c.code);
  };
  const isRTL = lang === "ar";

  // Filter expenses for selected month + wallet
  const monthExp = useMemo(() => {
    return expenses.filter(e => {
      const d = new Date(e.date);
      const monthMatch = d.getMonth() === selMonth && d.getFullYear() === selYear;
      const walletMatch = filterWalletId === "all" || e.walletId === filterWalletId;
      return monthMatch && walletMatch;
    });
  }, [expenses, selMonth, selYear, filterWalletId]);

  const monthTotal = monthExp.reduce((s, e) => s + Number(e.amount), 0);

  // Sort and group by date
  const sorted = [...monthExp].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const grouped = [];
  const seen = {};
  sorted.forEach(e => {
    if (!seen[e.date]) { seen[e.date] = true; grouped.push({ date: e.date, items: [] }); }
    grouped.find(g => g.date === e.date).items.push(e);
  });

  const goMonth = (dir) => {
    setExpandedId(null);
    let m = selMonth + dir;
    let y = selYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setSelMonth(m);
    setSelYear(y);
  };

  const isCurrentMonth = selMonth === now.getMonth() && selYear === now.getFullYear();
  const monthLabel = `${t.months[selMonth]} ${selYear}`;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ padding: "56px 24px 0", flexShrink: 0, position: "relative", zIndex: 1, background: theme.bg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <IconList size={24} color={theme.text} />
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 26, color: theme.text }}>
            {t.allExpenses}
          </h2>
        </div>

        {/* Month switcher */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: 14, padding: "6px 6px",
          marginBottom: 16,
        }}>
          <button onClick={() => goMonth(isRTL ? 1 : -1)} style={{
            width: 36, height: 36, borderRadius: 10,
            background: theme.surface2,
            border: `1px solid ${theme.border}`,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {isRTL
              ? <IconChevronRight size={18} color={theme.text} />
              : <IconChevronLeft size={18} color={theme.text} />}
          </button>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>
              {monthLabel}
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: theme.textSub, marginTop: 2 }}>
              {fmt(monthTotal)} · {sorted.length} {t.transactions}
            </div>
          </div>

          <button onClick={() => goMonth(isRTL ? -1 : 1)} style={{
            width: 36, height: 36, borderRadius: 10,
            background: isCurrentMonth ? "transparent" : theme.surface2,
            border: `1px solid ${isCurrentMonth ? "transparent" : theme.border}`,
            cursor: isCurrentMonth ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: isCurrentMonth ? 0.25 : 1,
            pointerEvents: isCurrentMonth ? "none" : "auto",
          }}>
            {isRTL
              ? <IconChevronLeft size={18} color={theme.text} />
              : <IconChevronRight size={18} color={theme.text} />}
          </button>
        </div>
        {/* Wallet filter pills (only when multiple wallets exist) */}
        {wallets.length > 1 && (
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}>
            {[{ id: "all", name: t.all },...wallets].map(w => {
              const active = filterWalletId === w.id;
              return (
                <button key={w.id} onClick={() => { setFilterWalletId(w.id); setExpandedId(null); }} style={{
                  flexShrink: 0, padding: "7px 14px", borderRadius: 20,
                  background: active ? theme.accent1 : theme.surface,
                  border: `1px solid ${active ? theme.accent1 : theme.border}`,
                  color: active ? "#fff" : theme.textSub,
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}>
                  {w.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Scrollable list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px", paddingBottom: 100, position: "relative", zIndex: 1 }}>
        {grouped.length === 0 ? (
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
        ) : grouped.map(group => (
          <div key={group.date}>
            {/* Date header */}
            <div style={{
              fontSize: 11, fontWeight: 600, color: theme.textMuted,
              letterSpacing: 1, textTransform: "uppercase",
              padding: "8px 8px 6px", marginTop: 4,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span>
                {group.date === todayStr() ? t.today
                  : group.date === yesterdayStr() ? t.yesterday
                  : fmtDate(group.date, lang, t.months)}
              </span>
              <span style={{ fontWeight: 700, color: theme.textSub, fontSize: 12, direction: "ltr" }}>
                {fmt(group.items.reduce((s, e) => s + Number(e.amount), 0))}
              </span>
            </div>

            {/* Expense rows */}
            {group.items.map(exp => {
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
                      <div style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>{fmtExp(exp)}</div>
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
        ))}
      </div>
    </div>
  );
}
