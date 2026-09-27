import { ThemeView } from "./themedView";

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <ThemeView style={{ flex: 1, paddingBottom: 24 }}>{children}</ThemeView>
  );
}
