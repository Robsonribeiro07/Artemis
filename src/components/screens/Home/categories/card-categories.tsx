import { ThemedText } from "@/components/themedText";
import { LucideIcon } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

interface ICardCategoriesProps {
  selected: boolean;
  onPress: () => void;
  Icon: LucideIcon;
  label: string;
}

export function CardCategories({
  selected,
  onPress,
  Icon,
  label,
}: ICardCategoriesProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${selected ? "bg-primary" : "bg-card"} flex-1  rounded-[2.2rem] flex-row  items-center justify-center px-5 gap-3 `}
    >
      <Icon color={`${selected ? "#000000" : "#FFFFFF"}`} />

      <ThemedText
        className={`${selected ? "text-muted" : ""} flex-1`}
        weight="bold"
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}
