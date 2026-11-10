import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const InquirySchema = z.object({
  senderName: z.string().trim().min(2).max(120),
  senderEmail: z.string().trim().email().max(180),
  companyOrOrg: z.string().trim().max(140).optional().default(""),
  inquiryScope: z
    .enum(["full-time", "contract", "advisory", "general"])
    .default("full-time"),
  timelineOrBudget: z.string().trim().max(140).optional().default(""),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional().default(""),
});

const recentSubmissions = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "local-client";
    const now = Date.now();
    const lastTime = recentSubmissions.get(ip) ?? 0;

    if (now - lastTime < 5000) {
      return NextResponse.json(
        {
          ok: false,
          message: "Rate limit triggered. Please wait a few seconds before sending again.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = InquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid inquiry payload. Please ensure name, valid email, and message (10+ chars) are provided.",
        },
        { status: 400 }
      );
    }

    // Honeypot check
    if (parsed.data.website && parsed.data.website.length > 0) {
      return NextResponse.json({ ok: true, mode: "filtered" }, { status: 200 });
    }

    recentSubmissions.set(ip, now);

    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase.from("contact_messages").insert({
        sender_name: parsed.data.senderName,
        sender_email: parsed.data.senderEmail,
        company_or_org: parsed.data.companyOrOrg || null,
        inquiry_scope: parsed.data.inquiryScope,
        timeline_or_budget: parsed.data.timelineOrBudget || null,
        message: parsed.data.message,
        status: "unread",
      });
    }

    return NextResponse.json(
      {
        ok: true,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Unable to process inquiry payload.",
      },
      { status: 500 }
    );
  }
}

