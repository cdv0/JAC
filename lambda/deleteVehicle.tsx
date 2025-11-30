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

const VEHICLE_TABLE = process.env.TABLE_NAME;
const SERVICE_RECORD_TABLE = process.env.SERVICE_RECORD_TABLE_NAME;

// Delete all service records for a specific vehicleId
async function deleteServiceRecordsForVehicle(vehicleId) {
  let lastEvaluatedKey = undefined;

  do {
    const result = await docClient.send(
      new ScanCommand({
        TableName: SERVICE_RECORD_TABLE,
        FilterExpression: "vehicleId = :v",
        ExpressionAttributeValues: {
          ":v": vehicleId,
        },
        ExclusiveStartKey: lastEvaluatedKey,
      })
    );

    const items = result.Items || [];

    // Delete each service record one by one
    for (const item of items) {
      await docClient.send(
        new DeleteCommand({
          TableName: SERVICE_RECORD_TABLE,
          Key: {
            vehicleId: item.vehicleId,
            serviceRecordId: item.serviceRecordId,
          },
        })
      );
    }

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { userId, vehicleId } = body;

    // Delete vehicle
    await docClient.send(
      new DeleteCommand({
        TableName: VEHICLE_TABLE,
        Key: {
          userId: userId,
          vehicleId: vehicleId,
        },
      })
    );

    // Delete all service records for this vehicle
    await deleteServiceRecordsForVehicle(vehicleId);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Vehicle and related service records deleted",
        vehicleId,
      }),
    };
  } catch (error) {
    console.error("Error deleting vehicle and service records:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Error deleting vehicle and service records",
      }),
    };
  }
};