import Link from "next/link";
import Image from "next/image";
import { Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { ProjectMeta } from "@/types";
import ProjectCoverSVG from "@/components/ProjectCoverSVG";

interface ProjectCardProps {
  project: ProjectMeta;
  className?: string;
}

export default function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className={cn("group block", className)}>
      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 glow-blue shadow-sm transition-all duration-300 h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative overflow-hidden aspect-video bg-slate-100">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ProjectCoverSVG slug={project.slug} />
          )}
          {project.video && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full bg-blue-600/20 border border-blue-600/50 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          )}
          {project.featured && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <span className="text-xs text-indigo-600 font-medium uppercase tracking-wider mb-2">
            {project.category}
          </span>
          <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-base leading-snug mb-2 group-hover:text-blue-700 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
            <Calendar size={12} />
            <span>{formatDate(project.date)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
