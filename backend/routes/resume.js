import express from "express";
import multer from "multer";
import axios from "axios";
import pdfParse from "pdf-parse-new";

const router = express.Router();
const upload = multer();

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    console.log("Resume route hit");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No resume uploaded",
      });
    }

    // ✅ Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text.slice(0, 3000);

    // ✅ AI Prompt
  const prompt = `
Act as a senior technical recruiter.

Return the analysis in this format:

## Overall Rating out of 100
## do not mention today's date
## Strengths
## Improvement Areas
## Missing Skills
## ATS Optimization Tips

Keep it professional and concise.

Resume:
${resumeText}
`;


    // ✅ HuggingFace Router (NEW FORMAT)
    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.hugging_face_api}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiFeedback =
      response.data.choices?.[0]?.message?.content ||
      "No feedback generated.";

    res.json({
      success: true,
      feedback: aiFeedback,
    });

  } catch (error) {
    console.error(
      "AI ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      error: "AI analysis failed",
    });
  }
});

export default router;
