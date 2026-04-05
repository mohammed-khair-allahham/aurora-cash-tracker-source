import { useState } from "react";
import GlassCard from "../components/GlassCard";
import GlowBg from "../components/GlowBg";
import { IconSettings, IconGlobe, IconMoon, IconSun, IconCoin, IconWallet, IconBell, IconTrash, IconBook, IconChevronRight, IconChevronLeft } from "../components/Icons";
import { CURRENCIES } from "../constants";

function Section({ title, icon, children, theme }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: theme.textMuted,
        letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function ToggleGroup({ options, value, onChange, theme }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {options.map(opt => {
        const active = value === opt.value;
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} style={{
            flex: 1, padding: "12px 8px",
            background: active ? theme.btnGrad : theme.glass,
            border: active ? "none" : `1px solid ${theme.glassBorder}`,
            borderRadius: 24, cursor: "pointer",
            color: active ? "#fff" : theme.textSub,
            fontFamily: "inherit", fontWeight: 700, fontSize: 14,
            backdropFilter: "blur(12px)",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: active ? "scale(1.02)" : "scale(1)",
            boxShadow: active ? "0 4px 16px rgba(56,189,248,0.2)" : "none",
          }}>{opt.label}</button>
        );
      })}
    </div>
  );
}

export default function SettingsScreen({ settings, onChange, theme, isDark, t, lang, notif, onRequestNotif, onClear, onOpenGuide }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const set = (key, val) => onChange(s => ({ ...s, [key]: val }));
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  return (
    <div style={{ height: "100%", overflowY: "auto", position: "relative" }}>
      <GlowBg theme={theme} />
      <div style={{ padding: "52px 20px 84px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <IconSettings size={24} color={theme.text} />
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 26, color: theme.text }}>{t.settings}</h2>
        </div>

        <Section title={t.language} icon={<IconGlobe size={14} color={theme.textMuted} />} theme={theme}>
          <ToggleGroup
            theme={theme}
            options={[{ value: "en", label: "English" }, { value: "ar", label: "العربية" }]}
            value={settings.lang}
            onChange={v => set("lang", v)}
          />
        </Section>

        <Section title={t.theme} icon={isDark ? <IconMoon size={14} color={theme.textMuted} /> : <IconSun size={14} color={theme.textMuted} />} theme={theme}>
          <ToggleGroup
            theme={theme}
            options={[
              { value: "dark",  label: `🌙 ${t.dark}` },
              { value: "light", label: `☀️ ${t.light}` },
            ]}
            value={settings.theme}
            onChange={v => set("theme", v)}
          />
        </Section>

        <Section title={t.currency} icon={<IconCoin size={14} color={theme.textMuted} />} theme={theme}>
          <ToggleGroup
            theme={theme}
            options={CURRENCIES.map(c => ({ value: c.code, label: `${c.symbol} ${c.code}` }))}
            value={settings.currency}
            onChange={v => set("currency", v)}
          />
        </Section>

        <Section title={t.reminderTime} icon={<IconBell size={14} color={theme.textMuted} />} theme={theme}>
          <GlassCard theme={theme} style={{ padding: "4px 4px" }}>
            {notif ? (
              <div style={{ padding: "10px 14px" }}>
                <div style={{ fontSize: 12, color: isDark ? "#34d399" : "#059669", fontWeight: 600, marginBottom: 8 }}>
                  ✅ {t.notifOn}
                </div>
                <input
                  type="time" value={settings.reminderTime}
                  onChange={e => set("reminderTime", e.target.value)}
                  style={{
                    width: "100%", background: theme.inputBg,
                    border: `1px solid ${theme.inputBorder}`,
                    borderRadius: 10, padding: "12px 14px",
                    color: theme.text, fontSize: 15,
                    fontFamily: "inherit", outline: "none",
                    boxSizing: "border-box",
                    colorScheme: isDark ? "dark" : "light",
                  }}
                />
              </div>
            ) : (
              <div>
                <button onClick={onRequestNotif} style={{
                  width: "100%", padding: "14px",
                  background: "none", border: "none",
                  color: isDark ? "#fbbf24" : "#d97706",
                  fontSize: 14, cursor: "pointer",
                  fontWeight: 700, fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <IconBell size={16} color={isDark ? "#fbbf24" : "#d97706"} /> {t.enableNotif}
                </button>
                {isIOS && !isStandalone && (
                  <div style={{ fontSize: 11, color: theme.textMuted, textAlign: "center", padding: "0 12px 10px" }}>
                    {t.iosNotifNote}
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        </Section>

        <Section title={t.guide} icon={<IconBook size={14} color={theme.textMuted} />} theme={theme}>
          <button onClick={onOpenGuide} style={{
            width: "100%", padding: "14px 16px",
            background: theme.glass,
            border: `1px solid ${theme.glassBorder}`,
            borderRadius: 14, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: "inherit", fontWeight: 600, fontSize: 14,
            color: theme.text, backdropFilter: "blur(12px)",
          }}>
            <IconBook size={18} color={theme.accent1} />
            <span style={{ flex: 1, textAlign: lang === "ar" ? "right" : "left" }}>{t.guideTitle}</span>
            {lang === "ar"
              ? <IconChevronLeft size={16} color={theme.textMuted} />
              : <IconChevronRight size={16} color={theme.textMuted} />
            }
          </button>
        </Section>

        <Section title={t.clearData} icon={<IconTrash size={14} color={theme.textMuted} />} theme={theme}>
          {!confirmClear ? (
            <button onClick={() => setConfirmClear(true)} style={{
              width: "100%", padding: "14px",
              background: isDark ? "rgba(239,68,68,0.10)" : "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 14, color: "#ef4444",
              fontSize: 14, cursor: "pointer", fontWeight: 700, fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <IconTrash size={16} color="#ef4444" /> {t.clearData}
            </button>
          ) : (
            <GlassCard theme={theme} style={{ padding: 16, border: "1px solid rgba(239,68,68,0.3)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 14 }}>{t.clearConfirm}</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setConfirmClear(false)} style={{
                  flex: 1, padding: "11px", background: theme.glass,
                  border: `1px solid ${theme.glassBorder}`,
                  borderRadius: 10, color: theme.text,
                  cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13,
                }}>{t.cancel}</button>
                <button onClick={() => { onClear(); setConfirmClear(false); }} style={{
                  flex: 1, padding: "11px", background: "#ef4444",
                  border: "none", borderRadius: 10, color: "#fff",
                  cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13,
                }}>{t.confirm}</button>
              </div>
            </GlassCard>
          )}
        </Section>

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 4 }}>{t.dataInfo}</div>
          <div style={{ fontSize: 11, color: theme.textMuted, opacity: 0.6 }}>{t.version}</div>
        </div>
      </div>
    </div>
  );
}
