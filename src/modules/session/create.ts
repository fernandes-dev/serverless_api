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
    let type = 'Personal';

    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: process.env.PERSONALTRAINER,
      FilterExpression: "#email = :email",
      ExpressionAttributeNames: {
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":email": data.email
      }
    };

    let result = await dynamoDb.scan(params).promise();
    let [user] = result.Items

    if (!user) {
      params.TableName = process.env.GYMGOER;
      type = 'GymGoer';

      result = await dynamoDb.scan(params).promise();
      [user] = result.Items
      if (!user)
        return callback(null, error);

      if (user.status && user.status !== 'active')
        return callback(null, {
          statusCode: 401,
          body: JSON.stringify({
            message: 'User is not active'
          })
        });
    }

    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) return callback(null, error);

    const secret = type === 'Personal' ? process.env.SECRET_PERSONAL : process.env.SECRET;
    const token = jwt.sign({ email: user.email }, secret, { expiresIn: '1 day' })

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        type,
        token,
        user: user
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
