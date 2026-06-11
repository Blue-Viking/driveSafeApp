// lib/ebayAuth.js
const EBAY_TOKEN_URL = "https://api.ebay.com/identity/v1/oauth2/token";

let _cachedToken = null;
let _tokenExpiresAt = 0; // unix ms

export async function getAppToken() {
  const now = Date.now();
  // If we have a token and it expires in more than 60s, just reuse it:
  if (_cachedToken && now + 60_000 < _tokenExpiresAt) {
    return _cachedToken;
  }

  // Otherwise fetch a fresh one:
  const credentials = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(EBAY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://api.ebay.com/oauth/api_scope", // public Browse data
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`eBay OAuth failed ${res.status}: ${txt}`);
  }

  const { access_token, expires_in } = await res.json();
  // expires_in is in seconds:
  _cachedToken = access_token;
  _tokenExpiresAt = now + expires_in * 1000;
  return _cachedToken;
}

