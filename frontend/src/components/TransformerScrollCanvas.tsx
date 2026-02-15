"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { type MotionValue, useMotionValueEvent } from "framer-motion";

interface TransformerScrollCanvasProps {
  scrollYProgress: MotionValue<number>;
  totalFrames: number;
  imageFolderPath: string;
}

export default function TransformerScrollCanvas({
  scrollYProgress,
  totalFrames,
  imageFolderPath,
}: TransformerScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Preload all frames ──
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(totalFrames);

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        const frameNum = String(index + 1).padStart(3, "0");
        img.src = `${imageFolderPath}/ezgif-frame-${frameNum}.jpg`;
        img.onload = () => {
          images[index] = img;
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
          if (loadedCount === totalFrames) {
            imagesRef.current = images;
            setIsLoaded(true);
          }
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
          resolve();
        };
      });
    };

    // Load in batches to avoid blocking main thread
    const batchSize = 10;
    const loadBatch = async (startIdx: number) => {
      const batch = [];
      for (let i = startIdx; i < Math.min(startIdx + batchSize, totalFrames); i++) {
        batch.push(loadImage(i));
      }
      await Promise.all(batch);
      if (startIdx + batchSize < totalFrames) {
        // Use requestIdleCallback or setTimeout to yield to main thread
        setTimeout(() => loadBatch(startIdx + batchSize), 0);
      }
    };

    loadBatch(0);
  }, [totalFrames, imageFolderPath]);

  // ── Draw frame with object-fit:contain logic ──
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    // Only resize canvas if dimensions changed
    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      ctx.scale(dpr, dpr);
    }

    // Clear
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Fill black background
    ctx.fillStyle = "#0b0b0b";
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Object-fit: contain — center and scale image to fit
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = displayWidth / displayHeight;

    let drawWidth: number, drawHeight: number, drawX: number, drawY: number;

    if (imgAspect > canvasAspect) {
      // Image is wider — fit to width
      drawWidth = displayWidth;
      drawHeight = displayWidth / imgAspect;
      drawX = 0;
      drawY = (displayHeight - drawHeight) / 2;
    } else {
      // Image is taller — fit to height
      drawHeight = displayHeight;
      drawWidth = displayHeight * imgAspect;
      drawX = (displayWidth - drawWidth) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }, []);

  // ── Sync scroll to frame ──
  useMotionValueEvent(scrollYProgress, "change", (progress: number) => {
    const frameIndex = Math.min(
      Math.floor(progress * totalFrames),
      totalFrames - 1
    );

    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
    }
  });

  // ── Handle resize ──
  useEffect(() => {
    const handleResize = () => {
      if (isLoaded) {
        drawFrame(currentFrameRef.current);
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded, drawFrame]);

  // ── Draw first frame once loaded ──
  useEffect(() => {
    if (isLoaded) {
      drawFrame(0);
    }
  }, [isLoaded, drawFrame]);

  return (
    <>
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-base-dark">
          <div className="font-heading text-xs tracking-[0.3em] text-white/40 uppercase mb-6">
            Loading Sequence
          </div>
          <div className="w-48 h-[2px] bg-neutral-carbon overflow-hidden">
            <div
              className="h-full bg-accent-metal transition-all duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <div className="font-body text-xs text-white/30 mt-3 tabular-nums">
            {loadProgress}%
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Accessible description for screen readers */}
      <div className="sr-only" role="img" aria-label="Cinematic transformation sequence: A sitting dog in a clinical environment transforms frame-by-frame as the space unfolds into a sun-drenched garden and the dog shifts into a joyful gallop. 150 frames driven by scroll position.">
        Cinematic Transformation Sequence — 150 frames from clinical stillness to joyful motion.
      </div>
    </>
  );
}
