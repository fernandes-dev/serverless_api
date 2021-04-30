const functions = {
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
}

export default functions;