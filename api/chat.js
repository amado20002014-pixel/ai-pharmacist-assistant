export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { messages, system } = req.body;
    const userMessage = messages[messages.length - 1].content;
    const fullPrompt = system ? `${system}\n\n${userMessage}` : userMessage;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCJNhLrRToCY9xTg0WLEH5AGY4aibw39kc`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        })
      }
    );
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "لم يصل رد.";
    res.status(200).json({ content: [{ text }] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
