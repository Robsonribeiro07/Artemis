import { useGetAllWallpapers } from "@/api/wallpapers/hooks/use-get-wallpaper";
import { useWallpaperActions } from "@/hooks/wallapapers/use-wallpaper-actions";
import { useAllWallpaperForCategoryStore } from "@/store/wallpapers/use-state-all-walpaper-explorer";
import { useCallback, useMemo } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import { SeparatorCategories } from "./separator-categories";

const keyExtractor = (item: { category: string }, index: number) =>
  `${item.category}-${index}`;

const ItemSeparator = () => <View style={{ height: 16 }} />;

const EmptyExplorer = () => <View style={{ minHeight: 200 }} />;

export function ContainerExplorerCategory() {
  const { handleDownloadWallpaper, handleOpenDownloadedWallpaper } =
    useWallpaperActions();

  const { isError, data, isLoading } = useGetAllWallpapers();

  const filterInput = useAllWallpaperForCategoryStore(
    (state) => state.filterInput,
  );

  const normalizedFilter = filterInput.trim().toLocaleLowerCase();
  const categories = data?.categories ?? [];

  const displayedCategories = useMemo(() => {
    const filteredCategories = normalizedFilter
      ? categories.filter((category) =>
          category.category.toLocaleLowerCase().includes(normalizedFilter),
        )
      : categories;

    return filteredCategories.map((category) => ({
      ...category,
      wallpapers: category.subcategories.map(
        (subcategory) => subcategory.wallpaper,
      ),
    }));
  }, [categories, normalizedFilter]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<(typeof displayedCategories)[number]>) => (
      <SeparatorCategories
        key={item.category}
        category={item.category}
        wallpapers={item.wallpapers}
        onDownload={handleDownloadWallpaper}
        onOpenDownloaded={handleOpenDownloadedWallpaper}
      />
    ),
    [handleDownloadWallpaper, handleOpenDownloadedWallpaper],
  );

  if (isLoading || isError || !data) {
    return null;
  }

  return (
    <FlatList
      data={displayedCategories}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      initialNumToRender={1}
      maxToRenderPerBatch={4}
      windowSize={5}
      updateCellsBatchingPeriod={12}
      contentContainerStyle={{
        paddingBottom: 24,
      }}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={EmptyExplorer}
    />
  );
}
