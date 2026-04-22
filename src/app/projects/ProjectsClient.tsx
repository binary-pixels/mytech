"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import TagFilter, { useTagFilter } from "@/components/TagFilter";
import type { ProjectMeta } from "@/types";

interface ProjectsClientProps {
  projects: ProjectMeta[];
  categories: string[];
}

export default function ProjectsClient({ projects, categories }: ProjectsClientProps) {
  const [activeCategory, setActiveCategory] = useState("");
  const { selected, setSelected, filtered, allTags } = useTagFilter(projects);

  const displayProjects =
    activeCategory
      ? filtered.filter((p) => p.category === activeCategory)
      : filtered;

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === "All" ? "" : cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              (cat === "All" ? activeCategory === "" : activeCategory === cat)
                ? "border-violet-400/50 bg-violet-400/10 text-violet-400"
                : "border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tag filter */}
      <TagFilter tags={allTags} selected={selected} onSelect={setSelected} />

      {/* Grid */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>

      {displayProjects.length === 0 && (
        <div className="text-center py-20 text-slate-600">No projects found.</div>
      )}
    </div>
  );
}
