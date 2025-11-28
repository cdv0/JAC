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

    if(event.queryStringParameters || event.queryStringParameters.mechanicId){
      const result = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME
      }));
      const return_results = result.Items.filter((item) => item.mechanicId === event.queryStringParameters.mechanicId);
      const object = {
        length : return_results.length,
        average : return_results.reduce((acc, curr) => acc + curr.rating, 0) / return_results.length,
        reviews: return_results
      }
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(object)
      }
    }
    else{
      return{
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({message: "No reviews found"})
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