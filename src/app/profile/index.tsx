import { ThemedText } from "@/components/themedText";
import { ThemeView } from "@/components/themedView";

export default function Profile() {
  return (
    <ThemeView className="flex-1 items-center justify-center bg-background">
      <ThemedText size="xl" weight="bold">
        Profile
      </ThemedText>
    </ThemeView>
  );
}
