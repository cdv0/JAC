export const BASE_URL =
  'https://7e6tg2ovcc.execute-api.us-west-1.amazonaws.com/dev'

export type UserProfile = {
  firstName: string
  lastName: string
  createdAt: string
}

export async function readUserProfile(
  userId: string,
  email: string
): Promise<UserProfile> {
  const url =
    `${BASE_URL}/profile/readProfileInfo` +
    `?userId=${encodeURIComponent(userId)}` +
    `&email=${encodeURIComponent(email)}`
  console.log('[readUserProfile] url:', url)

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(text || `HTTP ${response.status}`)
  }
  return (text ? JSON.parse(text) : {}) as UserProfile
}

export async function updateProfileInfo(
  userId: string,
  oldEmail: string,
  newEmail: string
) {
  const res = await fetch(`${BASE_URL}/profile/updateProfileInfo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, oldEmail, newEmail }),
  })

  const text = await res.text()
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`)
  return JSON.parse(text)
}

export async function updateName(
  userId: string,
  email: string,
  firstName: string,
  lastName: string
) {
  const res = await fetch(`${BASE_URL}/profile/updateProfileName`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, email, firstName, lastName }),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`)
  return JSON.parse(text)
}

export async function deleteAccount(userId: string, email: string) {
  const payload = {
    userId: userId,
    email: email,
  }

  const response = await fetch(`${BASE_URL}/profile/deleteAccount`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  console.log('Data: ', data)

  return data
}

export async function sendContactEmail(payload: {
  name: string
  email: string
  message: string
}) {
  console.log('Calling contact API at:', `${BASE_URL}/profile/sendContactEmail`)

  const res = await fetch(`${BASE_URL}/profile/sendContactEmail`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  let data: any = null
  try {
    data = await res.json()
  } catch {
  }

  if (!res.ok) {
    const message =
      data?.error || data?.message || `Request failed with status ${res.status}`
    throw new Error(message)
  }

  return data
}

export async function getProfilePicture(userId: string) {
  const url =
    `${BASE_URL}/profile/getProfilePicture` +
    `?userId=${encodeURIComponent(userId)}`
  const res = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(text || `HTTP ${res.status}`)
  }
  if (!text) return null
  return `data:image/jpeg;base64,${text}`
}


export type FavoriteMechanicPayload = {
  userId: string;
  mechanicId: string;
  name: string;
  imageId?: string | null;
  ratings: number;   // average rating
  reviews: number;   // number of reviews
};

export async function favoriteMechanic(
  payload: FavoriteMechanicPayload
) {
  if (!BASE_URL) {
    throw new Error("EXPO_PUBLIC_API_URL is not defined");
  }

  const response = await fetch(`${BASE_URL}/profile/favoriteMechanic`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.log("favoriteMechanic: error body", text);

    throw new Error(
      `Failed to create favorite: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}


export interface FavoriteMechanic {
  userId: string;
  mechanicId: string;
  name?: string | null;
  imageId?: string | null;
  ratings?: number;
  reviews?: number;
  createdAt?: string;
}

export async function listFavoriteMechanics(
  userId: string
): Promise<FavoriteMechanic[]> {
  const searchParams = new URLSearchParams();
  searchParams.set("userId", userId);

  const url = `${BASE_URL}/profile/listFavoriteMechanics?${searchParams.toString()}`;

  const res = await fetch(url, {
    method: "GET",
  });

  const text = await res.text();

  if (!res.ok) {
    console.log("listFavoriteMechanics: error body", text);
    throw new Error(
      `Failed to list favorite mechanics: ${res.status} ${res.statusText}`
    );
  }

  if (!text) return [];

  const data = JSON.parse(text);
  return (data.items ?? []) as FavoriteMechanic[];
}



export async function deleteFavoriteMechanic(params: {
  userId: string;
  mechanicId: string;
}): Promise<void> {
  const resp = await fetch(
    `${BASE_URL}/profile/deleteFavoriteMechanic`,
    {
      method: "Delete", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }
  );

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    console.log("unfavoriteMechanic error body", text);
    throw new Error(
      `Failed to unfavorite mechanic: ${resp.status}`
    );
  }
}
