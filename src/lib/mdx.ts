import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { ProjectMeta, BlogMeta } from "@/types";
import { ArchDiagram } from "@/components/ArchDiagram";

const contentRoot = path.join(process.cwd(), "content");

export function getContentSlugs(type: "projects" | "blog"): string[] {
  const dir = path.join(contentRoot, type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getProjectMeta(slug: string): ProjectMeta {
  const filePath = path.join(contentRoot, "projects", `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);
  return { slug, ...data } as ProjectMeta;
}

export function getBlogMeta(slug: string): BlogMeta {
  const filePath = path.join(contentRoot, "blog", `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const rt = readingTime(content);
  return {
    slug,
    readingTime: `${Math.ceil(rt.minutes)} min read`,
    ...data,
  } as BlogMeta;
}

export function getAllProjects(): ProjectMeta[] {
  return getContentSlugs("projects")
    .map((slug) => getProjectMeta(slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllBlogs(): BlogMeta[] {
  return getContentSlugs("blog")
    .map((slug) => getBlogMeta(slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mdxOptions: any = {
  mdxOptions: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeKatex,
      rehypeHighlight,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
  },
};

export async function getProjectContent(slug: string) {
  const filePath = path.join(contentRoot, "projects", `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const { content: mdxContent } = await compileMDX({
    source: content,
    components: { ArchDiagram },
    options: mdxOptions,
  });
  return { meta: { slug, ...data } as ProjectMeta, content: mdxContent };
}

export async function getBlogContent(slug: string) {
  const filePath = path.join(contentRoot, "blog", `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const rt = readingTime(content);
  const { content: mdxContent } = await compileMDX({
    source: content,
    components: { ArchDiagram },
    options: mdxOptions,
  });
  return {
    meta: {
      slug,
      readingTime: `${Math.ceil(rt.minutes)} min read`,
      ...data,
    } as BlogMeta,
    content: mdxContent,
  };
}
