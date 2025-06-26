import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// 🧠 Create persistent chat session
const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });
const chat = model.startChat({
  history: [],
  generationConfig: {
    temperature: 0.8,
  },
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // 💬 Send user message to Gemini chat
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const text = await response.text();

    res.json({ text });
  } catch (error) {
    console.error("❌ Gemini API error:", error.message || error);
    res.status(500).json({ error: "Gemini API failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Chat server running on port ${PORT}`);
});
