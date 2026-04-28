import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import GlassCard from "../components/GlassCard";
import { IconChart, IconChevronLeft, IconChevronRight } from "../components/Icons";
import { CATEGORIES, CHART_RAMP, CHART_WARN, CURRENCIES } from "../constants";
import { todayStr, fmtAmt, getDaysInMonth, getWeekStartStr, fmtShortDate } from "../utils";

function ChartTooltip({ active, payload, theme, fmt }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "8px 12px", fontSize: 12, color: theme.text }}>
      {fmt(payload[0].value)}
    </div>
  );
}

export default function ReportsScreen({ expenses, settings, wallets, theme, t, lang, curr }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year,  setYear]  = useState(now.getFullYear());
  const [filterWalletId, setFilterWalletId] = useState(settings.activeWalletId || "all");

  const filterWallet = wallets.find(w => w.id === filterWalletId) || null;
  const walletBudget = filterWallet?.budget || 0;
  const filterCurr = filterWallet
    ? (CURRENCIES.find(c => c.code === filterWallet.currency) || curr)
    : curr;
  const fmt = (n) => fmtAmt(n, filterCurr.symbol, lang, filterCurr.code);

  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();

  const monthExp = expenses.filter(e => {
    const d = new Date(e.date);
    const monthMatch = d.getMonth() === month && d.getFullYear() === year;
    const walletMatch = filterWalletId === "all" || e.walletId === filterWalletId;
    return monthMatch && walletMatch;
  });
  const monthTotal = monthExp.reduce((s, e) => s + Number(e.amount), 0);
  const weekStartDay = settings.weekStart ?? 1;
  const mondayStr = getWeekStartStr(weekStartDay);
  const todayS = todayStr();
  const weekExp = expenses.filter(e => e.date >= mondayStr && e.date <= todayS && (filterWalletId === "all" || e.walletId === filterWalletId));
  const weekTotal = weekExp.reduce((s, e) => s + Number(e.amount), 0);

  const catData = CATEGORIES.map(c => ({
    ...c,
    value: monthExp.filter(e => e.category === c.id).reduce((s, e) => s + Number(e.amount), 0),
  })).filter(c => c.value > 0).sort((a, b) => b.value - a.value)
    .map((c, i) => ({ ...c, color: CHART_RAMP[i % CHART_RAMP.length] }));

  const days = getDaysInMonth(year, month);
  const dailyData = Array.from({ length: days }, (_, i) => {
    const d = String(i + 1).padStart(2, "0");
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${d}`;
    return {
      day: i + 1,
      total: monthExp.filter(e => e.date === dateStr).reduce((s, e) => s + Number(e.amount), 0),
    };
  });
  const maxDay = Math.max(...dailyData.map(d => d.total), 1);

  // Forecast calculations (current month only)
  const forecast = useMemo(() => {
    if (!isCurrentMonth || monthTotal === 0) return null;
    const dayOfMonth = now.getDate();
    const daysInMonth = getDaysInMonth(year, month);
    const daysRemaining = daysInMonth - dayOfMonth;
    const dailyAvg = monthTotal / dayOfMonth;
    const projected = dailyAvg * daysInMonth;
    const budget = walletBudget;
    const projectedVsBudget = budget > 0 ? projected - budget : null;
    const pct = budget > 0 ? Math.min((projected / budget) * 100, 150) : 0;
    return { dayOfMonth, daysInMonth, daysRemaining, dailyAvg, projected, budget, projectedVsBudget, pct };
  }, [isCurrentMonth, monthTotal, month, year, walletBudget]);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const PrevIcon = lang === "ar" ? IconChevronRight : IconChevronLeft;
  const NextIcon = lang === "ar" ? IconChevronLeft : IconChevronRight;

  return (
    <div style={{ height: "100%", overflowY: "auto", position: "relative" }}>
      <div style={{ padding: "52px 20px 84px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <IconChart size={24} color={theme.text} />
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 26, color: theme.text }}>{t.reports}</h2>
        </div>

        {/* Month navigator */}
        <GlassCard theme={theme} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", marginBottom: 18 }}>
          <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex" }}>
            <PrevIcon size={20} color={theme.text} />
          </button>
          <div style={{ fontWeight: 700, fontSize: 16, color: theme.text }}>{t.months[month]} {year}</div>
          <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex" }}>
            <NextIcon size={20} color={theme.text} />
          </button>
        </GlassCard>

        {/* Wallet filter */}
        {wallets.length > 1 && (
          <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18, scrollbarWidth: "none" }}>
            {[{ id: "all", name: t.all }, ...wallets].map(w => {
              const active = filterWalletId === w.id;
              return (
                <button key={w.id} onClick={() => setFilterWalletId(w.id)} style={{
                  flexShrink: 0, padding: "7px 14px", borderRadius: 20,
                  background: active ? theme.accent1 : theme.surface,
                  border: `1px solid ${active ? theme.accent1 : theme.border}`,
                  color: active ? "#fff" : theme.textSub,
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", whiteSpace: "nowrap",
                }}>
                  {w.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
          <GlassCard theme={theme} style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{t.monthlyTotal}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>{fmt(monthTotal)}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>{monthExp.length} {t.transactions}</div>
            {walletBudget > 0 && (() => {
              const rem = walletBudget - monthTotal;
              return (
                <div style={{ fontSize: 11, color: rem >= 0 ? theme.accent1 : "#ef4444", marginTop: 4, fontWeight: 600 }}>
                  {rem >= 0 ? t.remaining : t.overBudget}: {fmt(Math.abs(rem))}
                </div>
              );
            })()}
          </GlassCard>
          <GlassCard theme={theme} style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{t.thisWeek}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>{fmt(weekTotal)}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>
              {fmtShortDate(mondayStr, lang, t.months)} – {fmtShortDate(todayS, lang, t.months)}
            </div>
          </GlassCard>
        </div>

        {/* Smart Forecast (current month only) */}
        {forecast && (
          <GlassCard theme={theme} style={{ padding: "16px 18px", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 14 }}>🔮</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>
                {t.forecast}
              </span>
              <div style={{
                marginLeft: "auto",
                fontSize: 10, fontWeight: 600,
                color: theme.textSub,
                background: theme.surface2,
                borderRadius: 8, padding: "3px 8px",
              }}>
                {forecast.daysRemaining} {t.daysRemaining}
              </div>
            </div>

            {/* Projected + Daily avg row */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <div style={{
                flex: 1, borderRadius: 12, padding: "10px 12px",
                background: theme.surface2,
                border: `1px solid ${theme.border}`,
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                  {t.projectedTotal}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: theme.text }}>
                  {fmt(Math.round(forecast.projected))}
                </div>
              </div>
              <div style={{
                flex: 1, borderRadius: 12, padding: "10px 12px",
                background: theme.surface2,
                border: `1px solid ${theme.border}`,
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                  {t.dailyAvg}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: theme.text }}>
                  {fmt(Math.round(forecast.dailyAvg))}
                </div>
              </div>
            </div>

            {/* Budget comparison bar */}
            {forecast.budget > 0 ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {t.projectedTotal} vs {t.monthlyBudget}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: theme.textSub }}>
                    {Math.round(forecast.pct)}%
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: theme.surface2, overflow: "hidden", marginBottom: 10 }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    width: `${Math.min(forecast.pct, 100)}%`,
                    background: forecast.projectedVsBudget <= 0 ? theme.accent1 : CHART_WARN,
                    transition: "width 0.6s ease",
                  }} />
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: 12, fontWeight: 600,
                  color: forecast.projectedVsBudget <= 0 ? theme.accent1 : CHART_WARN,
                }}>
                  <span style={{ fontSize: 14 }}>{forecast.projectedVsBudget <= 0 ? "✅" : "⚠️"}</span>
                  {forecast.projectedVsBudget <= 0
                    ? t.onTrack
                    : `${t.willExceed} ${fmt(Math.round(forecast.projectedVsBudget))}`}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500 }}>
                💡 {t.noBudgetSet}
              </div>
            )}
          </GlassCard>
        )}

        {/* Category pie chart */}
        {catData.length > 0 && (
          <GlassCard theme={theme} style={{ padding: "18px", marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>{t.byCategory}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Pie chart with center total */}
              <div style={{ position: "relative", width: 180, height: 180, flexShrink: 0 }}>
                <PieChart width={180} height={180}>
                  <Pie data={catData} cx={85} cy={85} innerRadius={52} outerRadius={80} dataKey="value" strokeWidth={0}>
                    {catData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)", textAlign: "center",
                }}>
                  <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{t.spent}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: theme.text }}>{fmt(monthTotal)}</div>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {catData.slice(0, 5).map(c => {
                  const pct = monthTotal > 0 ? Math.round((c.value / monthTotal) * 100) : 0;
                  return (
                    <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 500, flex: 1, color: theme.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.emoji} {t.cats[c.id]}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: theme.textMuted, minWidth: 28, textAlign: "right" }}>{pct}%</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: theme.text }}>{fmt(c.value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Daily bar chart */}
        <GlassCard theme={theme} style={{ padding: "18px", marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>{t.dailyBreakdown}</div>
          {dailyData.some(d => d.total > 0) ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={dailyData} barSize={7}>
                <XAxis dataKey="day" tick={{ fill: theme.textMuted, fontSize: 9 }} tickLine={false} axisLine={false} interval={6} />
                <YAxis hide />
                <Tooltip content={<ChartTooltip theme={theme} fmt={fmt} />} cursor={{ fill: theme.surface2 }} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} fill={theme.accent1} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: "center", color: theme.textMuted, fontSize: 14, padding: "24px 0" }}>{t.noData}</div>
          )}
        </GlassCard>

        {/* Top spend days */}
        {dailyData.filter(d => d.total > 0).length > 0 && (
          <GlassCard theme={theme} style={{ padding: "18px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>{t.topDays}</div>
            {[...dailyData].filter(d => d.total > 0).sort((a, b) => b.total - a.total).slice(0, 5).map((d, i) => (
              <div key={d.day} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                {/* Rank badge */}
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: i === 0 ? theme.accent1 : theme.surface2,
                  border: i > 0 ? `1px solid ${theme.border}` : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                  color: i === 0 ? "#fff" : theme.textSub,
                }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: theme.text, minWidth: 60 }}>
                  {t.months[month]} {d.day}
                </div>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: theme.surface2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    background: theme.accent1,
                    width: `${(d.total / maxDay) * 100}%`,
                    transition: "width 0.4s",
                  }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: theme.text, minWidth: 60, textAlign: lang === "ar" ? "left" : "right" }}>
                  {fmt(d.total)}
                </div>
              </div>
            ))}
          </GlassCard>
        )}
      </div>
    </div>
  );
}
