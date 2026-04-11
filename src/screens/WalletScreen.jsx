import { useState } from "react";
import GlassCard from "../components/GlassCard";
import GlowBg from "../components/GlowBg";
import { IconWallet, IconArrowUp, IconPlus, IconTrash } from "../components/Icons";
import { CURRENCIES } from "../constants";
import { fmtAmt, todayStr, fmtDate } from "../utils";

export default function WalletScreen({
  expenses, settings, walletTxns, wallets,
  onTopUp, onDeleteTopUp, onAddWallet, onDeleteWallet, onSetActiveWallet, onSettingsChange,
  theme, isDark, t, lang,
}) {
  const [selectedId, setSelectedId] = useState(settings.activeWalletId || wallets[0]?.id);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpNote, setTopUpNote] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletCurrency, setNewWalletCurrency] = useState(CURRENCIES[0].code);

  const selectedWallet = wallets.find(w => w.id === selectedId) || wallets[0];
  const walletCurr = CURRENCIES.find(c => c.code === selectedWallet?.currency) || CURRENCIES[0];
  const fmt = (n) => fmtAmt(n, walletCurr.symbol, lang, walletCurr.code);
  const isActive = selectedWallet?.id === settings.activeWalletId;

  const walletTxnsFiltered = walletTxns.filter(t => t.walletId === selectedWallet?.id);
  const walletExpenses = expenses.filter(e => e.walletId === selectedWallet?.id);
  const totalTopUps = walletTxnsFiltered.reduce((s, tx) => s + Number(tx.amount), 0);
  const totalExpenses = walletExpenses.reduce((s, e) => s + Number(e.amount), 0);

  const canDelete = wallets.length > 1 &&
    !expenses.some(e => e.walletId === selectedWallet?.id) &&
    !walletTxns.some(t => t.walletId === selectedWallet?.id);

  const sorted = [...walletTxnsFiltered].sort((a, b) => {
    const dc = b.date.localeCompare(a.date);
    return dc !== 0 ? dc : String(b.id).localeCompare(String(a.id));
  });

  const handleTopUp = () => {
    const amt = Number(topUpAmount);
    if (!amt || amt <= 0) return;
    onTopUp({ amount: amt, note: topUpNote, date: todayStr(), walletId: selectedWallet.id });
    setTopUpAmount(""); setTopUpNote(""); setShowTopUp(false);
  };

  const handleAddWallet = () => {
    const name = newWalletName.trim() || t.defaultWallet;
    onAddWallet(name, newWalletCurrency);
    setNewWalletName(""); setNewWalletCurrency(CURRENCIES[0].code); setShowAddWallet(false);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <GlowBg theme={theme} style={{ position: "fixed" }} />

      {/* Header */}
      <div style={{ padding: "56px 24px 16px", flexShrink: 0, position: "relative", zIndex: 1, background: theme.bg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <IconWallet size={24} color={theme.text} />
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 26, color: theme.text }}>{t.wallets}</h2>
        </div>

        {/* Wallet chips row */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 16, scrollbarWidth: "none" }}>
          {wallets.map(w => {
            const wCurr = CURRENCIES.find(c => c.code === w.currency) || CURRENCIES[0];
            const active = w.id === selectedId;
            const isActiveWallet = w.id === settings.activeWalletId;
            return (
              <button
                key={w.id}
                onClick={() => { setSelectedId(w.id); setShowTopUp(false); setExpandedId(null); }}
                style={{
                  flexShrink: 0, padding: "8px 16px", borderRadius: 20,
                  background: active ? theme.btnGrad : theme.glass,
                  border: active ? "none" : `1px solid ${theme.glassBorder}`,
                  color: active ? "#fff" : theme.textSub,
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: "inherit", backdropFilter: "blur(12px)",
                  display: "flex", alignItems: "center", gap: 6,
                  whiteSpace: "nowrap",
                }}
              >
                {isActiveWallet && <span style={{ fontSize: 10 }}>✓</span>}
                {w.name}
                <span style={{ fontSize: 11, opacity: 0.8 }}>{wCurr.symbol}</span>
              </button>
            );
          })}

          {/* Add wallet button */}
          <button
            onClick={() => setShowAddWallet(v => !v)}
            style={{
              flexShrink: 0, width: 36, height: 36, borderRadius: 12,
              background: theme.glass, border: `1px solid ${theme.glassBorder}`,
              color: theme.accent1, fontSize: 20, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <IconPlus size={16} color={theme.accent1} />
          </button>
        </div>

        {/* Add wallet form */}
        {showAddWallet && (
          <GlassCard theme={theme} style={{ padding: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.textSub, marginBottom: 10 }}>{t.addWallet}</div>
            <input
              value={newWalletName}
              onChange={e => setNewWalletName(e.target.value)}
              placeholder={t.walletName}
              autoFocus
              style={{
                width: "100%", boxSizing: "border-box",
                background: theme.inputBg, border: `1px solid ${theme.inputBorder}`,
                borderRadius: 12, padding: "11px 14px",
                color: theme.text, fontSize: 14, fontFamily: "inherit", outline: "none",
                marginBottom: 8,
              }}
            />
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              {CURRENCIES.map(c => (
                <button
                  key={c.code}
                  onClick={() => setNewWalletCurrency(c.code)}
                  style={{
                    flex: 1, padding: "10px 8px", borderRadius: 12,
                    background: newWalletCurrency === c.code ? theme.btnGrad : theme.glass,
                    border: newWalletCurrency === c.code ? "none" : `1px solid ${theme.glassBorder}`,
                    color: newWalletCurrency === c.code ? "#fff" : theme.textSub,
                    fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {c.symbol} {c.code}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowAddWallet(false)} style={{
                flex: 1, padding: "10px", background: theme.glass,
                border: `1px solid ${theme.glassBorder}`, borderRadius: 10,
                color: theme.text, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13,
              }}>{t.cancel}</button>
              <button onClick={handleAddWallet} style={{
                flex: 1, padding: "10px", background: theme.btnGrad,
                border: "none", borderRadius: 10, color: "#fff",
                cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13,
              }}>{t.addWallet}</button>
            </div>
          </GlassCard>
        )}

        {/* Selected wallet balance card */}
        {selectedWallet && (
          <GlassCard theme={theme} variant="wallet" style={{ padding: 0, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ height: 3, background: theme.walletAccent }} />
            <div style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>
                    {selectedWallet.name}
                  </div>
                  <div style={{
                    fontSize: 34, fontWeight: 900, lineHeight: 1.1,
                    color: (selectedWallet.balance || 0) >= 0 ? theme.accent1 : "#ef4444",
                  }}>
                    {fmt(selectedWallet.balance || 0)}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                  {!isActive && (
                    <button onClick={() => onSetActiveWallet(selectedWallet.id)} style={{
                      padding: "6px 12px", borderRadius: 10,
                      background: isDark ? "rgba(0,229,160,0.12)" : "rgba(5,150,105,0.08)",
                      border: `1px solid ${isDark ? "rgba(0,229,160,0.25)" : "rgba(5,150,105,0.2)"}`,
                      color: theme.accent1, fontSize: 11, fontWeight: 700, cursor: "pointer",
                      fontFamily: "inherit", whiteSpace: "nowrap",
                    }}>
                      ✓ {t.setActive}
                    </button>
                  )}
                  {isActive && (
                    <span style={{
                      padding: "5px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700,
                      color: theme.accent1,
                      background: isDark ? "rgba(0,229,160,0.10)" : "rgba(5,150,105,0.07)",
                      border: `1px solid ${isDark ? "rgba(0,229,160,0.2)" : "rgba(5,150,105,0.15)"}`,
                    }}>✓ {t.activeWallet}</span>
                  )}
                  <button
                    onClick={() => canDelete && onDeleteWallet(selectedWallet.id)}
                    title={!canDelete ? t.cannotDeleteWallet : t.deleteWallet}
                    style={{
                      padding: "5px 10px", borderRadius: 10,
                      background: canDelete
                        ? (isDark ? "rgba(239,68,68,0.10)" : "rgba(239,68,68,0.07)")
                        : "transparent",
                      border: canDelete ? "1px solid rgba(239,68,68,0.25)" : `1px solid ${theme.glassBorder}`,
                      color: canDelete ? "#ef4444" : theme.textMuted,
                      fontSize: 11, fontWeight: 600, cursor: canDelete ? "pointer" : "not-allowed",
                      fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4,
                    }}
                  >
                    <IconTrash size={12} color={canDelete ? "#ef4444" : theme.textMuted} />
                    {t.deleteWallet}
                  </button>
                </div>
              </div>

              {/* Summary row */}
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{
                  flex: 1, padding: "9px 12px", borderRadius: 12,
                  background: isDark ? "rgba(0,229,160,0.08)" : "rgba(5,150,105,0.06)",
                  border: `1px solid ${isDark ? "rgba(0,229,160,0.15)" : "rgba(5,150,105,0.12)"}`,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", marginBottom: 3 }}>
                    {t.totalTopUps}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: theme.accent1 }}>+{fmt(totalTopUps)}</div>
                </div>
                <div style={{
                  flex: 1, padding: "9px 12px", borderRadius: 12,
                  background: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)",
                  border: `1px solid ${isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.12)"}`,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", marginBottom: 3 }}>
                    {t.totalExpenses}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#ef4444" }}>-{fmt(totalExpenses)}</div>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Top Up button */}
        {!showTopUp ? (
          <button onClick={() => setShowTopUp(true)} style={{
            width: "100%", padding: "13px",
            background: theme.btnGrad, border: "none", borderRadius: 14,
            color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: "0 4px 16px rgba(56,189,248,0.2)", marginBottom: 14,
          }}>
            <IconPlus size={16} color="#fff" style={{ strokeWidth: 2.5 }} />
            {t.topUp}
          </button>
        ) : (
          <GlassCard theme={theme} style={{ padding: "14px", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.textSub, marginBottom: 10 }}>{t.topUpHint}</div>
            <input
              type="number" value={topUpAmount}
              onChange={e => setTopUpAmount(e.target.value)}
              placeholder={t.topUpAmount}
              autoFocus
              style={{
                width: "100%", boxSizing: "border-box",
                background: theme.inputBg, border: `1px solid ${theme.inputBorder}`,
                borderRadius: 12, padding: "12px 14px",
                color: theme.text, fontSize: 16, fontWeight: 700,
                fontFamily: "inherit", outline: "none", marginBottom: 8,
              }}
            />
            <input
              value={topUpNote}
              onChange={e => setTopUpNote(e.target.value)}
              placeholder={lang === "ar" ? "ملاحظة (اختياري)" : "Note (optional)"}
              style={{
                width: "100%", boxSizing: "border-box",
                background: theme.inputBg, border: `1px solid ${theme.inputBorder}`,
                borderRadius: 12, padding: "12px 14px",
                color: theme.text, fontSize: 14,
                fontFamily: "inherit", outline: "none", marginBottom: 12,
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowTopUp(false)} style={{
                flex: 1, padding: "11px", background: theme.glass,
                border: `1px solid ${theme.glassBorder}`, borderRadius: 12,
                color: theme.text, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13,
              }}>{t.cancel}</button>
              <button onClick={handleTopUp} style={{
                flex: 1, padding: "11px",
                background: Number(topUpAmount) > 0 ? theme.btnGrad : theme.glass,
                border: Number(topUpAmount) > 0 ? "none" : `1px solid ${theme.glassBorder}`,
                borderRadius: 12,
                color: Number(topUpAmount) > 0 ? "#fff" : theme.textMuted,
                cursor: Number(topUpAmount) > 0 ? "pointer" : "not-allowed",
                fontFamily: "inherit", fontWeight: 700, fontSize: 13,
              }}>{t.topUp}</button>
            </div>
          </GlassCard>
        )}

        {/* Monthly budget */}
        <GlassCard theme={theme} style={{ padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.textSub }}>{t.monthlyBudget}</div>
            <input
              type="number"
              value={settings.monthlyBudget || ""}
              onChange={e => onSettingsChange(s => ({ ...s, monthlyBudget: e.target.value === "" ? 0 : Number(e.target.value) }))}
              placeholder="0"
              style={{
                width: 120, boxSizing: "border-box",
                background: theme.inputBg, border: `1px solid ${theme.inputBorder}`,
                borderRadius: 10, padding: "8px 12px",
                color: theme.text, fontSize: 14, fontWeight: 700,
                fontFamily: "inherit", outline: "none", textAlign: "center",
                colorScheme: isDark ? "dark" : "light",
              }}
            />
          </div>
        </GlassCard>

        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>
          {t.topUps}
        </div>
      </div>

      {/* Top-ups list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px", paddingBottom: 100, position: "relative", zIndex: 1 }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 24px", color: theme.textMuted }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: theme.glass, border: `1px solid ${theme.glassBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px",
            }}>
              <IconWallet size={28} color={theme.textMuted} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: theme.textSub }}>{t.noWalletActivity}</div>
            <div style={{ fontSize: 13 }}>{t.noWalletActivityHint}</div>
          </div>
        ) : sorted.map(tx => {
          const color = theme.accent1;
          const borderSide = lang === "ar" ? "borderRight" : "borderLeft";
          const isExpanded = expandedId === tx.id;
          return (
            <GlassCard key={tx.id} theme={theme} style={{
              padding: "12px 14px", marginBottom: 8,
              [borderSide]: `3px solid ${color}`, cursor: "pointer",
            }} onClick={() => setExpandedId(isExpanded ? null : tx.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: isDark ? "rgba(0,229,160,0.12)" : "rgba(5,150,105,0.08)",
                  border: `1px solid ${isDark ? "rgba(0,229,160,0.25)" : "rgba(5,150,105,0.2)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <IconArrowUp size={20} color={color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: theme.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
              <div style={{
                maxHeight: isExpanded ? 48 : 0, opacity: isExpanded ? 1 : 0,
                overflow: "hidden", transition: "max-height 0.25s ease, opacity 0.2s ease",
              }}>
                <div style={{
                  display: "flex", gap: 8,
                  justifyContent: lang === "ar" ? "flex-start" : "flex-end",
                  paddingTop: 10,
                }}>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteTopUp(tx.id); setExpandedId(null); }} style={{
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
