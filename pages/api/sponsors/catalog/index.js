import db from '../../../../lib/db';

export default async function handler(req, res) {
  const sponsorId = req.query.sponsorId;

  console.log('Sponsor ID from query:', sponsorId); // DEBUG

  if (!sponsorId) {
    return res.status(400).json({ error: 'Missing sponsor ID' });
  }

  if (req.method === 'GET') {
    try {
      const [products] = await db.query('SELECT * FROM Catalog_API WHERE sponsor_id = ?', [sponsorId]);
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching sponsor catalog:', error);
      res.status(500).json({ error: 'Server error fetching catalog' });
    }
  } else if (req.method === 'POST') {
    const { name, price_in_points, image_url } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Missing product name' });
    }

    try {
      await db.query(
        'INSERT INTO Catalog_API (sponsor_id, name, price_in_points, availability, image_url, api_source, last_updated) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [sponsorId, name, price_in_points, 1, image_url, 'manual']
      );
      res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
      console.error('Error adding sponsor catalog item:', error);
      res.status(500).json({ error: 'Failed to add product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

