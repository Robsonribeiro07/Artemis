import { CardWallpaper } from "@/components/card-wallpaper";
import { Carousel } from "@/components/Carousel";
import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { CategoriesDetails } from "./categories-details";

const featured = [
  {
    id: "1",
    image: "https://images6.alphacoders.com/137/thumbbig-1372163.webp",
  },
  {
    id: "2",
    image: "https://images6.alphacoders.com/137/thumbbig-1372163.webp",
  },
  {
    id: "3",
    image: "https://images6.alphacoders.com/137/thumbbig-1372163.webp",
  },
  {
    id: "4",
    image: "https://images6.alphacoders.com/137/thumbbig-1372163.webp",
  },
  {
    id: "5",
    image: "https://images6.alphacoders.com/137/thumbbig-1372163.webp",
  },
  {
    id: "6",
    image: "https://images6.alphacoders.com/137/thumbbig-1372163.webp",
  },
  {
    id: "7",
    image: "https://images6.alphacoders.com/137/thumbbig-1372163.webp",
  },
  {
    id: "8",
    image: "https://images6.alphacoders.com/137/thumbbig-1372163.webp",
  },
];

export function CategoriesCarrousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { width, height } = useWindowDimensions();

  const horizontalPadding = 16;

  const availableWidth = width - horizontalPadding * 2;

  return (
    <Carousel
      data={featured}
      currentIndex={currentIndex}
      onIndexChange={setCurrentIndex}
      itemWidth={availableWidth}
      itemHeight={height / 1.5}
      gap={12}
      grid={{
        rows: 2,
        columns: 2,
      }}
      renderItem={(item) => (
        <CardWallpaper image={item.image} Details={CategoriesDetails} />
      )}
    />
  );
}
