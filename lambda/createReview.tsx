import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type,x-user-id,authorization",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

const TABLE_NAME = process.env.TABLE_NAME || "Reviews";

function generateId() {
  return crypto.randomUUID();  
}


export const handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({}),
      };
    }

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { mechanicId, userId, rating, review } = body;

    if (!mechanicId || !userId || rating === undefined || !review) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "Missing required fields: mechanicId, userId, rating, review",
        }),
      };
    }

    const reviewId = generateId();
    const timestamp = new Date().toISOString();

    await ddb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          ReviewId: reviewId, 
          mechanicId,
          userId,
          rating,
          review,
          createdAt: timestamp,
        },
      })
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Review created successfully",
        reviewId,
      }),
    };
  } catch (err) {
    console.error("Error creating review:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: err.message,
      }),
    };
  }
};
