import { ThemedText } from "@/components/themedText";
import { TouchableOpacity } from "react-native";

interface IApplyPreviewWallpaper {
  onPress: () => void;
}
export function ApplyPreviewWallpaper({ onPress }: IApplyPreviewWallpaper) {
  return (
    <TouchableOpacity
      className="bg-primary flex-1  items-center py-5 rounded-xl "
      onPress={onPress}
    >
      <ThemedText weight="bold" size="lg" className="text-muted">
        Apply
      </ThemedText>
    </TouchableOpacity>
  );
}
