import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { user_id, product_id } = req.body;
  if (!user_id || !product_id) return res.status(400).json({ error: 'Missing fields' });

  const db = await getDb();

  await db.query(
    'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
    [user_id, product_id]
  );

  res.status(200).json({ message: 'Item removed from wishlist' });
}

