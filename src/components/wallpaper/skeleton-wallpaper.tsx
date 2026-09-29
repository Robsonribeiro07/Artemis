import { Carousel } from "@/components/Carousel";
import { useWindowDimensions } from "react-native";
import { Skeleton } from "../ui/skeleton";

const SKELETON_DATA = Array.from({ length: 5 }, (_, index) => ({
  id: `skeleton-${index}`,
}));

export function SkeletonWallpaper() {
  const { height } = useWindowDimensions();

  return (
    <Carousel
      data={SKELETON_DATA}
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
