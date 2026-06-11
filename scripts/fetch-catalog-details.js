// scripts/fetch-catalog-details.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mysql from 'mysql2/promise';
import fetch from 'node-fetch';

const EBAY_TOKEN_URL = 'https://api.ebay.com/identity/v1/oauth2/token';
const EBAY_SCOPE     = 'https://api.ebay.com/oauth/api_scope';
const ITEM_URL       = 'https://api.ebay.com/buy/browse/v1/item/'; // + itemId

async function getAccessToken() {
  const creds = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
  ).toString('base64');
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    scope:      EBAY_SCOPE,
  });
  const resp = await fetch(EBAY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': `Basic ${creds}`,
    },
    body: params.toString(),
  });
  if (!resp.ok) throw new Error(await resp.text());
  return (await resp.json()).access_token;
}

async function main() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // pull all mappings for sponsor 4 (or change as needed)
  const sponsorId = 4;
  const [maps] = await conn.execute(
    'SELECT itemId FROM sponsor_catalog WHERE sponsorId = ?', [sponsorId]
  );

  const token = await getAccessToken();
  for (const { itemId } of maps) {
    console.log('Fetching eBay item:', itemId);
    const r = await fetch(ITEM_URL + encodeURIComponent(itemId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) {
      console.error(' eBay lookup failed:', await r.text());
      continue;
    }
    const itm = await r.json();
    // update our table
    await conn.execute(
      `UPDATE Catalog_API
         SET name            = ?,
             description     = ?,
             price_in_points = ?,
             image_url       = ?
       WHERE sponsor_id = ? 
         AND api_source  = ?`,
      [
        itm.title,
        itm.condition?.conditionDisplayName || '',
        Math.round(parseFloat(itm.price.value) || 0),
        itm.image.imageUrl || '',
        sponsorId,
        itemId,
      ]
    );
    console.log(' → updated', itemId);
  }

  await conn.end();
  console.log('Done!');
}

main().catch(console.error);

