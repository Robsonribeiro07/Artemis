import { useGetAllWallpaperForCategory } from "@/api/wallpapers/hooks/use-get-all-wallpaper-for-category copy";
import { useWallpaperActions } from "@/hooks/wallapapers/use-wallpaper-actions";
import { useAllWallpaperForCategoryStore } from "@/store/wallpapers/use-state-all-walpaper-explorer";
import { useCallback } from "react";
import { ListRenderItemInfo } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "../ui/actionsheet";
import { Box } from "../ui/box";
import CardWallpaper from "./card-wallpaper";

export function AllWallpaperForCategory() {
  const { handleDownloadWallpaper, handleOpenDownloadedWallpaper } =
    useWallpaperActions();
  const isOpen = useAllWallpaperForCategoryStore((state) => state.isOpen);
  const onClose = useAllWallpaperForCategoryStore((state) => state.onClose);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllWallpaperForCategory();

  const renderItem = useCallback(
    ({ item: wallpaper }: ListRenderItemInfo<NonNullable<typeof data>["wallpapers"][number]>) => (
      <Box className="flex-1 h-72">
        <CardWallpaper
          category={wallpaper.category}
          imageUrl={wallpaper.imageUrl}
          thumbnailUrl={wallpaper.thumbnailUrl}
          onDownload={handleDownloadWallpaper}
          onOpenDownloaded={handleOpenDownloadedWallpaper}
          variant="explore"
        />
      </Box>
    ),
    [handleDownloadWallpaper, handleOpenDownloadedWallpaper],
  );

  return (
    <Actionsheet isOpen={isOpen} snapPoints={[80]} onClose={onClose}>
      <ActionsheetBackdrop />

      <ActionsheetContent
        style={{
          flex: 1,
          paddingHorizontal: 0,
        }}
      >
        <FlatList
          data={data?.wallpapers ?? []}
          numColumns={2}
          keyExtractor={(item) => item._id}
          style={{
            flex: 1,
            width: "100%",
          }}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={3}
          updateCellsBatchingPeriod={32}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              void fetchNextPage();
            }
          }}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 24,
          }}
          columnWrapperStyle={{
            gap: 12,
            marginBottom: 12,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
      </ActionsheetContent>
    </Actionsheet>
  );
}
