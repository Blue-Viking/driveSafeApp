// pages/api/driver-applications/[id].js
import db from '../../../lib/db';

export default async function handler(req, res) {
  const appId = parseInt(req.query.id, 10);

  // Only PATCH is supported here
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { status, reason } = req.body;

  // Only allow toggling to accepted or rejected
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const [result] = await db.execute(
      `UPDATE Driver_Application
         SET status = ?, reason = ?
       WHERE id = ?`,
      [status, reason || null, appId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    return res.status(200).json({ updated: true });
  } catch (err) {
    console.error(`[/api/driver-applications/${appId}] PATCH error`, err);
    return res.status(500).json({ error: err.message });
  }
}

