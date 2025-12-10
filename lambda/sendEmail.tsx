const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({ region: process.env.AWS_REGION || 'us-west-1' });

exports.handler = async (event) => {
  try {
    // Extract email from query parameters
    const email = event.queryStringParameters?.email;
    
    if (!email) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: 'Email address is required in query parameters'
        })
      };
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: 'Invalid email address format'
        })
      };
    }
    
    // Configure email parameters
    const params = {
      Source: process.env.SENDER_EMAIL, // Must be verified in SES
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Subject: {
          Data: 'Claim Confirmation',
          Charset: 'UTF-8'
        },
        Body: {
          Text: {
            Data: 'This is your confirmation that your claim has been sent! Please wait for a response from our team to process your claim.',
            Charset: 'UTF-8'
          },
          Html: {
            Data: `
              <html>
                <body>
                  <h1>Claim Confirmation</h1>
                  <p>This is your confirmation that your claim has been sent! Please wait for a response from our team to process your claim.</p>
                </body>
              </html>
            `,
            Charset: 'UTF-8'
          }
        }
      }
    };
    
    // Send email
    const command = new SendEmailCommand(params);
    const response = await ses.send(command);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Email sent successfully',
        messageId: response.MessageId,
        recipient: email
      })
    };
    
  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Failed to send email',
        error: error.message
      })
    };
  }
};
