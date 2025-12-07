// app/vehicle/[vehicleId]/view.tsx

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const ServiceRecordViewer = () => {
  const { vehicleId, fileKey } = useLocalSearchParams<{
    vehicleId: string;
    fileKey: string;
  }>();
  const router = useRouter();

  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fileKey) return;

    (async () => {
      try {
        setLoading(true);
        const signedUrl = await getServiceRecordUrl(fileKey);
        setUrl(signedUrl);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load record URL", err);
        setError("Failed to load service record.");
      } finally {
        setLoading(false);
      }
    })();
  }, [fileKey]);

  if (loading && !url) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
        <Text className="mt-2 text-sm text-gray-600">Loading record…</Text>
      </SafeAreaView>
    );
  }

  if (error || !url) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500 mb-3">{error || "No URL found."}</Text>
        <Pressable
          onPress={() => router.back()}
          className="px-4 py-2 bg-black rounded-full"
        >
          <Text className="text-white">Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()}>
          <Text className="text-blue-600 text-sm">Back</Text>
        </Pressable>
        <Text className="text-sm font-semibold">Service Record</Text>
        <View style={{ width: 40 }} />
      </View>

      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        startInLoadingState
        renderLoading={() => (
          <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator />
            <Text className="mt-2 text-sm text-gray-600">
              Loading PDF…
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ServiceRecordViewer;