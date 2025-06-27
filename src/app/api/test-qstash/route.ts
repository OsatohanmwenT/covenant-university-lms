import { Client as QStashClient } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";

const client = new QStashClient({
  token: process.env.QSTASH_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    console.log('Testing QStash connection...');
    console.log('QSTASH_TOKEN exists:', !!process.env.QSTASH_TOKEN);
    console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
    
    const result = await client.publishJSON({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/email`,
      body: {
        to: "osarenkhoeosato45@gmail.com",
        subject: "QStash Test Email",
        html: "<h1>QStash Test</h1><p>This email was sent via QStash!</p>",
      },
    });
    
    console.log('QStash publish result:', result);
    
    return NextResponse.json({ 
      success: true, 
      message: "QStash message published successfully",
      result 
    });
  } catch (error) {
    console.error('QStash test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      details: error
    }, { status: 500 });
  }
}
