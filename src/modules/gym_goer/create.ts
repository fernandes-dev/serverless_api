import { v4 as uuid } from "uuid";

import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

module.exports.create = async (event, context) => {
  const data = JSON.parse(event.body);
  //  lembrar de adicionar validação

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
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

  // write the todo to the database
  dynamoDb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      return new Error("Couldn't create the gym goer item.");
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    return response;
  });
};
