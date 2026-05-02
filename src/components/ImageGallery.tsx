"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ZoomIn } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  captions?: string[];
}

export default function ImageGallery({ images, captions }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((src, i) => ({
    src,
    alt: captions?.[i] ?? `Image ${i + 1}`,
  }));

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => { setIndex(i); setOpen(true); }}
            className="group relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:border-blue-300 transition-all"
          >
            <Image
              src={src}
              alt={captions?.[i] ?? `Image ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
              <ZoomIn className="text-white" size={24} />
            </div>
            {captions?.[i] && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {captions[i]}
              </div>
            )}
          </button>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        styles={{ container: { backgroundColor: "rgba(0,0,0,0.95)" } }}
      />
    </>
  );
}
