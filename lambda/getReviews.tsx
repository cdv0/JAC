import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";


const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "Reviews";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type,x-user-id,authorization",
  "Access-Control-Allow-Methods": "OPTIONS,GET"
};


export const handler = async(event) =>{
  // Handle OPTIONS preflight request
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders };
  }
  try{
    //Check if event has a id to grab by mechanic

    if(!event.queryStringParameters || !event.queryStringParameters.mechanicId){
      const result = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME
      }));
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.Items)
      }
    }
    else{
      const result = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": event.queryStringParameters.muserId
        }
      }));
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.Items)
      }
    }
  }catch (error){
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }

  
}