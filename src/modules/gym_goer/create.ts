import { v4 as uuid } from "uuid";

import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

module.exports.create = async (event, context) => {
  try {
    const data = JSON.parse(event.body);
    //  adicionar validação
    //  adicionar hash na senha

    const params = {
      TableName: process.env.GYM_GOER,
      Item: {
        id: uuid(),
        firstName: data.firstName,
        lastName: data.lastName,
        birthday: data.birthday,
        gender: data.gender,
        email: data.email,
        password: data.password
      },
    };

    await dynamoDb.put(params).promise();

    return params.Item;
  } catch (error) {
    return error
  }
};
