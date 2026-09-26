import { ThemedText } from "@/components/themedText";
import { Box } from "@/components/ui/box";
import { ChevronRight } from "lucide-react-native";

export function CategoriesHeader() {
  return (
    <Box className="flex-row justify-between">
      <ThemedText size="3xl" weight="bold">
        Categories
      </ThemedText>

      <Box className="flex-row items-center">
        <ThemedText className="text-primary">See all</ThemedText>

        <ChevronRight size={20} color={"#FFE600"} />
      </Box>
    </Box>
  );
}
