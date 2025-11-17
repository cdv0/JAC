import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

const s3Client = new S3Client({ region: "us-west-1" });
const BUCKET_NAME = "jac-mechanic-images";
const TABLE_NAME = "Mechanics";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type,x-user-id,authorization",
  "Access-Control-Allow-Methods": "OPTIONS,GET",
};

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders };
  }

  try {
    const mechanicId = event.queryStringParameters?.mechanicId;

    if (!mechanicId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Missing mechanicId" }),
      };
    }

    // 1) Get mechanic from DynamoDB by partition key mechanicID
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "mechanicID = :mid",
        ExpressionAttributeValues: {
          ":mid": mechanicId,
        },
        Limit: 1, // take the first matching address
      })
    );

    const item = result.Items?.[0];

    if (!item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Mechanic not found" }),
      };
    }

    // 2) Attach image from S3
    let mechanicWithImage = item;
    try {
      const imageId = item.ImageId ?? mechanicId;
      const imageKey = `mechanic-${imageId}/main.jpg`;
      const imageData = await getImageFromS3(imageKey);

      mechanicWithImage = {
        ...item,
        imageKey,
        Image: imageData, // data URL
      };
    } catch (err) {
      console.error(`Error fetching image for mechanic ${mechanicId}:`, err);
      mechanicWithImage = {
        ...item,
        Image: null,
        imageError: err.message,
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ mechanic: mechanicWithImage }),
    };
  } catch (err) {
    console.error("getMechanic error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Error retrieving mechanic",
        error: err.message,
      }),
    };
  }
};

// Reuse your existing helpers
const getImageFromS3 = async (imageKey) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: imageKey,
  });

  const response = await s3Client.send(command);
  const imageBuffer = await streamToBuffer(response.Body);
  const base64Image = imageBuffer.toString("base64");
  return `data:image/jpeg;base64,${base64Image}`;
};

const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};
