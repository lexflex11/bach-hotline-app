// Vercel serverless function — proxies Kiwi Tequila Flight Search API
// API key stays server-side, never exposed to the browser

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { from, to, date, returnDate, adults = "1" } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json({ error: "Missing params: from, to, date" });
  }

  const apiKey = process.env.KIWI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing KIWI_API_KEY — add it in Vercel Environment Variables" });
  }

  try {
    // Kiwi Tequila expects dates as DD/MM/YYYY
    function toKiwiDate(iso) {
      const [y, m, d] = iso.split("-");
      return `${d}/${m}/${y}`;
    }

    const depKiwi = toKiwiDate(date);
    const retKiwi = returnDate ? toKiwiDate(returnDate) : null;

    const params = new URLSearchParams({
      fly_from:       from.toUpperCase(),
      fly_to:         to.toUpperCase(),
      date_from:      depKiwi,
      date_to:        depKiwi,
      adults:         String(Math.min(Number(adults) || 1, 9)),
      curr:           "USD",
      limit:          "15",
      sort:           "price",
      flight_type:    retKiwi ? "round" : "oneway",
      max_stopovers:  "2",
    });

    if (retKiwi) {
      params.set("return_from", retKiwi);
      params.set("return_to",   retKiwi);
    }

    const response = await fetch(
      `https://api.tequila.kiwi.com/v2/search?${params}`,
      { headers: { apikey: apiKey } }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      return res.status(500).json({ error: data.error || "Flight search failed" });
    }

    // Normalize to a simple format the UI can use
    const flights = (data.data || []).map(f => ({
      id:         f.id,
      airline:    f.airlines?.[0] || f.operating_carrier || "—",
      price:      parseFloat(f.price),
      currency:   "USD",
      outbound: {
        depCode:  f.flyFrom,
        arrCode:  f.flyTo,
        depTime:  new Date(f.local_departure).toISOString(),
        arrTime:  new Date(f.local_arrival).toISOString(),
        duration: f.duration?.departure,   // seconds
        stops:    f.route?.filter(r => r.return === 0).length - 1,
        segments: (f.route || []).filter(r => r.return === 0).map(r => ({
          dep: r.flyFrom, arr: r.flyTo,
          depTime: new Date(r.local_departure).toISOString(),
          arrTime: new Date(r.local_arrival).toISOString(),
          carrier: r.airline,
          flightNo: `${r.airline}${r.flight_no}`,
        })),
      },
      inbound: retKiwi ? {
        depCode:  f.flyTo,
        arrCode:  f.flyFrom,
        depTime:  new Date(f.route?.find(r => r.return === 1)?.local_departure || f.local_arrival).toISOString(),
        arrTime:  new Date(f.local_arrival).toISOString(),
        duration: f.duration?.return,
        stops:    Math.max(0, f.route?.filter(r => r.return === 1).length - 1),
        segments: (f.route || []).filter(r => r.return === 1).map(r => ({
          dep: r.flyFrom, arr: r.flyTo,
          depTime: new Date(r.local_departure).toISOString(),
          arrTime: new Date(r.local_arrival).toISOString(),
          carrier: r.airline,
          flightNo: `${r.airline}${r.flight_no}`,
        })),
      } : null,
      deepLink: f.deep_link || null,
    }));

    return res.status(200).json({ flights, groupSize: Number(adults) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
