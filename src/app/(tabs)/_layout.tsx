import { BlurTargetView } from "expo-blur";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";

import { ContainerNav } from "@/components/layout/nav/container-nav";

import { useRef } from "react";
import { View } from "react-native";

export default function TabsLayout() {
  const blurTarget = useRef<View | null>(null);

  return (
    <Tabs>
      <View style={{ flex: 1 }}>
        <BlurTargetView ref={blurTarget} style={{ flex: 1 }}>
          <TabSlot />
        </BlurTargetView>

        <ContainerNav blurTarget={blurTarget} />
      </View>

      <TabList style={{ display: "none" }}>
        <TabTrigger name="explore" href="/explorer" />
        <TabTrigger name="home" href="/home" />

        <TabTrigger name="favorites" href="/favorites" />

        <TabTrigger name="profile" href="/profile" />
      </TabList>
    </Tabs>
  );
}
