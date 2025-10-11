export const BASE_URL = "https://5xmnezhtdj.execute-api.us-west-1.amazonaws.com/dev";

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

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `HTTP ${response.status}`);
  }

  return response.json() as Promise<{ message: string; vehicleId: string }>;
}