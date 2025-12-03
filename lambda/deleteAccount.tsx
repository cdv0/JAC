import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({ region: 'us-west-1' })
const docClient = DynamoDBDocumentClient.from(client)

export const handler = async (event) => {
  console.log('Event Details: ', event)

  const userId = event.userId
  const email = event.email
  const vehicleIds = []
  const serviceRecordIds = []
  const reviewIds = []

  //Determine user exists first
  try {
    const command = new GetCommand({
      TableName: process.env.USER_TABLE,
      Key: {
        userId: userId,
        email: email,
      },
    })
    const response = await docClient.send(command)

    if (!response.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify('User not found'),
      }
    }
  } catch (error) {
    console.log('Error: ', error)
  }

  //Query User Vehicles
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: process.env.VEHICLE_TABLE,
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': userId },
        ScanIndexForward: false,
      })
    )

    console.log('Result: ', result)

    result.Items.forEach((item) => {
      vehicleIds.push(item.vehicleId)
    })
  } catch (error) {
    console.log('Error: ', error)
  }

  //Delete User Vehicles
  const vehicle_table = process.env.VEHICLE_TABLE

  try {
    const deleteRequests = vehicleIds.map((vehicleId) => ({
      DeleteRequest: {
        Key: { userId: userId, vehicleId: vehicleId },
      },
    }))

    const command = new BatchWriteCommand({
      RequestItems: {
        vehicle_table: deleteRequests,
      },
    })

    const response = await docClient.send(command)

    console.log('Vehicle Delete Response: ', response)
  } catch (error) {
    console.log('Error: ', error)
  }

  //Query User Records
  for (const vehicleId of vehicleIds) {
    try {
      const result = await docClient.send(
        new QueryCommand({
          TableName: process.env.SERVICE_RECORD_TABLE,
          KeyConditionExpression: 'vehicleId = :v',
          ExpressionAttributeValues: { ':v': vehicleId },
          ScanIndexForward: false,
        })
      )

      result.Items.forEach((item) => {
        serviceRecordIds.push(item.serviceRecordId)
      })

      console.log('Service Records: ', result)
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  //Delete User Records
  const service_records = process.env.SERVICE_RECORD_TABLE

  try {
    const deleteRequests = serviceRecordIds.map((recordId) => ({
      DeleteRequest: {
        Key: { vehicleId: vehicleId, serviceRecordId: recordId },
      },
    }))

    const command = new BatchWriteCommand({
      RequestItems: {
        service_records: deleteRequests,
      },
    })

    const response = await docClient.send(command)

    console.log('Service Record Delete Response: ', response)
  } catch (error) {
    console.log('Error: ', error)
  }

  //Query Reviews
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: process.env.REVIEW_TABLE,
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': userId },
        ScanIndexForward: false,
      })
    )

    result.Items.forEach((item) => {
      reviewIds.push(item.ReviewId)
    })

    console.log('Reviews: ', result)
  } catch (error) {
    console.log('Error: ', error)
  }

  //Delete Reviews
  const reviews = process.env.REVIEW_TABLE
  try {
    const deleteRequests = reviewIds.map((reviewId) => ({
      DeleteRequest: {
        Key: { ReviewId: reviewId, userId: userId },
      },
    }))

    const command = new BatchWriteCommand({
      RequestItems: {
        reviews: deleteRequests,
      },
    })

    const response = await docClient.send(command)

    console.log('Vehicle Delete Response: ', response)
  } catch (error) {
    console.log('Error: ', error)
  }

  //Delete User
  try {
    const command = new DeleteCommand({
      TableName: process.env.USER_TABLE,
      Key: {
        userId: userId,
        email: email,
      },
    })

    const response = await docClient.send(command)
  } catch (error) {
    console.log('Error: ', error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify('User Records Deleted'),
  }
}
