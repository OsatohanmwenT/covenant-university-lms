import { sendEmailNow } from "@/lib/mail";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { to, subject, html } = req.body;

  try {
    await sendEmailNow({ to, subject, html });
    return res.status(200).json({ message: "Email sent" });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ message: "Failed to send email" });
  }
}
