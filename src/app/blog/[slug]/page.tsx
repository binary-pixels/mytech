import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { getBlogContent, getContentSlugs } from "@/lib/mdx";
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-400 text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Blog
      </Link>

      <header className="mb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          {meta.tags.map((tag) => (
            <span key={tag}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-violet-400/10 text-violet-400 border border-violet-400/20">
              <Tag size={10} /> {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-100 leading-tight mb-4">
          {meta.title}
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-6">{meta.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500 pb-8 border-b border-slate-800">
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
    </div>
  );
}
