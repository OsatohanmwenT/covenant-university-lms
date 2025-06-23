// app/api/resources/route.ts (Edge or standard)
import { NextResponse } from "next/server";
import { db } from "@/database";
import { resources } from "@/database/schema";
import { and, ilike, or } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const format = searchParams.get("format") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "8");
  const offset = (page - 1) * limit;

  const whereClause = and(
    or(ilike(resources.title, `%${query}%`),ilike(resources.author, `%${query}%`)),
    ilike(resources.format, `%${format}%`)
  );

  const data = await db
    .select()
    .from(resources)
    .where(whereClause)
    .limit(limit)
    .offset(offset);

  const total = await db
    .select({ count: resources.resourceId })
    .from(resources)
    .where(whereClause);

  return NextResponse.json({ data, total: total.length });
}
