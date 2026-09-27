import { ThemeView } from "@/components/themedView";
import { useWindowDimensions } from "react-native";
import { NavItems } from "./nav-items";

const contentNavs = [
  { item: "home" },
  { item: "explore" },
  { item: "favorites" },
  { item: "profile" },
];

export function ContainerNav() {
  const { width } = useWindowDimensions();

  const navWidth = width - 32;

  return (
    <ThemeView
      className="absolute bottom-10"
      style={{
        width: navWidth,
        left: (width - navWidth) / 2,
      }}
    >
      {/* Glow */}
      <ThemeView
        pointerEvents="none"
        className="absolute"
        style={{
          top: -8,
          bottom: -8,
          left: -8,
          right: -8,
          borderRadius: 100,
          backgroundColor: "rgb(255, 230, 0)",
          opacity: 0.18,
        }}
      />

      {/* Navbar */}
      <ThemeView
        className="flex-row items-center justify-around h-20 bg-card rounded-[5rem]"
        style={{
          shadowColor: "rgb(255, 230, 0)",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.5,
          shadowRadius: 12,
          elevation: 10,
        }}
      >
        {contentNavs.map((nav, index) => (
          <NavItems key={index} item={nav.item as any} />
        ))}
      </ThemeView>
    </ThemeView>
  );
}
