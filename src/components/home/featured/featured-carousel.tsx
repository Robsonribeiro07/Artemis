import { useGetAllWallpapers } from "@/api/wallpapers/hooks/use-get-wallpaper";
import { Carousel } from "@/components/Carousel";
import CardWallpaper from "@/components/wallpaper/card-wallpaper";
import ExpoWallpaperModule from "@/modules/expo-wallpaper/src/ExpoWallpaperModule";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

export function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [downloadedWallpapers, setDownloadedWallpapers] = useState<
    Map<string, string>
  >(new Map());

  const { height } = useWindowDimensions();
  const { data, isError, error } = useGetAllWallpapers();

  useEffect(() => {
    async function loadDownloadedWallpapers() {
      const wallpapers = await ExpoWallpaperModule.getDownloadedWallpapers();
      if (!wallpapers) return;

      const map = new Map(
        wallpapers.map((wallpaper) => [wallpaper.sourceUrl, wallpaper.uri]),
      );
      setDownloadedWallpapers(map);
    }
    loadDownloadedWallpapers();
  }, []);

  const handleDownloaded = (imageUrl: string, uri: string) => {
    setDownloadedWallpapers((prev) => {
      const next = new Map(prev);

      next.set(imageUrl, uri);

      return next;
    });
  };
  console.log(data, isError, error);

  if (!data) return null;

  return (
    <Carousel
      data={data.wallpapers}
      currentIndex={currentIndex}
      onIndexChange={setCurrentIndex}
      itemWidth={300}
      itemHeight={height / 1.6}
      gap={30}
      renderItem={(item) => (
        <CardWallpaper
          wallpaper={item}
          isDowloaded={downloadedWallpapers.has(item.imageUrl)}
          dowloadedUri={downloadedWallpapers.get(item.imageUrl)}
          onDownloaded={handleDownloaded}
        />
      )}
    />
  );
}
