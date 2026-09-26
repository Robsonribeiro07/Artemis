import { Href, usePathname, useRouter } from "expo-router";
import * as LucideIcons from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable } from "react-native";

type NavItem = "home" | "search" | "favorites" | "profile";

type NavItemConfig = {
  icon: keyof typeof LucideIcons;
  label: string;
  route: Href;
};

export const navItems: Record<NavItem, NavItemConfig> = {
  home: {
    icon: "House",
    label: "Home",
    route: "/",
  },

  search: {
    icon: "Search",
    label: "Search",
    route: "/search",
  },

  favorites: {
    icon: "Heart",
    label: "Favorites",
    route: "/favorites",
  },

  profile: {
    icon: "User",
    label: "Profile",
    route: "/profile",
  },
};

type NavItemsProps = {
  item: NavItem;
};

export function NavItems({ item }: NavItemsProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { icon, route } = navItems[item];

  const Icon = LucideIcons[icon];

  const selected = pathname === route;

  const scale = useRef(new Animated.Value(selected ? 1 : 0.8)).current;

  const opacity = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    if (selected) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selected]);

  return (
    <Pressable
      onPress={() => router.push(route)}
      className="w-10 h-10 items-center justify-center"
    >
      <Animated.View
        style={{
          position: "absolute",
          width: 40,
          height: 40,
          borderRadius: 999,
          backgroundColor: "#FFE600",
          opacity,
          transform: [{ scale }],
        }}
      />

      <Icon
        size={24}
        color={selected ? "#000000" : "#FFFFFF"}
        strokeWidth={selected ? 2.5 : 2}
      />
    </Pressable>
  );
}
