import { useDownloadedWallpaperStore } from "@/store/wallpapers/use-downloaded-wallpaper";
import { useCallback, useEffect } from "react";

/**
 * Loads the downloaded-wallpaper index once per mounted application tree.
 * This hook intentionally does not subscribe to the Map itself.
 */
export function useLoadDownloadedWallpapers() {
  const loadDownloadedWallpapers = useDownloadedWallpaperStore(
    (state) => state.loadDownloadedWallpapers,
  );

  useEffect(() => {
    void loadDownloadedWallpapers();
  }, [loadDownloadedWallpapers]);
}

/**
 * Subscribes only to the entry represented by imageUrl.
 * A change to another downloaded wallpaper therefore does not rerender this card.
 */
export function useDownloadedWallpaper(imageUrl: string) {
  const downloadedUri = useDownloadedWallpaperStore((state) =>
    state.downloadedWallpapers.get(imageUrl),
  );

  return {
    downloadedUri,
    isDownloaded: downloadedUri !== undefined,
  };
}

/**
 * Backward-compatible hook for places that need access to the full index.
 * Prefer useDownloadedWallpaper() for individual cards.
 */
export function useDownloadedWallpapers() {
  useLoadDownloadedWallpapers();

  const downloadedWallpapers = useDownloadedWallpaperStore(
    (state) => state.downloadedWallpapers,
  );

  const addDownloadedWallpaper = useDownloadedWallpaperStore(
    (state) => state.addDownloadedWallpaper,
  );

  const isDownloaded = useCallback(
    (imageUrl: string) => downloadedWallpapers.has(imageUrl),
    [downloadedWallpapers],
  );

  const getDownloadedUri = useCallback(
    (imageUrl: string) => downloadedWallpapers.get(imageUrl),
    [downloadedWallpapers],
  );

  return {
    downloadedWallpapers,
    addDownloadedWallpaper,
    isDownloaded,
    getDownloadedUri,
  };
}
