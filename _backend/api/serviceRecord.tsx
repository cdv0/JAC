export const BASE_URL = "https://ynwemrq0m2.execute-api.us-west-1.amazonaws.com/dev";

export type ServiceRecord = {
    serviceRecordId: string;
    vehicleId: string;
    title: string;
    serviceDate: string;
    mileage: string;
    note: string;
    createdAt: string
}

// POST /vehicle/createVehicle
export async function createServiceRecord(payload: {
  vehicleId: string;
  title: string;
  serviceDate: string;
  mileage: string;
  note: string;
}) {
  const response = await fetch(BASE_URL+"/vehicle/serviceRecord/createServiceRecord", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `HTTP ${response.status}`);
  }

  return (text ? JSON.parse(text) : {}) as { message: string; serviceRecordId: string };
}