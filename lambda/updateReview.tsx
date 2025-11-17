import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

const REVIEWS_TABLE = "Reviews";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type,x-user-id,authorization",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
};

export const handler = async (event) => {
  const method =
    event.requestContext?.http?.method || 
    event.httpMethod ||                   
    "GET";

  if (method === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders };
  }

  if (method !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};

    const userId =
      body.userId ||
      event.headers?.["x-user-id"] ||
      event.headers?.["X-User-Id"];

    const reviewId = body.reviewId;
    const rating = body.rating;
    const reviewText = body.review;

    if (!userId || !reviewId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Missing userId or reviewId" }),
      };
    }

    if (typeof rating !== "number") {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Invalid rating (must be a number)" }),
      };
    }

    if (!reviewText || typeof reviewText !== "string") {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Missing or invalid review text",
        }),
      };
    }

    const result = await docClient.send(
      new UpdateCommand({
        TableName: REVIEWS_TABLE,
        Key: {
          ReviewId: reviewId,
          userId: userId,
        },
        UpdateExpression: "SET rating = :r, review = :v",
        ExpressionAttributeValues: {
          ":r": rating,
          ":v": reviewText,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    const updated = result.Attributes;

    if (!updated) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Review not found" }),
      };
    }

    const responseReview = {
      ReviewId: updated.ReviewId,
      userId: updated.userId,
      mechanicId: updated.mechanicId,
      rating: updated.rating,
      review: updated.review,
      CreatedAt: updated.CreatedAt,
    };

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Review updated",
        review: responseReview,
      }),
    };
  } catch (err) {
    console.error("updateReview error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Error updating review",
        error: err.message,
      }),
    };
  }
};
