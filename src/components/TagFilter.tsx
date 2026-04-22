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
              ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-400"
              : "border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300"
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
