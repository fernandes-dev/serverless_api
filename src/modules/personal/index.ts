const functions = {
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
}

export default functions;