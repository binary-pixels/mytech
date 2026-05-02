"use client";

import { useEffect, useRef } from "react";

export default function ScanlineBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let scanY = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Grid lines (very subtle on light background)
      ctx.strokeStyle = "rgba(37,99,235,0.04)";
      ctx.lineWidth = 1;
      const step = 48;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Scanline
      const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      grad.addColorStop(0, "rgba(37,99,235,0)");
      grad.addColorStop(0.5, "rgba(37,99,235,0.05)");
      grad.addColorStop(1, "rgba(37,99,235,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 40, w, 80);

      // Bright scanline edge
      ctx.strokeStyle = "rgba(37,99,235,0.18)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(w, scanY); ctx.stroke();

      // Corner markers
      const corners = [[40, 40], [w - 40, 40], [40, h - 40], [w - 40, h - 40]] as const;
      corners.forEach(([cx, cy]) => {
        ctx.strokeStyle = "rgba(37,99,235,0.25)";
        ctx.lineWidth = 2;
        const s = 16;
        ctx.beginPath();
        ctx.moveTo(cx - s, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy - s);
        ctx.moveTo(cx + s, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + s);
        ctx.stroke();
      });

      scanY = (scanY + 1.2) % h;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-100 pointer-events-none"
      aria-hidden
    />
  );
}
