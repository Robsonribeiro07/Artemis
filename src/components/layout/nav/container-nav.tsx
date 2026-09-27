import { BlurView } from "expo-blur";
import { View } from "react-native";

import { NavItems } from "./nav-items";

type NavItem = "home" | "explore" | "favorites" | "profile";

const contentNavs: { item: NavItem }[] = [
  { item: "home" },
  { item: "explore" },
  { item: "favorites" },
  { item: "profile" },
];

type ContainerNavProps = {
  blurTarget: React.RefObject<View | null>;
};

export function ContainerNav({ blurTarget }: ContainerNavProps) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 60,
        left: 16,
        right: 16,
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",

          top: -5,
          bottom: -10,
          left: -2,
          right: -2,

          borderRadius: 999,

          backgroundColor: "#FFE600",

          opacity: 0.12,

          shadowColor: "#FFE600",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.8,
          shadowRadius: 20,

          elevation: 10,
        }}
      />

      <View
        style={{
          height: 80,
          width: "100%",

          borderRadius: 999,

          overflow: "hidden",

          backgroundColor: "rgba(20, 20, 20, 0.35)",

          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.08)",

          shadowColor: "#FFE600",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.35,
          shadowRadius: 14,

          elevation: 12,
        }}
      >
        <BlurView
          blurTarget={blurTarget}
          blurMethod="dimezisBlurView"
          intensity={90}
          blurReductionFactor={1.5}
          tint="dark"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        />

        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,

            backgroundColor: "rgba(10, 10, 10, 0.20)",
          }}
        />

        <View
          style={{
            flex: 1,

            flexDirection: "row",

            alignItems: "center",

            justifyContent: "space-around",

            paddingHorizontal: 18,
          }}
        >
          {contentNavs.map(({ item }) => (
            <NavItems key={item} item={item} />
          ))}
        </View>
      </View>
    </View>
  );
}
