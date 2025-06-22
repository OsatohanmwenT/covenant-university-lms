import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // or use 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.SMTP_EMAIL, // e.g., your Gmail
    pass: process.env.SMTP_PASSWORD, // Gmail App Password
  },
});

export const sendEmailNow = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  await transporter.sendMail({
    from: `"CU LMS" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};
