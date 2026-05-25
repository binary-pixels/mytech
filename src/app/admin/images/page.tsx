'use client';

import { useState, useEffect, useRef } from 'react';

interface ImageInfo {
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export default function AdminImagesPage() {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState<ImageInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      setLoading(true);
      const res = await fetch('/api/upload');
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      setMessage('Image uploaded');
      fetchImages();
    } catch {
      setMessage('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(filename: string) {
    if (!confirm('Delete this image?')) return;
    try {
      const res = await fetch(`/api/upload?filename=${filename}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setMessage('Image deleted');
      setSelected(null);
      fetchImages();
    } catch {
      setMessage('Delete failed');
    }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Image Gallery</h1>
        <label className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium cursor-pointer">
          {uploading ? 'Uploading...' : '+ Upload Image'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = '';
            }}
          />
        </label>
      </div>

      {message && (
        <div className="mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-gray-400 hover:text-gray-600 ml-2">&times;</button>
        </div>
      )}

      {images.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No images yet</p>
          <p className="text-sm mt-1">Upload images to use in blog posts and projects</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <button
              key={img.filename}
              onClick={() => setSelected(img)}
              className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 hover:border-blue-400 transition-colors relative group"
            >
              <img
                src={img.url}
                alt={img.filename}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-[10px] truncate">{img.filename}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Image Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <img
              src={selected.url}
              alt={selected.filename}
              className="w-full rounded-lg mb-4 max-h-80 object-contain bg-gray-100"
            />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Filename</span>
                <span className="text-gray-900 font-mono text-xs">{selected.filename}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Size</span>
                <span className="text-gray-900">{formatSize(selected.size)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Uploaded</span>
                <span className="text-gray-900">{new Date(selected.uploadedAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">URL</span>
                <span className="text-gray-900 font-mono text-xs truncate max-w-[250px] ml-2">{selected.url}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selected.url);
                  setMessage('URL copied to clipboard');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Copy URL
              </button>
              <button
                onClick={() => handleDelete(selected.filename)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
