import React, { useState } from 'react';
import { HOT, DARK, WHITE, BORDER, SOFT } from '../../constants/colors.js';
import { DESTS } from '../../constants/data.js';
import Tag from '../ui/Tag.jsx';

const DEST_IMAGES = {
  miami:       "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&q=80",
  nashville:   "https://images.unsplash.com/photo-1545579133-99bb5e4b8c97?w=600&q=80",
  vegas:       "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=600&q=80",
  nola:        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80",
  scottsdale:  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  austin:      "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=600&q=80",
  cabo:        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
  mykonos:     "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=600&q=80",
};

const CATEGORIES = [
  { label:"Group Flights",     sub:"Seamless travel for your entire crew",       tab:"flights",     img:"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80" },
  { label:"Accommodations",    sub:"Stay together in style",                     tab:"stays",       img:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
  { label:"Bites & Sips",      sub:"Top spots for every vibe",                  tab:"eats",        img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80" },
  { label:"Experiences",       sub:"Curated activities for your crew",           tab:"experiences", img:"https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=400&q=80" },
  { label:"Party Supply Shop", sub:"Decor, details, and party must-haves",      tab:"shop",        img:"https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80" },
];

const NUN = "'Plus Jakarta Sans',sans-serif";

export default function HomeTab({ groupSize, setGroupSize, setTab, user, city, setCity }) {
  const minDate = new Date().toISOString().split("T")[0];

  function handleSearch() {
    if (city) setTab("flights");
  }

  return (
    <div style={{ margin:"0 -14px" }}>

      {/* ── HERO IMAGE ── */}
      <div style={{ position:"relative", height:300, overflow:"hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80"
          alt="Bachelorette destination"
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 40%" }}
        />
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.18)" }} />
      </div>

      {/* ── SEARCH CARD (overlaps hero bottom) ── */}
      <div style={{ margin:"-56px 14px 32px", position:"relative", zIndex:10 }}>
        <div style={{ background:WHITE, borderRadius:22, padding:"24px 20px", boxShadow:"0 6px 32px rgba(0,0,0,0.16)" }}>
          <h1 style={{ fontFamily:NUN, fontSize:22, fontWeight:900, color:DARK, margin:"0 0 4px", letterSpacing:"-0.4px", lineHeight:1.2 }}>
            Plan your <span style={{ color:HOT }}>bach trip.</span>
          </h1>
          <p style={{ fontFamily:NUN, fontSize:12, color:"#999", margin:"0 0 18px", fontWeight:600 }}>
            Flights · Stays · Eats · Decor
          </p>

          {/* Destination */}
          <div style={{ border:`1.5px solid ${BORDER}`, borderRadius:12, padding:"10px 14px", marginBottom:10 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#aaa", fontFamily:NUN, textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>Destination</div>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              style={{ width:"100%", border:"none", outline:"none", fontFamily:NUN, fontSize:14, fontWeight:700, color: city ? DARK : "#bbb", background:"transparent", appearance:"none", cursor:"pointer", padding:0 }}
            >
              <option value="">Choose your destination…</option>
              {DESTS.filter(d => d.id !== "all").map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Group Size */}
          <div style={{ border:`1.5px solid ${BORDER}`, borderRadius:12, padding:"10px 14px", marginBottom:18, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:"#aaa", fontFamily:NUN, textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>Group Size</div>
              <div style={{ fontFamily:NUN, fontSize:14, fontWeight:700, color:DARK }}>{groupSize} girls going</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <button onClick={()=>setGroupSize(g=>Math.max(1,g-1))} style={{ width:30, height:30, borderRadius:"50%", border:`1.5px solid ${BORDER}`, background:"none", fontSize:18, color:HOT, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>−</button>
              <span style={{ fontFamily:NUN, fontSize:16, fontWeight:800, color:DARK, minWidth:20, textAlign:"center" }}>{groupSize}</span>
              <button onClick={()=>setGroupSize(g=>Math.min(50,g+1))} style={{ width:30, height:30, borderRadius:"50%", border:`1.5px solid ${BORDER}`, background:"none", fontSize:18, color:HOT, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>+</button>
            </div>
          </div>

          {/* Search CTA */}
          <button
            onClick={handleSearch}
            style={{
              width:"100%", padding:"15px", borderRadius:50,
              background:`linear-gradient(135deg,#f472b0,${HOT})`,
              color:WHITE, border:"none", fontFamily:NUN,
              fontSize:16, fontWeight:800, cursor:"pointer",
              boxShadow:"0 4px 16px rgba(244,114,176,0.45)",
              letterSpacing:"0.2px",
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div style={{ padding:"0 14px 32px" }}>
        <h2 style={{ fontFamily:NUN, fontSize:22, fontWeight:900, color:DARK, margin:"0 0 16px", letterSpacing:"-0.4px" }}>
          Everything for your bach
        </h2>

        {/* Horizontal scroll row */}
        <div style={{ display:"flex", gap:14, overflowX:"auto", WebkitOverflowScrolling:"touch", scrollbarWidth:"none", margin:"0 -14px", padding:"0 14px 4px" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.tab}
              onClick={() => setTab(cat.tab)}
              style={{ flexShrink:0, width:155, background:"none", border:"none", cursor:"pointer", textAlign:"left", padding:0 }}
            >
              <div style={{ width:155, height:155, borderRadius:16, overflow:"hidden", marginBottom:10 }}>
                <img src={cat.img} alt={cat.label} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
              <div style={{ fontFamily:NUN, fontSize:13, fontWeight:800, color:DARK, marginBottom:3 }}>
                {cat.label} &rsaquo;
              </div>
              <div style={{ fontFamily:NUN, fontSize:11, color:"#999", lineHeight:1.4, fontWeight:600 }}>
                {cat.sub}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── TRENDING DESTINATIONS ── */}
      <div style={{ padding:"0 14px 40px" }}>
        <h2 style={{ fontFamily:NUN, fontSize:22, fontWeight:900, color:DARK, margin:"0 0 4px", letterSpacing:"-0.4px" }}>
          Trending Destinations
        </h2>
        <p style={{ fontFamily:NUN, fontSize:12, color:"#999", margin:"0 0 18px", fontWeight:600 }}>
          Where bach parties are booking right now
        </p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {DESTS.filter(d => d.featured).map(d => (
            <button
              key={d.id}
              onClick={() => { setCity(d.id); setTab("stays"); }}
              style={{ background:"none", border:"none", cursor:"pointer", textAlign:"left", padding:0 }}
            >
              <div style={{ borderRadius:16, overflow:"hidden", marginBottom:9, height:130, position:"relative" }}>
                <img
                  src={DEST_IMAGES[d.id] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"}
                  alt={d.name}
                  style={{ width:"100%", height:"100%", objectFit:"cover" }}
                />
                <div style={{ position:"absolute", top:8, left:8 }}>
                  <Tag label={d.trend} />
                </div>
              </div>
              <div style={{ fontFamily:NUN, fontSize:13, fontWeight:800, color:DARK, marginBottom:2 }}>
                {d.name}
              </div>
              <div style={{ fontFamily:NUN, fontSize:11, color:"#999", fontWeight:600 }}>
                {d.vibe}
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
