import { useGetAllWallpapersForSubCategory } from "@/api/wallpapers/hooks/use-get-all-wallpaper-for-subcategory";
import { useWallpaperActions } from "@/hooks/wallapapers/use-wallpaper-actions";
import { useAllWallpaperForCategoryStore } from "@/store/wallpapers/use-state-all-walpaper-explorer";
import { useCallback, useMemo } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import { SeparatorCategories } from "./separator-categories";

const keyExtractor = (item: { subcategory: string }, index: number) =>
  `${item.subcategory}-${index}`;

const ItemSeparator = () => <View style={{ height: 16 }} />;

const EmptyExplorer = () => <View style={{ minHeight: 200 }} />;

export function ContainerExplorerSubCategory() {
  const { handleDownloadWallpaper, handleOpenDownloadedWallpaper } =
    useWallpaperActions();

  const { isError, data, isLoading } = useGetAllWallpapersForSubCategory();

  const filterInput = useAllWallpaperForCategoryStore(
    (state) => state.filterInput,
  );

  const normalizedFilter = filterInput.trim().toLocaleLowerCase();
  const categories = data?.subcategories ?? [];

  const displayedCategories = useMemo(() => {
    if (!normalizedFilter) {
      return categories;
    }

    return categories.filter((category) =>
      category.subcategory.toLocaleLowerCase().includes(normalizedFilter),
    );
  }, [categories, normalizedFilter]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<(typeof displayedCategories)[number]>) => (
      <SeparatorCategories
        category={item.subcategory}
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
      removeClippedSubviews
      contentContainerStyle={{
        paddingBottom: 24,
      }}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={EmptyExplorer}
    />
  );
}
