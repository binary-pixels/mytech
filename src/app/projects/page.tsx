import type { Metadata } from "next";
import { getAllProjects } from "@/lib/mdx";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Machine vision case studies: industrial inspection, geometric measurement, defect detection, and more.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const categories = [...new Set(projects.map((p) => p.category))].sort();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-blue-900 dark:text-blue-300 mb-3">
          Case Studies
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl">
          Real-world machine vision deployments — from PCB inspection lines to
          real-time geometric measurement systems.
        </p>
      </div>
      <ProjectsClient projects={projects} categories={categories} />
    </div>
  );
}


