import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Init
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// 🧠 Create chat instance (you can later make it session-based)
const chat = model.startChat({
  history: [],
  generationConfig: {
    temperature: 0.7,
    topK: 1,
    topP: 1,
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
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await chat.sendMessage(prompt); // 🧠 send as chat message
    const response = await result.response;
    const text = await response.text();

    res.json({ text });
  } catch (err) {
    console.error('❌ Error from Gemini API:', err.message || err);
    res.status(500).json({ error: 'Failed to get response from Gemini API' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Chat server running on port ${PORT}`);
});
