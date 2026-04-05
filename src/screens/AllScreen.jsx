import { useState, useRef, useCallback } from "react";
import GlassCard from "../components/GlassCard";
import GlowBg from "../components/GlowBg";
import { IconList, IconEdit, IconTrash } from "../components/Icons";
import { cat } from "../constants";
import { todayStr, yesterdayStr, fmtDate, fmtAmt } from "../utils";

const PAGE_SIZE = 20;

export default function AllScreen({ expenses, theme, isDark, t, lang, curr, onEdit, onDelete }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const scrollRef = useRef(null);
  const fmt = (n) => fmtAmt(n, curr.symbol, lang, curr.code);
  const catColor = (id) => isDark ? cat(id).colorDark : cat(id).colorLight;

  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  // Group visible expenses by date
  const grouped = [];
  const seen = {};
  visible.forEach(e => {
    if (!seen[e.date]) { seen[e.date] = true; grouped.push({ date: e.date, items: [] }); }
    grouped.find(g => g.date === e.date).items.push(e);
  });

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || loading || !hasMore) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 200) {
      setLoading(true);
      setTimeout(() => {
        setVisibleCount(v => v + PAGE_SIZE);
        setLoading(false);
      }, 300);
    }
  }, [loading, hasMore]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <GlowBg theme={theme} style={{ position: "fixed" }} />

      {/* Header */}
      <div style={{ padding: "56px 24px 16px", flexShrink: 0, position: "relative", zIndex: 1, background: theme.bg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <IconList size={24} color={theme.text} />
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 26, color: theme.text }}>
            {t.allExpenses}
          </h2>
        </div>
        <div style={{ fontSize: 13, color: theme.textMuted, marginLeft: 34 }}>
          {sorted.length} {t.transactions}
        </div>
      </div>

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: "auto", padding: "0 16px", paddingBottom: 100, position: "relative", zIndex: 1 }}
      >
        {grouped.length === 0 ? (
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
        ) : grouped.map(group => (
          <div key={group.date}>
            {/* Date header */}
            <div style={{
              fontSize: 11, fontWeight: 700, color: theme.textMuted,
              letterSpacing: 1.2, textTransform: "uppercase",
              padding: "8px 8px 6px", marginTop: 4,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span>
                {group.date === todayStr() ? t.today
                  : group.date === yesterdayStr() ? t.yesterday
                  : fmtDate(group.date, lang, t.months)}
              </span>
              <span style={{ fontWeight: 800, color: theme.accent1, fontSize: 12, direction: "ltr" }}>
                {fmt(group.items.reduce((s, e) => s + Number(e.amount), 0))}
              </span>
            </div>

            {/* Expense rows */}
            {group.items.map(exp => {
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
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ textAlign: "center", padding: "16px 0", color: theme.textMuted, fontSize: 13, fontWeight: 600 }}>
            {t.loadingMore}
          </div>
        )}
      </div>
    </div>
  );
}
