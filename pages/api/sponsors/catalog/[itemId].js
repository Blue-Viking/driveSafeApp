// pages/api/sponsors/catalog/[itemId].js
import db from '../../../../lib/db'; // adjust if your db connection is elsewhere

export default async function handler(req, res) {
  const { itemId } = req.query;

  if (req.method === 'DELETE') {
    if (!itemId) {
      return res.status(400).json({ error: 'Missing product ID' });
    }

    try {
      await db.query('DELETE FROM Catalog_API WHERE product_id = ?', [itemId]);
      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
  } else if (req.method === 'GET') {
    // If needed: logic to fetch single item (optional)
    return res.status(405).json({ error: 'Method not allowed' });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

