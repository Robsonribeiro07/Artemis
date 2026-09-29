import { Input, InputField } from "@/components/ui/input";
import { useAllWallpaperForCategoryStore } from "@/store/wallpapers/use-state-all-walpaper-explorer";

export function SearchInput() {
  const setFilterInput = useAllWallpaperForCategoryStore(
    (state) => state.setFilterInput,
  );

  return (
    <Input className="rounded-2xl">
      <InputField placeholder="Animes" onChangeText={setFilterInput} />
    </Input>
  );
}
