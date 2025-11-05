import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({ region: "us-west-1" })
const docClient = DynamoDBDocumentClient.from(client)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type,x-user-id,authorization",
  "Access-Control-Allow-Methods": "OPTIONS,GET"
}

  export const handler = async (event) => {
    if (event.requestContext?.http?.method === "OPTIONS") {
      return { statusCode: 200, headers: corsHeaders }
    }

    try {
        const userId = event.queryStringParameters?.userId;
        const email = event.queryStringParameters?.email;
        if (!userId) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "userId is required" }),
          };
        }

        const item  = await docClient.send(new GetCommand({
              TableName: process.env.TABLE_NAME,
              Key: { userId, email },
            })
          );

        if (!item.Item) {
        return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({ error: "User not found" }),
        };
        }

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(item.Item),
          };
        } catch (error) {
          return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Get failed", message: error?.message }),
          };
        }
      };