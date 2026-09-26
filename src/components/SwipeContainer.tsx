import { usePathname, useRouter } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-worklets";

const routes = ["/home", "/search", "/favorites", "/profile"] as const;

export function SwipeContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const currentIndex = routes.indexOf(pathname as (typeof routes)[number]);

  const navigateTo = (index: number) => {
    if (index < 0 || index >= routes.length) {
      return;
    }

    router.replace(routes[index]);
  };

  const gesture = Gesture.Pan()
    .activeOffsetX([-30, 30])
    .failOffsetY([-30, 30])
    .onEnd((event) => {
      if (currentIndex === -1) {
        return;
      }

      if (event.translationX < -80) {
        runOnJS(navigateTo)(currentIndex + 1);
      }

      if (event.translationX > 80) {
        runOnJS(navigateTo)(currentIndex - 1);
      }
    });

  return <GestureDetector gesture={gesture}>{children}</GestureDetector>;
}
