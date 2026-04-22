import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, GitBranch, ExternalLink, Tag } from "lucide-react";
import { getProjectContent, getContentSlugs, getAllProjects } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import VideoPlayer from "@/components/VideoPlayer";
import ImageGallery from "@/components/ImageGallery";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getContentSlugs("projects").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugs = getContentSlugs("projects");
  if (!slugs.includes(slug)) return {};
  const { meta } = await getProjectContent(slug);
  return { title: meta.title, description: meta.description };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const slugs = getContentSlugs("projects");
  if (!slugs.includes(slug)) notFound();

  const { meta, content } = await getProjectContent(slug);
  const allProjects = getAllProjects();
  const currentIdx = allProjects.findIndex((p) => p.slug === slug);
  const prev = allProjects[currentIdx + 1];
  const next = allProjects[currentIdx - 1];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-24">
      {/* Back */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-400 text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Projects
      </Link>

      {/* Header */}
      <header className="mb-10">
        <span className="text-xs text-violet-400 font-medium uppercase tracking-wider">
          {meta.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-100 mt-2 mb-4 leading-tight">
          {meta.title}
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-6">{meta.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(meta.date)}
          </span>
          {meta.github && (
            <a href={meta.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
              <GitBranch size={14} /> GitHub
            </a>
          )}
          {meta.demo && (
            <a href={meta.demo} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
              <ExternalLink size={14} /> Live Demo
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {meta.tags.map((tag) => (
            <span key={tag}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
              <Tag size={10} /> {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Video */}
      {meta.video && (
        <div className="mb-10">
          <VideoPlayer url={meta.video} poster={meta.image} />
        </div>
      )}

      {/* Gallery */}
      {meta.gallery && meta.gallery.length > 0 && (
        <div className="mb-10">
          <h2 className="text-slate-300 font-semibold mb-4">Gallery</h2>
          <ImageGallery images={meta.gallery} />
        </div>
      )}

      {/* MDX Content */}
      <div className="prose max-w-none">{content}</div>

      {/* Tech stack */}
      {meta.tech && meta.tech.length > 0 && (
        <div className="mt-12 p-6 rounded-xl border border-slate-800 bg-slate-900">
          <h3 className="text-slate-300 font-semibold mb-4 text-sm uppercase tracking-wider">
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {meta.tech.map((t) => (
              <span key={t}
                className="px-3 py-1 rounded-lg text-sm bg-slate-800 text-slate-400 border border-slate-700">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Prev / Next */}
      <div className="mt-16 grid grid-cols-2 gap-4">
        {prev && (
          <Link href={`/projects/${prev.slug}`}
            className="p-4 rounded-xl border border-slate-800 hover:border-cyan-400/30 transition-colors text-left">
            <div className="text-xs text-slate-600 mb-1">← Previous</div>
            <div className="text-slate-300 text-sm font-medium line-clamp-1">{prev.title}</div>
          </Link>
        )}
        {next && (
          <Link href={`/projects/${next.slug}`}
            className="p-4 rounded-xl border border-slate-800 hover:border-cyan-400/30 transition-colors text-right col-start-2">
            <div className="text-xs text-slate-600 mb-1">Next →</div>
            <div className="text-slate-300 text-sm font-medium line-clamp-1">{next.title}</div>
          </Link>
        )}
      </div>
    </div>
  );
}
