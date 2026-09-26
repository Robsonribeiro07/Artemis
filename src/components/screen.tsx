import { ScrollView } from "react-native";
import { ThemeView } from "./themedView";

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 24,
      }}
    >
      <ThemeView className="w-full flex-1 ">{children}</ThemeView>
    </ScrollView>
  );
}
