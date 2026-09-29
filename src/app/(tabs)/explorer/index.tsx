import { ContainerExplorerCategory } from "@/components/screens/Explore/container-explorer-category";
import { SearchInput } from "@/components/screens/Explore/search-input";
import { ThemeView } from "@/components/themedView";

export default function Explore() {
  return (
    <ThemeView className="flex-1 items-start  justify-start gap-5">
      <SearchInput />
      <ContainerExplorerCategory />
    </ThemeView>
  );
}
