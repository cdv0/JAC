import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({ region: "us-west-1" })
const docClient = DynamoDBDocumentClient.from(client)

const corsHeaders = {
"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Headers": "content-type,x-user-id,authorization",
"Access-Control-Allow-Methods": "OPTIONS,POST,GET",
}

export const handler = async (event) => {
if (event.requestContext?.http?.method === "OPTIONS") {
  return {
    statusCode: 200,
    headers: corsHeaders
  }
}

try {
  const body = JSON.parse(event.body)
  const { vehicleId, title, serviceDate, mileage, note } = body

  const serviceRecordId = crypto.randomUUID()
  const now = new Date().toISOString()

  await docClient.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        serviceRecordId,
        vehicleId,
        title,
        serviceDate,
        mileage,
        note,
        createdAt: now,
      }
    })
  )

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: "Service record created", serviceRecordId })
  }
} catch (error) {
  console.error("Error inserting item:", error)
  return {
    statusCode: 500,
    headers: corsHeaders,
    body: JSON.stringify({ error: "Error inserting item" })
  }
}
}