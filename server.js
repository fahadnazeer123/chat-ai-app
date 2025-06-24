import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// For ES Module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Gemini API Setup
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// ✅ Start chat session (this uses v1beta internally)
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const chat = model.startChat({
  history: [],
  generationConfig: {
    temperature: 0.8,
    maxOutputTokens: 2048,
  },
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/ask', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = await response.text();
    res.json({ text });
  } catch (err) {
    console.error("❌ Gemini API error:", err.message || err);
    res.status(500).json({ error: "Something went wrong with Gemini API." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
