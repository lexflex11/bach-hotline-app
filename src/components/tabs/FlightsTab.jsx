import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE, GREEN } from '../../constants/colors.js';
import { C, BP, BS, BG } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import { kayakFlightUrl, skyscannerUrl, googleFlightsUrl, AFFILIATE } from '../../constants/api.js';
import SH from '../ui/SH.jsx';
import CommissionNote from '../ui/CommissionNote.jsx';

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
  const [dest,     setDest]       = useState(null);
  const [section,  setSection]    = useState("us"); // "us" | "intl"

  const selectedDest = DESTS.find(d => d.id === dest);
  const minDate      = new Date().toISOString().split("T")[0];
  const hasAffiliate = AFFILIATE.kayak || AFFILIATE.skyscanner;

  function open(platform) {
    if (!selectedDest) return;
    const toCode = selectedDest.airportCode;
    const date   = depDate || "";
    let url;
    if (platform === "kayak")       url = kayakFlightUrl(fromCode, toCode, date, groupSize);
    else if (platform === "sky")    url = skyscannerUrl(fromCode, toCode, date, groupSize);
    else                            url = googleFlightsUrl(fromCode, toCode, date, groupSize);
    window.open(url, "_blank");
  }

  return (
    <div>
      <SH title="Group Flight Search" sub="Find real flights for your whole crew" />

      {/* Affiliate earn note */}
      <CommissionNote platform="Kayak & Skyscanner" amount="2–5%" />

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

      {/* ── STEP 3 — Date (optional) ── */}
      <div style={{...C, marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>
          📅 Step 3 — When are you going? <span style={{fontSize:10,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>(optional but helps narrow results)</span>
        </div>
        <input
          type="date"
          value={depDate}
          min={minDate}
          onChange={e => setDepDate(e.target.value)}
          style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${BORDER}`,fontFamily:"'DM Sans',sans-serif",fontSize:13,color:DARK,background:WHITE,boxSizing:"border-box"}}
        />
        {!depDate && <div style={{fontSize:10,color:"#bbb",fontFamily:"'DM Sans',sans-serif",marginTop:5}}>Leave blank to see all upcoming flights</div>}
      </div>

      {/* ── SEARCH CTA ── */}
      <div style={{...C, background:SOFT, border:`1.5px solid ${MID}`, marginBottom:14}}>
        {selectedDest ? (
          <>
            <div style={{fontSize:14,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>
              {selectedDest.emoji} {fromCode} → {selectedDest.name}
            </div>
            <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginBottom:14,opacity:0.85}}>
              {groupSize} travelers · {depDate || "flexible dates"} · searching real-time prices
            </div>

            {/* Kayak — primary */}
            <button onClick={()=>open("kayak")} style={{...BP,width:"100%",fontSize:13,padding:"13px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <span>🔍</span>
              <span>Search Kayak for {groupSize} People</span>
              <span style={{fontSize:10,opacity:0.75}}>→</span>
            </button>

            {/* Skyscanner */}
            <button onClick={()=>open("sky")} style={{width:"100%",background:"linear-gradient(135deg,#0770E3,#055DBF)",color:WHITE,border:"none",borderRadius:50,padding:"12px",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:8}}>
              🛩️ Search Skyscanner →
            </button>

            {/* Google Flights — free */}
            <button onClick={()=>open("google")} style={{width:"100%",background:WHITE,color:"#555",border:`1.5px solid ${BORDER}`,borderRadius:50,padding:"11px",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,cursor:"pointer"}}>
              🔎 Google Flights (free backup)
            </button>

            <div style={{fontSize:9,color:"#bbb",fontFamily:"'DM Sans',sans-serif",marginTop:10,textAlign:"center"}}>
              Prices update in real time on each platform · Results open in a new tab
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

      {/* ── AFFILIATE SETUP NOTE (only shown if no affiliate IDs yet) ── */}
      {!hasAffiliate && (
        <div style={{...C, background:"#fffbea", border:"1.5px solid #f0d060", marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#9a7000",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>
            💰 Ready to earn commission on these searches?
          </div>
          <div style={{fontSize:12,color:DARK,fontFamily:"'DM Sans',sans-serif",marginBottom:10,opacity:0.85,lineHeight:1.5}}>
            Sign up for free affiliate accounts — you earn 2–5% every time someone books a flight from your app. No cost to join.
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <a href="https://www.kayak.com/affiliate-program" target="_blank" rel="noreferrer"
              style={{...BP,fontSize:11,padding:"8px 14px",textDecoration:"none",display:"block",textAlign:"center"}}>
              Kayak Affiliate Program →
            </a>
            <a href="https://www.partners.skyscanner.net" target="_blank" rel="noreferrer"
              style={{...BS,fontSize:11,padding:"7px 14px",textDecoration:"none",display:"block",textAlign:"center"}}>
              Skyscanner Partner Program →
            </a>
          </div>
        </div>
      )}

      {/* ── HOW IT WORKS ── */}
      <div style={{...C}}>
        <div style={{fontSize:12,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>How group flight search works</div>
        {[
          ["🏠","Pick your departure city","Select the airport closest to most of your group"],
          ["📍","Choose your destination","All 24 bach hotspots — US & international"],
          ["📅","Add your dates (optional)","Helps the search engine show the right flights"],
          ["🔍","Search on Kayak or Skyscanner","Opens in a new tab with your group size pre-filled"],
          ["✈️","Book directly on the platform","Real-time prices, real seats, real booking confirmation"],
        ].map(([icon,title,sub],i) => (
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:i<4?12:0,paddingBottom:i<4?12:0,borderBottom:i<4?`1px solid ${SOFT}`:"none"}}>
            <div style={{fontSize:20,flexShrink:0}}>{icon}</div>
            <div>
              <div style={{fontSize:12,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{title}</div>
              <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginTop:2,opacity:0.8}}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
