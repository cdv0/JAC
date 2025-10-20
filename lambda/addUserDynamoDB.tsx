import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({ region: 'us-west-1' })
const docClient = DynamoDBDocumentClient.from(client)

export const handler = async (event) => {
  console.log('Event Details: ', event)

  const email = event.request.userAttributes.email
  const sub = event.request.userAttributes.sub
  const name = event.request.userAttributes.name
  const firstName = name.split(' ')[0]
  const lastName = name.split(' ')[1]
  const currentDate = new Date().toISOString()

  try {
    const command = new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        userId: sub.toString(),
        email: email.toString(),
        firstName: firstName.toString(),
        lastName: lastName.toString(),
        createdAt: currentDate,
      },
    })

    const result = await docClient.send(command)
    console.log('Item Insert Result:', result)
  } catch (error) {
    console.error('Error inserting item:', error)
    return {
      statusCode: 500,
      body: JSON.stringify('Error inserting item'),
    }
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify('User Created'),
  }
  return event
}
