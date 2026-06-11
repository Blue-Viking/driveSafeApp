// pages/api/sponsors/ebay-items.js
import fetch from 'node-fetch';

const EBAY_TOKEN_URL = 'https://api.ebay.com/identity/v1/oauth2/token';
const EBAY_SCOPE = 'https://api.ebay.com/oauth/api_scope';
const BROWSE_URL = process.env.EBAY_API_ENDPOINT; // e.g., https://api.ebay.com/buy/browse/v1/item_summary/search

/**
 * Get a fresh OAuth token from eBay using Client Credentials flow.
 */
async function getAccessToken() {
  const credentials = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
  ).toString('base64');

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: EBAY_SCOPE,
  });

  const resp = await fetch(EBAY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body: params.toString(),
  });

  if (!resp.ok) {
    const text = await resp.text();
    console.error('eBay OAuth error:', text);
    throw new Error('Failed to fetch eBay access token');
  }

  const { access_token } = await resp.json();
  return access_token;
}

export default async function handler(req, res) {
  const q = req.query.q;

  if (!q) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  if (!BROWSE_URL) {
    return res.status(500).json({ error: 'eBay API endpoint is not configured properly.' });
  }

  let token;
  try {
    token = await getAccessToken();
  } catch (err) {
    console.error('eBay token error:', err);
    return res.status(502).json({ error: err.message });
  }

  const url = `${BROWSE_URL}?q=${encodeURIComponent(q)}&limit=20`;

  try {
    const ebayRes = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!ebayRes.ok) {
      const body = await ebayRes.text();
      console.error('eBay Browse error:', body);
      return res.status(502).json({ error: 'eBay Browse API error' });
    }

    const data = await ebayRes.json();
    const items = (data.itemSummaries || []).map((i) => ({
      itemId: i.itemId,
      title: i.title,
      price: i.price, // { currency, value }
      imageUrl: i.image?.imageUrl || null,
      condition: i.condition?.conditionDisplayName || '',
    }));

    res.status(200).json(items);
  } catch (err) {
    console.error('eBay fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

