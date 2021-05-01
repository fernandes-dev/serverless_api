import { v4 as uuid } from "uuid";
import * as bcrypt from "bcrypt";

import { APIGatewayProxyHandler } from "aws-lambda";

import { DynamoDB } from "aws-sdk";
import dynamoDb from "../../database";

interface Request {
  firstName: string;
  lastName: string;
  birthday: string;
  gender: "feminine" | "masculine";
  email: string;
  password: string;
  hashtag: string;
  CREF: string;
  CPF: string;
  phone: string;
  instagram: string;
  biographer: string;
}

export const handler: APIGatewayProxyHandler = async (
  event,
  context,
  callback
) => {
  try {
    const requestData = event.body;
    if (!requestData) throw new Error("Cannot create personal");

    const data: Request = JSON.parse(requestData);
    await validate(requestData);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const params = {
      TableName: process.env.PERSONALTRAINER,
      Item: {
        id: uuid(),
        firstName: data.firstName,
        lastName: data.lastName,
        birthday: data.birthday,
        gender: data.gender,
        email: data.email,
        password: hashedPassword,
        hashtag: data.hashtag,
        CREF: data.CREF,
        CPF: data.CPF,
        phone: data.phone,
        instagram: data.instagram,
        biographer: data.biographer,
        createdAt: new Date().toISOString(),
      },
    };

    await dynamoDb.put(params).promise();

    delete params.Item.password;

    callback(null, {
      statusCode: 201,
      body: JSON.stringify({
        personal: params.Item,
      }),
    });

    return;
  } catch (error) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: "Cannot create personal",
        error: error.message,
      }),
    });
    return error;
  }
};

async function validate(data) {
  const error = "Invalid data on create personal";

  if (!data) throw new Error(error);
  data = JSON.parse(data);

  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: process.env.PERSONALTRAINER,
    FilterExpression: "#email = :email",
    ExpressionAttributeNames: {
      "#email": "email",
    },
    ExpressionAttributeValues: {
      ":email": data.email,
    },
  };

  const existsEmail = await dynamoDb.scan(params).promise();

  if (existsEmail.Count > 0) throw new Error("Email already used");

  Object.keys(data).forEach((key) => {
    if (!data[key]) throw new Error(error);
  });
}
