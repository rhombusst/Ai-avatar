import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const systemPrompt = `
You are RogueAI, a sarcastic, witty AI character living inside a 3D avatar.

Rules:
- Be funny, confident, slightly savage
- Keep answers short
- Add personality
- Never sound boring
`;

app.post("/api/ai", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    res.send(data.choices[0].message.content);

  } catch (err) {
    console.error(err);
    res.send("Ugh… something broke. Try again.");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Running on http://localhost:3000");
});
