const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  console.log("🔵 User:", userMessage);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const reply = response.text();

    console.log("🟢 Gemini:", reply);
    res.json({ reply });
  } catch (err) {
    console.error("🔴 Gemini Error:", err);
    res.status(500).json({ reply: "Error or no response." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
