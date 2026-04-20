/**
 * Twilio webhook — receives SMS from Morgan, replies via Professor Sprout.
 *
 * Required env vars:
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_PHONE_NUMBER   — Professor Sprout's Twilio number, e.g. +18015551234
 *   MORGAN_PHONE_NUMBER   — +18018889879
 *
 * In your Twilio console, set the Messaging webhook URL to:
 *   https://yourdomain.com/api/garden/sms
 */

import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { askProfessorSprout } from "@/lib/agents/professor-sprout";

const MORGAN_PHONE = process.env.MORGAN_PHONE_NUMBER ?? "+18018889879";

function twiml(message: string): NextResponse {
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`;
  return new NextResponse(xml, {
    headers: { "Content-Type": "text/xml" },
  });
}

export async function POST(req: NextRequest) {
  // Validate the request came from Twilio
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (accountSid && authToken) {
    const signature = req.headers.get("x-twilio-signature") ?? "";
    const url = req.url;
    const body = Object.fromEntries(await req.clone().formData());
    const params: Record<string, string> = {};
    for (const [k, v] of Object.entries(body)) {
      params[k] = String(v);
    }
    const valid = twilio.validateRequest(authToken, signature, url, params);
    if (!valid) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  const form = await req.formData();
  const from = String(form.get("From") ?? "");
  const messageBody = String(form.get("Body") ?? "").trim();

  // Only respond to Morgan
  if (from !== MORGAN_PHONE) {
    return twiml("Sorry, this number is for Morgan only.");
  }

  if (!messageBody) {
    return twiml("Hi Morgan! Text me your gardening question and I'll help. 🌱");
  }

  try {
    const { text } = await askProfessorSprout(messageBody);
    // Twilio SMS has a 1600-char limit; truncate gracefully if needed
    const reply = text.length > 1550 ? text.slice(0, 1547) + "…" : text;
    return twiml(reply);
  } catch (err) {
    console.error("Professor Sprout error:", err);
    return twiml(
      "Sorry Morgan, I ran into a problem. Try again in a moment! 🌿"
    );
  }
}
