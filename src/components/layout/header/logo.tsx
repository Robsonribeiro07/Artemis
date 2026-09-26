import { ThemedText } from "@/components/themedText";
import { ThemeView } from "@/components/themedView";
import { Box } from "@/components/ui/box";
import { usePathname } from "expo-router";
import { Image } from "react-native";

export function LogoHeader() {
  const pathName = usePathname();
  return (
    <ThemeView className="items-start justify-center  ">
      <Box className="flex-row items-end">
        <Image
          source={require("../../../../assets/images/android-icon-foreground.png")}
          width={40}
          height={40}
          className="w-12 h-12"
        />
        <ThemedText size="xl" weight="bold">
          rtemis
        </ThemedText>
      </Box>
      <ThemeView>
        <ThemedText size="sm" weight="bold" className="text-primary">
          {pathName.slice(1).toLocaleUpperCase()}
        </ThemedText>
      </ThemeView>
    </ThemeView>
  );
}
