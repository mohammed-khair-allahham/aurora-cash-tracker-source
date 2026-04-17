import { useState } from "react";
import { IconBook, IconChevronLeft, IconChevronRight, IconWallet, IconPlus, IconHome, IconList, IconChart, IconSettings, IconX } from "../components/Icons";

const STEP_ICONS = [IconWallet, IconPlus, IconHome, IconList, IconWallet, IconChart, IconSettings, IconSettings];

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
  const color = theme.accent1;

  const PrevIcon = isRTL ? IconChevronRight : IconChevronLeft;
  const NextIcon = isRTL ? IconChevronLeft : IconChevronRight;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
      background: isDark ? "rgba(0,0,0,0.65)" : "rgba(14,17,22,0.40)",
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
        background: theme.surface,
        borderRadius: 20,
        border: `1px solid ${theme.border}`,
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Close button (only for returning users, not onboarding) */}
        {!onboarding && (
          <button onClick={close} style={{
            position: "absolute", top: 14,
            [isRTL ? "left" : "right"]: 14,
            width: 32, height: 32, borderRadius: 10,
            background: theme.surface2,
            border: `1px solid ${theme.border}`,
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
            color: theme.textSub, fontSize: 12, fontWeight: 600,
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
                width: 80, height: 80, borderRadius: 20,
                background: theme.accent1,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <IconBook size={38} color="#fff" />
              </div>
              <h1 style={{ margin: "0 0 10px", fontWeight: 800, fontSize: 22, color: theme.text }}>
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
                fontSize: 11, fontWeight: 600, color: theme.textMuted,
                letterSpacing: 1.2, textTransform: "uppercase",
                marginBottom: 20, textAlign: "center",
              }}>
                {step + 1} / {total}
              </div>

              {/* Icon */}
              <div style={{
                width: 84, height: 84, borderRadius: 22,
                background: theme.surface2,
                border: `1px solid ${theme.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 22px",
              }}>
                <StepIcon size={40} color={color} />
              </div>

              {/* Title */}
              <h2 style={{
                margin: "0 0 12px",
                fontWeight: 700, fontSize: 20,
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
                background: i === step ? theme.accent1 : theme.border,
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.2s",
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
              width: 48, height: 48, borderRadius: 12,
              background: theme.surface2,
              border: `1px solid ${theme.border}`,
              cursor: (isFirst && !onboarding) ? "default" : "pointer",
              opacity: (isFirst && !onboarding) ? 0.3 : 1,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <PrevIcon size={20} color={theme.text} />
            </button>
          )}

          <button onClick={goNext} style={{
            flex: 1, height: 48, borderRadius: 12,
            background: theme.accent1,
            border: "none", color: "#fff",
            fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {showIntro ? t.getStarted : isLast ? t.finish : t.next}
            {!isLast && !showIntro && <NextIcon size={18} color="#fff" />}
          </button>
        </div>
      </div>
    </div>
  );
}
