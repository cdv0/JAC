import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const TABLE_NAME = "ServiceRecord";
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const BUCKET_NAME = "jac-service-records";
const s3Client = new S3Client({ region: "us-west-1" });

export const handler = async (event) => {
  try {
    // Validate input
    const { vehicleId, serviceRecordId } = event.queryStringParameters || {};
    
    if (!vehicleId || !serviceRecordId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "vehicleId and serviceRecordId are required" }),
      };
    }

    // Query DynamoDB
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "vehicleId = :pk and serviceRecordId = :sk",
      ExpressionAttributeValues: {
        ":pk": vehicleId,
        ":sk": serviceRecordId,
      },
    };
    
    const command = new QueryCommand(params);
    const response = await docClient.send(command);
    
    // Check if record exists
    if (!response.Items || response.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Service record not found" }),
      };
    }
    
    const file_list = response.Items[0].files;
    
    if (!file_list || file_list.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ files: [] }),
      };
    }
    
    // Fetch all files in parallel
    const filePromises = file_list.map(async (fileKey) => {
      const params = {
        Bucket: BUCKET_NAME,
        Key: fileKey,
      };
      const command = new GetObjectCommand(params);
      const response = await s3Client.send(command);
      
      const chunks = [];
      for await (const chunk of response.Body) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      
      return {
        key: fileKey,
        data: buffer.toString('base64'), // Convert to base64 for JSON serialization
        contentType: response.ContentType,
        size: buffer.length,
      };
    });
    
    const return_list = await Promise.all(filePromises);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        // Add CORS if needed:
        // 'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ files: return_list }),
    };
    
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Internal server error",
        message: error.message 
      }),
    };
  }
};
