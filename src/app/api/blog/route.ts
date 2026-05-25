import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/blog-posts.json');

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
  body: string;
}

function readPosts(): BlogPost[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writePosts(posts: BlogPost[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  const posts = readPosts();

  if (slug) {
    const post = posts.find((p) => p.slug === slug);
    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  }

  return NextResponse.json(posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const posts = readPosts();

    const slug = body.slug || generateSlug(body.title);

    // Check for duplicate slug
    if (posts.some((p) => p.slug === slug)) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }

    const post: BlogPost = {
      id: `post-${Date.now()}`,
      slug,
      title: body.title,
      description: body.description || '',
      date: body.date || new Date().toISOString().split('T')[0],
      tags: body.tags || [],
      image: body.image || '',
      body: body.body || '',
    };

    posts.push(post);
    writePosts(posts);

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const posts = readPosts();
    const index = posts.findIndex((p) => p.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    posts[index] = { ...posts[index], ...body };
    writePosts(posts);

    return NextResponse.json(posts[index]);
  } catch {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const posts = readPosts();
    const filtered = posts.filter((p) => p.id !== id);

    if (filtered.length === posts.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    writePosts(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
