import Link from "next/link";
import { GitBranch, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">👁</span>
              <span className="font-bold">
                <span className="gradient-text">Vision</span>
                <span className="text-slate-300">Lab</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Open-source machine vision toolkit for industrial inspection,
              deep learning, 3D reconstruction, and computer vision research.
            </p>
          </div>

          <div>
            <h4 className="text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                ["Projects", "/projects"],
                ["Blog", "/blog"],
                ["Tools", "/tools"],
                ["About", "/about"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-500 hover:text-cyan-400 text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-slate-800 text-slate-500 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
              >
                <GitBranch size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-slate-800 text-slate-500 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
              >
                <ExternalLink size={18} />
              </a>
              <a
                href="mailto:contact@example.com"
                className="p-2 rounded-lg border border-slate-800 text-slate-500 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} VisionLab. Built with Next.js &
            Tailwind CSS.
          </p>
          <p className="text-slate-700 text-xs">
            Machine Vision · Deep Learning · Computer Vision
          </p>
        </div>
      </div>
    </footer>
  );
}
