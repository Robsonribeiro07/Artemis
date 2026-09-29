import ExpoWallpaperModule from "@/modules/expo-wallpaper/src/ExpoWallpaperModule";
import { useDownloadedWallpaperStore } from "@/store/wallpapers/use-downloaded-wallpaper";
import { useWallpaperStore } from "@/store/wallpapers/use-wallpapers-store";
import { useCallback } from "react";

export function useWallpaperActions() {
  const setStateModal = useWallpaperStore((state) => state.setStateModal);
  const setSelectedWallpaperUri = useWallpaperStore(
    (state) => state.setSelectedWallpaperUri,
  );
  const setBehavior = useWallpaperStore((state) => state.setBehavior);

  const addDownloadedWallpaper = useDownloadedWallpaperStore(
    (state) => state.addDownloadedWallpaper,
  );

  const handleDownloadWallpaper = useCallback(
    async (imageUrl: string): Promise<void> => {
      if (!imageUrl) return;

      setBehavior("download");
      setStateModal(true);

      try {
        const result = await ExpoWallpaperModule.downloadWallpaper(imageUrl);

        addDownloadedWallpaper(imageUrl, result.uri);
      } catch {
        setStateModal(false);
      }
    },
    [addDownloadedWallpaper, setBehavior, setStateModal],
  );

  const handleOpenDownloadedWallpaper = useCallback(
    (uri?: string) => {
      if (!uri) return;

      setBehavior("apply");
      setStateModal(true);
      setSelectedWallpaperUri(uri);
    },
    [setBehavior, setSelectedWallpaperUri, setStateModal],
  );

  return {
    handleDownloadWallpaper,
    handleOpenDownloadedWallpaper,
  };
}
