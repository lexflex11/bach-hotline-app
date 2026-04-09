import React, { useState } from 'react';
import { HOT, PUNCH, DARK, WHITE, SOFT, MID, BORDER } from '../../constants/colors.js';
import { BP, BG } from '../../constants/styles.js';
import { viatorUrl, opentableUrl } from '../../constants/api.js';

// ─── Category filters ──────────────────────────────────────────────────────
const CATS = [
  { id:"all",     label:"Popular",       icon:"⭐" },
  { id:"todo",    label:"Things to Do",  icon:"🎉" },
  { id:"dining",  label:"Restaurants",   icon:"🍽️" },
  { id:"bar",     label:"Bars",          icon:"🍸" },
  { id:"stay",    label:"Accommodations",icon:"🏠" },
];

// Maps ExploreTab cat → which filter bucket it belongs to
const CAT_GROUP = {
  activity:   "todo",
  water:      "todo",
  spa:        "todo",
  nightlife:  "todo",
  food:       "dining",
  restaurant: "dining",
  bar:        "bar",
  stay:       "stay",
};

// ─── Gradient palettes per category (app colors) ──────────────────────────
const GRAD = {
  todo:   ["#E66582","#C42050"],
  dining: ["#C42050","#8B1A2E"],
  bar:    ["#9B3070","#E66582"],
  stay:   ["#7B3F6E","#C42050"],
};

// ─── Experiences data ──────────────────────────────────────────────────────
const EXP = [
  // Miami
  { id:1,  city:"miami",     name:"Sunset Yacht Charter",       cat:"water",     emoji:"⛵", price:"$$$$", rating:5.0, vibe:"Private · Champagne · 3 hrs",    badge:"Experience", hot:true  },
  { id:2,  city:"miami",     name:"Drag Brunch Miami",           cat:"food",      emoji:"👑", price:"$$$",  rating:4.9, vibe:"Bottomless mimosas · Live show",  badge:"Brunch",     hot:true  },
  { id:3,  city:"miami",     name:"South Beach Bar Crawl",       cat:"bar",       emoji:"🍸", price:"$$",   rating:4.8, vibe:"5 bars · VIP entry · Free shots", badge:"Bar Crawl",  hot:false },
  { id:4,  city:"miami",     name:"Pole Dance Experience",       cat:"activity",  emoji:"💃", price:"$$",   rating:4.9, vibe:"Private class · 90 mins · BYOB", badge:"Activity",   hot:false },
  { id:5,  city:"miami",     name:"Rooftop Pool Party",          cat:"nightlife", emoji:"🏊", price:"$$$",  rating:4.7, vibe:"DJ · Bottle service · Views",    badge:"Nightlife",  hot:true  },
  { id:6,  city:"miami",     name:"Luxury Spa Day",              cat:"spa",       emoji:"💆", price:"$$$$", rating:4.9, vibe:"Full day · Massages · Facials",   badge:"Spa",        hot:false },

  // Nashville
  { id:7,  city:"nashville", name:"Broadway Bar Hop",            cat:"bar",       emoji:"🎸", price:"$$",   rating:4.9, vibe:"Honky tonks · Live music · BYOB",badge:"Bar Crawl",  hot:true  },
  { id:8,  city:"nashville", name:"Nashville Pedal Tavern",      cat:"activity",  emoji:"🚲", price:"$$",   rating:4.7, vibe:"90 mins · BYOB · 16 people",     badge:"Activity",   hot:true  },
  { id:9,  city:"nashville", name:"Hot Chicken Tasting Tour",    cat:"food",      emoji:"🌶️", price:"$$",  rating:4.8, vibe:"3 stops · Nashville staple",     badge:"Food Tour",  hot:false },
  { id:10, city:"nashville", name:"Rooftop Sunset Cocktails",    cat:"bar",       emoji:"🥂", price:"$$$",  rating:4.8, vibe:"Golden hour · Craft cocktails",   badge:"Bar",        hot:false },
  { id:11, city:"nashville", name:"Line Dancing Class",          cat:"activity",  emoji:"🤠", price:"$",    rating:4.7, vibe:"1 hour · Beginner friendly",      badge:"Activity",   hot:false },
  { id:12, city:"nashville", name:"VIP Live Country Show",       cat:"nightlife", emoji:"🎵", price:"$$$",  rating:4.9, vibe:"Front row · Dinner included",    badge:"Show",       hot:true  },

  // Las Vegas
  { id:13, city:"vegas",     name:"Magic Mike Live",             cat:"activity",  emoji:"💪", price:"$$$",  rating:5.0, vibe:"The show · Front row available", badge:"Show",       hot:true  },
  { id:14, city:"vegas",     name:"VIP Club Night",              cat:"nightlife", emoji:"🎰", price:"$$$$", rating:4.8, vibe:"Table service · Open bar",       badge:"Nightlife",  hot:true  },
  { id:15, city:"vegas",     name:"Drag Brunch Extravaganza",    cat:"food",      emoji:"✨", price:"$$$",  rating:5.0, vibe:"Unlimited mimosas · Crown ceremony",badge:"Brunch",   hot:true  },
  { id:16, city:"vegas",     name:"Spa at Aria",                 cat:"spa",       emoji:"💆", price:"$$$$", rating:4.9, vibe:"Full day · Award-winning spa",    badge:"Spa",        hot:false },
  { id:17, city:"vegas",     name:"Helicopter Canyon Tour",      cat:"activity",  emoji:"🚁", price:"$$$$", rating:4.8, vibe:"Grand Canyon · Sunrise option",  badge:"Experience", hot:false },
  { id:18, city:"vegas",     name:"High Roller Cocktail Hour",   cat:"bar",       emoji:"🎡", price:"$$$",  rating:4.7, vibe:"Open bar · 360° Strip views",    badge:"Bar",        hot:false },

  // New Orleans
  { id:19, city:"nola",      name:"Haunted Cocktail Tour",       cat:"bar",       emoji:"👻", price:"$$",   rating:4.8, vibe:"5 bars · Ghost stories · 2 hrs", badge:"Bar Tour",   hot:true  },
  { id:20, city:"nola",      name:"Jazz Brunch Experience",      cat:"food",      emoji:"🎷", price:"$$$",  rating:4.9, vibe:"Live jazz · Creole cuisine",      badge:"Brunch",     hot:true  },
  { id:21, city:"nola",      name:"Swamp & Gator Tour",          cat:"activity",  emoji:"🐊", price:"$$",   rating:4.7, vibe:"Boat tour · Wildlife · 2 hrs",   badge:"Activity",   hot:false },
  { id:22, city:"nola",      name:"Frenchmen Street Bar Night",  cat:"nightlife", emoji:"🎺", price:"$",    rating:4.9, vibe:"Live music every bar · No cover", badge:"Nightlife",  hot:false },
  { id:23, city:"nola",      name:"Voodoo & History Tour",       cat:"activity",  emoji:"🔮", price:"$$",   rating:4.8, vibe:"Walking tour · Mystical NOLA",   badge:"Tour",       hot:false },

  // Scottsdale
  { id:24, city:"scottsdale",name:"Desert Day Club Pool Party",  cat:"nightlife", emoji:"🏊", price:"$$$",  rating:4.8, vibe:"Cabanas · DJ · Bottle service",  badge:"Day Club",   hot:true  },
  { id:25, city:"scottsdale",name:"Sunset Jeep Desert Tour",     cat:"activity",  emoji:"🌵", price:"$$",   rating:4.9, vibe:"Saguaro sunset · 2 hrs",          badge:"Adventure",  hot:false },
  { id:26, city:"scottsdale",name:"Spa at Four Seasons",         cat:"spa",       emoji:"💆", price:"$$$$", rating:5.0, vibe:"Desert spa · Full day access",    badge:"Spa",        hot:true  },
  { id:27, city:"scottsdale",name:"Old Town Bar Crawl",          cat:"bar",       emoji:"🍹", price:"$$",   rating:4.7, vibe:"5 venues · Group perks",          badge:"Bar Crawl",  hot:false },

  // Austin
  { id:28, city:"austin",    name:"6th Street Bar Crawl",        cat:"bar",       emoji:"🎸", price:"$$",   rating:4.8, vibe:"Live music bars · No cover",      badge:"Bar Crawl",  hot:true  },
  { id:29, city:"austin",    name:"Lake Austin Boat Party",      cat:"water",     emoji:"🚤", price:"$$$",  rating:4.9, vibe:"Private boat · Swimming · BYOB",  badge:"Boat Party", hot:true  },
  { id:30, city:"austin",    name:"Texas BBQ Crawl",             cat:"food",      emoji:"🔥", price:"$$",   rating:4.9, vibe:"3 legendary spots · Guided",      badge:"Food Tour",  hot:false },
  { id:31, city:"austin",    name:"Rainey Street Night Out",     cat:"nightlife", emoji:"🌙", price:"$$",   rating:4.8, vibe:"Bungalow bars · Rooftop patios",  badge:"Nightlife",  hot:false },

  // Cabo
  { id:32, city:"cabo",      name:"Private Yacht Party",         cat:"water",     emoji:"🛥️", price:"$$$$", rating:5.0, vibe:"Open bar · Snorkeling · Sunset", badge:"Yacht",      hot:true  },
  { id:33, city:"cabo",      name:"Medano Beach Club",           cat:"activity",  emoji:"🏖️", price:"$$$",  rating:4.8, vibe:"VIP beds · Bottle service",      badge:"Beach Club", hot:true  },
  { id:34, city:"cabo",      name:"ATV Desert Adventure",        cat:"activity",  emoji:"🏜️", price:"$$",   rating:4.7, vibe:"Desert dunes · 2 hrs",            badge:"Adventure",  hot:false },
  { id:35, city:"cabo",      name:"Sunset Sailing Charter",      cat:"water",     emoji:"⛵", price:"$$$",  rating:4.9, vibe:"Champagne · Whale watching",      badge:"Sailing",    hot:false },

  // Mykonos
  { id:36, city:"mykonos",   name:"Nammos Beach Club",           cat:"nightlife", emoji:"🪩", price:"$$$$", rating:5.0, vibe:"World-famous · Bottle service",  badge:"Beach Club", hot:true  },
  { id:37, city:"mykonos",   name:"Windmill Sunset Cocktails",   cat:"bar",       emoji:"🌅", price:"$$$",  rating:4.9, vibe:"Iconic views · Golden hour",      badge:"Bar",        hot:true  },
  { id:38, city:"mykonos",   name:"Private Catamaran Cruise",    cat:"water",     emoji:"⛵", price:"$$$$", rating:5.0, vibe:"All-inclusive · Secluded beaches",badge:"Sailing",    hot:false },
  { id:39, city:"mykonos",   name:"Little Venice Wine Night",    cat:"bar",       emoji:"🥂", price:"$$$",  rating:4.8, vibe:"Seaside · Local wine · Sunset",   badge:"Wine Bar",   hot:false },

  // Accommodations — one featured stay per city
  { id:40, city:"miami",      name:"Faena Hotel Miami Beach",     cat:"stay", emoji:"🏨", price:"$$$$", rating:5.0, vibe:"Iconic gold · Beachfront · Full-floor suites", badge:"Hotel",    hot:true  },
  { id:41, city:"miami",      name:"South Beach Bachelorette Villa",cat:"stay",emoji:"🌴",price:"$$$", rating:4.9, vibe:"Private pool · 4BR · Steps to beach",          badge:"Villa",    hot:false },
  { id:42, city:"nashville",  name:"Gulch Party House",           cat:"stay", emoji:"🎸", price:"$$$", rating:4.9, vibe:"6BR · Rooftop · Minutes to Broadway",          badge:"Airbnb",   hot:true  },
  { id:43, city:"nashville",  name:"The Thompson Nashville",      cat:"stay", emoji:"🏨", price:"$$$$",rating:4.8, vibe:"Rooftop pool · Downtown · Bar on site",         badge:"Hotel",    hot:false },
  { id:44, city:"vegas",      name:"Cosmopolitan Suite",          cat:"stay", emoji:"🎰", price:"$$$$",rating:4.9, vibe:"Strip views · Terrace · Marquee access",        badge:"Suite",    hot:true  },
  { id:45, city:"vegas",      name:"Palms 2-story Penthouse",     cat:"stay", emoji:"🌟", price:"$$$$",rating:5.0, vibe:"Private pool · DJ booth · 360° views",          badge:"Penthouse",hot:false },
  { id:46, city:"nola",       name:"Garden District Mansion",     cat:"stay", emoji:"🏛️", price:"$$$", rating:4.9, vibe:"5BR · Private courtyard · Historic charm",      badge:"Mansion",  hot:true  },
  { id:47, city:"nola",       name:"French Quarter Balcony Apt",  cat:"stay", emoji:"🎺", price:"$$",  rating:4.7, vibe:"Bourbon St views · Walk everywhere",            badge:"Airbnb",   hot:false },
  { id:48, city:"scottsdale", name:"Desert Bachelorette Estate",  cat:"stay", emoji:"🌵", price:"$$$$",rating:5.0, vibe:"Private pool · Fire pit · Mountain views",      badge:"Estate",   hot:true  },
  { id:49, city:"scottsdale", name:"W Scottsdale",                cat:"stay", emoji:"🏨", price:"$$$", rating:4.8, vibe:"WET pool deck · Central Old Town location",     badge:"Hotel",    hot:false },
  { id:50, city:"austin",     name:"East Austin Party House",     cat:"stay", emoji:"🤠", price:"$$$", rating:4.8, vibe:"4BR · Hot tub · Walk to Rainey St",              badge:"Airbnb",   hot:true  },
  { id:51, city:"austin",     name:"Lake Travis Waterfront Home", cat:"stay", emoji:"🚤", price:"$$$$",rating:4.9, vibe:"Private dock · Lake views · 5BR",               badge:"Lakehouse",hot:false },
  { id:52, city:"cabo",       name:"Pedregal Cliffside Villa",    cat:"stay", emoji:"🌊", price:"$$$$",rating:5.0, vibe:"Infinity pool · Ocean views · Private chef",     badge:"Villa",    hot:true  },
  { id:53, city:"cabo",       name:"Medano Beach Penthouse",      cat:"stay", emoji:"🏖️", price:"$$$", rating:4.8, vibe:"Beachfront · Rooftop terrace · 3BR",            badge:"Penthouse",hot:false },
  { id:54, city:"mykonos",    name:"Cycladic Cliffside Villa",    cat:"stay", emoji:"🏛️", price:"$$$$",rating:5.0, vibe:"Infinity pool · Sea views · 4BR",               badge:"Villa",    hot:true  },
  { id:55, city:"mykonos",    name:"Mykonos Town Boutique Hotel", cat:"stay", emoji:"🌅", price:"$$$", rating:4.9, vibe:"Rooftop bar · Windmill views · Walking distance",badge:"Hotel",    hot:false },
];

const CITIES = [
  { id:"all",        name:"All Cities" },
  { id:"miami",      name:"Miami" },
  { id:"nashville",  name:"Nashville" },
  { id:"vegas",      name:"Las Vegas" },
  { id:"nola",       name:"New Orleans" },
  { id:"scottsdale", name:"Scottsdale" },
  { id:"austin",     name:"Austin" },
  { id:"cabo",       name:"Cabo San Lucas" },
  { id:"mykonos",    name:"Mykonos" },
];

// ─── Time slot mapping ────────────────────────────────────────────────────
const CAT_SLOT = {
  spa:        "morning",
  water:      "afternoon",
  activity:   "afternoon",
  food:       "evening",
  restaurant: "evening",
  bar:        "evening",
  nightlife:  "night",
};

const SLOT_LABELS = {
  morning:   { label:"Morning",       emoji:"☀️" },
  afternoon: { label:"Afternoon",     emoji:"🌤️" },
  evening:   { label:"Evening",       emoji:"🌆" },
  night:     { label:"Night Out",     emoji:"🌙" },
};

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Slot rotation so each day pulls from a different pool order
const DAY_SLOT_ORDERS = [
  ["morning",   "afternoon", "evening", "night"],
  ["afternoon", "morning",   "evening", "night"],
  ["morning",   "afternoon", "night",   "evening"],
  ["afternoon", "night",     "morning", "evening"],
  ["morning",   "night",     "afternoon","evening"],
  ["afternoon", "morning",   "night",   "evening"],
  ["morning",   "evening",   "afternoon","night"],
];

function buildItinerary(cityExps, numDays) {
  // Separate stays from schedulable experiences
  const schedulable = cityExps.filter(e => e.cat !== "stay");

  const slots = { morning:[], afternoon:[], evening:[], night:[] };
  schedulable.forEach(e => {
    const s = CAT_SLOT[e.cat];
    if (s) slots[s].push(e);
  });
  // Shuffle each bucket fresh
  Object.keys(slots).forEach(k => { slots[k] = shuffle(slots[k]); });

  // Pointers per slot so we cycle through all items across days
  const ptrs = { morning:0, afternoon:0, evening:0, night:0 };

  const pick = (slot) => {
    const pool = slots[slot];
    if (!pool.length) return null;
    const item = pool[ptrs[slot] % pool.length];
    ptrs[slot]++;
    return item;
  };

  const days = [];
  for (let d = 0; d < numDays; d++) {
    const order = DAY_SLOT_ORDERS[d % DAY_SLOT_ORDERS.length];
    const day = [];
    order.forEach(slot => {
      const item = pick(slot);
      if (item) day.push({ slot, ...item });
    });
    if (day.length) days.push(day);
  }

  return days;
}

export default function ExploreTab({ groupSize }) {
  const [city, setCity]       = useState("all");
  const [cat,  setCat]        = useState("all");
  const [saved, setSaved]     = useState(new Set());
  const [itin,  setItin]      = useState(null);
  const [generating, setGen]  = useState(false);
  const [numDays, setNumDays] = useState(3);

  const toggleSave = id => setSaved(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const handleGenerate = () => {
    if (city === "all") { setItin("pick_city"); return; }
    setGen(true);
    setItin(null);
    setTimeout(() => {
      const cityExps = EXP.filter(e => e.city === city);
      setItin(buildItinerary(cityExps, numDays));
      setGen(false);
    }, 1200);
  };

  const filtered = EXP
    .filter(e => city === "all" || e.city === city)
    .filter(e => {
      if (cat === "all")    return e.hot === true;
      return CAT_GROUP[e.cat] === cat;
    });

  const cityName = CITIES.find(c => c.id === city)?.name || "All Cities";
  const grad = (e) => GRAD[CAT_GROUP[e.cat]] || [HOT, PUNCH];

  return (
    <div style={{ paddingBottom: 8 }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(160deg, #2D0A18 0%, ${PUNCH} 50%, ${HOT} 100%)`,
        borderRadius: 20,
        padding: "32px 20px 28px",
        marginBottom: 16,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative circles */}
        <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
        <div style={{ position:"absolute", bottom:-30, left:-30, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />

        <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", fontFamily:"'DM Sans',sans-serif", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", marginBottom:10 }}>
          Bach Hotline
        </div>
        <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:26, fontWeight:900, color:WHITE, margin:"0 0 6px", lineHeight:1.2 }}>
          Plan your next<br/><em style={{ color:"#FFD6E0" }}>epic bach trip</em>
        </h2>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.75)", fontFamily:"'DM Sans',sans-serif", margin:"0 0 20px" }}>
          Experiences · Restaurants · Bars · Activities
        </p>

        {/* City selector */}
        <div style={{ position:"relative", display:"inline-block", width:"100%", maxWidth:280 }}>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            style={{
              width:"100%", padding:"14px 44px 14px 20px",
              borderRadius:50, border:"none",
              fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700,
              color:DARK, background:WHITE, cursor:"pointer",
              appearance:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <span style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", fontSize:16, pointerEvents:"none" }}>▾</span>
        </div>
      </div>

      {/* ── CATEGORY FILTER CHIPS ────────────────────────────────────────── */}
      <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4, marginBottom:16, scrollbarWidth:"none" }}>
        {CATS.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{
            flexShrink:0,
            display:"flex", flexDirection:"column", alignItems:"center", gap:4,
            padding:"10px 14px",
            background: cat===c.id ? SOFT : WHITE,
            border: cat===c.id ? `2px solid ${HOT}` : `1.5px solid ${BORDER}`,
            borderRadius:14, cursor:"pointer", transition:"all 0.15s",
            minWidth:72,
          }}>
            <span style={{ fontSize:20 }}>{c.icon}</span>
            <span style={{
              fontSize:10, fontWeight:700, fontFamily:"'DM Sans',sans-serif",
              color: cat===c.id ? HOT : "#888",
              whiteSpace:"nowrap",
              borderBottom: cat===c.id ? `2px solid ${HOT}` : "2px solid transparent",
              paddingBottom:1,
            }}>{c.label}</span>
          </button>
        ))}
      </div>

      {/* ── SECTION HEADER ───────────────────────────────────────────────── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ fontSize:18, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>
          {cat === "all" ? `Best of ${cityName}` : `${CATS.find(c=>c.id===cat)?.label} · ${cityName}`}
        </div>
        <div style={{ fontSize:11, color:"#bbb", fontFamily:"'DM Sans',sans-serif" }}>{filtered.length} found</div>
      </div>

      {/* ── EXPERIENCE CARDS ─────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px 20px" }}>
          <div style={{ fontSize:32, marginBottom:10 }}>🔍</div>
          <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>No experiences found</div>
          <div style={{ fontSize:12, color:"#bbb", fontFamily:"'DM Sans',sans-serif", marginTop:6 }}>Try a different city or category</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {filtered.map(e => {
            const [g1, g2] = grad(e);
            const isSaved  = saved.has(e.id);
            return (
              <div key={e.id} style={{
                borderRadius:18, overflow:"hidden",
                boxShadow:"0 4px 16px rgba(45,10,24,0.12)",
                background:WHITE,
                display:"flex", flexDirection:"column",
              }}>
                {/* Photo area — gradient + emoji */}
                <div style={{
                  background:`linear-gradient(140deg, ${g1}, ${g2})`,
                  height:110, position:"relative",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <span style={{ fontSize:42, filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.25))" }}>{e.emoji}</span>

                  {/* Badge — top left */}
                  <div style={{
                    position:"absolute", top:10, left:10,
                    background:"rgba(0,0,0,0.45)", backdropFilter:"blur(6px)",
                    borderRadius:50, padding:"3px 10px",
                    fontSize:9, fontWeight:700, color:WHITE,
                    fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.5px",
                    display:"flex", alignItems:"center", gap:4,
                  }}>
                    🎉 {e.badge}
                  </div>

                  {/* Heart — top right */}
                  <button onClick={() => toggleSave(e.id)} style={{
                    position:"absolute", top:8, right:8,
                    width:30, height:30, borderRadius:"50%",
                    background:isSaved ? HOT : "rgba(255,255,255,0.85)",
                    border:"none", cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:14, boxShadow:"0 2px 8px rgba(0,0,0,0.15)",
                    transition:"all 0.2s",
                  }}>
                    {isSaved ? "❤️" : "🤍"}
                  </button>

                  {/* Hot badge */}
                  {e.hot && (
                    <div style={{
                      position:"absolute", bottom:8, left:10,
                      background:PUNCH, borderRadius:50, padding:"2px 8px",
                      fontSize:8, fontWeight:800, color:WHITE,
                      fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.5px",
                    }}>🔥 POPULAR</div>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding:"10px 12px 12px", flex:1, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:3, lineHeight:1.3 }}>{e.name}</div>
                    <div style={{ fontSize:10, color:HOT, fontFamily:"'DM Sans',sans-serif", opacity:0.8, marginBottom:6 }}>{e.vibe}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <span style={{ fontSize:10, color:"#888", fontFamily:"'DM Sans',sans-serif" }}>
                        {"⭐".repeat(Math.round(e.rating))} {e.rating}
                      </span>
                      <span style={{ fontSize:11, fontWeight:700, color:PUNCH, fontFamily:"'DM Sans',sans-serif" }}>{e.price}</span>
                    </div>
                  </div>
                  <a
                    href={CAT_GROUP[e.cat] === "dining"
                      ? opentableUrl(e.name, CITIES.find(c=>c.id===e.city)?.name||"")
                      : CAT_GROUP[e.cat] === "stay"
                        ? `https://www.airbnb.com/s/${encodeURIComponent(CITIES.find(c=>c.id===e.city)?.name||"")}/homes?adults=${groupSize||4}`
                        : viatorUrl(e.name, CITIES.find(c=>c.id===e.city)?.name||"")}
                    target="_blank" rel="noreferrer"
                    style={{ textDecoration:"none" }}
                  >
                    <button style={{ ...BP, width:"100%", fontSize:11, padding:"8px", borderRadius:10 }}>
                      Book Now →
                    </button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ITINERARY GENERATOR ──────────────────────────────────────────── */}
      <div style={{ marginTop:28, marginBottom:8 }}>
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:18, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:4 }}>
            Your Custom Itinerary
          </div>
          <div style={{ fontSize:12, color:HOT, fontFamily:"'DM Sans',sans-serif", opacity:0.8 }}>
            Built from real {cityName} experiences — never cookie cutter
          </div>
        </div>

        {/* Day picker */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:700, fontFamily:"'DM Sans',sans-serif", color:DARK, marginBottom:10, textAlign:"center" }}>
            How many days?
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
            {[1,2,3,4,5,6,7].map(d => (
              <button key={d} onClick={() => setNumDays(d)} style={{
                width:40, height:40, borderRadius:10, border:"none",
                background: numDays===d ? `linear-gradient(135deg,${PUNCH},${HOT})` : SOFT,
                color: numDays===d ? WHITE : DARK,
                fontWeight:700, fontSize:14,
                fontFamily:"'DM Sans',sans-serif",
                cursor:"pointer", transition:"all 0.15s",
                boxShadow: numDays===d ? `0 2px 10px rgba(213,36,56,0.3)` : "none",
              }}>{d}</button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          style={{
            width:"100%", padding:"16px", borderRadius:16, border:"none",
            background:`linear-gradient(135deg, ${PUNCH}, ${HOT})`,
            color:WHITE, cursor:"pointer",
            fontFamily:"'Playfair Display',Georgia,serif",
            fontSize:16, fontWeight:700,
            boxShadow:`0 4px 20px rgba(213,36,56,0.35)`,
            transition:"all 0.2s",
          }}
        >
          {generating ? "✨ Building your itinerary..." : `✨ Generate ${numDays}-Day Itinerary`}
        </button>

        {/* Prompt to pick a city */}
        {itin === "pick_city" && (
          <div style={{ textAlign:"center", marginTop:14, padding:"14px", background:SOFT, borderRadius:14, border:`1.5px solid ${MID}` }}>
            <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>
              Choose a city first!
            </div>
            <div style={{ fontSize:11, color:HOT, fontFamily:"'DM Sans',sans-serif", marginTop:4 }}>
              Select a destination from the dropdown above to get your personalized itinerary.
            </div>
          </div>
        )}

        {/* Generated days */}
        {Array.isArray(itin) && itin.map((day, di) => (
          <div key={di} style={{ marginTop:16 }}>
            <div style={{
              display:"flex", alignItems:"center", gap:10, marginBottom:10,
            }}>
              <div style={{ flex:1, height:1, background:BORDER }} />
              <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:HOT, whiteSpace:"nowrap" }}>
                Day {di + 1}
              </div>
              <div style={{ flex:1, height:1, background:BORDER }} />
            </div>

            {day.map((item, ii) => {
              const sl = SLOT_LABELS[item.slot] || { label: item.slot, emoji:"📍" };
              const isDining = CAT_GROUP[item.cat] === "dining";
              return (
                <div key={ii} style={{
                  display:"flex", gap:12, alignItems:"flex-start",
                  marginBottom:12, padding:"12px 14px",
                  background:WHITE, borderRadius:14,
                  border:`1.5px solid ${BORDER}`,
                  boxShadow:"0 2px 8px rgba(45,10,24,0.07)",
                }}>
                  {/* Time column */}
                  <div style={{ minWidth:60, textAlign:"center" }}>
                    <div style={{ fontSize:18 }}>{sl.emoji}</div>
                    <div style={{ fontSize:9, fontWeight:700, color:HOT, fontFamily:"'DM Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.5px", marginTop:2 }}>{sl.label}</div>
                  </div>
                  {/* Content */}
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:2 }}>
                      {item.emoji} {item.name}
                    </div>
                    <div style={{ fontSize:10, color:HOT, fontFamily:"'DM Sans',sans-serif", opacity:0.8, marginBottom:6 }}>{item.vibe}</div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ fontSize:9, color:"#888", fontFamily:"'DM Sans',sans-serif" }}>⭐ {item.rating} · {item.price}</span>
                    </div>
                  </div>
                  {/* Book link */}
                  <a
                    href={isDining
                      ? opentableUrl(item.name, cityName)
                      : CAT_GROUP[item.cat] === "stay"
                        ? `https://www.airbnb.com/s/${encodeURIComponent(cityName)}/homes?adults=${groupSize||4}`
                        : viatorUrl(item.name, cityName)}
                    target="_blank" rel="noreferrer"
                    style={{ textDecoration:"none", alignSelf:"center" }}
                  >
                    <div style={{
                      background:PUNCH, color:WHITE, borderRadius:8,
                      padding:"6px 10px", fontSize:10, fontWeight:700,
                      fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap",
                    }}>Book →</div>
                  </a>
                </div>
              );
            })}
          </div>
        ))}

        {Array.isArray(itin) && (
          <div style={{ textAlign:"center", marginTop:16, marginBottom:8 }}>
            <button
              onClick={handleGenerate}
              style={{ background:"none", border:`1.5px solid ${HOT}`, borderRadius:10, padding:"8px 20px", color:HOT, fontSize:12, fontWeight:700, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}
            >
              Shuffle Again ↺
            </button>
          </div>
        )}
      </div>

      <div style={{ textAlign:"center", paddingBottom:8, fontSize:10, color:"#ccc", fontFamily:"'DM Sans',sans-serif" }}>
        {groupSize} in your group · Tap ❤️ to save favorites
      </div>
    </div>
  );
}
