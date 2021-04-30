export const PersonalDynamoDBTable = {
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
    TableName: "${self:provider.environment.PERSONAL}",
  }
}