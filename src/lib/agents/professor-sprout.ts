/**
 * Professor Sprout — gardening agent runtime.
 *
 * Requires these env vars (set after running scripts/setup-professor-sprout.ts):
 *   ANTHROPIC_API_KEY
 *   PROFESSOR_SPROUT_AGENT_ID
 *   PROFESSOR_SPROUT_AGENT_VERSION
 *   PROFESSOR_SPROUT_ENVIRONMENT_ID
 */

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const AGENT_ID = process.env.PROFESSOR_SPROUT_AGENT_ID!;
const AGENT_VERSION = process.env.PROFESSOR_SPROUT_AGENT_VERSION
  ? parseInt(process.env.PROFESSOR_SPROUT_AGENT_VERSION, 10)
  : undefined;
const ENVIRONMENT_ID = process.env.PROFESSOR_SPROUT_ENVIRONMENT_ID!;

export interface GardeningResponse {
  text: string;
  sessionId: string;
}

/**
 * Ask Professor Sprout a gardening question.
 * Opens a session, streams the response, and returns the full text.
 */
export async function askProfessorSprout(
  question: string
): Promise<GardeningResponse> {
  const session = await client.beta.sessions.create({
    agent: AGENT_VERSION
      ? { type: "agent", id: AGENT_ID, version: AGENT_VERSION }
      : AGENT_ID,
    environment_id: ENVIRONMENT_ID,
    title: `Gardening question: ${question.slice(0, 60)}`,
  });

  // Open stream before sending the message (stream-first ordering)
  const stream = await client.beta.sessions.events.stream(session.id);

  await client.beta.sessions.events.send(session.id, {
    events: [
      {
        type: "user.message",
        content: [{ type: "text", text: question }],
      },
    ],
  });

  let responseText = "";

  for await (const event of stream) {
    if (event.type === "agent.message") {
      for (const block of event.content) {
        if (block.type === "text") {
          responseText += block.text;
        }
      }
    }

    if (event.type === "session.status_terminated") break;
    if (
      event.type === "session.status_idle" &&
      event.stop_reason?.type !== "requires_action"
    ) break;
  }

  return { text: responseText, sessionId: session.id };
}

/**
 * Start a multi-turn gardening session.
 * Returns a send function and a cleanup function.
 */
export async function startGardeningSession() {
  const session = await client.beta.sessions.create({
    agent: AGENT_VERSION
      ? { type: "agent", id: AGENT_ID, version: AGENT_VERSION }
      : AGENT_ID,
    environment_id: ENVIRONMENT_ID,
    title: "Gardening consultation",
  });

  async function ask(message: string): Promise<string> {
    const stream = await client.beta.sessions.events.stream(session.id);

    await client.beta.sessions.events.send(session.id, {
      events: [
        {
          type: "user.message",
          content: [{ type: "text", text: message }],
        },
      ],
    });

    let text = "";

    for await (const event of stream) {
      if (event.type === "agent.message") {
        for (const block of event.content) {
          if (block.type === "text") {
            text += block.text;
          }
        }
      }

      if (event.type === "session.status_terminated") break;
      if (
        event.type === "session.status_idle" &&
        event.stop_reason?.type !== "requires_action"
      ) break;
    }

    return text;
  }

  async function end() {
    await client.beta.sessions.delete(session.id);
  }

  return { sessionId: session.id, ask, end };
}
