import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

const s3Client = new S3Client({ region: "us-west-1" });
const BUCKET_NAME = "jac-mechanic-images";
const TABLE_NAME = "Mechanics";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type,x-user-id,authorization",
  "Access-Control-Allow-Methods": "OPTIONS,GET"
};

export const handler = async (event) => {
  // Handle OPTIONS preflight request
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders };
  }

  try {
    // Step 1: Fetch all mechanics from DynamoDB
    const mechanicList = await getMechanics();
    
    if (!mechanicList || !mechanicList.Items || mechanicList.Items.length === 0) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'No mechanics found',
          count: 0,
          data: []
        })
      };
    }

    // Step 2: Fetch images for each mechanic
    const mechanics = await Promise.all(
      mechanicList.Items.map(async (item) => {
        try {
          const imageId = item.ImageId;
          const imageKey = `mechanic-${imageId}/main.jpg`;
          const imageData = await getImageFromS3(imageKey);
          
          return {
            ...item,
            imageKey: imageKey,
            Image: imageData
          };
        } catch (error) {
          console.error(`Error fetching image for mechanic ${item.ImageId}:`, error);
          return {
            ...item,
            Image: null,
            imageError: error.message
          };
        }
      })
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Successfully retrieved mechanics with images',
        count: mechanics.length,
        data: mechanics
      })
    };

  } catch (err) {
    console.error('Handler error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Error retrieving mechanics',
        error: err.message
      })
    };
  }
};

// Fetch all mechanics from DynamoDB
const getMechanics = async () => {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME
      })
    );
    
    console.log(`Fetched ${result.Items?.length || 0} mechanics from DynamoDB`);
    return result;
  } catch (error) {
    console.error('Error fetching mechanics from DynamoDB:', error);
    throw error;
  }
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
    
    // Return as data URL ready to use in img tags
    return `data:image/jpeg;base64,${base64Image}`;
  } catch (error) {
    console.error(`Error fetching image from S3 (${imageKey}):`, error);
    throw error;
  }
};

// Convert stream to buffer for image content
const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};