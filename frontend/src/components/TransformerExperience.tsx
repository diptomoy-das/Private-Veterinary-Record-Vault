"use client";

import { useTransform, motion, type MotionValue } from "framer-motion";
import { hudPhases, formatFrameCounter } from "@/data/transformerData";

interface TransformerExperienceProps {
  scrollYProgress: MotionValue<number>;
  totalFrames: number;
}

// ── Position mapping ──
const positionClasses: Record<string, string> = {
  "top-left": "top-20 left-6 md:top-24 md:left-10",
  "top-right": "top-20 right-6 md:top-24 md:right-10",
  "bottom-left": "left-6 md:left-10",
  "bottom-right": "bottom-8 right-6 md:bottom-12 md:right-10",
  "center-left": "top-1/2 left-6 md:left-10 -translate-y-1/2",
  "center-right": "top-1/2 right-6 md:right-10 -translate-y-1/2",
};

const styleClasses: Record<string, string> = {
  title: "font-heading text-lg md:text-2xl lg:text-3xl tracking-[0.15em] text-white font-bold uppercase",
  subtitle: "font-body text-sm md:text-base tracking-[0.1em] text-white/50 font-light",
  mono: "font-heading text-[10px] md:text-xs tracking-[0.25em] text-white/30 uppercase",
  accent: "font-heading text-[10px] md:text-xs tracking-[0.25em] text-accent-metal uppercase",
};

// ── Phase Component ──
function HudPhaseBlock({
  phase,
  scrollYProgress,
}: {
  phase: (typeof hudPhases)[0];
  scrollYProgress: MotionValue<number>;
}) {
  const [start, end] = phase.range;
  const fadeInStart = start;
  const fadeInEnd = start + (end - start) * 0.15;
  const fadeOutStart = end - (end - start) * 0.15;
  const fadeOutEnd = end;

  const opacity = useTransform(
    scrollYProgress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [20, 0, 0, -10]
  );

  // Group lines by position for stacking
  const bottomLeftLines = phase.lines.filter((l) => l.position === "bottom-left");
  const otherLines = phase.lines.filter((l) => l.position !== "bottom-left");

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      {/* Bottom-left stacked group */}
      {bottomLeftLines.length > 0 && (
        <motion.div
          style={{ y }}
          className="absolute bottom-8 left-6 md:bottom-12 md:left-10 flex flex-col gap-1"
        >
          {bottomLeftLines.map((line, i) => (
            <span key={`${phase.id}-bl-${i}`} className={styleClasses[line.style]}>
              {line.text}
            </span>
          ))}
        </motion.div>
      )}

      {/* Other positioned lines */}
      {otherLines.map((line, i) => (
        <motion.div
          key={`${phase.id}-other-${i}`}
          style={{ y }}
          className={`absolute ${positionClasses[line.position]}`}
        >
          <span className={styleClasses[line.style]}>{line.text}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Frame Counter (visible during transformation phase 30%-75%) ──
function FrameCounter({
  scrollYProgress,
  totalFrames,
}: {
  scrollYProgress: MotionValue<number>;
  totalFrames: number;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [0.28, 0.33, 0.7, 0.76],
    [0, 1, 1, 0]
  );

  const frameIndex = useTransform(scrollYProgress, (v: number) =>
    Math.min(Math.floor(v * totalFrames), totalFrames - 1)
  );

  const frameText = useTransform(frameIndex, (f: number) =>
    formatFrameCounter(f, totalFrames)
  );

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 right-6 md:bottom-12 md:right-10"
    >
      <motion.span className="font-heading text-[10px] md:text-xs tracking-[0.35em] text-white/20 uppercase tabular-nums">
        {frameText}
      </motion.span>
    </motion.div>
  );
}

// ── Progress Bar ──
function ScrollProgressBar({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5">
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="h-full bg-accent-metal/60"
      />
    </div>
  );
}

// ── Decorative Corner Brackets ──
function CornerBrackets({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [0.15, 0.08, 0.08, 0]);
  const bracketColor = "border-white/10";
  const size = "w-6 h-6 md:w-8 md:h-8";

  return (
    <motion.div style={{ opacity }} className="absolute inset-4 md:inset-8">
      <div className={`absolute top-0 left-0 ${size} border-t border-l ${bracketColor}`} />
      <div className={`absolute top-0 right-0 ${size} border-t border-r ${bracketColor}`} />
      <div className={`absolute bottom-0 left-0 ${size} border-b border-l ${bracketColor}`} />
      <div className={`absolute bottom-0 right-0 ${size} border-b border-r ${bracketColor}`} />
    </motion.div>
  );
}

// ── Main HUD Export ──
export default function TransformerExperience({
  scrollYProgress,
  totalFrames,
}: TransformerExperienceProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 hud-scanline">
      <CornerBrackets scrollYProgress={scrollYProgress} />

      {hudPhases.map((phase) => (
        <HudPhaseBlock
          key={phase.id}
          phase={phase}
          scrollYProgress={scrollYProgress}
        />
      ))}

      <FrameCounter scrollYProgress={scrollYProgress} totalFrames={totalFrames} />
      <ScrollProgressBar scrollYProgress={scrollYProgress} />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(11,11,11,0.6) 100%)",
        }}
      />
    </div>
  );
}
