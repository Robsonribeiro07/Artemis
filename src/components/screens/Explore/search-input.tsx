import { Input, InputField } from "@/components/ui/input";
import { useAllWallpaperForCategoryStore } from "@/store/wallpapers/use-state-all-walpaper-explorer";

export function SearchInput() {
  const { setCategory } = useAllWallpaperForCategoryStore();
  return (
    <Input className="rounded-2xl">
      <InputField placeholder="Animes" onChangeText={setCategory} />
    </Input>
  );
}
