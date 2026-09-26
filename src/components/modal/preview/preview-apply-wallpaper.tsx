import ExpoWallpaperModule from "@/modules/expo-wallpaper/src/ExpoWallpaperModule";
import { useFavoritesStore } from "@/store/wallpapers/use-favorites-store";
import { useWallpaperStore } from "@/store/wallpapers/use-wallpapers-store";
import { Image } from "react-native";
import { Box } from "../../ui/box";
import { AddFavoritePreview } from "./add-favorite";
import { ApplyPreviewWallpaper } from "./apply-wallpaper";

export function PreviewApplyBackground() {
  const { selectedWallpaperUri } = useWallpaperStore();

  const { toggleFavorite, favorites } = useFavoritesStore();

  const handleOnPressApplyPreview = async () => {
    if (!selectedWallpaperUri) return;

    await ExpoWallpaperModule.openWallpaperEditor(selectedWallpaperUri);
  };

  const handleOnPressAddFavorite = () => {
    if (!selectedWallpaperUri) return;

    toggleFavorite(selectedWallpaperUri);
  };

  const isFavorite = favorites.includes(selectedWallpaperUri ?? "");

  return (
    <Box className="items-center justify-between py-10 flex-1 gap-5">
      <Image
        source={{ uri: selectedWallpaperUri }}
        width={200}
        height={300}
        className="rounded-2xl border border-primary"
      />

      <Box className="flex-row gap-3 mx-2 items-center">
        <AddFavoritePreview
          onPress={handleOnPressAddFavorite}
          isFavorite={isFavorite}
        />

        <ApplyPreviewWallpaper onPress={handleOnPressApplyPreview} />
      </Box>
    </Box>
  );
}
