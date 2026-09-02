"use client";

import { useState, useEffect } from "react";
import { VIDEOS as DEFAULT_VIDEOS } from "@/lib/data";
import type { Video } from "@/types";

const STORAGE_KEY = "bridged_videos_v1";

export function getStoredVideos(): Video[] {
  if (typeof window === "undefined") return DEFAULT_VIDEOS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_VIDEOS));
      return DEFAULT_VIDEOS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_VIDEOS;
  }
}

export function saveStoredVideos(videos: Video[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    window.dispatchEvent(new Event("bridged_videos_updated"));
  } catch (err) {
    console.error("Failed to save videos to localStorage", err);
  }
}

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setVideos(getStoredVideos());
    setLoaded(true);

    const onUpdate = () => {
      setVideos(getStoredVideos());
    };
    window.addEventListener("bridged_videos_updated", onUpdate);
    return () => window.removeEventListener("bridged_videos_updated", onUpdate);
  }, []);

  const addVideo = (newVideo: Omit<Video, "id" | "views" | "createdAt" | "avgWatchDuration">) => {
    const video: Video = {
      ...newVideo,
      id: `v_${Date.now()}`,
      views: 0,
      avgWatchDuration: Math.round(newVideo.duration * 0.7),
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated = [video, ...videos];
    saveStoredVideos(updated);
    setVideos(updated);
    return video;
  };

  const updateVideo = (id: string, updates: Partial<Video>) => {
    const updated = videos.map((v) => (v.id === id ? { ...v, ...updates } : v));
    saveStoredVideos(updated);
    setVideos(updated);
  };

  const deleteVideo = (id: string) => {
    const updated = videos.filter((v) => v.id !== id);
    saveStoredVideos(updated);
    setVideos(updated);
  };

  return { videos, loaded, addVideo, updateVideo, deleteVideo };
}
