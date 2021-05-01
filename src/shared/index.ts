import { DynamoDB } from "aws-sdk";
import dynamoDb from "../database";
import * as nodemailer from "nodemailer";
import SMTPTransport = require("nodemailer/lib/smtp-transport");

interface GetByEmailRequest {
  email: string;
  table: string;
}
interface MailRequest {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const getByEmail = async ({ email, table }: GetByEmailRequest) => {
  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: table,
    FilterExpression: "#email = :email",
    ExpressionAttributeNames: {
      "#email": "email",
    },
    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  const result = await dynamoDb.scan(params).promise();
  const [user] = result.Items;

  return { user };
};

const sendMail = async ({ from, to, subject, html }: MailRequest) => {
  try {
    const options: SMTPTransport.Options = {
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    }

    const transporter = nodemailer.createTransport(options);

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { getByEmail, sendMail };
