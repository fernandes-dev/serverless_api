import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";

import dynamoDb from '../../database'

import { verifyAll } from '../../middlewares/auth_middleware';

export const handler: APIGatewayProxyHandler = async (
  event,
  context,
  callback
) => {
  try {
    await verifyAll(event);

    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: process.env.GYMGOER,
      AttributesToGet: [
        "id",
        "email",
        "firstName",
        "lastName",
        "birthday",
        "gender",
        "height",
        "weight",
        "acceptedTerms",
        "status",
        "personalAssociated",
        "createdAt",
      ],
    };

    const result = await dynamoDb.scan(params).promise();

    callback(null, {
      statusCode: 201,
      body: JSON.stringify({
        gymgoer: result.Items,
      }),
    });

    return;
  } catch (error) {
    callback(null, {
      statusCode: error.statusCode || 500,
      body: error.body || JSON.stringify({
        message: error.message,
        error: "Internal server error",
      }),
    });
    return error;
  }
};
