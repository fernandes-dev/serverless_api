import { Serverless } from "serverless/aws";

// importação das funções
import gymgoer from './src/modules/gym_goer'
import personal from './src/modules/personal'
import session from './src/modules/session'

// importação dos schemas
import { GymGoerEnvironment, GymGoerResource, GymGoerStatement } from './src/database/dynamodb_tables/GymGoer';
import { PersonalTrainerEnvironment, PersonalTrainerResource, PersonalTrainerStatement } from './src/database/dynamodb_tables/PersonalTrainer';

export const service: Serverless = {
  service: "gym-connect",
  frameworkVersion: ">=1.1.0 <=2.38.0",
  useDotenv: false,
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    region: "eu-west-2",
    environment: {
      GYMGOER: GymGoerEnvironment,
      PERSONALTRAINER: PersonalTrainerEnvironment,
    },
    iam: {
      role: {
        statements: [
          GymGoerStatement,
          PersonalTrainerStatement,
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
      GymGoerResource,
      PersonalTrainerResource,
    }
  }
}

module.exports = service;
