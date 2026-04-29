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
  const [showDestPicker, setShowDestPicker] = useState(!initialDest);
  const [section,  setSection]    = useState("us"); // "us" | "intl"
  const [showResults, setShowResults] = useState(false);
  const [detailOpen,  setDetailOpen]  = useState(false);

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
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{fontSize:13,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>
            Where are you going?
          </div>
          {dest && !showDestPicker && (
            <button onClick={()=>setShowDestPicker(true)} style={{fontSize:11,color:HOT,fontFamily:"'Nunito',sans-serif",background:"none",border:"none",cursor:"pointer",textDecoration:"underline",padding:0}}>
              Change
            </button>
          )}
        </div>
        {dest && !showDestPicker ? (
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:`1.5px solid ${HOT}`,background:SOFT}}>
            <span style={{fontSize:18}}>{DESTS.find(d=>d.id===dest)?.emoji || "📍"}</span>
            <div>
              <div style={{fontSize:13,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{DESTS.find(d=>d.id===dest)?.name}</div>
              <div style={{fontSize:10,color:HOT,fontFamily:"'Nunito',sans-serif",opacity:0.8}}>{groupSize} travelers</div>
            </div>
          </div>
        ) : (
          <select
            value={dest || ""}
            onChange={e => { setDest(e.target.value || null); setShowDestPicker(false); }}
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
        )}
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

      {/* ── EXPEDIA RESULTS CARD ── */}
      {showResults && selectedDest && (() => {
        const toCode = selectedDest.airportCode;
        const url = expediaFlightUrl(fromCode, toCode, depDate, retDate, groupSize, depTime, retTime);
        const fromAirport = AIRPORTS.find(a => a.code === fromCode);
        return (
          <div>
            <div style={{fontSize:11,fontWeight:700,color:HOT,fontFamily:"'Nunito',sans-serif",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12}}>
              Flight Summary
            </div>
            <div style={{...C, marginBottom:10, cursor:"pointer"}} onClick={()=>setDetailOpen(true)}>
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                <div style={{display:"flex", alignItems:"center", gap:14}}>
                  <div style={{fontSize:32}}>✈️</div>
                  <div>
                    <div style={{fontSize:15,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{fromCode} → {selectedDest.airportCode || selectedDest.name}</div>
                    <div style={{fontSize:11,color:HOT,fontFamily:"'Nunito',sans-serif",marginTop:2,opacity:0.8}}>{groupSize} travelers · {depDate || "flexible dates"}{retDate ? ` → ${retDate}` : ""}</div>
                  </div>
                </div>
                <button style={{background:"none",border:`1.5px solid ${HOT}`,borderRadius:50,padding:"6px 14px",color:HOT,fontFamily:"'Nunito',sans-serif",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                  Flight Details
                </button>
              </div>
            </div>

            {/* ── FLIGHT DETAIL MODAL ── */}
            {detailOpen && (
              <>
                <div onClick={()=>setDetailOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:500,backdropFilter:"blur(4px)"}}/>
                <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"min(92%,520px)",background:WHITE,borderRadius:20,zIndex:501,padding:"24px",boxShadow:"0 20px 60px rgba(0,0,0,0.25)",maxHeight:"90vh",overflowY:"auto"}}>
                  {/* Header */}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                    <div style={{fontSize:18,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>Flight Details</div>
                    <button onClick={()=>setDetailOpen(false)} style={{width:32,height:32,borderRadius:"50%",border:`1.5px solid ${BORDER}`,background:"none",fontSize:18,cursor:"pointer",color:DARK,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                  </div>

                  {/* Flight card */}
                  <div style={{background:"#f8f9fa",borderRadius:14,padding:"18px",marginBottom:18}}>
                    <div style={{fontSize:12,fontWeight:700,fontFamily:"'Nunito',sans-serif",color:"#555",marginBottom:14}}>✈️ Multiple Airlines Available</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:22,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{fromAirport?.label?.split(",")[0] || fromCode}</div>
                        <div style={{fontSize:11,color:"#888",fontFamily:"'Nunito',sans-serif",marginTop:2}}>{fromCode}</div>
                        <div style={{fontSize:11,color:"#aaa",fontFamily:"'Nunito',sans-serif",marginTop:4}}>{depDate || "Flexible date"}</div>
                      </div>
                      <div style={{textAlign:"center",padding:"0 12px",color:"#ccc"}}>
                        <div style={{fontSize:10,fontFamily:"'Nunito',sans-serif",color:"#aaa",marginBottom:4}}>Nonstop & 1-stop options</div>
                        <div style={{borderTop:"1.5px solid #ddd",width:80,margin:"0 auto"}}/>
                        <div style={{fontSize:18,marginTop:4}}>✈</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:22,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{selectedDest.name}</div>
                        <div style={{fontSize:11,color:"#888",fontFamily:"'Nunito',sans-serif",marginTop:2}}>{selectedDest.airportCode}</div>
                        <div style={{fontSize:11,color:"#aaa",fontFamily:"'Nunito',sans-serif",marginTop:4}}>{retDate || "Return flexible"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Trip details */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
                    {[
                      {label:"Travelers", value:`${groupSize} passengers`},
                      {label:"Trip Type",  value:retDate ? "Round Trip" : "One Way"},
                      {label:"Departure",  value:depDate || "Flexible"},
                      {label:"Return",     value:retDate || "—"},
                    ].map(r => (
                      <div key={r.label} style={{padding:"10px 12px",background:"#f8f9fa",borderRadius:10}}>
                        <div style={{fontSize:10,color:"#aaa",fontFamily:"'Nunito',sans-serif",textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>{r.label}</div>
                        <div style={{fontSize:13,fontWeight:400,color:DARK,fontFamily:"'Playfair Display',Georgia,serif"}}>{r.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* See Fares button */}
                  <button onClick={()=>{ window.open(url,"_blank"); setDetailOpen(false); }} style={{
                    width:"100%",padding:"15px",borderRadius:50,
                    background:`linear-gradient(135deg,#f472b0,${HOT})`,
                    color:WHITE,border:"none",fontSize:15,fontWeight:700,
                    fontFamily:"'Nunito',sans-serif",cursor:"pointer",
                    boxShadow:"0 4px 16px rgba(244,150,194,0.4)",
                  }}>
                    See Fares on Expedia
                  </button>
                  <div style={{fontSize:10,color:"#bbb",fontFamily:"'Nunito',sans-serif",textAlign:"center",marginTop:10}}>
                    You'll be taken to Expedia to view live prices and book
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })()}

    </div>
  );
}
