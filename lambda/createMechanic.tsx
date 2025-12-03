import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import * as DocClient from 'aws-sdk/lib/dynamodb/document_client';
const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({region : "us-west-1"}));

const corsHeaders = {
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
};

export const handler = async (event) => {
  try{
    const body = JSON.parse(event.body);
    const {mechanicName, mechanicEmail, mechanicPhone} = body
    const mechanicUserId = crypto.randomUUID();
    const now = new Date().toISOString();

    await docClient.send(new PutCommand({
        TableName: "mechanicUser",
        Item: {
            mechanicUserId,
            mechanicName,
            mechanicEmail,
            mechanicPhone,
            createdAt: now,
            mechanicId : ""
        }
    }
  )
)
return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({message: "Mechanic created successfully"})
};
  } catch (error){
    console.log(error);
    return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({message: "Internal Server Error"})
    };

  }
};