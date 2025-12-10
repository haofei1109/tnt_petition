export default async function handler(req, res) {
  const { uri } = req.query;
  if (!uri) return res.status(400).send('Missing URI');

  const apiKey = process.env.GOOGLE_API_KEY;
  // Ensure we handle existing query params correctly
  const separator = uri.includes('?') ? '&' : '?';
  const videoUrl = `${uri}${separator}key=${apiKey}`;

  try {
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error(`Failed to fetch video: ${response.statusText}`);
    
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching video');
  }
}
