/**
 * Outbound SMS utility — lets Professor Sprout text Morgan proactively.
 *
 * Usage:
 *   import { textMorgan } from "@/lib/agents/sms";
 *   await textMorgan("🌱 Good morning Morgan! Don't forget to water your basil today.");
 */

import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const MORGAN_PHONE = process.env.MORGAN_PHONE_NUMBER ?? "+18018889879";
const PROFESSOR_SPROUT_PHONE = process.env.TWILIO_PHONE_NUMBER!;

export async function textMorgan(message: string): Promise<void> {
  await client.messages.create({
    to: MORGAN_PHONE,
    from: PROFESSOR_SPROUT_PHONE,
    body: message,
  });
}
