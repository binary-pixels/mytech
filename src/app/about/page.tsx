import type { Metadata } from "next";
import { Mail, GitBranch, ExternalLink, Download } from "lucide-react";
import { SkillGroup } from "@/components/SkillBar";
import Timeline from "@/components/Timeline";

export const metadata: Metadata = {
  title: "About",
  description: "Machine Vision & AI Engineer with 10 years of expertise.",
};

const skillGroups = [
  {
    title: "Vision & AI",
    skills: [
      { name: "Computer Vision (OpenCV, scikit-image)", level: 98, color: "cyan" as const },
      { name: "Deep Learning (PyTorch, TensorFlow)", level: 92, color: "cyan" as const },
      { name: "3D Vision (PCL, Open3D)", level: 88, color: "cyan" as const },
      { name: "SLAM & Calibration", level: 85, color: "cyan" as const },
    ],
  },
  {
    title: "Engineering",
    skills: [
      { name: "Python", level: 96, color: "violet" as const },
      { name: "C++ / CUDA", level: 82, color: "violet" as const },
      { name: "ROS / ROS2", level: 78, color: "violet" as const },
      { name: "Linux / Embedded Systems", level: 80, color: "violet" as const },
    ],
  },
  {
    title: "Mathematics & Physics",
    skills: [
      { name: "Linear Algebra & Geometry", level: 95, color: "cyan" as const },
      { name: "Probability & Statistics", level: 90, color: "cyan" as const },
      { name: "Optics & Photonics", level: 85, color: "cyan" as const },
      { name: "Signal & Image Processing", level: 93, color: "cyan" as const },
    ],
  },
];

const timeline = [
  {
    year: "2022–Present",
    title: "Lead Vision Engineer",
    company: "AI Perception Lab",
    description:
      "Leading a team of 8 to develop production-grade vision systems for semiconductor and automotive inspection. Shipped 3 systems processing > 1M parts/day.",
  },
  {
    year: "2018–2022",
    title: "Senior Computer Vision Engineer",
    company: "Industrial Vision Corp",
    description:
      "Designed and deployed real-time defect detection pipelines on 20+ production lines. Reduced false-reject rate from 4.2% to 0.3% using custom CNN architectures.",
  },
  {
    year: "2015–2018",
    title: "Computer Vision Researcher",
    company: "University Research Lab",
    description:
      "Research on stereo reconstruction and structured-light 3D sensing. Published 5 peer-reviewed papers. Developed hand-eye calibration algorithms still used in industry.",
  },
  {
    year: "2014–2015",
    title: "Vision Systems Engineer",
    company: "RoboTech Solutions",
    description:
      "Built camera-guided robot pick-and-place systems. First exposure to production-scale machine vision challenges.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-24">
      {/* Bio */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="shrink-0">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-cyan-400/20 flex items-center justify-center text-5xl">
              👁
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-black text-slate-100 mb-2">
              Machine Vision <span className="gradient-text">Engineer</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-2xl">
              I&apos;ve spent 10 years building systems that make machines see and
              understand the world. My work spans industrial inspection,
              autonomous perception, scientific imaging, and the mathematical
              theory underlying it all — from projective geometry to diffraction
              physics.
            </p>
            <p className="text-slate-500 leading-relaxed mb-8 max-w-2xl">
              I care deeply about the <em className="text-slate-300">why</em>{" "}
              behind algorithms — the linear algebra, the optics, the physics.
              That foundation lets me design solutions that work not just on
              benchmarks but in messy real-world production environments.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/resume.pdf"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-400 text-slate-900 font-semibold text-sm hover:bg-cyan-300 transition-colors"
              >
                <Download size={16} /> Resume
              </a>
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

      {/* Skills */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-slate-100 mb-8">Skills & Expertise</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {skillGroups.map((g) => (
            <SkillGroup key={g.title} {...g} />
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="text-2xl font-bold text-slate-100 mb-8">Experience</h2>
        <Timeline items={timeline} />
      </section>
    </div>
  );
}
