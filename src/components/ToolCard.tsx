import { ExternalLink, GitBranch, Tag } from "lucide-react";
import type { Tool } from "@/types";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 glow-blue shadow-sm transition-all duration-300 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{tool.icon}</div>
          <div>
            <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-sm">{tool.name}</h3>
            <span className="text-xs text-indigo-600 dark:text-indigo-400">{tool.category}</span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {tool.github && (
            <a
              href={tool.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 border border-slate-200 dark:border-slate-600 hover:border-blue-300 transition-all"
            >
              <GitBranch size={14} />
            </a>
          )}
          {tool.demo && (
            <a
              href={tool.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 border border-slate-200 dark:border-slate-600 hover:border-blue-300 transition-all"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1">{tool.description}</p>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            <Tag size={9} />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
