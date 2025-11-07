import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE = process.env.TABLE_NAME;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
};

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers: cors };
  }

  // ---- DEBUG LOGS (inside the handler) ----
  try {
    console.log("headers:", JSON.stringify(event.headers || {}, null, 2));
    console.log("isBase64Encoded:", event.isBase64Encoded);
    console.log("raw body (first 200):", (event.body || "").slice(0, 200));
  } catch {}

  // Normalize & parse body (works for both HTTP & REST APIs)
  let bodyText = event.body || "";
  if (event.isBase64Encoded) {
    try { bodyText = Buffer.from(bodyText, "base64").toString("utf8"); } catch {}
  }

  let body = {};
  try {
    body = bodyText ? JSON.parse(bodyText) : {};
  } catch (e) {
    console.error("JSON parse error:", e);
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  console.log("parsed body:", body);

  const { userId, oldEmail, newEmail } = body;

  if (!userId || !oldEmail || !newEmail) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ error: "Missing userId, oldEmail, or newEmail" }),
    };
  }

  try {
    // 1) Read current item
    const current = await docClient.send(
      new GetCommand({
        TableName: TABLE,
        Key: { userId, email: oldEmail },
      })
    );

    if (!current.Item) {
      return {
        statusCode: 404,
        headers: cors,
        body: JSON.stringify({ error: "Profile not found" }),
      };
    }

    // 2) Build new item, preserve createdAt
    const nextItem = { ...current.Item, email: newEmail, createdAt: current.Item.createdAt };

    // 3) Atomic move
    await docClient.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: TABLE,
              Item: nextItem,
              ConditionExpression: "attribute_not_exists(userId) AND attribute_not_exists(email)",
            },
          },
          {
            Delete: {
              TableName: TABLE,
              Key: { userId, email: oldEmail },
              ConditionExpression: "attribute_exists(userId) AND attribute_exists(email)",
            },
          },
        ],
      })
    );

    return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    console.error("DDB error:", {
      name: e?.name,
      message: e?.message,
      table: TABLE,
      region: process.env.AWS_REGION,
    });
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: "Change email failed", message: e?.message }),
    };
  }
};
