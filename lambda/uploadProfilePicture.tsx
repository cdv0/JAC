import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const s3 = new S3Client({ region: "us-west-1" });
const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
};

const BUCKET_NAME = process.env.BUCKET_NAME;
const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
  // Handle OPTIONS / preflight
  if (
    event.requestContext?.http?.method === "OPTIONS" ||
    event.httpMethod === "OPTIONS"
  ) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "OK" }),
    };
  }

  try {
    if (!BUCKET_NAME || !TABLE_NAME) {
      throw new Error("BUCKET_NAME or TABLE_NAME env var is not set");
    }

    const body = JSON.parse(event.body || "{}");
    const { fileName, fileContent, contentType, userId, email } = body;

    if (!fileName || !fileContent || !contentType || !userId || !email) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Missing required fields: fileName, fileContent, contentType, userId, email",
        }),
      };
    }

    const fileBuffer = Buffer.from(fileContent, "base64");

    const putParams = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    };

    await s3.send(new PutObjectCommand(putParams));

    const updateParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: userId,
        email: email,
      },
      UpdateExpression: "SET profileImageKey = :k",
      ExpressionAttributeValues: {
        ":k": fileName,
      },
      ReturnValues: "UPDATED_NEW",
    };

    const updateResult = await docClient.send(new UpdateCommand(updateParams));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Upload success",
        key: fileName,
        updated: updateResult.Attributes,
      }),
    };
  } catch (err) {
    console.error("Upload error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Upload failed",
        error: err.message ?? "Unknown error",
      }),
    };
  }
};