import type { Metadata } from "next";
import { getAllBlogs } from "@/lib/mdx";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog",
  description: "Deep dives into machine vision, deep learning, mathematics, and physics.",
};

export default function BlogPage() {
  const posts = getAllBlogs();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-24">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-100 mb-3">Blog</h1>
        <p className="text-slate-500 text-lg max-w-xl">
          Technical writing on vision systems, applied mathematics, optics, and
          the physics behind intelligent machines.
        </p>
      </div>
      <BlogClient posts={posts} />
    </div>
  );
}
