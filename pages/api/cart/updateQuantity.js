import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { user_id, product_id, quantity } = req.body;
  if (!user_id || !product_id || quantity == null) return res.status(400).json({ error: 'Missing fields' });

  const db = await getDb();

  await db.query(
    'UPDATE carts SET quantity = ? WHERE user_id = ? AND product_id = ?',
    [quantity, user_id, product_id]
  );

  res.status(200).json({ message: 'Quantity updated' });
}

