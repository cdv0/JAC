import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({region: "us-west-1"});

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { fileName, fileContent, contentType } = body;

    // Decode base64 to binary
    const fileBuffer = Buffer.from(fileContent, "base64");

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    };

    await s3.send(new PutObjectCommand(params));

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