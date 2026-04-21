import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE, GREEN } from '../../constants/colors.js';
import { C, BP, BS, BG } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import { expediaFlightUrl, kayakFlightUrl, skyscannerUrl, googleFlightsUrl, AFFILIATE } from '../../constants/api.js';
import SH from '../ui/SH.jsx';

// Common US departure airports — sorted by bachelorette trip volume
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
  { code:"STL", label:"St. Louis, MO (STL)" },
  { code:"BNA", label:"Nashville, TN (BNA)" },
  { code:"RDU", label:"Raleigh-Durham, NC (RDU)" },
  { code:"SLC", label:"Salt Lake City, UT (SLC)" },
];

const usDests    = DESTS.filter(d => !d.international);
const intlDests  = DESTS.filter(d =>  d.international);

export default function FlightsTab({ groupSize }) {
  const [fromCode, setFromCode]   = useState("IAH");
  const [depDate,  setDepDate]    = useState("");
  const [retDate,  setRetDate]    = useState("");
  const [depTime,  setDepTime]    = useState("ANYTIME");
  const [retTime,  setRetTime]    = useState("ANYTIME");
  const [dest,     setDest]       = useState(null);
  const [section,  setSection]    = useState("us"); // "us" | "intl"

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
          onChange={e => setFromCode(e.target.value)}
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
      <div style={{...C, marginBottom:14}}>


        {/* Departure row */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,color:HOT,fontFamily:"'Nunito',sans-serif",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Departure</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
            <input
              type="date"
              value={depDate}
              min={minDate}
              onChange={e => { setDepDate(e.target.value); if(retDate && e.target.value >= retDate) setRetDate(""); }}
              style={{width:"100%",padding:"10px 8px",borderRadius:10,border:`1.5px solid ${depDate?HOT:BORDER}`,fontFamily:"'Nunito',sans-serif",fontSize:12,color:DARK,background:WHITE,boxSizing:"border-box"}}
            />
            <div style={{fontSize:10,color:"#bbb",fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center"}}>
              {depDate ? "Pick a time below ↓" : "Add date first"}
            </div>
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
        <div style={{paddingTop:12,borderTop:`1px solid ${SOFT}`}}>
          <div style={{fontSize:10,color:HOT,fontFamily:"'Nunito',sans-serif",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Return</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
            <input
              type="date"
              value={retDate}
              min={depDate || minDate}
              onChange={e => setRetDate(e.target.value)}
              style={{width:"100%",padding:"10px 8px",borderRadius:10,border:`1.5px solid ${retDate?HOT:BORDER}`,fontFamily:"'Nunito',sans-serif",fontSize:12,color:DARK,background:WHITE,boxSizing:"border-box"}}
            />
            <div style={{fontSize:10,color:"#bbb",fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center"}}>
              {retDate ? "Pick a time below ↓" : "Leave blank = one way"}
            </div>
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

            <button onClick={()=>open("google")} style={{
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

    </div>
  );
}
