import { fetchAuthSession } from "aws-amplify/auth";
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

export async function updateUserInfo(newEmail: string) {

    const { tokens } = await fetchAuthSession();
    const idToken = tokens?.idToken?.toString();
    if (!idToken) throw new Error("No ID token; user not signed in");
  
    
    const res = await fetch(`${BASE_URL}/profile/change-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ newEmail }),
    });
  
    const text = await res.text();
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);

    return JSON.parse(text);
  }
