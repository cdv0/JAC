import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const TABLE_NAME = process.env.TABLE_NAME;
const BUCKET_NAME = process.env.BUCKET_NAME;

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const s3Client = new S3Client({ region: "us-west-1" });

export const handler = async (event) => {
  const { userId } = event.queryStringParameters || {};

  const corsHeaders = {
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
  };

  if (
    event.requestContext?.http?.method === "OPTIONS" ||
    event.httpMethod === "OPTIONS"
  ) {
    return {
      statusCode: 200,
      headers: corsHeaders
    };
  }

  try {
    if (!TABLE_NAME || !BUCKET_NAME) {
      return {
        statusCode: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Server misconfiguration" })
      };
    }

    if (!userId) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "userId is required" })
      };
    }

    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :pk",
      ExpressionAttributeValues: {
        ":pk": userId
      }
    };

    const command = new QueryCommand(params);
    const response = await docClient.send(command);

    if (!response.Items || response.Items.length === 0) {
      return {
        statusCode: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "User not found" })
      };
    }

    const item = response.Items[0];
    const image_id = item.profileImageKey;

    if (!image_id) {
      return {
        statusCode: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Profile image not found" })
      };
    }

    const s3Key = image_id.startsWith("blob:")
      ? extractS3KeyFromBlobUrl(image_id)
      : image_id;

    let imageData = "";

    try {
      imageData = await getImageFromS3(s3Key);
    } catch {
      try {
        const iosKey = image_id.replace(/\.jpg$/i, ".JPG");
        imageData = await getImageFromS3(iosKey);
      } catch {
        return {
          statusCode: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Profile image not found" })
        };
      }
    }

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "image/jpeg"
      },
      isBase64Encoded: true,
      body: imageData
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message || "Internal server error" })
    };
  }
};

const extractS3KeyFromBlobUrl = (blobUrl) => {
  const match = blobUrl.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
  if (match) {
    return `${match[1]}.jpg`;
  }
  return blobUrl;
};

const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

const getImageFromS3 = async (imageKey) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: imageKey
  });

  const response = await s3Client.send(command);
  const imageBuffer = await streamToBuffer(response.Body);
  const base64Image = imageBuffer.toString("base64");

  return base64Image;
};