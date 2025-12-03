import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const TABLE_NAME = "Vehicle";
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const BUCKET_NAME = "jac-vehicle-image";
const s3Client = new S3Client({ region: "us-west-1" });

export const handler = async (event) => {
  const {userId, vehicleId } = event.queryStringParameters;

  const headers = {
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
    "Content-Type": "application/json"
  };

  try {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :pk and vehicleId = :sk",
      ExpressionAttributeValues: {
        ":pk": userId,
        ":sk": vehicleId
      }
    };
    
    const command = new QueryCommand(params);
    const response = await docClient.send(command);
    
    if (!response.Items || response.Items.length === 0) {
      return {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({
          error: "Vehicle not found"
        }),
      };
    }

    const image_id = response.Items[0].vehicleImage;
    const image = await getImageFromS3(image_id);

    return {
      statusCode: 200,
      headers: headers,
      isBase64Encoded: true, // Important for binary data
      body: image // Return base64 string directly, not wrapped in JSON
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({
        error: err.message || "Internal server error"
      }),
    };
  }
};

const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

// Fetch image from S3 and return as base64
const getImageFromS3 = async (imageKey) => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: imageKey
    });
    
    const response = await s3Client.send(command);
    const imageBuffer = await streamToBuffer(response.Body);
    const base64Image = imageBuffer.toString('base64');
    
    return base64Image;
  } catch (error) {
    console.error(`Error fetching image from S3 (${imageKey}):`, error);
    throw error; // Throw the error so it can be caught by the main handler
  }
};