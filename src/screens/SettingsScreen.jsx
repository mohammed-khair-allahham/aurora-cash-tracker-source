import { useState, useRef } from "react";
import GlassCard from "../components/GlassCard";
import GlowBg from "../components/GlowBg";
import { IconSettings, IconGlobe, IconMoon, IconSun, IconBell, IconTrash, IconBook,
  IconChevronRight, IconChevronLeft, IconCalendar, IconShield, IconLock, IconDownload, IconUpload } from "../components/Icons";
import { ls } from "../utils";

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

// 6-digit PIN entry (dots + hidden input)
function PinEntry({ label, value, onChange, theme }) {
  const inputRef = useRef(null);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: theme.textSub, marginBottom: 10 }}>{label}</div>
      <div style={{ position: "relative", cursor: "text" }} onClick={() => inputRef.current?.focus()}>
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={value}
          onChange={e => { if (/^\d*$/.test(e.target.value)) onChange(e.target.value); }}
          style={{
            position: "absolute", opacity: 0, width: "100%", height: "100%",
            top: 0, left: 0, cursor: "text",
          }}
          autoComplete="new-password"
        />
        <div style={{ display: "flex", gap: 12, justifyContent: "center", padding: "14px 0" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              width: 18, height: 18, borderRadius: "50%",
              background: i < value.length ? theme.accent1 : "transparent",
              border: `2px solid ${i < value.length ? theme.accent1 : theme.textMuted}`,
              transition: "background 0.15s, border-color 0.15s",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SettingsScreen({ settings, onChange, theme, isDark, t, lang, notif, onRequestNotif, onClear, onOpenGuide, onSavePin, onDisablePin, onExport, onImport }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const set = (key, val) => onChange(s => ({ ...s, [key]: val }));
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  // PIN state
  const pinEnabled = !!ls("ct_pin", {}).enabled;
  const [pinMode, setPinMode] = useState(null); // null | "enable-new" | "enable-confirm" | "disable-current" | "change-current" | "change-new" | "change-confirm"
  const [pinA, setPinA] = useState(""); // first pin
  const [pinB, setPinB] = useState(""); // confirmation or new pin
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState(false);

  const resetPinUi = () => { setPinMode(null); setPinA(""); setPinB(""); setPinError(""); };

  const handleEnableStep1 = () => {
    if (pinA.length !== 6) return;
    setPinMode("enable-confirm"); setPinB(""); setPinError("");
  };
  const handleEnableStep2 = async () => {
    if (pinB.length !== 6) return;
    if (pinA !== pinB) { setPinError(t.pinMismatch); setPinB(""); return; }
    await onSavePin(pinA);
    setPinSuccess(true);
    setTimeout(() => { setPinSuccess(false); resetPinUi(); }, 1500);
  };

  const verifyCurrentPin = async (pin, onSuccess) => {
    const data = new TextEncoder().encode(pin);
    const buf = await crypto.subtle.digest("SHA-256", data);
    const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    const stored = ls("ct_pin", {}).hash;
    if (hash !== stored) { setPinError(t.wrongPin); setPinA(""); return; }
    onSuccess();
  };

  const handleDisableVerify = async () => {
    if (pinA.length !== 6) return;
    await verifyCurrentPin(pinA, () => { onDisablePin(); resetPinUi(); });
  };

  const handleChangeVerify = async () => {
    if (pinA.length !== 6) return;
    await verifyCurrentPin(pinA, () => { setPinMode("change-new"); setPinA(""); setPinError(""); });
  };

  const handleChangeNew = () => {
    if (pinA.length !== 6) return;
    setPinMode("change-confirm"); setPinB(""); setPinError("");
  };

  const handleChangeConfirm = async () => {
    if (pinB.length !== 6) return;
    if (pinA !== pinB) { setPinError(t.pinMismatch); setPinB(""); return; }
    await onSavePin(pinA);
    setPinSuccess(true);
    setTimeout(() => { setPinSuccess(false); resetPinUi(); }, 1500);
  };

  // Import
  const importRef = useRef(null);
  const [importConfirm, setImportConfirm] = useState(null); // holds the File
  const [importMsg, setImportMsg] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportConfirm(file);
    e.target.value = "";
  };

  const doImport = () => {
    if (!importConfirm) return;
    onImport(importConfirm,
      () => { setImportMsg(t.importSuccess); setImportConfirm(null); setTimeout(() => setImportMsg(""), 3000); },
      () => { setImportMsg(t.importError); setImportConfirm(null); setTimeout(() => setImportMsg(""), 3000); }
    );
  };

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

        <Section title={t.weekStart} icon={<IconCalendar size={14} color={theme.textMuted} />} theme={theme}>
          <ToggleGroup
            theme={theme}
            options={[
              { value: 6, label: t.saturday },
              { value: 0, label: t.sunday },
              { value: 1, label: t.monday },
            ]}
            value={settings.weekStart ?? 1}
            onChange={v => set("weekStart", v)}
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

        {/* Security — PIN lock */}
        <Section title={t.security} icon={<IconShield size={14} color={theme.textMuted} />} theme={theme}>
          <GlassCard theme={theme} style={{ padding: "14px 16px" }}>
            {pinSuccess && (
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.accent1, marginBottom: 12, textAlign: "center" }}>
                ✅ {t.pinEnabled}
              </div>
            )}

            {!pinMode && !pinEnabled && (
              <div>
                <div style={{ fontSize: 12, color: theme.textSub, fontWeight: 600, marginBottom: 12 }}>{t.setPinWarning}</div>
                <button onClick={() => { setPinMode("enable-new"); setPinA(""); setPinError(""); }} style={{
                  width: "100%", padding: "13px", background: theme.btnGrad,
                  border: "none", borderRadius: 12, color: "#fff",
                  fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <IconLock size={16} color="#fff" /> {t.enablePin}
                </button>
              </div>
            )}

            {!pinMode && pinEnabled && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <IconLock size={16} color={theme.accent1} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: theme.accent1 }}>{t.pinEnabled}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setPinMode("change-current"); setPinA(""); setPinError(""); }} style={{
                    flex: 1, padding: "10px", background: theme.glass,
                    border: `1px solid ${theme.glassBorder}`, borderRadius: 10,
                    color: theme.text, fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>{t.changePin}</button>
                  <button onClick={() => { setPinMode("disable-current"); setPinA(""); setPinError(""); }} style={{
                    flex: 1, padding: "10px",
                    background: isDark ? "rgba(239,68,68,0.10)" : "rgba(239,68,68,0.07)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: 10, color: "#ef4444", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>{t.disablePin}</button>
                </div>
              </div>
            )}

            {/* Enable PIN: step 1 */}
            {pinMode === "enable-new" && (
              <div>
                <PinEntry label={t.newPin} value={pinA} onChange={v => { setPinA(v); setPinError(""); }} theme={theme} isDark={isDark} />
                {pinError && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 10 }}>{pinError}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={resetPinUi} style={{ flex: 1, padding: "10px", background: theme.glass, border: `1px solid ${theme.glassBorder}`, borderRadius: 10, color: theme.text, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13 }}>{t.cancel}</button>
                  <button onClick={handleEnableStep1} disabled={pinA.length !== 6} style={{ flex: 1, padding: "10px", background: pinA.length === 6 ? theme.btnGrad : theme.glass, border: pinA.length === 6 ? "none" : `1px solid ${theme.glassBorder}`, borderRadius: 10, color: pinA.length === 6 ? "#fff" : theme.textMuted, cursor: pinA.length === 6 ? "pointer" : "not-allowed", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>{t.next}</button>
                </div>
              </div>
            )}

            {/* Enable PIN: step 2 confirm */}
            {pinMode === "enable-confirm" && (
              <div>
                <PinEntry label={t.confirmPin} value={pinB} onChange={v => { setPinB(v); setPinError(""); }} theme={theme} isDark={isDark} />
                {pinError && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 10 }}>{pinError}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={resetPinUi} style={{ flex: 1, padding: "10px", background: theme.glass, border: `1px solid ${theme.glassBorder}`, borderRadius: 10, color: theme.text, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13 }}>{t.cancel}</button>
                  <button onClick={handleEnableStep2} disabled={pinB.length !== 6} style={{ flex: 1, padding: "10px", background: pinB.length === 6 ? theme.btnGrad : theme.glass, border: pinB.length === 6 ? "none" : `1px solid ${theme.glassBorder}`, borderRadius: 10, color: pinB.length === 6 ? "#fff" : theme.textMuted, cursor: pinB.length === 6 ? "pointer" : "not-allowed", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>{t.confirm}</button>
                </div>
              </div>
            )}

            {/* Disable PIN: verify current */}
            {pinMode === "disable-current" && (
              <div>
                <PinEntry label={t.currentPin} value={pinA} onChange={v => { setPinA(v); setPinError(""); }} theme={theme} isDark={isDark} />
                {pinError && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 10 }}>{pinError}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={resetPinUi} style={{ flex: 1, padding: "10px", background: theme.glass, border: `1px solid ${theme.glassBorder}`, borderRadius: 10, color: theme.text, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13 }}>{t.cancel}</button>
                  <button onClick={handleDisableVerify} disabled={pinA.length !== 6} style={{ flex: 1, padding: "10px", background: pinA.length === 6 ? "#ef4444" : theme.glass, border: pinA.length === 6 ? "none" : `1px solid ${theme.glassBorder}`, borderRadius: 10, color: pinA.length === 6 ? "#fff" : theme.textMuted, cursor: pinA.length === 6 ? "pointer" : "not-allowed", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>{t.disablePin}</button>
                </div>
              </div>
            )}

            {/* Change PIN: verify current */}
            {pinMode === "change-current" && (
              <div>
                <PinEntry label={t.currentPin} value={pinA} onChange={v => { setPinA(v); setPinError(""); }} theme={theme} isDark={isDark} />
                {pinError && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 10 }}>{pinError}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={resetPinUi} style={{ flex: 1, padding: "10px", background: theme.glass, border: `1px solid ${theme.glassBorder}`, borderRadius: 10, color: theme.text, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13 }}>{t.cancel}</button>
                  <button onClick={handleChangeVerify} disabled={pinA.length !== 6} style={{ flex: 1, padding: "10px", background: pinA.length === 6 ? theme.btnGrad : theme.glass, border: pinA.length === 6 ? "none" : `1px solid ${theme.glassBorder}`, borderRadius: 10, color: pinA.length === 6 ? "#fff" : theme.textMuted, cursor: pinA.length === 6 ? "pointer" : "not-allowed", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>{t.next}</button>
                </div>
              </div>
            )}

            {/* Change PIN: enter new */}
            {pinMode === "change-new" && (
              <div>
                <PinEntry label={t.newPin} value={pinA} onChange={v => { setPinA(v); setPinError(""); }} theme={theme} isDark={isDark} />
                {pinError && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 10 }}>{pinError}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={resetPinUi} style={{ flex: 1, padding: "10px", background: theme.glass, border: `1px solid ${theme.glassBorder}`, borderRadius: 10, color: theme.text, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13 }}>{t.cancel}</button>
                  <button onClick={handleChangeNew} disabled={pinA.length !== 6} style={{ flex: 1, padding: "10px", background: pinA.length === 6 ? theme.btnGrad : theme.glass, border: pinA.length === 6 ? "none" : `1px solid ${theme.glassBorder}`, borderRadius: 10, color: pinA.length === 6 ? "#fff" : theme.textMuted, cursor: pinA.length === 6 ? "pointer" : "not-allowed", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>{t.next}</button>
                </div>
              </div>
            )}

            {/* Change PIN: confirm new */}
            {pinMode === "change-confirm" && (
              <div>
                <PinEntry label={t.confirmPin} value={pinB} onChange={v => { setPinB(v); setPinError(""); }} theme={theme} isDark={isDark} />
                {pinError && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 10 }}>{pinError}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={resetPinUi} style={{ flex: 1, padding: "10px", background: theme.glass, border: `1px solid ${theme.glassBorder}`, borderRadius: 10, color: theme.text, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13 }}>{t.cancel}</button>
                  <button onClick={handleChangeConfirm} disabled={pinB.length !== 6} style={{ flex: 1, padding: "10px", background: pinB.length === 6 ? theme.btnGrad : theme.glass, border: pinB.length === 6 ? "none" : `1px solid ${theme.glassBorder}`, borderRadius: 10, color: pinB.length === 6 ? "#fff" : theme.textMuted, cursor: pinB.length === 6 ? "pointer" : "not-allowed", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>{t.confirm}</button>
                </div>
              </div>
            )}
          </GlassCard>
        </Section>

        {/* Data management */}
        <Section title={t.dataManagement} icon={<IconDownload size={14} color={theme.textMuted} />} theme={theme}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={onExport} style={{
              width: "100%", padding: "13px 16px",
              background: theme.glass, border: `1px solid ${theme.glassBorder}`,
              borderRadius: 14, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              fontFamily: "inherit", fontWeight: 600, fontSize: 14,
              color: theme.text, backdropFilter: "blur(12px)",
            }}>
              <IconDownload size={18} color={theme.accent1} />
              <div style={{ flex: 1, textAlign: lang === "ar" ? "right" : "left" }}>
                <div style={{ fontWeight: 700 }}>{t.exportData}</div>
                <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{t.exportHint || "Save a copy of all your data"}</div>
              </div>
            </button>

            <button onClick={() => importRef.current?.click()} style={{
              width: "100%", padding: "13px 16px",
              background: theme.glass, border: `1px solid ${theme.glassBorder}`,
              borderRadius: 14, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              fontFamily: "inherit", fontWeight: 600, fontSize: 14,
              color: theme.text, backdropFilter: "blur(12px)",
            }}>
              <IconUpload size={18} color={theme.accent2} />
              <div style={{ flex: 1, textAlign: lang === "ar" ? "right" : "left" }}>
                <div style={{ fontWeight: 700 }}>{t.importData}</div>
                <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{t.importHint || "Restore from a backup file"}</div>
              </div>
            </button>
            <input ref={importRef} type="file" accept=".json" style={{ display: "none" }} onChange={handleFileChange} />

            {/* Import confirmation */}
            {importConfirm && (
              <GlassCard theme={theme} style={{ padding: 14, border: `1px solid ${theme.glassBorder}` }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 12 }}>{t.importConfirm}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setImportConfirm(null)} style={{ flex: 1, padding: "10px", background: theme.glass, border: `1px solid ${theme.glassBorder}`, borderRadius: 10, color: theme.text, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13 }}>{t.cancel}</button>
                  <button onClick={doImport} style={{ flex: 1, padding: "10px", background: theme.btnGrad, border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>{t.confirm}</button>
                </div>
              </GlassCard>
            )}

            {/* Import result message */}
            {importMsg && (
              <div style={{
                padding: "10px 14px", borderRadius: 12, textAlign: "center",
                fontSize: 13, fontWeight: 600,
                background: importMsg === t.importSuccess
                  ? (isDark ? "rgba(0,229,160,0.12)" : "rgba(5,150,105,0.08)")
                  : (isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)"),
                color: importMsg === t.importSuccess ? theme.accent1 : "#ef4444",
                border: `1px solid ${importMsg === t.importSuccess ? "rgba(0,229,160,0.25)" : "rgba(239,68,68,0.25)"}`,
              }}>
                {importMsg}
              </div>
            )}
          </div>
        </Section>

        <Section title={t.guide} icon={<IconBook size={14} color={theme.textMuted} />} theme={theme}>
          <button onClick={onOpenGuide} style={{
            width: "100%", padding: "14px 16px",
            background: theme.glass, border: `1px solid ${theme.glassBorder}`,
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
