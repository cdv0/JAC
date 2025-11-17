import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const client = new DynamoDBClient({ region: "us-west-1" });
const doc = DynamoDBDocumentClient.from(client);
const s3 = new S3Client({ region: "us-west-1" });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type,x-user-id,authorization",
  "Access-Control-Allow-Methods": "OPTIONS,PUT",
};

export const handler = async (event) => {
  // Works for both REST (v1) and HTTP API (v2)
  const method =
    event?.requestContext?.http?.method   // HTTP API v2
    || event?.httpMethod                  // REST API v1
    || "";                                // default

  if (method === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders };
  }

  try {
    if (method !== "PUT") {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    // In REST API, body is a string; in HTTP API it can be string too.
    let parsed;
    try { parsed = JSON.parse(event.body); }
    catch {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Invalid JSON body" }),
      };
    }

    const { serviceRecordId, vehicleId, title, serviceDate, mileage, note, removedFiles } = parsed || {};
    if ( !serviceRecordId || !vehicleId || !title || !serviceDate || !mileage || !note ) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    await doc.send(new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { serviceRecordId, vehicleId },
      UpdateExpression:
        "SET title = :title, serviceDate = :serviceDate, mileage = :mileage, note = :note",
      ConditionExpression:
        "attribute_exists(serviceRecordId) AND attribute_exists(vehicleId)",
      ExpressionAttributeValues: {
        ":title": title,
        ":serviceDate": serviceDate,
        ":mileage": mileage,
        ":note": note,
      },
      ReturnValues: "NONE",
    }));

    if (Array.isArray(removedFiles) && removedFiles.length > 0 && process.env.BUCKET_NAME) {
      await Promise.all(
        removedFiles.map((key) =>
          s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.BUCKET_NAME,
              Key: key,
            })
          )
        )
      );
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Service record updated", serviceRecordId }),
    };
  } catch (error) {
    console.error("Error updating service record:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Error updating item" }),
    };
  }
};