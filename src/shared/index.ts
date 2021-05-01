import { DynamoDB } from "aws-sdk";
import dynamoDb from '../database'

interface Request {
  email: string;
  table: string;
}

const getByEmail = async ({ email, table }: Request) => {
  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: table,
    FilterExpression: "#email = :email",
    ExpressionAttributeNames: {
      "#email": "email",
    },
    ExpressionAttributeValues: {
      ":email": email
    }
  };

  const result = await dynamoDb.scan(params).promise();
  const [user] = result.Items

  return { user }
}

export { getByEmail }