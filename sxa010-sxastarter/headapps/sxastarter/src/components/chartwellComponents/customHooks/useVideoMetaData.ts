import { useEffect, useState } from "react";

type VideoMetaData = {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  embedUrl: string;
  contentUrl: string;
  type: "vimeo" | "youtube" | "matterport";
  publisher?: string;
  publisherUrl?: string;
};

const videoTypeHandlers = [
  {
    type: "vimeo",
    match: (src: string) => src.includes("vimeo.com"),
    getId: (url: string) => url.match(/vimeo\.com\/video\/(\d+)/)?.[1] || null,
    fetchMeta: async (id: string, existingIds: Set<string> = new Set()): Promise<VideoMetaData | null> => {
      if (existingIds.has(id)) {
        return null;
      }
      existingIds.add(id);
      try {
        const res = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`);
        const data = await res.json();
        return {
          name: data.title,
          description: data.description || "Video description",
          thumbnailUrl: data.thumbnail_url,
          uploadDate: new Date(data.upload_date).toISOString(),
          duration: `PT${Math.round(data.duration)}S`,
          embedUrl: `https://player.vimeo.com/video/${id}`,
          contentUrl: `https://vimeo.com/${id}`,
          type: "vimeo",
          publisher: data.author_name,
          publisherUrl: data.author_url,
        };
      } catch (error) {
        console.error(`Failed to fetch Vimeo metadata for video ${id}`, error);
        return null;
      }
    },
  },
  {
    type: "youtube",
    match: (src: string) => src.includes("youtube.com"),
    getId: (url: string) => url.match(/youtube\.com\/(?:embed\/|watch\?v=)([\w-]+)/)?.[1] || null,
    fetchMeta: async (id: string): Promise<VideoMetaData | null> => {
      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
        const data = await res.json();
        return {
          name: data.title,
          description: data.author_name || "YouTube Video",
          thumbnailUrl: data.thumbnail_url,
          uploadDate: new Date().toISOString(),
          duration: "",
          embedUrl: `https://www.youtube.com/embed/${id}`,
          contentUrl: `https://www.youtube.com/watch?v=${id}`,
          type: "youtube",
        };
      } catch (error) {
        console.error(`Failed to fetch YouTube metadata for video ${id}`, error);
        return null;
      }
    },
  },
  {
    type: "matterport",
    match: (src: string) => src.includes("matterport.com"),
    getId: (url: string) => url.match(/[?&]m=([\w-]+)/)?.[1] || null,
    fetchMeta: async (id: string): Promise<VideoMetaData | null> => {
      return {
        name: "Matterport Tour",
        description: "Matterport 3D Tour",
        thumbnailUrl: `https://static.matterport.com/api/v1/player/models/${id}/thumb`,
        uploadDate: new Date().toISOString(),
        duration: "",
        embedUrl: `https://my.matterport.com/show/?m=${id}`,
        contentUrl: `https://my.matterport.com/show/?m=${id}`,
        type: "matterport",
      };
    },
  },
];

export default function useVideoMetaData() {
  const [videos, setVideos] = useState<VideoMetaData[]>([]);
  const [loading, setLoading] = useState(true);
  const isFetchingRef = { current: false };

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const scanAndFetch = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      try {
        const iframes = Array.from(document.querySelectorAll("iframe"));
        const seenIds = new Set<string>();
        const results: VideoMetaData[] = [];
        for (const iframe of iframes) {
          for (const handler of videoTypeHandlers) {
            if (handler.match(iframe.src)) {
              const id = handler.getId(iframe.src);
              if (id && !seenIds.has(`${handler.type}:${id}`)) {
                seenIds.add(`${handler.type}:${id}`);
                const meta = await handler.fetchMeta(id);
                if (meta) results.push(meta);
              }
              break;
            }
          }
        }
        setVideos((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(results)) return prev;
          return results;
        });
        setLoading(false);
      } finally {
        isFetchingRef.current = false;
      }
    };

    scanAndFetch();

    const observer = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => { scanAndFetch(); }, 500);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, []);

  return { videos, loading };
}
