import { Input, InputField } from "@/components/ui/input";
import { useWallpaperStore } from "@/store/wallpapers/use-wallpapers-store";

export function SearchInput() {
  const { setFilterInput } = useWallpaperStore();
  return (
    <Input className="rounded-2xl">
      <InputField placeholder="Animes" onChangeText={setFilterInput} />
    </Input>
  );
}
