import { TabTrigger, TabTriggerSlotProps } from "expo-router/ui";

import * as LucideIcons from "lucide-react-native";

import { forwardRef, useEffect, useRef } from "react";

import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";

type NavItem = "home" | "explore" | "favorites" | "profile";

type NavItemConfig = {
  icon: keyof typeof LucideIcons;
  label: string;
  tab: NavItem;
};

export const navItems: Record<NavItem, NavItemConfig> = {
  home: {
    icon: "House",
    label: "Home",
    tab: "home",
  },

  explore: {
    icon: "Search",
    label: "Search",
    tab: "explore",
  },

  favorites: {
    icon: "Heart",
    label: "Favorites",
    tab: "favorites",
  },

  profile: {
    icon: "User",
    label: "Profile",
    tab: "profile",
  },
};

type NavButtonProps = TabTriggerSlotProps & {
  item: NavItem;
};

const NavButton = forwardRef<View, NavButtonProps>(
  ({ item, isFocused, ...props }, ref) => {
    const { icon } = navItems[item];

    const Icon = LucideIcons[icon];

    const scale = useRef(new Animated.Value(isFocused ? 1 : 0.8)).current;

    const opacity = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: isFocused ? 1 : 0.8,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: isFocused ? 1 : 0,
          duration: isFocused ? 180 : 120,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, [isFocused, scale, opacity]);

    return (
      <Pressable ref={ref} {...props} style={styles.button}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.focusBackground,
            {
              opacity,
              transform: [
                {
                  scale,
                },
              ],
            },
          ]}
        />

        <View style={styles.iconContainer}>
          <Icon
            size={24}
            color={isFocused ? "#000000" : "#FFFFFF"}
            strokeWidth={isFocused ? 2.5 : 2}
          />
        </View>
      </Pressable>
    );
  },
);

NavButton.displayName = "NavButton";

type NavItemsProps = {
  item: NavItem;
};

export function NavItems({ item }: NavItemsProps) {
  const { tab } = navItems[item];

  return (
    <TabTrigger name={tab} asChild>
      <NavButton item={item} />
    </TabTrigger>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,

    padding: 0,
    margin: 0,

    alignItems: "center",
    justifyContent: "center",

    position: "relative",
  },

  focusBackground: {
    position: "absolute",

    width: 40,
    height: 40,

    top: 0,
    left: 0,

    borderRadius: 999,

    backgroundColor: "#FFE600",
  },

  iconContainer: {
    width: 40,
    height: 40,

    alignItems: "center",
    justifyContent: "center",
  },
});
