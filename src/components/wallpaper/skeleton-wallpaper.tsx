import { Carousel } from "@/components/Carousel";
import { useWindowDimensions } from "react-native";
import { Skeleton } from "../ui/skeleton";

export function SkeletonWallpaper() {
  const { height } = useWindowDimensions();

  const skeletonData = Array.from({ length: 5 }, (_, index) => ({
    id: `skeleton-${index}`,
  }));

  return (
    <Carousel
      data={skeletonData}
      currentIndex={0}
      onIndexChange={() => {}}
      itemWidth={300}
      itemHeight={height / 1.6}
      gap={30}
      renderItem={() => (
        <Skeleton
          className="w-full rounded-2xl"
          style={{
            height: height / 1.6,
          }}
        />
      )}
    />
  );
}
