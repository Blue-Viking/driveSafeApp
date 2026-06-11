import { getCatalogBySponsor, addItemToCatalog, removeItemFromCatalog } from '../../../lib/catalogService'; // adjust if needed

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET': {
      const { sponsorId } = req.query;
      if (!sponsorId) return res.status(400).json({ error: 'Sponsor ID required' });

      const catalog = await getCatalogBySponsor(sponsorId);
      return res.status(200).json({ catalogItems: catalog });
    }

    case 'POST': {
      const { sponsorId, item } = req.body;
      if (!sponsorId || !item) return res.status(400).json({ error: 'Sponsor ID and item required' });

      await addItemToCatalog(sponsorId, item);
      return res.status(201).json({ message: 'Item added successfully' });
    }

    case 'DELETE': {
      const { sponsorId, itemId } = req.query;
      if (!sponsorId || !itemId) return res.status(400).json({ error: 'Sponsor ID and Item ID required' });

      await removeItemFromCatalog(sponsorId, itemId);
      return res.status(200).json({ message: 'Item removed successfully' });
    }

    default: {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}

