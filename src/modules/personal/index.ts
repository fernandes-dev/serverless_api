import Aws = require("serverless/aws");

const functions: Aws.Functions = {
  create_personal: {
    handler: "src/modules/personal/create.handler",
    events: [
      {
        http: {
          path: "personal",
          method: "post",
          cors: true,
        },
      },
    ],
  },
  update_personal: {
    handler: "src/modules/personal/update.handler",
    events: [
      {
        http: {
          path: "personal/profile",
          method: "put",
          cors: true,
        },
      },
    ],
  },
  get_personal: {
    handler: "src/modules/personal/get.handler",
    events: [
      {
        http: {
          path: "personal",
          method: "get",
        },
      },
    ],
  },
  send_invitation: {
    handler: "src/modules/personal/invitation/create.handler",
    events: [
      {
        http: {
          path: "invite",
          method: "post",
        },
      },
    ],
  },
  get_invitations: {
    handler: "src/modules/personal/invitation/get.handler",
    events: [
      {
        http: {
          path: "invite",
          method: "get",
        },
      },
    ],
  },
}

export default functions;