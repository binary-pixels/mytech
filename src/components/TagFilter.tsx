"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  tags: string[];
  selected: string;
  onSelect: (tag: string) => void;
}

export default function TagFilter({ tags, selected, onSelect }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {["All", ...tags].map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(tag === "All" ? "" : tag)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200",
            (tag === "All" ? selected === "" : selected === tag)
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

export function useTagFilter<T extends { tags: string[] }>(items: T[]) {
  const [selected, setSelected] = useState("");
  const filtered = selected ? items.filter((i) => i.tags.includes(selected)) : items;
  const allTags = [...new Set(items.flatMap((i) => i.tags))].sort();
  return { selected, setSelected, filtered, allTags };
}
