import { DynamoDB } from "aws-sdk";


const dynamoDb = new DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' });

export default dynamoDb;