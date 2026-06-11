// pages/api/driver-details/[id].js
import db from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;  //user_id

  try {
    // NOTE: backticks around User because it's a reserved word / capitalized name
    const [rows] = await db.query(
      `SELECT sponsor_id AS sponsorId
         FROM \`User\`
        WHERE user_id = ? AND role = ?`,
      [id, 'driver']
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No driver found with that ID.' });
    }

    res.status(200).json({ sponsorId: rows[0].sponsorId });
  } catch (err) {
    console.error('Error fetching driver data:', err);
    res.status(500).json({ message: err.message });
  }
}

