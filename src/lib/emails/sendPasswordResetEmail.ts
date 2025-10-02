import { sendEmail } from "./sendEmail";

interface PasswordResetData {
  user: { email: string; name: string };
  url: string;
}

export function sendPasswordResetEmail({ user, url }: PasswordResetData) {
  return sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: `<h1>Reset PAssword</h1><p>Password Reset link: <a href="${url}">${url}</a></p>`,
    text: `Password Reset link: ${url}`,
  });
}
