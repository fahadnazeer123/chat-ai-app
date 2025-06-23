import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log('🔐 Loading Gemini API key...');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log('🤖 Initializing Gemini model...');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  console.log('📩 User message received:', userMessage);

  try {
    const result = await model.generateContent(userMessage);
    const response = result.response.text();
    console.log('✅ Gemini reply:', response);
    res.json({ reply: response });
  } catch (error) {
    console.error('❌ Gemini API error:', error.message);
    res.status(500).json({ reply: 'Error: ' + error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
