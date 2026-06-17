"use client";

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { useAuth } from "@/contexts/AuthContext";

interface MuxVideoPlayerProps {
  playbackId: string;
  metadata?: {
    video_id: string;
    video_title: string;
    viewer_user_id: string;
  };
  startTime?: number;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

const MuxVideoPlayer = forwardRef<any, MuxVideoPlayerProps>(({
  playbackId,
  metadata,
  startTime = 0,
  onTimeUpdate,
  onEnded,
}, ref) => {
  const playerRef = useRef<any>(null);
  const { user } = useAuth();

  useImperativeHandle(ref, () => playerRef.current);

  // Sauvegarder la position de lecture toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && !playerRef.current.paused) {
        const currentTime = playerRef.current.currentTime;
        if (metadata?.video_id) {
          localStorage.setItem(`video_pos_${metadata.video_id}`, currentTime.toString());
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [metadata?.video_id]);

  const handleTimeUpdate = (e: Event) => {
    const currentTime = (e.target as any).currentTime;
    if (onTimeUpdate) {
      onTimeUpdate(currentTime);
    }
  };

  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/5">
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        metadata={{
          video_id: metadata?.video_id || "unknown",
          video_title: metadata?.video_title || "Lesson Video",
          viewer_user_id: user?.id?.toString() || "guest",
        }}
        startTime={startTime}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
        className="w-full h-full"
        accentColor="#6366f1"
        primaryColor="#ffffff"
        secondaryColor="#0f172a"
        placeholder="/mlacademy_logo.png"
      />
      
      <style jsx global>{`
        mux-player {
          --media-button-icon-filter: drop-shadow(0 0 4px rgba(0,0,0,0.5));
          --media-range-thumb-background: #6366f1;
          --media-range-bar-color: rgba(99, 102, 241, 0.3);
        }
      `}</style>
    </div>
  );
});

export default MuxVideoPlayer;
