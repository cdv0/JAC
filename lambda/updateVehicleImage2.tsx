import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-west-1" });

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const handler = async (event) => {
  const headers = { 
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS, PUT"
  };

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    const body = JSON.parse(event.body);
    const { fileName, fileContent, type } = body;

    if (!fileName || !fileContent || !type) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    // Decode base64 to binary
    const fileBuffer = Buffer.from(fileContent, "base64");


    const bucketName =
      type === "record"
        ? process.env.RECORDS_BUCKET_NAME
        : process.env.VEHICLES_BUCKET_NAME;

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: "image/jpeg", 
      ContentDisposition: "inline",
    };

    await s3.send(new PutObjectCommand(params));
    //fileBuffer = Buffer.from(fileContent, "base64");
  
  console.log("Original base64 length:", fileContent.length);
  console.log("Buffer size:", fileBuffer.length);
  console.log("First 50 chars of base64:", fileContent.substring(0, 50));
  console.log("Buffer starts with JPG magic bytes:", 
  fileBuffer[0] === 0xFF && fileBuffer[1] === 0xD8);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: "Upload success", 
        key: fileName 
      }),
    };
  } catch (err) {
    console.error("Upload error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Upload failed", error: err.message }),
    };
  }
};