// separator-categories.tsx

import { IWallpaperResponse } from "@/api/wallpapers/helpers/type";
import { Carousel } from "@/components/Carousel";
import { ThemedText } from "@/components/themedText";
import { Box } from "@/components/ui/box";
import CardWallpaper from "@/components/wallpaper/card-wallpaper";
import { useAllWallpaperForCategoryStore } from "@/store/wallpapers/use-state-all-walpaper-explorer";
import { ChevronRight } from "lucide-react-native";
import { useEffect, useState } from "react";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";

type SeparatorCategoriesProps = {
  category: string;
  wallpapers: IWallpaperResponse[];
  isDownloaded: (imageUrl: string) => boolean;
  getDownloadedUri: (imageUrl: string) => string | undefined;
  onDownload: (imageUrl: string) => Promise<void>;
  onOpenDownloaded: (uri?: string) => void;
};

export function SeparatorCategories({
  category,
  wallpapers,
  isDownloaded,
  getDownloadedUri,
  onDownload,
  onOpenDownloaded,
}: SeparatorCategoriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { height } = useWindowDimensions();
  const { openCategory, isOpen } = useAllWallpaperForCategoryStore();
  const carouselHeight = height / 3;
  useEffect(() => {
    setCurrentIndex(0);
  }, [wallpapers]);

  return (
    <Box
      style={{
        width: "100%",
      }}
    >
      <TouchableOpacity
        className="justify-between flex-row items-center "
        onPress={() => openCategory(category)}
      >
        <ThemedText size="lg" weight="bold" className="mt-3">
          {category.toLocaleUpperCase()}
        </ThemedText>

        <ChevronRight color="white" />
      </TouchableOpacity>
      <View
        style={{
          width: "100%",
          height: carouselHeight,
          marginTop: 12,
        }}
      >
        <Carousel
          data={wallpapers}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
          itemWidth={150}
          itemHeight={carouselHeight}
          gap={30}
          withoutIndicator
          renderItem={(item) => (
            <CardWallpaper
              variant="explore"
              category={item.category}
              key={item._id}
              imageUrl={item.thumbnailUrl}
              thumbnailUrl={item.thumbnailUrl}
              isDownloaded={isDownloaded(item.imageUrl)}
              downloadedUri={getDownloadedUri(item.imageUrl)}
              onDownload={onDownload}
              onOpenDownloaded={onOpenDownloaded}
              wihoutCategory
            />
          )}
        />
      </View>
    </Box>
  );
}
