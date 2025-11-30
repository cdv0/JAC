export const BASE_URL = "https://7e6tg2ovcc.execute-api.us-west-1.amazonaws.com/dev";

export type Review = {
  reviewId: string;
  userId: string;
  mechanicId: string;
  rating: number;
  review: string;
  createdAt: string;
  mechanicName?: string;
  mechanicAddress?: string;
};


export type Mechanic = {
  mechanicId: string;
  name: string;
  address?: string;
  imageUri?: string;
};

export type UpdatedReview = {
  reviewId: string;
  userId: string;
  mechanicId: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt?: string;
};

async function handleJsonResponse(res: Response) {
  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    console.warn("Failed to parse JSON response:", e, text);
  }

  if (!res.ok) {
    const msg =
      data?.message ||
      `Request failed with status ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data;
}

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

export async function getReviewsByUser(userId: string) {
  const url = `${BASE_URL}/reviews/getReviewsByUser?userId=${userId}`;

  const response = await fetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error("Failed to fetch reviews by user");
  }

  return await response.json();
}


export async function getSingleReview(
  userId: string,
  reviewId: string
): Promise<Review> {
  const url = `${BASE_URL}/reviews/getSingleReview?userId=${encodeURIComponent(
    userId
  )}&reviewId=${encodeURIComponent(reviewId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await handleJsonResponse(res);

  const r = data.review ?? data; 

  return {
    reviewId: r.ReviewId,
    userId: r.UserId,
    mechanicId: r.MechanicId,
    rating: Number(r.Rating),
    review: r.Review,
    createdAt: r.CreatedAt,
  };
}


export async function getSingleMechanic(
  mechanicId: string
): Promise<Mechanic> {
  const url = `${BASE_URL}/reviews/getSingleMechanic?mechanicId=${encodeURIComponent(
    mechanicId
  )}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await handleJsonResponse(res);

  return data.mechanic;
}

export async function updateReview(
  reviewId: string,
  userId: string,
  rating: number,
  review: string
): Promise<UpdatedReview> {
  const url = `${BASE_URL}/reviews/updateReview`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reviewId,
      rating,
      review,
      userId, 
    }),
  });

  const data = await handleJsonResponse(res);
  const r = data.review ?? data;

  return {
    reviewId: r.ReviewId ?? r.reviewId,
    userId: r.userId ?? r.UserId,
    mechanicId: r.mechanicId ?? r.MechanicId,
    rating: Number(r.rating ?? r.Rating),
    review: r.review ?? r.Review,
    createdAt: r.CreatedAt ?? r.createdAt,
  };
}

export async function deleteReview(userId: string, ReviewId: string) {
  const res = await fetch(`${BASE_URL}/reviews/deleteReview`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ReviewId: ReviewId,  // PK
      userId: userId       // SK (lowercase, matches lambda)
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Failed to delete review: " + err);
  }

  return true;
}
