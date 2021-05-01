import Aws = require("serverless/aws");

const GymGoerResource = {
  Type: "AWS::DynamoDB::Table",
  DeletionPolicy: "Retain",
  Properties: {
    KeySchema: [{
      AttributeName: "id",
      KeyType: "HASH",
    }],
    AttributeDefinitions: [{
      AttributeName: "id",
      AttributeType: "S",
    }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: "${self:provider.environment.GYMGOER}",
  },
};

const GymGoerStatement: Aws.IamRoleStatement =
{
  Effect: 'Allow',
  Action: [
    "dynamodb:Query",
    "dynamodb:Scan",
    "dynamodb:GetItem",
    "dynamodb:PutItem",
    "dynamodb:UpdateItem",
    "dynamodb:DeleteItem",
  ],
  Resource:
    "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.GYMGOER}",
}


const GymGoerEnvironment = "GymGoer-${opt:stage, self:provider.stage}";

export { GymGoerResource, GymGoerStatement, GymGoerEnvironment };
