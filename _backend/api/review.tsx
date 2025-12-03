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
  Phone: string;
  Hours: string[];
  Review: number;      
  Website: string;
  ImageId: string;
  mechanicID: string;
  address: string;
  lat: number | null;
  lon: number | null;
  Services: string;
  name: string;
  Certified: boolean;
  imageKey?: string | null;
  Image?: string | null;  
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

export type PublicUser = {
  userId: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  totalReviews?: number;
  averageRating?: number; // optional, in case you add it later
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

export async function deleteReview(userId: string, reviewId: string) {
  console.log("[deleteReview] called with", { userId, reviewId });

  const res = await fetch(`${BASE_URL}/reviews/deleteReview`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ReviewId: reviewId, 
      userId: userId,     
    }),
  });

  const text = await res.text();
  console.log("[deleteReview] status:", res.status, "body:", text);

  if (!res.ok) {
    throw new Error("Failed to delete review: " + text);
  }

  return true;
}


export async function getAllMechanics(): Promise<Mechanic[]> {
  const res = await fetch(`${BASE_URL}/mechanics/getMechanics`, {
    method: "GET",
  });

  const raw = await handleJsonResponse(res);

  // Case 1: API Gateway already unwrapped the Lambda body:
  //   raw = { message, count, data: [...] }
  if (raw && Array.isArray(raw.data)) {
    return raw.data as Mechanic[];
  }

  // Case 2: You somehow get { statusCode, body: "<json string>" }
  if (raw && typeof raw.body === "string") {
    try {
      const inner = JSON.parse(raw.body);
      return (inner.data ?? []) as Mechanic[];
    } catch (e) {
      console.warn("Failed to parse inner body from Lambda:", e, raw.body);
    }
  }

  return [];
}

export async function getMechanicById(
  mechanicId: string
): Promise<Mechanic | null> {
  const mechanics = await getAllMechanics();
  const found = mechanics.find(
    (m: any) => m.mechanicID === mechanicId || m.mechanicId === mechanicId
  );
  return (found as Mechanic) ?? null;
}


export async function getReviewsByMechanic(mechanicId: string): Promise<{
  length: number;
  average: number;
  reviews: any[];
}> {
  const res = await fetch(
    `${BASE_URL}/reviews/getReviewsByMechanic?mechanicId=${encodeURIComponent(
      mechanicId
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    console.warn("Failed to parse JSON response (reviews):", e, text);
  }

  if (!res.ok) {
    const msg =
      data?.message ||
      `Request failed with status ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  // Handle both shapes: { length, average, reviews } OR { body: "<string>" }
  if (data && typeof data.body === "string" && data.reviews === undefined) {
    try {
      const inner = JSON.parse(data.body);
      return {
        length: inner.length ?? 0,
        average: inner.average ?? 0,
        reviews: inner.reviews ?? [],
      };
    } catch (e) {
      console.warn("Failed to parse inner reviews body:", e, data.body);
    }
  }

  return {
    length: data.length ?? 0,
    average: data.average ?? 0,
    reviews: data.reviews ?? [],
  };
}

export async function getSingleMechanic(
  mechanicId: string
): Promise<Mechanic | null> {
  return getMechanicById(mechanicId);
}

export async function getUserById(userId: string): Promise<PublicUser> {
  const url = `${BASE_URL}/reviews/getUserById?userId=${encodeURIComponent(
    userId
  )}`;

  // Lambda is GET, no body
  const res = await fetch(url);

  const text = await res.text();

  if (!res.ok) {
    let message = text;
    try {
      const parsed = text ? JSON.parse(text) : {};
      message = parsed.message || message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  // Lambda returns result.Items (array)
  let items: any[] = [];
  try {
    items = text ? JSON.parse(text) : [];
  } catch (e) {
    throw new Error("Invalid JSON returned from getUserById");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("User not found");
  }

  const item = items[0];

  const publicUser: PublicUser = {
    userId: item.userId ?? item.UserId,
    firstName: item.firstName ?? item.FirstName ?? "",
    lastName: item.lastName ?? item.LastName ?? "",
    createdAt: item.createdAt ?? item.CreatedAt ?? undefined,
    totalReviews: item.totalReviews ?? item.TotalReviews ?? 0,
    averageRating: item.averageRating ?? item.AverageRating ?? undefined,
  };

  return publicUser;
}