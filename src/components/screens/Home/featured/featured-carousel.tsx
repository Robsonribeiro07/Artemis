import { Carousel } from "@/components/Carousel";
import CardWallpaper from "@/components/wallpaper/card-wallpaper";
import { SkeletonWallpaper } from "@/components/wallpaper/skeleton-wallpaper";
import { useWallpaperActions } from "@/hooks/wallapapers/use-wallpaper-actions";
import { useState } from "react";

import { useWindowDimensions } from "react-native";

export function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { height } = useWindowDimensions();

  const {
    handleDownloadWallpaper,
    handleOpenDownloadedWallpaper,
    isDownloaded,
    getDownloadedUri,
    data,
    isFetched,
    isLoading,
  } = useWallpaperActions();

  return isLoading && !isFetched ? (
    <SkeletonWallpaper />
  ) : (
    <Carousel
      data={data?.wallpapers ?? []}
      currentIndex={currentIndex}
      onIndexChange={setCurrentIndex}
      itemWidth={300}
      itemHeight={height / 1.6}
      gap={30}
      renderItem={(item) => (
        <CardWallpaper
          variant="home"
          category={item.category}
          imageUrl={item.imageUrl}
          thumbnailUrl={item.imageUrl}
          isDownloaded={isDownloaded(item.imageUrl)}
          downloadedUri={getDownloadedUri(item.imageUrl)}
          onDownload={handleDownloadWallpaper}
          onOpenDownloaded={handleOpenDownloadedWallpaper}
        />
      )}
    />
  );
}
