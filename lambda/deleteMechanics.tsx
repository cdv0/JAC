import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  DeleteCommand,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type,x-user-id,authorization",
  "Access-Control-Allow-Methods": "OPTIONS,DELETE",
};

const MECHANIC_TABLE = "Mechanics";

export const handler = async (event) => {
  const userId = event.headers["x-user-id"];
  const mechanicId = event.pathParameters.mechanicId;

  if (!userId) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  try {
    const scanCommand = new ScanCommand({
      TableName: MECHANIC_TABLE,
      FilterExpression: "mechanicId = :mechanicId",
      ExpressionAttributeValues: { ":mechanicId": mechanicId },
    });

    const scanResponse = await docClient.send(scanCommand);

    if (scanResponse.Items.length === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Mechanic not found" }),
      };
    }

    const deleteCommand = new DeleteCommand({
      TableName: MECHANIC_TABLE,
      Key: { mechanicId: mechanicId },
    });

    await docClient.send(deleteCommand);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Mechanic deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting mechanic:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Error deleting mechanic" }),
    };
  }
};