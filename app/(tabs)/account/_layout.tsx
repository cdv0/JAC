import { Stack } from "expo-router";
import React from "react";

export default function Layout() {

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >

      {/* Account page */}
      <Stack.Screen
        name="index"
        options={{
          title: "Account",
          headerShown: false,
        }}
      />

    </Stack>
  );
}