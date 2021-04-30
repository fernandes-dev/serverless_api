require("dotenv");
import * as bcrypt from "bcrypt";

import { APIGatewayProxyHandler } from "aws-lambda";
import * as jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'

import { DynamoDB } from "aws-sdk";
import dynamoDb from "../../database";

dotenv.config();

const error = {
  statusCode: 401,
  body: JSON.stringify({
    message: 'Email or password wrong'
  })
}

export const handler: APIGatewayProxyHandler = async (
  event,
  context,
  callback
) => {
  try {
    const data = JSON.parse(event.body);
    if (!data || !data.password || !data.email) return callback(null, error);

    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: process.env.GYM_GOER,
      FilterExpression: "#email = :email",
      ExpressionAttributeNames: {
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":email": data.email
      }
    };

    const result = await dynamoDb.scan(params).promise();
    const [gymgoer] = result.Items

    if (!gymgoer) return callback(null, error)

    const validPassword = await bcrypt.compare(data.password, gymgoer.password);

    if (!validPassword) return callback(null, error);

    const token = jwt.sign({ email: gymgoer.email }, process.env.SECRET, { expiresIn: '1 day' })

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        type: 'GymGoer',
        token,
        gymGoer: gymgoer
      })
    })
    return;
  } catch (error) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Error on create session',
        error: error.message
      })
    })
    return error;
  }
};
