import { Box } from "@/components/ui/box";
import { memo } from "react";
import { Image } from "react-native";

import ExpoWallpaperModule from "@/modules/expo-wallpaper/src/ExpoWallpaperModule";
import { useWallpaperStore } from "@/store/wallpapers/use-wallpapers-store";
import { IWallpaperResponse } from "@/utils/useErrorHandler";
import { FeaturedDetails } from "../home/featured/featured-details";

type FeaturedCardProps = {
  wallpaper: IWallpaperResponse;
  isDowloaded: boolean;
  dowloadedUri: string | undefined;
  onDownloaded: (imageUrl: string, uri: string) => void;
};

function CardWallpaper({
  wallpaper: { imageUrl, title, tags },
  isDowloaded,
  dowloadedUri,
  onDownloaded,
}: FeaturedCardProps) {
  const { setStateModal, setSelectedWallpaperUri, setBehavior } =
    useWallpaperStore();

  const handleOnPressDowloadWallpaper = async () => {
    if (!imageUrl) return;
    setBehavior("download");
    setStateModal(true);
    const result = await ExpoWallpaperModule.downloadWallpaper(imageUrl);
    onDownloaded(imageUrl, result.uri);
  };

  const handleOnPressOpenDowloadedWallpaper = () => {
    if (!dowloadedUri) return;
    setBehavior("apply");
    setStateModal(true);
    setSelectedWallpaperUri(dowloadedUri);
  };

  return (
    <Box className="relative h-full w-full overflow-hidden rounded-2xl">
      <Image
        source={{ uri: imageUrl }}
        className="absolute inset-0 h-full w-full"
        resizeMode="cover"
      />

      <Box className="absolute inset-0">
        <FeaturedDetails
          tags={tags[0]}
          title={title}
          isDowloaded={isDowloaded}
          onHandlePressDowload={handleOnPressDowloadWallpaper}
          onHandlePressOpenEditor={handleOnPressOpenDowloadedWallpaper}
        />
      </Box>
    </Box>
  );
}

export default memo(CardWallpaper);
