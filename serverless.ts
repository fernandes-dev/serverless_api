import { Serverless } from "serverless/aws";

import gymgoer from './src/modules/gym_goer'
import session from './src/modules/session'

export const service: Serverless = {
  service: "gym-connect",
  frameworkVersion: ">=1.1.0 <=2.38.0",
  useDotenv: false,
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    region: "eu-west-2",
    environment: {
      GYM_GOER: "${self:service}-${opt:stage, self:provider.stage}",
      PERSONAL: "${self:service}-${opt:stage, self:provider.stage}",
    },
    iam: {
      role: {
        statements: [
          {
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
              "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.GYM_GOER}",
          },
          {
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
              "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.PERSONAL}",
          },
        ],
      },
    },
  },
  custom: {
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8000,
        inMemory: true,
        migration: true,
      },
      migration: {
        dir: "src/database/migrations",
      },
    },
  },
  plugins: ["serverless-dynamodb-local", "serverless-offline"],
  functions: {
    ...gymgoer,
    ...session
  },
  resources: {
    Resources: {
      GymGoerDynamoDBTable: {
        Type: "AWS::DynamoDB::Table",
        DeletionPolicy: "Retain",
        Properties: {
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
            {
              AttributeName: "email",
              KeyType: "RANGE",
            },
          ],
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
            {
              AttributeName: "email",
              AttributeType: "S",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          TableName: "${self:provider.environment.GYM_GOER}",
        },
      },
    },
  },
};

module.exports = service;
