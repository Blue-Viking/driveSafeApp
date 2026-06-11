import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  const db = await getDb();

  const [items] = await db.query(`
    SELECT p.product_id, p.name, p.price_in_points, p.image_url
    FROM wishlist w
    JOIN Catalog_API p ON w.product_id = p.product_id
    WHERE w.user_id = ?
  `, [user_id]);

  res.status(200).json(items);
}

