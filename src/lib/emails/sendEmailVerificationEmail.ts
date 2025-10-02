import { sendEmail } from "./sendEmail";

interface EmailVerificationData {
  user: { email: string; name: string };
  url: string;
}

export function sendEmailVerificationEmail({
  user,
  url,
}: EmailVerificationData) {
  return sendEmail({
    to: user.email,
    subject: "Verify your email address",
    html: `<h1>Verify your email address</h1><p>Password Reset link: <a href="${url}">${url}</a></p>`,
    text: `Email Verification link: ${url}`,
  });
}
