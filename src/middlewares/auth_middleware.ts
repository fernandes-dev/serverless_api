import { APIGatewayProxyEvent } from "aws-lambda";
import * as jwt from "jsonwebtoken";

interface Token {
  email: string;
  iat: number;
  exp: number;
}

const verify = async (event: APIGatewayProxyEvent, secret = process.env.SECRET): Promise<Token> => {
  const authHeader = event.headers.Authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) throw new Error("No provided token");

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret as string, (err: any, tokenData: Token) => {
      if (err)
        reject({
          statusCode: 401,
          body: JSON.stringify({
            message: "Invalid jwt token ",
          }),
        });
      else resolve(tokenData);
    });
  });
};

const verifyAll = async (event: APIGatewayProxyEvent): Promise<Token> => {
  const authHeader = event.headers.Authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) throw new Error("No provided token");

  return new Promise((resolve, reject) => {
    // primeiro verifica token de aluno
    jwt.verify(token, process.env.SECRET as string, (err: any, tokenData: Token) => {
      if (err) {
        // caso dê erro no token do aluno, verifica se é do personal
        jwt.verify(token, process.env.SECRET_PERSONAL as string, (err2: any, tokenData2: Token) => {
          if (err2)
            reject({
              statusCode: 401,
              body: JSON.stringify({
                message: "Invalid jwt token ",
              }),
            });
          else resolve(tokenData2);
        })
      }
      else resolve(tokenData);
    });
  });
};

export { verify, verifyAll }
