import { useDownloadedWallpaperStore } from "@/store/wallpapers/use-downloaded-wallpaper";
import { useCallback, useEffect } from "react";

export function useDownloadedWallpapers() {
  const downloadedWallpapers = useDownloadedWallpaperStore(
    (state) => state.downloadedWallpapers,
  );

  const loadDownloadedWallpapers = useDownloadedWallpaperStore(
    (state) => state.loadDownloadedWallpapers,
  );

  const addDownloadedWallpaper = useDownloadedWallpaperStore(
    (state) => state.addDownloadedWallpaper,
  );

  useEffect(() => {
    loadDownloadedWallpapers();
  }, [loadDownloadedWallpapers]);

  const isDownloaded = useCallback(
    (imageUrl: string) => {
      return downloadedWallpapers.has(imageUrl);
    },
    [downloadedWallpapers],
  );

  const getDownloadedUri = useCallback(
    (imageUrl: string) => {
      return downloadedWallpapers.get(imageUrl);
    },
    [downloadedWallpapers],
  );

  return {
    downloadedWallpapers,
    addDownloadedWallpaper,
    isDownloaded,
    getDownloadedUri,
  };
}
