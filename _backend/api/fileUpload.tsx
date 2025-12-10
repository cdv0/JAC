import { Base64 } from "js-base64";
import * as FileSystem from 'expo-file-system/legacy';

export const BASE_URL = "https://7e6tg2ovcc.execute-api.us-west-1.amazonaws.com/dev";

export type File = {
    uri: string;
    name: string;
    size: number;
    mimeType: string | null;
    userId?: string;
    email?: string;
}

// IMAGE CONDITIONS
export const MAX_IMAGE_SIZE = 256 * 1024; // 256 KB
export const ALLOWED_MIME_TYPES_IMAGE = ["image/jpeg", "image/jpg"];

// IMAGE CONDITIONS
export const MAX_RECORD_SIZE = 1000 * 1024; // 1 MB
export const ALLOWED_MIME_TYPES_RECORD = ["image/png", "image/jpeg", "image/jpg"];

// POST /vehicle/uploadVehicleImage
// export async function uploadVehicleImage(payload: File, type: "vehicle" | "record") {
//   console.log(payload.name, payload.uri);
//   const base64 = await FileSystem.readAsStringAsync(payload.uri, { encoding: FileSystem.EncodingType.Base64 });
//   const response = await fetch(BASE_URL+"/vehicle/uploadVehicleImage", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//         fileName: payload.name,
//         fileContent: base64,
//         contentType: payload.mimeType,
//         type
//     }),
//   });

export async function uploadVehicleImage(payload: File, type: "vehicle" | "record") {
  console.log(payload.name, payload.uri);
  
  // Fetch the file and convert to blob
  const fileResponse = await fetch(payload.uri);
  const blob = await fileResponse.blob();
  
  // Read blob as base64 (if your backend still expects base64)
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  
  const response = await fetch(BASE_URL + "/vehicle/uploadVehicleImage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: payload.name,
      fileContent: base64,
      contentType: payload.mimeType,
      type
    }),
  });
  
  return response;
}


// POST /profile/uploadProfilePicture
export async function uploadProfilePicture(payload: File) {
 // Fetch the file and convert to blob
  const fileResponse = await fetch(payload.uri);
  const blob = await fileResponse.blob();
  
  // Read blob as base64 (if your backend still expects base64)
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  
  const response = await fetch(BASE_URL + "/vehicle/uploadVehicleImage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: payload.name,
      fileContent: base64,
      contentType: payload.mimeType,
      type
    }),
  });
}