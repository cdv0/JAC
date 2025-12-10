import { listVehicles, type Vehicle, getVehicleImage } from "@/_backend/api/vehicle";
import NormalButton from "@/app/components/NormalButton";
import { icons } from "@/constants/icons";
import { useFocusEffect } from "@react-navigation/native";
import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const garage = () => {
  const router = useRouter();
  const [items, setItems] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  // vehicleId -> data URL from getVehicleImage
  const [vehicleImages, setVehicleImages] = useState<
    Record<string, string | null>
  >({});

  const numColumns = 2;

  const checkAuth = useCallback(async () => {
    try {
      await getCurrentUser();
      setIsAuthed(true);
    } catch {
      setIsAuthed(false);
    }
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const { userId } = await getCurrentUser();
      const data = await listVehicles(userId);

      const sorted = (data.items || []).slice().sort((a, b) =>
        a.model.localeCompare(b.model)
      );
      setItems(sorted);

      // Fetch vehicle images from API instead of AsyncStorage
      const imageResults = await Promise.all(
        sorted.map(async (v) => {
          try {
            const uri = await getVehicleImage(userId, v.vehicleId);
            return { vehicleId: v.vehicleId, uri };
          } catch (e: any) {
            console.log(
              "Garage image fetch error for",
              v.vehicleId,
              e?.message
            );
            return { vehicleId: v.vehicleId, uri: null };
          }
        })
      );

      const next: Record<string, string | null> = {};
      for (const { vehicleId, uri } of imageResults) {
        next[vehicleId] = uri;
      }
      setVehicleImages(next);
    } catch (e: any) {
      console.log("Garage vehicle list error:", e?.message);
      setItems([]);
      setVehicleImages({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useFocusEffect(
    useCallback(() => {
      if (isAuthed !== null) load();
    }, [load, isAuthed])
  );

  useEffect(() => {
    const sub = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          setIsAuthed(true);
          load();
          break;
        case "signedOut":
          setIsAuthed(false);
          setItems([]);
          setVehicleImages({});
          break;
        default:
          break;
      }
    });
    return () => sub();
  }, [load]);

  const formatData = (items: any[], numColumns: number) => {
    const data = [...items];
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow = numberOfElementsLastRow + 1;
    }
    return data;
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-1 mx-5">
        <FlatList
          className="mt-3"
          data={formatData(items, numColumns)}
          keyExtractor={(v: any) => (v.empty ? v.key : v.vehicleId)}
          numColumns={numColumns}
          columnWrapperStyle={{ marginBottom: 16, gap: 16 }}
          contentContainerStyle={{
            paddingBottom: 24,
          }}
          ListHeaderComponent={
            <View className="mt-6 mb-5 flex-row items-end justify-between">
              <Text className="mediumTitle">Garage</Text>
              <NormalButton
                text="Add vehicle"
                paddingHorizontal={20}
                variant="primary"
                onClick={() => router.push("/garage/addVehicle")}
              />
            </View>
          }
          ListEmptyComponent={
            <View className="mt-10 items-center">
              <Text className="smallTextGray">
                {loading ? "Loading..." : "No vehicles yet."}
              </Text>
            </View>
          }
          renderItem={({ item }: { item: any }) => {
            if (item.empty) {
              return (
                <View style={{ flex: 1 }}>
                  <View
                    style={{ opacity: 0 }}
                    className="mb-3 rounded-lg border border-stroke p-4"
                  />
                </View>
              );
            }

            const img = vehicleImages[item.vehicleId];

            return (
              <Pressable
                onPress={() => router.push(`/garage/vehicle/${item.vehicleId}`)}
                style={{ flex: 1 }}
              >
                <View className="gap-4 rounded-lg border border-stroke p-4">
                  <View className="h-24 items-center justify-center">
                    {img ? (
                      <Image
                        source={{ uri: img }}
                        className="h-full w-full rounded-lg"
                      />
                    ) : (
                      <icons.noImage height={50} width={70} />
                    )}
                  </View>

                  <View>
                    <Text className="buttonTextBlue text-center">
                      {item.model}
                    </Text>
                    <Text className="smallThinTextBlue text-center">
                      {item.make} {item.year}
                    </Text>
                  </View>

                  <View className="mx-1.5">
                    <NormalButton
                      text="Select"
                      variant="lightBlue"
                      onClick={() =>
                        router.push(`/garage/vehicle/${item.vehicleId}`)
                      }
                      grow
                    />
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default garage;