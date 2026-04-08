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
    { code:"ANYTIME",   label:"Any Time",  icon:"🕐" },
    { code:"MORNING",   label:"Morning",   icon:"🌅", sub:"6am – 12pm" },
    { code:"AFTERNOON", label:"Afternoon", icon:"☀️",  sub:"12pm – 6pm" },
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
    else if (platform === "kayak")  url = kayakFlightUrl(fromCode, toCode, depDate, groupSize);
    else if (platform === "sky")    url = skyscannerUrl(fromCode, toCode, depDate, groupSize);
    else                            url = googleFlightsUrl(fromCode, toCode, depDate, groupSize);
    window.open(url, "_blank");
  }

  return (
    <div>
      <SH title="Group Flight Search" sub="Find real flights for your whole crew" />

      {/* ── STEP 1 — Departure city ── */}
      <div style={{...C, marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>
          ✈️ Step 1 — Where are you flying from?
        </div>
        <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.8,marginBottom:10}}>
          Pick the airport closest to your group
        </div>
        <select
          value={fromCode}
          onChange={e => setFromCode(e.target.value)}
          style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${BORDER}`,fontFamily:"'DM Sans',sans-serif",fontSize:13,color:DARK,background:WHITE,appearance:"none",cursor:"pointer"}}
        >
          {AIRPORTS.map(a => (
            <option key={a.code} value={a.code}>{a.label}</option>
          ))}
        </select>
      </div>

      {/* ── STEP 2 — Destination ── */}
      <div style={{...C, marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>
          🗺️ Step 2 — Where are you going?
        </div>

        {/* US / International toggle */}
        <div style={{display:"flex",gap:6,marginBottom:12}}>
          {[["us","🇺🇸 US Cities"],["intl","🌍 International"]].map(([k,v]) => (
            <button key={k} onClick={()=>setSection(k)} style={{...BG,flex:1,padding:"8px",fontSize:12,fontWeight:700,background:section===k?HOT:WHITE,color:section===k?WHITE:HOT,border:`1.5px solid ${section===k?HOT:BORDER}`,borderRadius:10}}>
              {v}
            </button>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {(section==="us" ? usDests : intlDests).map(d => (
            <button key={d.id} onClick={()=>setDest(d.id)}
              style={{background:dest===d.id?SOFT:WHITE,border:dest===d.id?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,borderRadius:12,padding:"10px",cursor:"pointer",textAlign:"left",transition:"all 0.18s",boxShadow:dest===d.id?`0 2px 10px rgba(230,101,130,0.18)`:"none"}}>
              <div style={{fontSize:20,marginBottom:3}}>{d.emoji}</div>
              <div style={{fontSize:12,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:dest===d.id?HOT:DARK}}>{d.name}</div>
              <div style={{fontSize:10,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.75,marginTop:2}}>{d.vibe}</div>
              {d.international && <div style={{fontSize:9,marginTop:4,color:PUNCH,fontFamily:"'DM Sans',sans-serif",fontWeight:700}}>{d.trend}</div>}
            </button>
          ))}
        </div>
      </div>

      {/* ── STEP 3 — Dates & Times ── */}
      <div style={{...C, marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:12}}>
          📅 Step 3 — Dates & preferred times
        </div>

        {/* Departure row */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,color:HOT,fontFamily:"'DM Sans',sans-serif",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>✈️ Departure</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
            <input
              type="date"
              value={depDate}
              min={minDate}
              onChange={e => { setDepDate(e.target.value); if(retDate && e.target.value >= retDate) setRetDate(""); }}
              style={{width:"100%",padding:"10px 8px",borderRadius:10,border:`1.5px solid ${depDate?HOT:BORDER}`,fontFamily:"'DM Sans',sans-serif",fontSize:12,color:DARK,background:WHITE,boxSizing:"border-box"}}
            />
            <div style={{fontSize:10,color:"#bbb",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center"}}>
              {depDate ? "Pick a time below ↓" : "Add date first"}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
            {TIMES.map(t => (
              <button key={t.code} onClick={()=>setDepTime(t.code)}
                style={{padding:"8px 4px",borderRadius:10,border:`1.5px solid ${depTime===t.code?HOT:BORDER}`,background:depTime===t.code?SOFT:WHITE,cursor:"pointer",textAlign:"center"}}>
                <div style={{fontSize:14}}>{t.icon}</div>
                <div style={{fontSize:9,fontWeight:700,color:depTime===t.code?HOT:DARK,fontFamily:"'DM Sans',sans-serif",marginTop:2}}>{t.label}</div>
                {t.sub && <div style={{fontSize:8,color:"#bbb",fontFamily:"'DM Sans',sans-serif",marginTop:1,lineHeight:1.2}}>{t.sub}</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Return row */}
        <div style={{paddingTop:12,borderTop:`1px solid ${SOFT}`}}>
          <div style={{fontSize:10,color:HOT,fontFamily:"'DM Sans',sans-serif",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>🏠 Return</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
            <input
              type="date"
              value={retDate}
              min={depDate || minDate}
              onChange={e => setRetDate(e.target.value)}
              style={{width:"100%",padding:"10px 8px",borderRadius:10,border:`1.5px solid ${retDate?HOT:BORDER}`,fontFamily:"'DM Sans',sans-serif",fontSize:12,color:DARK,background:WHITE,boxSizing:"border-box"}}
            />
            <div style={{fontSize:10,color:"#bbb",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center"}}>
              {retDate ? "Pick a time below ↓" : "Leave blank = one way"}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
            {TIMES.map(t => (
              <button key={t.code} onClick={()=>setRetTime(t.code)}
                style={{padding:"8px 4px",borderRadius:10,border:`1.5px solid ${retTime===t.code?HOT:BORDER}`,background:retTime===t.code?SOFT:WHITE,cursor:"pointer",textAlign:"center"}}>
                <div style={{fontSize:14}}>{t.icon}</div>
                <div style={{fontSize:9,fontWeight:700,color:retTime===t.code?HOT:DARK,fontFamily:"'DM Sans',sans-serif",marginTop:2}}>{t.label}</div>
                {t.sub && <div style={{fontSize:8,color:"#bbb",fontFamily:"'DM Sans',sans-serif",marginTop:1,lineHeight:1.2}}>{t.sub}</div>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── SEARCH CTA ── */}
      <div style={{...C, background:SOFT, border:`1.5px solid ${MID}`, marginBottom:14}}>
        {selectedDest ? (
          <>
            <div style={{fontSize:14,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>
              {selectedDest.emoji} {fromCode} → {selectedDest.name}
            </div>
            <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginBottom:14,opacity:0.85}}>
              {groupSize} travelers · {depDate ? `${depDate}${retDate ? ` → ${retDate}` : " (one way)"}` : "flexible dates"} · real-time prices
            </div>

            {/* Search grid — 2x2 compact buttons */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button onClick={()=>open("expedia")} style={{background:"linear-gradient(135deg,#00355F,#00509E)",color:WHITE,border:"none",borderRadius:12,padding:"12px 8px",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:18}}>✈️</span>
                <span>Expedia</span>
              </button>
              <button onClick={()=>open("kayak")} style={{background:"linear-gradient(135deg,#FF690F,#e05500)",color:WHITE,border:"none",borderRadius:12,padding:"12px 8px",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:18}}>🔍</span>
                <span>Kayak</span>
              </button>
              <button onClick={()=>open("sky")} style={{background:"linear-gradient(135deg,#0770E3,#055DBF)",color:WHITE,border:"none",borderRadius:12,padding:"12px 8px",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:18}}>🛩️</span>
                <span>Skyscanner</span>
              </button>
              <button onClick={()=>open("google")} style={{background:WHITE,color:"#555",border:`1.5px solid ${BORDER}`,borderRadius:12,padding:"12px 8px",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:18}}>🔎</span>
                <span>Google</span>
              </button>
            </div>
            <div style={{fontSize:9,color:"#bbb",fontFamily:"'DM Sans',sans-serif",marginTop:8,textAlign:"center"}}>
              All search real-time prices · Opens in a new tab
            </div>
          </>
        ) : (
          <div style={{textAlign:"center",padding:"8px 0"}}>
            <div style={{fontSize:22,marginBottom:6}}>🗺️</div>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>Pick a destination above</div>
            <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginTop:4,opacity:0.75}}>Then we'll pull up real flights for {groupSize} people</div>
          </div>
        )}
      </div>

    </div>
  );
}
