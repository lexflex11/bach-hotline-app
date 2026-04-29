// ─── YOUR ANTHROPIC API KEY ───────────────────────────────────────────────────
// Step 1: Go to console.anthropic.com → API Keys → Create Key
// Step 2: Paste your key between the quotes below (starts with sk-ant-)
// Step 3: Re-upload this file to GitHub — Vercel will rebuild automatically
// Cost: ~$10-30/month. You get $5 free credit to test with.
export const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_KEY || "";
// ─────────────────────────────────────────────────────────────────────────────

// ─── YOUR AFFILIATE IDs ───────────────────────────────────────────────────────
// expediaTag: get this from your Expedia Creator dashboard → Link Builder
//   Paste https://www.expedia.com/Flights-Search into Link Builder,
//   copy the generated URL, and paste the full URL as expediaTag below.
export const AFFILIATE = {
  expediaTag:  "",   // e.g. the full tracked URL from Link Builder
  kayak:       "",   // add when ready — kayak.com/affiliate-program
  skyscanner:  "",   // add when ready — partners.skyscanner.net
  vrbo:        "",   // add when ready — vrbo.com/affiliates
  viator:      "",   // add when ready — viator.com/partner
};

// ─── IMAGE PROXY ──────────────────────────────────────────────────────────────
export const px = url => `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=400&h=400&fit=cover&output=webp`;

// ─── FLIGHT LINK BUILDERS ─────────────────────────────────────────────────────

// Expedia — builds a pre-filled search URL that opens directly to results
// FROM, TO, DATE, TIME OF DAY, and PASSENGERS are all pre-filled
export function expediaFlightUrl(fromCode, toCode, depDate, retDate, passengers) {
  // Expedia simple deep-link format — most reliable across regions
  const base = "https://www.expedia.com/Flights-Search";
  const trip = retDate ? "roundtrip" : "oneway";
  const params = new URLSearchParams({
    trip,
    mode: "search",
    adults: String(passengers),
    children: "0",
    seniors: "0",
    cabinclass: "economy",
    origin1: fromCode,
    destination1: toCode,
  });
  if (depDate) params.set("departuredate1", depDate);
  if (retDate) params.set("returndate", retDate);
  return `${base}?${params.toString()}`;
}

// Kayak — opens directly to results with from/to/dates/passengers pre-filled
export function kayakFlightUrl(fromCode, toCode, depDate, retDate, passengers) {
  const dep = depDate || new Date(Date.now() + 90*24*60*60*1000).toISOString().split("T")[0];
  const tag = AFFILIATE.kayak ? `?a=${AFFILIATE.kayak}` : "";
  if (retDate) {
    return `https://www.kayak.com/flights/${fromCode}-${toCode}/${dep}/${retDate}/${passengers}adults${tag}`;
  }
  return `https://www.kayak.com/flights/${fromCode}-${toCode}/${dep}/${passengers}adults${tag}`;
}

// Skyscanner — opens directly to results with from/to/dates/passengers pre-filled
export function skyscannerUrl(fromCode, toCode, depDate, retDate, passengers) {
  const fmt = d => d.replace(/-/g,"").slice(2); // YYYY-MM-DD → YYMMDD
  const dep = depDate ? fmt(depDate) : fmt(new Date(Date.now() + 90*24*60*60*1000).toISOString().split("T")[0]);
  const tag = AFFILIATE.skyscanner ? `&associateId=${AFFILIATE.skyscanner}` : "";
  if (retDate) {
    return `https://www.skyscanner.com/transport/flights/${fromCode.toLowerCase()}/${toCode.toLowerCase()}/${dep}/${fmt(retDate)}/?adults=${passengers}${tag}`;
  }
  return `https://www.skyscanner.com/transport/flights/${fromCode.toLowerCase()}/${toCode.toLowerCase()}/${dep}/?adults=${passengers}${tag}`;
}

// Google Flights — opens directly to results with from/to/dates pre-filled
export function googleFlightsUrl(fromCode, toCode, depDate, retDate, passengers) {
  if (depDate) {
    if (retDate) {
      return `https://www.google.com/travel/flights#flt=${fromCode}.${toCode}.${depDate}*${toCode}.${fromCode}.${retDate};c:USD;e:1;sd:1;t:h`;
    }
    return `https://www.google.com/travel/flights#flt=${fromCode}.${toCode}.${depDate};c:USD;e:1;sd:1;t:h`;
  }
  return `https://www.google.com/travel/flights#flt=${fromCode}.${toCode};c:USD;e:1;sd:1;t:h`;
}

// Used in PlanTab CTA
export function flightUrl(toFull, groupSize) {
  return `https://www.expedia.com/Flights-Search?mode=search`;
}

// Build a real Airbnb search URL
export function airbnbUrl(city, nights, guests) {
  const checkIn  = new Date(Date.now() + 90*24*60*60*1000).toISOString().split("T")[0];
  const checkOut = new Date(Date.now() + (90+nights)*24*60*60*1000).toISOString().split("T")[0];
  return `https://www.airbnb.com/s/${encodeURIComponent(city)}/homes?checkin=${checkIn}&checkout=${checkOut}&adults=${guests}&min_bedrooms=3`;
}

// Build a real Vrbo search URL
export function vrboUrl(city, nights, guests) {
  return `https://www.vrbo.com/search?destination=${encodeURIComponent(city)}&adults=${guests}&minSleeps=${guests}`;
}

// Build a real Booking.com hotel search URL
export function bookingUrl(city, nights, guests) {
  const checkIn  = new Date(Date.now() + 90*24*60*60*1000).toISOString().split("T")[0];
  const checkOut = new Date(Date.now() + (90+nights)*24*60*60*1000).toISOString().split("T")[0];
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}&group_children=0&no_rooms=1`;
}

export const opentableUrl = (name, city) =>
  `https://www.opentable.com/s?covers=8&query=${encodeURIComponent(name+" "+city)}`;

export const viatorUrl = (name, city) =>
  `https://www.viator.com/search/bachelorette?q=${encodeURIComponent(name+" "+city)}`;

export const gygUrl = (name, city) =>
  `https://www.getyourguide.com/s/?q=${encodeURIComponent(name+" "+city)}`;
