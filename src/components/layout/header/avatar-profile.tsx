import { ThemeView } from "@/components/themedView";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";

export function AvatarProfile() {
  return (
    <ThemeView className="w-17  h-17 bg-primary rounded-full items-center justify-center">
      <Avatar>
        <AvatarFallbackText>Logo</AvatarFallbackText>
        <AvatarImage
          className="w-16 h-16 "
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm4W7-Kvabz3FsSXLkbmmsvJZgx9Oqgs4Tg3F_xZ2AOw&s=10",
          }}
        />
      </Avatar>
    </ThemeView>
  );
}
