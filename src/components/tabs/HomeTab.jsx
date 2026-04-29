import React from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, WHITE, BORDER } from '../../constants/colors.js';
import { C, BP, BS, SM } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';
import Tag from '../ui/Tag.jsx';

export default function HomeTab({ groupSize, setGroupSize, setTab, user, city, setCity }) {
  const selectedDest = DESTS.find(d => d.id === city);

  return (
    <div>
      {/* Hero */}
      <div style={{ borderRadius:22, padding:"26px 18px", background:`linear-gradient(135deg,${SOFT} 0%,${MID} 100%)`, border:`1.5px solid ${MID}`, marginBottom:16, textAlign:"center" }}>
        <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:22, fontWeight:900, letterSpacing:"-0.5px", margin:"0 0 8px", color:DARK }}>
          Your <em style={{ color:HOT, fontStyle:"italic" }}>bach</em> trip,<br/><span style={{ color:PUNCH }}>totally handled.</span>
        </h1>
        <p style={{ fontSize:13, color:HOT, fontFamily:"'Nunito',sans-serif", margin:"0 0 6px", opacity:0.85 }}>Flights · Stays · Eats · Decor</p>
      </div>

      {/*  Trip Setup  */}
      <div style={{ ...C, marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:14 }}>
          Plan your trip
        </div>

        {/* Destination */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Destination</div>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${city ? HOT : BORDER}`, fontFamily:"'Nunito',sans-serif", fontSize:13, color: city ? DARK : "#aaa", background:WHITE, appearance:"none", boxSizing:"border-box", cursor:"pointer" }}
          >
            <option value="">Choose your destination…</option>
            {DESTS.filter(d => d.id !== "all").map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Group Size */}
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Group Size</div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={()=>setGroupSize(g=>Math.max(1,g-1))} style={{ width:26, height:26, borderRadius:"50%", border:`1.5px solid ${BORDER}`, background:"none", fontSize:16, color:HOT, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
            <div style={{ textAlign:"center", minWidth:36 }}>
              <div style={{ fontSize:18, fontWeight:300, color:DARK, fontFamily:"'Playfair Display',Georgia,serif", lineHeight:1 }}>{groupSize}</div>
              <div style={{ fontSize:9, color:HOT, fontFamily:"'Nunito',sans-serif", marginTop:2, opacity:0.75 }}>girls going</div>
            </div>
            <button onClick={()=>setGroupSize(g=>Math.min(50,g+1))} style={{ width:26, height:26, borderRadius:"50%", border:`1.5px solid ${BORDER}`, background:"none", fontSize:16, color:HOT, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
          </div>
        </div>

      </div>

      <SH title="What do you need?" weight={300} />
      {[
        { icon:"", label:"Group Flights",      sub:"Seamless travel for your entire crew",          tab:"flights"      },
        { icon:"", label:"Accommodations",     sub:"Stay together in style",                        tab:"stays"        },
        { icon:"", label:"Bites & Sips",       sub:"Top spots for every vibe from day to night",   tab:"eats"         },
        { icon:"", label:"Experiences",        sub:"Curated activities for your perfect itinerary", tab:"experiences"  },
        { icon:"", label:"Party Supply Shop",  sub:"Decor, details, and party must haves",          tab:"shop"         },
      ].map(item => (
        <button key={item.tab} onClick={()=>setTab(item.tab)} style={{ ...C, display:"flex", alignItems:"center", gap:14, cursor:"pointer", textAlign:"left", width:"100%", marginBottom:8 }}>
          <span style={{ fontSize:24 }}>{item.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{item.label}</div>
            <div style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif", marginTop:2, opacity:0.75 }}>{item.sub}</div>
          </div>
          <span style={{ color:HOT, fontSize:20 }}>›</span>
        </button>
      ))}
      <SH title="Trending Destinations" weight={300} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
        {DESTS.filter(d => d.featured).map(d => (
          <button key={d.id} onClick={()=>{ setCity(d.id); setTab("flights"); }} style={{ ...C, textAlign:"left", cursor:"pointer", padding:"13px 12px", display:"block" }}>
            <div style={{ fontSize:26, marginBottom:5 }}>{d.emoji}</div>
            <div style={{ fontSize:13, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{d.name}</div>
            <div style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif", marginTop:2, opacity:0.75 }}>{d.vibe}</div>
            <div style={{ marginTop:8 }}><Tag label={d.trend} /></div>
          </button>
        ))}
      </div>
    </div>
  );
}
