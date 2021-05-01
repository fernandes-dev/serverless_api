import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import dynamoDb from '../../database'

import { verify } from '../../middlewares/auth_middleware';
import { getByEmail } from '../../shared'

export const handler: APIGatewayProxyHandler = async (
  event,
  context,
  callback
) => {
  try {
    const tokenData = await verify(event);
    const { user } = await getByEmail({ email: tokenData.email, table: process.env.GYMGOER });

    const request = event.body;
    const data = JSON.parse(request);

    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.GYMGOER,
      Key: {
        id: user.id,
      },
      ExpressionAttributeNames: {
        '#terms': 'acceptedTerms',
      },
      ExpressionAttributeValues: {
        ':terms': data.accepted,
      },
      UpdateExpression: 'SET #terms = :terms',
    };

    await dynamoDb.update(params).promise();
    
    callback(null, {
      statusCode: 200,
      body: ""
    })
    return;
  } catch (error) {
    callback(null, {
      statusCode: error.statusCode || 400,
      body: error.body || JSON.stringify({
        message: "Cannot accept terms",
        error: error.message,
      }),
    });
    return error;
  }
};
