import { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import GlassCard from "../components/GlassCard";
import GlowBg from "../components/GlowBg";
import { CATEGORIES } from "../constants";
import { todayStr, fmtAmt, getDaysInMonth, getMondayStr, fmtShortDate } from "../utils";

function ChartTooltip({ active, payload, theme, fmt }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: theme.navBg, border: `1px solid ${theme.glassBorder}`, borderRadius: 10, padding: "8px 12px", fontSize: 12, color: theme.text }}>
      {fmt(payload[0].value)}
    </div>
  );
}

export default function ReportsScreen({ expenses, theme, isDark, t, lang, curr }) {
  const fmt = (n) => fmtAmt(n, curr.symbol, lang);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year,  setYear]  = useState(now.getFullYear());

  const monthExp = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
  const monthTotal = monthExp.reduce((s, e) => s + Number(e.amount), 0);
  const mondayStr = getMondayStr();
  const todayS = todayStr();
  const weekExp = expenses.filter(e => e.date >= mondayStr && e.date <= todayS);
  const weekTotal = weekExp.reduce((s, e) => s + Number(e.amount), 0);

  const catData = CATEGORIES.map(c => ({
    ...c,
    value: monthExp.filter(e => e.category === c.id).reduce((s, e) => s + Number(e.amount), 0),
    color: isDark ? c.colorDark : c.colorLight,
  })).filter(c => c.value > 0).sort((a, b) => b.value - a.value);

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

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <div style={{ height: "100%", overflowY: "auto", position: "relative" }}>
      <GlowBg theme={theme} />
      <div style={{ padding: "52px 20px 84px", position: "relative", zIndex: 1 }}>
        <h2 style={{ margin: "0 0 22px", fontWeight: 900, fontSize: 26, color: theme.text }}>📊 {t.reports}</h2>

        {/* Month navigator */}
        <GlassCard theme={theme} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", marginBottom: 18 }}>
          <button onClick={prevMonth} style={{ background: "none", border: "none", color: theme.text, fontSize: 22, cursor: "pointer", padding: "0 6px" }}>
            {lang === "ar" ? "›" : "‹"}
          </button>
          <div style={{ fontWeight: 800, fontSize: 17, color: theme.text }}>{t.months[month]} {year}</div>
          <button onClick={nextMonth} style={{ background: "none", border: "none", color: theme.text, fontSize: 22, cursor: "pointer", padding: "0 6px" }}>
            {lang === "ar" ? "‹" : "›"}
          </button>
        </GlassCard>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
          <GlassCard theme={theme} style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: theme.textSub, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{t.monthlyTotal}</div>
            <div style={{ fontSize: 22, fontWeight: 900, background: theme.totalGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{fmt(monthTotal)}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>{monthExp.length} {t.transactions}</div>
          </GlassCard>
          <GlassCard theme={theme} style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: theme.textSub, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{t.thisWeek}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: isDark ? "#fbbf24" : "#d97706" }}>{fmt(weekTotal)}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>
              {fmtShortDate(mondayStr, lang, t.months)} – {fmtShortDate(todayS, lang, t.months)}
            </div>
          </GlassCard>
        </div>

        {/* Category pie chart */}
        {catData.length > 0 && (
          <GlassCard theme={theme} style={{ padding: "18px", marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>{t.byCategory}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <PieChart width={130} height={130}>
                <Pie data={catData} cx={60} cy={60} innerRadius={38} outerRadius={60} dataKey="value" strokeWidth={0}>
                  {catData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div style={{ flex: 1 }}>
                {catData.slice(0, 5).map(c => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: theme.text }}>{c.emoji} {t.cats[c.id]}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: c.color }}>{fmt(c.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Daily bar chart */}
        <GlassCard theme={theme} style={{ padding: "18px", marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>{t.dailyBreakdown}</div>
          {dailyData.some(d => d.total > 0) ? (
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={dailyData} barSize={6}>
                <XAxis dataKey="day" tick={{ fill: theme.textMuted, fontSize: 9 }} tickLine={false} axisLine={false} interval={6} />
                <YAxis hide />
                <Tooltip content={<ChartTooltip theme={theme} fmt={fmt} />} />
                <Bar dataKey="total" radius={[3, 3, 0, 0]} fill={isDark ? "#38bdf8" : "#0ea5e9"} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: "center", color: theme.textMuted, fontSize: 14, padding: "24px 0" }}>{t.noData}</div>
          )}
        </GlassCard>

        {/* Top spend days */}
        {dailyData.filter(d => d.total > 0).length > 0 && (
          <GlassCard theme={theme} style={{ padding: "18px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>{t.topDays}</div>
            {[...dailyData].filter(d => d.total > 0).sort((a, b) => b.total - a.total).slice(0, 5).map(d => (
              <div key={d.day} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, minWidth: 70 }}>
                  {t.months[month]} {d.day}
                </div>
                <div style={{ flex: 1, height: 5, borderRadius: 3, background: theme.divider, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    background: `linear-gradient(90deg, ${isDark ? "#38bdf8" : "#0ea5e9"}, ${isDark ? "#818cf8" : "#4f46e5"})`,
                    width: `${(d.total / maxDay) * 100}%`,
                    transition: "width 0.4s",
                  }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: isDark ? "#38bdf8" : "#0369a1", minWidth: 60, textAlign: lang === "ar" ? "left" : "right" }}>
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
