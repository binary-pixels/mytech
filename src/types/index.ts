export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  image: string;
  video?: string;
  gallery?: string[];
  featured?: boolean;
  tech?: string[];
  github?: string;
  demo?: string;
}

export interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
  readingTime?: string;
  featured?: boolean;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  github?: string;
  demo?: string;
  icon: string;
  featured?: boolean;
}
