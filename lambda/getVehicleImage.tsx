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
  const image_id = response.Items[0].vehicleImage

  const image = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: image_id
  });

  const image_response = await s3Client.send(image);
  const imageBuffer = await streamToBuffer(image_response.Body);
  const base64Image = imageBuffer.toString('base64');
  return {
    statusCode: 200,
    body: JSON.stringify(base64Image),
    isBase64Encoded: true,
    headers: {
      "Content-Type": "image/jpeg"
    }
  };
};

const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};