import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { getBlogContent, getContentSlugs, getAllBlogs } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getContentSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugs = getContentSlugs("blog");
  if (!slugs.includes(slug)) return {};
  const { meta } = await getBlogContent(slug);
  return { title: meta.title, description: meta.description };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const slugs = getContentSlugs("blog");
  if (!slugs.includes(slug)) notFound();

  const { meta, content } = await getBlogContent(slug);
  const allBlogs = getAllBlogs();
  const currentIdx = allBlogs.findIndex((p) => p.slug === slug);
  const prev = allBlogs[currentIdx - 1];
  const next = allBlogs[currentIdx + 1];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Knowledge Base
      </Link>

      <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {meta.tags.map((tag) => (
              <span key={tag}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-blue-900 dark:text-blue-300 leading-tight mb-4">
            {meta.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">{meta.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 pb-8 border-b border-slate-200 dark:border-slate-700">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(meta.date)}
            </span>
            {meta.readingTime && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {meta.readingTime}
              </span>
            )}
          </div>
        </header>

        {/* MDX Content with math, code highlighting */}
        <div className="prose max-w-none">{content}</div>

      {/* Prev / Next */}
      {(prev || next) && (
        <div className="mt-16 grid grid-cols-2 gap-4">
          {prev ? (
            <Link href={`/blog/${prev.slug}`}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-slate-800 transition-colors text-left">
              <div className="text-xs text-slate-400 dark:text-slate-500 mb-1">← Previous</div>
              <div className="text-slate-700 dark:text-slate-300 text-sm font-medium line-clamp-1">{prev.title}</div>
            </Link>
          ) : <div />}
          {next && (
            <Link href={`/blog/${next.slug}`}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-slate-800 transition-colors text-right">
              <div className="text-xs text-slate-400 dark:text-slate-500 mb-1">Next →</div>
              <div className="text-slate-700 dark:text-slate-300 text-sm font-medium line-clamp-1">{next.title}</div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

