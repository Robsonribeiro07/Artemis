import { Heart, HeartPlusIcon } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

interface IaddFavoritePreview {
  onPress: () => void;
  isFavorite: boolean;
}
export function AddFavoritePreview({
  onPress,
  isFavorite = false,
}: IaddFavoritePreview) {
  return (
    <TouchableOpacity
      className="bg-card w-30 items-center py-5 rounded-xl"
      onPress={onPress}
    >
      {isFavorite ? (
        <Heart color={"white"} fill="black" />
      ) : (
        <HeartPlusIcon color={"white"} />
      )}
    </TouchableOpacity>
  );
}
