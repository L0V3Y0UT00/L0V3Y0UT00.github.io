const { default: axios } = require('axios');

module.exports = async (req, res) => {
  // Basic rate limiting
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const rateLimitKey = `rate-limit:${ip}`;
  
  // In a real app, you'd implement proper rate limiting with Redis
  // For now we'll just allow all requests
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful programming assistant. Keep responses concise."
          },
          {
            role: "user",
            content: req.body.message
          }
        ],
        max_tokens: 150
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    res.status(200).json({ 
      reply: response.data.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ error: 'Error processing your request' });
  }
};