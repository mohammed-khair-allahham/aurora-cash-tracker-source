import { useState } from "react";
import GlowBg from "../components/GlowBg";
import { IconLock } from "../components/Icons";

const KEYS = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

export default function LockScreen({ theme, isDark, t, onUnlock, onReset }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleKey = async (key) => {
    if (checking) return;
    if (key === "⌫") {
      setPin(p => p.slice(0, -1));
      setError(false);
      return;
    }
    if (key === "") return;
    const next = pin + key;
    setPin(next);
    setError(false);
    if (next.length === 6) {
      setChecking(true);
      const ok = await onUnlock(next);
      if (!ok) {
        setShake(true);
        setTimeout(() => { setShake(false); setPin(""); setError(true); setChecking(false); }, 600);
      }
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", padding: "24px 24px 40px",
    }}>
      <GlowBg theme={theme} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 320, textAlign: "center" }}>

        {/* Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: 22, margin: "0 auto 24px",
          background: isDark ? "rgba(0,229,160,0.1)" : "rgba(5,150,105,0.08)",
          border: `1.5px solid ${isDark ? "rgba(0,229,160,0.25)" : "rgba(5,150,105,0.2)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <IconLock size={32} color={theme.accent1} />
        </div>

        <div style={{ fontSize: 22, fontWeight: 800, color: theme.text, marginBottom: 8 }}>
          {t.pinLock}
        </div>
        <div style={{ fontSize: 14, color: theme.textSub, marginBottom: 32 }}>
          {t.enterPin}
        </div>

        {/* PIN dots */}
        <div style={{
          display: "flex", gap: 14, justifyContent: "center", marginBottom: 10,
          animation: shake ? "shake 0.5s ease" : "none",
        }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              width: 18, height: 18, borderRadius: "50%",
              background: i < pin.length
                ? (error ? "#ef4444" : theme.accent1)
                : "transparent",
              border: `2px solid ${i < pin.length
                ? (error ? "#ef4444" : theme.accent1)
                : theme.textMuted}`,
              transition: "background 0.15s, border-color 0.15s",
            }} />
          ))}
        </div>

        {/* Error message */}
        <div style={{
          fontSize: 13, fontWeight: 600, color: "#ef4444",
          marginBottom: 28, minHeight: 20,
          opacity: error ? 1 : 0, transition: "opacity 0.2s",
        }}>
          {t.wrongPin}
        </div>

        {/* Numpad */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
          marginBottom: 28,
        }}>
          {KEYS.map((key, idx) => (
            <button
              key={idx}
              onClick={() => handleKey(key)}
              disabled={key === ""}
              style={{
                height: 68, borderRadius: 18,
                background: key === ""
                  ? "transparent"
                  : key === "⌫"
                  ? (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)")
                  : (isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.8)"),
                border: key === "" ? "none" : `1px solid ${theme.glassBorder}`,
                color: key === "⌫" ? theme.textSub : theme.text,
                fontSize: key === "⌫" ? 22 : 24,
                fontWeight: 700,
                cursor: key === "" ? "default" : "pointer",
                fontFamily: "inherit",
                backdropFilter: key !== "" ? "blur(12px)" : "none",
                WebkitBackdropFilter: key !== "" ? "blur(12px)" : "none",
                transition: "background 0.15s, transform 0.1s",
                boxShadow: key !== "" && key !== "⌫"
                  ? isDark ? "0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.06)"
                  : "none",
              }}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Reset link */}
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} style={{
            background: "none", border: "none",
            color: theme.textMuted, fontSize: 13, cursor: "pointer",
            fontFamily: "inherit", textDecoration: "underline",
          }}>
            {t.resetAllData}
          </button>
        ) : (
          <div style={{
            background: isDark ? "rgba(239,68,68,0.10)" : "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 16, padding: "16px",
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 14 }}>
              {t.resetConfirm}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmReset(false)} style={{
                flex: 1, padding: "11px",
                background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
                border: `1px solid ${theme.glassBorder}`,
                borderRadius: 10, color: theme.text,
                cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13,
              }}>{t.cancel}</button>
              <button onClick={onReset} style={{
                flex: 1, padding: "11px", background: "#ef4444",
                border: "none", borderRadius: 10, color: "#fff",
                cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13,
              }}>{t.confirm}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
