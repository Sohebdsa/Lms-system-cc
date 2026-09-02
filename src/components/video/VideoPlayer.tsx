"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, SpeakerHigh, SpeakerX, ArrowsOut } from "@phosphor-icons/react";
import type { Video } from "@/types";
import { getVideoTitle } from "@/lib/data";
import { useLanguage } from "@/lib/language-context";

interface VideoPlayerProps {
  video: Video;
  onViewTracked?: () => void;
}

export default function VideoPlayer({ video, onViewTracked }: VideoPlayerProps) {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [viewTracked, setViewTracked] = useState(false);
  const title = getVideoTitle(video, language);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const handleFullscreen = () => {
    videoRef.current?.requestFullscreen();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(pct);

    // Track view at 10% watch
    if (pct > 10 && !viewTracked) {
      setViewTracked(true);
      onViewTracked?.();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    videoRef.current.currentTime = pct * videoRef.current.duration;
  };

  return (
    <div className="rounded-3xl overflow-hidden bg-black border-2 border-neutral-200/90 shadow-xl">
      {/* Video */}
      <div className="relative aspect-video bg-black group">
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          aria-label={title}
        />

        {/* Center play button overlay */}
        {!playing && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center group-hover:bg-black/30 transition-colors"
            aria-label="Play video"
          >
            <div className="w-20 h-20 rounded-full btn-coral flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform text-white">
              <Play size={36} weight="fill" className="ml-1" />
            </div>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="bg-neutral-900 px-5 pt-3 pb-4">
        {/* Progress bar */}
        <div
          className="h-1.5 bg-neutral-800 rounded-full cursor-pointer mb-3.5 hover:h-2 transition-all duration-150"
          onClick={handleSeek}
          role="slider"
          aria-label="Video progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-[rgb(255_78_41)] transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Control buttons */}
        <div className="flex items-center gap-3 text-white">
          <button
            onClick={togglePlay}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause size={17} weight="fill" /> : <Play size={17} weight="fill" />}
          </button>
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition-colors active:scale-95"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <SpeakerX size={17} /> : <SpeakerHigh size={17} />}
          </button>
          <div className="flex-1" />
          <button
            onClick={handleFullscreen}
            className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
            aria-label="Fullscreen"
          >
            <ArrowsOut size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
