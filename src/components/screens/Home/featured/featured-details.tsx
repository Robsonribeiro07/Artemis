import { ThemedText } from "@/components/themedText";
import { Box } from "@/components/ui/box";
import { ChevronsLeftRight, DownloadCloud } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

interface IFeaturedDetails {
  category?: string;
  wihoutCategory?: boolean;
  onHandlePressDowload: () => void;
  onHandlePressOpenEditor: () => void;
  isDowloaded: boolean;
}
export function FeaturedDetails({
  category,
  isDowloaded,
  wihoutCategory = false,
  onHandlePressDowload,
  onHandlePressOpenEditor,
}: IFeaturedDetails) {
  return (
    <Box className="flex-1 absolute bottom-0 left-4 right-0 z-10 top-0 justify-between py-5">
      {!wihoutCategory && (
        <Box className="flex-row gap-3">
          <ThemedText
            className="bg-card w-fit p-2  px-4 rounded-2xl"
            size="sm"
            weight="bold"
          >
            {category}
          </ThemedText>
        </Box>
      )}

      <Box className="flex-row justify-between ">
        {isDowloaded ? (
          <TouchableOpacity
            className="w-12 h-12 bg-primary rounded-full mr-4 items-center justify-center rotate-140"
            onPress={onHandlePressOpenEditor}
          >
            <ChevronsLeftRight />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="w-12 h-12 bg-primary rounded-full mr-4 items-center justify-center "
            onPress={onHandlePressDowload}
          >
            <DownloadCloud />
          </TouchableOpacity>
        )}
      </Box>
    </Box>
  );
}
