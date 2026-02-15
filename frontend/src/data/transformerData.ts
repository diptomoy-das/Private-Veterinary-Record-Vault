// ── HUD Phase Data ──

export interface HudPhase {
  id: string;
  range: [number, number]; // scroll progress [start, end]
  lines: HudLine[];
}

export interface HudLine {
  text: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-left" | "center-right";
  style: "title" | "subtitle" | "mono" | "accent";
  delay?: number; // stagger delay in seconds
}

export const hudPhases: HudPhase[] = [
  {
    id: "hero",
    range: [0, 0.3],
    lines: [
      {
        text: "TRANSFORMATION SEQUENCE",
        position: "bottom-left",
        style: "title",
      },
      {
        text: "Frame-by-frame cinematic direction",
        position: "bottom-left",
        style: "subtitle",
        delay: 0.1,
      },
      {
        text: "SCROLL TO INITIATE",
        position: "bottom-right",
        style: "mono",
        delay: 0.3,
      },
    ],
  },
  {
    id: "transformation",
    range: [0.3, 0.75],
    lines: [
      {
        text: "SYSTEM: SHIFTING",
        position: "top-left",
        style: "mono",
      },
      {
        text: "CORE ENGAGED",
        position: "top-right",
        style: "accent",
        delay: 0.05,
      },
      {
        text: "MORPHOLOGY: ACTIVE",
        position: "bottom-left",
        style: "mono",
        delay: 0.1,
      },
    ],
  },
  {
    id: "arrival",
    range: [0.75, 1.0],
    lines: [
      {
        text: "CINEMATIC TRANSFORMATION",
        position: "bottom-left",
        style: "title",
      },
      {
        text: "SEQUENCE COMPLETE",
        position: "bottom-left",
        style: "subtitle",
        delay: 0.1,
      },
      {
        text: "EXPLORE BELOW ↓",
        position: "bottom-right",
        style: "accent",
        delay: 0.2,
      },
    ],
  },
];

// ── Frame Counter Format ──
export const formatFrameCounter = (frame: number, total: number): string => {
  const padded = String(frame + 1).padStart(3, "0");
  return `FRAME ${padded} / ${total}`;
};

// ── Post-Sequence Content ──

export interface SpecCard {
  label: string;
  value: string;
  unit?: string;
}

export const specsData: SpecCard[] = [
  { label: "TOTAL FRAMES", value: "150", unit: "seq" },
  { label: "SCROLL DEPTH", value: "500", unit: "vh" },
  { label: "RENDER", value: "60", unit: "fps" },
  { label: "RESOLUTION", value: "4K", unit: "dpr" },
];

export interface Feature {
  title: string;
  description: string;
}

export const featuresData: Feature[] = [
  {
    title: "Scroll-Driven Playback",
    description:
      "Every frame is mapped 1:1 to scroll position. No video decoding, no buffering — pure canvas rendering synced to the scroll timeline for pixel-perfect control.",
  },
  {
    title: "High-DPI Canvas Rendering",
    description:
      "Canvas scales by devicePixelRatio to ensure crisp, artifact-free rendering on Retina and 4K displays. Every frame is a photograph, not a compressed video artifact.",
  },
  {
    title: "Cinematic HUD Overlay",
    description:
      "A heads-up display layer tracks scroll progress, surfacing system diagnostics and narrative captions. All transitions are scroll-driven — no timers, no guesswork.",
  },
  {
    title: "Zero-Dependency Animation",
    description:
      "Framer Motion's MotionValue system drives all transitions from a single scroll source. No scroll-jacking, no competing listeners — one source of truth.",
  },
];
