import { APIGatewayProxyEvent } from "aws-lambda";
import * as jwt from "jsonwebtoken";

export const verify = async (event: APIGatewayProxyEvent) => {
  const authHeader = event.headers.Authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) throw new Error("No provided token");

  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET as string, (err: any, user: any) => {
      if (err)
        reject({
          statusCode: 401,
          body: JSON.stringify({
            message: "Invalid jwt token ",
          }),
        });
      else resolve(user);
    });
  });
};
