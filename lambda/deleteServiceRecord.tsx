import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({ region: "us-west-1" })
const docClient = DynamoDBDocumentClient.from(client)

const corsHeaders = {
"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Headers": "content-type,x-user-id,authorization",
"Access-Control-Allow-Methods": "OPTIONS,DELETE",
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
  const { serviceRecordId, vehicleId } = body

  await docClient.send(
    new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        serviceRecordId: serviceRecordId,
        vehicleId: vehicleId
      }
      }
    )
  )

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: "Service record deleted", serviceRecordId })
  }
} catch (error) {
  console.error("Error deleting item:", error)
  return {
    statusCode: 500,
    headers: corsHeaders,
    body: JSON.stringify({ error: "Error deleting item" })
  }
}
}