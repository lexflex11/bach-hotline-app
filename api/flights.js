// Vercel serverless function — Travelpayouts v2 flight prices API
const MARKER = "523908";

const AIRLINE_NAMES = {
  WN:"Southwest", AA:"American Airlines", DL:"Delta", UA:"United",
  B6:"JetBlue", NK:"Spirit", F9:"Frontier", AS:"Alaska Airlines",
  G4:"Allegiant", SY:"Sun Country", HA:"Hawaiian", AM:"Aeromexico",
  VB:"VivaAerobus", Y4:"Volaris", AC:"Air Canada", WS:"WestJet",
  MX:"Breeze", KL:"KLM", BA:"British Airways", LH:"Lufthansa",
  AF:"Air France", IB:"Iberia", EK:"Emirates", QR:"Qatar Airways",
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { from, to, date, returnDate, adults = "1" } = req.query;
  if (!from || !to) return res.status(400).json({ error: "Missing params: from, to" });

  const token = process.env.TP_API_TOKEN;
  if (!token) return res.status(500).json({ error: "Missing TP_API_TOKEN in Vercel Environment Variables" });

  const numAdults = Math.max(1, Math.min(9, parseInt(adults) || 1));
  const fromCode  = from.toUpperCase();
  const toCode    = to.toUpperCase();

  try {
    // v2/prices/latest returns an array with many results including departure times
    const params = new URLSearchParams({
      origin:      fromCode,
      destination: toCode,
      currency:    "USD",
      period_type: "month",
      one_way:     returnDate ? "false" : "true",
      page:        "1",
      limit:       "30",
      token,
    });
    if (date) params.set("beginning_of_period", date.substring(0, 7) + "-01");

    const response = await fetch(`https://api.travelpayouts.com/v2/prices/latest?${params}`);
    const data     = await response.json();

    if (!response.ok || !data.success) {
      return res.status(500).json({ error: data.message || "Flight search failed" });
    }

    // Return first raw item so we can inspect actual field names
    return res.status(200).json({ _raw: (data.data || []).slice(0, 2), groupSize: numAdults, flights: [] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
