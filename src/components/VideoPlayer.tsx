"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type React from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as React.ComponentType<{
  url: string;
  width?: string;
  height?: string;
  playing?: boolean;
  controls?: boolean;
  light?: boolean | string;
  onClickPreview?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any;
}>;

interface VideoPlayerProps {
  url: string;
  poster?: string;
}

export default function VideoPlayer({ url, poster }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        controls
        light={poster || true}
        onClickPreview={() => setPlaying(true)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config={{ file: { attributes: { controlsList: "nodownload" } } } as any}
      />
    </div>
  );
}
