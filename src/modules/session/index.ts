const functions = {
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