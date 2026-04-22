import type { Metadata } from "next";
import ToolCard from "@/components/ToolCard";
import type { Tool } from "@/types";

export const metadata: Metadata = {
  title: "Tools",
  description: "Open-source machine vision tools and utilities built over 10 years.",
};

const tools: Tool[] = [
  {
    id: "calkit",
    name: "CalKit",
    description:
      "A Python library for camera and LiDAR calibration. Supports Zhang's method, fisheye, multi-camera, and hand-eye calibration.",
    category: "Calibration",
    tags: ["Python", "OpenCV", "NumPy"],
    icon: "📐",
    github: "https://github.com",
    featured: true,
  },
  {
    id: "defectron",
    name: "Defectron",
    description:
      "Real-time surface defect detection engine. Runs at 120 fps on edge GPU hardware with configurable sensitivity thresholds.",
    category: "Inspection",
    tags: ["C++", "CUDA", "TensorRT"],
    icon: "🔍",
    github: "https://github.com",
    demo: "https://example.com",
    featured: true,
  },
  {
    id: "depthcraft",
    name: "DepthCraft",
    description:
      "Stereo and structured-light 3D reconstruction toolkit. Exports to PLY/OBJ, integrates with ROS2.",
    category: "3D Vision",
    tags: ["Python", "PCL", "ROS2"],
    icon: "🗺",
    github: "https://github.com",
  },
  {
    id: "labelflow",
    name: "LabelFlow",
    description:
      "Semi-automatic annotation tool leveraging SAM + CLIP for rapid dataset building. Exports COCO, YOLO, Pascal VOC formats.",
    category: "Data & Annotation",
    tags: ["Python", "React", "SAM"],
    icon: "🏷",
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: "opticsim",
    name: "OptiSim",
    description:
      "Optical system simulator for lens design, PSF analysis, and diffraction modeling. Useful for camera selection and system design.",
    category: "Optics",
    tags: ["Python", "SciPy", "Matplotlib"],
    icon: "🔭",
    github: "https://github.com",
  },
  {
    id: "visionbench",
    name: "VisionBench",
    description:
      "Benchmark suite for vision algorithm performance. Measures latency, throughput, memory on CPU/GPU/edge devices.",
    category: "Tooling",
    tags: ["Python", "ONNX", "ONNX Runtime"],
    icon: "⚡",
    github: "https://github.com",
  },
  {
    id: "patchnet",
    name: "PatchNet",
    description:
      "Lightweight anomaly detection via patch-based embedding. Achieves 99.2% AUC on MVTec-AD with < 10ms inference.",
    category: "Deep Learning",
    tags: ["PyTorch", "FAISS", "Python"],
    icon: "🧠",
    github: "https://github.com",
    featured: true,
  },
  {
    id: "colormap",
    name: "ColorCalib",
    description:
      "Colorimetric calibration tool using Macbeth ColorChecker. Corrects color response across different lighting conditions.",
    category: "Calibration",
    tags: ["Python", "OpenCV", "Colour-Science"],
    icon: "🎨",
    github: "https://github.com",
  },
];

const categories = [...new Set(tools.map((t) => t.category))].sort();

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-24">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-100 mb-3">Tools</h1>
        <p className="text-slate-500 text-lg max-w-xl">
          Open-source libraries, utilities, and applications built over 10 years
          of machine vision engineering.
        </p>
      </div>

      {categories.map((cat) => {
        const catTools = tools.filter((t) => t.category === cat);
        return (
          <div key={cat} className="mb-12">
            <h2 className="text-slate-400 font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-3">
              {cat}
              <span className="h-px flex-1 bg-slate-800" />
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
