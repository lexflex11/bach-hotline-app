import React, { useState, useEffect } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE, GREEN } from '../../constants/colors.js';
import { C, BP, BS, BG } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import { expediaFlightUrl, kayakFlightUrl, skyscannerUrl, googleFlightsUrl, AFFILIATE } from '../../constants/api.js';
import SH from '../ui/SH.jsx';

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

function getNearestAirport(lat, lng) {
  let nearest = AIRPORTS[0], minDist = Infinity;
  for (const a of AIRPORTS) {
    const d = Math.hypot(a.lat - lat, a.lng - lng);
    if (d < minDist) { minDist = d; nearest = a; }
  }
  return nearest.code;
}

const usDests    = DESTS.filter(d => !d.international);
const intlDests  = DESTS.filter(d =>  d.international);

export default function FlightsTab({ groupSize, initialDest }) {
  const [fromCode, setFromCode]   = useState(() => localStorage.getItem("bh_airport") || "IAH");
  const [depDate,  setDepDate]    = useState("");
  const [retDate,  setRetDate]    = useState("");
  const [depTime,  setDepTime]    = useState("ANYTIME");
  const [retTime,  setRetTime]    = useState("ANYTIME");
  const [dest,     setDest]       = useState(initialDest || null);
  const [section,  setSection]    = useState("us"); // "us" | "intl"
  const [showResults, setShowResults] = useState(false);

  // Auto-detect nearest airport on first visit
  useEffect(() => {
    if (localStorage.getItem("bh_airport")) return; // already detected
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const code = getNearestAirport(coords.latitude, coords.longitude);
        setFromCode(code);
        localStorage.setItem("bh_airport", code);
      },
      () => {} // silently ignore if denied
    );
  }, []);

  const TIMES = [
    { code:"ANYTIME",   label:"Any Time",  icon:null },
    { code:"MORNING",   label:"Morning",   icon:null, sub:"6am – 12pm" },
    { code:"AFTERNOON", label:"Afternoon", icon:null, sub:"12pm – 6pm" },
    { code:"EVENING",   label:"Evening",   icon:"🌙", sub:"6pm – midnight" },
  ];

  const selectedDest = DESTS.find(d => d.id === dest);
  const minDate      = new Date().toISOString().split("T")[0];
  const hasAffiliate = AFFILIATE.expedia || AFFILIATE.kayak || AFFILIATE.skyscanner;

  function open(platform) {
    if (!selectedDest) return;
    const toCode = selectedDest.airportCode;
    let url;
    if (platform === "expedia")     url = expediaFlightUrl(fromCode, toCode, depDate, retDate, groupSize, depTime, retTime);
    else if (platform === "kayak")  url = kayakFlightUrl(fromCode, toCode, depDate, retDate, groupSize);
    else if (platform === "sky")    url = skyscannerUrl(fromCode, toCode, depDate, retDate, groupSize);
    else                            url = googleFlightsUrl(fromCode, toCode, depDate, retDate, groupSize);
    window.open(url, "_blank");
  }

  return (
    <div>
      <SH title="Group Flight Search" sub="Find real flights for your whole crew" />

      {/* ── STEP 1 — Departure city ── */}
      <div style={{...C, marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>
          Where are you flying from?
        </div>
        <div style={{fontSize:11,color:HOT,fontFamily:"'Nunito',sans-serif",opacity:0.8,marginBottom:10}}>
          Pick the airport closest to your group
        </div>
        <select
          value={fromCode}
          onChange={e => { setFromCode(e.target.value); localStorage.setItem("bh_airport", e.target.value); }}
          style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${BORDER}`,fontFamily:"'Nunito',sans-serif",fontSize:13,color:DARK,background:WHITE,appearance:"none",cursor:"pointer"}}
        >
          {AIRPORTS.map(a => (
            <option key={a.code} value={a.code}>{a.label}</option>
          ))}
        </select>
      </div>

      {/* ── STEP 2 — Destination ── */}
      <div style={{...C, marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>
          Where are you going?
        </div>
        <select
          value={dest || ""}
          onChange={e => setDest(e.target.value || null)}
          style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${BORDER}`,fontFamily:"'Nunito',sans-serif",fontSize:13,color:DARK,background:WHITE,appearance:"none",cursor:"pointer"}}
        >
          <option value="">Choose a city…</option>
          <optgroup label="US Cities">
            {usDests.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </optgroup>
          <optgroup label="International">
            {intlDests.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </optgroup>
        </select>
      </div>

      {/* ── STEP 3 — Dates & Times ── */}
      <div style={{...C, marginBottom:14, overflow:"hidden"}}>


        {/* Departure row */}
        <div style={{marginBottom:14, overflow:"hidden"}}>
          <div style={{fontSize:10,color:HOT,fontFamily:"'Nunito',sans-serif",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Departure</div>
          <div style={{marginBottom:8, overflow:"hidden", borderRadius:10}}>
            <input
              type="date"
              value={depDate}
              min={minDate}
              onChange={e => { setDepDate(e.target.value); if(retDate && e.target.value >= retDate) setRetDate(""); }}
              style={{width:"100%",padding:"10px 8px",borderRadius:10,border:`1.5px solid ${depDate?HOT:BORDER}`,fontFamily:"'Nunito',sans-serif",fontSize:12,color:DARK,background:WHITE,boxSizing:"border-box",display:"block"}}
            />
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
            {TIMES.map(t => (
              <button key={t.code} onClick={()=>setDepTime(t.code)}
                style={{padding:"8px 4px",borderRadius:10,border:`1.5px solid ${depTime===t.code?HOT:BORDER}`,background:depTime===t.code?SOFT:WHITE,cursor:"pointer",textAlign:"center"}}>
                <div style={{fontSize:9,fontWeight:700,color:depTime===t.code?HOT:DARK,fontFamily:"'Nunito',sans-serif",marginTop:2}}>{t.label}</div>
                {t.sub && <div style={{fontSize:8,color:"#bbb",fontFamily:"'Nunito',sans-serif",marginTop:1,lineHeight:1.2}}>{t.sub}</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Return row */}
        <div style={{paddingTop:12,borderTop:`1px solid ${SOFT}`, overflow:"hidden"}}>
          <div style={{fontSize:10,color:HOT,fontFamily:"'Nunito',sans-serif",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Return</div>
          <div style={{marginBottom:8, overflow:"hidden", borderRadius:10}}>
            <input
              type="date"
              value={retDate}
              min={depDate || minDate}
              onChange={e => setRetDate(e.target.value)}
              style={{width:"100%",padding:"10px 8px",borderRadius:10,border:`1.5px solid ${retDate?HOT:BORDER}`,fontFamily:"'Nunito',sans-serif",fontSize:12,color:DARK,background:WHITE,boxSizing:"border-box",display:"block"}}
            />
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
            {TIMES.map(t => (
              <button key={t.code} onClick={()=>setRetTime(t.code)}
                style={{padding:"8px 4px",borderRadius:10,border:`1.5px solid ${retTime===t.code?HOT:BORDER}`,background:retTime===t.code?SOFT:WHITE,cursor:"pointer",textAlign:"center"}}>
                <div style={{fontSize:9,fontWeight:700,color:retTime===t.code?HOT:DARK,fontFamily:"'Nunito',sans-serif",marginTop:2}}>{t.label}</div>
                {t.sub && <div style={{fontSize:8,color:"#bbb",fontFamily:"'Nunito',sans-serif",marginTop:1,lineHeight:1.2}}>{t.sub}</div>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── SEARCH CTA ── */}
      <div style={{...C, background:SOFT, border:`1.5px solid ${MID}`, marginBottom:14}}>
        {selectedDest ? (
          <>
            <div style={{fontSize:14,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>
              {fromCode} → {selectedDest.name}
            </div>
            <div style={{fontSize:11,color:HOT,fontFamily:"'Nunito',sans-serif",marginBottom:14,opacity:0.85}}>
              {groupSize} travelers · {depDate ? `${depDate}${retDate ? ` → ${retDate}` : " (one way)"}` : "flexible dates"} · real-time prices
            </div>
            <button onClick={()=>setShowResults(true)} style={{
              width:"100%",
              background:`linear-gradient(135deg,#f472b0,${HOT})`,
              color:WHITE, border:"none", borderRadius:14,
              padding:"15px", cursor:"pointer",
              fontFamily:"'Nunito',sans-serif", fontSize:14, fontWeight:800,
              letterSpacing:"0.3px",
            }}>
              Find Best Prices
            </button>
            <div style={{fontSize:10,color:"#bbb",fontFamily:"'Nunito',sans-serif",marginTop:8,textAlign:"center"}}>
              We'll scan and surface the best available fares for your group
            </div>
          </>
        ) : (
          <div style={{textAlign:"center",padding:"8px 0"}}>
            <div style={{fontSize:13,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>Pick a destination above</div>
            <div style={{fontSize:11,color:HOT,fontFamily:"'Nunito',sans-serif",marginTop:4,opacity:0.75}}>Then we'll pull up real flights for {groupSize} people</div>
          </div>
        )}
      </div>

      {/* ── FLIGHT PLATFORM CARDS ── */}
      {showResults && selectedDest && (() => {
        const toCode = selectedDest.airportCode;
        const platforms = [
          {
            key:"google",
            name:"Google Flights",
            logo:"🔍",
            desc:"Best overall price comparison — shows all airlines side by side",
            badge:"Most Popular",
            url: googleFlightsUrl(fromCode, toCode, depDate, retDate, groupSize),
          },
          {
            key:"expedia",
            name:"Expedia",
            logo:"✈️",
            desc:"Book flights + hotel together for group package deals",
            badge:"Bundle & Save",
            url: expediaFlightUrl(fromCode, toCode, depDate, retDate, groupSize, depTime, retTime),
          },
          {
            key:"kayak",
            name:"Kayak",
            logo:"🛫",
            desc:"Flexible date search and price alerts for your group",
            badge:"Price Alerts",
            url: kayakFlightUrl(fromCode, toCode, depDate, retDate, groupSize),
          },
          {
            key:"sky",
            name:"Skyscanner",
            logo:"🌐",
            desc:"Searches hundreds of airlines including budget carriers",
            badge:"Lowest Fares",
            url: skyscannerUrl(fromCode, toCode, depDate, retDate, groupSize),
          },
        ];
        return (
          <div>
            <div style={{fontSize:11,fontWeight:700,color:HOT,fontFamily:"'Nunito',sans-serif",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12}}>
              Live Flight Results — {fromCode} → {selectedDest.name}
            </div>
            {platforms.map(p => (
              <div key={p.key} style={{...C, marginBottom:10, cursor:"pointer"}} onClick={()=>window.open(p.url,"_blank")}>
                <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                  <div style={{display:"flex", alignItems:"center", gap:12}}>
                    <div style={{fontSize:28}}>{p.logo}</div>
                    <div>
                      <div style={{fontSize:14,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{p.name}</div>
                      <div style={{fontSize:11,color:HOT,fontFamily:"'Nunito',sans-serif",marginTop:2,opacity:0.8}}>{p.desc}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
                    <span style={{fontSize:9,fontWeight:700,color:HOT,fontFamily:"'Nunito',sans-serif",background:SOFT,border:`1px solid ${MID}`,borderRadius:50,padding:"3px 8px",whiteSpace:"nowrap"}}>{p.badge}</span>
                    <span style={{color:HOT,fontSize:18}}>›</span>
                  </div>
                </div>
                <div style={{marginTop:12,padding:"8px 12px",background:SOFT,borderRadius:10,fontSize:11,fontFamily:"'Nunito',sans-serif",color:HOT}}>
                  {groupSize} travelers · {depDate || "flexible dates"}{retDate ? ` → ${retDate}` : ""} · tap to see live prices
                </div>
              </div>
            ))}
            <div style={{fontSize:10,color:"#bbb",fontFamily:"'Nunito',sans-serif",textAlign:"center",marginTop:4,marginBottom:16}}>
              Prices update in real time — tap any platform to search live fares
            </div>
          </div>
        );
      })()}

    </div>
  );
}
