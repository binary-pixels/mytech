import type { Metadata } from "next";
import { Mail, GitBranch, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "About VisionLab — a machine vision toolkit for industrial inspection and AI research.",
};

const algorithms = [
  { icon: "⭕", name: "Circle Fitting", detail: "RANSAC + Devernay sub-pixel · < 0.1 px accuracy" },
  { icon: "📏", name: "Line Fitting", detail: "Rotated ROI + sector centroids · < 0.2 px accuracy" },
  { icon: "🥚", name: "Ellipse Fitting", detail: "Eccentricity constraint · partial-occlusion robust" },
  { icon: "▭", name: "Rectangle Fitting", detail: "Hough/RANSAC · right-angle orthogonality constraint" },
  { icon: "🔎", name: "Template Matching", detail: "Gradient-orientation · rotation invariant" },
  { icon: "🧠", name: "PatchCore Defect Detection", detail: "DINOv2 + coreset · 5 normal images to train" },
];

const security = [
  { label: "License binding", value: "RSA-2048 signed · MachineGuid + CPU-ID dual-factor fingerprint" },
  { label: "Tamper detection", value: ".text segment CRC32 self-check on every startup" },
  { label: "Anti-debug", value: "TLS callback + IsDebuggerPresent guard" },
  { label: "Deployment", value: "Single license.json file placed next to the executable" },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-24">

      {/* Header */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="shrink-0">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-cyan-400/20 flex items-center justify-center text-5xl">
              👁
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-black text-slate-100 mb-2">
              About <span className="gradient-text">VisionLab</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-2xl">
              VisionLab is an industrial machine vision toolkit for geometric
              measurement and AI-based defect detection. It ships as a standalone
              Qt application and as a Plugin SDK that integrates into any C/C++
              host in minutes.
            </p>
            <p className="text-slate-500 leading-relaxed mb-8 max-w-2xl">
              Every algorithm is built around the <em className="text-slate-300">mathematics</em> — sub-pixel
              edge localisation, RANSAC robust estimation, and Vision Transformer
              feature spaces — so accuracy and reliability hold up in real
              production environments.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:contact@example.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:border-cyan-400/50 hover:text-cyan-400 transition-all"
              >
                <Mail size={16} /> Email
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:border-cyan-400/50 hover:text-cyan-400 transition-all"
              >
                <GitBranch size={16} /> GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:border-cyan-400/50 hover:text-cyan-400 transition-all"
              >
                <ExternalLink size={16} /> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">System Architecture</h2>
        <p className="text-slate-500 text-sm mb-8">Two deployment modes sharing one algorithm engine</p>

        {/* Standalone Mode */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">Standalone Mode</p>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "Qt UI", sub: "Inspect · Measure · Train", color: "border-cyan-400/40 text-cyan-300" },
              null,
              { label: "AlgoLib", sub: "C++ · OpenCV · LibTorch", color: "border-slate-600 text-slate-200" },
              null,
              { label: "Result", sub: "CSV · JSON · Overlay", color: "border-slate-600 text-slate-200" },
            ].map((item, i) =>
              item === null ? (
                <div key={i} className="flex items-center gap-1 text-slate-600">
                  <div className="h-px w-6 bg-slate-600" />
                  <span className="text-slate-600">▶</span>
                </div>
              ) : (
                <div
                  key={i}
                  className={`rounded-lg border px-4 py-2.5 text-center min-w-[120px] ${item.color}`}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5 whitespace-nowrap">{item.sub}</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Plugin Mode */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">Plugin Mode</p>
          <div className="flex flex-wrap items-stretch gap-3">
            {/* Host side */}
            <div className="rounded-lg border border-violet-400/30 bg-violet-400/5 p-4 flex flex-col gap-2 min-w-[160px]">
              <p className="text-xs text-violet-300 font-semibold mb-1">Your Application (host)</p>
              <div className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 font-mono">PluginHostLauncher</div>
              <div className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 font-mono">PluginHostInterface</div>
            </div>

            {/* IPC arrow */}
            <div className="flex flex-col items-center justify-center gap-1 px-1 min-w-[80px]">
              <div className="flex items-center gap-1 text-cyan-500">
                <div className="h-px w-5 bg-cyan-500/60" />
                <span className="text-[10px] font-mono">launch</span>
                <span className="text-cyan-500">▶</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-500">
                <span className="text-emerald-500">◀</span>
                <span className="text-[10px] font-mono">IPC</span>
                <div className="h-px w-5 bg-emerald-500/60" />
                <span className="text-[10px] font-mono">▶</span>
              </div>
              <p className="text-[10px] text-slate-600 text-center leading-tight mt-1">shared mem<br/>&lt; 2 ms</p>
            </div>

            {/* Plugin side */}
            <div className="rounded-lg border border-cyan-400/30 bg-cyan-400/5 p-4 flex flex-col gap-2 min-w-[190px] flex-1">
              <p className="text-xs text-cyan-300 font-semibold mb-1">VisionLab.exe (plugin process)</p>
              <div className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 font-mono">Qt UI + Algorithm Engine</div>
              <div className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-400 font-mono">Circle · Line · Ellipse · Rect</div>
              <div className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-400 font-mono">Template Match · PatchCore</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            The plugin runs as a <strong className="text-slate-300">separate process</strong> — your host has no OpenCV, PyTorch, or Qt dependency at all.
          </p>
        </div>
      </section>

      {/* Algorithms */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-slate-100 mb-8">Algorithm Modules</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {algorithms.map((a) => (
            <div
              key={a.name}
              className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900 hover:border-cyan-400/20 transition-colors"
            >
              <span className="text-2xl shrink-0">{a.icon}</span>
              <div>
                <p className="text-slate-100 font-semibold text-sm">{a.name}</p>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{a.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section>
        <h2 className="text-2xl font-bold text-slate-100 mb-8">License & Security</h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900 divide-y divide-slate-800">
          {security.map((s) => (
            <div key={s.label} className="flex gap-6 px-6 py-4">
              <span className="text-violet-400 text-sm font-medium w-36 shrink-0">{s.label}</span>
              <span className="text-slate-400 text-sm">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

