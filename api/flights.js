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
    // month-matrix returns one result per day — many more results than /latest
    const month = date ? date.substring(0, 7) : new Date().toISOString().substring(0, 7);
    const params = new URLSearchParams({
      currency:    "USD",
      origin:      fromCode,
      destination: toCode,
      month,
      token,
    });
    if (!returnDate) params.set("one_way", "true");

    const response = await fetch(`https://api.travelpayouts.com/v1/prices/month-matrix?${params}`);
    const data     = await response.json();

    if (!response.ok || !data.success) {
      return res.status(500).json({ error: data.message || "Flight search failed" });
    }

    const flights = (data.data || [])
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
