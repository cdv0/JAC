import { Base64 } from "js-base64";

export const BASE_URL = "https://7e6tg2ovcc.execute-api.us-west-1.amazonaws.com/dev";

export type File = {
    uri: string;
    name: string;
    size: number;
    mimeType: string | null;
}

// VEHICLE IMAGE CONDITIONS
export const MAX_IMAGE_SIZE = 256 * 1024; // 256 KB
export const ALLOWED_MIME_TYPES_VEHICLE = ["image/jpeg", "image/jpg"];

// VEHICLE IMAGE CONDITIONS
export const MAX_RECORD_SIZE = 1000 * 1024; // 1 MB
export const ALLOWED_MIME_TYPES_RECORD = ["application/pdf", "pdf"];

// POST /vehicle/uploadVehicleImage
export default async function uploadVehicleImage(payload: File, type: "vehicle" | "record") {
  const base64 = Base64.encode(payload.uri);

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