import { IWallpaperResponse } from "@/api/wallpapers/helpers/type";
import { Carousel } from "@/components/Carousel";
import { ThemedText } from "@/components/themedText";
import { Box } from "@/components/ui/box";
import CardWallpaper from "@/components/wallpaper/card-wallpaper";
import { useAllWallpaperForCategoryStore } from "@/store/wallpapers/use-state-all-walpaper-explorer";
import { router } from "expo-router/build/global-state/router";
import { ChevronRight } from "lucide-react-native";
import { memo, useCallback, useEffect, useState } from "react";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";

type SeparatorCategoriesProps = {
  category: string;
  wallpapers: IWallpaperResponse[];
  onDownload: (imageUrl: string) => Promise<void>;
  onOpenDownloaded: (uri?: string) => void;
};

export const SeparatorCategories = memo(function SeparatorCategories({
  category,
  wallpapers,
  onDownload,
  onOpenDownloaded,
}: SeparatorCategoriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { height } = useWindowDimensions();
  const setCategory = useAllWallpaperForCategoryStore(
    (state) => state.setCategory,
  );
  const carouselHeight = height / 3;

  useEffect(() => {
    setCurrentIndex((previousIndex) =>
      Math.min(previousIndex, Math.max(0, wallpapers.length - 1)),
    );
  }, [wallpapers.length]);

  const handleOpenCategory = useCallback(() => {
    setCategory(category);
    router.navigate("/(tabs)/explorer/subcategory");
  }, [category, setCategory]);

  const renderWallpaper = useCallback(
    (item: IWallpaperResponse) => (
      <CardWallpaper
        variant="explore"
        category={item.category}
        key={item._id}
        imageUrl={item.imageUrl}
        thumbnailUrl={item.thumbnailUrl}
        onDownload={onDownload}
        onOpenDownloaded={onOpenDownloaded}
        wihoutCategory
      />
    ),
    [onDownload, onOpenDownloaded],
  );

  return (
    <Box style={{ minWidth: "100%" }}>
      <TouchableOpacity
        className="flex-row items-center relative"
        onPress={handleOpenCategory}
      >
        <ThemedText size="lg" weight="bold" className="mt-3">
          {category.toLocaleUpperCase()}
        </ThemedText>

        <ChevronRight
          color="white"
          style={{
            position: "absolute",
            right: 0,
          }}
        />
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
          initialNumberToRender={3}
          windowSize={3}
          renderItem={renderWallpaper}
        />
      </View>
    </Box>
  );
});
