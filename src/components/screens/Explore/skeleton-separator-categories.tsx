import { Carousel } from "@/components/Carousel";
import { Box } from "@/components/ui/box";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useWindowDimensions } from "react-native";

export function SkeletonSeparatorCategories() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { height } = useWindowDimensions();

  const skeletonItems = Array.from({ length: 5 });

  return (
    <Box className="gap-3">
      <Skeleton className="mt-3 h-6 w-32 rounded-md" />

      <Carousel
        data={skeletonItems}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        itemWidth={150}
        itemHeight={height / 3}
        gap={30}
        withoutIndicator
        renderItem={() => <Skeleton className="h-full w-full rounded-2xl" />}
      />
    </Box>
  );
}
