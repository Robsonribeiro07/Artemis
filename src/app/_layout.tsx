import { Header } from "@/components/layout/header/header";
import { ContainerNav } from "@/components/layout/nav/container-nav";
import { ModalWappaperBehavior } from "@/components/modal/modal-wallpaper-behavior";
import { SwipeContainer } from "@/components/SwipeContainer";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

import "@/global.css";
import queryClient from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

import { useFonts } from "expo-font";
import { DarkTheme, Slot, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Jakarta: require("../../assets/fonts/PlusJakartaSans-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const isDark = colorScheme === "dark";
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode={"dark"}>
        <ThemeProvider value={DarkTheme}>
          <QueryClientProvider client={queryClient}>
            <View
              style={{
                flex: 1,
              }}
              className="bg-background"
            >
              <StatusBar style={isDark ? "light" : "dark"} />

              <SafeAreaView
                style={{
                  flex: 1,
                }}
                edges={["top", "bottom"]}
              >
                <View
                  style={{
                    flex: 1,
                    padding: 16,
                  }}
                >
                  <Header />

                  <SwipeContainer>
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Slot />
                      <ModalWappaperBehavior />
                    </View>
                  </SwipeContainer>

                  <ContainerNav />
                </View>
              </SafeAreaView>
            </View>
          </QueryClientProvider>
        </ThemeProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
