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
      <article className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 hover:border-cyan-400/30 glow-cyan transition-all duration-300 h-full flex flex-col">
        {post.image && (
          <div className="relative aspect-[16/7] overflow-hidden bg-slate-800">
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
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-violet-400/10 text-violet-400 border border-violet-400/20"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-slate-100 font-semibold text-base leading-snug mb-2 group-hover:text-cyan-400 transition-colors flex-1">
            {post.title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
            {post.description}
          </p>

          <div className="flex items-center gap-4 text-slate-600 text-xs pt-3 border-t border-slate-800">
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
