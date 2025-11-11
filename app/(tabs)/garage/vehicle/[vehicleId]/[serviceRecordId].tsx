// app/(tabs)/garage/vehicle/[vehicleId]/[serviceRecordId].tsx
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ServiceRecordScreen() {
  const { vehicleId, serviceRecordId } = useLocalSearchParams<{
    vehicleId: string;
    serviceRecordId: string;
  }>();

  return (
    <View>
      <Text>Vehicle: {vehicleId}</Text>
      <Text>Service record: {serviceRecordId}</Text>
    </View>
  );
}
