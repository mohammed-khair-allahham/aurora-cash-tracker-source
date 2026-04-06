import GlassCard from "../components/GlassCard";
import GlowBg from "../components/GlowBg";
import { IconBook, IconChevronLeft, IconChevronRight, IconWallet, IconPlus, IconHome, IconList, IconChart, IconSettings } from "../components/Icons";

const STEP_ICONS = [IconWallet, IconPlus, IconHome, IconList, IconWallet, IconChart, IconSettings, IconSettings];
const STEP_COLORS_DARK = ["#00e5a0", "#38bdf8", "#a78bfa", "#fb923c", "#34d399", "#f472b6", "#fbbf24", "#818cf8"];
const STEP_COLORS_LIGHT = ["#059669", "#0ea5e9", "#7c3aed", "#ea580c", "#059669", "#db2777", "#d97706", "#4f46e5"];

export default function GuideScreen({ theme, isDark, t, lang, onBack, onboarding, onFinish }) {
  const BackIcon = lang === "ar" ? IconChevronRight : IconChevronLeft;

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

  return (
    <div style={{ height: "100%", overflowY: "auto", position: "relative" }}>
      <GlowBg theme={theme} />
      <div style={{ padding: "52px 20px 84px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        {onboarding ? (
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 22,
              background: theme.btnGrad,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 4px 20px rgba(56,189,248,0.25)",
            }}>
              <IconBook size={34} color="#fff" />
            </div>
            <h1 style={{ margin: "0 0 8px", fontWeight: 900, fontSize: 26, color: theme.text }}>
              {t.welcomeTitle}
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: theme.textSub, lineHeight: 1.5 }}>
              {t.welcomeSubtitle}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <button onClick={onBack} style={{
              background: theme.glass, border: `1px solid ${theme.glassBorder}`,
              borderRadius: 12, color: theme.text, padding: "9px 12px",
              cursor: "pointer", backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BackIcon size={18} color={theme.text} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconBook size={22} color={theme.text} />
              <h2 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: theme.text }}>
                {t.guideTitle}
              </h2>
            </div>
          </div>
        )}

        {/* Steps */}
        {steps.map((step, i) => {
          const StepIcon = STEP_ICONS[i];
          const color = isDark ? STEP_COLORS_DARK[i] : STEP_COLORS_LIGHT[i];
          const bgAlpha = isDark ? "0.12)" : "0.08)";
          const borderAlpha = isDark ? "0.25)" : "0.2)";

          // Build rgba from hex color
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          const rgba = (a) => `rgba(${r},${g},${b},${a}`;

          return (
            <GlassCard key={i} theme={theme} style={{
              padding: "16px", marginBottom: 12,
              display: "flex", gap: 14, alignItems: "flex-start",
            }}>
              {/* Step number + icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: rgba(bgAlpha),
                border: `1px solid ${rgba(borderAlpha)}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <StepIcon size={22} color={color} />
                {/* Step number badge */}
                <div style={{
                  position: "absolute", top: -6, right: lang === "ar" ? "auto" : -6,
                  left: lang === "ar" ? -6 : "auto",
                  width: 20, height: 20, borderRadius: "50%",
                  background: theme.btnGrad,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800, color: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}>
                  {i + 1}
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 800, fontSize: 15, color: theme.text,
                  marginBottom: 6, lineHeight: 1.3,
                }}>
                  {step.title}
                </div>
                <div style={{
                  fontSize: 13, color: theme.textSub,
                  lineHeight: 1.5,
                }}>
                  {step.desc}
                </div>
              </div>
            </GlassCard>
          );
        })}

        {/* Footer tip */}
        <div style={{
          textAlign: "center", marginTop: 20, padding: "0 12px",
        }}>
          <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.6 }}>
            {lang === "ar"
              ? "💡 جميع بياناتك محفوظة محلياً على جهازك. لا يتم إرسال أي بيانات إلى أي خادم."
              : "💡 All your data is stored locally on your device. No data is sent to any server."
            }
          </div>
        </div>

        {/* Get Started button (onboarding only) */}
        {onboarding && (
          <button onClick={onFinish} style={{
            width: "100%", padding: "16px",
            marginTop: 24,
            background: theme.btnGrad,
            border: "none", borderRadius: 16,
            color: "#fff", fontSize: 17, fontWeight: 800,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 20px rgba(56,189,248,0.25)",
            letterSpacing: 0.3,
          }}>
            {t.getStarted}
          </button>
        )}
      </div>
    </div>
  );
}
