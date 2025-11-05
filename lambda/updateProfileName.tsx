import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-west-1" }));
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

  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  const { userId, email, firstName, lastName } = body || {};
  if (!userId || !email) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "Missing userId or email" }) };
  }

  try {
    const resp = await ddb.send(new UpdateCommand({
      TableName: TABLE,
      Key: { userId, email },
      UpdateExpression: "SET #fn = :fn, #ln = :ln, #ua = :ua",
      ExpressionAttributeNames: {
        "#fn": "firstName",
        "#ln": "lastName",
        "#ua": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":fn": firstName ?? null,
        ":ln": lastName ?? null,
        ":ua": new Date().toISOString(),
      },
      ConditionExpression: "attribute_exists(userId) AND attribute_exists(email)",
      ReturnValues: "ALL_NEW",
    }));

    return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true, item: resp.Attributes }) };
  } catch (e) {
    if (e?.name === "ConditionalCheckFailedException") {
      return { statusCode: 404, headers: cors, body: JSON.stringify({ error: "Profile not found" }) };
    }
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: "Update name failed", message: e?.message }) };
  }
};
