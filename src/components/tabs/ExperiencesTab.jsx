import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C, BP } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

// ─── Popular picks data — swap image URLs and links as you get real ones ───────
const PICKS = [
  {
    id:"drag-brunch",
    name:"Drag Brunch",
    category:"Brunch",
    price:"$$$",
    rating:4.9,
    image:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
    url:"https://www.viator.com/searchResults/all?text=drag+brunch+bachelorette",
  },
  {
    id:"yacht-charter",
    name:"Yacht Charter",
    category:"Experience",
    price:"$$$$",
    rating:5.0,
    image:"https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400&q=80",
    url:"https://www.viator.com/searchResults/all?text=yacht+charter+bachelorette",
  },
  {
    id:"spa-day",
    name:"Spa Day",
    category:"Spa",
    price:"$$$",
    rating:4.8,
    image:"https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80",
    url:"https://www.viator.com/searchResults/all?text=spa+day+bachelorette",
  },
  {
    id:"rooftop-party",
    name:"Rooftop Party",
    category:"Nightlife",
    price:"$$$",
    rating:4.7,
    image:"https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=400&q=80",
    url:"https://www.viator.com/searchResults/all?text=rooftop+nightlife+bachelorette",
  },
  {
    id:"bar-crawl",
    name:"Bar Crawl",
    category:"Nightlife",
    price:"$$",
    rating:4.9,
    image:"https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80",
    url:"https://www.viator.com/searchResults/all?text=bar+crawl+bachelorette",
  },
  {
    id:"cooking-class",
    name:"Cooking Class",
    category:"Classes",
    price:"$$",
    rating:4.8,
    image:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    url:"https://www.viator.com/searchResults/all?text=cooking+class+bachelorette",
  },
];

export default function ExperiencesTab({ groupSize: initialGroupSize, setGroupSize: setGlobalGroupSize, user }) {
  const [city,       setCity]      = useState("");
  const [date,       setDate]      = useState("");
  const [vibe,       setVibe]      = useState("");
  const [groupSize,  setGroupSize] = useState(initialGroupSize || 8);

  const savedKey = user ? `bh_exp_saved_${user.id}` : null;
  const [saved, setSaved] = useState(() => {
    if (!savedKey) return [];
    try { return JSON.parse(localStorage.getItem(savedKey) || "[]"); } catch { return []; }
  });

  const isSaved = id => saved.some(s => s.id === id);
  const toggleSave = (e, item) => {
    e.stopPropagation();
    if (!user || !user.email) return; // guests can't save
    setSaved(prev => {
      const next = isSaved(item.id)
        ? prev.filter(s => s.id !== item.id)
        : [...prev, { id: item.id, name: item.name, image: item.image, url: item.url }];
      localStorage.setItem(savedKey, JSON.stringify(next));
      return next;
    });
  };

  const adjGroupSize = (val) => {
    const next = Math.max(1, val);
    setGroupSize(next);
    if (setGlobalGroupSize) setGlobalGroupSize(next);
  };

  const selectedDest = DESTS.find(d => d.id === city);

  const VIBES = [
    { id:"",          label:"Any vibe" },
    { id:"brunch",    label:"🥂 Drag Brunch" },
    { id:"boat",      label:"⛵ Boat / Yacht" },
    { id:"spa",       label:"💆 Spa Day" },
    { id:"nightlife", label:"🪩 Nightlife" },
    { id:"outdoor",   label:"🌅 Outdoor Adventure" },
    { id:"classes",   label:"💃 Dance / Classes" },
    { id:"food",      label:"🍕 Food Tour" },
    { id:"show",      label:"🎭 Live Show" },
  ];

  function findExperiences() {
    if (!city) return;
    const query = [vibe ? VIBES.find(v => v.id === vibe)?.label.replace(/[^a-zA-Z ]/g,"").trim() : "bachelorette", "experience", selectedDest?.name || city].join(" ");
    const url = `https://www.viator.com/searchResults/all?text=${encodeURIComponent(query)}&startDate=${date || ""}&paxMix=A_${groupSize || 4}`;
    window.open(url, "_blank");
  }

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: `1.5px solid ${BORDER}`, fontFamily: "'Nunito',sans-serif",
    fontSize: 13, color: DARK, background: WHITE, boxSizing: "border-box",
    outline: "none",
  };

  const labelStyle = {
    fontSize: 10, fontWeight: 700, color: HOT,
    fontFamily: "'Nunito',sans-serif",
    textTransform: "uppercase", letterSpacing: 1, marginBottom: 6,
  };

  return (
    <div>
      <SH title="Find Experiences" sub="Activities, shows & adventures for your crew" />

      {/* Destination */}
      <div style={{ ...C, marginBottom: 12 }}>
        <div style={labelStyle}>Destination</div>
        <select value={city} onChange={e => setCity(e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
          <option value="">Choose a city…</option>
          {DESTS.filter(d => d.id !== "all").map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Vibe */}
      <div style={{ ...C, marginBottom: 12 }}>
        <div style={labelStyle}>What kind of experience?</div>
        <select value={vibe} onChange={e => setVibe(e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
          {VIBES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
        </select>
      </div>

      {/* Date */}
      <div style={{ ...C, marginBottom: 12 }}>
        <div style={labelStyle}>Date</div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
      </div>

      {/* Group size */}
      <div style={{ ...C, marginBottom: 14 }}>
        <div style={labelStyle}>Group Size</div>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginTop:4 }}>
          <button onClick={()=>adjGroupSize(groupSize-1)} style={{ width:32, height:32, borderRadius:"50%", border:`1.5px solid ${BORDER}`, background:"none", fontSize:20, color:HOT, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
          <div style={{ fontSize:22, fontWeight:900, color:PUNCH, fontFamily:"'Playfair Display',Georgia,serif", minWidth:24, textAlign:"center" }}>{groupSize}</div>
          <button onClick={()=>adjGroupSize(groupSize+1)} style={{ width:32, height:32, borderRadius:"50%", border:`1.5px solid ${BORDER}`, background:"none", fontSize:20, color:HOT, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
        </div>
      </div>

      {/* CTA */}
      <div style={{ ...C, background: SOFT, border: `1.5px solid ${MID}`, marginBottom: 20 }}>
        {city ? (
          <>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Playfair Display',Georgia,serif", color: DARK, marginBottom: 4 }}>
              {selectedDest?.emoji} {selectedDest?.name}
            </div>
            <div style={{ fontSize: 11, color: HOT, fontFamily: "'Nunito',sans-serif", marginBottom: 14, opacity: 0.85 }}>
              {groupSize} guests{vibe ? ` · ${VIBES.find(v=>v.id===vibe)?.label}` : ""}{date ? ` · ${date}` : " · flexible date"}
            </div>
            <button onClick={findExperiences} style={{
              width: "100%", background: `linear-gradient(135deg,#f472b0,${HOT})`,
              color: WHITE, border: "none", borderRadius: 14, padding: "15px", cursor: "pointer",
              fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 800, letterSpacing: "0.3px",
            }}>
              🎉 Find Best Experiences
            </button>
            <div style={{ fontSize: 10, color: "#bbb", fontFamily: "'Nunito',sans-serif", marginTop: 8, textAlign: "center" }}>
              We'll surface the best activities & experiences for your group
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Playfair Display',Georgia,serif", color: DARK }}>Pick a destination above</div>
            <div style={{ fontSize: 11, color: HOT, fontFamily: "'Nunito',sans-serif", marginTop: 4, opacity: 0.75 }}>
              Then we'll find the best experiences for {groupSize} people
            </div>
          </div>
        )}
      </div>

      {/* Popular Picks */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>Popular Picks</div>
        <div style={{ fontSize:11, color:"#aaa", fontFamily:"'Nunito',sans-serif" }}>{PICKS.length} found</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:24 }}>
        {PICKS.map(item => (
          <div
            key={item.id}
            onClick={() => window.open(item.url, "_blank")}
            style={{ borderRadius:12, overflow:"hidden", cursor:"pointer", background:WHITE, boxShadow:"0 2px 10px rgba(0,0,0,0.08)", transition:"transform 0.15s" }}
          >
            {/* Photo */}
            <div style={{ position:"relative", width:"100%", aspectRatio:"1/1", overflow:"hidden" }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
              />
              {/* Category tag */}
              <div style={{
                position:"absolute", top:5, left:5,
                background:"rgba(0,0,0,0.55)", color:WHITE,
                fontSize:8, fontWeight:700, fontFamily:"'Nunito',sans-serif",
                padding:"2px 6px", borderRadius:20,
              }}>
                {item.category}
              </div>
              {/* Heart save button */}
              <button
                onClick={e => toggleSave(e, item)}
                style={{
                  position:"absolute", top:5, right:5,
                  width:26, height:26, borderRadius:"50%",
                  background:"rgba(255,255,255,0.9)",
                  border:"none", cursor: user?.email ? "pointer" : "default",
                  display:"flex", alignItems:"center", justifyContent:"center", padding:0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={isSaved(item.id) ? HOT : "none"} stroke={HOT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            {/* Info */}
            <div style={{ padding:"6px 7px 8px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:DARK, fontFamily:"'Playfair Display',Georgia,serif", lineHeight:1.25, marginBottom:3 }}>{item.name}</div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ fontSize:9, color:HOT, fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>⭐ {item.rating}</div>
                <div style={{ fontSize:9, color:PUNCH, fontFamily:"'Nunito',sans-serif", fontWeight:700 }}>{item.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
