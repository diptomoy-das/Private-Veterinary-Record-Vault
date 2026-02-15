"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { WalletProvider } from "@/context/WalletContext";
import Navbar from "@/components/Navbar";
import TransformerScrollCanvas from "@/components/TransformerScrollCanvas";
import TransformerExperience from "@/components/TransformerExperience";
import DashboardSection from "@/components/DashboardSection";

const TOTAL_FRAMES = 150;
const IMAGE_FOLDER = "/sequence";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <WalletProvider>
      <main className="bg-base-dark">
        {/* ── Navbar ── */}
        <Navbar />

        {/* ── Scroll Sequence Container (500vh) ── */}
        <section ref={containerRef} className="h-[500vh] relative">
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {/* Canvas — z-0 */}
            <TransformerScrollCanvas
              scrollYProgress={scrollYProgress}
              totalFrames={TOTAL_FRAMES}
              imageFolderPath={IMAGE_FOLDER}
            />

            {/* HUD Overlay — z-10 */}
            <TransformerExperience
              scrollYProgress={scrollYProgress}
              totalFrames={TOTAL_FRAMES}
            />
          </div>
        </section>

        {/* ── DApp Dashboard ── */}
        <DashboardSection />
      </main>
    </WalletProvider>
  );
}
