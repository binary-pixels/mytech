import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { put, list, del } from '@vercel/blob';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const AUDIO_TYPES = ['audio/webm', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'];

const IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'uploads');
const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio');

// Use Vercel Blob on Vercel platform, local filesystem for development
const useBlob = process.env.VERCEL === '1';

export async function GET() {
  try {
    if (useBlob) {
      const { blobs } = await list({ prefix: 'images/' });
      const images = blobs
        .filter((b) => /\.(jpg|jpeg|png|gif|webp)$/i.test(b.pathname))
        .map((b) => ({
          filename: b.pathname.replace('images/', ''),
          url: b.url,
          size: b.size,
          uploadedAt: b.uploadedAt.toISOString(),
        }))
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      return NextResponse.json({ images });
    }

    // Local filesystem fallback
    if (!fs.existsSync(IMAGE_DIR)) {
      return NextResponse.json({ images: [] });
    }
    const files = fs.readdirSync(IMAGE_DIR)
      .filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .map((f) => {
        const stat = fs.statSync(path.join(IMAGE_DIR, f));
        return {
          filename: f,
          url: `/images/uploads/${f}`,
          size: stat.size,
          uploadedAt: stat.birthtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    return NextResponse.json({ images: files });
  } catch {
    return NextResponse.json({ images: [] });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const baseType = file.type.split(';')[0].trim();
    const isImage = IMAGE_TYPES.includes(baseType);
    const isAudio = AUDIO_TYPES.includes(baseType);

    if (!isImage && !isAudio) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 10MB' }, { status: 400 });
    }

    // Sanitize extension — prevent path traversal
    const rawExt = file.name.split('.').pop() || (isAudio ? 'webm' : 'jpg');
    const ext = rawExt.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6) || 'bin';

    const buffer = Buffer.from(await file.arrayBuffer());

    if (useBlob) {
      const prefix = isAudio ? 'audio/' : 'images/';
      const filename = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { url } = await put(filename, buffer, {
        access: 'public',
        contentType: baseType,
      });
      return NextResponse.json({
        url,
        filename: filename.replace(prefix, ''),
        size: file.size,
        type: baseType,
        kind: isAudio ? 'audio' : 'image',
      });
    }

    // Local filesystem fallback
    const uploadDir = isAudio ? AUDIO_DIR : IMAGE_DIR;
    const urlPrefix = isAudio ? '/audio' : '/images/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    return NextResponse.json({
      url: `${urlPrefix}/${filename}`,
      filename,
      size: file.size,
      type: baseType,
      kind: isAudio ? 'audio' : 'image',
    });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const kind = searchParams.get('kind') || 'image';
    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 });
    }

    if (useBlob) {
      const prefix = kind === 'audio' ? 'audio/' : 'images/';
      await del(`${prefix}${filename}`);
      return NextResponse.json({ success: true });
    }

    // Local filesystem fallback
    const uploadDir = kind === 'audio' ? AUDIO_DIR : IMAGE_DIR;
    const filePath = path.join(uploadDir, filename);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
