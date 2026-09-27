import { ThemeView } from "@/components/themedView";
import { FeaturedCarousel } from "./featured-carousel";
import { FeaturedHeader } from "./featured-header";

export function FeaturedContainer() {
  return (
    <ThemeView className="mt-6 flex-1 gap-4">
      <FeaturedHeader />
      <FeaturedCarousel />
    </ThemeView>
  );
}
