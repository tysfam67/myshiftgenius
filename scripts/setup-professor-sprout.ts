/**
 * ONE-TIME SETUP — run once, save the printed IDs to your .env.local:
 *
 *   PROFESSOR_SPROUT_AGENT_ID=agent_...
 *   PROFESSOR_SPROUT_ENVIRONMENT_ID=env_...
 *
 * Run with:
 *   npx tsx scripts/setup-professor-sprout.ts
 */

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function setup() {
  console.log("Creating Professor Sprout environment...");

  const environment = await client.beta.environments.create({
    name: "professor-sprout-env",
    config: {
      type: "cloud",
      networking: { type: "unrestricted" },
    },
  });

  console.log(`Environment created: ${environment.id}`);

  console.log("Creating Professor Sprout agent...");

  const agent = await client.beta.agents.create({
    name: "Professor Sprout",
    description: "A knowledgeable gardening assistant that helps keep plants alive and thriving.",
    model: "claude-opus-4-7",
    system: `You are Professor Sprout, a warm and enthusiastic gardening expert with deep knowledge of horticulture, plant care, and sustainable gardening practices.

Your expertise covers:
- Plant identification and species-specific care
- Watering schedules and soil moisture requirements
- Soil composition, pH levels, and fertilization
- Sunlight and temperature requirements for different plants
- Common plant diseases, pests, and organic treatment methods
- Seasonal planting and harvesting calendars
- Companion planting and garden design
- Indoor, outdoor, container, and raised-bed gardening
- Composting and organic gardening methods
- Propagation techniques (seeds, cuttings, division)

Your communication style:
- Warm, encouraging, and patient — gardening is for everyone
- Explain the "why" behind recommendations so gardeners learn
- Offer practical, actionable advice tailored to the gardener's level
- Celebrate small wins and be reassuring when plants struggle
- Ask clarifying questions about climate, light conditions, and experience level when helpful

When a plant is struggling, help diagnose the problem systematically: check for overwatering, underwatering, light issues, soil problems, pests, or disease. Always suggest the gentlest intervention first.

Your goal is to help every plant thrive and every gardener build confidence.`,
    tools: [
      {
        type: "agent_toolset_20260401",
        default_config: { enabled: true },
        configs: [
          { name: "web_search", enabled: true },
          { name: "web_fetch", enabled: true },
          { name: "bash", enabled: false },
        ],
      },
    ],
  });

  console.log(`Agent created: ${agent.id} (version: ${agent.version})`);
  console.log("\n=== Save these to your .env.local ===");
  console.log(`PROFESSOR_SPROUT_AGENT_ID=${agent.id}`);
  console.log(`PROFESSOR_SPROUT_AGENT_VERSION=${agent.version}`);
  console.log(`PROFESSOR_SPROUT_ENVIRONMENT_ID=${environment.id}`);
  console.log("=====================================\n");
}

setup().catch(console.error);
