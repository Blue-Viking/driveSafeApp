import db from './db'; // Using your existing MySQL connection

export async function getCatalogBySponsor(sponsorId) {
  try {
    const [rows] = await db.query('SELECT * FROM Catalog_API WHERE sponsor_id = ?', [sponsorId]);
    return rows;
  } catch (error) {
    console.error('Error fetching catalog:', error);
    throw error;
  }
}

export async function addItemToCatalog(sponsorId, item) {
  try {
    await db.query(
      'INSERT INTO Catalog_API (sponsor_id, name, price_in_points, availability, image_url, api_source, last_updated) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [
        sponsorId,
        item.title,
        item.price,
        1, // Availability default 1
        item.imageUrl,
        'manual'
      ]
    );
  } catch (error) {
    console.error('Error adding item to catalog:', error);
    throw error;
  }
}

export async function removeItemFromCatalog(sponsorId, itemId) {
  try {
    await db.query(
      'DELETE FROM Catalog_API WHERE sponsor_id = ? AND product_id = ?',
      [sponsorId, itemId]
    );
  } catch (error) {
    console.error('Error removing item from catalog:', error);
    throw error;
  }
}

