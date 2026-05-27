"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Player from "@vimeo/player";

type StickyVideoBannerProps = {
  id: string; // Vimeo video id
  className?: string;
};

export const StickyVideoBanner: React.FC<StickyVideoBannerProps> = ({ id, className = "" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  const options = useMemo(
    () => ({
      id: Number(id),
      responsive: true,
      autoplay: false,
      muted: false,
      controls: true,
      byline: false,
      portrait: false,
      title: false,
      dnt: true,
    }),
    [id]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    // cleanup previous player (id change / remount)
    if (playerRef.current) {
      playerRef.current.unload().catch(() => {});
      playerRef.current = null;
    }

    const player = new Player(containerRef.current, options);
    playerRef.current = player;

    return () => {
      player.off("play");
      player.off("pause");
      player.off("ended");
      player.off("volumechange");
      player.destroy().catch(() => {});
      playerRef.current = null;
    };
  }, [options]);

  return (
    <div
      className={[
        // Full modal content area – centers the card
        "w-full h-full flex items-center justify-center bg-ChartwellGrey/70",
        // Safer mobile height (dvh)
        "p-4 sm:p-6",
        className,
      ].join(" ")}
      tabIndex={-1}
    >
      {/* Card */}
      <div
        className={[
          "w-full",
          // max width on desktop, but fluid on mobile
          "max-w-[min(1100px,100vw-2rem)]",
          // keep controls visible on shorter screens
          "max-h-[92dvh]",
          " bg-white  overflow-hidden",
          "flex flex-col",
          "bg-white p-6",
        ].join(" ")}
        role="group"
        aria-label="Vimeo video player"
      >
        {/* Header */}

        {/* Video */}
        <div className="relative bg-black">
          <div className="mx-auto w-full">
            <div className="relative aspect-video">
              <div ref={containerRef} className="absolute inset-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
