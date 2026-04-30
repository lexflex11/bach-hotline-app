// Vercel serverless function — Travelpayouts v2 flight prices API
const MARKER = "523908";

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
    // calendar returns cheapest price per day for the given month
    const month = date ? date.substring(0, 7) : new Date().toISOString().substring(0, 7);
    const params = new URLSearchParams({
      currency:       "usd",
      origin:         fromCode,
      destination:    toCode,
      depart_date:    month,
      calendar_type:  "departure_date",
      token,
    });
    if (returnDate) params.set("return_date", returnDate.substring(0, 7));

    const response = await fetch(`https://api.travelpayouts.com/v1/prices/calendar?${params}`);
    const raw  = await response.text();
    let data;
    try { data = JSON.parse(raw); }
    catch { return res.status(500).json({ error: `API returned non-JSON: ${raw.substring(0, 200)}` }); }

    if (!response.ok || !data.success) {
      return res.status(500).json({ error: data.message || data.error || JSON.stringify(data) });
    }

    // calendar API returns an object keyed by date, convert to array
    const rawList = Array.isArray(data.data)
      ? data.data
      : Object.entries(data.data || {}).map(([k, v]) => ({ ...v, depart_date: v.depart_date || k }));

    const flights = rawList
      .filter(f => f.show_to_affiliates !== false)
      .map((f, i) => {
        const depDate = f.depart_date || null;   // "YYYY-MM-DD"
        const retDate = f.return_date || null;
        const price   = f.value ?? f.price ?? 0;
        const stops   = f.number_of_changes ?? f.transfers ?? 0;
        const origin  = f.origin || fromCode;
        const dest    = f.destination || toCode;

        // duration is in minutes
        const dur = f.duration ? `${Math.floor(f.duration/60)}h ${f.duration%60}m` : null;

        // Build Aviasales booking URL with affiliate marker
        const depPart = depDate ? depDate.slice(8,10) + depDate.slice(5,7) : "0101";
        const retPart = retDate && retDate !== "" ? retDate.slice(8,10) + retDate.slice(5,7) : null;

        const bookingUrl = retPart
          ? `https://www.aviasales.com/search/${origin}${depPart}/${dest}${retPart}/${numAdults}1?marker=${MARKER}`
          : `https://www.aviasales.com/search/${origin}${depPart}/${dest}${numAdults}1?marker=${MARKER}`;

        return {
          id:         i,
          gate:       f.gate || "Aviasales",
          origin,
          dest,
          price:      Math.round(price),
          totalPrice: Math.round(price * numAdults),
          stops,
          duration:   dur,
          departureDate: depDate,
          returnDate:    retDate && retDate !== "" ? retDate : null,
          bookingUrl,
        };
      })
      .filter(f => f.price > 0)
      .sort((a, b) => a.price - b.price);

    return res.status(200).json({ flights, groupSize: numAdults });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
