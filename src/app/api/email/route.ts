import { sendEmailNow } from "@/lib/mail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log('📧 Email API called - Headers:', Object.fromEntries(req.headers.entries()));
    console.log('📧 Email API called - Method:', req.method);
    console.log('📧 Email API called - URL:', req.url);
    console.log('📧 Environment:', process.env.NODE_ENV);
    
    const body = await req.text();
    console.log('📧 Raw body:', body);
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      console.error('📧 JSON parse error:', parseError);
      return NextResponse.json(
        { message: "Invalid JSON body" }, 
        { status: 400 }
      );
    }
    
    const { to, subject, html } = parsedBody;
    
    console.log('📧 Email request body:', { to, subject: subject?.substring(0, 50) + '...', html: html?.substring(0, 100) + '...' });
    
    // Validate required fields
    if (!to || !subject || !html) {
      console.log('📧 Missing required fields:', { to: !!to, subject: !!subject, html: !!html });
      return NextResponse.json(
        { message: "Missing required fields: to, subject, html" }, 
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      console.log('📧 Invalid email format:', to);
      return NextResponse.json(
        { message: "Invalid email address" }, 
        { status: 400 }
      );
    }

    await sendEmailNow({ to, subject, html });
    console.log(`📧 Email sent successfully to: ${to}`);
    
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (err) {
    console.error("📧 Email error:", err);
    return NextResponse.json(
      { message: "Failed to send email", error: err instanceof Error ? err.message : "Unknown error" }, 
      { status: 500 }
    );
  }
}
