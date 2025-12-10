import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { operation } = req.body;
    
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    // Check status
    const updatedOperation = await ai.operations.getVideosOperation({ operation });

    return res.status(200).json(updatedOperation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
