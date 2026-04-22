"use client";

import BlogCard from "@/components/BlogCard";
import TagFilter, { useTagFilter } from "@/components/TagFilter";
import type { BlogMeta } from "@/types";

export default function BlogClient({ posts }: { posts: BlogMeta[] }) {
  const { selected, setSelected, filtered, allTags } = useTagFilter(posts);

  return (
    <div>
      <TagFilter tags={allTags} selected={selected} onSelect={setSelected} />
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-600">No posts found.</div>
      )}
    </div>
  );
}
