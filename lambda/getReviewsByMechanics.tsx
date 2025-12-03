import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "Reviews";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,GET",
};

export const handler = async (event) => {
  const method =
    event.requestContext?.http?.method ||
    event.httpMethod ||
    "GET";

  // Handle OPTIONS preflight request
  if (method === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders };
  }

  if (method !== "GET") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  try {
    const mechanicId = event.queryStringParameters?.mechanicId;

    // No query param provided at all
    if (!mechanicId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Missing mechanicId query parameter" }),
      };
    }

    // For now: full scan + filter in code.
    // Later you can optimize with a GSI on mechanicId.
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      })
    );

    const items = result.Items ?? [];

    const return_results = items.filter(
      (item) =>
        item.mechanicId === mechanicId ||
        item.MechanicId === mechanicId
    );

    if (return_results.length === 0) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          length: 0,
          average: 0,
          reviews: [],
        }),
      };
    }

    const total = return_results.reduce(
      (acc, curr) => acc + Number(curr.rating ?? curr.Rating ?? 0),
      0
    );

    const object = {
      length: return_results.length,
      average: total / return_results.length,
      reviews: return_results,
    };

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(object),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};
