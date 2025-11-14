export const BASE_URL = "https://ynwemrq0m2.execute-api.us-west-1.amazonaws.com/dev";


export async function createReview(
    mechanicId: string,
    userId: string,
    rating: number,
    review: string
  ) {
    const response = await fetch(`${BASE_URL}/reviews/createReview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mechanicId,
        userId,
        rating,
        review,
      }),
    });
  
    if (!response.ok) {
      throw new Error("Failed to create review");
    }
  
    return response.json();
  }