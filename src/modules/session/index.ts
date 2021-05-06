import Aws = require("serverless/aws");

const functions: Aws.Functions = {
  create: {
    handler: "src/modules/session/create.handler",
    events: [
      {
        http: {
          path: "auth",
          method: "post",
        },
      },
    ],
  },
}

export default functions;