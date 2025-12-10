import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { petitionId, signature } = req.body;
    const { id, firstName, lastName, email, timestamp } = signature;

    await sql`
      INSERT INTO signatures (id, petition_id, first_name, last_name, email, timestamp)
      VALUES (${id}, ${petitionId}, ${firstName}, ${lastName}, ${email}, ${timestamp})
    `;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
