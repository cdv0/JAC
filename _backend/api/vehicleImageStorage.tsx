import AsyncStorage from '@react-native-async-storage/async-storage';

const VEHICLE_IMAGE_URI_KEY_PREFIX = 'vehicleImageUri';

export const getVehicleImageKey = (vehicleId: string) =>
  `${VEHICLE_IMAGE_URI_KEY_PREFIX}:${vehicleId}`;

export async function saveVehicleImageUri(vehicleId: string, uri: string) {
  try {
    const key = getVehicleImageKey(vehicleId);
    await AsyncStorage.setItem(key, uri);
  } catch (e) {
    console.log('Error saving vehicle image uri:', e);
  }
}

export async function loadVehicleImageUri(vehicleId: string): Promise<string | null> {
  try {
    const key = getVehicleImageKey(vehicleId);
    const uri = await AsyncStorage.getItem(key);
    return uri;
  } catch (e) {
    console.log('Error loading vehicle image uri:', e);
    return null;
  }
}
