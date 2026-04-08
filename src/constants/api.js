// ─── YOUR ANTHROPIC API KEY ───────────────────────────────────────────────────
// Step 1: Go to console.anthropic.com → API Keys → Create Key
// Step 2: Paste your key between the quotes below (starts with sk-ant-)
// Step 3: Re-upload this file to GitHub — Vercel will rebuild automatically
// Cost: ~$10-30/month. You get $5 free credit to test with.
export const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_KEY || "";
// ─────────────────────────────────────────────────────────────────────────────

// ─── YOUR AFFILIATE IDs ───────────────────────────────────────────────────────
export const AFFILIATE = {
  expedia:    "https://expedia.com/affiliate/bKcGxuS",  // ✅ Expedia Travel Creator
  kayak:      "",   // add when ready — kayak.com/affiliate-program
  skyscanner: "",   // add when ready — partners.skyscanner.net
  airbnb:     "",   // add when ready — airbnb.com/d/affiliates
  vrbo:       "",   // add when ready — vrbo.com/affiliates
  viator:     "",   // add when ready — viator.com/partner
};

// ─── IMAGE PROXY ──────────────────────────────────────────────────────────────
export const px = url => `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=400&h=400&fit=cover&output=webp`;

// ─── FLIGHT LINK BUILDERS ─────────────────────────────────────────────────────

// Expedia — builds a pre-filled flight search with your affiliate tracking
// Opens Expedia with FROM, TO, DATE, TIME OF DAY, and GROUP SIZE already entered
export function expediaFlightUrl(fromCode, toCode, depDate, retDate, passengers, depTime="ANYTIME", retTime="ANYTIME") {
  // Convert YYYY-MM-DD → MMDDYYYY for Expedia's URL format
  const fmt = d => { const [y,m,day] = d.split("-"); return `${m}${day}${y}`; };

  let leg1 = `from%3A${fromCode}%2Cto%3A${toCode}`;
  if (depDate) leg1 += `%2Cdeparture%3A${fmt(depDate)}${depTime}`;

  const trip = retDate ? "roundtrip" : "oneway";
  let legs = `leg1=${leg1}`;

  if (retDate) {
    const leg2 = `from%3A${toCode}%2Cto%3A${fromCode}%2Cdeparture%3A${fmt(retDate)}${retTime}`;
    legs += `&leg2=${leg2}`;
  }

  const searchUrl = `https://www.expedia.com/Flights-Search?trip=${trip}&${legs}&passengers=adults%3A${passengers}%2Cseniors%3A0%2Cchildren%3A0&options=cabinClass%3Aeconomy&mode=search`;

  // Wrap with affiliate deep link — passes your tracking + opens pre-filled search
  if (AFFILIATE.expedia) {
    return `${AFFILIATE.expedia}?url=${encodeURIComponent(searchUrl)}`;
  }
  return searchUrl;
}

// Kayak — backup flight search (affiliate-ready)
export function kayakFlightUrl(fromCode, toCode, date, passengers) {
  const d = date || new Date(Date.now() + 90*24*60*60*1000).toISOString().split("T")[0];
  const tag = AFFILIATE.kayak ? `?a=${AFFILIATE.kayak}` : "";
  return `https://www.kayak.com/flights/${fromCode}-${toCode}/${d}/${passengers}adults${tag}`;
}

// Skyscanner — secondary search (affiliate-ready, great international coverage)
// Sign up at partners.skyscanner.net to get your affiliate ID
export function skyscannerUrl(fromCode, toCode, date, passengers) {
  const raw = date ? date.replace(/-/g,"").slice(2) : new Date(Date.now() + 90*24*60*60*1000).toISOString().split("T")[0].replace(/-/g,"").slice(2);
  const tag = AFFILIATE.skyscanner ? `&associateId=${AFFILIATE.skyscanner}` : "";
  return `https://www.skyscanner.com/transport/flights/${fromCode.toLowerCase()}/${toCode.toLowerCase()}/${raw}/?adults=${passengers}${tag}`;
}

// Google Flights — always-free backup, no affiliate but 100% reliable
export function googleFlightsUrl(fromCode, toCode, date, passengers) {
  const d = date || new Date(Date.now() + 90*24*60*60*1000).toISOString().split("T")[0];
  return `https://www.google.com/travel/flights/search?q=flights+from+${fromCode}+to+${toCode}&hl=en`;
}

// Used in PlanTab CTA — sends to Expedia with affiliate tracking
export function flightUrl(toFull, groupSize) {
  return AFFILIATE.expedia || `https://www.expedia.com/Flights-Search?mode=search`;
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
