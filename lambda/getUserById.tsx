import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const USER_TABLE = "Users";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type,x-user-id,authorization",
  "Access-Control-Allow-Methods": "OPTIONS,GET",
};

const client = new DynamoDBClient({region: "us-west-1"});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders };
  }

  try{
    if(!event.queryStringParameters?.userId){
      return { statusCode: 400, body: JSON.stringify({ message: "Internal Server Error" }), headers: corsHeaders };
    }else{
      const result = await docClient.send(
        new QueryCommand({
          TableName: USER_TABLE,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": event.queryStringParameters.userId
          }
        })
      );
      return { statusCode: 200, body: JSON.stringify(result.Items), headers: corsHeaders };

    }
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: JSON.stringify({ message: "Internal Server Error"}), headers: corsHeaders };
  }
}