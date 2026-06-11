// pages/api/users/index.js

import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { role, sponsor_id } = req.query;
  const conditions = [];
  const params = [];

  if (role) {
    conditions.push('role = ?');
    params.push(role);
  }
  if (sponsor_id) {
    conditions.push('sponsor_id = ?');
    // make sure it’s an integer
    params.push(parseInt(sponsor_id, 10));
  }

  let sql = `
    SELECT
      user_id,
      username,
      email,
      role,
      sponsor_id
    FROM \`User\`
  `;

  if (conditions.length) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  try {
    const [rows] = await db.execute(sql, params);
    return res.status(200).json(rows);
  } catch (err) {
    console.error('API /api/users GET error:', err);
    return res.status(500).json({ error: 'Database error' });
  }
}

