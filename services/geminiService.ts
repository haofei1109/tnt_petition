// Removed @google/genai import as we now use the backend API
// import { GoogleGenAI } from "@google/genai";

export const generateVeoVideo = async (
  imageFile: File,
  prompt: string,
  aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<string> => {
  // 1. Convert File to Base64
  const base64Image = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  // 2. Start Generation (Call API)
  const startResponse = await fetch('/api/veo/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: base64Image,
      mimeType: imageFile.type,
      prompt,
      aspectRatio
    })
  });

  if (!startResponse.ok) {
    const err = await startResponse.json();
    throw new Error(err.error || 'Failed to start video generation');
  }

  let operation = await startResponse.json();

  // 3. Poll for completion
  console.log("Video generation started...");
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
    console.log("Polling video status...");
    
    const statusResponse = await fetch('/api/veo/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation })
    });
    
    if (!statusResponse.ok) {
       const err = await statusResponse.json();
       throw new Error(err.error || 'Failed to check status');
    }
    
    operation = await statusResponse.json();
  }

  // 4. Retrieve Result
  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) {
    throw new Error("No video URI returned from generation.");
  }

  // 5. Return Proxy URL
  // We encode the URI to pass it safely as a query param
  // This allows the client to fetch the video through our Vercel proxy, bypassing GFW
  return `/api/proxy-video?uri=${encodeURIComponent(videoUri)}`;
};