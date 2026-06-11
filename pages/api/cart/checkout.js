import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  const db = await getDb();
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    const [cartItems] = await db.query(`
      SELECT c.product_id, c.quantity, p.price_in_points
      FROM carts c
      JOIN Catalog_API p ON c.product_id = p.product_id
      WHERE c.user_id = ?
    `, [user_id]);

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const totalPoints = cartItems.reduce(
      (sum, item) => sum + item.price_in_points * item.quantity, 
      0
    );

    const [[userBalance]] = await db.query(
      'SELECT current_points FROM Points_Balance WHERE user_id = ?', 
      [user_id]
    );
    if (!userBalance) return res.status(404).json({ error: 'User not found in Points_Balance' });

    if (userBalance.current_points < totalPoints) {
      return res.status(400).json({ error: 'Not enough points' });
    }

    const newBalance = userBalance.current_points - totalPoints;

    await db.query(
      'UPDATE Points_Balance SET current_points = ? WHERE user_id = ?', 
      [newBalance, user_id]
    );

    await db.query(`
      INSERT INTO Points_Change 
      (user_id, sponsor_user_id, points_added, reason, change_type, points_before, points_after)
      VALUES (?, NULL, ?, ?, 'deduction', ?, ?)
    `, [
      user_id,
      totalPoints,
      'Reward redemption checkout',
      userBalance.current_points,
      newBalance
    ]);

    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, total_points) VALUES (?, ?)', 
      [user_id, totalPoints]
    );
    const orderId = orderResult.insertId;

    const orderItemsData = cartItems.map(item => [orderId, item.product_id, item.quantity]);
    await db.query(
      'INSERT INTO order_items (order_id, product_id, quantity) VALUES ?', 
      [orderItemsData]
    );

    await db.query('DELETE FROM carts WHERE user_id = ?', [user_id]);

    //success
    await db.query(`
      INSERT INTO audit_logs 
      (user_id, action_type, action_status, action_description, ip_address, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [
      user_id,
      'checkout',
      'success',
      `User checked out with total of ${totalPoints} points for ${cartItems.length} item(s).`,
      ipAddress
    ]);

    res.status(200).json({ message: 'Checkout successful', newBalance });

  } catch (error) {
    console.error('Checkout error:', error);

    //failure
    try {
      await db.query(`
        INSERT INTO audit_logs 
        (user_id, action_type, action_status, action_description, ip_address, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `, [
        user_id,
        'checkout',
        'failure',
        `Checkout failed for user ${user_id}. Error: ${error.message}`,
        ipAddress
      ]);
    } catch (logErr) {
      console.error('Failed to log audit event:', logErr);
    }

    res.status(500).json({ error: 'Checkout failed' });
  }
}
