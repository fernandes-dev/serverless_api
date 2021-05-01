import Aws = require("serverless/aws")

const PersonalTrainerResource = {
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
    TableName: "${self:provider.environment.PERSONALTRAINER}",
  }
}

const PersonalTrainerStatement: Aws.IamRoleStatement = {
  Effect: "Allow",
  Action: [
    "dynamodb:Query",
    "dynamodb:Scan",
    "dynamodb:GetItem",
    "dynamodb:PutItem",
    "dynamodb:UpdateItem",
    "dynamodb:DeleteItem",
  ],
  Resource:
    "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.PERSONALTRAINER}",
}

const PersonalTrainerEnvironment = "PersonalTrainer-${opt:stage, self:provider.stage}"

export { PersonalTrainerResource, PersonalTrainerStatement, PersonalTrainerEnvironment }