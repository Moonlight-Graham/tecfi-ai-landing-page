export async function aiReviewProposal(proposalText) {
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  const prompt = `
You are an AI governance advisor for a crypto project called TECFI. A proposal was submitted by a community member. Analyze the text and return one of the following decisions:

- "Approved" if the proposal is valuable, aligns with TECFI goals, or benefits the community.
- "Rejected" if the proposal is vague, harmful, or off-topic.

Also include a short explanation of why you made that decision.

Proposal:
${proposalText}

Respond ONLY in the following JSON format:
{
  "decision": "Approved or Rejected",
  "reason": "Brief explanation why"
}
`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
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

    const data = await res.json();
    const jsonText = data.choices?.[0]?.message?.content || "";

    const parsed = JSON.parse(jsonText);
    return parsed;
  } catch (err) {
    console.error("OpenAI Review Error:", err);
    return {
      decision: "Rejected",
      reason: "AI evaluation failed. Please try again later.",
    };
  }
}

