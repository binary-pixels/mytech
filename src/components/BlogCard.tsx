import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { BlogMeta } from "@/types";

interface BlogCardProps {
  post: BlogMeta;
  className?: string;
}

export default function BlogCard({ post, className }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className={cn("group block", className)}>
      <article className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 glow-blue shadow-sm transition-all duration-300 h-full flex flex-col">
        {post.image && (
          <div className="relative aspect-[16/7] overflow-hidden bg-slate-100">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-base leading-snug mb-2 group-hover:text-blue-700 transition-colors flex-1">
            {post.title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
            {post.description}
          </p>

          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 text-xs pt-3 border-t border-slate-100 dark:border-slate-700">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {formatDate(post.date)}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {post.readingTime}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
