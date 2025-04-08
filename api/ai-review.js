import supabase from '..components/supabaseClient';
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { proposalText } = req.body;

  if (!proposalText || proposalText.length < 10) {
    return res.status(400).json({ error: "Invalid proposal text" });
  }

  const prompt = `
You are an AI governance advisor for a crypto project called TECFI.

Analyze the following proposal. Decide whether it should be APPROVED or REJECTED based on these criteria:
- Does it align with TECFI's mission (AI, meme culture, community tools)?
- Does it help the token economy or user engagement?
- Is it clearly written and actionable?

Respond ONLY in this JSON format:
{
  "decision": "Approved" or "Rejected",
  "reason": "Explain in 1–2 sentences why"
}

Proposal:
${proposalText}
`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a DAO proposal evaluator." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      }),
    });

    const data = await openaiRes.json();
    const rawText = data.choices?.[0]?.message?.content || "";

    const jsonResult = JSON.parse(rawText);
    await supabase.from("history_log").insert([
  {
    proposal: proposalText,
    decision: jsonResult.decision,
    reason: jsonResult.reason,
    timestamp: new Date().toISOString(),
  },
]);
	return res.status(200).json(jsonResult);
  } catch (err) {
    console.error("AI Review Error:", err);

	return res.status(500).json({
      decision: "Rejected",
      reason: "AI evaluation failed. Please try again later.",
    });
  }
}
