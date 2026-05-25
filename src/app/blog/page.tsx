import type { Metadata } from "next";
import { getAllBlogs } from "@/lib/mdx";
import BlogClient from "./BlogClient";
import type { BlogMeta } from "@/types";

export const metadata: Metadata = {
  title: "Knowledge Base",
  description: "Deep dives into machine vision, deep learning, mathematics, and physics.",
};

async function getApiPosts(): Promise<BlogMeta[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
    const res = await fetch(`${baseUrl}/api/blog`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return (Array.isArray(data) ? data : []).map((p: { slug: string; title: string; description: string; date: string; tags: string[]; image?: string }) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      tags: p.tags,
      image: p.image,
      readingTime: undefined,
      fromApi: true,
    }));
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const mdxPosts = getAllBlogs();
  const apiPosts = await getApiPosts();

  // Merge and sort by date
  const allPosts = [...mdxPosts, ...apiPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-blue-900 dark:text-blue-300 mb-3">Knowledge Base</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl">
          Technical articles on vision algorithms, applied mathematics, optics, and
          machine vision engineering.
        </p>
      </div>
      <BlogClient posts={allPosts} />
    </div>
  );
}
