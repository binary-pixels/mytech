import Link from "next/link";
import { ArrowRight, Code2, Brain, Cpu, Layers, BookOpen, FolderKanban, Microscope, CircuitBoard, Cog, FlaskConical } from "lucide-react";
import StatsCounter from "@/components/StatsCounter";
import ProjectCard from "@/components/ProjectCard";
import BlogCard from "@/components/BlogCard";
import { getAllProjects, getAllBlogs } from "@/lib/mdx";

const benefits = [
  {
    icon: <Layers size={28} className="text-blue-600" />,
    title: "All-in-One Toolkit",
    desc: "Sub-pixel geometry, AI defect detection, and model training — everything you need in a single application. No patching together multiple libraries.",
  },
  {
    icon: <Cpu size={28} className="text-indigo-600" />,
    title: "Production-Grade Accuracy",
    desc: "RANSAC + Devernay sub-pixel edges deliver circle-centre accuracy below 0.1 px. Reliable results even under vibration, glare, and partial occlusion.",
  },
  {
    icon: <Code2 size={28} className="text-blue-600" />,
    title: "Integrates in Minutes",
    desc: "Pure-C Plugin SDK with shared-memory IPC under 2 ms. Embed VisionLab into any C/C++ host — no OpenCV or PyTorch dependency in your codebase.",
  },
];

const exploreCards = [
  {
    icon: <Layers size={22} className="text-blue-600" />,
    label: "Algorithm Modules",
    desc: "Explore the full set of geometric and AI vision tools — parameters, accuracy specs, and when to use each.",
    href: "/tools",
  },
  {
    icon: <FolderKanban size={22} className="text-indigo-600" />,
    label: "Case Studies",
    desc: "Real deployment scenarios: wafer inspection, surface defect detection, and MES integration.",
    href: "/projects",
  },
  {
    icon: <BookOpen size={22} className="text-blue-600" />,
    label: "Technical Blog",
    desc: "Deep dives into the mathematics, implementation details, and best-practice guides behind each algorithm.",
    href: "/blog",
  },
];

const industries = [
  { icon: <CircuitBoard size={20} />, name: "Semiconductors & PCB" },
  { icon: <Cog size={20} />, name: "Precision Machining" },
  { icon: <FlaskConical size={20} />, name: "Pharmaceuticals" },
  { icon: <Microscope size={20} />, name: "Medical Devices" },
  { icon: <Brain size={20} />, name: "Battery & EV" },
  { icon: <Layers size={20} />, name: "Consumer Electronics" },
];

export default function HomePage() {
  const projects = getAllProjects().slice(0, 3);
  const posts = getAllBlogs().slice(0, 3);

  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative bg-white dark:bg-slate-900 pt-[72px] overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-72px)]">
          {/* Left: text */}
          <div>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">
              Industrial Machine Vision Toolkit
            </p>
            <h1 className="leading-tight tracking-tight mb-6">
              <span className="gradient-text text-5xl sm:text-6xl lg:text-7xl font-black block">VisionLab</span>
              <span className="gradient-text text-2xl sm:text-3xl lg:text-4xl font-bold block mt-2">See. Measure. Inspect.</span>
            </h1>
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
              From sub-pixel geometric measurement to AI-powered defect detection —
              VisionLab gives industrial engineers a complete, deployable machine
              vision solution with a{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">Plugin SDK</span> that
              integrates into any existing system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors"
              >
                Explore Algorithms <ArrowRight size={18} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-blue-300 text-blue-700 font-semibold hover:bg-blue-50 transition-all"
              >
                About VisionLab
              </Link>
            </div>
            <StatsCounter />
          </div>

          {/* Right: die bonder wafer vision mockup */}
          <div className="relative flex items-center justify-center">
            <div className="w-full aspect-[4/3] rounded-2xl bg-[#050d1a] overflow-hidden shadow-2xl border border-slate-700 relative">
              <svg viewBox="0 0 480 360" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Background grid */}
                  <pattern id="bgGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#0d1b3e" strokeWidth="0.4"/>
                  </pattern>
                  {/* Clip to wafer circle */}
                  <clipPath id="waferClip">
                    <circle cx="240" cy="183" r="149"/>
                  </clipPath>
                  {/* Iridescent rainbow gradient (NW→SE like real silicon) */}
                  <linearGradient id="irid1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#4ade80"/>
                    <stop offset="20%"  stopColor="#c084fc"/>
                    <stop offset="42%"  stopColor="#f472b6"/>
                    <stop offset="65%"  stopColor="#818cf8"/>
                    <stop offset="100%" stopColor="#38bdf8"/>
                  </linearGradient>
                  {/* Second diagonal for color depth */}
                  <linearGradient id="irid2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="#86efac" stopOpacity="0.55"/>
                    <stop offset="40%"  stopColor="#f9a8d4" stopOpacity="0.35"/>
                    <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.55"/>
                  </linearGradient>
                  {/* Specular highlight */}
                  <radialGradient id="specular" cx="38%" cy="33%" r="42%">
                    <stop offset="0%"   stopColor="white" stopOpacity="0.35"/>
                    <stop offset="50%"  stopColor="white" stopOpacity="0.08"/>
                    <stop offset="100%" stopColor="white" stopOpacity="0"/>
                  </radialGradient>
                  {/* Metallic edge ring */}
                  <radialGradient id="metalRing" cx="50%" cy="50%" r="50%">
                    <stop offset="91%"  stopColor="transparent"/>
                    <stop offset="93%"  stopColor="#777" stopOpacity="0.7"/>
                    <stop offset="96%"  stopColor="#ccc" stopOpacity="0.85"/>
                    <stop offset="98%"  stopColor="#888" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#333" stopOpacity="0.8"/>
                  </radialGradient>
                  {/* Vignette */}
                  <radialGradient id="vign" cx="50%" cy="48%" r="52%">
                    <stop offset="58%" stopColor="transparent"/>
                    <stop offset="100%" stopColor="#020812" stopOpacity="0.75"/>
                  </radialGradient>
                </defs>

                {/* Dark background — no grid pattern inside wafer area */}
                <rect width="480" height="360" fill="#050d1a"/>

                {/* Metallic edge ring (slightly bigger than wafer) */}
                <circle cx="240" cy="183" r="153" fill="#1e1e1e" stroke="#555" strokeWidth="0.5"/>

                {/* Wafer iridescent surface — clipped to circle */}
                <g clipPath="url(#waferClip)">
                  {/* Base iridescent fill */}
                  <circle cx="240" cy="183" r="149" fill="url(#irid1)"/>
                  <circle cx="240" cy="183" r="149" fill="url(#irid2)"/>
                  {/* Specular highlight */}
                  <circle cx="240" cy="183" r="149" fill="url(#specular)"/>

                  {/* Die grid lines — vertical (pitch 28px, 11 lines) */}
                  {[100,128,156,184,212,240,268,296,324,352,380].map(x => (
                    <line key={`v${x}`} x1={x} y1="34" x2={x} y2="332" stroke="#000" strokeWidth="0.9" opacity="0.38"/>
                  ))}
                  {/* Die grid lines — horizontal */}
                  {[43,71,99,127,155,183,211,239,267,295,323].map(y => (
                    <line key={`h${y}`} x1="91" y1={y} x2="389" y2={y} stroke="#000" strokeWidth="0.9" opacity="0.38"/>
                  ))}

                  {/* Target die — soft green tint */}
                  <rect x={254} y={169} width={28} height={28} fill="rgba(34,197,94,0.22)"/>
                </g>

                {/* Metallic ring overlay on top of wafer edge */}
                <circle cx="240" cy="183" r="153" fill="url(#metalRing)"/>

                {/* Wafer orientation flat (bottom notch) */}
                <rect x="217" y="333" width="46" height="5" rx="2" fill="#141414"/>

                {/* Target die corner brackets (drawn above clip) */}
                <path d="M254 175 L254 169 L260 169" fill="none" stroke="#16a34a" strokeWidth={2}/>
                <path d="M276 169 L282 169 L282 175" fill="none" stroke="#16a34a" strokeWidth={2}/>
                <path d="M254 191 L254 197 L260 197" fill="none" stroke="#16a34a" strokeWidth={2}/>
                <path d="M276 197 L282 197 L282 191" fill="none" stroke="#16a34a" strokeWidth={2}/>
                {/* Target die crosshair */}
                <line x1="262" y1="183" x2="274" y2="183" stroke="#22c55e" strokeWidth={1.2}/>
                <line x1="268" y1="177" x2="268" y2="189" stroke="#22c55e" strokeWidth={1.2}/>
                <circle cx="268" cy="183" r={2} fill="#22c55e"/>

                {/* Extended crosshair dashes from target die */}
                <line x1="92"  y1="183" x2="254" y2="183" stroke="#22c55e" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.45"/>
                <line x1="282" y1="183" x2="388" y2="183" stroke="#22c55e" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.45"/>
                <line x1="268" y1="35"  x2="268" y2="169" stroke="#22c55e" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.45"/>
                <line x1="268" y1="197" x2="268" y2="333" stroke="#22c55e" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.45"/>

                {/* Wafer edge circle-fit overlay */}
                <circle cx="240" cy="183" r="149" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="9 5" opacity="0.6"/>
                {/* Edge sample points */}
                {Array.from({length: 20}, (_, i) => {
                  const rad = (i * 18 * Math.PI) / 180;
                  return <circle key={`ep-${i}`} cx={240+149*Math.cos(rad)} cy={183+149*Math.sin(rad)} r={2.5} fill="#60a5fa" opacity={0.8}/>;
                })}

                {/* Wafer center mark */}
                <line x1="234" y1="183" x2="246" y2="183" stroke="#3d5080" strokeWidth="1"/>
                <line x1="240" y1="177" x2="240" y2="189" stroke="#3d5080" strokeWidth="1"/>
                <circle cx="240" cy="183" r="2" fill="none" stroke="#3d5080" strokeWidth="1"/>

                {/* HUD: Die locate (top-left) */}
                <rect x="8" y="8" width="178" height="76" rx="4" fill="#030b1c" fillOpacity="0.93" stroke="#1e3a8a" strokeWidth="1"/>
                <rect x="8" y="8" width="178" height="17" rx="4" fill="#1e3a8a" fillOpacity="0.85"/>
                <text x="15" y="20.5" fill="#93c5fd" fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.8">DIE LOCATE RESULT</text>
                <text x="15" y="36" fill="#64748b" fontSize="7.5" fontFamily="monospace">Position X</text>
                <text x="95" y="36" fill="#e2e8f0" fontSize="7.5" fontFamily="monospace">2.431 mm</text>
                <text x="15" y="49" fill="#64748b" fontSize="7.5" fontFamily="monospace">Position Y</text>
                <text x="95" y="49" fill="#e2e8f0" fontSize="7.5" fontFamily="monospace">1.876 mm</text>
                <text x="15" y="62" fill="#64748b" fontSize="7.5" fontFamily="monospace">Angle</text>
                <text x="95" y="62" fill="#e2e8f0" fontSize="7.5" fontFamily="monospace">0.32 °</text>
                <text x="15" y="75" fill="#64748b" fontSize="7.5" fontFamily="monospace">Score</text>
                <text x="95" y="75" fill="#4ade80" fontSize="7.5" fontFamily="monospace" fontWeight="bold">98.7 %  ✓</text>

                {/* HUD: Status (top-right) */}
                <rect x="302" y="8" width="170" height="23" rx="4" fill="#052e16" fillOpacity="0.92" stroke="#166534" strokeWidth="1"/>
                <circle cx="314" cy="19.5" r="3.5" fill="#22c55e"/>
                <text x="322" y="23.5" fill="#4ade80" fontSize="8.5" fontFamily="monospace" fontWeight="bold">BONDING  Die 25 / 112</text>

                {/* Legend (bottom) */}
                <rect x="8" y="322" width="160" height="32" rx="3" fill="#030b1c" fillOpacity="0.88" stroke="#0f2040" strokeWidth="1"/>
                <rect x="16" y="330" width="12" height="9" fill="url(#irid1)" stroke="#000" strokeWidth="0.5" opacity="0.85" rx="0.5"/>
                <text x="32" y="337" fill="#64748b" fontSize="7" fontFamily="monospace">Unprocessed</text>
                <rect x="108" y="330" width="12" height="9" fill="rgba(34,197,94,0.25)" stroke="#16a34a" strokeWidth="1" rx="0.5"/>
                <text x="124" y="337" fill="#4ade80" fontSize="7" fontFamily="monospace">Target</text>
                <text x="16" y="349" fill="#1e3060" fontSize="7" fontFamily="monospace">Wafer W240603-A  ·  12"  ·  0.02 mm pitch</text>

                {/* Vignette */}
                <rect width="480" height="360" fill="url(#vign)" pointerEvents="none"/>
              </svg>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-3">
              <span className="text-2xl font-black text-blue-700">112</span>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">dies / wafer</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">sub-pixel locate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 Key Benefits ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-300 mb-3">Why VisionLab</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Designed for real production environments — where accuracy, reliability, and integration speed all matter</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 shadow-sm transition-colors">
              <div className="mb-4">{b.icon}</div>
              <h3 className="text-slate-900 dark:text-slate-100 font-semibold mb-2">{b.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What is VisionLab ── */}
      <section className="border-y border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-slate-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">What is VisionLab?</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-300 mb-4 leading-snug">
              A complete machine vision platform — standalone and embeddable
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              VisionLab combines proven geometric measurement algorithms with
              modern AI-based defect detection in a single Qt application. It
              ships with a Plugin SDK so any C/C++ upper-computer can offload
              vision tasks to VisionLab as a sidecar process — no vision
              dependencies in the host.
            </p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
              Every algorithm is built around the mathematics: sub-pixel edge
              localisation, RANSAC robust estimation, and Vision Transformer
              feature spaces — so results hold up under real factory conditions.
            </p>
          </div>
          <Link
            href="/about"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm hover:border-blue-400 hover:text-blue-700 transition-all"
          >
            Learn more <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── Explore VisionLab ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-300 mb-3">Explore VisionLab</h2>
          <p className="text-slate-600 dark:text-slate-400">Algorithms, case studies, and deep-dive technical articles</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {exploreCards.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="group p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 shadow-sm transition-all"
            >
              <div className="mb-3">{c.icon}</div>
              <h3 className="text-slate-900 dark:text-slate-100 font-semibold mb-2 group-hover:text-blue-700 transition-colors">
                {c.label} <ArrowRight size={14} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Used Across Industries ── */}
      <section className="border-y border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-2/5">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Built for Industry</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-300 mb-4 leading-snug">
                Deployed across demanding manufacturing environments
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                VisionLab algorithms are designed to operate under real factory
                conditions — variable lighting, vibration, partial occlusion —
                where off-the-shelf solutions fall short.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {industries.map((ind) => (
                <div key={ind.name} className="flex items-center gap-3 p-3 rounded-lg border border-blue-100 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm">
                  <span className="text-blue-600 dark:text-blue-400 shrink-0">{ind.icon}</span>
                  {ind.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Case Studies ── */}
      {projects.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">In Practice</p>
              <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-300 mb-2">Case Studies</h2>
              <p className="text-slate-600 dark:text-slate-400">Real-world deployments powered by VisionLab</p>
            </div>
            <Link href="/projects" className="text-blue-600 dark:text-blue-400 text-sm hover:underline hidden sm:flex items-center gap-1">
              All cases <ArrowRight size={14} />
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
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Knowledge Base</p>
              <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-300 mb-2">Technical Articles</h2>
              <p className="text-slate-600 dark:text-slate-400">Algorithm deep-dives, integration guides, and training tutorials</p>
            </div>
            <Link href="/blog" className="text-blue-600 dark:text-blue-400 text-sm hover:underline hidden sm:flex items-center gap-1">
              All articles <ArrowRight size={14} />
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

