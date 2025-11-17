import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-west-1" });
const doc = DynamoDBDocumentClient.from(client);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type,x-user-id,authorization",
  "Access-Control-Allow-Methods": "OPTIONS,PUT",
};

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { 
      statusCode: 200,
      headers: corsHeaders 
    };
  }

  try {
    if (event.requestContext?.http?.method !== "PUT") {
      return {
        statusCode: 405, 
        headers: corsHeaders, 
        body: JSON.stringify({ error: "Method Not Allowed" }) 
      };
    }

    if (!event.body) {
      return { 
        statusCode: 400, 
        headers: corsHeaders, 
        body: JSON.stringify({ error: "Missing request body" }) 
      };
    }

    const { userId, vehicleId, VIN, plateNum, make, model, year } = JSON.parse(event.body);
    if (!userId || !vehicleId || !VIN || !plateNum || !make || !model || !year) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing required fields"}),
      };
    }

    // Update all editable fields; leave createdAt untouched.
    await doc.send(
      new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: { userId, vehicleId },
        UpdateExpression: `
          SET VIN = :vin,
              plateNum = :plate,
              make = :make,
              model = :model,
              #yr = :year
        `,
        ConditionExpression: "attribute_exists(userId) AND attribute_exists(vehicleId)",
        // year is a reserved word. Use alias
        ExpressionAttributeNames: { "#yr": "year" },
        ExpressionAttributeValues: {
          ":vin": VIN,
          ":plate": plateNum,
          ":make": make,
          ":model": model,
          ":year": year,
        },
        ReturnValues: "NONE",
      })
    );

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ message: "Vehicle updated", vehicleId }) };
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return { 
      statusCode: 500, 
      headers: corsHeaders, 
      body: JSON.stringify({ error: "Error updating item" }) 
    };
  }
};