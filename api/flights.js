// Vercel serverless function — proxies Amadeus Flight Offers API
// Keeps API credentials server-side (never exposed to browser)

const AMADEUS_BASE = process.env.AMADEUS_ENV === "production"
  ? "https://api.amadeus.com"
  : "https://test.api.amadeus.com";

async function getToken() {
  const res = await fetch(`${AMADEUS_BASE}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type:    "client_credentials",
      client_id:     process.env.AMADEUS_CLIENT_ID     || "",
      client_secret: process.env.AMADEUS_CLIENT_SECRET || "",
    }),
  });
  const data = await res.json();
  return data.access_token;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { from, to, date, returnDate, adults = "1" } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json({ error: "Missing params: from, to, date" });
  }

  try {
    const token = await getToken();
    if (!token) return res.status(500).json({ error: "Auth failed — check AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET in Vercel env vars" });

    // Amadeus caps at 9 adults per call — for larger groups show per-person price
    const adultCount = Math.min(Number(adults) || 1, 9);

    const params = new URLSearchParams({
      originLocationCode:      from.toUpperCase(),
      destinationLocationCode: to.toUpperCase(),
      departureDate:           date,
      adults:                  String(adultCount),
      max:                     "15",
      currencyCode:            "USD",
    });
    if (returnDate) params.set("returnDate", returnDate);

    const flightRes = await fetch(
      `${AMADEUS_BASE}/v2/shopping/flight-offers?${params}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await flightRes.json();

    // Pass original groupSize back so UI can extrapolate total price
    data._groupSize = Number(adults) || 1;
    data._adultCount = adultCount;

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
