import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NormalButton from "@/app/components/NormalButton";
import { useRouter } from "expo-router";
import { listVehicles, type Vehicle } from "@/_backend/api/vehicle";
import { getCurrentUser } from "aws-amplify/auth";
import { icons } from "@/constants/icons";
import { Hub } from "aws-amplify/utils";
import { useFocusEffect } from "@react-navigation/native";

export const garage = () => {
  const router = useRouter();
  const [items, setItems] = useState<Vehicle[]>([]);  // List of vehicles
  const [loading, setLoading] = useState(false);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  const numColumns = 2;

  // Check user authentication
  const checkAuth = useCallback(async() => {
    try {
      await getCurrentUser();
      setIsAuthed(true);
    } catch {
      setIsAuthed(false);
    }
  }, []);

  // Load: Retrieve userId and call API to list vehicles
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { userId } = await getCurrentUser();
      const data = await listVehicles(userId);
      const sorted = (data.items || []).slice().sort((a, b) =>
        (a.model).localeCompare(b.model)
      );
      setItems(sorted);
    } catch (e: any) {
      console.log("Garage vehicle list error:", e?.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial authentication check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);  // Add checkAuth as a dependency since the function is dependent on it

  // Reload when the screen is focused again
  useFocusEffect(
    useCallback(() => {
      // Only try to load once we know auth state
      if (isAuthed !== null) load();
    }, [load, isAuthed])  // Add load and isAuthed as a dependency becuase the function is dependent on it
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
          break;
        default:
          break;
      }
    });
    return () => sub();
  }, [load]);  // Add load as a dependency in case the function changes since it's being used in the function

  // Align the vehicle card at the start of the row if there's only one vehicle card in the row
  const formatData = (items: any[], numColumns: number) => {
    const data = [...items];
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow = numberOfElementsLastRow + 1;
    }
    return data;
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <ScrollView>
        <View className="flex-1 mx-5">

          {/* Top bar */}
          <View className="flex-row justify-between items-end mt-6">
            <Text className="mediumTitle">Garage</Text>
            <NormalButton
              text="Add vehicle"
              paddingHorizontal={10}
              variant="primary"
              onClick={() => router.push("/garage/addVehicle")}
            />
          </View>
          
          {/* Main content: Vehicles list */}
          <FlatList
            className="mt-3"
            data={formatData(items, numColumns)}
            keyExtractor={(v: any) => (v.empty ? v.key : v.vehicleId)}
            numColumns={numColumns}
            columnWrapperStyle={{ marginBottom: 16, gap: 16 }}
            ListEmptyComponent={
              <View className="mt-10 items-center">
                <Text className="smallTextGray">{loading ? "Loading..." : "No vehicles yet."}</Text>
              </View>
            }

            renderItem={({ item }: { item: any }) => {
              if (item.empty) {
                return (
                  <View style={{ flex: 1 }}>
                    <View style={{ opacity: 0 }} className="border border-stroke rounded-lg p-4 mb-3" />
                  </View>
                );
              }

              return (
                <Pressable onPress={() => router.push(`/garage/vehicle/${item.vehicleId}`)} style={{ flex: 1 }}>
                  {/* Vehicle card */}
                  <View className="border border-stroke rounded-lg p-4 mb-3 gap-4 ">
                    {/* Vehicle image */}
                    <View className="items-center justify-center h-24">
                      <icons.noImage height={50} width={70}/>
                    </View>
                    {/* Vehicle card's text */}
                    <View>
                      <Text className="buttonTextBlue text-center">{item.model}</Text>
                      <Text className="smallThinTextBlue text-center">{item.make} {item.year}</Text>
                    </View>
                    {/* Vehicle card's select button */}
                    <View className="mx-1.5">
                      <NormalButton 
                        text="Select"
                        variant="lightBlue"
                        onClick={() => router.push(`/garage/vehicle/${item.vehicleId}`)}
                        grow
                      />
                    </View>
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default garage;