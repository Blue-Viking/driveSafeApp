import { getDb } from '../../../lib/db'; // adjust path if needed

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { user_id, product_id } = req.body;
  if (!user_id || !product_id) return res.status(400).json({ error: 'Missing fields' });

  const db = await getDb();

  await db.query(
    'INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE quantity = quantity + 1',
    [user_id, product_id]
  );

  res.status(200).json({ message: 'Item added to cart' });
}

