import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, mimeType, prompt, aspectRatio } = req.body;
    
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || "A cinematic, magical video transformation of this image.", 
      image: {
        imageBytes: image, 
        mimeType: mimeType || 'image/jpeg',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio || '16:9',
      }
    });

    return res.status(200).json(operation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
