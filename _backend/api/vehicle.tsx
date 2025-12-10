import {Buffer} from "buffer";

export const BASE_URL = "https://7e6tg2ovcc.execute-api.us-west-1.amazonaws.com/dev";

export type Vehicle = {
    userId: string;
    vehicleId: string;
    VIN: string;
    plateNum: string;
    make: string;
    model: string;
    year: string;
    createdAt: string
}

// POST /vehicle/createVehicle
export async function createVehicle(payload: {
  userId: string;
  VIN: string;
  plateNum: string;
  make: string;
  model: string;
  year: number;
}) {
  const response = await fetch(BASE_URL+"/vehicle/createVehicle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `HTTP ${response.status}`);
  }

  return (text ? JSON.parse(text) : {}) as { message: string; vehicleId: string };
}


// GET /vehicle/readVehicle
export async function readVehicle(userId: string, vehicleId: string) {
    const url = `${BASE_URL}/vehicle/readVehicle` +
              `?userId=${encodeURIComponent(userId)}` +
              `&vehicleId=${encodeURIComponent(vehicleId)}`;
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store"
    });

    const text = await response.text()
    if (!response.ok) {
        throw new Error(text || `HTTP ${response.status}`);
    }

    return (text ? JSON.parse(text): {}) as Vehicle;
}


// PUT /vehicle/updateVehicleDetails
export async function updateVehicleDetails(payload: {
  userId: string;
  vehicleId: string;
  VIN: string;
  plateNum: string;
  make: string;
  model: string;
  year: string;
}) {
  const response = await fetch(`${BASE_URL}/vehicle/updateVehicleDetails`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `HTTP ${response.status}`);
  }

  return (text ? JSON.parse(text) : {}) as { message: string; vehicleId: string };
}


// GET ALL VEHICLES WITH USER ID /vehicle/listVehicles
export async function listVehicles(userId: string) {
  const url = `${BASE_URL}/vehicle/listVehicles?userId=${encodeURIComponent(userId)}`
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store"
  });

  const text = await response.text();
  if (!response.ok) throw new Error(text || `HTTP ${response.status}`);

  const parsed = text ? JSON.parse(text) : { items: [] };
  return parsed as { items: Vehicle[] };
}

// GET /vehicle/getVehicleImage
export async function getVehicleImage(userId: string, vehicleId: string) {
    const url = `${BASE_URL}/vehicle/getVehicleImage` +
              `?userId=${encodeURIComponent(userId)}` +
              `&vehicleId=${encodeURIComponent(vehicleId)}`;
    
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store"
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
    }
    
    const base64string = await response.text();
    

    const dataUrl = `data:image/jpeg;base64,${base64string}`;
    
    return dataUrl;
}

// DELETE /vehicle/deleteVehicle
export async function deleteVehicle (payload: {userId: string, vehicleId: string}) {
  const response = await fetch(`${BASE_URL}/vehicle/deleteVehicle`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `HTTP ${response.status}`);
  }

  return (text ? JSON.parse(text) : {}) as { message: string; vehicleId: string };
}