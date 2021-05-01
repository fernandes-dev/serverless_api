import Aws = require("serverless/aws");

const InvitationResource = {
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
    TableName: "${self:provider.environment.INVITATION}",
  },
};

const InvitationStatement: Aws.IamRoleStatement =
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
    "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.INVITATION}",
}


const InvitationEnvironment = "Invitation-${opt:stage, self:provider.stage}";

export { InvitationResource, InvitationStatement, InvitationEnvironment };
