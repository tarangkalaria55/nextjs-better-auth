"use server";

import "@/env/envConfig";

import nodemailer from "nodemailer";
import { env } from "@/env/server";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: env.EMAIL_SERVER_HOST,
  port: env.EMAIL_SERVER_PORT as unknown as number,
  secure: true,
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  await transporter.verify();

  const info = await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: to,
    subject: subject,
    text: text,
    html: html ? html : "",
  });

  return info;
}
