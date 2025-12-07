import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "Mechanic"; // Adjust to your table name
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const { mechanicId } = event.queryStringParameters;
  const updates = JSON.parse(event.body);

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };

  try {
    // Validate mechanicId is provided
    if (!mechanicId) {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({
          error: "mechanicId is required"
        })
      };
    }

    // Validate that there are updates
    if (!updates || Object.keys(updates).length === 0) {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({
          error: "No updates provided"
        })
      };
    }
    //dynamic updates
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updates).forEach((key, index) => {
      updateExpressions.push(`#field${index} = :value${index}`);
      expressionAttributeNames[`#field${index}`] = key;
      expressionAttributeValues[`:value${index}`] = updates[key];
    });

    const params = {
      TableName: TABLE_NAME,
      Key: { 
        mechanicId: mechanicId
      },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: "attribute_exists(mechanicId)", // Ensure item exists
      ReturnValues: "ALL_NEW"
    };

    const command = new UpdateCommand(params);
    const response = await docClient.send(command);

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({
        message: "Mechanic updated successfully",
        data: response.Attributes
      })
    };
  } catch (error) {
    console.error("Error:", error);
    
    // Handle specific DynamoDB errors
    if (error.name === 'ConditionalCheckFailedException') {
      return {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({
          error: "Mechanic not found"
        })
      };
    }

    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};