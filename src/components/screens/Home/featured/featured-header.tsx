import { ThemedText } from "@/components/themedText";
import { ThemeView } from "@/components/themedView";

export function FeaturedHeader() {
  return (
    <ThemeView className="justify-between flex-row w-full">
      <ThemeView className="flex-row items-center gap-2">
        <ThemedText size="lg" weight="bold">
          Featured
        </ThemedText>
        <ThemedText
          size="md"
          weight="bold"
          className="bg-card rounded-lg px-2 text-primary"
        >
          4K ULTRA
        </ThemedText>
      </ThemeView>
      <ThemedText size="sm" weight="bold">
        SWIPE
      </ThemedText>
    </ThemeView>
  );
}
