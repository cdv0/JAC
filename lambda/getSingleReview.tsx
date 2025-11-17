import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

const REVIEWS_TABLE = "Reviews";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type,x-user-id,authorization",
  "Access-Control-Allow-Methods": "OPTIONS,GET",
};

export const handler = async (event) => {
  // CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders };
  }

  try {
    const userId =
      event.queryStringParameters?.userId ||
      event.headers?.["x-user-id"] ||
      event.headers?.["X-User-Id"];

    const reviewId = event.queryStringParameters?.reviewId;

    if (!userId || !reviewId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Missing userId or reviewId" }),
      };
    }

    const result = await docClient.send(
      new GetCommand({
        TableName: REVIEWS_TABLE,
        Key: {
          ReviewId: reviewId,
          userId: userId,
        },
      })
    );

    const reviewItem = result.Item;

    if (!reviewItem) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Review not found" }),
      };
    }

    const review = {
      ReviewId: reviewItem.ReviewId,
      UserId: reviewItem.userId, 
      MechanicId: reviewItem.mechanicId,
      Rating: reviewItem.rating,
      Review: reviewItem.review,
      CreatedAt: reviewItem.createdAt,
      MechanicName: reviewItem.MechanicName,
      MechanicAddress: reviewItem.MechanicAddress,
    };

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ review }),
    };
  } catch (err) {
    console.error("getSingleReview error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Error retrieving review",
        error: err.message,
      }),
    };
  }
};
