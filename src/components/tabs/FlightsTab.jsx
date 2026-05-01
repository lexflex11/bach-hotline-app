import React, { useState } from 'react';
import { HOT, DARK, WHITE, BORDER, SOFT } from '../../constants/colors.js';
import { C } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

const NUN = "'Plus Jakarta Sans',sans-serif";
const CAMREF = "1011l4ma3h";

const MARKER = "523908";

function buildBookingUrl(from, to, depDate, retDate, adults) {
  // Aviasales deep link — confirmed working format: {from}{DDMM}{to}{DDMM}/{pax}
  const depPart = depDate ? depDate.slice(8,10) + depDate.slice(5,7) : "";
  const retPart = retDate ? retDate.slice(8,10) + retDate.slice(5,7) : "";
  if (retPart) {
    return `https://www.aviasales.com/search/${from}${depPart}${to}${retPart}/${adults}?marker=${MARKER}`;
  }
  return `https://www.aviasales.com/search/${from}${depPart}${to}/${adults}?marker=${MARKER}`;
}

const AIRPORTS = [
  { code:"IAH", label:"Houston, TX (IAH)" },
  { code:"HOU", label:"Houston Hobby, TX (HOU)" },
  { code:"DFW", label:"Dallas, TX (DFW)" },
  { code:"ATL", label:"Atlanta, GA (ATL)" },
  { code:"JFK", label:"New York, NY (JFK)" },
  { code:"LGA", label:"New York LaGuardia (LGA)" },
  { code:"ORD", label:"Chicago, IL (ORD)" },
  { code:"LAX", label:"Los Angeles, CA (LAX)" },
  { code:"MIA", label:"Miami, FL (MIA)" },
  { code:"SFO", label:"San Francisco, CA (SFO)" },
  { code:"DEN", label:"Denver, CO (DEN)" },
  { code:"PHX", label:"Phoenix, AZ (PHX)" },
  { code:"SEA", label:"Seattle, WA (SEA)" },
  { code:"BOS", label:"Boston, MA (BOS)" },
  { code:"DCA", label:"Washington DC (DCA)" },
  { code:"CLT", label:"Charlotte, NC (CLT)" },
  { code:"TPA", label:"Tampa, FL (TPA)" },
  { code:"MSY", label:"New Orleans, LA (MSY)" },
  { code:"AUS", label:"Austin, TX (AUS)" },
  { code:"SAT", label:"San Antonio, TX (SAT)" },
  { code:"MSP", label:"Minneapolis, MN (MSP)" },
  { code:"DTW", label:"Detroit, MI (DTW)" },
  { code:"PHL", label:"Philadelphia, PA (PHL)" },
  { code:"BWI", label:"Baltimore/DC (BWI)" },
  { code:"SAN", label:"San Diego, CA (SAN)" },
  { code:"PDX", label:"Portland, OR (PDX)" },
  { code:"BNA", label:"Nashville, TN (BNA)" },
  { code:"RDU", label:"Raleigh-Durham, NC (RDU)" },
  { code:"SLC", label:"Salt Lake City, UT (SLC)" },
  { code:"STL", label:"St. Louis, MO (STL)" },
];

const TIME_OPTIONS = [
  { key:"any",       label:"Any Time" },
  { key:"morning",   label:"Morning",   min:5,  max:12 },
  { key:"afternoon", label:"Afternoon", min:12, max:18 },
  { key:"night",     label:"Night",     min:18, max:24 },
];

const FARE_TIERS = [
  {
    name: "Value", cabin: "Economy",
    mult: 1.0,
    perks: [
      { ok: false, label: "Seat choice (fee applies)" },
      { ok: true,  label: "Personal item included" },
      { ok: false, label: "Carry-on bag: extra fee" },
      { ok: false, label: "Checked bag: extra fee" },
      { ok: false, label: "Changes: fee applies" },
    ],
  },
  {
    name: "Premium Economy", cabin: "Premium Economy",
    mult: 1.35,
    perks: [
      { ok: true,  label: "Seat choice included" },
      { ok: true,  label: "Personal item included" },
      { ok: true,  label: "Carry-on bag included" },
      { ok: false, label: "Checked bag: extra fee" },
      { ok: true,  label: "Changes included" },
    ],
  },
  {
    name: "First Class", cabin: "First",
    mult: 1.75,
    perks: [
      { ok: true, label: "Seat choice included" },
      { ok: true, label: "Personal item included" },
      { ok: true, label: "Carry-on bag included" },
      { ok: true, label: "Checked bag included" },
      { ok: true, label: "Changes included" },
    ],
  },
];

const labelStyle = {
  fontFamily: NUN, fontSize: 10, fontWeight: 700,
  color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6,
};

function fmtDate(d) {
  if (!d) return null;
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" });
}

// ── Overlay wrapper ──────────────────────────────────────────────────────────
function Overlay({ onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:1000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}
    >
      <div onClick={e => e.stopPropagation()} style={{ background:WHITE, borderRadius:"20px 20px 0 0", width:"100%", maxWidth:520, maxHeight:"85vh", overflowY:"auto", padding:"20px 20px 32px" }}>
        {children}
      </div>
    </div>
  );
}

// ── Flight Details Modal (Image #204) ────────────────────────────────────────
function FlightDetailsModal({ f, groupSize, onClose, onSeeFares }) {
  return (
    <Overlay onClose={onClose}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={onClose} style={{ width:32, height:32, borderRadius:"50%", border:`1.5px solid ${BORDER}`, background:"none", cursor:"pointer", fontSize:16, color:DARK, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        <div style={{ fontFamily:NUN, fontSize:16, fontWeight:800, color:DARK }}>Flight details</div>
      </div>

      {/* Route card */}
      <div style={{ background:"#f7f8fa", borderRadius:14, padding:"16px", marginBottom:20 }}>
        <div style={{ fontFamily:NUN, fontSize:12, fontWeight:700, color:"#888", marginBottom:14 }}>
          {f.gate || "Aviasales"}
        </div>

        {/* Departure */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
          <div>
            <div style={{ fontFamily:NUN, fontSize:16, fontWeight:800, color:DARK }}>{f.origin}</div>
            <div style={{ fontFamily:NUN, fontSize:11, color:"#888" }}>Departing airport</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:DARK }}>{fmtDate(f.departureDate)}</div>
          </div>
        </div>

        {/* Duration bar */}
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0", borderLeft:`3px solid ${HOT}`, marginLeft:4, paddingLeft:12, marginBottom:10 }}>
          <div style={{ fontFamily:NUN, fontSize:11, color:"#888" }}>
            Travel time: {f.duration || "—"}  ·  {f.stops === 0 ? "Nonstop" : f.stops === 1 ? "1 stop" : `${f.stops} stops`}
          </div>
        </div>

        {/* Arrival */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontFamily:NUN, fontSize:16, fontWeight:800, color:DARK }}>{f.dest}</div>
            <div style={{ fontFamily:NUN, fontSize:11, color:"#888" }}>Arriving airport</div>
          </div>
          {f.returnDate && (
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:DARK }}>Returns {fmtDate(f.returnDate)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Meta */}
      <div style={{ display:"flex", gap:24, marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:NUN, fontSize:10, color:"#aaa", fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Cabin</div>
          <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:DARK, marginTop:2 }}>Economy</div>
        </div>
        <div>
          <div style={{ fontFamily:NUN, fontSize:10, color:"#aaa", fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Travelers</div>
          <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:DARK, marginTop:2 }}>{groupSize} adults</div>
        </div>
        <div>
          <div style={{ fontFamily:NUN, fontSize:10, color:"#aaa", fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>From</div>
          <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:HOT, marginTop:2 }}>${f.price}/person</div>
        </div>
      </div>

      <button
        onClick={onSeeFares}
        style={{ width:"100%", padding:"14px", borderRadius:50, background:`linear-gradient(135deg,#f472b0,${HOT})`, color:WHITE, border:"none", fontFamily:NUN, fontSize:14, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 14px rgba(230,101,130,0.4)" }}
      >
        See fares
      </button>
    </Overlay>
  );
}

// ── Fares Panel (Images #205-206) ────────────────────────────────────────────
function FaresPanel({ f, groupSize, onClose, expediaUrl }) {
  return (
    <Overlay onClose={onClose}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
        <button onClick={onClose} style={{ width:32, height:32, borderRadius:"50%", border:`1.5px solid ${BORDER}`, background:"none", cursor:"pointer", fontSize:16, color:DARK, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:DARK }}>Select fare · {f.origin} → {f.dest}</div>
      </div>
      <div style={{ fontFamily:NUN, fontSize:11, color:"#aaa", marginBottom:20 }}>
        {fmtDate(f.departureDate)}{f.returnDate ? ` · Returns ${fmtDate(f.returnDate)}` : ""} · {f.duration || ""}
      </div>

      {FARE_TIERS.map(tier => {
        const tierPrice = Math.round(f.price * tier.mult);
        const tierTotal = tierPrice * groupSize;
        return (
          <div key={tier.name} style={{ border:`1.5px solid ${BORDER}`, borderRadius:16, padding:"16px", marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
              <div>
                <div style={{ fontFamily:NUN, fontSize:22, fontWeight:900, color:DARK }}>${tierPrice}</div>
                <div style={{ fontFamily:NUN, fontSize:10, color:"#aaa" }}>${tierTotal.toLocaleString()} roundtrip for {groupSize} travelers</div>
              </div>
            </div>
            <div style={{ fontFamily:NUN, fontSize:13, fontWeight:800, color:DARK, marginTop:8, marginBottom:6 }}>{tier.name}</div>
            <div style={{ fontFamily:NUN, fontSize:11, color:"#888", marginBottom:10 }}>Cabin: {tier.cabin}</div>
            {tier.perks.map((p, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                <span style={{ fontSize:13, color: p.ok ? "#2e7d32" : "#e66582" }}>{p.ok ? "✓" : "$"}</span>
                <span style={{ fontFamily:NUN, fontSize:11, color:DARK }}>{p.label}</span>
              </div>
            ))}
            <button
              onClick={() => window.open(expediaUrl, "_blank")}
              style={{ width:"100%", padding:"12px", borderRadius:50, background:`linear-gradient(135deg,#f472b0,${HOT})`, color:WHITE, border:"none", fontFamily:NUN, fontSize:13, fontWeight:800, cursor:"pointer", marginTop:12, boxShadow:"0 3px 12px rgba(230,101,130,0.35)" }}
            >
              Select
            </button>
          </div>
        );
      })}
      <div style={{ fontFamily:NUN, fontSize:10, color:"#bbb", textAlign:"center", marginTop:8 }}>
        Estimated fare tiers · Actual price confirmed at checkout on Aviasales
      </div>
    </Overlay>
  );
}

// ── Flight Row (Image #203 style) ────────────────────────────────────────────
function FlightRow({ f, groupSize, onDetails, expediaUrl }) {
  return (
    <div style={{ borderBottom:`1px solid ${BORDER}`, padding:"16px 0" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        {/* Left: route + badges */}
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:NUN, fontSize:14, fontWeight:800, color:DARK, marginBottom:4 }}>
            {f.origin} → {f.dest}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            {/* Stop badge */}
            <span style={{
              fontFamily:NUN, fontSize:10, fontWeight:700,
              color: f.stops === 0 ? "#2e7d32" : "#c9612a",
              background: f.stops === 0 ? "#e8f5e9" : "#fff3e0",
              padding:"2px 8px", borderRadius:20,
            }}>
              {f.stops === 0 ? "Nonstop" : f.stops === 1 ? "1 Stop" : `${f.stops} Stops`}
            </span>
            {f.duration && (
              <span style={{ fontFamily:NUN, fontSize:11, color:"#999", fontWeight:600 }}>{f.duration}</span>
            )}
          </div>
          <div style={{ fontFamily:NUN, fontSize:11, color:"#999" }}>
            {fmtDate(f.departureDate)}{f.returnDate ? ` — ${fmtDate(f.returnDate)}` : ""}
          </div>
        </div>

        {/* Right: price */}
        <div style={{ textAlign:"right", marginLeft:12 }}>
          <div style={{ fontFamily:NUN, fontSize:20, fontWeight:900, color:HOT, lineHeight:1 }}>
            ${f.price}
          </div>
          <div style={{ fontFamily:NUN, fontSize:9, color:"#aaa", fontWeight:600 }}>Roundtrip per traveler</div>
          <div style={{ fontFamily:NUN, fontSize:10, color:"#999", marginTop:2 }}>
            Total: <strong style={{ color:DARK }}>${f.totalPrice}</strong>
          </div>
        </div>
      </div>

      {/* Flight details link */}
      <div style={{ marginTop:10, textAlign:"right" }}>
        <button
          onClick={() => onDetails(f)}
          style={{ fontFamily:NUN, fontSize:11, fontWeight:700, color:HOT, background:"none", border:"none", cursor:"pointer", textDecoration:"underline", padding:0 }}
        >
          Flight details
        </button>
      </div>
    </div>
  );
}

// ── Main Tab ─────────────────────────────────────────────────────────────────
export default function FlightsTab({ groupSize, initialDest }) {
  const [fromCode,       setFromCode]       = useState(() => localStorage.getItem("bh_airport") || "IAH");
  const [dest,           setDest]           = useState(initialDest || null);
  const [showDestPicker, setShowDestPicker] = useState(!initialDest);
  const [depDate,        setDepDate]        = useState("");
  const [retDate,        setRetDate]        = useState("");
  const [timeFilter,     setTimeFilter]     = useState("any");
  const [flights,        setFlights]        = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState(null);
  const [detailFlight,   setDetailFlight]   = useState(null);
  const [faresFlight,    setFaresFlight]    = useState(null);

  const selectedDest = DESTS.find(d => d.id === dest);
  const minDate      = new Date().toISOString().split("T")[0];
  const usDests      = DESTS.filter(d => !d.international);
  const intlDests    = DESTS.filter(d =>  d.international);

  const visibleFlights = (flights || []).filter(f => {
    if (timeFilter === "any" || f.depHour == null) return true;
    const t = TIME_OPTIONS.find(t => t.key === timeFilter);
    return f.depHour >= t.min && f.depHour < t.max;
  });

  async function search() {
    if (!selectedDest) return;
    setLoading(true); setError(null); setFlights(null);
    try {
      const params = new URLSearchParams({ from: fromCode, to: selectedDest.airportCode, adults: String(groupSize) });
      if (depDate) params.set("date",      depDate);
      if (retDate) params.set("returnDate", retDate);
      const res  = await fetch(`/api/flights?${params}`);
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setFlights(data.flights || []);
    } catch {
      setError("Could not load flights. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SH title="Group Flight Search" sub="Real-time flights for your crew" />

      {/* From */}
      <div style={{ ...C, marginBottom:12 }}>
        <div style={labelStyle}>Flying from</div>
        <select
          value={fromCode}
          onChange={e => { setFromCode(e.target.value); localStorage.setItem("bh_airport", e.target.value); }}
          style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, appearance:"none", cursor:"pointer" }}
        >
          {AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.label}</option>)}
        </select>
      </div>

      {/* To */}
      <div style={{ ...C, marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
          <div style={labelStyle}>Flying to</div>
          {dest && !showDestPicker && (
            <button onClick={() => setShowDestPicker(true)} style={{ fontSize:11, color:HOT, fontFamily:NUN, background:"none", border:"none", cursor:"pointer", textDecoration:"underline", padding:0 }}>Change</button>
          )}
        </div>
        {dest && !showDestPicker ? (
          <div style={{ padding:"10px 12px", borderRadius:10, border:`1.5px solid ${HOT}`, background:SOFT }}>
            <div style={{ fontFamily:NUN, fontSize:13, fontWeight:700, color:DARK }}>{selectedDest?.name}</div>
            <div style={{ fontFamily:NUN, fontSize:10, color:HOT, opacity:0.8, marginTop:2 }}>{groupSize} travelers</div>
          </div>
        ) : (
          <select
            value={dest || ""}
            onChange={e => { setDest(e.target.value || null); setShowDestPicker(false); setFlights(null); }}
            style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, appearance:"none", cursor:"pointer" }}
          >
            <option value="">Choose a destination…</option>
            <optgroup label="US Cities">{usDests.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup>
            <optgroup label="International">{intlDests.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup>
          </select>
        )}
      </div>

      {/* Dates */}
      <div style={{ ...C, marginBottom:12, display:"flex", gap:10 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ ...labelStyle, marginBottom:6 }}>Departure</div>
          <input type="date" value={depDate} min={minDate}
            onChange={e => { setDepDate(e.target.value); if (retDate && e.target.value >= retDate) setRetDate(""); }}
            style={{ width:"100%", padding:"10px 8px", borderRadius:10, border:`1.5px solid ${depDate?HOT:BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, boxSizing:"border-box", display:"block" }}
          />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ ...labelStyle, marginBottom:6 }}>Return <span style={{ textTransform:"none", fontWeight:400, color:"#ccc" }}>(opt)</span></div>
          <input type="date" value={retDate} min={depDate || minDate}
            onChange={e => setRetDate(e.target.value)}
            style={{ width:"100%", padding:"10px 8px", borderRadius:10, border:`1.5px solid ${retDate?HOT:BORDER}`, fontFamily:NUN, fontSize:13, color:DARK, background:WHITE, boxSizing:"border-box", display:"block" }}
          />
        </div>
      </div>

      {/* Time filter */}
      <div style={{ ...C, marginBottom:14 }}>
        <div style={{ ...labelStyle, marginBottom:8 }}>Preferred Departure Time</div>
        <div style={{ display:"flex", gap:8 }}>
          {TIME_OPTIONS.map(t => (
            <button key={t.key} onClick={() => setTimeFilter(t.key)}
              style={{ flex:1, padding:"8px 4px", borderRadius:10, border:`1.5px solid ${timeFilter===t.key?HOT:BORDER}`, background:timeFilter===t.key?SOFT:WHITE, fontFamily:NUN, fontSize:11, fontWeight:700, color:timeFilter===t.key?HOT:"#aaa", cursor:"pointer" }}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {/* Search */}
      <button onClick={search} disabled={!selectedDest||loading}
        style={{ width:"100%", padding:"15px", borderRadius:50, marginBottom:20, background:selectedDest?`linear-gradient(135deg,#f472b0,${HOT})`:"#eee", color:selectedDest?WHITE:"#aaa", border:"none", fontFamily:NUN, fontSize:15, fontWeight:800, cursor:selectedDest?"pointer":"not-allowed", boxShadow:selectedDest?"0 4px 16px rgba(244,114,176,0.4)":"none" }}
      >
        {loading ? "Searching…" : "Search Flights"}
      </button>

      {/* Error */}
      {error && (
        <div style={{ ...C, background:"#fff3f3", border:`1.5px solid #ffcdd2`, marginBottom:14 }}>
          <div style={{ fontFamily:NUN, fontSize:13, color:"#c62828" }}>{error}</div>
        </div>
      )}

      {/* Results list */}
      {flights !== null && (
        visibleFlights.length === 0 ? (
          <div style={{ textAlign:"center", padding:"24px 0" }}>
            <div style={{ fontFamily:NUN, fontSize:14, fontWeight:700, color:DARK }}>
              {flights.length > 0 ? "No flights match that time" : "No flights found"}
            </div>
            <div style={{ fontFamily:NUN, fontSize:12, color:"#999", marginTop:4 }}>
              {flights.length > 0 ? 'Try "Any Time" to see all results' : "Try different dates or a nearby airport"}
            </div>
          </div>
        ) : (
          <div style={{ ...C, padding:"0 16px" }}>
            <div style={{ fontFamily:NUN, fontSize:12, fontWeight:700, color:"#888", marginBottom:4 }}>
              Recommended departing flights
            </div>
            <div style={{ fontFamily:NUN, fontSize:10, color:"#bbb", marginBottom:4 }}>
              {visibleFlights.length} options · {fromCode} → {selectedDest?.name}
            </div>
            {visibleFlights.map(f => (
              <FlightRow key={f.id} f={f} groupSize={groupSize} onDetails={setDetailFlight}
                expediaUrl={buildBookingUrl(fromCode, selectedDest.airportCode, depDate, retDate, groupSize)} />
            ))}
            <div style={{ fontFamily:NUN, fontSize:10, color:"#bbb", textAlign:"center", marginTop:12, paddingTop:8 }}>
              Prices per person · Booking completed securely on Aviasales
            </div>
          </div>
        )
      )}

      {/* Flight details modal */}
      {detailFlight && (
        <FlightDetailsModal
          f={detailFlight}
          groupSize={groupSize}
          onClose={() => setDetailFlight(null)}
          onSeeFares={() => { setFaresFlight(detailFlight); setDetailFlight(null); }}
        />
      )}

      {/* Fares panel */}
      {faresFlight && (
        <FaresPanel
          f={faresFlight}
          groupSize={groupSize}
          onClose={() => setFaresFlight(null)}
          expediaUrl={buildBookingUrl(fromCode, selectedDest?.airportCode || "", depDate, retDate, groupSize)}
        />
      )}
    </div>
  );
}
