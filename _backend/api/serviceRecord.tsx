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

// POST /vehicle/serviceRecord/createServiceRecord
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

// GET ALL SERVICE RECORDS /vehicle/serviceRecord/listServiceRecords
export async function listServiceRecords(vehicleId: string) {
  const url = `${BASE_URL}/vehicle/serviceRecord/listServiceRecords?vehicleId=${encodeURIComponent(vehicleId)}`
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store"
  });

  const text = await response.text();
  if (!response.ok) throw new Error(text || `HTTP ${response.status}`);

  const parsed = text ? JSON.parse(text) : { items: [] };
  return parsed as { items: ServiceRecord[] };
}

// GET /vehicle/serviceRecord/readServiceRecord
export async function readServiceRecord(serviceRecordId: string, vehicleId: string) {
  const url = `${BASE_URL}/vehicle/serviceRecord/readServiceRecord` +
            `?vehicleId=${encodeURIComponent(vehicleId)}` +
            `&serviceRecordId=${encodeURIComponent(serviceRecordId)}`;
  const response = await fetch(url, {
      method: "GET",
      cache: "no-store"
  });

  const text = await response.text()
  if (!response.ok) {
      throw new Error(text || `HTTP ${response.status}`);
  }

  return (text ? JSON.parse(text): {}) as ServiceRecord;
}