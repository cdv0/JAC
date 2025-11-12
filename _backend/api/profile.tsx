export const BASE_URL = "https://ynwemrq0m2.execute-api.us-west-1.amazonaws.com/dev";

export type UserProfile = {
  firstName: string;   
  lastName: string;
  createdAt: string;   
};

export async function readUserProfile(userId: string, email: string): Promise<UserProfile>{
    const url = `${BASE_URL}/profile/readProfileInfo` +
    `?userId=${encodeURIComponent(userId)}` +
    `&email=${encodeURIComponent(email)}`;
    console.log("[readUserProfile] url:", url);

    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });

    const text = await response.text()
    if (!response.ok) {
        throw new Error(text || `HTTP ${response.status}`);
    }
    return (text ? JSON.parse(text): {}) as UserProfile;
};

export async function updateProfileInfo(userId: string, oldEmail: string, newEmail: string) {
    const res = await fetch(`${BASE_URL}/profile/updateProfileInfo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, oldEmail, newEmail }),
    });
  
    const text = await res.text();
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    return JSON.parse(text);
  }
  
export async function updateName(userId: string, email: string, firstName: string, lastName: string) {
  const res = await fetch(`${BASE_URL}/profile/updateProfileName`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, email, firstName, lastName }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return JSON.parse(text); 
}
