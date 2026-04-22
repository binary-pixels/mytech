import type { Metadata } from "next";
import { getAllProjects } from "@/lib/mdx";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Projects",
  description: "Machine vision projects: industrial inspection, deep learning, 3D reconstruction, and more.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const categories = [...new Set(projects.map((p) => p.category))].sort();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-24">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-100 mb-3">
          Projects
        </h1>
        <p className="text-slate-500 text-lg max-w-xl">
          A decade of machine vision work — from PCB inspection lines to
          real-time 3D reconstruction systems.
        </p>
      </div>
      <ProjectsClient projects={projects} categories={categories} />
    </div>
  );
}
