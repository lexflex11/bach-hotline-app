import React from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, WHITE } from '../../constants/colors.js';
import { C, BP, BS, SM } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';
import Tag from '../ui/Tag.jsx';

export default function HomeTab({ groupSize, setGroupSize, setTab, user }) {
  return (
    <div>
      <div style={{ borderRadius:22, padding:"26px 18px", background:`linear-gradient(135deg,${SOFT} 0%,${MID} 100%)`, border:`1.5px solid ${MID}`, marginBottom:16, textAlign:"center" }}>
        <div style={{ fontSize:11, color:HOT, fontFamily:"'DM Sans',sans-serif", fontWeight:700, marginBottom:8, letterSpacing:"1.5px", textTransform:"uppercase" }}>
          Welcome back, {user?.name?.split(" ")[0]||"there"}
        </div>
        <div style={{ fontSize:40, marginBottom:8 }}><span style={{fontSize:0}}></span></div>
        <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:22, fontWeight:900, letterSpacing:"-0.5px", margin:"0 0 8px", color:DARK }}>
          Your <em style={{ color:HOT, fontStyle:"italic" }}>bach</em> trip,<br/><span style={{ color:PUNCH }}>totally handled.</span>
        </h1>
        <p style={{ fontSize:13, color:HOT, fontFamily:"'DM Sans',sans-serif", margin:"0 0 18px", opacity:0.85 }}>Flights · Stays · Eats · Split · AI Décor · Shop</p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={()=>setTab("plan")} style={{ ...BP, fontSize:13, padding:"10px 18px" }}>📋 Plan My Trip</button>
          <button onClick={()=>setTab("shop")} style={{ ...BS, fontSize:13, padding:"9px 18px" }}>🎀 Shop Now</button>
        </div>
      </div>
      <div style={{ ...C, marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>👯 Your Bride Tribe</div>
          <div style={{ fontSize:11, color:HOT, fontFamily:"'DM Sans',sans-serif", marginTop:2, opacity:0.8 }}>Prices auto-calculate for your group</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={()=>setGroupSize(Math.max(2,groupSize-1))} style={SM}>−</button>
          <span style={{ fontWeight:900, color:PUNCH, fontSize:22, minWidth:28, textAlign:"center", fontFamily:"'Playfair Display',Georgia,serif" }}>{groupSize}</span>
          <button onClick={()=>setGroupSize(groupSize+1)} style={SM}>+</button>
        </div>
      </div>
      <SH title="What do you need?" />
      {[
        { icon:"✈️", label:"Group Flights",      sub:"Real booking links via Expedia & Kayak",   tab:"flights" },
        { icon:"🏠", label:"Airbnb & Vrbo Stays", sub:"Entire homes — real booking links",        tab:"stays"   },
        { icon:"🍾", label:"Eats & Experiences",  sub:"Curated bachelorette activities",          tab:"eats"    },
        { icon:"🧾", label:"Split the Bill",       sub:"Who owes what — bride pays nothing",       tab:"split"   },
        { icon:"🔔", label:"Deal Alerts",          sub:"Get pinged when prices drop",              tab:"alerts"  },
        { icon:"🎀", label:"Party Supply Shop",    sub:"Your real Etsy products — 534 items",      tab:"shop"    },
        { icon:"✨", label:"AI Décor Visualizer",  sub:"Upload space · Pick theme · See magic",    tab:"decor"   },
      ].map(item => (
        <button key={item.tab} onClick={()=>setTab(item.tab)} style={{ ...C, display:"flex", alignItems:"center", gap:14, cursor:"pointer", textAlign:"left", width:"100%", marginBottom:8 }}>
          <span style={{ fontSize:24 }}>{item.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{item.label}</div>
            <div style={{ fontSize:11, color:HOT, fontFamily:"'DM Sans',sans-serif", marginTop:2, opacity:0.75 }}>{item.sub}</div>
          </div>
          <span style={{ color:HOT, fontSize:20 }}>›</span>
        </button>
      ))}
      <SH title="Trending Destinations 🔥" sub="Where bride tribes are booking right now" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
        {DESTS.filter(d => d.featured).map(d => (
          <button key={d.id} onClick={()=>setTab("flights")} style={{ ...C, textAlign:"left", cursor:"pointer", padding:"13px 12px", display:"block" }}>
            <div style={{ fontSize:26, marginBottom:5 }}>{d.emoji}</div>
            <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{d.name}</div>
            <div style={{ fontSize:11, color:HOT, fontFamily:"'DM Sans',sans-serif", marginTop:2, opacity:0.75 }}>{d.vibe}</div>
            <div style={{ marginTop:8 }}><Tag label={d.trend} /></div>
          </button>
        ))}
      </div>
    </div>
  );
}
