import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  const db = await getDb();

  const [cartItems] = await db.query(`
    SELECT 
      c.product_id, 
      c.quantity, 
      p.name, 
      p.price_in_points, 
      p.image_url
    FROM 
      carts c
    JOIN 
      Catalog_API p ON c.product_id = p.product_id
    WHERE 
      c.user_id = ?
  `, [user_id]);

  res.status(200).json(cartItems);
}

