// app/api/auth/sign-up/route.ts
import { signUp } from "@/lib/actions/auth";
import { NextRequest, NextResponse } from "next/server";
 // move signUp to lib/auth.ts if not already
import { z } from "zod";

const bodySchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["student", "staff", "admin", "faculty"]),
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const result = await signUp(parsed.data);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
