import { NextResponse } from "next/server";
import { db } from "@/db";
import { auditHistory } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json([], { status: 200 });
    }

    const results = await db
      .select()
      .from(auditHistory)
      .orderBy(desc(auditHistory.createdAt))
      .limit(10);

    const formatted = results.map((r) => ({
      id: r.id,
      url: r.url,
      status: r.status,
      responseTime: r.responseTime,
      title: r.title,
      metaDescription: r.metaDescription,
      h1Count: r.h1Count,
      missingAltImages: r.missingAltImages,
      wordCount: r.wordCount,
      error: r.error,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

