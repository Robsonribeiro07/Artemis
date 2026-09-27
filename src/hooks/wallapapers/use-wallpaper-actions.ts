import { useGetAllWallpapers } from "@/api/wallpapers/hooks/use-get-wallpaper";
import ExpoWallpaperModule from "@/modules/expo-wallpaper/src/ExpoWallpaperModule";
import { useWallpaperStore } from "@/store/wallpapers/use-wallpapers-store";
import { useCallback } from "react";
import { useDownloadedWallpapers } from "./use-downloaded-wallaper";

export function useWallpaperActions() {
  const { setStateModal, setSelectedWallpaperUri, setBehavior } =
    useWallpaperStore();

  const { isDownloaded, getDownloadedUri, addDownloadedWallpaper } =
    useDownloadedWallpapers();

  const { data, isFetched, isLoading } = useGetAllWallpapers();

  const handleDownloadWallpaper = useCallback(
    async (imageUrl: string): Promise<void> => {
      if (!imageUrl) return;

      setBehavior("download");
      setStateModal(true);

      try {
        const result = await ExpoWallpaperModule.downloadWallpaper(imageUrl);

        addDownloadedWallpaper(imageUrl, result.uri);
      } catch (error) {
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
    [setBehavior, setStateModal, setSelectedWallpaperUri],
  );

  return {
    handleDownloadWallpaper,
    handleOpenDownloadedWallpaper,
    isDownloaded,
    getDownloadedUri,
    data,
    isFetched,
    isLoading,
  };
}
