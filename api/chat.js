// api/chat.js
export default async function handler(req, res) {
    // POSTメソッド以外は拒否
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { prompt } = req.body;
  
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
  
    // Vercelの環境変数からキーを取得
    const apiKey = process.env.GEMINI_API_KEY;
    const model = "gemini-2.5-flash"; // 使用するモデル
  
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key not configured on server' });
    }
  
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error?.message || 'Gemini API Error');
      }
  
      return res.status(200).json(data);
  
    } catch (error) {
      console.error("API Error:", error);
      return res.status(500).json({ error: error.message });
    }
  }