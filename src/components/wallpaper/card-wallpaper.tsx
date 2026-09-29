import { useDownloadedWallpaper } from "@/hooks/wallapapers/use-downloaded-wallaper";
import { Box } from "@/components/ui/box";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "expo-image";
import { memo, useCallback, useState } from "react";
import { FeaturedDetails } from "../screens/Home/featured/featured-details";

type FeaturedCardProps = {
  onDownload: (imageUrl: string) => void | Promise<void>;
  onOpenDownloaded: (uri?: string) => void;
  variant: "home" | "explore";
  wihoutCategory?: boolean;
  imageUrl: string;
  category: string;
  thumbnailUrl: string;
};

function CardWallpaper({
  imageUrl,
  category,
  thumbnailUrl,
  onDownload,
  onOpenDownloaded,
  wihoutCategory,
}: FeaturedCardProps) {
  const { isDownloaded, downloadedUri } = useDownloadedWallpaper(imageUrl);
  const [loadedThumbnail, setLoadedThumbnail] = useState<string | null>(null);

  // The loaded state belongs to the current source. FlatList can reuse a cell
  // for another item, so a plain boolean could incorrectly stay true.
  const imageLoaded = loadedThumbnail === thumbnailUrl;

  const handleLoad = useCallback(() => {
    setLoadedThumbnail(thumbnailUrl);
  }, [thumbnailUrl]);

  const handleError = useCallback(() => {
    // Do not leave the skeleton forever when the remote image fails.
    setLoadedThumbnail(thumbnailUrl);
  }, [thumbnailUrl]);

  const handleDownload = useCallback(() => {
    void onDownload(imageUrl);
  }, [imageUrl, onDownload]);

  const handleOpenDownloaded = useCallback(() => {
    onOpenDownloaded(downloadedUri);
  }, [downloadedUri, onOpenDownloaded]);

  return (
    <Box className="relative h-full w-full overflow-hidden rounded-2xl">
      <Image
        source={thumbnailUrl}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: imageLoaded ? 1 : 0,
        }}
        contentFit="cover"
        allowDownscaling
        cachePolicy="memory-disk"
        onLoad={handleLoad}
        onError={handleError}
      />

      {!imageLoaded && (
        <Skeleton className="absolute inset-0 h-full w-full rounded-2xl" />
      )}

      <Box className="absolute inset-0">
        <FeaturedDetails
          category={category}
          isDowloaded={isDownloaded}
          onHandlePressDowload={handleDownload}
          onHandlePressOpenEditor={handleOpenDownloaded}
          wihoutCategory={wihoutCategory}
        />
      </Box>
    </Box>
  );
}

export default memo(CardWallpaper);
