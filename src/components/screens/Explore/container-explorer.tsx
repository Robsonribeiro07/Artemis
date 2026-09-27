// ContainerExplorer.tsx

import { useWallpaperActions } from "@/hooks/wallapapers/use-wallpaper-actions";
import { useAllWallpaperForCategoryStore } from "@/store/wallpapers/use-state-all-walpaper-explorer";
import { useMemo } from "react";
import { FlatList, View } from "react-native";
import { SeparatorCategories } from "./separator-categories";

export function ContainerExplorer() {
  const {
    data,
    handleDownloadWallpaper,
    handleOpenDownloadedWallpaper,
    isDownloaded,
    getDownloadedUri,
  } = useWallpaperActions();

  const { category } = useAllWallpaperForCategoryStore();

  const normalizedFilter = category.trim().toLocaleLowerCase();

  const categories = data?.categories ?? [];

  const displayedCategories = useMemo(() => {
    if (!normalizedFilter) {
      return categories;
    }

    return categories.filter((category) =>
      category.category.toLocaleLowerCase().includes(normalizedFilter),
    );
  }, [categories, normalizedFilter]);

  if (!data) {
    return null;
  }

  return (
    <FlatList
      data={displayedCategories}
      keyExtractor={(item, index) => `${item.category}-${index}`}
      showsVerticalScrollIndicator={false}
      initialNumToRender={1}
      maxToRenderPerBatch={4}
      windowSize={5}
      updateCellsBatchingPeriod={12}
      removeClippedSubviews={true}
      contentContainerStyle={{
        paddingBottom: 24,
      }}
      renderItem={({ item }) => (
        <SeparatorCategories
          isDownloaded={isDownloaded}
          category={item.category}
          wallpapers={item.wallpapers}
          getDownloadedUri={getDownloadedUri}
          onDownload={handleDownloadWallpaper}
          onOpenDownloaded={handleOpenDownloadedWallpaper}
        />
      )}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: 16,
          }}
        />
      )}
      ListEmptyComponent={() => (
        <View
          style={{
            minHeight: 200,
          }}
        />
      )}
    />
  );
}
