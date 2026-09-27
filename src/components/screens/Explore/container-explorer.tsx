// ContainerExplorer.tsx

import { SkeletonExplorer } from "@/components/wallpaper/skeleton-explorer";
import { useWallpaperActions } from "@/hooks/wallapapers/use-wallpaper-actions";
import { useWallpaperStore } from "@/store/wallpapers/use-wallpapers-store";
import { useEffect, useMemo, useState } from "react";
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

  const { filterInput } = useWallpaperStore();

  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const normalizedFilter = filterInput.trim();

    if (!normalizedFilter) {
      setIsFiltering(false);
      return;
    }

    setIsFiltering(true);

    const timeout = setTimeout(() => {
      setIsFiltering(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [filterInput]);

  const normalizedFilter = filterInput.trim().toLocaleLowerCase();

  const categories = data?.categories ?? [];

  const displayedCategories = useMemo(() => {
    if (!normalizedFilter) {
      return categories;
    }

    return categories.filter((category) =>
      category.category.toLocaleLowerCase().includes(normalizedFilter),
    );
  }, [categories, normalizedFilter]);

  if (isFiltering) {
    return <SkeletonExplorer />;
  }

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
      windowSize={3}
      updateCellsBatchingPeriod={32}
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
