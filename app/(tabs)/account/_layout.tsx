import { Stack } from "expo-router";
import React from "react";

export default function AccountLayout() {

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >

      {/* Acount page */}
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