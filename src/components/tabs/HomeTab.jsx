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
        <div style={{ fontSize:40, marginBottom:8 }}><span style={{fontSize:0}}></span></div>
        <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:22, fontWeight:900, letterSpacing:"-0.5px", margin:"0 0 8px", color:DARK }}>
          Your <em style={{ color:HOT, fontStyle:"italic" }}>bach</em> trip,<br/><span style={{ color:PUNCH }}>totally handled.</span>
        </h1>
        <p style={{ fontSize:13, color:HOT, fontFamily:"'Nunito',sans-serif", margin:"0 0 6px", opacity:0.85 }}>Flights · Stays · Eats · Decor</p>
      </div>
<SH title="What do you need?" weight={300} />
      {[
        { icon:"✈️", label:"Group Flights",      sub:"Seamless travel for your entire crew",     tab:"flights"      },
        { icon:"🏠", label:"Accommodations",     sub:"Stay together in style",                   tab:"stays"        },
        { icon:"🍽️", label:"Bites & Sips",        sub:"Top spots for every vibe from day to night", tab:"eats"         },
        { icon:"🎉", label:"Experiences",        sub:"Curated activities for your perfect itinerary", tab:"experiences"  },
        { icon:"🎀", label:"Party Supply Shop",  sub:"Decor, details, and party must haves",     tab:"shop"         },
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
          <button key={d.id} onClick={()=>setTab("flights")} style={{ ...C, textAlign:"left", cursor:"pointer", padding:"13px 12px", display:"block" }}>
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
