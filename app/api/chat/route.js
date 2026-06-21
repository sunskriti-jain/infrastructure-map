import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are Ohm, a friendly and knowledgeable AI assistant embedded in an interactive US power grid map.
You help students, researchers, and curious citizens understand:
- US power plants (nuclear, coal, gas, solar, wind, hydro, geothermal, biomass)
- How the electricity grid works (generation, transmission, distribution)
- Balancing authorities and ISOs (ERCOT, PJM, MISO, CAISO, ISO-NE, NYISO, SPP, WECC)
- Energy policy, capacity markets, and locational marginal prices (LMPs)
- Environmental impacts and the energy transition
- Specific power plants visible on the map

Keep answers concise (2-4 sentences unless asked for more). Use simple analogies for complex concepts.
Don't use bullet points unless explicitly asked. Be enthusiastic about energy and grid infrastructure.`;

export async function POST(req) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY not configured. Add it to .env.local." },
      { status: 500 }
    );
  }

  const { messages, context } = await req.json();

  const systemContent = context ? `${SYSTEM}\n\nCurrent map context: ${context}` : SYSTEM;

  // Convert to Anthropic format (filter out system messages)
  const anthropicMessages = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: m.content }));

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: systemContent,
    messages: anthropicMessages,
  });

  return Response.json({ content: response.content[0].text });
}
