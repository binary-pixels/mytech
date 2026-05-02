import type { Metadata } from "next";
import ToolCard from "@/components/ToolCard";
import type { Tool } from "@/types";

export const metadata: Metadata = {
  title: "Features",
  description: "VisionLab algorithm modules: sub-pixel geometric fitting, AI defect detection, and Plugin SDK integration.",
};

const tools: Tool[] = [
  {
    id: "circle-fit",
    name: "Circle Fitting",
    description:
      "Annular ROI + 24-sector centroid sampling + RANSAC + Levenberg–Marquardt refinement. Centre accuracy < 0.1 px. Supports both Canny and Devernay sub-pixel edge modes.",
    category: "Geometric Fitting",
    tags: ["C++", "RANSAC", "Sub-pixel", "OpenCV"],
    icon: "⭕",
    featured: true,
  },
  {
    id: "line-fit",
    name: "Line Fitting",
    description:
      "Rotated-rectangle ROI with segmented centroid sampling along the line direction. RANSAC + least-squares refinement. Endpoint accuracy < 0.2 px.",
    category: "Geometric Fitting",
    tags: ["C++", "RANSAC", "Sub-pixel", "OpenCV"],
    icon: "📏",
  },
  {
    id: "ellipse-fit",
    name: "Ellipse Fitting",
    description:
      "Elliptical annular ROI with eccentricity constraint filtering. Robust to partial occlusion and non-uniform illumination.",
    category: "Geometric Fitting",
    tags: ["C++", "RANSAC", "OpenCV"],
    icon: "🥚",
  },
  {
    id: "rect-fit",
    name: "Rectangle Fitting",
    description:
      "Four-edge detection via Hough / RANSAC with right-angle orthogonality constraint. Outputs four corner points in sub-pixel coordinates.",
    category: "Geometric Fitting",
    tags: ["C++", "Hough", "RANSAC", "OpenCV"],
    icon: "▭",
  },
  {
    id: "template-match",
    name: "Shape Template Matching",
    description:
      "Gradient-orientation based rotation-invariant template matching. Robust to illumination changes and partial occlusion. No retraining needed.",
    category: "Feature Matching",
    tags: ["C++", "OpenCV", "Rotation-invariant"],
    icon: "🔎",
    featured: true,
  },
  {
    id: "patchcore",
    name: "PatchCore Defect Detection",
    description:
      "DINOv2 + PatchCore unsupervised anomaly detection. Train on 5–10 normal images only — zero defect samples required. Outputs per-pixel heatmap. C++ inference via LibTorch.",
    category: "Defect Detection",
    tags: ["C++", "LibTorch", "DINOv2", "FAISS"],
    icon: "🧠",
    featured: true,
  },
  {
    id: "plugin-sdk",
    name: "Plugin SDK",
    description:
      "Pure-C API for integrating VisionLab as a subprocess plugin. Windows shared-memory IPC with < 2 ms round-trip. Supports sync, async batch, and embedded-UI modes. No host-side OpenCV or PyTorch dependency.",
    category: "Integration",
    tags: ["C API", "IPC", "Shared Memory", "Windows"],
    icon: "🔌",
  },
];

const categoryOrder = ["Geometric Fitting", "Feature Matching", "Defect Detection", "Integration"];
const categories = categoryOrder.filter((cat) => tools.some((t) => t.category === cat));

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-blue-900 dark:text-blue-300 mb-3">Algorithm Modules</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl">
          Six production-ready vision algorithms plus a Plugin SDK — all
          accessible from C/C++ with no OpenCV or PyTorch dependency in your
          host application.
        </p>
      </div>

      {categories.map((cat) => {
        const catTools = tools.filter((t) => t.category === cat);
        return (
          <div key={cat} className="mb-12">
            <h2 className="text-slate-600 dark:text-slate-400 font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-3">
              {cat}
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}


