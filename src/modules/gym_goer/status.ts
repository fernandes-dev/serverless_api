import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import dynamoDb from '../../database'

import { verify } from '../../middlewares/auth_middleware';

export const handler: APIGatewayProxyHandler = async (
  event,
  context,
  callback
) => {
  try {
    await verify(event, process.env.SECRET_PERSONAL);
    // const { user } = await getByEmail({ email: tokenData.email, table: process.env.PERSONALTRAINER });

    const request = event.body;
    const { status } = JSON.parse(request);

    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.GYMGOER,
      Key: {
        id: event.pathParameters.id,
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
      },
      UpdateExpression: 'SET #status = :status',
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
        message: "Cannot toggle status",
        error: error.message,
      }),
    });
    return error;
  }
};
