import { Base64 } from "js-base64";
import * as FileSystem from 'expo-file-system';

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
export async function uploadVehicleImage(payload: File, type: "vehicle" | "record") {
  const base64 = await FileSystem.readAsStringAsync(payload.uri, {encoding: FileSystem.EncodingType.Base64})

  const response = await fetch(BASE_URL+"/vehicle/uploadVehicleImage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        fileName: payload.name,
        fileContent: base64,
        contentType: payload.mimeType,
        type
    }),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `HTTP ${response.status}`);
  }

  const data = await JSON.parse(text);
  return data.key as string;
}

// POST /profile/uploadProfilePicture
export async function uploadProfilePicture(payload: File) {
  const base64 = Base64.encode(payload.uri);

  const response = await fetch(BASE_URL+"/profile/uploadProfilePicture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: payload.name,
      fileContent: base64,
      contentType: payload.mimeType,
      userId: payload.userId,
      email: payload.email,
    }),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `HTTP ${response.status}`);
  }

  const data = await JSON.parse(text);
  return data.key as string;
}