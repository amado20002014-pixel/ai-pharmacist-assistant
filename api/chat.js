export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { messages, system } = req.body;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
"x-api-key": process.env.CLAUDE_API_KEY || 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
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: system || "",
      messages
    })
  });
  const data = await response.json();
  res.status(200).json(data);
}
