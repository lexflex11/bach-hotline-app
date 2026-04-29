import React, { useState } from 'react';
import { WHITE, SOFT, MID, HOT, PUNCH, DARK, BORDER } from '../../constants/colors.js';
import { C, SM } from '../../constants/styles.js';
import { DESTS, BUDGET_DATA } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

function MembersGate({ onSignUp }) {
  return (
    <div style={{ textAlign:"center", padding:"48px 24px" }}>
      <div style={{ fontSize:52, marginBottom:16 }}></div>
      <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:26, fontWeight:400, color:"#f496c3", margin:"0 0 10px" }}>
        Members Only
      </h2>
      <p style={{ fontSize:14, color:DARK, fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:1.7, maxWidth:280, margin:"0 auto 24px" }}>
        The Budget Calculator is exclusive to Bach Hotline members. Create a free account to unlock full trip cost estimates and planning tools.
      </p>
      <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:300, margin:"0 auto" }}>
        {[
          ["","Full trip cost breakdown"],
          ["","Hotel, flights & activities"],
          ["","Per-person cost calculator"],
          ["","Budget vs. luxury estimates"],
        ].map(([icon, label]) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:10, background:SOFT, borderRadius:12, padding:"10px 14px" }}>
            <span style={{ fontSize:18 }}>{icon}</span>
            <span style={{ fontSize:13, fontFamily:"'Plus Jakarta Sans',sans-serif", color:DARK, fontWeight:600 }}>{label}</span>
          </div>
        ))}
      </div>
      <button onClick={onSignUp} style={{
        marginTop:28, background:`linear-gradient(135deg,#f472b0,${HOT})`, color:WHITE,
        border:"none", borderRadius:50, padding:"13px 32px",
        fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, fontWeight:700,
        cursor:"pointer", width:"100%", maxWidth:300,
        boxShadow:"0 4px 16px rgba(244,150,194,0.4)",
      }}>
        Create Free Account →
      </button>
    </div>
  );
}

export default function BudgetTab({ groupSize, user, onSignUp }) {
  if (!user || user.id === "g") return <MembersGate onSignUp={onSignUp} />;
  const [dest, setDest] = useState(null);
  const [nights, setNights] = useState(3);
  const [tier, setTier] = useState("mid"); // budget | mid | luxury

  const tiers = { budget:0, mid:0.5, luxury:1 };
  const tierLabels = { budget:"Budget", mid:"Mid-Range", luxury:"Luxury" };

  const calcCost = (range) => {
    const t = tiers[tier];
    return Math.round(range[0] + (range[1] - range[0]) * t);
  };

  const bd = dest ? BUDGET_DATA[dest] : null;
  const breakdown = bd ? {
    flights:    calcCost(bd.flights),
    stay:       calcCost(bd.stay) * nights,
    food:       calcCost(bd.food),
    activities: calcCost(bd.activities),
    misc:       calcCost(bd.misc),
  } : null;

  const total      = breakdown ? Object.values(breakdown).reduce((a,b)=>a+b,0) : 0;
  const groupTotal = total * groupSize;
  const brideShare = total; // bride's share covered by group
  const perPerson  = groupSize > 1 ? Math.round((total * groupSize + brideShare) / (groupSize)) : total;

  return (
    <div>
      <SH title="Budget Calculator" sub="Estimate the full trip cost before committing" />

      {/* Destination */}
      <div style={{...C, marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:400,fontFamily:"'Plus Jakarta Sans',sans-serif",color:DARK,marginBottom:12}}> Pick a destination</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {DESTS.map(d=>(
            <button key={d.id} onClick={()=>setDest(d.id)} style={{background:dest===d.id?SOFT:WHITE,border:dest===d.id?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,borderRadius:12,padding:"10px",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}>
              <div style={{fontSize:18,marginBottom:3}}>{d.emoji}</div>
              <div style={{fontSize:12,fontWeight:400,fontFamily:"'Plus Jakarta Sans',sans-serif",color:DARK}}>{d.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Nights + Tier */}
      <div style={{...C, marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",color:HOT,textTransform:"uppercase",letterSpacing:1}}>Nights</div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginTop:6}}>
              <button onClick={()=>setNights(Math.max(1,nights-1))} style={SM}>−</button>
              <span style={{fontWeight:900,color:PUNCH,fontSize:18,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{nights}</span>
              <button onClick={()=>setNights(nights+1)} style={SM}>+</button>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",color:HOT,textTransform:"uppercase",letterSpacing:1}}>Group of</div>
            <div style={{fontSize:20,fontWeight:900,color:PUNCH,fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:4}}>{groupSize} </div>
          </div>
        </div>
        <div style={{fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",color:HOT,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Budget Style</div>
        <div style={{display:"flex",gap:6}}>
          {Object.entries(tierLabels).map(([k,v])=>(
            <button key={k} onClick={()=>setTier(k)} style={{flex:1,padding:"10px 6px",borderRadius:12,border:tier===k?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,background:tier===k?SOFT:WHITE,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,fontWeight:700,color:tier===k?HOT:DARK,transition:"all 0.2s"}}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {breakdown && (
        <div>
          {/* Total hero */}
          <div style={{borderRadius:18,padding:"22px 18px",background:`linear-gradient(135deg,${SOFT},${MID})`,border:`1.5px solid ${MID}`,marginBottom:14,textAlign:"center"}}>
            <div style={{fontSize:11,color:HOT,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Estimated Per Person</div>
            <div style={{fontSize:42,fontWeight:900,color:PUNCH,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>${perPerson}</div>
            <div style={{fontSize:12,color:HOT,fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:6,opacity:0.8}}>
              {nights} nights · Group of {groupSize} · Bride's share covered 
            </div>
            <div style={{fontSize:13,color:DARK,fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:8,fontWeight:600}}>
              Group total: ${groupTotal.toLocaleString()}
            </div>
          </div>

          {/* Line items */}
          {[
            ["", "Flights",    breakdown.flights,    "Round trip per person"],
            ["", "Stay",       breakdown.stay,       `${nights} nights · split ${groupSize} ways`],
            ["","Food & Drinks",breakdown.food,      "Meals + nightlife per person"],
            ["", "Activities", breakdown.activities, "Tours, experiences, shows"],
            ["", "Misc & Swag",breakdown.misc,       "Tips, extras, party supplies"],
          ].map(([icon,label,cost,sub])=>(
            <div key={label} style={{...C,marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:22}}>{icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:400,fontFamily:"'Plus Jakarta Sans',sans-serif",color:DARK}}>{label}</div>
                <div style={{fontSize:11,color:HOT,fontFamily:"'Plus Jakarta Sans',sans-serif",opacity:0.75}}>{sub}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:17,fontWeight:900,color:HOT,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>${cost}</div>
                <div style={{fontSize:10,color:"#bbb",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>per person</div>
              </div>
            </div>
          ))}

          <div style={{background:SOFT,border:`1.5px solid ${MID}`,borderRadius:12,padding:"11px 14px",marginTop:6,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:DARK}}>
            <div style={{fontSize:10,fontWeight:700,color:HOT,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}> Tip</div>
            These are estimates based on real bachelorette trip data. Actual costs vary by season, destination, and group size.
          </div>
        </div>
      )}
    </div>
  );
}
