import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const s3 = new S3Client({region: "us-west-1"});
const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { fileName, fileContent, contentType, userId, email } = body; // ← added userId here

    // Decode base64 to binary
    const fileBuffer = Buffer.from(fileContent, "base64");

    const bucketName = process.env.BUCKET_NAME;

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    };

    await s3.send(new PutObjectCommand(params));

    const key = `profile-images/${userId}/${fileName}`;

    const updateParams = {
      TableName: process.env.TABLE_NAME,
      Key: { userId: userId,
             email: email
       },
      UpdateExpression: "SET profileImageKey = :k",
      ExpressionAttributeValues: {
        ":k": key,
      },
    };

    await docClient.send(new UpdateCommand(updateParams));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({message: "Upload success", key: fileName}),
    };
  } catch (err) {
    console.error("Upload error:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Upload failed", error: err.message }),
    };
  }
};