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
  try {
    if (process.env.NODE_ENV === 'development') {
      // In development, call the API directly
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Email API error:', error);
        throw new Error(`Email API error: ${response.status}`);
      }

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

