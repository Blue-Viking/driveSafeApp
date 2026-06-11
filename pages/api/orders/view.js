import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  const db = await getDb();

  // Fetch orders
  const [orders] = await db.query(`
    SELECT order_id, total_points, created_at
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
  `, [user_id]);

  const fullOrders = [];

  for (const order of orders) {
    // Fetch items for each order
    const [items] = await db.query(`
      SELECT p.name
      FROM order_items oi
      JOIN Catalog_API p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?
    `, [order.order_id]);

    fullOrders.push({
      order_id: order.order_id,
      date: new Date(order.created_at).toLocaleDateString(),
      time: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      total_points: order.total_points,
      items: items.map(item => item.name),
    });
  }

  res.status(200).json(fullOrders);
}

