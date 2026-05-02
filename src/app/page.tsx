import Link from "next/link";
import { ArrowRight, Code2, Brain, Cpu } from "lucide-react";
import ScanlineBackground from "@/components/ScanlineBackground";
import StatsCounter from "@/components/StatsCounter";
import ProjectCard from "@/components/ProjectCard";
import BlogCard from "@/components/BlogCard";
import { getAllProjects, getAllBlogs } from "@/lib/mdx";

const expertisePillars = [
  {
    icon: <Brain size={22} className="text-cyan-400" />,
    title: "Sub-pixel Geometric Fitting",
    desc: "Circle, line, ellipse, rectangle — all with RANSAC + Devernay sub-pixel edges, centre accuracy < 0.1 px",
  },
  {
    icon: <Cpu size={22} className="text-violet-400" />,
    title: "AI Defect Detection",
    desc: "DINOv2 + PatchCore unsupervised anomaly detection — train on 5 normal images, zero defect samples needed",
  },
  {
    icon: <Code2 size={22} className="text-cyan-400" />,
    title: "Plugin SDK Integration",
    desc: "Pure-C API, Windows IPC, < 2 ms latency — embed VisionLab into any C/C++ host in 8 lines of code",
  },
];

export default function HomePage() {
  const projects = getAllProjects().slice(0, 3);
  const posts = getAllBlogs().slice(0, 3);

  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <ScanlineBackground />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Open Source · Machine Vision Toolkit
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6">
            <span className="gradient-text">VisionLab</span>
            <br />
            <span className="text-slate-100">Machine Vision Toolkit</span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            A collection of open-source tools for{" "}
            <span className="text-slate-200">industrial inspection</span>,{" "}
            <span className="text-slate-200">3D reconstruction</span>, and{" "}
            <span className="text-slate-200">deep learning</span> — built for
            engineers who care about the math behind the pixels.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-slate-900 font-semibold hover:bg-cyan-300 transition-colors duration-200"
            >
              View Projects <ArrowRight size={18} />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:border-slate-500 hover:text-slate-100 transition-all duration-200"
            >
              Read Blog
            </Link>
          </div>

          <StatsCounter />
        </div>
      </section>

      {/* ── Expertise Pillars ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-100 mb-3">Core Capabilities</h2>
          <p className="text-slate-500">Capabilities built into VisionLab</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {expertisePillars.map((p) => (
            <div
              key={p.title}
              className="p-6 rounded-xl border border-slate-800 bg-slate-900 hover:border-cyan-400/20 transition-colors"
            >
              <div className="mb-4">{p.icon}</div>
              <h3 className="text-slate-100 font-semibold mb-2">{p.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Projects ── */}
      {projects.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-100 mb-2">Featured Projects</h2>
              <p className="text-slate-500">Real-world use cases powered by VisionLab algorithms</p>
            </div>
            <Link href="/projects" className="text-cyan-400 text-sm hover:underline hidden sm:flex items-center gap-1">
              All projects <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Latest Posts ── */}
      {posts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-100 mb-2">Latest Writing</h2>
              <p className="text-slate-500">Algorithm deep-dives and integration guides</p>
            </div>
            <Link href="/blog" className="text-cyan-400 text-sm hover:underline hidden sm:flex items-center gap-1">
              All posts <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
