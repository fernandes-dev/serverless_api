import Aws = require("serverless/aws");

const functions: Aws.Functions = {
  create_gymgoer: {
    handler: "src/modules/gym_goer/create.handler",
    events: [
      {
        http: {
          path: "gymgoer",
          method: "post",
          cors: true,
        },
      },
    ],
  },
  get_gymgoer: {
    handler: "src/modules/gym_goer/get.handler",
    events: [
      {
        http: {
          path: "gymgoer",
          method: "get",
        },
      },
    ],
  },
  accept_terms: {
    handler: "src/modules/gym_goer/terms.handler",
    events: [
      {
        http: {
          path: "gymgoer/terms",
          method: "put"
        }
      }
    ]
  },
  toggle_status: {
    handler: "src/modules/gym_goer/status.handler",
    events: [
      {
        http: {
          path: "gymgoer/{id}/status",
          method: "patch"
        }
      }
    ]
  }
}

export default functions;