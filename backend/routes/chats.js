import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, mode, role, difficulty, question, answer } = req.body;

    let messages = [];

    // 🟢 Normal Chat Mode
    if (!mode || mode === "chat") {
      messages = [
        {
          role: "system",
          content:
            "You are a helpful AI assistant for resume and career guidance.and you are also a chatbot if user ask anything else answer it accordingly",
        },
        {
          role: "user",
          content: message,
        },
      ];
    }

    // 🔥 Interview Question Generator Mode
    if (mode === "generate") {
      messages = [
        {
          role: "system",
          content: "You are a technical interviewer.",
        },
        {
          role: "user",
          content: `Generate one ${difficulty} level ${role} interview question. Only return the question.`,
        },
      ];
    }

    // 🔥 Answer Evaluation Mode
   if (mode === "evaluate") {
  messages = [
    {
      role: "system",
      content: `
You are a strict technical interviewer.

Return ONLY plain text.
Do NOT return JSON.
Do NOT return arrays.
Do NOT return objects.
Do NOT use markdown.

Format EXACTLY like this:

Score: X/10

Strengths:
- ...

Weaknesses:
- ...

Ideal Answer:
...

Final Verdict:
...
      `,
    },
    {
      role: "user",
      content: `
Question:
${question}

Candidate Answer:
${answer}
      `,
    },
  ];
}


    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages,
        max_tokens: 800,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.hugging_face_api}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply =
      response.data.choices?.[0]?.message?.content ||
      "No response generated.";

    res.json({
      success: true,
      reply: aiReply,
    });

  } catch (error) {
    console.error("CHAT AI ERROR:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "AI request failed",
    });
  }
});

export default router;
