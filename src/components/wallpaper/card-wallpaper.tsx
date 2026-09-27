import { Box } from "@/components/ui/box";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "expo-image";
import { memo, useState } from "react";
import { FeaturedDetails } from "../screens/Home/featured/featured-details";
type FeaturedCardProps = {
  isDownloaded: boolean;
  downloadedUri?: string;
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
  isDownloaded,
  downloadedUri,
  onDownload,
  onOpenDownloaded,
  wihoutCategory,
}: FeaturedCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

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
        onLoad={() => {
          setTimeout(() => {
            setImageLoaded(true);
          }, 100);
        }}
        onError={() => {
          setImageLoaded(true);
        }}
      />

      {!imageLoaded && (
        <Skeleton className="absolute inset-0 h-full w-full rounded-2xl" />
      )}

      <Box className="absolute inset-0">
        <FeaturedDetails
          category={category}
          isDowloaded={isDownloaded}
          onHandlePressDowload={() => onDownload(imageUrl)}
          onHandlePressOpenEditor={() => onOpenDownloaded(downloadedUri)}
          wihoutCategory={wihoutCategory}
        />
      </Box>
    </Box>
  );
}

export default memo(CardWallpaper);
