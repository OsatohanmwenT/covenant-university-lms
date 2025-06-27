import { sendEmailNow } from "@/lib/mail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json();
    
    // Validate required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { message: "Missing required fields: to, subject, html" }, 
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { message: "Invalid email address" }, 
        { status: 400 }
      );
    }

    await sendEmailNow({ to, subject, html });
    console.log(`Email sent successfully to: ${to}`);
    
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json(
      { message: "Failed to send email", error: err instanceof Error ? err.message : "Unknown error" }, 
      { status: 500 }
    );
  }
}
