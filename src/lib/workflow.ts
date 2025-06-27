import { Client as QStashClient } from "@upstash/qstash";
import { sendEmailNow } from "./mail";

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
  try {
    if (process.env.NODE_ENV === 'development') {
      // In development, send email directly without QStash
      console.log('📧 Sending email directly in development mode to:', email);
      await sendEmailNow({
        to: email,
        subject,
        html,
      });
      console.log('📧 Email sent successfully in development mode');
      return;
    }

    // In production, use QStash
    console.log('📧 Queueing email via QStash to:', process.env.NEXT_PUBLIC_APP_URL);
    
    const result = await client.publishJSON({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/email`,
      body: {
        to: email,
        subject,
        html,
      },
    });
    
    console.log('📧 QStash response:', result);
    console.log('📧 Email queued successfully in production mode');
  } catch (error) {
    console.error('Failed to queue email:', error);
    throw error;
  }
};

