import { v4 as uuid } from "uuid";

import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

module.exports.create = async (event, context) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  //  lembrar de adicionar validação

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid(),
      fistName: "Leonard",
      lastName: "Alexandre",
      birthday: "2016-08-29T09:12:33.001Z",
      gender: "feminine OR masculine",
      height: 1.5,
      weight: 1.5,
      acceptedTerms: true,
      status: "activated OR disabled",
      personalAssociated: "d290f2ee-6c54-4b01-90e6-d701748f0851",
      createdAt: "2016-08-29T09:12:33.001Z",
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      return new Error("Couldn't create the todo item.");
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    return response;
  });
};
