import { useState } from "react";
import { IconBook, IconChevronLeft, IconChevronRight, IconWallet, IconPlus, IconHome, IconList, IconChart, IconSettings, IconX } from "../components/Icons";

const STEP_ICONS = [IconWallet, IconPlus, IconHome, IconList, IconWallet, IconChart, IconSettings, IconSettings];
const STEP_COLORS_DARK = ["#00e5a0", "#38bdf8", "#a78bfa", "#fb923c", "#34d399", "#f472b6", "#fbbf24", "#818cf8"];
const STEP_COLORS_LIGHT = ["#059669", "#0ea5e9", "#7c3aed", "#ea580c", "#059669", "#db2777", "#d97706", "#4f46e5"];

export default function GuideScreen({ theme, isDark, t, lang, onBack, onboarding, onFinish }) {
  const [step, setStep] = useState(0);
  const isRTL = lang === "ar";

  const steps = [
    { title: t.guideStep1Title, desc: t.guideStep1Desc },
    { title: t.guideStep2Title, desc: t.guideStep2Desc },
    { title: t.guideStep3Title, desc: t.guideStep3Desc },
    { title: t.guideStep4Title, desc: t.guideStep4Desc },
    { title: t.guideStep5Title, desc: t.guideStep5Desc },
    { title: t.guideStep6Title, desc: t.guideStep6Desc },
    { title: t.guideStep7Title, desc: t.guideStep7Desc },
    { title: t.guideStep8Title, desc: t.guideStep8Desc },
  ];

  const total = steps.length;
  const isFirst = step === 0;
  const isLast = step === total - 1;
  const close = () => (onboarding ? onFinish?.() : onBack?.());

  // Welcome intro counts as a "pre-step" when onboarding
  const [showIntro, setShowIntro] = useState(onboarding);

  const goNext = () => {
    if (showIntro) { setShowIntro(false); return; }
    if (isLast) { close(); return; }
    setStep(s => s + 1);
  };
  const goPrev = () => {
    if (isFirst) { if (onboarding) setShowIntro(true); return; }
    setStep(s => s - 1);
  };

  const current = steps[step];
  const StepIcon = STEP_ICONS[step];
  const color = isDark ? STEP_COLORS_DARK[step] : STEP_COLORS_LIGHT[step];
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const rgba = (a) => `rgba(${r},${g},${b},${a})`;

  const PrevIcon = isRTL ? IconChevronRight : IconChevronLeft;
  const NextIcon = isRTL ? IconChevronLeft : IconChevronRight;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
      background: isDark ? "rgba(2,10,22,0.75)" : "rgba(12,26,46,0.45)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      animation: "fadeSlideIn 0.25s ease-out",
    }}
      onClick={(e) => { if (e.target === e.currentTarget && !onboarding) close(); }}
    >
      <style>{`
        @keyframes guideStepIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 380,
        background: isDark
          ? "linear-gradient(160deg, #0c1a2e 0%, #0a1626 100%)"
          : "linear-gradient(160deg, #ffffff 0%, #f5faff 100%)",
        borderRadius: 28,
        border: `1px solid ${theme.glassBorder}`,
        boxShadow: isDark
          ? "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,160,0.08)"
          : "0 24px 80px rgba(12,26,46,0.2), 0 0 0 1px rgba(5,150,105,0.06)",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Top accent stripe */}
        <div style={{
          height: 3,
          background: showIntro
            ? theme.walletAccent
            : `linear-gradient(90deg, ${color}, ${isDark ? "#a78bfa" : "#7c3aed"})`,
          transition: "background 0.4s",
        }} />

        {/* Close button (only for returning users, not onboarding) */}
        {!onboarding && (
          <button onClick={close} style={{
            position: "absolute", top: 14,
            [isRTL ? "left" : "right"]: 14,
            width: 32, height: 32, borderRadius: 10,
            background: theme.glassBg2,
            border: `1px solid ${theme.glassBorder}`,
            cursor: "pointer", zIndex: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <IconX size={16} color={theme.textSub} />
          </button>
        )}

        {/* Skip (onboarding only) */}
        {onboarding && !showIntro && !isLast && (
          <button onClick={onFinish} style={{
            position: "absolute", top: 18,
            [isRTL ? "left" : "right"]: 18,
            background: "none", border: "none",
            color: theme.textSub, fontSize: 12, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", zIndex: 2,
            padding: "6px 10px", borderRadius: 8,
          }}>
            {t.skip}
          </button>
        )}

        {/* Content area */}
        <div style={{ padding: "28px 24px 20px", minHeight: 380, display: "flex", flexDirection: "column" }}>
          {showIntro ? (
            /* Welcome intro */
            <div style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", animation: "guideStepIn 0.3s ease-out" }}>
              <div style={{
                width: 88, height: 88, borderRadius: 26,
                background: theme.btnGrad,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: "0 8px 32px rgba(56,189,248,0.35)",
              }}>
                <IconBook size={42} color="#fff" />
              </div>
              <h1 style={{ margin: "0 0 10px", fontWeight: 900, fontSize: 24, color: theme.text }}>
                {t.welcomeTitle}
              </h1>
              <p style={{ margin: "0 20px", fontSize: 14, color: theme.textSub, lineHeight: 1.6 }}>
                {t.welcomeSubtitle}
              </p>
            </div>
          ) : (
            /* Step content */
            <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", animation: "guideStepIn 0.3s ease-out" }}>
              {/* Step counter */}
              <div style={{
                fontSize: 11, fontWeight: 700, color: theme.textMuted,
                letterSpacing: 1.5, textTransform: "uppercase",
                marginBottom: 20, textAlign: "center",
              }}>
                {step + 1} / {total}
              </div>

              {/* Icon */}
              <div style={{
                width: 96, height: 96, borderRadius: 28,
                background: rgba(isDark ? 0.12 : 0.08),
                border: `1px solid ${rgba(isDark ? 0.25 : 0.20)}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 22px",
                boxShadow: `0 8px 32px ${rgba(isDark ? 0.15 : 0.10)}`,
                position: "relative",
              }}>
                <StepIcon size={44} color={color} />
                {/* Glow */}
                <div style={{
                  position: "absolute", inset: -8,
                  borderRadius: 32,
                  background: `radial-gradient(circle, ${rgba(0.15)} 0%, transparent 70%)`,
                  pointerEvents: "none", zIndex: -1,
                }} />
              </div>

              {/* Title */}
              <h2 style={{
                margin: "0 0 12px",
                fontWeight: 900, fontSize: 20,
                color: theme.text, textAlign: "center",
                lineHeight: 1.3,
              }}>
                {current.title}
              </h2>

              {/* Description */}
              <p style={{
                margin: 0, fontSize: 14,
                color: theme.textSub, lineHeight: 1.6,
                textAlign: "center",
                flex: 1,
              }}>
                {current.desc}
              </p>
            </div>
          )}
        </div>

        {/* Progress dots */}
        {!showIntro && (
          <div style={{
            display: "flex", justifyContent: "center", gap: 6,
            padding: "0 24px 16px",
            direction: "ltr",
          }}>
            {steps.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} style={{
                width: i === step ? 22 : 6, height: 6, borderRadius: 3,
                background: i === step
                  ? `linear-gradient(90deg, ${color}, ${isDark ? "#a78bfa" : "#7c3aed"})`
                  : theme.divider,
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }} />
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{
          padding: "0 20px 22px",
          display: "flex", gap: 10,
        }}>
          {!showIntro && (
            <button onClick={goPrev} disabled={isFirst && !onboarding} style={{
              flex: "0 0 auto",
              width: 52, height: 52, borderRadius: 16,
              background: theme.glass,
              border: `1px solid ${theme.glassBorder}`,
              cursor: (isFirst && !onboarding) ? "default" : "pointer",
              opacity: (isFirst && !onboarding) ? 0.3 : 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "opacity 0.2s",
            }}>
              <PrevIcon size={20} color={theme.text} />
            </button>
          )}

          <button onClick={goNext} style={{
            flex: 1, height: 52, borderRadius: 16,
            background: theme.btnGrad,
            border: "none", color: "#fff",
            fontSize: 15, fontWeight: 800,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: "0 8px 24px rgba(56,189,248,0.3)",
            letterSpacing: 0.3,
          }}>
            {showIntro ? t.getStarted : isLast ? t.finish : t.next}
            {!isLast && !showIntro && <NextIcon size={18} color="#fff" />}
          </button>
        </div>
      </div>
    </div>
  );
}
