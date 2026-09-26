import { ThemeView } from "../../themedView";
import { LogoHeader } from "./logo";

export function Header() {
  return (
    <ThemeView className=" flex-row items-center justify-between py-2 h-20 ">
      <LogoHeader />
      <ThemeView></ThemeView>
      <ThemeView></ThemeView>
    </ThemeView>
  );
}
