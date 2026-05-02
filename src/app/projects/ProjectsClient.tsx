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
  const { selected, setSelected, filtered, allTags } = useTagFilter(projects);

  const displayProjects = filtered;

  return (
    <div>
      {/* Tag filter */}
      <TagFilter tags={allTags} selected={selected} onSelect={setSelected} />

      {/* Grid */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>

      {displayProjects.length === 0 && (
        <div className="text-center py-20 text-slate-400">No projects found.</div>
      )}
    </div>
  );
}

