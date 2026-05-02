import type { Metadata } from "next";
import { getAllBlogs } from "@/lib/mdx";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Knowledge Base",
  description: "Deep dives into machine vision, deep learning, mathematics, and physics.",
};

export default function BlogPage() {
  const posts = getAllBlogs();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-blue-900 dark:text-blue-300 mb-3">Knowledge Base</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl">
          Technical articles on vision algorithms, applied mathematics, optics, and
          machine vision engineering.
        </p>
      </div>
      <BlogClient posts={posts} />
    </div>
  );
}


