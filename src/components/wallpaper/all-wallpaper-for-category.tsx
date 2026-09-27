import { useWallpaperActions } from "@/hooks/wallapapers/use-wallpaper-actions";
import { FlatList } from "react-native-gesture-handler";

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "../ui/actionsheet";

import { useGetAllWallpaperForCategory } from "@/api/wallpapers/hooks/use-get-all-wallpaper-for-category";

import { useAllWallpaperForCategoryStore } from "@/store/wallpapers/use-state-all-walpaper-explorer";
import { Box } from "../ui/box";
import CardWallpaper from "./card-wallpaper";

export function AllWallpaperForCategory() {
  const {
    handleDownloadWallpaper,
    handleOpenDownloadedWallpaper,
    isDownloaded,
    getDownloadedUri,
  } = useWallpaperActions();
  const { isOpen, onClose } = useAllWallpaperForCategoryStore();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllWallpaperForCategory();

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
              fetchNextPage();
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
          renderItem={({ item: wallpaper }) => (
            <Box className="flex-1 h-72">
              <CardWallpaper
                category={wallpaper.category}
                imageUrl={wallpaper.imageUrl}
                thumbnailUrl={wallpaper.thumbnailUrl}
                onDownload={handleDownloadWallpaper}
                onOpenDownloaded={handleOpenDownloadedWallpaper}
                isDownloaded={isDownloaded(wallpaper.imageUrl)}
                variant="explore"
                downloadedUri={getDownloadedUri(wallpaper.imageUrl)}
              />
            </Box>
          )}
        />
      </ActionsheetContent>
    </Actionsheet>
  );
}
