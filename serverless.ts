import { Serverless } from "serverless/aws";

// importação das funções
import gymgoer from './src/modules/gym_goer'
import personal from './src/modules/personal'
import session from './src/modules/session'

// importação dos schemas
import { GymGoerDynamoDBTable } from './src/database/dynamodb_tables/GymGoerDynamoDBTable';
import { PersonalDynamoDBTable } from './src/database/dynamodb_tables/PersonalDynamoDBTable';

export const service: Serverless = {
  service: "gym-connect",
  frameworkVersion: ">=1.1.0 <=2.38.0",
  useDotenv: false,
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    region: "eu-west-2",
    environment: {
      GYM_GOER: "gym_goer-${opt:stage, self:provider.stage}",
      PERSONAL: "personal-${opt:stage, self:provider.stage}",
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
    ...session,
    ...personal
  },
  resources: {
    Resources: {
      GymGoerDynamoDBTable,
      PersonalDynamoDBTable,
    }
  }
}

module.exports = service;
