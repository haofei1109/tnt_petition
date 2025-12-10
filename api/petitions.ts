import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Enable CORS if needed, but Vercel usually handles same-origin for the app.
  
  if (req.method === 'GET') {
    try {
      // Fetch petitions. 
      // Assuming table 'petitions' exists.
      // We map snake_case DB columns to camelCase for the frontend if needed, 
      // or we just assume the frontend can handle it or we alias it here.
      const { rows } = await sql`
        SELECT 
          id, 
          title, 
          description, 
          image_url as "imageUrl", 
          author, 
          created_at as "createdAt" 
        FROM petitions 
        ORDER BY created_at DESC
      `;
      
      // For each petition, we might want to get signatures. 
      // For simplicity/performance, maybe just a count or a separate call.
      // Let's try to get signatures too if the volume is low.
      // Or better, let's just return the petitions and let the frontend fetch signatures or 
      // we do a JOIN/aggregation.
      
      // Let's keep it simple: just petitions for now.
      // The frontend type expects 'signatures: Signature[]'.
      // We can return an empty array or fetch them.
      
      const petitions = await Promise.all(rows.map(async (p) => {
        const { rows: sigs } = await sql`
          SELECT 
            id, 
            first_name as "firstName", 
            last_name as "lastName", 
            email, 
            timestamp 
          FROM signatures 
          WHERE petition_id = ${p.id}
        `;
        return { ...p, signatures: sigs };
      }));

      return res.status(200).json({ petitions });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { id, title, description, imageUrl, author, createdAt } = req.body;
      await sql`
        INSERT INTO petitions (id, title, description, image_url, author, created_at)
        VALUES (${id}, ${title}, ${description}, ${imageUrl}, ${author}, ${createdAt})
      `;
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
