import { ThemedText } from "@/components/themedText";
import { Box } from "@/components/ui/box";
import { LinearGradient } from "expo-linear-gradient";
import { Download, Heart } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export function CategoriesDetails() {
  return (
    <Box className="absolute inset-0 z-10">
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.85)"]}
        className="absolute bottom-0 left-0 right-0 h-40"
      />

      <Box className="flex-1 justify-between px-2 py-5">
        <Box className="flex-row justify-between gap-3">
          <ThemedText
            className="rounded-2xl bg-card px-3 p-2"
            size="md"
            weight="bold"
          >
            4K
          </ThemedText>

          <TouchableOpacity className="h-fit w-fit rounded-full bg-primary p-2">
            <Heart />
          </TouchableOpacity>
        </Box>

        <Box>
          <ThemedText size="md" weight="bold" className="text-primary">
            HYPER SPEED
          </ThemedText>

          <ThemedText size="lg" weight="bold">
            Midnight Apex
          </ThemedText>

          <Box className="h-12 w-12 flex-row items-center gap-3">
            <Download color="#FFFFFF" />
            <ThemedText>52.4k</ThemedText>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
