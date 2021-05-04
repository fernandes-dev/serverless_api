import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import dynamoDb from "../../database";
import { verify } from "../../middlewares/auth_middleware";
import { getByEmail } from "../../shared";

interface Request {
  firstName: string;
  lastName: string;
  birthday: string;
  gender: "feminine" | "masculine";
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
    const { email } = await verify(event, process.env.SECRET_PERSONAL);

    const { user } = await getByEmail({
      email,
      table: process.env.PERSONALTRAINER,
    });

    const requestData = event.body;
    if (!requestData) throw new Error("Invalid data params");

    const data: Request = JSON.parse(requestData);

    const isValidData = validate(data);
    if (!isValidData) {
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid data",
        }),
      });
    }

    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.PERSONALTRAINER,
      Key: {
        id: user.id,
      },
      ExpressionAttributeValues: {},
      UpdateExpression: "SET",
    };

    Object.keys(data).forEach((key) => {
      params.ExpressionAttributeValues[`:${key}`] = data[key];
      params.UpdateExpression += ` ${key} = :${key},`;
    });
    params.UpdateExpression = params.UpdateExpression.replace(/,\s*$/, "");

    await dynamoDb.update(params).promise();

    callback(null, {
      statusCode: 200,
      body: "",
    });

    return;
  } catch (error) {
    callback(null, {
      statusCode: 400,
      body:
        error.body ||
        JSON.stringify({
          message: "Error on update personal",
          error: error.message,
        }),
    });
    return error;
  }
};

function validate(data: Request): boolean {
  let valid = true;
  const keys = [
    "firstName",
    "lastName",
    "birthday",
    "gender",
    "hashtag",
    "CREF",
    "CPF",
    "phone",
    "instagram",
    "biographer",
  ];

  Object.keys(data).forEach((key) => {
    if (!keys.includes(key)) valid = false;
  });

  return valid;
}
