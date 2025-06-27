import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 Webhook test called');
    console.log('🔍 Headers:', Object.fromEntries(req.headers.entries()));
    console.log('🔍 Method:', req.method);
    console.log('🔍 URL:', req.url);
    
    const body = await req.text();
    console.log('🔍 Raw body:', body);
    
    return NextResponse.json({ 
      message: "Webhook test received successfully",
      headers: Object.fromEntries(req.headers.entries()),
      body: body,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (err) {
    console.error("🔍 Webhook test error:", err);
    return NextResponse.json(
      { message: "Webhook test error", error: err instanceof Error ? err.message : "Unknown error" }, 
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: "Webhook test endpoint is working",
    timestamp: new Date().toISOString()
  });
}
