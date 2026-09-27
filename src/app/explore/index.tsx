import { ContainerExplorer } from "@/components/screens/Explore/container-explorer";
import { SearchInput } from "@/components/screens/Explore/search-input";
import { ThemeView } from "@/components/themedView";
import { AllWallpaperForCategory } from "@/components/wallpaper/all-wallpaper-for-category";

export default function Explore() {
  return (
    <ThemeView className="flex-1 items-start  justify-start gap-5">
      <SearchInput />
      <ContainerExplorer />
      <AllWallpaperForCategory />
    </ThemeView>
  );
}
