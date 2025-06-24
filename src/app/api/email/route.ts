import { sendEmailNow } from "@/lib/mail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json();
    await sendEmailNow({ to, subject, html });
    return NextResponse.json({ message: "Email sent" }, { status: 200 });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}
