// lib/ebay.js
import { getAppToken } from "./ebayAuth";

export async function searchEbayItems(query) {
  const token = await getAppToken();
  const url = new URL(
    "https://api.ebay.com/buy/browse/v1/item_summary/search"
  );
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "20");

  const resp = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`eBay search failed: ${resp.status} ${txt}`);
  }

  const json = await resp.json();
  return (json.itemSummaries || []).map((i) => ({
    itemId:      i.itemId,
    title:       i.title,
    price:       i.price,
    imageUrl:    i.thumbnailImages?.[0]?.imageUrl,
    itemWebUrl:  i.itemWebUrl,
  }));
}

