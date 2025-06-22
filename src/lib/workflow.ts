import { Client as QStashClient } from "@upstash/qstash";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = new QStashClient({
  token: process.env.QSTASH_TOKEN!,
});

export const queueEmail = async ({
  email,
  subject,
  html,
}: {
  email: string;
  subject: string;
  html: string;
}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Email would be sent in production:', {
      to: email,
      subject,
      html
    });
    return;
  }

  await client.publishJSON({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/email`,
    body: {
      to: email,
      subject,
      html,
    },
  });
};

