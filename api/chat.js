export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { messages, system } = req.body;
    const userMessage = messages[messages.length - 1].content;
    const fullPrompt = system ? `${system}\n\n${userMessage}` : userMessage;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBjQXAElE_kXifJ6yJaAs9XmUtufMZJJuA`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
          generationConfig: { maxOutputTokens: 1000 }
        })
      }
    );

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data));
    
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      res.status(200).json({ content: [{ text }] });
    } else {
      res.status(200).json({ content: [{ text: "لم يصل رد من الذكاء الاصطناعي: " + JSON.stringify(data) }] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
