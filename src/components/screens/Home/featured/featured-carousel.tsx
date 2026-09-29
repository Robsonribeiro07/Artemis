import { useGetAllWallpapers } from "@/api/wallpapers/hooks/use-get-wallpaper";
import { Carousel } from "@/components/Carousel";
import CardWallpaper from "@/components/wallpaper/card-wallpaper";
import { SkeletonWallpaper } from "@/components/wallpaper/skeleton-wallpaper";
import { useWallpaperActions } from "@/hooks/wallapapers/use-wallpaper-actions";
import { useCallback, useState } from "react";

import { useWindowDimensions } from "react-native";

export function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data, isFetched, isLoading } = useGetAllWallpapers();

  const { height } = useWindowDimensions();

  const {
    handleDownloadWallpaper,
    handleOpenDownloadedWallpaper,
  } = useWallpaperActions();

  const renderWallpaper = useCallback(
    (item: NonNullable<typeof data>["wallpapers"][number]) => (
      <CardWallpaper
        variant="home"
        category={item.category}
        imageUrl={item.imageUrl}
        thumbnailUrl={item.portraitUrl}
        onDownload={handleDownloadWallpaper}
        onOpenDownloaded={handleOpenDownloadedWallpaper}
      />
    ),
    [handleDownloadWallpaper, handleOpenDownloadedWallpaper],
  );

  return isLoading && !isFetched ? (
    <SkeletonWallpaper />
  ) : (
    <Carousel
      data={data?.wallpapers ?? []}
      currentIndex={currentIndex}
      onIndexChange={setCurrentIndex}
      itemWidth={300}
      itemHeight={height / 1.6}
      windowSize={10}
      initialNumberToRender={1}
      removeClippedSubviews={false}
      gap={30}
      renderItem={renderWallpaper}
    />
  );
}
