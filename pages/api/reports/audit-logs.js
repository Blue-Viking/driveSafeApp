import { getDb } from '../../../lib/db.js'; // adjust path as needed

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const db = await getDb();
    const [rows] = await db.execute('SELECT * FROM audit_logs ORDER BY created_at DESC');

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Failed to fetch audit logs:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message,
    });
  }
}