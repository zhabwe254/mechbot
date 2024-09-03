const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Chatbot API Route
app.post('/api/chatbot', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post('http://127.0.0.1:5000/api/chatbot', {
      message: message,
    });

    return res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(4000, () => {
  console.log('Node.js API running on port 4000');
});
