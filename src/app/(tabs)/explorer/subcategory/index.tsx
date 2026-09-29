import { ContainerExplorerSubCategory } from "@/components/screens/Explore/container-explorer-subcategory";
import { SearchInput } from "@/components/screens/Explore/search-input";
import { ThemeView } from "@/components/themedView";

export default function SubCategory() {
  return (
    <ThemeView className="flex-1 items-start  justify-start gap-5">
      <SearchInput />
      <ContainerExplorerSubCategory />
    </ThemeView>
  );
}
