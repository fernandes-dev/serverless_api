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

    const table = data.personal ? process.env.PERSONALTRAINER :process.env.GYMGOER;

    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: table,
      FilterExpression: "#email = :email",
      ExpressionAttributeNames: {
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":email": data.email
      }
    };

    const result = await dynamoDb.scan(params).promise();
    const [user] = result.Items

    if (!user) return callback(null, error)

    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) return callback(null, error);

    // verifica qual chave privada usar
    const secret = data.personal ? process.env.SECRET_PERSONAL : process.env.SECRET;
    const token = jwt.sign({ email: user.email }, secret, { expiresIn: '1 day' })

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        // type: 'GymGoer or Personal',
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
