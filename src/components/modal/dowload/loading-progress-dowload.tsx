import ExpoWallpaperModule from "@/modules/expo-wallpaper/src/ExpoWallpaperModule";
import { useWallpaperStore } from "@/store/wallpapers/use-wallpapers-store";
import { DotLottie } from "@lottiefiles/dotlottie-react-native";
import { useEffect, useState } from "react";
import { ThemedText } from "../../themedText";
import { Box } from "../../ui/box";

export function LoadingProgressDowload() {
  const [progress, setProgress] = useState(0);
  const { stateModalWallpaper, setStateModal } = useWallpaperStore();

  useEffect(() => {
    const progressSubscription = ExpoWallpaperModule.addListener(
      "onDownloadProgress",
      (event) => {
        setProgress(event.progress);
      },
    );

    const completeSubscription = ExpoWallpaperModule.addListener(
      "onDownloadComplete",
      async (event) => {
        if (!event.uri) return;

        setStateModal(false);

        await ExpoWallpaperModule.openWallpaperEditor(event.uri);
      },
    );

    return () => {
      progressSubscription.remove();
      completeSubscription.remove();
    };
  }, [setStateModal]);

  useEffect(() => {
    if (!stateModalWallpaper) {
      setProgress(0);
    }
  }, [stateModalWallpaper]);

  return (
    <Box className="items-center">
      <DotLottie
        source={{
          uri: "https://lottie.host/048303a6-32ec-4f4b-ac4d-21dd4a2d1593/0DOJqt2MbY.lottie",
        }}
        loop
        style={{
          width: 300,
          height: 300,
        }}
      />

      <ThemedText weight="bold" size="2xl">
        {Math.round(progress)}%
      </ThemedText>
    </Box>
  );
}
