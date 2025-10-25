export const BASE_URL = "https://ynwemrq0m2.execute-api.us-west-1.amazonaws.com/dev";

export type UserProfile = {
  firstName: string;   
  lastName: string;
  createdAt: string;   
};

export async function readUserProfile(userId: string, email: string): Promise<UserProfile>{
    const url = `${BASE_URL}/readProfileInfo` +
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
    /*
    console.log("[readUserProfile] status:", response.status);
    console.log("[readUserProfile] raw text:", text);
    */


    /*let parsed: any = {};
    try { parsed = text ? JSON.parse(text) : {}; } catch {}

    //const parsed = text ? JSON.parse(text) :{};
    const payload =
        parsed && typeof parsed === "object" && "body" in parsed
            ? (typeof parsed.body === "string" ? JSON.parse(parsed.body) : parsed.body)
            : parsed;

    const src = payload?.item ?? payload?.data ?? payload ?? {};

    return src as UserProfile;*/

    //console.log("[readUserProfile] payload:", payload);
    //return (payload || {}) as UserProfile;
}
