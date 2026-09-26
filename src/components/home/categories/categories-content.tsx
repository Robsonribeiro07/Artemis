import { useState } from "react";

import { Carousel } from "@/components/Carousel";
import { Box } from "@/components/ui/box";

import {
  CarTaxiFront,
  LucideIcon,
  PaintBucket,
  Rocket,
} from "lucide-react-native";
import { CardCategories } from "./card-categories";
import { CategoriesCarrousel } from "./categories-carousel";
import { CategoriesHeader } from "./categories-header";

type Icategories = {
  label: string;
  icon: LucideIcon;
}[];
const Categories: Icategories = [
  {
    label: "Cars",
    icon: CarTaxiFront,
  },
  {
    label: "Anime",
    icon: PaintBucket,
  },
  {
    label: "Space",
    icon: Rocket,
  },
];

export function CategoriesContent() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOnPress = (index: number) => {
    setCurrentIndex(index);
  };
  return (
    <Box className="flex-1 bg-background gap-3">
      <CategoriesHeader />

      <Carousel
        data={Categories}
        renderItem={(item, index) => (
          <CardCategories
            label={item.label}
            selected={currentIndex === index}
            onPress={() => handleOnPress(index)}
            Icon={item.icon}
          />
        )}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        itemWidth={130}
        itemHeight={45}
        withoutIndicator
      />

      <CategoriesCarrousel />
    </Box>
  );
}
