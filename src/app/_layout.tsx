import { Header } from "@/components/layout/header/header";
import { ModalWappaperBehavior } from "@/components/modal/modal-wallpaper-behavior";
import { useLoadDownloadedWallpapers } from "@/hooks/wallapapers/use-downloaded-wallaper";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

import "@/global.css";

import queryClient from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  useLoadDownloadedWallpapers();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode="dark">
        <ThemeProvider value={DarkTheme}>
          <QueryClientProvider client={queryClient}>
            <View className="bg-background" style={{ flex: 1 }}>
              <StatusBar style="light" />

              <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                <View
                  className="bg-background"
                  style={{
                    flex: 1,
                    paddingHorizontal: 16,
                  }}
                >
                  <Header />

                  <View style={{ flex: 1 }}>
                    <Stack
                      screenOptions={{
                        headerShown: false,
                        contentStyle: {
                          backgroundColor: "transparent",
                        },
                      }}
                    />

                    <ModalWappaperBehavior />
                  </View>
                </View>
              </SafeAreaView>
            </View>
          </QueryClientProvider>
        </ThemeProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
