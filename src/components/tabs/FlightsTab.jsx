import React, { useState, useEffect } from 'react';
import { SOFT, MID, HOT, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import { expediaFlightUrl } from '../../constants/api.js';
import SH from '../ui/SH.jsx';

const NUN = "'Plus Jakarta Sans',sans-serif";

// Common US departure airports with coordinates for geolocation detection
const AIRPORTS = [
  { code:"IAH", label:"Houston, TX (IAH)",           lat:29.9902, lng:-95.3368 },
  { code:"HOU", label:"Houston Hobby, TX (HOU)",     lat:29.6454, lng:-95.2789 },
  { code:"DFW", label:"Dallas, TX (DFW)",            lat:32.8998, lng:-97.0403 },
  { code:"ATL", label:"Atlanta, GA (ATL)",           lat:33.6407, lng:-84.4277 },
  { code:"JFK", label:"New York, NY (JFK)",          lat:40.6413, lng:-73.7781 },
  { code:"LGA", label:"New York LaGuardia (LGA)",    lat:40.7772, lng:-73.8726 },
  { code:"ORD", label:"Chicago, IL (ORD)",           lat:41.9742, lng:-87.9073 },
  { code:"LAX", label:"Los Angeles, CA (LAX)",       lat:33.9425, lng:-118.4081 },
  { code:"MIA", label:"Miami, FL (MIA)",             lat:25.7959, lng:-80.2870 },
  { code:"SFO", label:"San Francisco, CA (SFO)",     lat:37.6213, lng:-122.3790 },
  { code:"DEN", label:"Denver, CO (DEN)",            lat:39.8561, lng:-104.6737 },
  { code:"PHX", label:"Phoenix, AZ (PHX)",           lat:33.4373, lng:-112.0078 },
  { code:"SEA", label:"Seattle, WA (SEA)",           lat:47.4502, lng:-122.3088 },
  { code:"BOS", label:"Boston, MA (BOS)",            lat:42.3656, lng:-71.0096 },
  { code:"DCA", label:"Washington DC (DCA)",         lat:38.8521, lng:-77.0377 },
  { code:"CLT", label:"Charlotte, NC (CLT)",         lat:35.2140, lng:-80.9431 },
  { code:"TPA", label:"Tampa, FL (TPA)",             lat:27.9755, lng:-82.5332 },
  { code:"MSY", label:"New Orleans, LA (MSY)",       lat:29.9934, lng:-90.2580 },
  { code:"AUS", label:"Austin, TX (AUS)",            lat:30.1975, lng:-97.6664 },
  { code:"SAT", label:"San Antonio, TX (SAT)",       lat:29.5337, lng:-98.4698 },
  { code:"MSP", label:"Minneapolis, MN (MSP)",       lat:44.8848, lng:-93.2223 },
  { code:"DTW", label:"Detroit, MI (DTW)",           lat:42.2162, lng:-83.3554 },
  { code:"PHL", label:"Philadelphia, PA (PHL)",      lat:39.8744, lng:-75.2424 },
  { code:"BWI", label:"Baltimore/DC (BWI)",          lat:39.1754, lng:-76.6682 },
  { code:"SAN", label:"San Diego, CA (SAN)",         lat:32.7338, lng:-117.1933 },
  { code:"PDX", label:"Portland, OR (PDX)",          lat:45.5898, lng:-122.5951 },
  { code:"STL", label:"St. Louis, MO (STL)",         lat:38.7487, lng:-90.3700 },
  { code:"BNA", label:"Nashville, TN (BNA)",         lat:36.1245, lng:-86.6782 },
  { code:"RDU", label:"Raleigh-Durham, NC (RDU)",    lat:35.8776, lng:-78.7875 },
  { code:"SLC", label:"Salt Lake City, UT (SLC)",    lat:40.7884, lng:-111.9778 },
];

const CARRIERS = {
  AA:"American Airlines", DL:"Delta Air Lines", UA:"United Airlines",
  WN:"Southwest", B6:"JetBlue", AS:"Alaska Airlines", NK:"Spirit",
  F9:"Frontier", G4:"Allegiant", HA:"Hawaiian", SY:"Sun Country",
  VX:"Virgin America", YX:"Midwest Express", US:"US Airways",
  CO:"Continental", TZ:"ATA", FL:"AirTran",
};

function carrierName(code) { return CARRIERS[code] || code; }

function parseDuration(iso) {
  // PT2H30M → "2h 30m"
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!m) return iso;
  const h = m[1] ? `${m[1]}h ` : "";
  const min = m[2] ? `${m[2]}m` : "";
  return h + min;
}

function fmtTime(dt) {
  // "2026-05-11T06:00:00" → "6:00 AM"
  const d = new Date(dt);
  return d.toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit", hour12:true });
}

function fmtDate(dt) {
  const d = new Date(dt);
  return d.toLocaleDateString("en-US", { month:"short", day:"numeric" });
}

function getNearestAirport(lat, lng) {
  let nearest = AIRPORTS[0], minDist = Infinity;
  for (const a of AIRPORTS) {
    const d = Math.hypot(a.lat - lat, a.lng - lng);
    if (d < minDist) { minDist = d; nearest = a; }
  }
  return nearest.code;
}

const usDests   = DESTS.filter(d => !d.international);
const intlDests = DESTS.filter(d =>  d.international);

// ── Flight result card ─────────────────────────────────────────────────────
function fmtSecs(secs) {
  if (!secs) return "";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return `${h}h ${m}m`;
}

function FlightCard({ flight, groupSize, fromCode, toCode, depDate, retDate }) {
  const totalPrice = (flight.price * groupSize).toFixed(0);

  function book() {
    // Use Kiwi deep link if available, otherwise fall back to Expedia
    if (flight.deepLink) {
      window.open(flight.deepLink, "_blank");
    } else {
      window.open(expediaFlightUrl(fromCode, toCode, depDate, retDate, groupSize), "_blank");
    }
  }

  return (
    <div style={{ ...C, marginBottom:12, padding:"16px" }}>
      {/* Airline + price */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:DARK }}>
          {carrierName(flight.airline)}
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:NUN, fontSize:18, fontWeight:800, color:DARK }}>
            ${Number(flight.price).toLocaleString()}
            <span style={{ fontSize:11, fontWeight:500, color:"#999" }}>/person</span>
          </div>
          <div style={{ fontFamily:NUN, fontSize:11, color:HOT, fontWeight:600 }}>
            ${Number(totalPrice).toLocaleString()} total for {groupSize}
          </div>
        </div>
      </div>

      {/* Outbound */}
      <FlightRow leg={flight.outbound} label={flight.inbound ? "Outbound" : null} />

      {/* Return */}
      {flight.inbound && <FlightRow leg={flight.inbound} label="Return" />}

      {/* Book button */}
      <button onClick={book} style={{
        marginTop:14, width:"100%", padding:"13px",
        background:`linear-gradient(135deg,#f472b0,${HOT})`,
        color:WHITE, border:"none", borderRadius:50,
        fontFamily:NUN, fontSize:14, fontWeight:800,
        cursor:"pointer", letterSpacing:"0.2px",
      }}>
        Book Flight
      </button>
    </div>
  );
}

function FlightRow({ leg, label }) {
  const stops = Math.max(0, leg.stops ?? 0);
  return (
    <div style={{ marginBottom: label === "Return" ? 0 : 12 }}>
      {label && (
        <div style={{ fontFamily:NUN, fontSize:10, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
          {label}
        </div>
      )}
      <div style={{ display:"flex", alignItems:"center" }}>
        {/* Departure */}
        <div style={{ minWidth:72 }}>
          <div style={{ fontFamily:NUN, fontSize:16, fontWeight:800, color:DARK }}>{fmtTime(leg.depTime)}</div>
          <div style={{ fontFamily:NUN, fontSize:11, color:"#999", fontWeight:600 }}>{leg.depCode}</div>
          <div style={{ fontFamily:NUN, fontSize:10, color:"#bbb" }}>{fmtDate(leg.depTime)}</div>
        </div>

        {/* Duration + stops */}
        <div style={{ flex:1, textAlign:"center", padding:"0 8px" }}>
          <div style={{ fontFamily:NUN, fontSize:11, color:"#999", fontWeight:600, marginBottom:4 }}>{fmtSecs(leg.duration)}</div>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <div style={{ flex:1, height:1.5, background:BORDER }} />
            <div style={{
              fontFamily:NUN, fontSize:9, fontWeight:700, whiteSpace:"nowrap",
              padding:"2px 7px", borderRadius:50,
              color:      stops === 0 ? "#22c55e" : HOT,
              background: stops === 0 ? "#f0fdf4" : "#fff0f6",
              border:`1px solid ${stops === 0 ? "#86efac" : "#fbc8dc"}`,
            }}>
              {stops === 0 ? "Nonstop" : `${stops} stop${stops > 1 ? "s" : ""}`}
            </div>
            <div style={{ flex:1, height:1.5, background:BORDER }} />
          </div>
        </div>

        {/* Arrival */}
        <div style={{ minWidth:72, textAlign:"right" }}>
          <div style={{ fontFamily:NUN, fontSize:16, fontWeight:800, color:DARK }}>{fmtTime(leg.arrTime)}</div>
          <div style={{ fontFamily:NUN, fontSize:11, color:"#999", fontWeight:600 }}>{leg.arrCode}</div>
          <div style={{ fontFamily:NUN, fontSize:10, color:"#bbb" }}>{fmtDate(leg.arrTime)}</div>
        </div>
      </div>
    </div>
  );
}

// ── Main tab ───────────────────────────────────────────────────────────────
export default function FlightsTab({ groupSize, initialDest }) {
  const [fromCode,      setFromCode]      = useState(() => localStorage.getItem("bh_airport") || "IAH");
  const [depDate,       setDepDate]       = useState("");
  const [retDate,       setRetDate]       = useState("");
  const [dest,          setDest]          = useState(initialDest || null);
  const [showDestPicker,setShowDestPicker]= useState(!initialDest);
  const [flights,       setFlights]       = useState(null);   // array of offers
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);
  const [detailFlight,  setDetailFlight]  = useState(null);

  const selectedDest = DESTS.find(d => d.id === dest);
  const minDate      = new Date().toISOString().split("T")[0];

  // Auto-detect nearest airport
  useEffect(() => {
    if (localStorage.getItem("bh_airport")) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const code = getNearestAirport(coords.latitude, coords.longitude);
      setFromCode(code);
      localStorage.setItem("bh_airport", code);
    }, () => {});
  }, []);

  async function searchFlights() {
    if (!selectedDest || !depDate) return;
    setLoading(true);
    setError(null);
    setFlights(null);
    try {
      const params = new URLSearchParams({
        from:   fromCode,
        to:     selectedDest.airportCode,
        date:   depDate,
        adults: String(groupSize),
      });
      if (retDate) params.set("returnDate", retDate);

      const res  = await fetch(`/api/flights?${params}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (!data.flights || data.flights.length === 0) {
        setError("No flights found for this route and date. Try adjusting your dates.");
      } else {
        setFlights(data.flights);
      }
    } catch (e) {
      setError("Could not reach the flight API. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SH title="Group Flight Search" sub="Live prices for your whole crew" />

      {/* ── Departure airport ── */}
      <div style={{ ...C, marginBottom:12 }}>
        <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:DARK, marginBottom:4 }}>Where are you flying from?</div>
        <div style={{ fontFamily:NUN, fontSize:11, color:"#aaa", marginBottom:10 }}>We detected your nearest airport</div>
        <select
          value={fromCode}
          onChange={e => { setFromCode(e.target.value); localStorage.setItem("bh_airport", e.target.value); }}
          style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, appearance:"none", cursor:"pointer" }}
        >
          {AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.label}</option>)}
        </select>
      </div>

      {/* ── Destination ── */}
      <div style={{ ...C, marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:DARK }}>Where are you going?</div>
          {dest && !showDestPicker && (
            <button onClick={() => setShowDestPicker(true)} style={{ fontSize:11, color:HOT, fontFamily:NUN, background:"none", border:"none", cursor:"pointer", textDecoration:"underline", padding:0 }}>Change</button>
          )}
        </div>
        {dest && !showDestPicker ? (
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, border:`1.5px solid ${HOT}`, background:SOFT }}>
            <div>
              <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:DARK }}>{DESTS.find(d => d.id === dest)?.name}</div>
              <div style={{ fontFamily:NUN, fontSize:10, color:HOT, opacity:0.8 }}>{groupSize} travelers</div>
            </div>
          </div>
        ) : (
          <select
            value={dest || ""}
            onChange={e => { setDest(e.target.value || null); setShowDestPicker(false); }}
            style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, appearance:"none", cursor:"pointer" }}
          >
            <option value="">Choose a city…</option>
            <optgroup label="US Cities">{usDests.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup>
            <optgroup label="International">{intlDests.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup>
          </select>
        )}
      </div>

      {/* ── Dates ── */}
      <div style={{ ...C, marginBottom:14, overflow:"hidden" }}>
        <div style={{ marginBottom:12, overflow:"hidden" }}>
          <div style={{ fontFamily:NUN, fontSize:10, fontWeight:700, color:HOT, textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>Departure Date</div>
          <div style={{ overflow:"hidden", borderRadius:10 }}>
            <input type="date" value={depDate} min={minDate}
              onChange={e => { setDepDate(e.target.value); if (retDate && e.target.value >= retDate) setRetDate(""); }}
              style={{ width:"100%", padding:"10px 8px", borderRadius:10, border:`1.5px solid ${depDate ? HOT : BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, boxSizing:"border-box", display:"block" }}
            />
          </div>
        </div>
        <div style={{ overflow:"hidden" }}>
          <div style={{ fontFamily:NUN, fontSize:10, fontWeight:700, color:HOT, textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>Return Date <span style={{ fontWeight:400, textTransform:"none", color:"#bbb" }}>(optional)</span></div>
          <div style={{ overflow:"hidden", borderRadius:10 }}>
            <input type="date" value={retDate} min={depDate || minDate}
              onChange={e => setRetDate(e.target.value)}
              style={{ width:"100%", padding:"10px 8px", borderRadius:10, border:`1.5px solid ${retDate ? HOT : BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, boxSizing:"border-box", display:"block" }}
            />
          </div>
        </div>
      </div>

      {/* ── Search CTA ── */}
      <div style={{ ...C, background:SOFT, border:`1.5px solid ${MID}`, marginBottom:20 }}>
        {selectedDest ? (
          <>
            <div style={{ fontFamily:NUN, fontSize:14, fontWeight:700, color:DARK, marginBottom:4 }}>
              {fromCode} → {selectedDest.name}
            </div>
            <div style={{ fontFamily:NUN, fontSize:11, color:HOT, marginBottom:14, opacity:0.85 }}>
              {groupSize} travelers · {depDate || "flexible dates"}{retDate ? ` → ${retDate}` : ""}
            </div>
            <button
              onClick={searchFlights}
              disabled={!depDate || loading}
              style={{
                width:"100%", background:`linear-gradient(135deg,#f472b0,${HOT})`,
                color:WHITE, border:"none", borderRadius:14, padding:"15px",
                cursor: depDate ? "pointer" : "not-allowed",
                opacity: depDate ? 1 : 0.6,
                fontFamily:NUN, fontSize:14, fontWeight:800,
              }}
            >
              {loading ? "Searching flights…" : "Find Best Prices"}
            </button>
            {!depDate && <div style={{ fontFamily:NUN, fontSize:10, color:"#bbb", marginTop:8, textAlign:"center" }}>Select a departure date to search</div>}
          </>
        ) : (
          <div style={{ textAlign:"center", padding:"8px 0" }}>
            <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:DARK }}>Pick a destination above</div>
            <div style={{ fontFamily:NUN, fontSize:11, color:HOT, marginTop:4, opacity:0.75 }}>Then we'll pull live flights for {groupSize} people</div>
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ ...C, background:"#fff0f6", border:`1.5px solid #fbc8dc`, marginBottom:16 }}>
          <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:HOT, marginBottom:4 }}>No flights found</div>
          <div style={{ fontFamily:NUN, fontSize:12, color:"#c05080" }}>{error}</div>
        </div>
      )}

      {/* ── Results ── */}
      {flights && (
        <div>
          <div style={{ fontFamily:NUN, fontSize:11, fontWeight:700, color:HOT, textTransform:"uppercase", letterSpacing:1.5, marginBottom:12 }}>
            {flights.length} flight{flights.length !== 1 ? "s" : ""} found — {fromCode} → {selectedDest?.airportCode}
          </div>
          {flights.length === 0 && (
            <div style={{ ...C, textAlign:"center", color:"#aaa", fontFamily:NUN, fontSize:13 }}>
              No flights available for this route and date. Try adjusting your dates.
            </div>
          )}
          {flights.map(flight => (
            <FlightCard
              key={flight.id}
              flight={flight}
              groupSize={groupSize}
              fromCode={fromCode}
              toCode={selectedDest?.airportCode}
              depDate={depDate}
              retDate={retDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
