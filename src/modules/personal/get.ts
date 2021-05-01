import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";

import dynamoDb from '../../database'

import { verify } from '../../middlewares/auth_middleware';

export const handler: APIGatewayProxyHandler = async (
  event,
  context,
  callback
) => {
  try {
    await verify(event);

    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: process.env.PERSONALTRAINER,
      AttributesToGet: [
        "id",
        "fistName",
        "lastName",
        "birthday",
        "gender",
        "email",
        "hashtag",
        "CREF",
        "CPF",
        "phone",
        "instagram",
        "biographer",
        "createdAt",
      ],
    };

    const result = await dynamoDb.scan(params).promise();

    callback(null, {
      statusCode: 201,
      body: JSON.stringify({
        personal: result.Items,
      }),
    });

    return;
  } catch (error) {
    callback(null, {
      statusCode: error.statusCode || 500,
      body: error.body || JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    });
    return error;
  }
};
