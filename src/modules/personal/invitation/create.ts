import { v4 as uuid } from "uuid";

import { APIGatewayProxyHandler } from "aws-lambda";

import { DynamoDB } from "aws-sdk";
import dynamoDb from "../../../database";
import { verify } from "../../../middlewares/auth_middleware";
import { getByEmail, sendMail } from "../../../shared";

interface Request {
  email: string;
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
    if (!requestData) throw new Error("Invalid data");
    
    const data: Request = JSON.parse(requestData);
    
    await validate(requestData);

    const invitationId = uuid();
    const params = {
      TableName: process.env.INVITATION,
      Item: {
        id: invitationId,
        email: data.email,
        invitationLink: `http://convite/${invitationId}`,
        personalId: user.id,
      },
    };

    await dynamoDb.put(params).promise();
    const message = `
      <p>
      Bem vindo ao Gym Connect, clique 
      <a href="${params.Item.invitationLink}" target="_blank">aqui</a>
      para completar o cadastro
      </p>
    `;

    try {
      sendMail({
        to: data.email,
        from: process.env.MAIL,
        html: message,
        subject: "Convite para Gym-Connect",
      });
    } catch (error) {
      const params: DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: process.env.INVITATION,
        Key: { id: invitationId }
      };

      await dynamoDb.delete(params).promise()

      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          message: "Cannot send invitation link",
          error: error.message,
        }),
      });
      return error;
    }

    callback(null, {
      statusCode: 201,
      body: JSON.stringify({
        invitation: params.Item.invitationLink,
      }),
    });

    return;
  } catch (error) {
    callback(null, {
      statusCode: 400,
      body: error.body || JSON.stringify({
        message: "Cannot create invitation link",
        error: error.message,
      }),
    });
    return error;
  }
};

async function validate(data) {
  const error = "Invalid data on create invitation link";

  if (!data) throw new Error(error);
  data = JSON.parse(data);

  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: process.env.GYMGOER,
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
