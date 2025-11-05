import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"

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
    const userId = event.queryStringParameters?.userId
    
    if (!userId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "userId is required" })
      }
    }

    const item = await docClient.send(new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "userId = :u",
      ExpressionAttributeValues: {":u": userId },
      ScanIndexForward: false
    }))

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ items: item.Items ?? []}) }
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Get failed", message: error?.message })
    }
  }
}