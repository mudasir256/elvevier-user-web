"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#4a142a", "#c989a3", "#f4e6ec", "#d4a24c", "#ffffff", "#8d4a66"];

// A full-screen burst of brand-colored confetti that falls once and then clears itself.
export function Confetti({ duration = 4500, pieces = 180 }: { duration?: number; pieces?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const ratio = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Pieces start above the screen at staggered heights and drift down across the full width.
    const width = window.innerWidth;
    const height = window.innerHeight;
    const bits = Array.from({ length: pieces }, () => ({
      x: Math.random() * width,
      y: -20 - Math.random() * height * 0.6,
      vx: (Math.random() - 0.5) * 2,
      vy: 2.5 + Math.random() * 3.5,
      sway: Math.random() * Math.PI * 2,
      size: 6 + Math.random() * 6,
      spin: Math.random() * Math.PI,
      spinSpeed: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      round: Math.random() < 0.3,
    }));

    const start = performance.now();
    let frame = 0;
    const draw = (now: number) => {
      const elapsed = now - start;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.globalAlpha = Math.max(0, Math.min(1, (duration - elapsed) / 800));
      for (const bit of bits) {
        bit.sway += 0.05;
        bit.x += bit.vx + Math.sin(bit.sway) * 1.2;
        bit.y += bit.vy;
        bit.spin += bit.spinSpeed;
        context.save();
        context.translate(bit.x, bit.y);
        context.rotate(bit.spin);
        context.fillStyle = bit.color;
        if (bit.round) {
          context.beginPath();
          context.arc(0, 0, bit.size / 2.4, 0, Math.PI * 2);
          context.fill();
        } else {
          context.fillRect(-bit.size / 2, -bit.size / 4, bit.size, bit.size / 2);
        }
        context.restore();
      }
      if (elapsed < duration) frame = requestAnimationFrame(draw);
      else context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [duration, pieces]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[120] h-full w-full" aria-hidden="true" />;
}
