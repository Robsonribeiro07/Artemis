import { Stack } from "expo-router";

export default function ExploreLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          animation: "none",
        }}
      />

      <Stack.Screen
        name="subcategory/index"
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
