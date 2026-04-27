import React, { useState, useMemo, useRef, useEffect } from 'react';

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 500);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 500);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
}
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { BP, BS } from '../../constants/styles.js';

// ─── Packages ────────────────────────────────────────────────────────────────
const PACKAGES = [
  {
    id: "mini",
    name: "Mini Package",
    tagline: "Glam on a budget",
    emoji: "🎈",
    price: "$99",
    bg: "#FFF0F6",
    border: "#E91E8C",
    headlineColor: "#E91E8C",
    description: "For bachelorettes on a budget but still wanting some glam for their big weekend. Think balloon garland photo op + custom hanging sign.",
    includes: [
      "Photo area with balloon garland",
      "Hanging tassels",
      "Custom hanging sign",
      "Additional balloons around the room",
    ],
    vibes: [
      { id:"hotpink", label:"Hot Pink & Silver", colors:["#E91E8C","#C0C0C0","#FF4081","#FFB6C1"] },
      { id:"blush",   label:"Blush & Gold",      colors:["#F4A7B9","#FFD700","#fff","#FFB6C1"]    },
      { id:"white",   label:"White & Chrome",    colors:["#f5f5f5","#D8D8D8","#fff","#e8e8e8"]    },
    ],
  },
  {
    id: "full",
    name: "Full Package",
    tagline: "Go all out — make it fun!",
    emoji: "🪩",
    price: "$199",
    bg: "#F8F0FF",
    border: "#9C27B0",
    headlineColor: "#9C27B0",
    description: "Let us turn your Airbnb or hotel into a sparkly bachelorette base. Photo booth, tons of balloons, decked out bridal suite, and more.",
    includes: [
      "Photo booth area setup",
      "Tons of balloons throughout the space",
      "Decked-out bridal suite",
      "Foil fringe curtain backdrop",
      "Disco ball + string lights",
    ],
    vibes: [
      { id:"disco",   label:"Disco & Chrome",    colors:["#9C27B0","#C0C0C0","#E91E8C","#D8D8D8"] },
      { id:"hotpink", label:"Hot Pink & Fuchsia", colors:["#E91E8C","#FF4081","#FF1493","#FFB6C1"] },
      { id:"barbie",  label:"Barbie Dreamhouse",  colors:["#FF69B4","#FF1493","#FFB6C1","#FF4081"] },
    ],
  },
  {
    id: "brides-room",
    name: "Bride's Room",
    tagline: "A room fit for a queen",
    emoji: "👰",
    price: "$149",
    bg: "#f9f9f9",
    border: "#C0C0C0",
    headlineColor: "#777",
    description: "Your bride deserves a room fit for the queen she is! Elevate her bedroom with BRIDE balloons above the bed, ring balloon, and bride sash.",
    includes: [
      "BRIDE foil letter balloons above the bed",
      "Latex balloons scattered around the room",
      "Ring balloon",
      "Bride sash",
    ],
    vibes: [
      { id:"silver", label:"Silver & White",  colors:["#D8D8D8","#f0f0f0","#C8C8C8","#fff"]    },
      { id:"blush",  label:"Blush & Gold",    colors:["#F4A7B9","#FFD700","#fff","#FFB6C1"]     },
      { id:"pink",   label:"Hot Pink & White", colors:["#E91E8C","#fff","#FFB6C1","#f5f5f5"]    },
    ],
  },
  {
    id: "pool",
    name: "Pool Decor",
    tagline: "Soak up the bach life",
    emoji: "🏊",
    price: "$129",
    bg: "#F0F8FF",
    border: "#29B6F6",
    headlineColor: "#0288D1",
    description: "Perfect for pool parties! Pool floats, foil balloon letters, latex balloon poofs outside, and drink pouches for every attendee.",
    includes: [
      "4 pool floats",
      "Foil balloon letter sign",
      "Latex balloon poofs (outdoor-hung)",
      "Drink pouches for each attendee",
    ],
    vibes: [
      { id:"tropical", label:"Tropical Pink",   colors:["#E91E8C","#29B6F6","#FF4081","#81D4FA"] },
      { id:"miami",    label:"Miami Vibes",      colors:["#FF6B6B","#FFE66D","#4ECDC4","#FF8E8E"] },
      { id:"flamingo", label:"Flamingo Dreams",  colors:["#FF69B4","#FFB6C1","#29B6F6","#FF4081"] },
    ],
  },
];

// ─── Decoration overlays ──────────────────────────────────────────────────────
function ClassicOverlay({ vibe }) {
  const [c1, c2, c3, c4] = vibe.colors;
  const balloons = [
    {l:"5%",b:"3%",s:56},{l:"14%",b:"7%",s:46},{l:"23%",b:"3%",s:62},
    {l:"34%",b:"6%",s:48},{l:"44%",b:"2%",s:58},{l:"55%",b:"7%",s:50},
    {l:"64%",b:"3%",s:54},{l:"74%",b:"6%",s:44},{l:"83%",b:"2%",s:60},{l:"91%",b:"5%",s:48},
  ];
  return (
    <>
      {/* Streamers */}
      {[0,1,2,3,4,5].map(i=>(
        <div key={`sl${i}`} style={{position:"absolute",top:0,left:`${i*7}%`,width:3,height:`${50+i*3}%`,
          background:`linear-gradient(180deg,${c1},transparent)`,opacity:0.5,borderRadius:2}}/>
      ))}
      {[0,1,2,3,4,5].map(i=>(
        <div key={`sr${i}`} style={{position:"absolute",top:0,right:`${i*7}%`,width:3,height:`${50+i*3}%`,
          background:`linear-gradient(180deg,${c1},transparent)`,opacity:0.5,borderRadius:2}}/>
      ))}
      {/* BRIDE letter balloons */}
      <div style={{position:"absolute",top:"9%",left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,zIndex:10}}>
        {"BRIDE".split("").map((l,i)=>(
          <div key={i} style={{
            width:38,height:46,borderRadius:"50% 50% 48% 52%/55% 55% 45% 45%",
            background:`radial-gradient(circle at 32% 32%,${c4||"#fff"},${c1})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:15,fontWeight:900,color:"rgba(0,0,0,0.5)",
            fontFamily:"'Playfair Display',Georgia,serif",
            boxShadow:`2px 4px 12px rgba(0,0,0,0.28),inset -2px -2px 6px rgba(0,0,0,0.1)`,
            border:`1.5px solid ${c3}`,
          }}>{l}</div>
        ))}
      </div>
      {/* Ring accent */}
      <div style={{position:"absolute",top:"7%",left:"50%",marginLeft:116,fontSize:26,
        filter:"drop-shadow(2px 3px 6px rgba(0,0,0,0.3))"}}>💍</div>
      {/* Floor balloons */}
      {balloons.map((b,i)=>(
        <div key={i} style={{
          position:"absolute",left:b.l,bottom:b.b,width:b.s,height:b.s*1.18,
          borderRadius:"50% 50% 48% 52%/55% 55% 45% 45%",
          background:`radial-gradient(circle at 33% 33%,${c4||"#fff"},${c1})`,
          boxShadow:`2px 4px 10px rgba(0,0,0,0.22),inset -2px -3px 8px rgba(0,0,0,0.1)`,
          opacity:0.93,
        }}/>
      ))}
    </>
  );
}

function PinkOverlay({ vibe }) {
  const [c1, c2, c3, c4] = vibe.colors;
  const arch = [
    {l:"0%",t:"58%",s:44},{l:"7%",t:"40%",s:50},{l:"14%",t:"26%",s:54},
    {l:"22%",t:"15%",s:58},{l:"31%",t:"8%",s:56},{l:"41%",t:"3%",s:60},
    {l:"50%",t:"1%",s:62},{l:"59%",t:"3%",s:60},{l:"68%",t:"8%",s:56},
    {l:"77%",t:"15%",s:54},{l:"85%",t:"26%",s:50},{l:"91%",t:"40%",s:46},{l:"96%",t:"58%",s:42},
  ];
  const archColors = [c1,c2,c3,c4,c1,c2,c3,c4,c1,c2,c3,c4,c1];
  return (
    <>
      {/* Fringe curtain */}
      {Array.from({length:16}).map((_,i)=>(
        <div key={`f${i}`} style={{
          position:"absolute",top:0,left:`${i*6.5}%`,width:5,
          height:`${62+Math.sin(i)*12}%`,
          background:`linear-gradient(180deg,${c1},${c2},${c3}88)`,
          opacity:0.55,borderRadius:"0 0 4px 4px",
        }}/>
      ))}
      {/* Balloon garland arch */}
      {arch.map((p,i)=>(
        <div key={i} style={{
          position:"absolute",left:p.l,top:p.t,width:p.s,height:p.s*1.1,
          borderRadius:"50% 50% 48% 52%/55% 55% 45% 45%",
          background:`radial-gradient(circle at 33% 30%,rgba(255,255,255,0.55),${archColors[i]})`,
          boxShadow:`2px 4px 10px rgba(0,0,0,0.25),inset -2px -3px 8px rgba(0,0,0,0.15)`,
          transform:"translate(-50%,-50%)",zIndex:10,
        }}/>
      ))}
      {/* BACH banner */}
      <div style={{
        position:"absolute",top:"22%",left:"50%",transform:"translateX(-50%)",
        background:`linear-gradient(135deg,${c1},${c2})`,
        color:WHITE,fontFamily:"'Playfair Display',Georgia,serif",
        fontSize:22,fontWeight:900,padding:"8px 28px",borderRadius:6,
        boxShadow:"0 4px 16px rgba(0,0,0,0.3)",letterSpacing:8,
        border:"2px solid rgba(255,255,255,0.4)",zIndex:11,
        textShadow:"1px 1px 4px rgba(0,0,0,0.3)",
      }}>BACH</div>
      {/* Table setup */}
      <div style={{
        position:"absolute",bottom:0,left:"5%",right:"5%",height:"20%",
        background:"linear-gradient(0deg,rgba(0,0,0,0.22),transparent)",
        display:"flex",alignItems:"flex-end",justifyContent:"center",gap:14,paddingBottom:8,
      }}>
        {["🥂","🎂","🌸","🥂","🌸","🎂","🥂"].map((e,i)=>(
          <span key={i} style={{fontSize:20,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.4))"}}>{e}</span>
        ))}
      </div>
    </>
  );
}

function BohoOverlay({ vibe }) {
  const [c1, c2, c3, c4] = vibe.colors;
  return (
    <>
      {/* Warm color tint */}
      <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${c1}20,${c2}15,transparent)`,pointerEvents:"none"}}/>
      {/* Pampas left */}
      <div style={{position:"absolute",bottom:0,left:0,width:"16%",height:"65%",display:"flex",flexDirection:"column",justifyContent:"flex-end",paddingLeft:6,gap:2}}>
        {Array.from({length:10}).map((_,i)=>(
          <div key={i} style={{height:3,background:c4,borderRadius:4,opacity:0.65+i*0.03,
            width:`${55+Math.sin(i*0.9)*28}%`,transform:`rotate(${-14+i*2.5}deg)`,
            transformOrigin:"left center",marginBottom:i%3===0?5:1}}/>
        ))}
        <span style={{fontSize:26,marginBottom:-4,filter:"drop-shadow(1px 2px 4px rgba(0,0,0,0.3))"}}>🌾</span>
      </div>
      {/* Pampas right */}
      <div style={{position:"absolute",bottom:0,right:0,width:"16%",height:"65%",display:"flex",flexDirection:"column",justifyContent:"flex-end",alignItems:"flex-end",paddingRight:6,gap:2}}>
        {Array.from({length:10}).map((_,i)=>(
          <div key={i} style={{height:3,background:c4,borderRadius:4,opacity:0.65+i*0.03,
            width:`${55+Math.sin(i*0.9)*28}%`,transform:`rotate(${14-i*2.5}deg)`,
            transformOrigin:"right center",marginBottom:i%3===0?5:1}}/>
        ))}
        <span style={{fontSize:26,marginBottom:-4,filter:"drop-shadow(1px 2px 4px rgba(0,0,0,0.3))"}}>🌾</span>
      </div>
      {/* Gold BRIDE balloons */}
      <div style={{position:"absolute",top:"10%",left:"50%",transform:"translateX(-50%)",display:"flex",gap:7,zIndex:10}}>
        {"BRIDE".split("").map((l,i)=>(
          <div key={i} style={{
            width:34,height:42,borderRadius:"50% 50% 48% 52%/55% 55% 45% 45%",
            background:`radial-gradient(circle at 30% 30%,#FFE88A,${c3})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:13,fontWeight:900,color:"rgba(0,0,0,0.55)",
            fontFamily:"'Playfair Display',Georgia,serif",
            boxShadow:`2px 4px 12px rgba(0,0,0,0.3),inset -2px -2px 6px rgba(0,0,0,0.15)`,
          }}>{l}</div>
        ))}
      </div>
      {/* Champagne + florals */}
      <div style={{position:"absolute",bottom:"8%",left:"50%",transform:"translateX(-50%)",textAlign:"center"}}>
        <div style={{display:"flex",gap:6,justifyContent:"center"}}>
          {["🥂","🥂","🥂"].map((e,i)=><span key={i} style={{fontSize:22,filter:"drop-shadow(1px 2px 4px rgba(0,0,0,0.3))"}}>{e}</span>)}
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:3}}>
          {["🌸","✨","🌸"].map((e,i)=><span key={i} style={{fontSize:18}}>{e}</span>)}
        </div>
      </div>
      <div style={{position:"absolute",bottom:"10%",left:"22%",fontSize:18}}>🕯️</div>
      <div style={{position:"absolute",bottom:"10%",right:"22%",fontSize:18}}>🕯️</div>
    </>
  );
}

// Pool overlay — floats, foil letters, outdoor balloon poofs
function PoolOverlay({ vibe }) {
  const [c1, c2, c3, c4] = vibe.colors;
  const floatEmojis = ["🦩","🦢","🍉","🦄"];
  const poof = [
    {l:"4%",b:"18%",s:48},{l:"16%",b:"22%",s:42},{l:"72%",b:"20%",s:46},{l:"84%",b:"16%",s:50},
  ];
  return (
    <>
      {/* Sky/water tint */}
      <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,${c4}18 0%,${c2}12 100%)`,pointerEvents:"none"}}/>
      {/* Foil balloon letters — BRIDE */}
      <div style={{position:"absolute",top:"8%",left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,zIndex:10}}>
        {"BRIDE".split("").map((l,i)=>(
          <div key={i} style={{
            width:36,height:44,borderRadius:"50% 50% 48% 52%/55% 55% 45% 45%",
            background:`radial-gradient(circle at 30% 30%,rgba(255,255,255,0.7),${c1})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:14,fontWeight:900,color:"rgba(0,0,0,0.5)",
            fontFamily:"'Playfair Display',Georgia,serif",
            boxShadow:`2px 4px 12px rgba(0,0,0,0.28),inset -2px -2px 6px rgba(0,0,0,0.1)`,
            border:`1.5px solid ${c3}`,
          }}>{l}</div>
        ))}
      </div>
      {/* Balloon poofs on sides */}
      {poof.map((p,i)=>(
        <div key={i} style={{
          position:"absolute",left:p.l,bottom:p.b,width:p.s,height:p.s,
          borderRadius:"50%",
          background:`radial-gradient(circle at 33% 33%,rgba(255,255,255,0.6),${i%2===0?c1:c3})`,
          boxShadow:`2px 4px 10px rgba(0,0,0,0.22),inset -2px -3px 8px rgba(0,0,0,0.1)`,
        }}/>
      ))}
      {/* Pool floats */}
      <div style={{position:"absolute",bottom:"4%",left:"50%",transform:"translateX(-50%)",display:"flex",gap:16}}>
        {floatEmojis.map((e,i)=>(
          <span key={i} style={{fontSize:28,filter:"drop-shadow(2px 3px 6px rgba(0,0,0,0.3))",transform:`rotate(${-8+i*5}deg)`}}>{e}</span>
        ))}
      </div>
      {/* Drink pouches */}
      <div style={{position:"absolute",bottom:"14%",right:"10%",display:"flex",gap:6}}>
        {["🍹","🍹","🍹"].map((e,i)=>(
          <span key={i} style={{fontSize:20,filter:"drop-shadow(1px 2px 4px rgba(0,0,0,0.3))"}}>{e}</span>
        ))}
      </div>
    </>
  );
}

function DecorationOverlay({ pkg, vibe }) {
  if (!pkg || !vibe) return null;
  if (pkg.id === "mini")        return <ClassicOverlay vibe={vibe}/>;
  if (pkg.id === "full")        return <PinkOverlay    vibe={vibe}/>;
  if (pkg.id === "brides-room") return <BohoOverlay    vibe={vibe}/>;
  if (pkg.id === "pool")        return <PoolOverlay    vibe={vibe}/>;
  return null;
}

// ─── Balloon Garland Builder ──────────────────────────────────────────────────
const BALLOON_COLORS = [
  // ── Pinks / Blush / Rose ──────────────────────────────────────────────────
  { id:"blush",            label:"Blush",              color:"#F4A7B9", dot:"#F4A7B9" },
  { id:"cameo",            label:"Cameo",              color:"#E8B4B8", dot:"#E8B4B8" },
  { id:"romey",            label:"Romey",              color:"#F5B8A0", dot:"#F5B8A0" },
  { id:"baby-pink",        label:"Baby Pink",          color:"#FFB5C2", dot:"#FFB5C2" },
  { id:"pink",             label:"Pink",               color:"#E87DA5", dot:"#E87DA5" },
  { id:"shimmering-pink",  label:"Shimmering Pink",    color:"#E06090", dot:"#E06090" },
  { id:"canyon-rose",      label:"Canyon Rose",        color:"#B5616B", dot:"#B5616B" },
  { id:"coral",            label:"Coral",              color:"#F87171", dot:"#F87171" },
  { id:"taffy",            label:"Taffy",              color:"#FF6B8A", dot:"#FF6B8A" },
  { id:"pixie",            label:"Pixie",              color:"#E84D8A", dot:"#E84D8A" },
  { id:"hotpink",          label:"Hot Pink",           color:"#E91E8C", dot:"#E91E8C" },
  { id:"metallic-fuchsia", label:"Metallic Fuchsia",   color:"#E61881", dot:"#E61881" },
  { id:"crystal-magenta",  label:"Crystal Magenta",    color:"#D9148A", dot:"#D9148A" },
  { id:"crystal-burgundy", label:"Crystal Burgundy",   color:"#A31045", dot:"#A31045" },
  { id:"sangria",          label:"Sangria",            color:"#7D2248", dot:"#7D2248" },
  // ── Reds ─────────────────────────────────────────────────────────────────
  { id:"scarlett",              label:"Scarlett",            color:"#CC2936", dot:"#CC2936" },
  { id:"samba",                 label:"Samba",               color:"#B8001F", dot:"#B8001F" },
  { id:"red",                   label:"Red",                 color:"#E8112D", dot:"#E8112D" },
  { id:"crystal-red",           label:"Crystal Red",         color:"#D7282F", dot:"#D7282F" },
  { id:"metallic-starfire-red", label:"Metallic Starfire Red", color:"#C8002D", dot:"#C8002D" },
  // ── Oranges / Warm Tones ─────────────────────────────────────────────────
  { id:"aloha",            label:"Aloha",              color:"#FF8C69", dot:"#FF8C69" },
  { id:"metallic-rose-gold",label:"Metallic Rose Gold",color:"#E8937B", dot:"#E8937B" },
  { id:"burnt-orange",     label:"Burnt Orange",       color:"#D4541C", dot:"#D4541C" },
  { id:"orange",           label:"Orange",             color:"#FF6B1A", dot:"#FF6B1A" },
  { id:"cheeky",           label:"Cheeky",             color:"#FF9B7A", dot:"#FF9B7A" },
  { id:"terracotta",       label:"Terracotta",         color:"#C4956A", dot:"#C4956A" },
  // ── Yellows ──────────────────────────────────────────────────────────────
  { id:"lemonade",         label:"Lemonade",           color:"#FFEA5A", dot:"#FFEA5A" },
  { id:"crystal-yellow",   label:"Crystal Yellow",     color:"#EFEF1E", dot:"#EFEF1E" },
  { id:"yellow",           label:"Yellow",             color:"#FFE800", dot:"#FFE800" },
  { id:"goldenrod",        label:"Goldenrod",          color:"#FFC72C", dot:"#FFC72C" },
  { id:"mustard",          label:"Mustard",            color:"#D4A820", dot:"#D4A820" },
  { id:"gold",             label:"Metallic Gold",      color:"#C8960C", dot:"#C8960C" },
  { id:"champagne",        label:"Champagne",          color:"#F5DEB3", dot:"#F5DEB3" },
  // ── Greens ───────────────────────────────────────────────────────────────
  { id:"lime-green",           label:"Lime Green",          color:"#A8D700", dot:"#A8D700" },
  { id:"fiona",                label:"Fiona",               color:"#C5D5C5", dot:"#C5D5C5" },
  { id:"green",                label:"Green",               color:"#4CAF50", dot:"#4CAF50" },
  { id:"metallic-green",       label:"Metallic Green",      color:"#388E3C", dot:"#388E3C" },
  { id:"crystal-emerald",      label:"Crystal Emerald Green",color:"#00833E", dot:"#00833E" },
  { id:"metallic-forest-green",label:"Metallic Forest Green",color:"#1B5E20", dot:"#1B5E20" },
  { id:"evergreen",            label:"Evergreen",           color:"#006B3C", dot:"#006B3C" },
  { id:"willow",               label:"Willow",              color:"#95A89A", dot:"#95A89A" },
  { id:"meadow",               label:"Meadow",              color:"#76A96C", dot:"#76A96C" },
  { id:"empower-mint",         label:"Empower-Mint",        color:"#87C5A4", dot:"#87C5A4" },
  { id:"mint",                 label:"Mint",                color:"#80CBC4", dot:"#80CBC4" },
  { id:"sage",                 label:"Sage",                color:"#8FAF8F", dot:"#8FAF8F" },
  // ── Teals / Turquoise ────────────────────────────────────────────────────
  { id:"metallic-teal",  label:"Metallic Teal",  color:"#007B82", dot:"#007B82" },
  { id:"teal",           label:"Teal",           color:"#00A591", dot:"#00A591" },
  { id:"sea-glass",      label:"Sea Glass",      color:"#A8D8D8", dot:"#A8D8D8" },
  { id:"seafoam",        label:"Seafoam",        color:"#68DACA", dot:"#68DACA" },
  { id:"turquoise",      label:"Turquoise",      color:"#00B5CC", dot:"#00B5CC" },
  // ── Blues ────────────────────────────────────────────────────────────────
  { id:"monet",                  label:"Monet",                   color:"#C5D9F0", dot:"#C5D9F0" },
  { id:"baby-blue",              label:"Baby Blue",               color:"#B8D8E8", dot:"#B8D8E8" },
  { id:"georgia",                label:"Georgia",                 color:"#7BA7BC", dot:"#7BA7BC" },
  { id:"blue-slate",             label:"Blue Slate",              color:"#5C8399", dot:"#5C8399" },
  { id:"blue",                   label:"Blue",                    color:"#0084C1", dot:"#0084C1" },
  { id:"metallic-blue",          label:"Metallic Blue",           color:"#005BA6", dot:"#005BA6" },
  { id:"royalty",                label:"Royalty",                 color:"#0052A5", dot:"#0052A5" },
  { id:"crystal-sapphire",       label:"Crystal Sapphire Blue",   color:"#0065A4", dot:"#0065A4" },
  { id:"navy",                   label:"Navy",                    color:"#003F7F", dot:"#003F7F" },
  { id:"naval",                  label:"Naval",                   color:"#002E6D", dot:"#002E6D" },
  { id:"metallic-midnight-blue", label:"Metallic Midnight Blue",  color:"#002366", dot:"#002366" },
  // ── Purples ──────────────────────────────────────────────────────────────
  { id:"peri",           label:"Peri",           color:"#7B8ED6", dot:"#7B8ED6" },
  { id:"blossom",        label:"Blossom",         color:"#CF7EB8", dot:"#CF7EB8" },
  { id:"lavender",       label:"Lavender",        color:"#C0A0D0", dot:"#C0A0D0" },
  { id:"mauve",          label:"Mauve",           color:"#C48B9F", dot:"#C48B9F" },
  { id:"purple",         label:"Purple",          color:"#9C27B0", dot:"#9C27B0" },
  { id:"plum",           label:"Plum Purple",     color:"#7F2F92", dot:"#7F2F92" },
  { id:"crystal-purple", label:"Crystal Purple",  color:"#5C1A7F", dot:"#5C1A7F" },
  // ── Neutrals / Whites ────────────────────────────────────────────────────
  { id:"white",          label:"White",           color:"#F8F8F8", dot:"#E8E8E8" },
  { id:"sugar",          label:"Sugar",           color:"#FFF0F5", dot:"#F0E0E8" },
  { id:"crystal-clear",  label:"Crystal Clear",   color:"#DFF0F8", dot:"#C8E0EE" },
  { id:"fog",            label:"Fog",             color:"#9DB0BA", dot:"#9DB0BA" },
  { id:"silver",         label:"Metallic Silver", color:"#C0C0C0", dot:"#B0B0B0" },
  { id:"gray-smoke",     label:"Gray Smoke",      color:"#888888", dot:"#888888" },
  { id:"black",          label:"Black",           color:"#1A1A1A", dot:"#111"    },
  // ── Browns / Earthy ──────────────────────────────────────────────────────
  { id:"lace",           label:"Lace",            color:"#F5ECD7", dot:"#EAD8BE" },
  { id:"muse",           label:"Muse",            color:"#C8A882", dot:"#C8A882" },
  { id:"stone",          label:"Stone",           color:"#B5A898", dot:"#B5A898" },
  { id:"malted",         label:"Malted",          color:"#C8956A", dot:"#C8956A" },
  { id:"cocoa",          label:"Cocoa",           color:"#7B5346", dot:"#7B5346" },
];

// Organic garland balloon positions (x%, y%, size px, colorIndex cycling)
const GARLAND_BALLOONS = [
  // large anchors
  {x:13,y:68,s:82,ci:0},{x:33,y:42,s:92,ci:1},{x:54,y:18,s:86,ci:2},{x:76,y:34,s:82,ci:3},
  // medium fills
  {x:4, y:52,s:56,ci:1},{x:23,y:58,s:60,ci:2},{x:24,y:30,s:54,ci:0},{x:44,y:34,s:62,ci:3},
  {x:44,y:58,s:56,ci:1},{x:61,y:48,s:60,ci:2},{x:66,y:9, s:54,ci:0},{x:81,y:54,s:56,ci:4},
  {x:89,y:21,s:60,ci:1},
  // small accents
  {x:9, y:40,s:34,ci:3},{x:19,y:80,s:30,ci:2},{x:29,y:50,s:36,ci:4},{x:39,y:20,s:32,ci:1},
  {x:51,y:54,s:36,ci:0},{x:63,y:33,s:32,ci:3},{x:73,y:14,s:34,ci:2},{x:86,y:42,s:36,ci:4},
  {x:93,y:34,s:30,ci:0},
  // tiny accents
  {x:7, y:66,s:22,ci:4},{x:17,y:44,s:20,ci:3},{x:27,y:40,s:18,ci:2},{x:42,y:47,s:20,ci:1},
  {x:59,y:27,s:22,ci:0},{x:79,y:47,s:20,ci:3},{x:96,y:27,s:18,ci:4},
];

function PatternDots() { return null; }

// ── 3D Garland Preview ────────────────────────────────────────────────────────
// Two distinct clusters (upper-left + lower-right) joined by a narrow bridge
// [x, y, z, radius, colorIndex]
const GARLAND_3D_LAYOUT = [
  // ══ CLUSTER 1 — upper-left ═══════════════════════════════════════════════
  // XL heroes
  [-3.0,  0.8,  0.2, 1.22, 0],
  [-1.6,  1.7, -0.2, 1.10, 1],
  // Large
  [-2.5,  2.2,  0.1, 0.92, 2],
  [-1.0,  0.4,  0.3, 0.88, 3],
  [-3.8,  1.5, -0.2, 0.82, 4],
  // Medium cluster 1
  [-3.0,  3.0,  0.1, 0.58, 0],
  [-1.8,  2.9, -0.1, 0.56, 1],
  [-0.5,  2.1,  0.2, 0.54, 2],
  [-0.3,  0.9, -0.1, 0.52, 3],
  [-4.3,  2.2,  0.1, 0.52, 4],
  [-4.5,  0.8, -0.1, 0.50, 0],
  // Depth front cluster 1
  [-2.5,  1.2,  1.7, 0.55, 1],
  [-1.2,  1.6,  1.8, 0.52, 2],
  // Depth back cluster 1
  [-2.2,  0.9, -1.7, 0.52, 3],
  [-0.8,  1.3, -1.8, 0.50, 4],
  // Small cluster 1
  [-3.5,  3.5,  0.1, 0.32, 0],
  [-2.2,  3.7,  0.0, 0.30, 1],
  [-1.0,  3.3, -0.1, 0.28, 2],
  [-0.1,  2.8,  0.1, 0.28, 3],
  [-4.8,  2.8,  0.0, 0.28, 4],
  [-5.0,  1.5,  0.1, 0.28, 0],
  [-4.9,  0.1, -0.1, 0.26, 1],
  [-4.1, -0.5,  0.1, 0.28, 2],
  [-3.0, -0.6,  0.0, 0.26, 3],
  [-1.6, -0.6, -0.1, 0.26, 4],

  // ══ BRIDGE — narrow spine connecting the two clusters ════════════════════
  [ 0.2,  0.1,  0.2, 0.75, 0],
  [ 1.0,  0.5, -0.2, 0.72, 1],
  [ 1.6, -0.2,  0.2, 0.70, 2],
  // Small bridge fills
  [ 0.5, -0.6,  0.1, 0.36, 3],
  [ 1.1,  1.1, -0.1, 0.36, 4],
  [ 1.9,  0.7,  0.2, 0.34, 0],
  [ 2.1, -0.7, -0.1, 0.34, 1],
  [-0.3, -0.6,  0.1, 0.34, 2],

  // ══ CLUSTER 2 — lower-right ══════════════════════════════════════════════
  // XL heroes
  [ 2.9, -1.0,  0.2, 1.20, 3],
  [ 4.1, -0.2, -0.2, 1.10, 4],
  // Large
  [ 3.5, -2.1,  0.1, 0.90, 0],
  [ 4.9, -1.4,  0.3, 0.88, 1],
  [ 2.2, -0.1, -0.2, 0.82, 2],
  // Medium cluster 2
  [ 5.5,  0.2,  0.1, 0.58, 3],
  [ 5.4, -1.6, -0.1, 0.56, 4],
  [ 4.5, -2.9,  0.2, 0.54, 0],
  [ 3.1, -2.8, -0.1, 0.52, 1],
  [ 2.2, -1.8,  0.1, 0.52, 2],
  // Depth front cluster 2
  [ 3.2, -0.8,  1.7, 0.55, 3],
  [ 4.5, -1.2,  1.8, 0.52, 4],
  // Depth back cluster 2
  [ 3.0, -0.5, -1.7, 0.52, 0],
  [ 4.3, -1.5, -1.8, 0.50, 1],
  // Small cluster 2
  [ 5.9,  0.8,  0.1, 0.30, 2],
  [ 5.9, -0.6,  0.0, 0.28, 3],
  [ 5.8, -2.2, -0.1, 0.28, 4],
  [ 5.1, -3.2,  0.1, 0.28, 0],
  [ 3.8, -3.3,  0.0, 0.28, 1],
  [ 2.4, -3.1, -0.1, 0.26, 2],
  [ 1.4, -2.5,  0.1, 0.26, 3],

  // ══ TINY GAP FILLERS ═════════════════════════════════════════════════════
  [-1.8,  0.1,  0.0, 0.16, 4],
  [-2.5,  0.1,  0.0, 0.16, 0],
  [-0.6,  0.1,  0.0, 0.16, 1],
  [ 0.4,  0.0,  0.0, 0.16, 2],
  [ 1.3,  0.1,  0.0, 0.16, 3],
  [ 3.2, -0.4,  0.0, 0.16, 4],
  [-1.2,  2.2,  0.0, 0.16, 0],
  [-3.2,  1.3,  0.0, 0.16, 1],
  [ 2.2, -1.6,  0.0, 0.16, 2],
  [ 4.6, -1.8,  0.0, 0.16, 3],
  [-3.6,  0.0,  0.0, 0.16, 4],
];

function Balloon3D({ position, radius, color }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 40, 40]} />
      <meshStandardMaterial
        color={color}
        roughness={0.75}
        metalness={0.0}
      />
    </mesh>
  );
}

const GARLAND_X_MIN = -5.2;
const GARLAND_X_MAX = 6.1;

function GarlandScene({ selectedColors, arrangement }) {
  const palette = selectedColors.map(id => {
    const col = BALLOON_COLORS.find(c => c.id === id);
    return col ? col.color : '#ffb6c1';
  });

  const getColor = (b) => {
    if (!palette.length) return '#ffb6c1';
    if (arrangement === 'colorblock' && palette.length > 1) {
      // Divide garland x-range into palette.length equal zones
      const zoneWidth = (GARLAND_X_MAX - GARLAND_X_MIN) / palette.length;
      const zone = Math.min(
        Math.floor((b[0] - GARLAND_X_MIN) / zoneWidth),
        palette.length - 1
      );
      return palette[Math.max(0, zone)];
    }
    return palette[b[4] % palette.length];
  };

  return (
    <>
      <ambientLight intensity={1.1} color="#fff8f2" />
      <directionalLight position={[4, 8, 8]} intensity={1.2} color="#fff5ee" />
      <directionalLight position={[-5, 4, -3]} intensity={0.5} color="#ffe8d0" />
      <pointLight position={[0, 5, 9]} intensity={0.5} color="#ffffff" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        target={[0.4, 0.2, 0]}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.9}
      />
      {GARLAND_3D_LAYOUT.map((b, i) => (
        <Balloon3D
          key={i}
          position={[b[0], b[1], b[2]]}
          radius={b[3]}
          color={getColor(b)}
        />
      ))}
    </>
  );
}

function GarlandPreview({ selectedColors, arrangement }) {
  const bg = "#f8f0e4";
  if (selectedColors.length === 0) {
    return (
      <div style={{height:260,display:"flex",alignItems:"center",justifyContent:"center",background:bg,borderRadius:14,border:`2px dashed ${BORDER}`}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:12,color:"#bbb",fontFamily:"'Nunito',sans-serif"}}>Pick colors below to preview your 3D garland</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{borderRadius:14,overflow:"hidden",border:`1.5px solid ${BORDER}`,background:bg}}>
      <div style={{height:260,background:bg}}>
        <Canvas camera={{ position:[0.4, 1.8, 10], fov:66 }} style={{background:bg}}>
          <color attach="background" args={[bg]} />
          <GarlandScene selectedColors={selectedColors} arrangement={arrangement} />
        </Canvas>
      </div>
      <div style={{textAlign:"center",fontSize:10,color:"#bbb",fontFamily:"'Nunito',sans-serif",padding:"5px 0 6px",background:bg,letterSpacing:"0.5px"}}>
        ✦ Drag to rotate 360° ✦
      </div>
    </div>
  );
}

// ─── Tableware data ───────────────────────────────────────────────────────────
// 💡 TO ADD YOUR PRODUCT PHOTOS: replace `image: null` with the URL of your photo.
//    Option A – Host on Squarespace: upload the image to your Squarespace Media folder,
//               then right-click the image → Copy Image Address, and paste it here, e.g.:
//               image: "https://images.squarespace-cdn.com/content/.../your-photo.jpg"
//    Option B – Any direct image link works (Google Drive public link, Dropbox, etc.)
//    If image is null, a color-matched placeholder shape is shown instead.
export const TABLEWARE = [
  // ── Plates (real products from bachhotlinesupplies.etsy.com) ────────────────
  {
    id:"plate-xo", type:"plate", name:"XO Plates",
    desc:"Show your love in style with these adorable XO paper plates. A chic design that is perfect for serving appetizers, desserts, or snacks at your event.",
    price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5be21dd3-07af-42ae-b7f1-380e6653c5c2/Ebook+Thumbnail+with+Video+-+2025-01-23T115601.216.png?format=500w",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5be21dd3-07af-42ae-b7f1-380e6653c5c2/Ebook+Thumbnail+with+Video+-+2025-01-23T115601.216.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a57cd80c-b01d-4be3-8d5a-c2ab7dfcf4f6/Ebook+Thumbnail+with+Video+-+2025-01-23T115549.081.png?format=500w",
    ],
    bullets:["Set of 8","Dimensions: 9\"w x 9\"l","Durable, disposable plates for easy cleanup"],
    bg:"#F4A7B9", accent:"#CC0000",
    tags:["blush","hotpink","red","mauve","confetti"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/xo-plates",
  },
  {
    id:"plate-strawberry", type:"plate", name:"Strawberry Paper Plates",
    desc:"Add a sweet and fun touch to your bachelorette celebration with these strawberry paper plates! Perfect for serving snacks, desserts, or appetizers.",
    price:"$13.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6bbd351b-a87b-4518-9f72-85f829fa8c2a/Ebook+Thumbnail+with+Video+-+2025-01-22T193036.107.png?format=500w",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6bbd351b-a87b-4518-9f72-85f829fa8c2a/Ebook+Thumbnail+with+Video+-+2025-01-22T193036.107.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/80b03024-a550-4a0c-b827-89296d0b5c28/Ebook+Thumbnail+with+Video+-+2025-01-22T193723.437.png?format=500w",
    ],
    bullets:["Set of 8","Dimensions: 7\"w x 10\"l","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#E53935", accent:"#B71C1C",
    tags:["red","hotpink","blush"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/strawberry-plates",
  },
  {
    id:"plate-star",     type:"plate", name:"Foil Star Paper Plates",
    desc:"Shine bright, bride tribe! These silver star-shaped plates bring glamour to bachelorette celebrations, perfect for snacks, sweets, and star studded vibes.",
    bullets:["Set of 8","Dimensions: 11\"w x 11\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.50",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3032563d-005e-4659-834e-55f2fe71ad05/Ebook+Thumbnail+with+Video+-+2025-01-22T204555.167.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/275f23cb-8a0e-44d7-9687-35e61d624b86/Ebook+Thumbnail+with+Video+-+2025-01-22T204635.535.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3032563d-005e-4659-834e-55f2fe71ad05/Ebook+Thumbnail+with+Video+-+2025-01-22T204555.167.png?format=500w",
    bg:"#D0D0D0", accent:"#A0A0A0",
    tags:["silver","white","champagne","gold"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/foil-star-plates",
  },
  {
    id:"plate-romcom",   type:"plate", name:"RomCom Paper Plates",
    desc:"Add a little movie magic to mealtime with our romcom dinner plates. Playful, cute, and ready for popcorn, pasta, and all the feel good moments.",
    bullets:["Set of 8","Dimensions: 10\"w x 10\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$13.50",
    images:[
      "https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/e66bc5/7879283220/il_fullxfull.7879283220_8chy.jpg",
    ],
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/e66bc5/7879283220/il_fullxfull.7879283220_8chy.jpg",
    bg:"#FF69B4", accent:"#E91E8C",
    tags:["hotpink","blush","lavender","confetti","mauve"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"plate-sardine",  type:"plate", name:"Sardine Can Paper Plates",
    desc:"Make waves at dinner with our sardine can plate. Quirky, coastal, and ready to steal the show.",
    bullets:["Set of 8","Dimensions: 6.5\"w x 8.5\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$13.98",
    images:[
      "https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/b22232/7879236574/il_fullxfull.7879236574_k366.jpg",
    ],
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/b22232/7879236574/il_fullxfull.7879236574_k366.jpg",
    bg:"#81D4FA", accent:"#0288D1",
    tags:["blue","mint","white"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"plate-vegas",    type:"plate", name:"Vegas Casino Paper Plates",
    desc:"Totally giving \"Welcome to Fabulous Bachelorette!\" They're the perfect mix of cute, glam, and easy cleanup for a night your girls won't forget.",
    bullets:["Set of 8","Dimensions: 6.5\"w x 10\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.95",
    images:[
      "https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/41c451/7875376356/il_fullxfull.7875376356_mnir.jpg",
    ],
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/41c451/7875376356/il_fullxfull.7875376356_mnir.jpg",
    bg:"#F4A7B9", accent:"#C4956A",
    tags:["hotpink","blush","gold","champagne"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"plate-skull",    type:"plate", name:"Sugar Skull Plates",
    desc:"Add a pop of color (and a little spook!) to your table with these sugar skull shaped plates, made for fiestas, trick or treats, and everything in between.",
    price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8da61868-ac7a-4732-8951-10c484f16311/Ebook+Thumbnail+with+Video+-+2025-07-20T134000.393.png?format=500w",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8da61868-ac7a-4732-8951-10c484f16311/Ebook+Thumbnail+with+Video+-+2025-07-20T134000.393.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/79d746e3-b099-428d-9468-b170b9309479/Ebook+Thumbnail+with+Video+-+2025-07-20T134829.380.png?format=500w",
    ],
    bullets:["Set of 8","Dimensions: 10\"l x 7.25\"w","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#F8F8F8", accent:"#CE93D8",
    tags:["white","lavender","mint","sage"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/sugar-skull-plates",
  },
  {
    id:"plate-shootingstar", type:"plate", name:"Shooting Star Plates",
    desc:"Serve snacks with star power! These shiny silver shooting star plates add a touch of magic to any party table.",
    price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/bbab1182-74e8-4885-bcbd-4e0447de025c/Ebook+Thumbnail+with+Video+-+2025-07-20T111448.980.png?format=500w",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/bbab1182-74e8-4885-bcbd-4e0447de025c/Ebook+Thumbnail+with+Video+-+2025-07-20T111448.980.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/57d6e234-ee40-4307-a6d1-a364c161f516/Ebook+Thumbnail+with+Video+-+2025-07-20T111459.848.png?format=500w",
    ],
    bullets:["Set of 4","Dimensions: 19.25\"w x 9\"l","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#D0D0D0", accent:"#9E9E9E",
    tags:["silver","white","gold","champagne"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/shooting-star-plates",
  },
  {
    id:"plate-aries", type:"plate", name:"Aries Plates",
    related:["napkin-aries"],
    desc:"Serve cosmic vibes and star powered style with these aries paper plates perfect for celestial queens and astrology lovers alike! Make every gathering feel written in the stars.",
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.66",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ac80afce-7744-42d5-8f73-5ae19006c190/Ebook+Thumbnail+with+Video+-+2025-06-19T142057.849.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/2eced469-c532-4cb9-96f9-07b3a58353b8/Ebook+Thumbnail+with+Video+-+2025-06-19T142854.144.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ac80afce-7744-42d5-8f73-5ae19006c190/Ebook+Thumbnail+with+Video+-+2025-06-19T142057.849.png?format=500w",
    bg:"#E8112D", accent:"#FFD700",
    tags:["red","scarlett","hotpink","coral","orange","burnt-orange","gold","champagne","white","crystal-red"],
  },
  {
    id:"plate-sagittarius", type:"plate", name:"Sagittarius Plates",
    related:["napkin-sagittarius"],
    desc:"Serve cosmic vibes and star powered style with these sagittarius paper plates perfect for celestial queens and astrology lovers alike! Make every gathering feel written in the stars.",
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.66",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/bb8685aa-d811-4507-a5d4-c4c2bcf294ac/Ebook+Thumbnail+with+Video+-+2025-06-19T153901.572.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/925c7626-ab94-4cf4-9296-d8d598bae575/Ebook+Thumbnail+with+Video+-+2025-06-20T142921.861.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/bb8685aa-d811-4507-a5d4-c4c2bcf294ac/Ebook+Thumbnail+with+Video+-+2025-06-19T153901.572.png?format=500w",
    bg:"#FF6B1A", accent:"#9C27B0",
    tags:["orange","burnt-orange","aloha","coral","purple","plum","gold","champagne","white","red","scarlett"],
  },
  {
    id:"plate-leo", type:"plate", name:"Leo Plates",
    related:["napkin-leo"],
    desc:"Serve cosmic vibes and star powered style with these leo paper plates perfect for celestial queens and astrology lovers alike! Make every gathering feel written in the stars.",
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.66",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8e9ceb65-f8f7-4f63-9681-c7e035578b5a/Ebook+Thumbnail+with+Video+-+2025-06-19T145332.931.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8405a518-6b2b-4027-bf1b-d0d818fbfe80/Ebook+Thumbnail+with+Video+-+2025-06-19T145545.966.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8e9ceb65-f8f7-4f63-9681-c7e035578b5a/Ebook+Thumbnail+with+Video+-+2025-06-19T145332.931.png?format=500w",
    bg:"#FFD700", accent:"#E8112D",
    tags:["gold","metallic-gold","goldenrod","yellow","lemonade","orange","burnt-orange","red","champagne","white","mustard"],
  },
  {
    id:"plate-virgo", type:"plate", name:"Virgo Plates",
    related:["napkin-virgo"],
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w"],
    price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f254e469-94e7-4419-9e2f-917376020702/Ebook+Thumbnail+with+Video+-+2025-06-20T144445.334.png",
    bg:"#76A96C", accent:"#C8A882",
    tags:["green","sage","meadow","willow","evergreen","empower-mint","fiona","lace","muse","champagne","white","gold"],
  },
  {
    id:"plate-scorpio", type:"plate", name:"Scorpio Plates",
    related:["napkin-scorpio"],
    desc:"Serve cosmic vibes and star powered style with these Scorpio paper plates perfect for celestial queens and astrology lovers alike!",
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/69c961ce-45a6-486b-8994-fa2ba97ce94b/Ebook+Thumbnail+with+Video+-+2025-06-20T143712.766.png",
    bg:"#1A1A1A", accent:"#E8112D",
    tags:["black","red","scarlett","sangria","crystal-burgundy","purple","plum","crystal-purple","orange","burnt-orange","gray-smoke","navy"],
  },
  {
    id:"plate-taurus", type:"plate", name:"Taurus Plates",
    related:["napkin-taurus"],
    desc:"Serve cosmic vibes and star powered style with these taurus paper plates perfect for celestial queens and astrology lovers alike! Make every gathering feel written in the stars.",
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.99",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f0ef11d9-488e-4a47-941e-63450f45c451/Ebook+Thumbnail+with+Video+-+2025-06-20T145011.368.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/be180bf9-8fca-45bd-8eed-c8b4ec922140/Ebook+Thumbnail+with+Video+-+2025-06-20T145537.202.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f0ef11d9-488e-4a47-941e-63450f45c451/Ebook+Thumbnail+with+Video+-+2025-06-20T145011.368.png?format=500w",
    bg:"#76A96C", accent:"#FFD700",
    tags:["green","meadow","sage","evergreen","empower-mint","gold","champagne","white","lace","muse","terracotta"],
  },
  {
    id:"plate-cancer", type:"plate", name:"Cancer Plates",
    related:["napkin-cancer"],
    desc:"Serve cosmic vibes and star powered style with these cancer paper plates perfect for celestial queens and astrology lovers alike! Make every gathering feel written in the stars.",
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.66",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0a329598-a458-40ab-b0be-20d735e68542/Ebook+Thumbnail+with+Video+-+2025-06-19T140359.246.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/68c6354c-cf46-46d6-a35e-12fb0f81ee48/Ebook+Thumbnail+with+Video+-+2025-06-19T134652.576.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0a329598-a458-40ab-b0be-20d735e68542/Ebook+Thumbnail+with+Video+-+2025-06-19T140359.246.png?format=500w",
    bg:"#B8D8E8", accent:"#CE93D8",
    tags:["baby-blue","monet","sea-glass","seafoam","lavender","blossom","silver","white","sugar","champagne","peri"],
  },
  {
    id:"plate-libra", type:"plate", name:"Libra Plates",
    related:["napkin-libra"],
    desc:"Serve celestial vibes with these Libra paper plates — perfect for astrology-themed bachelorette parties.",
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w"],
    price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767900151827/Ebook+Thumbnail+with+Video+-+2025-06-19T151048.912.png",
    bg:"#F4A7B9", accent:"#FFD700",
    tags:["blush","baby-pink","pink","cameo","lavender","blossom","gold","champagne","white","silver","peri"],
  },
  {
    id:"plate-gemini", type:"plate", name:"Gemini Plates",
    related:["napkin-gemini"],
    desc:"Serve cosmic vibes and star powered style with these gemini paper plates perfect for celestial queens and astrology lovers alike! Make every gathering feel written in the stars.",
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.66",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f18f71b8-38ce-4f55-b260-64ca5c3038e4/Ebook+Thumbnail+with+Video+-+2025-06-19T144433.522.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/89e370db-910d-4d6e-b71e-b8ded0b120cc/Ebook+Thumbnail+with+Video+-+2025-06-19T144611.369.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f18f71b8-38ce-4f55-b260-64ca5c3038e4/Ebook+Thumbnail+with+Video+-+2025-06-19T144433.522.png?format=500w",
    bg:"#FFE800", accent:"#9C27B0",
    tags:["yellow","lemonade","goldenrod","lavender","purple","blossom","peri","gold","champagne","white","silver"],
  },
  {
    id:"plate-aquarius", type:"plate", name:"Aquarius Plates",
    related:["napkin-aquarius"],
    desc:"Serve cosmic vibes and star powered style with these aquarius paper plates perfect for celestial queens and astrology lovers alike! Make every gathering feel written in the stars.",
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.66",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f071f614-6a90-4346-bdbe-a806bfc89af5/Ebook+Thumbnail+with+Video+-+2025-06-19T141417.059.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/227a0547-989f-4f6c-9555-6ca4bcb6d992/Ebook+Thumbnail+with+Video+-+2025-06-19T141702.767.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f071f614-6a90-4346-bdbe-a806bfc89af5/Ebook+Thumbnail+with+Video+-+2025-06-19T141417.059.png?format=500w",
    bg:"#81D4FA", accent:"#0288D1",
    tags:["blue","baby-blue","monet","georgia","blue-slate","seafoam","teal","turquoise","sea-glass","navy","silver","white"],
  },
  {
    id:"plate-pisces", type:"plate", name:"Pisces Plates",
    related:["napkin-pisces"],
    desc:"Serve cosmic vibes and star powered style with these pisces paper plates perfect for celestial queens and astrology lovers alike! Make every gathering feel written in the stars.",
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.66",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a259f71b-f309-4ef6-a236-19c86c54209a/Ebook+Thumbnail+with+Video+-+2025-06-19T153612.085.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/39b8d5b6-c3ae-4368-9a0f-6aefc95f879c/Ebook+Thumbnail+with+Video+-+2025-06-19T152146.548.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a259f71b-f309-4ef6-a236-19c86c54209a/Ebook+Thumbnail+with+Video+-+2025-06-19T153612.085.png?format=500w",
    bg:"#68DACA", accent:"#9C27B0",
    tags:["seafoam","teal","turquoise","sea-glass","baby-blue","lavender","purple","blossom","silver","white","monet"],
  },
  {
    id:"plate-capricorn", type:"plate", name:"Capricorn Plates",
    related:["napkin-capricorn"],
    desc:"Serve cosmic vibes and star powered style with these Capricorn paper plates perfect for celestial queens and astrology lovers alike!",
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/48f333d2-3281-4a7a-b363-b3298b828e93/Ebook+Thumbnail+with+Video+-+2025-06-19T143322.139.png",
    bg:"#1A1A1A", accent:"#C8A882",
    tags:["black","navy","metallic-midnight-blue","stone","muse","lace","champagne","silver","gold","metallic-gold","evergreen"],
  },
  {
    id:"plate-zodiac", type:"plate", name:"Zodiac Plates",
    desc:"Celebrate alllll the zodiac signs with our combined signs dessert paper plate. Whether for a mysterious Scorpio or thoughtful Virgo, there's a star sign to celebrate.",
    bullets:["Set of 8","Dimensions: 7.25\"l x 7.25\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6149c360-56e9-478e-854a-a7ea9d2ec608/Ebook+Thumbnail+with+Video+-+2025-06-20T154150.275.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c8a80805-a0e2-4d76-a1bc-e9ee03fb6cda/Ebook+Thumbnail+with+Video+-+2025-06-20T154103.314.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6149c360-56e9-478e-854a-a7ea9d2ec608/Ebook+Thumbnail+with+Video+-+2025-06-20T154150.275.png?format=500w",
    bg:"#1A1A1A", accent:"#FFD700",
    tags:["black","gold","metallic-gold","champagne","purple","plum","lavender","silver","navy","metallic-midnight-blue","white"],
  },
  {
    id:"plate-queen-playing-card", type:"plate", name:"Queen Playing Card Plates",
    desc:"Deal up some love with these queen playing card plates! With bold red and pink details, they're perfect for galentine's brunch or a whimsical party.",
    bullets:["Set of 8","Dimensions: 6\"w x 9\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.50",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c22b0dcc-dc8b-49ee-8b6b-c1c641cc7102/Ebook+Thumbnail+with+Video+-+2025-05-18T120552.586.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/7d40bae2-3e88-4210-a646-34d16eb3c69a/Ebook+Thumbnail+with+Video+-+2025-05-18T120610.360.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c22b0dcc-dc8b-49ee-8b6b-c1c641cc7102/Ebook+Thumbnail+with+Video+-+2025-05-18T120552.586.png?format=500w",
    bg:"#E8112D", accent:"#FFB5C2",
    tags:["red","scarlett","hotpink","blush","baby-pink","pink","black","white","gold","crystal-red"],
  },
  {
    id:"plate-lunar-dragon", type:"plate", name:"Lunar Dragon Plates",
    desc:"Serve up good fortune and great food with these eye catching dragon plates made for lunar new year magic and memorable meals.",
    bullets:["Set of 12","Dimensions: 9\"w x 9\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.50",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/061a9243-cfb5-4b8d-8595-a1504f7369ea/Ebook+Thumbnail+with+Video+-+2025-07-06T223607.433.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/cca8b70f-1574-4cc7-a7ea-ac265e2f5808/Ebook+Thumbnail+with+Video+-+2025-07-06T223508.655.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/061a9243-cfb5-4b8d-8595-a1504f7369ea/Ebook+Thumbnail+with+Video+-+2025-07-06T223607.433.png?format=500w",
    bg:"#E8112D", accent:"#FFD700",
    tags:["red","scarlett","gold","metallic-gold","black","orange","burnt-orange","champagne","white","crystal-red"],
  },
  {
    id:"plate-butterfly", type:"plate", name:"Butterfly Plates",
    desc:"Whimsy meets glam with these butterfly paper plates. Ideal for bachelorettes, garden parties, and all things girly and gorgeous!",
    bullets:["Set of 8 (2 designs, 4 of each)","Dimensions: 10\"w x 10\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$16.25",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/69be9296-1b04-4ba1-8309-1c422057481b/Ebook+Thumbnail+with+Video+-+2025-01-30T083952.589.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/729e2138-7d44-4841-9f7d-7c1c37c4bfa5/Ebook+Thumbnail+with+Video+-+2025-01-30T084511.203.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ab27e207-4a43-40d0-9c85-76c47cc1205a/Ebook+Thumbnail+with+Video+-+2025-01-30T084523.223.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/9bcf0b3c-e2e0-4b89-981d-b8133ba7b485/Ebook+Thumbnail+with+Video+-+2025-01-30T084242.804.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/69be9296-1b04-4ba1-8309-1c422057481b/Ebook+Thumbnail+with+Video+-+2025-01-30T083952.589.png?format=500w",
    bg:"#CE93D8", accent:"#FFD700",
    tags:["lavender","purple","blossom","peri","blush","baby-pink","gold","champagne","mint","sea-glass","white","sugar"],
  },
  {
    id:"plate-cowboy-hat", type:"plate", name:"Cowboy Hat Plates",
    desc:"Yee-haw! Get ready to saddle up for a wild west bash with our cowboy tan hat paper plates. Let's get this party rodeo ready!",
    bullets:["Set of 8","Dimensions: 9\"w x 12\"h","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.33",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5fb0f5d5-fe62-4f33-a931-efdd1b4b8434/Ebook+Thumbnail+with+Video+-+2025-01-30T092019.581.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c49ac068-5ce1-4c70-9ccb-9534c31b2658/Ebook+Thumbnail+with+Video+-+2025-01-30T092218.862.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5fb0f5d5-fe62-4f33-a931-efdd1b4b8434/Ebook+Thumbnail+with+Video+-+2025-01-30T092019.581.png?format=500w",
    bg:"#C8A882", accent:"#1A1A1A",
    tags:["muse","malted","stone","lace","terracotta","champagne","burnt-orange","black","cocoa","mustard"],
  },
  {
    id:"plate-clam-shell", type:"plate", name:"Clam Shell Plates",
    desc:"Add ocean magic to your party with these clam shell paper plates for mermaid birthdays, beach picnics, or under the sea adventures! Cute, coastal, and totally Insta-worthy!",
    bullets:["Set of 8","Dimensions: 7.25\"l x 7.25\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$13.56",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/733589e0-e937-4be1-a014-3a53bface8b5/Ebook+Thumbnail+with+Video+-+2025-06-07T180250.169.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a0bd61f4-582d-417a-9963-3bf003448ff9/Ebook+Thumbnail+with+Video+-+2025-06-07T180411.610.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/733589e0-e937-4be1-a014-3a53bface8b5/Ebook+Thumbnail+with+Video+-+2025-06-07T180250.169.png?format=500w",
    bg:"#A8D8D8", accent:"#FFD700",
    tags:["sea-glass","seafoam","teal","turquoise","baby-blue","monet","mint","champagne","gold","white","lace"],
  },
  {
    id:"plate-disco-daisy-van", type:"plate", name:"Disco Daisy Van Plates",
    desc:"Let the good times roll with our disco daisy van paper plates! Designed like a vintage flower power van, these funky plates bring a retro vibe to any party.",
    bullets:["Set of 8","Dimensions: 9\"w x 9\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$13.76",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/e2376bd5-0596-4e4d-baaa-916a498de57f/Ebook+Thumbnail+with+Video+-+2025-05-08T104844.492.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5b9e32ef-4463-4fda-a997-7cbd6ffdc4f5/Ebook+Thumbnail+with+Video+-+2025-05-19T165348.071.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/e2376bd5-0596-4e4d-baaa-916a498de57f/Ebook+Thumbnail+with+Video+-+2025-05-08T104844.492.png?format=500w",
    bg:"#FFE800", accent:"#E91E8C",
    tags:["yellow","lemonade","hotpink","orange","green","lime-green","blue","lavender","white","confetti","rainbow"],
  },
  {
    id:"plate-cowgirl-hat", type:"plate", name:"Cowgirl Hat Plates",
    desc:"8 ct · 9\" x 12\"", price:"$13.80",
    bullets:["Set of 8","Dimensions: 9\"w x 12\"l"],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6849976ab91f060aa521e0e5/1767901042792/Ebook+Thumbnail+with+Video+-+2025-05-08T102554.943.png?format=1500w",
    bg:"#F4A7B9", accent:"#C4956A",
    tags:["hotpink","blush","baby-pink","pink","cameo","terracotta","muse","malted","champagne","lace","canyon-rose"],
  },
  {
    id:"plate-book-of-spells", type:"plate", name:"Book of Spells Plates",
    desc:"These magical plates serve more than just snacks. They're serving full spellbinding vibes! Ideal for Halloween treats and bewitched bites.",
    bullets:["Set of 8","Dimensions: 9\"l x 6\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.68",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/59129f20-a452-4dd0-ab96-b991c9e20082/Ebook+Thumbnail+with+Video+-+2025-07-10T170217.337.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/14ac579c-8bd8-4fc0-bc5b-0cae3c2f8563/Ebook+Thumbnail+with+Video+-+2025-07-10T170228.780.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/59129f20-a452-4dd0-ab96-b991c9e20082/Ebook+Thumbnail+with+Video+-+2025-07-10T170217.337.png?format=500w",
    bg:"#1A1A1A", accent:"#CE93D8",
    tags:["black","purple","plum","crystal-purple","sangria","lavender","evergreen","metallic-forest-green","gray-smoke","orange"],
  },
  {
    id:"plate-zebra", type:"plate", name:"Zebra Plates",
    desc:"Wildly fun and fiercely vibrant! This untamed zebra pattern brings bold energy to any party vibe.",
    bullets:["Set of 8","Dimensions: 8\"w x 8\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.50",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/bc8489de-d564-4d08-ba84-81dba3a72845/Ebook+Thumbnail+with+Video+-+2025-07-05T094202.906.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a64adc0b-ff0e-41e0-a8a5-5ab489282916/Ebook+Thumbnail+with+Video+-+2025-07-05T093758.873.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/bc8489de-d564-4d08-ba84-81dba3a72845/Ebook+Thumbnail+with+Video+-+2025-07-05T094202.906.png?format=500w",
    bg:"#F8F8F8", accent:"#1A1A1A",
    tags:["white","black","hotpink","pink","blush","silver","gray-smoke","crystal-clear","sugar"],
  },
  {
    id:"plate-retro-blooms", type:"plate", name:"Retro Blooms Plates",
    desc:"Flower power meets party power! These retro floral decagon plates add a funky, fresh vibe to your table.",
    bullets:["Set of 8","Dimensions: 9\"l x 9\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$15.78",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/06bb4244-9570-4308-b725-d9aa367d440e/Ebook+Thumbnail+with+Video+-+2025-11-06T112025.926.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f65d78d8-1aa0-4545-84d6-1270c96f9c5b/Ebook+Thumbnail+with+Video+-+2025-11-06T112036.020.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/06bb4244-9570-4308-b725-d9aa367d440e/Ebook+Thumbnail+with+Video+-+2025-11-06T112025.926.png?format=500w",
    bg:"#FF9B7A", accent:"#4CAF50",
    tags:["orange","coral","burnt-orange","aloha","yellow","lemonade","green","lime-green","hotpink","taffy","turquoise"],
  },
  {
    id:"plate-heartbeat-gang", type:"plate", name:"Heartbeat Gang Plates",
    desc:"For the girls who bring the glam and the giggles these heartbeat gang plates are the cutest sidekick to your sips and sweets!",
    bullets:["Set of 8","Dimensions: 7.5\"w x 7.5\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.76",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/110895ce-549d-4ade-9670-ebc2756e8939/Ebook+Thumbnail+with+Video+-+2025-11-06T162327.491.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/94287b5f-12bf-42a4-a7f5-f04ac8c6618e/Ebook+Thumbnail+with+Video+-+2025-11-06T162341.407.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/110895ce-549d-4ade-9670-ebc2756e8939/Ebook+Thumbnail+with+Video+-+2025-11-06T162327.491.png?format=500w",
    bg:"#E8112D", accent:"#FFB5C2",
    tags:["red","scarlett","hotpink","blush","baby-pink","coral","pink","white","gold","champagne"],
  },
  {
    id:"plate-lemon-zest", type:"plate", name:"Lemon Zest Plates",
    desc:"Fresh colors, lemony flair, and major summer vibes; perfect party plates that are full of color and charm.",
    bullets:["Set of 8","Size: 8.5\" diameter","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.25",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69501ea618bbbd208c522116/1768078219828/Ebook+Thumbnail+with+Video-379.png?format=1500w",
    bg:"#FFEA5A", accent:"#4CAF50",
    tags:["yellow","lemonade","goldenrod","mustard","lime-green","green","meadow","white","sugar","crystal-yellow"],
  },
  {
    id:"plate-girl-power", type:"plate", name:"Girl Power Plates",
    bullets:["Set of 8","Dimensions: 7.5\"l x 7.5\"w"],
    price:"$12.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68487d911ef4b52dec0565fb/1767901315872/Ebook+Thumbnail+with+Video+-+2025-05-18T120725.978.png?format=1500w",
    bg:"#F4A7B9", accent:"#C0C0C0",
    tags:["blush","hotpink","baby-pink","pink","lavender","white","silver","champagne","gold","sugar","peri","blossom"],
  },
  {
    id:"plate-vinyl-disco", type:"plate", name:"Vinyl Disco Plates",
    desc:"Spin into the party! These vinyl record-inspired plates bring retro disco energy to any bachelorette bash.",
    bullets:["Set of 8","Dimensions: 9\"l x 9\"w"],
    price:"$11.22",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/9696d8c6-3996-422f-9838-c7f8493eaaa9/Ebook+Thumbnail+with+Video-123.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/175194c1-bb42-4e0b-82c2-2bde35b37647/Ebook+Thumbnail+with+Video-122.png",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/9696d8c6-3996-422f-9838-c7f8493eaaa9/Ebook+Thumbnail+with+Video-123.png",
    bg:"#1A1A1A", accent:"#C0C0C0",
    tags:["black","silver","gray-smoke","fog","metallic-blue","navy","purple","plum","hotpink","metallic-fuchsia","metallic-midnight-blue"],
  },
  {
    id:"plate-yolks", type:"plate", name:"Yolks on You Plates",
    desc:"8 ct · 9\" x 9\"", price:"$12.50",
    bullets:["Set of 8","Dimensions: 9\"w x 9\"l"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8a0e60d7-79ad-44d6-ba7e-7203b1ffea28/Ebook+Thumbnail+with+Video+-+2025-05-11T155238.849.png",
    bg:"#FFE800", accent:"#FF6B1A",
    tags:["yellow","lemonade","goldenrod","mustard","orange","aloha","cheeky","white","sugar","champagne"],
  },
  {
    id:"plate-monsters-eye", type:"plate", name:"Monsters Eye Plates",
    desc:"8 ct · 7.5\" x 7.5\"", price:"$15.23",
    bullets:["Set of 8","Dimensions: 7.5\"w x 7.5\"l"],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68ba53d90ddc3c70e0e57097/1767901398270/Ebook+Thumbnail+with+Video+-+2025-09-04T221241.884.png?format=1500w",
    bg:"#4CAF50", accent:"#E91E8C",
    tags:["green","lime-green","evergreen","metallic-green","black","purple","plum","orange","burnt-orange","gray-smoke"],
  },
  {
    id:"plate-sweet-spots", type:"plate", name:"Sweet Spots Plates",
    bullets:["Set of 8","Dimensions: 7\"l x 7\"w"],
    price:"$12.66",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68ba43aa91ca2a75c5a96789/1767901430686/Ebook+Thumbnail+with+Video+-+2025-07-10T190101.641.png?format=1500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    tags:["blush","hotpink","pink","baby-pink","white","sugar","champagne","gold","lavender","mauve"],
  },
  {
    id:"plate-olive", type:"plate", name:"Olive Plates",
    desc:"A martini-worthy spread! These olive paper plates bring a playful, sophisticated touch to your cocktail-themed bachelorette party.",
    related:["napkin-dirty"],
    bullets:["Set of 8","Dimensions: 6.75\"l x 8\"w"],
    price:"$12.50",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ff9c3a63-a31e-4200-b47c-e7c56bdad7c0/Ebook+Thumbnail+with+Video+-+2025-07-06T205033.943.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c91ba942-5696-40d0-bf54-f7aef3f87d84/Ebook+Thumbnail+with+Video+-+2025-07-06T205046.203.png",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ff9c3a63-a31e-4200-b47c-e7c56bdad7c0/Ebook+Thumbnail+with+Video+-+2025-07-06T205033.943.png",
    bg:"#76A96C", accent:"#C8A882",
    tags:["green","meadow","sage","willow","evergreen","empower-mint","fiona","olive","terracotta","muse","lace","champagne"],
  },
  {
    id:"plate-witchy-hat", type:"plate", name:"Witchy Hat Plates",
    desc:"8 ct · 12.5\" x 11.5\"", price:"$15.54",
    bullets:["Set of 8","Dimensions: 12.5\"w x 11.5\"l"],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b8e3ddd0ce84605cb7f6e8/1767899967128/Ebook+Thumbnail+with+Video+-+2025-08-27T224152.162.png?format=1500w",
    bg:"#1A1A1A", accent:"#9C27B0",
    tags:["black","purple","plum","crystal-purple","sangria","orange","burnt-orange","evergreen","gray-smoke","metallic-midnight-blue"],
  },
  {
    id:"plate-frills-thrills", type:"plate", name:"Frills & Thrills Plates",
    desc:"8 ct · 8.25\" x 8.25\"", price:"$16.00",
    bullets:["Set of 8","Dimensions: 8.25\"w x 8.25\"l"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/af1aa9ef-9a7d-4292-8ef6-475591340b6f/Ebook+Thumbnail+with+Video+-+2025-09-02T173858.536.png",
    bg:"#FFB5C2", accent:"#E91E8C",
    tags:["hotpink","blush","baby-pink","pink","cameo","coral","taffy","lavender","white","sugar","gold","champagne"],
  },
  {
    id:"plate-camp-bach", type:"plate", name:"Camp Bachelorette Plates",
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w"],
    price:"$12.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68acdc1610a90473ab295ae8/1767899924417/Ebook+Thumbnail+with+Video+-+2025-11-06T123554.536.png?format=1500w",
    bg:"#76A96C", accent:"#C4956A",
    tags:["green","sage","evergreen","meadow","willow","empower-mint","terracotta","burnt-orange","muse","stone","lace","champagne"],
  },
  {
    id:"plate-rock-on-skeleton", type:"plate", name:"Rock On Skeleton Plates",
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w"],
    price:"$12.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/690cf49b03d8727c4c7c0abc/1767899702325/Ebook+Thumbnail+with+Video+-+2025-11-07T112344.695.png?format=1500w",
    bg:"#1A1A1A", accent:"#E91E8C",
    tags:["black","gray-smoke","hotpink","red","scarlett","purple","plum","metallic-starfire-red","white","silver"],
  },
  {
    id:"plate-sugar-skull", type:"plate", name:"Sugar Skull Plates",
    desc:"8 ct · 10\" x 7.25\"", price:"$12.66",
    bullets:["Set of 8","Dimensions: 10\"w x 7.25\"l"],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b9d7f2bb187f4ec7c279e0/1767899670354/Ebook+Thumbnail+with+Video+-+2025-07-20T134000.393.png?format=1500w",
    bg:"#CE93D8", accent:"#E91E8C",
    tags:["purple","lavender","plum","crystal-purple","hotpink","coral","orange","yellow","lemonade","teal","turquoise","black","white"],
  },
  {
    id:"plate-penis", type:"plate", name:"Penis Plates",
    desc:"Say it loud, say it proud: SAME PENIS FOREVER! Celebrate the end of your single life in the most playful way with our penis shaped foil paper plates!",
    price:"$13.03",
    bullets:["Set of 25","Size: 5\"w x 7\"l","Durable, lightweight, and disposable for easy cleanup"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684a1080b91f060aa52262f5/1767899624325/Ebook+Thumbnail+with+Video+-+2025-02-16T113626.828.png?format=1500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    tags:["hotpink","blush","pink","baby-pink","coral","taffy","pixie","metallic-fuchsia","white","gold","champagne"],
  },
  {
    id:"plate-summer-bow", type:"plate", name:"Summer Bow Plates",
    bullets:["Set of 8","Dimensions: 9\"l x 9\"w"],
    price:"$13.21",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/2ffa8158-a306-49d8-a764-06fb1a2a998d/Ebook+Thumbnail+with+Video+-+2025-06-06T130811.387.png",
    bg:"#FFB5C2", accent:"#FFD700",
    tags:["hotpink","blush","baby-pink","pink","cameo","coral","gold","champagne","white","sugar","lemonade","yellow"],
  },
  {
    id:"plate-rainbow", type:"plate", name:"Rainbow Plates",
    desc:"8 ct · 9\" x 6\"", price:"$12.50",
    bullets:["Set of 8","Dimensions: 9\"w x 6\"l"],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684881ae36c31823d93e6e25/1767899537951/Ebook+Thumbnail+with+Video+-+2025-05-08T105007.289.png?format=1500w",
    bg:"#FFE800", accent:"#E91E8C",
    tags:["confetti","hotpink","red","orange","yellow","lemonade","green","blue","lavender","turquoise","coral","lime-green"],
  },
  {
    id:"plate-queen-of-hearts", type:"plate", name:"Queen of Hearts Plates",
    desc:"8 ct · 8\" x 10\"", price:"$14.50",
    bullets:["Set of 8","Dimensions: 8\"w x 10\"l"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/01f64bcb-5201-49c6-a7f7-14919103f9f3/Ebook+Thumbnail+with+Video+-+2025-06-08T010753.060.png",
    bg:"#E8112D", accent:"#FFD700",
    tags:["red","scarlett","samba","hotpink","crystal-red","gold","metallic-gold","black","white","sangria","crystal-burgundy"],
  },
  {
    id:"plate-ephemera-skeleton", type:"plate", name:"Ephemera Skeleton Plates",
    bullets:["Set of 8","Dimensions: 5.5\"l x 9\"w"],
    price:"$12.10",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6793bc8c6c9a8e41d1c331e4/1767899122995/Ebook+Thumbnail+with+Video+-+2025-01-26T154613.995.png?format=1500w",
    bg:"#1A1A1A", accent:"#CE93D8",
    tags:["black","purple","plum","crystal-purple","sangria","lavender","gray-smoke","white","fog","evergreen"],
  },
  {
    id:"plate-ditzy-floral", type:"plate", name:"Ditzy Floral Plates",
    bullets:["Set of 8","Dimensions: 9\"l x 9\"w"],
    price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/74f640a7-59c7-46f9-ab43-03a6cb3c7dc1/Ebook+Thumbnail+with+Video+-+2025-01-30T095126.115.png",
    bg:"#F4A7B9", accent:"#76A96C",
    tags:["blush","hotpink","pink","baby-pink","coral","lavender","meadow","green","sage","willow","empower-mint","fiona","white","sugar"],
  },
  {
    id:"plate-red-bow", type:"plate", name:"Red Bow Plates",
    desc:"8 ct · 9\" x 9\"", price:"$12.50",
    bullets:["Set of 8","Dimensions: 9\"w x 9\"l"],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6793bc23268ad1226ad3646a/1767899095891/Ebook+Thumbnail+with+Video+-+2025-01-25T135854.526.png?format=1500w",
    bg:"#E8112D", accent:"#FFD700",
    tags:["red","scarlett","samba","crystal-red","gold","metallic-gold","champagne","white","black","sangria"],
  },
  {
    id:"plate-let-love-bloom", type:"plate", name:"Let Love Bloom Plates",
    bullets:["Set of 8","Dimensions: 9\"l x 9\"w"],
    price:"$11.48",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6793bc689ae1111daaf83736/1767899074707/Ebook+Thumbnail+with+Video+-+2025-01-25T183851.969.png?format=1500w",
    bg:"#F4A7B9", accent:"#76A96C",
    tags:["blush","hotpink","pink","baby-pink","coral","lavender","meadow","green","sage","willow","empower-mint","yellow","lemonade"],
  },
  {
    id:"plate-floral-skull", type:"plate", name:"Floral Skull Spider Plates",
    bullets:["Set of 8","Dimensions: 8.25\" diameter"],
    price:"$10.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6849a132b7ad9e539ec661a9/1767898996372/Ebook+Thumbnail+with+Video+-+2025-05-18T121452.243.png?format=1500w",
    bg:"#1A1A1A", accent:"#CE93D8",
    tags:["black","purple","plum","crystal-purple","sangria","lavender","blossom","evergreen","metallic-forest-green","gray-smoke","white","sugar"],
  },
  {
    id:"plate-bow-birthday", type:"plate", name:"Bow Happy Birthday Plates",
    desc:"6 ct · 10.55\" x 8\"", price:"$8.63",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6849ae30b7ad9e539ec66f87/1767898965825/Ebook+Thumbnail+with+Video+-+2025-05-18T120712.700.png?format=1500w",
    bg:"#FFB5C2", accent:"#E91E8C",
    tags:["hotpink","blush","baby-pink","pink","cameo","white","sugar","lavender","gold","champagne"],
  },
  {
    id:"plate-bon-appetit", type:"plate", name:"Bon Appetit Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.00",
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w"],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68abcdaa27630e0353af3e1b/1767898930623/Ebook+Thumbnail+with+Video+-+2025-11-07T113409.047.png?format=1500w",
    bg:"#A8D8D8", accent:"#C8A882",
    tags:["seafoam","teal","sea-glass","turquoise","mint","monet","baby-blue","lace","muse","stone","champagne","white"],
  },
  {
    id:"plate-happy-disco", type:"plate", name:"Happy Disco Plates",
    desc:"8 ct · 7\" x 7\"", price:"$12.22",
    bullets:["Set of 8","Dimensions: 7\"w x 7\"l"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/208a4d42-7cec-40fa-bbe0-b5d3c72fc61a/Ebook+Thumbnail+with+Video+-+2025-05-18T191748.541.png",
    bg:"#E91E8C", accent:"#FF6B1A",
    tags:["hotpink","orange","coral","taffy","aloha","cheeky","pixie","metallic-fuchsia","yellow","lemonade","burnt-orange"],
  },
  {
    id:"plate-checkered-heart", type:"plate", name:"Checkered Heart Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.50",
    bullets:["Set of 8","Dimensions: 10\"l x 10\"w"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/7223d6d3-2f33-46b6-88d5-e48e314796b8/Ebook+Thumbnail+with+Video+-+2025-01-23T140517.309.png",
    bg:"#E91E8C", accent:"#1A1A1A",
    tags:["hotpink","pink","blush","baby-pink","red","scarlett","black","white","crystal-magenta","metallic-fuchsia","pixie"],
  },
  {
    id:"plate-sweet-strawberry", type:"plate", name:"Sweet Strawberry Plates",
    desc:"8 ct · 8.5\" x 8.5\"", price:"$11.00",
    bullets:["Set of 8","Dimensions: 8.5\"w x 8.5\"l"],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684a16ceb91f060aa5226859/1767898822640/Ebook+Thumbnail+with+Video+-+2025-05-18T120736.773.png?format=1500w",
    bg:"#E53935", accent:"#4CAF50",
    tags:["red","scarlett","hotpink","blush","coral","taffy","baby-pink","pink","green","lime-green","white","sugar"],
  },
  {
    id:"plate-diamond", type:"plate", name:"Diamond Plates",
    desc:"8 ct · 10.5\" x 10.5\"", price:"$16.23",
    bullets:["Set of 8","Dimensions: 10.5\"l x 10.5\"w"],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b7912a64121927f4c30afe/1767898776985/Ebook+Thumbnail+with+Video+-+2025-08-27T221852.336.png?format=1500w",
    bg:"#1A1A1A", accent:"#CE93D8",
    tags:["black","purple","plum","crystal-purple","sangria","lavender","silver","metallic-silver","gray-smoke","fog","crystal-clear"],
  },
  {
    id:"plate-spooky-icons", type:"plate", name:"Spooky Icons Plates",
    desc:"8 ct · 9\" round", price:"$14.38",
    bullets:["Set of 8","Dimensions: 9\"l x 9\"w"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6dc7c95c-7bf9-41f6-83c2-e9e5fdea2512/Ebook+Thumbnail+with+Video+-+2025-05-18T121452.243.png",
    bg:"#1A1A1A", accent:"#9C27B0",
    tags:["black","purple","plum","crystal-purple","sangria","evergreen","metallic-forest-green","orange","burnt-orange","gray-smoke"],
  },
  {
    id:"plate-spicy-bottle", type:"plate", name:"Spicy Bottle Canape Plates",
    desc:"8 ct · 2.5\" x 5.5\"", price:"$10.22",
    bullets:["Set of 8","Dimensions: 2.5\"w x 5.5\"l"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8d160dad-74b6-4c50-aca5-29795e36f6cc/Ebook+Thumbnail+with+Video+-+2025-05-11T155124.164.png",
    bg:"#E8112D", accent:"#FF6B1A",
    tags:["red","scarlett","samba","crystal-red","orange","burnt-orange","taffy","coral","hotpink","black"],
  },
  {
    id:"plate-shimmer-cake", type:"plate", name:"Shimmer Birthday Cake Plates",
    desc:"8 ct · 7.5\" x 9.5\"", price:"$14.36",
    bullets:["Set of 8","Dimensions: 7.5\"l x 9.5\"w"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/93a7a212-3592-410e-87c8-db8286b3d9f8/Ebook+Thumbnail+with+Video+-+2025-05-12T192943.480.png",
    bg:"#F5DEB3", accent:"#FFD700",
    tags:["champagne","gold","metallic-gold","silver","white","sugar","lace","blush","baby-pink","lavender","crystal-clear"],
  },
  {
    id:"plate-swan", type:"plate", name:"Swan Plates",
    desc:"Create a graceful and refined party setting with our swan paper plates, featuring shimmering gold foil details and a beautiful silhouette.",
    price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6709dc75a2dcc752c42d290e/1767898667035/Ebook+Thumbnail+with+Video+-+2025-05-11T155407.049.png?format=1500w",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6709dc75a2dcc752c42d290e/1767898667035/Ebook+Thumbnail+with+Video+-+2025-05-11T155407.049.png?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0526d9e2-c467-4fee-9c29-43219d45b557/Copy+of+Untitled+Design+-+2025-02-09T145327.990.png?format=1500w",
    ],
    bullets:["Set of 8","Dimensions: 11.5\"l x 7.5\"w","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#F8F8F8", accent:"#FFD700",
    tags:["white","sugar","champagne","gold","metallic-gold","silver","lace","blush","baby-pink","monet"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/swan-plates",
  },
  {
    id:"plate-denim-star", type:"plate", name:"Denim Star Stripes Plates",
    desc:"8 ct · 9\" x 9\"", price:"$12.50",
    bullets:["Set of 8","Dimensions: 9\"w x 9\"l"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3a6dc5b4-319a-4b72-b42f-74c2fb494cc6/Ebook+Thumbnail+with+Video+-+2025-05-09T083705.780.png",
    bg:"#1A3A6B", accent:"#E8112D",
    tags:["navy","naval","blue","royalty","metallic-blue","red","scarlett","white","crystal-sapphire","blue-slate"],
  },
  {
    id:"plate-hello-kitty", type:"plate", name:"Hello Kitty Plates",
    desc:"Bring some cute chaos to your bachelorette party with these fun and flirty hello kitty paper plates! Ideal for cocktails, snacks, or sweet treats.",
    price:"$12.58",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684ae85e64f4dd59c05b2093/1767898689607/Ebook+Thumbnail+with+Video+-+2025-05-18T191011.864.png?format=1500w",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684ae85e64f4dd59c05b2093/1767898689607/Ebook+Thumbnail+with+Video+-+2025-05-18T191011.864.png?format=1500w",
    ],
    bullets:["Set of 8","Dimensions: 8\"w x 8\"l","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#FFB5C2", accent:"#E91E8C",
    tags:["hotpink","blush","baby-pink","pink","cameo","white","sugar","red","scarlett","lavender"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/hello-kitty-plates",
  },
  {
    id:"plate-wildflowers", type:"plate", name:"Wildflowers Plates",
    desc:"Let the wild times bloom! These wildflower paper plates are perfect for bachelorette parties, bridal showers, and sunny spring picnics.",
    price:"$14.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6849a8b1b7ad9e539ec6699e/1767898737677/Ebook+Thumbnail+with+Video+-+2025-05-18T120815.577.png?format=1500w",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6849a8b1b7ad9e539ec6699e/1767898737677/Ebook+Thumbnail+with+Video+-+2025-05-18T120815.577.png?format=1500w",
    ],
    bullets:["Set of 8","Dimensions: 9\"w x 9.25\"l","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#76A96C", accent:"#F87171",
    tags:["meadow","green","sage","willow","empower-mint","fiona","coral","blush","baby-pink","lemonade","yellow","lavender"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/wildflowers-plates",
  },
  {
    id:"plate-hot-wheels", type:"plate", name:"Hot Wheels Checker Plates",
    desc:"Start your engines! These hot wheels checker plates bring fast fun with bright colors, bold patterns, and serious party power.",
    price:"$10.12",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69601037c85bb24f5c846130/1767917635112/Ebook+Thumbnail+with+Video-407.png?format=1500w",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69601037c85bb24f5c846130/1767917635112/Ebook+Thumbnail+with+Video-407.png?format=1500w",
    ],
    bullets:["Set of 8","Dimensions: 10\"d (cake size)","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#E8112D", accent:"#1A1A1A",
    tags:["red","scarlett","samba","crystal-red","orange","burnt-orange","black","yellow","lemonade"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/hot-wheels-checker-plates",
  },
  {
    id:"plate-bananas", type:"plate", name:"Bananas For You Plates",
    desc:"Go bananas, babe! These bold party plates bring fruity fun to any girls' night, bachelorette bash, or tropical themed soirée.",
    price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3341fb76-b418-4897-b3dd-a0c51d6a8f28/Ebook+Thumbnail+with+Video-401.png?format=500w",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3341fb76-b418-4897-b3dd-a0c51d6a8f28/Ebook+Thumbnail+with+Video-401.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5c149ea0-ccb5-4a55-b64a-2d520158d8fc/Ebook+Thumbnail+with+Video-402.png?format=500w",
    ],
    bullets:["Set of 8","Dimensions: 10\"w x 10\"l","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#FFE800", accent:"#4CAF50",
    tags:["yellow","lemonade","goldenrod","mustard","lime-green","green","meadow","orange","aloha","cheeky"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/bananas-for-you-plates",
  },
  {
    id:"plate-summer-cake", type:"plate", name:"Summer Cake Plates",
    desc:"Slice up the fun with these adorable cake paper plates made for bachelorette vibes, sunshine, and all day celebration with your favorite girls!",
    price:"$14.04",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684999f51ef4b52dec0631cd/1767898324611/Ebook+Thumbnail+with+Video+-+2025-06-13T132740.712.png?format=1500w",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684999f51ef4b52dec0631cd/1767898324611/Ebook+Thumbnail+with+Video+-+2025-06-13T132740.712.png?format=1500w",
    ],
    bullets:["Set of 8","Dimensions: 7.5\"w x 11\"l","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#FFEA5A", accent:"#FF6B8A",
    tags:["yellow","lemonade","goldenrod","hotpink","coral","taffy","blush","baby-pink","turquoise","seafoam","mint"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/summer-cake-plates",
  },
  {
    id:"plate-happy-face", type:"plate", name:"Happy Face Plates",
    desc:"Bring all the feel good vibes to your party with our happy face icons paper plates! Smiley faces, rainbows, mushrooms, stars, hearts, and more, these plates deliver major 90s nostalgia.",
    price:"$16.30",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6848ae27cc6de75b44de261f/1767898403813/Ebook+Thumbnail+with+Video+-+2025-05-18T120745.117.png?format=1500w",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6848ae27cc6de75b44de261f/1767898403813/Ebook+Thumbnail+with+Video+-+2025-05-18T120745.117.png?format=1500w",
    ],
    bullets:["Set of 8","Dimensions: 10.5\"w x 10.5\"l","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#FFE800", accent:"#E91E8C",
    tags:["yellow","lemonade","hotpink","pink","coral","mint","turquoise","lavender","rainbow","confetti"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/happy-face-plates",
  },
  {
    id:"plate-silver-disco", type:"plate", name:"Silver Disco Plates",
    desc:"Bring sparkle and shine to your celebration with our silver disco paper plates. These glamorous plates are adorned with silver foil for a dazzling touch.",
    price:"$12.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6793bc8ca165a16c98b66474/1767898308845/Ebook+Thumbnail+with+Video+-+2025-01-27T125554.572.png?format=1500w",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6793bc8ca165a16c98b66474/1767898308845/Ebook+Thumbnail+with+Video+-+2025-01-27T125554.572.png?format=1500w",
    ],
    bullets:["Set of 8","Dimensions: 9\"w x 9\"l","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#D0D0D0", accent:"#9E9E9E",
    tags:["silver","white","crystal-clear","fog","gray-smoke","metallic-blue","navy","naval","metallic-midnight-blue","metallic-green","metallic-fuchsia","metallic-gold"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/silver-disco-plates",
  },
  {
    id:"plate-jaguar", type:"plate", name:"Jaguar Plates",
    desc:"Spotted: the coolest party plates in the jungle! These jaguar paper plates are perfect for wild birthdays and untamed fun.",
    price:"$13.56",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/68488a0f36c31823d93e78a2/Ebook+Thumbnail+with+Video+-+2025-06-07T234024.878.png?format=500w",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/68488a0f36c31823d93e78a2/Ebook+Thumbnail+with+Video+-+2025-06-07T234024.878.png?format=500w",
    ],
    bullets:["Set of 8","Dimensions: 8.75\"l x 7.5\"w","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#C8A882", accent:"#1A1A1A",
    tags:["muse","malted","terracotta","stone","cocoa","lace","champagne","orange","burnt-orange","mustard","black"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/jaguar-plates",
  },
  {
    id:"plate-daisy", type:"plate", name:"Daisy Plates",
    desc:"A touch of spring to your next picnic with these paper plates decorated with bright daisies. Bringing a whimsical and playful touch to any gathering.",
    price:"$12.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684894bb1ef4b52dec058349/1767555917671/Ebook+Thumbnail+with+Video+-+2025-06-07T171246.235.png?format=1500w",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684894bb1ef4b52dec058349/1767555917671/Ebook+Thumbnail+with+Video+-+2025-06-07T171246.235.png?format=1500w",
    ],
    bullets:["Set of 12","Dimensions: 9\"w x 9\"l","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#FFEE00", accent:"#4CAF50",
    tags:["yellow","lemonade","goldenrod","white","green","lime-green","meadow","empower-mint","sugar"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/daisy-plates",
  },
  {
    id:"plate-pastel-stripe", type:"plate", name:"Pastel Stripe Plates",
    desc:"Pastel stripes + gold foil = instant party magic! Perfect for bridal showers, spring bachelorettes, and stylish table setups.",
    price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b3ef3e6e-10ae-42c2-90f1-74697391dae0/Ebook+Thumbnail+with+Video+-+2025-12-29T210340.995.png?format=500w",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b3ef3e6e-10ae-42c2-90f1-74697391dae0/Ebook+Thumbnail+with+Video+-+2025-12-29T210340.995.png?format=500w",
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684b291b0a63794fee8a83fe/1767898248315/Ebook+Thumbnail+with+Video+-+2025-06-18T113037.037.png?format=1500w",
    ],
    bullets:["Set of 8","Dimensions: 9\"l x 9\"w","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#F4A7B9", accent:"#FFD700",
    tags:["blush","lavender","mint","baby-blue","baby-pink","gold","champagne","sugar","lemonade","monet","sea-glass"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/pastel-stripe-plates",
  },
  {
    id:"plate-disco-cherry", type:"plate", name:"Disco Cherry Drink Plates",
    desc:"Let's get groovy! These premium paper plates with a disco cherry drink design add sparkle and sass to any celebration.",
    price:"$12.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684aeb982427cd1f49ac1344/1767473564389/Ebook+Thumbnail+with+Video+-+2025-05-18T120827.502.png?format=1500w",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684aeb982427cd1f49ac1344/1767473564389/Ebook+Thumbnail+with+Video+-+2025-05-18T120827.502.png?format=1500w",
    ],
    bullets:["Set of 8","Dimensions: 9\"w x 9\"l","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#E91E8C", accent:"#9C27B0",
    tags:["hotpink","red","scarlett","crystal-red","purple","plum","crystal-purple","sangria","metallic-fuchsia"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/disco-cherry-drink-plates",
  },
  {
    id:"plate-cactus", type:"plate", name:"Cactus Plates",
    desc:"Bring the party vibes to life with these cactus paper plates designed to add a touch of festive flair to your celebration. Ideal for serving snacks, appetizers, or desserts.",
    price:"$13.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6791a5e79ae1111daaf6920f/1767898212097/Ebook+Thumbnail+with+Video+-+2025-01-22T201457.935.png?format=1500w",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6791a5e79ae1111daaf6920f/1767898212097/Ebook+Thumbnail+with+Video+-+2025-01-22T201457.935.png?format=1500w",
    ],
    bullets:["Set of 8","Dimensions: 8.5\"w x 9\"l","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#4CAF50", accent:"#C4956A",
    tags:["green","lime-green","evergreen","meadow","sage","empower-mint","terracotta","orange","mustard"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/cactus-plates",
  },
  {
    id:"plate-pink-pony-club", type:"plate", name:"Pink Pony Club Plates",
    desc:"Saddle up, party queens! These pink pony club paper plates are the perfect mix of girly and western for your next bachelorette bash, cowgirl birthday, or rodeo-themed celebration.",
    price:"$17.22",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/208a4d42-7cec-40fa-bbe0-b5d3c72fc61a/Ebook+Thumbnail+with+Video+-+2025-05-18T191748.541.png?format=500w",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/208a4d42-7cec-40fa-bbe0-b5d3c72fc61a/Ebook+Thumbnail+with+Video+-+2025-05-18T191748.541.png?format=500w",
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6848a1a41ef4b52dec059186/1767557348516/Ebook+Thumbnail+with+Video+-+2025-05-18T120703.581.png?format=1500w",
    ],
    bullets:["Set of 24","2 designs: 12 of each","Dimensions: 9\"l x 9\"w","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#F4A7B9", accent:"#C4956A",
    tags:["hotpink","blush","pink","baby-pink","cameo","mauve","canyon-rose","terracotta","champagne"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/pink-pony-club-plates",
  },
  {
    id:"plate-foil-star", type:"plate", name:"Foil Star Plates",
    desc:"Shine bright, bride tribe! These silver star plates add glam to your bachelorette bash, perfect for snacks, sweets, and star studded vibes.",
    bullets:["Set of 8","Dimensions: 11\"w x 11\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.50",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3032563d-005e-4659-834e-55f2fe71ad05/Ebook+Thumbnail+with+Video+-+2025-01-22T204555.167.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/275f23cb-8a0e-44d7-9687-35e61d624b86/Ebook+Thumbnail+with+Video+-+2025-01-22T204635.535.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3032563d-005e-4659-834e-55f2fe71ad05/Ebook+Thumbnail+with+Video+-+2025-01-22T204555.167.png?format=500w",
    bg:"#D0D0D0", accent:"#9E9E9E",
    tags:["silver","white","gold","champagne","crystal-clear","fog","gray-smoke","metallic-gold"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/foil-star-plates",
  },
  {
    id:"plate-blue-floral", type:"plate", name:"Blue Floral Plates",
    desc:"Serve up style with these blue floral paper plates for spring parties, bridal showers, or elegant outdoor gatherings! Pretty, practical, and party ready!",
    price:"$13.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67928a2ea165a16c98b562e9/1767557636786/Ebook+Thumbnail+with+Video+-+2025-01-23T122858.717.png?format=1500w",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67928a2ea165a16c98b562e9/1767557636786/Ebook+Thumbnail+with+Video+-+2025-01-23T122858.717.png?format=1500w",
    ],
    bullets:["Set of 12","Dimensions: 10\"w x 10\"l","Durable, disposable plates for easy cleanup"],
    bg:"#B8D8E8", accent:"#0084C1",
    tags:["blue","baby-blue","monet","georgia","blue-slate","seafoam","sea-glass","mint","lavender"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/blue-floral-plates",
  },
  {
    id:"plate-roller-skate", type:"plate", name:"Roller Skate Plates",
    desc:"Let the good times roll! These fabulous roller skate shaped plates, with green raffia laces for a fantastic effect, will look amazing on the party table.",
    price:"$13.90",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/d07abd32-5f07-40a5-8dea-a0c80d1b0fc5/Ebook+Thumbnail+with+Video+-+2025-08-04T203531.863.png?format=500w",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/d07abd32-5f07-40a5-8dea-a0c80d1b0fc5/Ebook+Thumbnail+with+Video+-+2025-08-04T203531.863.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/9f4437a6-cad7-435b-9df9-4fde717e2b41/Ebook+Thumbnail+with+Video+-+2025-08-04T203426.723.png?format=500w",
    ],
    bullets:["Set of 8","Dimensions: 7\"w x 10\"l","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#4CAF50", accent:"#388E3C",
    tags:["green","lime-green","meadow","empower-mint","mint","sage","evergreen"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/roller-skate-plates",
  },
  {
    id:"plate-flaming-heart", type:"plate", name:"Flaming Heart Plates",
    desc:"H-O-T T-O G-O! For those who wear their heart (and a little bit of heartbreak) on their sleeve, it's time to turn up the heat with our flaming heart paper plates.",
    price:"$13.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68486d8cb91f060aa5210568/1767827872670/Ebook+Thumbnail+with+Video+-+2025-06-07T231851.197.png?format=1500w",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68486d8cb91f060aa5210568/1767827872670/Ebook+Thumbnail+with+Video+-+2025-06-07T231851.197.png?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0526d9e2-c467-4fee-9c29-43219d45b557/Copy+of+Untitled+Design+-+2025-02-09T145327.990.png?format=500w",
    ],
    bullets:["Set of 8","Dimensions: 9\"w x 12\"l","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#E53935", accent:"#FF6B1A",
    tags:["red","orange","hotpink","scarlett","samba","coral","taffy"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/flaming-heart-plates",
  },
  {
    id:"plate-fire-checker", type:"plate", name:"Fire Flames Checker Plates",
    desc:"Fuel the party with fast flames checker plates; eye catching flame checkers, a vibrant blue rim, and full throttle style.",
    price:"$10.12",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/cd8ac1a1-9a8b-4129-86d1-d93a0fa17d8e/Ebook+Thumbnail+with+Video-411.png?format=500w",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/cd8ac1a1-9a8b-4129-86d1-d93a0fa17d8e/Ebook+Thumbnail+with+Video-411.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/109b3c7d-2761-494d-9446-08fecc58ef1a/Ebook+Thumbnail+with+Video-412.png?format=500w",
    ],
    bullets:["Set of 8","Dimensions: 10.75\"l x 10.75\"w","Durable, lightweight, and disposable for easy cleanup"],
    bg:"#1A3A6B", accent:"#FF6B1A",
    tags:["blue","orange","red","black","navy"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/fire-flames-checker-plates",
  },
  // ── Napkins ───────────────────────────────────────────────────────────────────
  {
    id:"napkin-black-heart", type:"napkin", name:"Mini Heart Napkins",
    desc:"Love is in the air and it is ready to be served with these sweet little details! Hand drawn with love, subtle, and style.",
    bullets:["Set of 24","Dimensions: 5\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$9.50",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6f3a7554-0330-4c94-88fb-51d1691727ee/Ebook+Thumbnail+with+Video+-+2025-01-30T091042.364.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b0e2ff05-c531-423b-8458-9770371303ca/Ebook+Thumbnail+with+Video+-+2025-01-30T091251.117.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6f3a7554-0330-4c94-88fb-51d1691727ee/Ebook+Thumbnail+with+Video+-+2025-01-30T091042.364.png?format=500w",
    bg:"#1A1A1A", accent:"#E8112D",
    tags:["black","gray-smoke","silver","white","red","scarlett","hotpink","sangria","crystal-burgundy","navy","purple"],
  },
  {
    id:"napkin-dirty", type:"napkin", name:"I Like It Dirty Napkins",
    desc:"Shake things up with these I like it dirty cocktail paper napkins. The ultimate flirty touch for martini lovers, bachelorettes, and bold party vibes!",
    bullets:["Set of 20","Dimensions: 5\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.62",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ed9a65c8-9466-470e-b819-96d76cc9b8e3/Ebook+Thumbnail+with+Video+-+2025-06-07T235757.012.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/66ca5230-678d-4131-bb91-aa8b438396c9/Ebook+Thumbnail+with+Video+-+2025-06-07T235718.215.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ed9a65c8-9466-470e-b819-96d76cc9b8e3/Ebook+Thumbnail+with+Video+-+2025-06-07T235757.012.png?format=500w",
    bg:"#1A1A1A", accent:"#C0C0C0",
    tags:["black","silver","gray-smoke","white","navy","metallic-midnight-blue","fog","crystal-clear","gold","champagne"],
  },
  {
    id:"napkin-kiss-me", type:"napkin", name:"Kiss Me Napkins",
    desc:"Add a kiss of charm to any gathering! These shiny lip shaped napkins are perfect for Valentine's, bachelorettes, or just because you're feeling extra.",
    bullets:["Set of 20","Dimensions: 5\"w x 5\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.94",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/99038bdd-49da-490d-99c2-d34f40d0891c/Ebook+Thumbnail+with+Video+-+2025-11-06T093347.207.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ed113391-ea23-4a6e-a4ca-8c5b70b160e8/Ebook+Thumbnail+with+Video+-+2025-11-06T093356.207.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/99038bdd-49da-490d-99c2-d34f40d0891c/Ebook+Thumbnail+with+Video+-+2025-11-06T093347.207.png?format=500w",
    bg:"#E8112D", accent:"#FFB5C2",
    tags:["red","scarlett","hotpink","blush","baby-pink","pink","coral","taffy","sangria","crystal-burgundy","white","sugar"],
  },
  {
    id:"napkin-love-heart", type:"napkin", name:"Love Heart Napkins",
    desc:"Fall in love with these heart shaped napkins. Perfect for galentine's day or any sweet celebration!",
    bullets:["Set of 24","Dimensions: 5\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$9.99",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b490a606-eabd-42b0-a060-82f466e42a80/Ebook+Thumbnail+with+Video+-+2025-12-29T205724.491.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6030c0d0-e112-432d-b8c0-660a02791d34/Ebook+Thumbnail+with+Video+-+2025-12-29T205909.926.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b490a606-eabd-42b0-a060-82f466e42a80/Ebook+Thumbnail+with+Video+-+2025-12-29T205724.491.png?format=500w",
    bg:"#E8112D", accent:"#FFB5C2",
    tags:["red","scarlett","hotpink","blush","baby-pink","pink","coral","taffy","white","sugar","champagne","lavender","black","gray-smoke","lace","muse","stone","fog","crystal-clear"],
  },
  {
    id:"napkin-wavy", type:"napkin", name:"Wavy Napkins",
    desc:"For covens that love cocktails. These sun kissed napkins are all glam, no gloom.",
    bullets:["Set of 16","Dimensions: 8\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/31ec6293-c535-47fe-a923-49fa134b18ed/Ebook+Thumbnail+with+Video+-+2025-12-29T205103.659.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b46051ab-e065-4804-a09c-d420257b9f64/Ebook+Thumbnail+with+Video+-+2025-12-29T205350.917.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/31ec6293-c535-47fe-a923-49fa134b18ed/Ebook+Thumbnail+with+Video+-+2025-12-29T205103.659.png?format=500w",
    bg:"#29B6F6", accent:"#FFD700",
    tags:["blue","baby-blue","turquoise","teal","seafoam","sea-glass","yellow","lemonade","orange","coral","burnt-orange","aloha","green","lime-green","meadow","empower-mint","white","champagne"],
  },
  {
    id:"napkin-yes-girl", type:"napkin", name:"Yes Girl Napkins",
    desc:"Channel your inner diva with these YES, GIRL napkins! Perfect for a girls' night out, bachelorette bash, or any celebration where sass is the dress code.",
    bullets:["Set of 20","Dimensions: 6\"l x 6\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/9e2ee9ff-b4e4-4916-94d8-69e5dfa3852f/Ebook+Thumbnail+with+Video-53.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/4ac72197-bae1-4baf-986f-bafd493b2784/Ebook+Thumbnail+with+Video-54.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/9e2ee9ff-b4e4-4916-94d8-69e5dfa3852f/Ebook+Thumbnail+with+Video-53.png?format=500w",
    bg:"#E91E8C", accent:"#FFD700",
    tags:["hotpink","blush","baby-pink","pink","gold","champagne","white","lavender","confetti","metallic-fuchsia"],
  },
  {
    id:"napkin-necktie", type:"napkin", name:"Necktie Napkins",
    desc:"Get fancy without the fuss! Our necktie napkins add a playful twist to your party table, keeping outfits clean and cocktails classy.",
    bullets:["Set of 18","Dimensions: 7.75\"l x 3.75\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$13.82",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/33e274bd-63f3-4e2f-9b11-574c5b7e410c/Ebook+Thumbnail+with+Video+-+2025-07-10T203419.976.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/af67480b-f404-4c37-a89d-c99ebb8dcde5/Ebook+Thumbnail+with+Video+-+2025-07-10T203533.069.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/33e274bd-63f3-4e2f-9b11-574c5b7e410c/Ebook+Thumbnail+with+Video+-+2025-07-10T203419.976.png?format=500w",
    bg:"#1A1A1A", accent:"#E91E8C",
    tags:["black","navy","naval","metallic-midnight-blue","white","silver","gray-smoke","hotpink","red","scarlett","gold"],
  },
  {
    id:"napkin-stay-fierce", type:"napkin", name:"Stay Fierce Napkins",
    desc:"Keep it loud and proud with these fierce cheetah napkins. Embossed foil detailing makes these napkins fun and unique, and who doesn't love a pink cheetah?",
    bullets:["Set of 16","Dimensions: 6\"w x 7.75\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$8.36",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/4d7ac248-efe7-47e9-a407-7ecf894e7b96/Ebook+Thumbnail+with+Video+-+2026-01-06T164649.173.png?format=500w",
    bg:"#E91E8C", accent:"#FFD700",
    tags:["hotpink","blush","pink","baby-pink","gold","metallic-gold","champagne","orange","burnt-orange","terracotta","muse","malted"],
  },
  {
    id:"napkin-tying-knot", type:"napkin", name:"Tying The Knot Napkins",
    desc:"With lace accents and a sweet blue bow, these napkins are made for clinking glasses and toasting your bride to be in style!",
    bullets:["Set of 20","Dimensions: 5\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.22",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/29be21e2-c2ed-45a6-bd7b-20ab6f5082b0/Ebook+Thumbnail+with+Video+-+2025-11-06T084457.159.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/fd476d27-2226-48c5-879c-17ad391f4db0/Ebook+Thumbnail+with+Video+-+2025-11-06T084508.297.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/29be21e2-c2ed-45a6-bd7b-20ab6f5082b0/Ebook+Thumbnail+with+Video+-+2025-11-06T084457.159.png?format=500w",
    bg:"#F8F8F8", accent:"#B8D8E8",
    tags:["white","sugar","crystal-clear","lace","baby-blue","monet","silver","champagne","blush","lavender","fog"],
  },
  {
    id:"napkin-ring-box", type:"napkin", name:"Ring Box Napkins",
    desc:"Get ready to pop the bubbly and wipe the spills. These engagement ring napkins are a flirty touch for your bachelorette bash!",
    bullets:["Set of 16","Dimensions: 5\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.50",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c864ad4a-a1d0-403b-b60a-ce179d8894e8/Ebook+Thumbnail+with+Video+-+2025-05-18T171533.911.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/4ddaf097-78c5-4fec-ae20-9a8e4d6f24e3/Ebook+Thumbnail+with+Video+-+2025-05-18T171328.741.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c864ad4a-a1d0-403b-b60a-ce179d8894e8/Ebook+Thumbnail+with+Video+-+2025-05-18T171533.911.png?format=500w",
    bg:"#F8F8F8", accent:"#FFD700",
    tags:["white","sugar","crystal-clear","silver","gold","metallic-gold","champagne","blush","baby-pink","lace"],
  },
  {
    id:"napkin-chill-pill", type:"napkin", name:"Chill Pill Napkins",
    desc:"Bachelorette chaos? No worries! Take a chill pill and wipe those cocktail spills with style and sass.",
    bullets:["Set of 16","Dimensions: 8\"l x 4.25\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$14.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/73e1e052-e772-4259-a1e9-df13495ae13f/Ebook+Thumbnail+with+Video+-+2025-07-10T205820.627.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f836278d-021a-4e0c-905f-4058bf5c15fa/Ebook+Thumbnail+with+Video+-+2025-07-10T205831.012.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/73e1e052-e772-4259-a1e9-df13495ae13f/Ebook+Thumbnail+with+Video+-+2025-07-10T205820.627.png?format=500w",
    bg:"#B8D8E8", accent:"#C0C0C0",
    tags:["blue","baby-blue","monet","georgia","blue-slate","royalty","navy","crystal-sapphire","white","sugar","crystal-clear","silver","fog","gray-smoke"],
  },
  {
    id:"napkin-drink-up", type:"napkin", name:"Drink Up Bitches Napkins",
    desc:"Keep it classy-ish with napkins that say what everyone's thinking. From champagne pops to shots o'clock, these are a must-have for your bach party setup!",
    bullets:["Set of 20","Dimensions: 5\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$14.50",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/76f2640a-d5ef-4fcb-813b-cd6477020fb4/Ebook+Thumbnail+with+Video+-+2025-11-04T185532.784.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b59dfcde-eb73-4e68-a331-6539b954d251/Ebook+Thumbnail+with+Video+-+2025-11-04T185541.974.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/76f2640a-d5ef-4fcb-813b-cd6477020fb4/Ebook+Thumbnail+with+Video+-+2025-11-04T185532.784.png?format=500w",
    bg:"#9C27B0", accent:"#E91E8C",
    tags:["purple","plum","crystal-purple","lavender","blossom","peri","hotpink","blush","baby-pink","pink","white","sugar","crystal-clear"],
  },
  {
    id:"napkin-sun-cabana", type:"napkin", name:"Sun Kissed Cabana Napkins",
    desc:"For covens that love cocktails. These sunkissed napkins are all glam, no gloom.",
    bullets:["Set of 20","Dimensions: 7.75\"l x 4.25\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/44bf9473-afbf-4dec-8825-19a50482e3b3/Ebook+Thumbnail+with+Video+-+2025-08-27T223748.256.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/57c5e6aa-2aeb-4db7-9417-b418686c8640/Ebook+Thumbnail+with+Video+-+2025-08-27T223629.802.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/44bf9473-afbf-4dec-8825-19a50482e3b3/Ebook+Thumbnail+with+Video+-+2025-08-27T223748.256.png?format=500w",
    bg:"#9C27B0", accent:"#FF6B1A",
    tags:["purple","plum","lavender","blossom","orange","burnt-orange","aloha","coral","gold","champagne","white"],
  },
  {
    id:"napkin-orchid", type:"napkin", name:"Orchid Napkins",
    desc:"Bring a burst of tropical beauty to your table with these orchid napkins! Their rich teal, cerise, and gold tones make every place setting feel like a paradise.",
    bullets:["Set of 16","Dimensions: 6\"l x 6\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$14.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5a89a712-d29c-4a76-83cc-30f205e1f8ac/Ebook+Thumbnail+with+Video+-+2025-11-05T171549.970.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/cc6a30a9-ed22-4fca-b9d2-b7bdf25d3919/Ebook+Thumbnail+with+Video+-+2025-11-05T171558.388.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5a89a712-d29c-4a76-83cc-30f205e1f8ac/Ebook+Thumbnail+with+Video+-+2025-11-05T171549.970.png?format=500w",
    bg:"#00A591", accent:"#FFD700",
    tags:["teal","turquoise","seafoam","metallic-teal","hotpink","crystal-magenta","metallic-fuchsia","gold","metallic-gold","champagne","sea-glass"],
  },
  {
    id:"napkin-pies-guys", type:"napkin", name:"Pies Before Guys Napkins",
    desc:"Who needs a guy when you've got pie? These pies before guys napkins are the perfect way to add some dessert loving sass to your next party or girls' night.",
    bullets:["Set of 20","Dimensions: 7\"l x 7\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c088153e-18fb-48e1-abae-5d393ac8b8aa/Ebook+Thumbnail+with+Video+-+2025-11-05T170905.079.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/e2ff6caa-b81e-4421-8f00-e241a49ad36e/Ebook+Thumbnail+with+Video+-+2025-11-05T170913.774.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c088153e-18fb-48e1-abae-5d393ac8b8aa/Ebook+Thumbnail+with+Video+-+2025-11-05T170905.079.png?format=500w",
    bg:"#FFE800", accent:"#E91E8C",
    tags:["yellow","lemonade","goldenrod","mustard","crystal-yellow","hotpink","blush","baby-pink","pink","coral","white","sugar","champagne"],
  },
  {
    id:"napkin-witch-hat-broom", type:"napkin", name:"Witch Hat & Broom Napkins",
    desc:"Add some sass to your spooky bash with these witchy napkins. Hats, brooms, and all the fun!",
    bullets:["Set of 20","Dimensions: 6.5\"l x 6.5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$14.36",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/028e46b2-e4a4-4c4e-a2c8-683260228cd2/Ebook+Thumbnail+with+Video+-+2025-09-02T172501.986.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1b1dba41-eb45-4de5-9305-a1afdc3504c5/Ebook+Thumbnail+with+Video+-+2025-09-02T172711.645.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/028e46b2-e4a4-4c4e-a2c8-683260228cd2/Ebook+Thumbnail+with+Video+-+2025-09-02T172501.986.png?format=500w",
    bg:"#1A1A1A", accent:"#9C27B0",
    tags:["black","purple","plum","crystal-purple","orange","burnt-orange","evergreen","metallic-forest-green","sangria","gray-smoke"],
  },
  {
    id:"napkin-ticket", type:"napkin", name:"Ticket Napkins",
    desc:"Your all access pass to nonstop fun. Grab a ticket napkin and let the show begin!",
    bullets:["Set of 24","Dimensions: 7.75\"l x 4.25\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$13.90",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8f01a368-4027-41da-a0e0-a25476e8d587/Ebook+Thumbnail+with+Video+-+2025-07-10T194502.948.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/920f0dd5-14b1-4ce5-888b-dcd2db02976d/Ebook+Thumbnail+with+Video+-+2025-07-10T203755.186.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8f01a368-4027-41da-a0e0-a25476e8d587/Ebook+Thumbnail+with+Video+-+2025-07-10T194502.948.png?format=500w",
    bg:"#E8112D", accent:"#FFD700",
    tags:["red","scarlett","gold","metallic-gold","black","white","champagne","silver","navy","hotpink"],
  },
  {
    id:"napkin-taco-party", type:"napkin", name:"Taco Party Napkins",
    desc:"Let's taco 'bout the perfect party napkins! These cheeky napkins are a must have for bachelorette parties, girls' night, or any fiesta fun.",
    bullets:["Set of 25","Dimensions: 7\"l x 4.5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.33",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/92b46073-9cab-4ec0-9645-8b75c5f1d93b/Ebook+Thumbnail+with+Video+-+2025-07-10T203346.148.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/296d8ef0-d1a2-4800-973a-2e7e94c90c0b/Ebook+Thumbnail+with+Video+-+2025-07-10T203409.387.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/92b46073-9cab-4ec0-9645-8b75c5f1d93b/Ebook+Thumbnail+with+Video+-+2025-07-10T203346.148.png?format=500w",
    bg:"#FF6B1A", accent:"#4CAF50",
    tags:["orange","burnt-orange","aloha","coral","lime-green","green","yellow","lemonade","red","scarlett","terracotta","mustard"],
  },
  {
    id:"napkin-pinky-minty", type:"napkin", name:"Pinky Minty Napkins",
    desc:"Sweet meets fresh! These pink and mint guest napkins add a pop of playful charm and breezy color. Perfect for parties that feel happy, light, and a little extra fun.",
    bullets:["Set of 16 (2 designs, 8 of each)","Dimensions: 8\"l x 4.25\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6790153b-9fb3-4c0e-a32a-924e1443ecc9/Ebook+Thumbnail+with+Video+-+2026-01-06T163614.057.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3e31cf37-20c5-4a36-bbdf-3f47e24891bf/Ebook+Thumbnail+with+Video+-+2026-01-06T162728.582.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/942f8805-3b17-4678-ad36-ae373d9a89ba/Ebook+Thumbnail+with+Video+-+2026-01-06T162510.211.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/06f1e8db-950e-47f3-829d-53acd137f001/Ebook+Thumbnail+with+Video+-+2026-01-06T162428.762.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6790153b-9fb3-4c0e-a32a-924e1443ecc9/Ebook+Thumbnail+with+Video+-+2026-01-06T163614.057.png?format=500w",
    bg:"#80CBC4", accent:"#E91E8C",
    tags:["mint","seafoam","empower-mint","teal","turquoise","hotpink","blush","baby-pink","pink","sea-glass","white","sugar"],
  },
  {
    id:"napkin-love-bunches", type:"napkin", name:"Love You Bunches Napkins",
    desc:"Go bananas for love! These bright yellow napkins with a sweet 'Love You Bunches' message are the perfect way to show your a-peel for any special day.",
    bullets:["Set of 16","Dimensions: 6\"l x 6\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ef33e837-8404-47b8-94bb-3f1ebb68a9c7/Ebook+Thumbnail+with+Video+-+2025-11-06T085748.248.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/21249fd2-6250-4739-bdbf-4d757810beb0/Ebook+Thumbnail+with+Video+-+2025-11-06T085756.564.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ef33e837-8404-47b8-94bb-3f1ebb68a9c7/Ebook+Thumbnail+with+Video+-+2025-11-06T085748.248.png?format=500w",
    bg:"#FFE800", accent:"#4CAF50",
    tags:["yellow","lemonade","goldenrod","crystal-yellow","mustard","lime-green","green","meadow","white","sugar","orange","aloha"],
  },
  {
    id:"napkin-vampire-lips", type:"napkin", name:"Vampire Lips Napkins",
    desc:"Sink your teeth into stylish party decor with vampire lips paper napkins! Add a playful edge to your table with these spooky chic essentials.",
    bullets:["Set of 24","Dimensions: 4.5\"w x 5\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.50",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a96f209c-7682-49ce-952c-9cabebae1593/Ebook+Thumbnail+with+Video+-+2025-05-18T171358.603.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3dc49dda-a04a-4183-97ed-3043f7526a87/Ebook+Thumbnail+with+Video+-+2025-05-18T171409.229.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a96f209c-7682-49ce-952c-9cabebae1593/Ebook+Thumbnail+with+Video+-+2025-05-18T171358.603.png?format=500w",
    bg:"#1A1A1A", accent:"#E8112D",
    tags:["black","red","scarlett","sangria","crystal-burgundy","purple","plum","gray-smoke","white","crystal-clear"],
  },
  {
    id:"napkin-party-zone", type:"napkin", name:"Party Zone Napkins",
    desc:"Warning: Wild night ahead! Our party zone construction sign napkins are the ultimate cheeky touch for your bachelorette party.",
    bullets:["Set of 24","Dimensions: 7\"l x 7\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.58",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/764affd0-9a87-48e5-a93a-ad9dd7fff9df/Ebook+Thumbnail+with+Video+-+2025-05-19T215630.420.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a0f33131-f769-440d-bc9e-b5cf19329ae7/Ebook+Thumbnail+with+Video+-+2025-05-19T215640.868.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/764affd0-9a87-48e5-a93a-ad9dd7fff9df/Ebook+Thumbnail+with+Video+-+2025-05-19T215630.420.png?format=500w",
    bg:"#E91E8C", accent:"#FFD700",
    tags:["hotpink","blush","baby-pink","pink","gold","champagne","white","yellow","lemonade","confetti","silver"],
  },
  {
    id:"napkin-music-note", type:"napkin", name:"Music Note Napkins",
    desc:"Turn up the volume on your party decor with these music note napkins. A fun and flirty design, they hit all the right notes for cocktails, snacks, and selfies.",
    bullets:["Set of 16","Dimensions: 5\"w x 6.5\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.50",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0d094f6e-af4e-4707-8fd8-a0356a00f567/Ebook+Thumbnail+with+Video+-+2025-05-18T130657.292.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/adf582d1-fda7-4ab1-be4c-b8b3781c702b/Ebook+Thumbnail+with+Video+-+2025-05-18T130705.408.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0d094f6e-af4e-4707-8fd8-a0356a00f567/Ebook+Thumbnail+with+Video+-+2025-05-18T130657.292.png?format=500w",
    bg:"#1A1A1A", accent:"#E91E8C",
    tags:["black","hotpink","white","silver","gold","metallic-gold","purple","navy","gray-smoke","crystal-clear"],
  },
  {
    id:"napkin-simple-blue", type:"napkin", name:"Simple Blue Napkins",
    desc:"Add a pop of style. A fun scalloped edge that brings a polished touch to a bachelorette bash or bridal shower!",
    bullets:["Set of 20","Dimensions: 5\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.15",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b4eddbcd-dcb9-469e-a3cf-4e63ca48c840/Ebook+Thumbnail+with+Video-375.png?format=500w",
    bg:"#B8D8E8", accent:"#0084C1",
    tags:["blue","baby-blue","monet","georgia","blue-slate","seafoam","teal","turquoise","sea-glass","navy","white","crystal-clear"],
  },
  {
    id:"napkin-game-controller", type:"napkin", name:"Game Controller Napkins",
    desc:"Press start on the fun! These gamer girl napkins bring playful vibes to your bachelorette, arcade night, or game themed bash.",
    bullets:["Set of 16","Dimensions: 6.5\"l x 4.75\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$19.77",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c1561e18-e31b-4e05-a649-66af3914afef/Ebook+Thumbnail+with+Video+-+2025-05-18T124517.706.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/39f2d9ff-e1ec-452a-9ac2-e0ea4c32d07b/Ebook+Thumbnail+with+Video+-+2025-05-18T124528.582.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c1561e18-e31b-4e05-a649-66af3914afef/Ebook+Thumbnail+with+Video+-+2025-05-18T124517.706.png?format=500w",
    bg:"#1A1A1A", accent:"#0084C1",
    tags:["black","blue","royalty","navy","metallic-blue","gray-smoke","silver","white","red","green","purple"],
  },
  {
    id:"napkin-witch-please", type:"napkin", name:"Witch Please Napkins",
    desc:"Sassy, spooky, and ready to party. These witch please napkins are made for ghouls who slay spooky style!",
    bullets:["Set of 16","Dimensions: 5\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/521ce0df-d35b-4e5c-a9fb-a54c01c15874/Ebook+Thumbnail+with+Video+-+2025-11-04T170641.337.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f8be8099-f76b-40b9-ad59-5549eb999aa7/Ebook+Thumbnail+with+Video+-+2025-11-04T170653.266.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/521ce0df-d35b-4e5c-a9fb-a54c01c15874/Ebook+Thumbnail+with+Video+-+2025-11-04T170641.337.png?format=500w",
    bg:"#1A1A1A", accent:"#9C27B0",
    tags:["black","purple","plum","crystal-purple","orange","burnt-orange","sangria","evergreen","metallic-forest-green","gray-smoke"],
  },
  {
    id:"napkin-off-market", type:"napkin", name:"Off The Market Napkins",
    desc:"Celebrate the bride to be in style with off the market fringe paper napkins. Featuring playful fringe and bold lettering, these napkins are ready to party just like the bride.",
    bullets:["Set of 8","Dimensions: 5\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$9.36",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/149395c0-5bf6-4ac3-b1a9-e03105afdb4d/Ebook+Thumbnail+with+Video+-+2025-05-18T185535.880.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/7cbd6183-9866-4159-b084-c35eebe2659c/Ebook+Thumbnail+with+Video+-+2025-05-18T185549.136.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/149395c0-5bf6-4ac3-b1a9-e03105afdb4d/Ebook+Thumbnail+with+Video+-+2025-05-18T185535.880.png?format=500w",
    bg:"#E91E8C", accent:"#FFD700",
    tags:["hotpink","blush","baby-pink","pink","white","sugar","gold","champagne","metallic-fuchsia","crystal-magenta"],
  },
  {
    id:"napkin-time-celebrate", type:"napkin", name:"Time To Celebrate Napkins",
    desc:"It's time to celebrate! These festive napkins are perfect for bachelorette parties, bridal showers, and all the big moments worth toasting.",
    bullets:["Set of 18","Dimensions: 5\"w x 5\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$9.75",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a7d16c8d-0043-405e-a30a-7322bbe30775/Ebook+Thumbnail+with+Video+-+2025-07-21T170845.645.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/27b94460-d4f4-4db0-809b-2d1e4a19b9f6/Ebook+Thumbnail+with+Video+-+2025-07-21T170734.567.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a7d16c8d-0043-405e-a30a-7322bbe30775/Ebook+Thumbnail+with+Video+-+2025-07-21T170845.645.png?format=500w",
    bg:"#FFD700", accent:"#E91E8C",
    tags:["gold","metallic-gold","champagne","hotpink","white","sugar","silver","lace","blush","crystal-clear"],
  },
  {
    id:"napkin-pink-bow", type:"napkin", name:"Cottage Core Bow Napkins",
    desc:"Sweet, soft, and totally on trend. These cottage core bow napkins add a romantic, whimsical touch to any bachelorette table.",
    bullets:["Set of 16","Dimensions: 6.5\"w x 5.25\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1f0f4d51-8246-46ed-8f37-72b313145bd4/Ebook+Thumbnail+with+Video+-+2025-05-13T195007.791.png?format=500w",
    bg:"#FFB5C2", accent:"#E91E8C",
    tags:["hotpink","blush","baby-pink","pink","cameo","white","sugar","lavender","gold","champagne","mauve","canyon-rose"],
  },
  {
    id:"napkin-americana", type:"napkin", name:"Americana Polka Dot Napkins",
    desc:"Red, white, and ready to party! These star-spangled polka dot napkins bring patriotic charm to your bach bash or summer celebration.",
    bullets:["Set of 24","Dimensions: 5\"w x 5\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.73",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ec696bd6-2c23-4e7c-9f31-b8c0bf0951b5/Ebook+Thumbnail+with+Video+-+2025-06-07T111545.457.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b4de414e-ccee-4b65-86dc-4563bd078066/Ebook+Thumbnail+with+Video+-+2025-06-07T111553.654.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/50de2963-0b90-47be-84d3-a8763cee2212/Ebook+Thumbnail+with+Video+-+2025-06-07T111520.978.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6e47f548-9eec-4460-944b-7302a3fba8ec/Ebook+Thumbnail+with+Video+-+2025-06-07T111533.473.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ec696bd6-2c23-4e7c-9f31-b8c0bf0951b5/Ebook+Thumbnail+with+Video+-+2025-06-07T111545.457.png?format=500w",
    bg:"#E8112D", accent:"#0052A5",
    tags:["red","scarlett","blue","royalty","navy","metallic-blue","white","crystal-clear","crystal-sapphire","naval"],
  },
  {
    id:"napkin-lemon-zest", type:"napkin", name:"Lemon Zest Napkins",
    desc:"Add citrus flair to your celebration! Perfect for summer brunches, citrus-themed parties, bachelorette events, bridal showers, or garden picnics.",
    bullets:["Set of 20","Dimensions: 6.5\"l x 6.5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$13.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a05405df-ed31-4b1b-bd9c-5eb28d37f0c4/Ebook+Thumbnail+with+Video+-+2025-05-18T125656.306.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/070ab20a-cc02-4d4c-a58f-7b26c8e28695/Ebook+Thumbnail+with+Video+-+2025-05-18T125706.227.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a05405df-ed31-4b1b-bd9c-5eb28d37f0c4/Ebook+Thumbnail+with+Video+-+2025-05-18T125656.306.png?format=500w",
    bg:"#FFEA5A", accent:"#0084C1",
    tags:["yellow","lemonade","goldenrod","crystal-yellow","mustard","blue","baby-blue","monet","white","sugar","lime-green"],
  },
  {
    id:"napkin-luau", type:"napkin", name:"Luau Tropical Napkins",
    desc:"Bring the island vibes to your party with these luau tropical cocktail napkins! They'll add a splash of aloha to your drinks and decor.",
    bullets:["Set of 20","Dimensions: 5\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.58",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/75e73ca1-3baf-40d8-bcec-952e3293ee6f/Ebook+Thumbnail+with+Video+-+2025-05-18T171244.102.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6f261bf4-0bf3-4070-8d18-adeece3e9d40/Ebook+Thumbnail+with+Video+-+2025-05-18T171254.176.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/75e73ca1-3baf-40d8-bcec-952e3293ee6f/Ebook+Thumbnail+with+Video+-+2025-05-18T171244.102.png?format=500w",
    bg:"#29B6F6", accent:"#4CAF50",
    tags:["turquoise","teal","seafoam","sea-glass","lime-green","green","aloha","orange","coral","hotpink","yellow","lemonade"],
  },
  {
    id:"napkin-lemon", type:"napkin", name:"Lemon Napkins",
    desc:"When life gives you lemons… throw a party! Our lemon paper napkins are bursting with fruity fun and sunshine vibes.",
    bullets:["Set of 16","Dimensions: 5\"l x 4.62\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.99",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8a2a6f3b-6b6f-48ab-9f97-6913a999e364/Ebook+Thumbnail+with+Video+-+2025-05-19T222647.996.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/117068c6-6848-4aa1-a0d9-ae2173b519d1/Ebook+Thumbnail+with+Video+-+2025-05-19T220143.140.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8a2a6f3b-6b6f-48ab-9f97-6913a999e364/Ebook+Thumbnail+with+Video+-+2025-05-19T222647.996.png?format=500w",
    bg:"#FFEA5A", accent:"#4CAF50",
    tags:["yellow","lemonade","goldenrod","crystal-yellow","lime-green","green","meadow","white","sugar","mustard"],
  },
  {
    id:"napkin-ring-on-it", type:"napkin", name:"Put A Ring On It Napkins",
    desc:"Put A Ring On It! Celebrate your engagement in style with these cheeky napkins that say it all.",
    bullets:["Set of 25","Dimensions: 9\"l x 9\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.50",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/55cb6321-028f-4387-ac8b-845e0a2c7c89/Ebook+Thumbnail+with+Video+-+2025-05-18T171621.760.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/951abd3c-0559-415a-a4f7-45932f971329/Ebook+Thumbnail+with+Video+-+2025-05-18T171319.946.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/55cb6321-028f-4387-ac8b-845e0a2c7c89/Ebook+Thumbnail+with+Video+-+2025-05-18T171621.760.png?format=500w",
    bg:"#F4A7B9", accent:"#FFD700",
    tags:["blush","hotpink","baby-pink","pink","white","sugar","gold","champagne","silver","lavender","crystal-clear"],
  },
  {
    id:"napkin-hot-wheels", type:"napkin", name:"Hot Wheels Napkins",
    desc:"Rev up your bachelorette! These bold Hot Wheels inspired napkins bring racing vibes and party energy to your celebration.",
    bullets:["Set of 20","Dimensions: 5\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$8.50",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8ba65571-28eb-4768-b638-c8302be1700d/Ebook+Thumbnail+with+Video-409.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3f013ceb-6867-4ccb-908b-e77a7c8887e9/Ebook+Thumbnail+with+Video-410.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8ba65571-28eb-4768-b638-c8302be1700d/Ebook+Thumbnail+with+Video-409.png?format=500w",
    bg:"#E8112D", accent:"#1A1A1A",
    tags:["red","scarlett","orange","burnt-orange","black","yellow","lemonade","metallic-starfire-red"],
  },
  {
    id:"napkin-diamond", type:"napkin", name:"Diamond Napkins",
    desc:"18 ct · 5\" x 5\"", price:"$9.99",
    bullets:["Set of 18","Dimensions: 5\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/78343a74-0323-41d2-a89d-e4525f43e6be/Ebook+Thumbnail+with+Video+-+2025-01-24T180336.314.png",
    bg:"#1A1A1A", accent:"#CE93D8",
    tags:["black","purple","plum","crystal-purple","silver","gray-smoke","lavender","navy","metallic-midnight-blue"],
  },
  {
    id:"napkin-queen-card", type:"napkin", name:"Queen Card Napkins",
    desc:"16 ct · 5.5\" x 7\"", price:"$12.62",
    bullets:["Set of 16","Dimensions: 5.5\"l x 7\"w","Durable, lightweight, and disposable for easy cleanup"],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68499f331ef4b52dec0636bc/1767922376235/Ebook+Thumbnail+with+Video+-+2025-06-08T010753.060.png?format=1500w",
    bg:"#E8112D", accent:"#FFD700",
    tags:["red","scarlett","hotpink","black","white","gold","metallic-gold","champagne","crystal-red"],
  },
  {
    id:"napkin-fries-guys", type:"napkin", name:"Fries Before Guys Napkins",
    desc:"16 ct · 6\" x 4\"", price:"$11.00",
    bullets:["Set of 16","Dimensions: 6\"l x 4\"w","Durable, lightweight, and disposable for easy cleanup"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/e455f9c2-e856-4dd3-a236-f33b09625f0e/Ebook+Thumbnail+with+Video+-+2025-07-05T085433.945.png",
    bg:"#FFE800", accent:"#9C27B0",
    tags:["yellow","lemonade","goldenrod","mustard","crystal-yellow","purple","plum","lavender","blossom","peri","white","sugar"],
  },
  {
    id:"napkin-milk-carton", type:"napkin", name:"Milk Carton Napkins",
    desc:"Serve up some smarts and style with our smarty pants milk carton napkins! Shaped like retro school milk cartons, these quirky napkins add an A+ in charm and cleanup!",
    bullets:["Set of 16","Dimensions: 5\"w x 7\"l","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.50",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/7f770f8c-8cee-4a2f-b014-5a83ae3c029a/Ebook+Thumbnail+with+Video+-+2025-05-19T214459.044.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/4c1cad2e-72fd-464f-bd03-785425d8a1a9/Ebook+Thumbnail+with+Video+-+2025-05-19T214508.388.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/7f770f8c-8cee-4a2f-b014-5a83ae3c029a/Ebook+Thumbnail+with+Video+-+2025-05-19T214459.044.png?format=500w",
    bg:"#F8F8F8", accent:"#E91E8C",
    tags:["white","sugar","baby-pink","blush","hotpink","baby-blue","monet","lemonade","yellow","crystal-clear","red","scarlett"],
  },
  {
    id:"napkin-vegas", type:"napkin", name:"Vegas Casino Bachelorette Paper Napkins",
    desc:"Bachelorette Party", price:"$10.36",
    bullets:["Set of 20","Dimensions: 5\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/0505db/7876408656/il_fullxfull.7876408656_mqya.jpg",
    bg:"#F4A7B9", accent:"#C4956A",
    tags:["hotpink","blush","gold","champagne","metallic-gold","black","red","scarlett","white"],
  },
  {
    id:"napkin-bach-club", type:"napkin", name:"Bach Club Paper Napkins",
    desc:"Bachelorette Party", price:"$11.14",
    bullets:["Set of 20","Dimensions: 5\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/efe7af/7876407064/il_fullxfull.7876407064_99vl.jpg",
    bg:"#E91E8C", accent:"#1A1A1A",
    tags:["hotpink","black","silver","white","metallic-fuchsia","crystal-magenta","gray-smoke","navy","metallic-midnight-blue"],
  },
  {
    id:"napkin-last-rodeo", type:"napkin", name:"Bride's Last Rodeo Paper Napkins",
    desc:"Bachelorette Party", price:"$11.00",
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/b1bfe8/7876407834/il_fullxfull.7876407834_jkuo.jpg",
    bg:"#C4956A", accent:"#1A1A1A",
    tags:["terracotta","muse","malted","stone","lace","burnt-orange","champagne","mustard","cocoa","cow"],
  },

  {
    id:"napkin-jackpot", type:"napkin", name:"Jackpot Napkins",
    desc:"Your all access pass to nonstop fun. Grab a ticket napkin and let the show begin!",
    bullets:["Set of 16","Dimensions: 6.5\"l x 6.5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/106f8db7-e80b-480b-a579-982eb75700b8/Ebook+Thumbnail+with+Video-350.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b54fb255-07bc-49c3-bcea-fdd6f1da7abf/Ebook+Thumbnail+with+Video-351.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/106f8db7-e80b-480b-a579-982eb75700b8/Ebook+Thumbnail+with+Video-350.png?format=500w",
    bg:"#FFD700", accent:"#E8112D",
    tags:["gold","metallic-gold","champagne","red","scarlett","black","white","silver","crystal-red","hotpink"],
  },
  {
    id:"napkin-rhombuses", type:"napkin", name:"Rhombuses Napkins",
    desc:"Fresh, fun patterned napkins made to brighten up your springtime celebration.",
    bullets:["Set of 20","Dimensions: 6.5\"l x 6.5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$9.75",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c1eaeb14-5c91-4852-baf1-a3f42f5ebfe2/Ebook+Thumbnail+with+Video-348.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0dad9371-1de4-45fb-b745-9495ed38653d/Ebook+Thumbnail+with+Video-349.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c1eaeb14-5c91-4852-baf1-a3f42f5ebfe2/Ebook+Thumbnail+with+Video-348.png?format=500w",
    bg:"#F8F8F8", accent:"#9C27B0",
    tags:["white","sugar","crystal-clear","silver","gold","hotpink","blush","purple","lavender","navy","black","champagne"],
  },

  {
    id:"napkin-zodiac", type:"napkin", name:"Zodiac Napkins",
    desc:"Serve cosmic vibes and star powered style with these zodiac paper napkins perfect for celestial queens and astrology lovers alike! Make every gathering feel written in the stars.",
    bullets:["Set of 20","Dimensions: 5\"l x 5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/79657551-4204-487e-ad6d-67707692806c/Ebook+Thumbnail+with+Video+-+2025-06-24T144821.727.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a1ad09de-d711-4042-acdf-5e34801e7fcb/Ebook+Thumbnail+with+Video+-+2025-06-24T145348.204.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/79657551-4204-487e-ad6d-67707692806c/Ebook+Thumbnail+with+Video+-+2025-06-24T144821.727.png?format=500w",
    bg:"#1A1A1A", accent:"#FFD700",
    tags:["black","gold","metallic-gold","champagne","purple","plum","navy","metallic-midnight-blue","silver","white","crystal-clear"],
  },

  {
    id:"napkin-capricorn", type:"napkin", name:"Capricorn Napkins",
    desc:"Serve cosmic vibes and star powered style with these capricorn paper napkins perfect for celestial queens and astrology lovers alike!",
    bullets:["Set of 16","Dimensions: 8\"l x 4.25\"w (guest napkins)","Dimensions: 6.5\"l x 6.5\"w (large napkins)","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.00",
    variantLabel:"Size",
    variants:[
      { label:"Guest Napkins", price:"11.00", imgIdx:0 },
      { label:"Large Napkins", price:"10.00", imgIdx:1 },
    ],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/51393066-6508-4292-93e0-93d96710de0a/Ebook+Thumbnail+with+Video+-+2025-06-19T132836.859.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a8e3bdc3-4a08-47c0-9c74-226169383560/Ebook+Thumbnail+with+Video+-+2025-06-19T132725.198.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ccc79ad6-3bd0-4fdc-beee-124075ad913e/Ebook+Thumbnail+with+Video+-+2025-06-19T133112.558.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6d8cd71b-c2e3-454a-a03d-0081f740a641/Ebook+Thumbnail+with+Video+-+2025-06-19T133744.083.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/51393066-6508-4292-93e0-93d96710de0a/Ebook+Thumbnail+with+Video+-+2025-06-19T132836.859.png?format=500w",
    bg:"#1A1A1A", accent:"#C0C0C0",
    tags:["black","silver","gray-smoke","navy","metallic-midnight-blue","white","crystal-clear","gold","champagne","purple","plum"],
  },

  {
    id:"napkin-aquarius", type:"napkin", name:"Aquarius Napkins",
    desc:"Serve cosmic vibes and star powered style with these aquarius paper napkins perfect for celestial queens and astrology lovers alike!",
    bullets:["Set of 16","Dimensions: 8\"l x 4.25\"w (guest napkins)","Dimensions: 6.5\"l x 6.5\"w (large napkins)","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.00",
    variantLabel:"Size",
    variants:[
      { label:"Guest Napkins", price:"11.00", imgIdx:0 },
      { label:"Large Napkins", price:"10.00", imgIdx:1 },
    ],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/80b8f905-e139-4cee-8054-d6c59fd6d7c1/Ebook+Thumbnail+with+Video+-+2025-06-19T125828.842.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/334d901e-4c8f-42e2-a0ef-b80f8fe41c3b/Ebook+Thumbnail+with+Video+-+2025-06-19T125658.376.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/77121e04-5f44-48e4-8a4e-a6bcca0d448c/Ebook+Thumbnail+with+Video+-+2025-06-19T125524.636.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b4fe0664-c992-4e18-a090-9020e4235a52/Ebook+Thumbnail+with+Video+-+2025-06-19T125309.772.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/80b8f905-e139-4cee-8054-d6c59fd6d7c1/Ebook+Thumbnail+with+Video+-+2025-06-19T125828.842.png?format=500w",
    bg:"#29B6F6", accent:"#9C27B0",
    tags:["blue","baby-blue","monet","georgia","blue-slate","teal","turquoise","purple","lavender","white","crystal-clear","silver"],
  },

  {
    id:"napkin-pisces", type:"napkin", name:"Pisces Napkins",
    desc:"Serve cosmic vibes and star powered style with these pisces paper napkins perfect for celestial queens and astrology lovers alike!",
    bullets:["Set of 16","Dimensions: 8\"l x 4.25\"w (guest napkins)","Dimensions: 6.5\"l x 6.5\"w (large napkins)","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.00",
    variantLabel:"Size",
    variants:[
      { label:"Guest Napkins", price:"11.00", imgIdx:0 },
      { label:"Large Napkins", price:"10.00", imgIdx:1 },
    ],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ecb7f170-a264-40b7-84ee-8bb9b11593ac/Ebook+Thumbnail+with+Video+-+2025-06-19T121415.665.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6e660cf1-0424-41c2-b949-624acfd536e4/Ebook+Thumbnail+with+Video+-+2025-06-19T121950.331.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/29f2a069-ef40-4523-9806-550325134461/Ebook+Thumbnail+with+Video+-+2025-06-19T124207.850.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/e669617a-1a14-45c9-a76b-cb569dc8f6e8/Ebook+Thumbnail+with+Video+-+2025-06-19T124118.192.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ecb7f170-a264-40b7-84ee-8bb9b11593ac/Ebook+Thumbnail+with+Video+-+2025-06-19T121415.665.png?format=500w",
    bg:"#29B6F6", accent:"#9C27B0",
    tags:["blue","baby-blue","monet","teal","turquoise","seafoam","purple","lavender","blossom","white","crystal-clear","silver","sea-glass"],
  },

  {
    id:"napkin-cancer", type:"napkin", name:"Cancer Napkins",
    desc:"Serve cosmic vibes and star powered style with these cancer paper napkins perfect for celestial queens and astrology lovers alike!",
    bullets:["Set of 16","Dimensions: 8\"l x 4.25\"w (guest napkins)","Dimensions: 6.5\"l x 6.5\"w (large napkins)","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.00",
    variantLabel:"Size",
    variants:[
      { label:"Guest Napkins", price:"11.00", imgIdx:0 },
      { label:"Large Napkins", price:"10.00", imgIdx:1 },
    ],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5d081ec3-8b6e-4820-ae20-26c5e1059f38/Ebook+Thumbnail+with+Video+-+2025-06-19T130339.568.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/27bf5109-0459-46c2-8306-4cfb76f2eb39/Ebook+Thumbnail+with+Video+-+2025-06-19T130441.099.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/bad599e2-b3ee-4722-acb2-f92a3d898e28/Ebook+Thumbnail+with+Video+-+2025-06-19T131028.957.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/2781d918-7b31-41e6-96d4-4ca55a2d5437/Ebook+Thumbnail+with+Video+-+2025-06-19T130823.146.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5d081ec3-8b6e-4820-ae20-26c5e1059f38/Ebook+Thumbnail+with+Video+-+2025-06-19T130339.568.png?format=500w",
    bg:"#F4A7B9", accent:"#C0C0C0",
    tags:["blush","hotpink","baby-pink","pink","silver","white","crystal-clear","lavender","champagne","monet","sea-glass"],
  },

  {
    id:"napkin-aries", type:"napkin", name:"Aires Napkins",
    desc:"Serve cosmic vibes and star powered style with these aires paper napkins perfect for celestial queens and astrology lovers alike! Make every gathering feel written in the stars.",
    bullets:["Set of 16","Dimensions: 8\"l x 4.25\"w (guest napkins)","Dimensions: 6.5\"l x 6.5\"w (large napkins)","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.00",
    variantLabel:"Size",
    variants:[
      { label:"Guest Napkins", price:"11.00", imgIdx:0 },
      { label:"Large Napkins", price:"10.00", imgIdx:1 },
    ],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b4c690d8-7c49-4cb4-a1c0-73aa4eb1300f/Ebook+Thumbnail+with+Video+-+2025-06-18T124935.484.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ff6df11b-0d5e-461c-bdfc-a1a89a798235/Ebook+Thumbnail+with+Video+-+2025-06-18T125022.716.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/99c31e17-81be-4cc5-8f74-6d7e93c02d27/Ebook+Thumbnail+with+Video+-+2025-06-18T125810.220.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/900af7a3-9a56-48ae-9b97-985f4ba0e18c/Ebook+Thumbnail+with+Video+-+2025-06-18T125407.322.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b4c690d8-7c49-4cb4-a1c0-73aa4eb1300f/Ebook+Thumbnail+with+Video+-+2025-06-18T124935.484.png?format=500w",
    bg:"#E8112D", accent:"#FFD700",
    tags:["red","scarlett","crystal-red","gold","metallic-gold","champagne","white","crystal-clear","orange","burnt-orange","hotpink"],
  },

  {
    id:"napkin-taurus", type:"napkin", name:"Taurus Napkins",
    desc:"Serve cosmic vibes and star powered style with these taurus paper napkins perfect for celestial queens and astrology lovers alike!",
    bullets:["Set of 16","Dimensions: 8\"l x 4.25\"w (guest napkins)","Dimensions: 6.5\"l x 6.5\"w (large napkins)","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.00",
    variantLabel:"Size",
    variants:[
      { label:"Guest Napkins", price:"11.00", imgIdx:0 },
      { label:"Large Napkins", price:"10.00", imgIdx:1 },
    ],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/94176415-b6e0-471e-80cc-43a455daf278/Ebook+Thumbnail+with+Video+-+2025-06-24T100141.814.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ca7815a9-65a1-4b6d-b7b0-d591d1b82db2/Ebook+Thumbnail+with+Video+-+2025-06-24T100417.041.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/685e81e3-e530-49ed-bcad-db8254637357/Ebook+Thumbnail+with+Video+-+2025-06-24T142511.678.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/899e9791-5032-4d1b-8c84-4b0648c26b52/Ebook+Thumbnail+with+Video+-+2025-06-24T142930.642.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/94176415-b6e0-471e-80cc-43a455daf278/Ebook+Thumbnail+with+Video+-+2025-06-24T100141.814.png?format=500w",
    bg:"#4CAF50", accent:"#FFD700",
    tags:["green","meadow","lime-green","evergreen","gold","metallic-gold","champagne","white","crystal-clear","earth","stone","lace"],
  },

  {
    id:"napkin-libra", type:"napkin", name:"Libra Napkins",
    desc:"Serve cosmic vibes and star powered style with these libra paper napkins perfect for celestial queens and astrology lovers alike!",
    bullets:["Set of 16","Dimensions: 8\"l x 4.25\"w (guest napkins)","Dimensions: 6.5\"l x 6.5\"w (large napkins)","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.00",
    variantLabel:"Size",
    variants:[
      { label:"Guest Napkins", price:"11.00", imgIdx:0 },
      { label:"Large Napkins", price:"10.00", imgIdx:1 },
    ],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a0a666a7-3cbe-49c3-996e-c9b224528361/Ebook+Thumbnail+with+Video+-+2025-06-19T120501.079.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/eab38ba9-6217-4599-8a29-148bc080a337/Ebook+Thumbnail+with+Video+-+2025-06-19T120523.385.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/966f71eb-1d6d-4a55-b062-6cc7aa9fee5d/Ebook+Thumbnail+with+Video+-+2025-06-19T120812.833.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/2edd971c-6a11-40c2-8b9e-e926829e6c2c/Ebook+Thumbnail+with+Video+-+2025-06-19T121130.059.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a0a666a7-3cbe-49c3-996e-c9b224528361/Ebook+Thumbnail+with+Video+-+2025-06-19T120501.079.png?format=500w",
    bg:"#F4A7B9", accent:"#9C27B0",
    tags:["blush","hotpink","baby-pink","pink","lavender","purple","blossom","white","crystal-clear","champagne","gold","silver"],
  },

  {
    id:"napkin-virgo", type:"napkin", name:"Virgo Napkins",
    desc:"Serve cosmic vibes and star powered style with these virgo paper napkins perfect for celestial queens and astrology lovers alike!",
    bullets:["Set of 16","Dimensions: 8\"l x 4.25\"w (guest napkins)","Dimensions: 6.5\"l x 6.5\"w (large napkins)","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.00",
    variantLabel:"Size",
    variants:[
      { label:"Guest Napkins", price:"11.00", imgIdx:0 },
      { label:"Large Napkins", price:"10.00", imgIdx:1 },
    ],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/756879d1-b0a7-43ce-86f7-a46fd3507d1e/Ebook+Thumbnail+with+Video+-+2025-06-24T140357.690.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/344cb799-9258-416f-8519-1476ae90ebde/Ebook+Thumbnail+with+Video+-+2025-06-24T140524.467.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5c8826fe-e34e-4a1d-b568-6b70fca93346/Ebook+Thumbnail+with+Video+-+2025-06-24T140736.032.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f47ce2e3-b186-4f6b-b6e4-f757c0c88c63/Ebook+Thumbnail+with+Video+-+2025-06-24T141025.351.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/756879d1-b0a7-43ce-86f7-a46fd3507d1e/Ebook+Thumbnail+with+Video+-+2025-06-24T140357.690.png?format=500w",
    bg:"#F8F8F8", accent:"#4CAF50",
    tags:["white","crystal-clear","sugar","green","meadow","lime-green","gold","champagne","silver","lace","earth","stone"],
  },

  {
    id:"napkin-gemini", type:"napkin", name:"Gemini Napkins",
    desc:"Serve cosmic vibes and star powered style with these gemini paper napkins perfect for celestial queens and astrology lovers alike!",
    bullets:["Set of 16","Dimensions: 8\"l x 4.25\"w (guest napkins)","Dimensions: 6.5\"l x 6.5\"w (large napkins)","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.00",
    variantLabel:"Size",
    variants:[
      { label:"Guest Napkins", price:"11.00", imgIdx:0 },
      { label:"Large Napkins", price:"10.00", imgIdx:1 },
    ],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/37fa4743-c148-40bc-bd05-e6c7d7103e3f/Ebook+Thumbnail+with+Video+-+2025-06-20T155415.092.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f142cbf0-9c1e-49d3-ae79-4040c8c2e9af/Ebook+Thumbnail+with+Video+-+2025-06-20T155423.542.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8a7288fe-7504-4c26-933d-6685992be1e9/Ebook+Thumbnail+with+Video+-+2025-06-20T160038.448.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/9836229a-92fc-4630-8196-fe0ec461d569/Ebook+Thumbnail+with+Video+-+2025-06-20T160003.351.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/37fa4743-c148-40bc-bd05-e6c7d7103e3f/Ebook+Thumbnail+with+Video+-+2025-06-20T155415.092.png?format=500w",
    bg:"#FFD700", accent:"#9C27B0",
    tags:["yellow","lemonade","goldenrod","crystal-yellow","purple","lavender","blossom","white","crystal-clear","silver","champagne","hotpink"],
  },

  {
    id:"napkin-leo", type:"napkin", name:"Leo Napkins",
    desc:"Serve cosmic vibes and star powered style with these leo paper napkins perfect for celestial queens and astrology lovers alike! Make every gathering feel written in the stars.",
    bullets:["Set of 16","Dimensions: 8\"l x 4.25\"w (guest napkins)","Dimensions: 6.5\"l x 6.5\"w (large napkins)","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.00",
    variantLabel:"Size",
    variants:[
      { label:"Guest Napkins", price:"11.00", imgIdx:0 },
      { label:"Large Napkins", price:"10.00", imgIdx:1 },
    ],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b557d96e-2c33-4c99-a807-4af9d5cba5ea/Ebook+Thumbnail+with+Video+-+2025-06-24T091104.384.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/d1619272-b5e5-40c4-ab85-077afd670443/Ebook+Thumbnail+with+Video+-+2025-06-24T091155.266.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6860e3d7-c56b-4780-8f9a-e459d8e187c1/Ebook+Thumbnail+with+Video+-+2025-06-24T091609.253.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c41bae69-3209-47a8-812c-d22d88d7d7b1/Ebook+Thumbnail+with+Video+-+2025-06-24T091550.286.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b557d96e-2c33-4c99-a807-4af9d5cba5ea/Ebook+Thumbnail+with+Video+-+2025-06-24T091104.384.png?format=500w",
    bg:"#FFD700", accent:"#E8112D",
    tags:["gold","metallic-gold","champagne","orange","burnt-orange","aloha","red","scarlett","yellow","lemonade","white","crystal-clear"],
  },

  {
    id:"napkin-scorpio", type:"napkin", name:"Scorpio Napkins",
    desc:"Serve cosmic vibes and star powered style with these scorpio paper napkins perfect for celestial queens and astrology lovers alike!",
    bullets:["Set of 16","Dimensions: 8\"l x 4.25\"w (guest napkins)","Dimensions: 6.5\"l x 6.5\"w (large napkins)","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.00",
    variantLabel:"Size",
    variants:[
      { label:"Guest Napkins", price:"11.00", imgIdx:0 },
      { label:"Large Napkins", price:"10.00", imgIdx:1 },
    ],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c8ff86a3-180f-416b-a0bb-092a49679398/Ebook+Thumbnail+with+Video+-+2025-06-20T160424.498.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/16b52bfb-9df4-4bbc-b904-451b384aef0d/Ebook+Thumbnail+with+Video+-+2025-06-20T160650.136.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3f218f4a-b14f-40ca-8428-eecd0309eb94/Ebook+Thumbnail+with+Video+-+2025-06-24T090349.699.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c3644403-9295-41b6-a7c1-6c7fb9ef455e/Ebook+Thumbnail+with+Video+-+2025-06-24T090628.675.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c8ff86a3-180f-416b-a0bb-092a49679398/Ebook+Thumbnail+with+Video+-+2025-06-20T160424.498.png?format=500w",
    bg:"#E91E8C", accent:"#FFD700",
    tags:["hotpink","blush","baby-pink","pink","gold","metallic-gold","champagne","white","crystal-clear","sugar","metallic-fuchsia"],
  },

  {
    id:"napkin-sagittarius", type:"napkin", name:"Sagittarius Napkins",
    desc:"Serve cosmic vibes and star powered style with these sagittarius paper napkins perfect for celestial queens and astrology lovers alike! Make every gathering feel written in the stars.",
    bullets:["Set of 16","Dimensions: 8\"l x 4.25\"w (guest napkins)","Dimensions: 6.5\"l x 6.5\"w (large napkins)","Durable, lightweight, and disposable for easy cleanup"],
    price:"$10.00",
    variantLabel:"Size",
    variants:[
      { label:"Guest Napkins", price:"11.00", imgIdx:0 },
      { label:"Large Napkins", price:"10.00", imgIdx:1 },
    ],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3271f579-1c89-466f-84ce-8cb86b3cf43e/Ebook+Thumbnail+with+Video+-+2025-06-24T095317.787.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1a2ec52a-4839-4efe-a850-b69a4c7ed06d/Ebook+Thumbnail+with+Video+-+2025-06-24T095218.092.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a9c54d4a-95de-4b80-93a3-ff704c9946a5/Ebook+Thumbnail+with+Video+-+2025-06-24T095542.378.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/becb8187-b0a0-4a29-b7b4-ff3564dbbadb/Ebook+Thumbnail+with+Video+-+2025-06-24T095727.566.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3271f579-1c89-466f-84ce-8cb86b3cf43e/Ebook+Thumbnail+with+Video+-+2025-06-24T095317.787.png?format=500w",
    bg:"#29B6F6", accent:"#C0C0C0",
    tags:["blue","baby-blue","monet","georgia","blue-slate","navy","crystal-sapphire","silver","gray-smoke","fog","white","crystal-clear","sugar"],
  },

  // ── Cups ─────────────────────────────────────────────────────────────────────
  {
    id:"cup-pink-lemonade", type:"cup", name:"Pink Lemonade Cups",
    desc:"Sip happy with our pink lemonade cups. Bright, bold, and full of fun.",
    bullets:["Set of 8","Capacity: 12oz","Dimensions: 4.5\"l x 3.5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$9.99",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/d391d853-11ef-4738-bec4-7ec8c077ece7/Ebook+Thumbnail+with+Video-378.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/17e5d03e-f197-46b8-8f7a-adb603f921aa/Ebook+Thumbnail+with+Video-377.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/d391d853-11ef-4738-bec4-7ec8c077ece7/Ebook+Thumbnail+with+Video-378.png?format=500w",
    bg:"#FFB5C2", accent:"#FFE800",
    tags:["hotpink","blush","baby-pink","pink","yellow","lemonade","coral","taffy","white","sugar","champagne"],
  },
  {
    id:"cup-black-suit-potion", type:"cup", name:"Black Suit Potion Cups",
    desc:"Serve up your spooky potions in style with our lapel paper party cups! Inspired by Wednesday Addams.",
    bullets:["Set of 8","Capacity: 12oz","Durable, lightweight, and disposable for easy cleanup"],
    price:"$13.80",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/145fbae7-7c5a-4647-9ffe-54ac0c7d1b17/Ebook+Thumbnail+with+Video+-+2025-01-30T101320.249.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8767fab3-93f2-4ea5-ba69-13eb36da199e/Ebook+Thumbnail+with+Video+-+2025-01-27T144933.540.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/145fbae7-7c5a-4647-9ffe-54ac0c7d1b17/Ebook+Thumbnail+with+Video+-+2025-01-30T101320.249.png?format=500w",
    bg:"#1A1A1A", accent:"#9C27B0",
    tags:["black","purple","plum","crystal-purple","navy","metallic-midnight-blue","silver","gray-smoke","white","crystal-clear"],
  },
  {
    id:"cup-3d-planet", type:"cup", name:"3D Planet Cups",
    desc:"Blast off into bridal fun with these galaxy chic cups! Add the space rings to turn each drink into a planet because your crew deserves a celebration that's truly stellar.",
    bullets:["Set of 8","Capacity: 9oz","Dimensions: 3.5\"l x 3\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$12.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c4edd5ce-94a6-4f77-876f-6252fbd2ebe1/Ebook+Thumbnail+with+Video+-+2025-11-03T140309.152.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/65302f2a-f715-47ad-9735-68aa9e1f0b93/Ebook+Thumbnail+with+Video+-+2025-11-03T140501.702.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c4edd5ce-94a6-4f77-876f-6252fbd2ebe1/Ebook+Thumbnail+with+Video+-+2025-11-03T140309.152.png?format=500w",
    bg:"#1A1A1A", accent:"#9C27B0",
    tags:["black","purple","plum","navy","silver","gray-smoke","crystal-clear","blue","lavender","cosmic"],
    etsyUrl:"https://bachhotline.squarespace.com/decorations/p/3d-planet-cups",
  },
  {
    id:"cup-test-tube", type:"cup", name:"Test Tube Shot Glasses",
    desc:"Take your shots to the lab! These test tube shot glasses are perfect for spooky parties, Halloween drinks, or mad scientist vibes!",
    bullets:["Set of 10","Dimensions: 3.94\"l x 0.63\"w","Durable, lightweight, and reusable"],
    price:"$18.68",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b8d0c019-6fa9-4dd6-b2cc-d27e832c7170/Ebook+Thumbnail+with+Video+-+2025-09-02T190400.620.png?format=500w",
    bg:"#F8F8F8", accent:"#E91E8C",
    tags:["white","crystal-clear","hotpink","blush","baby-pink","silver","confetti","rainbow","neon-pink","neon-green"],
  },
  {
    id:"cup-love-notes", type:"cup", name:"Love Notes Cups",
    desc:"Send sweet sips with these love notes cups! Neon pops and gold foil details make them the perfect match for any Valentine's or Galentine's Day bash.",
    bullets:["Set of 8","Capacity: 9oz","Dimensions: 3.5\"l x 3\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ae6e5dd9-91ff-4706-91ae-1e9ca562149b/Ebook+Thumbnail+with+Video+-+2025-11-04T124253.381.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/e5f6098b-bdc5-40ea-9b04-dff9ffa7cc0e/Ebook+Thumbnail+with+Video+-+2025-11-04T124242.109.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ae6e5dd9-91ff-4706-91ae-1e9ca562149b/Ebook+Thumbnail+with+Video+-+2025-11-04T124253.381.png?format=500w",
    bg:"#F4A7B9", accent:"#E8112D",
    tags:["blush","hotpink","baby-pink","pink","red","scarlett","white","sugar","crystal-clear","champagne","taffy","coral"],
  },
  {
    id:"cup-cherry", type:"cup", name:"Cherry Cups",
    desc:"Pop some cherry charm into your celebration! These adorable cups are perfect for outdoor picnics, fruity themes, or any party that needs a splash of red and whimsy.",
    bullets:["Set of 8","Capacity: 9oz","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/85159ffc-afc6-4b3b-8f95-b4caeb48b80c/Ebook+Thumbnail+with+Video+-+2025-11-03T153201.078.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/515e66b6-fe6e-4441-80d1-b9abd78a0281/Ebook+Thumbnail+with+Video+-+2025-11-03T153220.364.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/85159ffc-afc6-4b3b-8f95-b4caeb48b80c/Ebook+Thumbnail+with+Video+-+2025-11-03T153201.078.png?format=500w",
    bg:"#E8112D", accent:"#4CAF50",
    tags:["red","scarlett","crystal-red","hotpink","blush","green","meadow","lime-green","white","sugar","crystal-clear"],
  },
  {
    id:"cup-girl-power", type:"cup", name:"Girl Power Cups",
    desc:"Zap! Bang! Pow! These pastel party cups pack a punch with silver foil details and bold superhero flair.",
    bullets:["Set of 8","Capacity: 9oz","Dimensions: 3.5\"l x 3\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/dfb6200c-71ef-4a00-9519-cdceee68c370/Ebook+Thumbnail+with+Video+-+2025-11-04T142254.958.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a7acf14e-d95d-497c-ac90-a4085fa051eb/Ebook+Thumbnail+with+Video+-+2025-11-04T142317.175.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/dfb6200c-71ef-4a00-9519-cdceee68c370/Ebook+Thumbnail+with+Video+-+2025-11-04T142254.958.png?format=500w",
    bg:"#E91E8C", accent:"#9C27B0",
    tags:["hotpink","blush","baby-pink","pink","purple","lavender","blossom","white","sugar","crystal-clear","metallic-fuchsia","crystal-magenta"],
  },
  {
    id:"cup-palm-tree", type:"cup", name:"Palm Palm Tree Cups",
    desc:"Palm trees and pretty pink? Yes, please! These cups are the perfect way to add instant vacay energy to your summer celebration.",
    bullets:["Set of 10","Capacity: 9oz","Dimensions: 4.5\"l x 3.5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0461f780-782d-41ae-b2b0-d48e3909ac43/Ebook+Thumbnail+with+Video+-+2025-11-04T121323.219.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/bf80ebd0-cd07-4ee3-965a-76d2b3d06ce7/Ebook+Thumbnail+with+Video+-+2025-11-04T121340.847.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0461f780-782d-41ae-b2b0-d48e3909ac43/Ebook+Thumbnail+with+Video+-+2025-11-04T121323.219.png?format=500w",
    bg:"#29B6F6", accent:"#4CAF50",
    tags:["teal","turquoise","seafoam","sea-glass","lime-green","green","meadow","aloha","orange","coral","yellow","lemonade","hotpink","white"],
  },
  {
    id:"cup-heartbeat-gang", type:"cup", name:"Heartbeat Gang Cups",
    desc:"Hearts, neon, and sparkle? Say less! These heartbeat gang cups bring serious party energy to your Galentine's celebration!",
    bullets:["Set of 8","Capacity: 9oz","Dimensions: 3.5\"l x 3\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a1d64160-c511-4e4b-b0a6-6218be7049a1/Ebook+Thumbnail+with+Video+-+2025-11-03T172558.659.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/7298457d-14b5-46f4-b0f7-5574d5ff62c9/Ebook+Thumbnail+with+Video+-+2025-11-03T172424.645.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a1d64160-c511-4e4b-b0a6-6218be7049a1/Ebook+Thumbnail+with+Video+-+2025-11-03T172558.659.png?format=500w",
    bg:"#E8112D", accent:"#E91E8C",
    tags:["red","scarlett","hotpink","blush","baby-pink","pink","white","sugar","crystal-clear","coral","taffy"],
  },
  {
    id:"cup-fiesta-striped", type:"cup", name:"Fiesta Striped Cups",
    desc:"From backyard fiestas to birthday bashes, these striped cups bring the flavor and flair! Easy to use, fun to look at, and made for good times.",
    bullets:["Set of 8","Capacity: 12oz","Dimensions: 4.5\"l x 3.5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/4b97b837-4d90-4c47-a721-fa3ab838c061/Ebook+Thumbnail+with+Video+-+2025-01-27T162539.289.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/57b12c8e-3d40-4ff2-8327-42e0521d709d/Ebook+Thumbnail+with+Video+-+2025-11-03T163553.060.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/4b97b837-4d90-4c47-a721-fa3ab838c061/Ebook+Thumbnail+with+Video+-+2025-01-27T162539.289.png?format=500w",
    bg:"#FF6B1A", accent:"#4CAF50",
    tags:["orange","burnt-orange","aloha","coral","lime-green","green","red","scarlett","yellow","lemonade","hotpink","turquoise","white"],
  },
  {
    id:"cup-butterfly", type:"cup", name:"Butterfly Cups",
    desc:"Beautiful butterflies! With dreamy pastels and shimmering holographic foil, these butterfly cups make your hearts flutter.",
    bullets:["Set of 8","Capacity: 9oz","Dimensions: 3.5\"l x 3\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/2320f49d-dc9e-42df-8dfe-25561541ee22/Ebook+Thumbnail+with+Video+-+2025-11-03T165151.639.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/9c41c110-f22c-4156-8c6c-7c63eb7d3b58/Ebook+Thumbnail+with+Video+-+2025-11-03T165437.483.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/2320f49d-dc9e-42df-8dfe-25561541ee22/Ebook+Thumbnail+with+Video+-+2025-11-03T165151.639.png?format=500w",
    bg:"#CE93D8", accent:"#81D4FA",
    tags:["lavender","purple","blossom","baby-blue","monet","blush","baby-pink","hotpink","white","crystal-clear","silver","confetti"],
  },
  {
    id:"cup-mermaid-fringe", type:"cup", name:"Mermaid Fringe Cups",
    desc:"Sip like a sea queen! These dazzling mermaid cups shimmer with layered scalloped foil, making every drink feel like an under the sea adventure.",
    bullets:["Set of 8","Capacity: 9oz","Dimensions: 3.5\"l x 3\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/01258a5f-cabf-45d0-8b36-b60acdbb0c4b/Ebook+Thumbnail+with+Video+-+2025-09-04T225037.656.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6b5e2ce1-ef28-4e2d-aabb-da1561e08700/Ebook+Thumbnail+with+Video+-+2025-09-04T225400.251.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/01258a5f-cabf-45d0-8b36-b60acdbb0c4b/Ebook+Thumbnail+with+Video+-+2025-09-04T225037.656.png?format=500w",
    bg:"#00B8D4", accent:"#CE93D8",
    tags:["teal","turquoise","seafoam","sea-glass","metallic-teal","blue","baby-blue","monet","purple","lavender","hotpink","silver","white"],
  },
  {
    id:"cup-island-vibes", type:"cup", name:"Island Vibes Cups",
    desc:"Vibrant flower wrapped cups are your new fave party plus one; tropical, flirty, and 100% selfie approved.",
    bullets:["Set of 8","Capacity: 9oz","Dimensions: 4\"l x 3\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$20.00",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68e2fb47f9144c3031441181/1767902090554/Ebook+Thumbnail+with+Video+-+2025-11-03T164536.370.png?format=500w",
    ],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68e2fb47f9144c3031441181/1767902090554/Ebook+Thumbnail+with+Video+-+2025-11-03T164536.370.png?format=500w",
    bg:"#29B6F6", accent:"#4CAF50",
    tags:["turquoise","teal","seafoam","sea-glass","aloha","lime-green","green","orange","coral","burnt-orange","yellow","lemonade","hotpink","white"],
  },
  {
    id:"cup-iridescent-stripe", type:"cup", name:"Iridescent Stripe Cups",
    desc:"Cheers to cute cups! Iridescent stripes that sparkle with every sip.",
    bullets:["Set of 8","Capacity: 9oz","Dimensions: 6\"l x 3.5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$9.12",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/694d821a18bbbd208c50fef9/1767902114614/Ebook+Thumbnail+with+Video-371.png?format=500w",
    ],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/694d821a18bbbd208c50fef9/1767902114614/Ebook+Thumbnail+with+Video-371.png?format=500w",
    bg:"#F8F8F8", accent:"#CE93D8",
    tags:["silver","white","crystal-clear","confetti","lavender","baby-pink","blush","baby-blue","monet","champagne","metallic-silver","fog"],
  },
  {
    id:"cup-blues-checker", type:"cup", name:"Blues Checker Cups",
    desc:"Soft hues, happy sips. Perfect for brunches, baby showers, and garden gatherings.",
    bullets:["Set of 8","Capacity: 9.5oz","Dimensions: 6\"l x 3\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$9.12",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69533cf93f4b3e6c55dde81f/1768082136340/Ebook+Thumbnail+with+Video+-+2025-12-29T203447.293.png?format=500w",
    ],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69533cf93f4b3e6c55dde81f/1768082136340/Ebook+Thumbnail+with+Video+-+2025-12-29T203447.293.png?format=500w",
    bg:"#29B6F6", accent:"#F8F8F8",
    tags:["blue","baby-blue","monet","georgia","blue-slate","navy","crystal-sapphire","royalty","white","crystal-clear","silver"],
  },
  {
    id:"cup-pop-petal", type:"cup", name:"Pop Petal Cups",
    desc:"Pop up petal adds instant flair to any bachelorette bash or brunch! Floral charm + a honeycomb pop = total party magic.",
    bullets:["Set of 8","Capacity: 12oz","Dimensions: 4.5\"l x 3.5\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$13.25",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/690a378362cc1b156338d5ba/1767902189676/Ebook+Thumbnail+with+Video+-+2025-11-04T113936.835.png?format=500w",
    ],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/690a378362cc1b156338d5ba/1767902189676/Ebook+Thumbnail+with+Video+-+2025-11-04T113936.835.png?format=500w",
    bg:"#E91E8C", accent:"#FFD700",
    tags:["hotpink","blush","baby-pink","pink","coral","taffy","orange","yellow","lemonade","white","sugar","champagne","gold"],
  },
  {
    id:"cup-doomsday", type:"cup", name:"Doomsday Cups",
    desc:"Serve your sinister potions in cups that shimmer! With holographic foil and a hauntingly cool design, these are perfect for any spooky lab or party lair.",
    bullets:["Set of 8","Capacity: 9oz","Dimensions: 3.5\"l x 3\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.00",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68acda86c1bfc45b6dc378a3/1767375195900/Ebook+Thumbnail+with+Video+-+2025-11-03T162756.279.png?format=500w",
    ],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68acda86c1bfc45b6dc378a3/1767375195900/Ebook+Thumbnail+with+Video+-+2025-11-03T162756.279.png?format=500w",
    bg:"#1A1A1A", accent:"#E8112D",
    tags:["black","red","scarlett","orange","burnt-orange","purple","plum","gray-smoke","silver","white","crystal-clear"],
  },
  {
    id:"cup-bow", type:"cup", name:"Bow Cups",
    desc:"Cheers to chic! With a bold black bow and modern vibe, these cups are a simple way to make your party table pop with sophistication.",
    bullets:["Set of 8","Capacity: 9oz","Dimensions: 3.5\"l x 3\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.00",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0baa6024-00a5-4ed8-a61b-31d6bdd331c4/Ebook+Thumbnail+with+Video+-+2025-11-03T140749.604.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0baa6024-00a5-4ed8-a61b-31d6bdd331c4/Ebook+Thumbnail+with+Video+-+2025-11-03T140749.604.png?format=500w",
    bg:"#FFB5C2", accent:"#E91E8C",
    tags:["hotpink","blush","baby-pink","pink","white","sugar","crystal-clear","champagne","lavender","gold","taffy","cameo","lace","stone","fog","cocoa","malted","muse","earth"],
  },
  {
    id:"cup-pixelation", type:"cup", name:"Pixelation Cups",
    desc:"Level up your party game! These pixel perfect cups rock a retro checkerboard design and a holographic foil border that's totally game night ready.",
    bullets:["Set of 8","Capacity: 9oz","Dimensions: 3.5\"l x 3\"w","Durable, lightweight, and disposable for easy cleanup"],
    price:"$11.00",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69093cb4251a3c395b53ba62/1767902239652/Ebook+Thumbnail+with+Video+-+2025-11-03T174833.491.png?format=500w",
    ],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69093cb4251a3c395b53ba62/1767902239652/Ebook+Thumbnail+with+Video+-+2025-11-03T174833.491.png?format=500w",
    bg:"#9C27B0", accent:"#29B6F6",
    tags:["purple","plum","crystal-purple","lavender","blue","baby-blue","monet","hotpink","blush","silver","gray-smoke","white","crystal-clear","confetti","orange","burnt-orange","aloha","coral","cocoa","malted","muse","earth"],
  },
  {
    id:"cup-dusty-pinky", type:"cup", name:"Dusty Pinky Cups",
    desc:"Pretty in pink and ready to party! These dusty pinky cups are the cutest plus one to your bachelorette party.",
    bullets:["Set of 8","Capacity: 9oz","Durable, lightweight, and disposable for easy cleanup"],
    price:"$9.75",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/33a7e662-6ebd-4e6e-b13d-ab0cadca9530/Ebook+Thumbnail+with+Video+-+2025-12-31T112006.750.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/33a7e662-6ebd-4e6e-b13d-ab0cadca9530/Ebook+Thumbnail+with+Video+-+2025-12-31T112006.750.png?format=500w",
    bg:"#F4A7B9", accent:"#CE93D8",
    tags:["blush","baby-pink","pink","mauve","cameo","canyon-rose","lavender","blossom","muse","stone","lace","white","sugar","champagne"],
  },
  {
    id:"cup-blood-bags", type:"cup", name:"Blood Plastic Bags",
    desc:"Fill them with 'blood' (or booze!) These drink pouches bring the perfect bite to your spooky bash.",
    bullets:["Set of 5","Capacity: 8oz","Includes 1 funnel"],
    price:"$20.68",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b7992764121927f4c311ea/1767902296319/Ebook+Thumbnail+with+Video+-+2025-09-02T182534.261.png?format=500w",
    ],
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b7992764121927f4c311ea/1767902296319/Ebook+Thumbnail+with+Video+-+2025-09-02T182534.261.png?format=500w",
    bg:"#E8112D", accent:"#1A1A1A",
    tags:["red","scarlett","crystal-red","sangria","crystal-burgundy","black","purple","plum","orange","burnt-orange","white","crystal-clear"],
  },
  {
    id:"cup-penis-glasses", type:"cup", name:"Penis Shaped Glasses",
    desc:"This set of 4 penis shaped glass drinkware is for any bachelorette bash. They're great for shots, cocktails, or fun party toasts.",
    bullets:["Set of 4","Capacity: 6oz","Dimensions: 5.5\" h"],
    price:"$34.07",
    images:[
      "https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/bb0263/6824885638/il_fullxfull.6824885638_mk0l.jpg",
    ],
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/bb0263/6824885638/il_fullxfull.6824885638_mk0l.jpg",
    bg:"#FFB5C2", accent:"#E91E8C",
    tags:["hotpink","blush","baby-pink","pink","white","crystal-clear","red","coral","taffy","metallic-fuchsia"],
  },
  {
    id:"cup-uncle-sam", type:"cup", name:"Uncle Sam Hat Plastic Cup",
    desc:"Hats off to the USA! Sip in red, white, and blue style with our Uncle Sam hat cups.",
    bullets:["Set of 1","Capacity: 14oz"],
    price:"$12.34",
    images:[
      "https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/d58b9f/6854628428/il_fullxfull.6854628428_8x69.jpg",
    ],
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/d58b9f/6854628428/il_fullxfull.6854628428_8x69.jpg",
    bg:"#E8112D", accent:"#0052A5",
    tags:["red","scarlett","blue","royalty","navy","white","crystal-clear","silver","crystal-sapphire","naval"],
  },
  {
    id:"cup-giddy-up", type:"cup", name:"Giddy Up Sluts Espresso Cup",
    desc:"Bachelorette Party", price:"$22.26",
    bullets:["Set of 2","Capacity: 3oz"],
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/99c7e3/7806352486/il_fullxfull.7806352486_g77x.jpg",
    bg:"#C4956A", accent:"#1A1A1A",
    tags:["terracotta","muse","malted","stone","earth","cocoa","burnt-orange","champagne","lace","white","black","mustard"],
  },
  {
    id:"cup-patriotic-cake", type:"cup", name:"Patriotic Cake Slice Cups",
    desc:"Celebrate the 4th of July with our slice of fun patriotic sipper set. A party collection of six cake slice-shaped cups designed to add a festive twist to any gathering.",
    bullets:["Set of 6","Capacity: 12oz","Dimensions: 4\"l x 5\"h x 4\"w","Includes reusable straws"],
    price:"$49.99",
    images:[
      "https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/545921/6902762281/il_fullxfull.6902762281_ck4m.jpg",
    ],
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/545921/6902762281/il_fullxfull.6902762281_ck4m.jpg",
    bg:"#E8112D", accent:"#0052A5",
    tags:["red","scarlett","blue","royalty","navy","white","crystal-clear","silver","crystal-sapphire","naval"],
  },
  {
    id:"cup-blush",      type:"cup",  name:"Blush Pink Cups",
    desc:"Bachelorette Party",      price:"$9.99",
    image: null,         bg:"#F4A7B9", accent:"#E91E8C",
    tags:["blush","hotpink","mauve","lavender","confetti"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"cup-gold",       type:"cup",  name:"Gold Foil Cups",
    desc:"Bachelorette Party",      price:"$10.99",
    image: null,         bg:"#FFD700", accent:"#B8860B",
    tags:["gold","champagne","terracotta"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"cup-black",      type:"cup",  name:"Matte Black Cups",
    desc:"Bachelorette Party",      price:"$8.99",
    image: null,         bg:"#1A1A1A", accent:"#444",
    tags:["black","silver","purple","blue"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"cup-holographic",type:"cup",  name:"Holographic Cups",
    desc:"25 ct · 16oz", price:"$12.99",
    image: null,         bg:"linear-gradient(135deg,#F4A7B9,#CE93D8,#81D4FA,#FFD700)", accent:"#E91E8C",
    tags:["silver","lavender","blue","mint","confetti"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },

  // ── Foil Balloons ─────────────────────────────────────────────────────────────
  {
    id:"foil-fruit-green-number", type:"foil", numberBalloon:true, name:"34\" Fruit Green Number Balloon",
    desc:"34\" foil number balloon", price:"$10.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/52a8acbc-6d54-45d8-816b-5cb50d5c1f25/Ebook+Thumbnail+with+Video-364.png",
    bg:"#4CAF50", accent:"#FFD700",
    tags:["green","lime-green","meadow","empower-mint","yellow","lemonade","white","crystal-clear"],
  },



  {
    id:"foil-hot-pink-number", type:"foil", numberBalloon:true, name:"34\" Hot Pink Number Balloon",
    desc:"Spruce up your bash with a splash of pizzazz using these fabulous 34\" hot pink foil number balloons! This dazzling collection has every number from 0 to 9, so you can mix and match like a party picasso!",
    bullets:["1 count, each number is sold separately","Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$8.99",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68c71ad4f4bdc7234d355338/1768010153419/Ebook+Thumbnail+with+Video+-+2025-01-04T151316.505.png?format=1500w",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68c71ad4f4bdc7234d355338/1768010153419/Ebook+Thumbnail+with+Video+-+2025-01-04T151316.505.png?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/bb47d140-c601-41ec-9f16-c5b31b0e039c/Ebook+Thumbnail+with+Video+-+2025-01-04T151333.195.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/18c8aa26-b1af-4f22-a628-54aba3604c6b/Ebook+Thumbnail+with+Video+-+2025-01-04T151349.047.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b3a2efce-d692-4fdc-bcd0-de1017ee4c75/Ebook+Thumbnail+with+Video+-+2025-01-04T154311.200.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ce1235a3-0275-4d1f-a0d4-b9b69e7ad843/Ebook+Thumbnail+with+Video-121.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/06788b66-81ea-46c9-a857-473708110f91/Ebook+Thumbnail+with+Video+-+2025-01-04T154323.803.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b8af6367-5a5f-4bcd-b452-32f8e5971594/Ebook+Thumbnail+with+Video+-+2025-01-04T154925.106.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/de2ec924-f5c5-4eb9-bb82-6b5523874df0/Ebook+Thumbnail+with+Video+-+2025-01-04T154543.401.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b6d02464-c132-4c1f-9800-6f053d3b47f6/Ebook+Thumbnail+with+Video+-+2025-01-04T154707.944.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/060a7bcb-e7ba-4f8e-8117-69e493199212/Ebook+Thumbnail+with+Video+-+2025-01-04T155013.784.png",
    ],
    bg:"#F8BBD9", accent:"#E91E8C",
    tags:["hotpink","neon-pink","crystal-magenta","metallic-fuchsia","blush","baby-pink","pink","white","crystal-clear"],
  },


  {
    id:"foil-rainbow-number", type:"foil", numberBalloon:true, name:"34\" Rainbow Number Balloon",
    desc:"34\" foil number balloon", price:"$13.68",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8856029c-ae9f-49e0-a03f-379626f119be/Ebook+Thumbnail+with+Video+-+2025-03-13T174918.813.png",
    bg:"#FFD700", accent:"#E91E8C",
    tags:["red","orange","yellow","green","blue","purple","hotpink","rainbow","confetti","white","crystal-clear"],
  },
  {
    id:"foil-floral-number", type:"foil", numberBalloon:true, name:"40\" Floral Number Balloon",
    desc:"Spruce up your bash with a splash of pizzazz using these fabulous 40\" floral number foil balloons! This dazzling collection has every number from 0 to 9, so you can mix and match like a party garden picasso!",
    bullets:["1 count, each number is sold separately","Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$19.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/cffbfe26-1d67-475b-8c52-31afefe61a80/Ebook+Thumbnail+with+Video+-+2025-01-20T102142.152.png",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/cffbfe26-1d67-475b-8c52-31afefe61a80/Ebook+Thumbnail+with+Video+-+2025-01-20T102142.152.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/44670318-fdcc-46c6-ae30-386f9609c5fe/Ebook+Thumbnail+with+Video+-+2025-01-20T100621.717.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6890cef4-9a0d-41aa-8df2-39b71ae1dea8/Ebook+Thumbnail+with+Video+-+2025-01-20T100725.960.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/d008160a-1b83-4b26-bd92-bcf8f7f42cdb/Ebook+Thumbnail+with+Video+-+2025-01-20T101716.421.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/cffbfe26-1d67-475b-8c52-31afefe61a80/Ebook+Thumbnail+with+Video+-+2025-01-20T102142.152.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/56a0d5d0-16c6-4cbd-b4c9-9a178776850f/Ebook+Thumbnail+with+Video+-+2025-01-20T101748.403.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/15124674-ae28-4968-8afe-619624a78e79/Ebook+Thumbnail+with+Video+-+2025-01-20T101807.494.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8c9e7e3a-ab69-4a85-846f-fbbaad1bddd3/Ebook+Thumbnail+with+Video+-+2025-01-20T101836.705.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/2b50ad44-9665-4c91-bbb9-5f2ad76b4d0d/Ebook+Thumbnail+with+Video+-+2025-01-20T101906.180.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/065ba499-cb39-4b5f-8bb9-8d43280679a8/Ebook+Thumbnail+with+Video+-+2025-01-20T101953.479.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/7364ef2e-60b4-4a86-bc7f-370b54ce69ec/Ebook+Thumbnail+with+Video+-+2025-01-20T102116.128.png",
    ],
    bg:"#E8F5E9", accent:"#E91E8C",
    tags:["hotpink","blush","baby-pink","pink","green","lime-green","meadow","floral","white","crystal-clear","rainbow"],
  },

  {
    id:"foil-blue-polka-dot-number", type:"foil", numberBalloon:true, name:"34\" Blue Polka Dot Number Balloon",
    desc:"Make your celebration pop with the vibrant 34\" baby blue polka dots number foil balloon!",
    bullets:["1 count, each number is sold separately","Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$9.99",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d2f78376809b67b84bd387/1768010433055/Ebook+Thumbnail+with+Video+-+2025-03-13T184846.536.png?format=1500w",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d2f78376809b67b84bd387/1768010433055/Ebook+Thumbnail+with+Video+-+2025-03-13T184846.536.png?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/99060330-0d34-4519-a970-f43667ddc29d/Ebook+Thumbnail+with+Video+-+2025-03-13T180411.276.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f8041854-ab4e-4d43-a4d4-fc44561d5128/Ebook+Thumbnail+with+Video+-+2025-03-13T183041.797.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f1bdbfb5-d105-4afb-a1ab-9e85d48bd1ad/Ebook+Thumbnail+with+Video+-+2025-03-13T183149.808.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6dcbd859-3897-4890-bd28-1b89c724860f/Ebook+Thumbnail+with+Video+-+2025-03-13T185118.850.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c508e16e-b4b3-4c16-b1c9-bcd31f30e33c/Ebook+Thumbnail+with+Video+-+2025-03-13T183216.788.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/44ef08f3-6527-479c-a701-8b30219ba058/Ebook+Thumbnail+with+Video+-+2025-03-13T183401.000.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/7809f527-ea59-4781-806b-6251312bf919/Ebook+Thumbnail+with+Video+-+2025-03-13T183915.228.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/e34c0a38-2105-4eb9-b354-8dbc8651806f/Ebook+Thumbnail+with+Video+-+2025-03-13T183621.389.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/efb8b1b2-6176-4beb-8c30-70c8c1997e2d/Ebook+Thumbnail+with+Video+-+2025-03-13T183700.959.png",
    ],
    bg:"#81D4FA", accent:"#F8F8F8",
    tags:["baby-blue","monet","georgia","teal","turquoise","seafoam","white","crystal-clear","silver"],
  },

  {
    id:"foil-black-number", type:"foil", numberBalloon:true, name:"34\" Black Number Balloon",
    desc:"Sleek, striking, and ready to party! These 34\" foil number balloons are your go to for cool, custom decor.",
    bullets:["1 count, each number is sold separately","Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b22c403e-50df-4c60-b2e1-3c839ea2a26a/Ebook+Thumbnail+with+Video-120.png",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b22c403e-50df-4c60-b2e1-3c839ea2a26a/Ebook+Thumbnail+with+Video-120.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0f0cadfc-9874-4db9-8580-0f4cdb775fc1/Ebook+Thumbnail+with+Video+-+2025-01-04T203135.075.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5f6c74e2-ee11-4d4d-b088-ca9eeee57f84/Ebook+Thumbnail+with+Video+-+2025-01-04T203249.660.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f5d886d3-268b-437f-a05a-4684de1ab05a/Ebook+Thumbnail+with+Video+-+2025-01-04T203320.700.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b22c403e-50df-4c60-b2e1-3c839ea2a26a/Ebook+Thumbnail+with+Video-120.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/20d7f0d3-3397-4855-b6d4-567d19a68e9a/Ebook+Thumbnail+with+Video+-+2025-01-04T203355.626.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/9ff71790-5579-4dee-815f-2a2b5541e10e/Ebook+Thumbnail+with+Video+-+2025-01-04T203448.652.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/fed5885d-6973-4481-8dab-511632454da6/Ebook+Thumbnail+with+Video+-+2025-01-04T203947.631.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3033e405-fd47-445a-b3f8-91af1a4b3826/Ebook+Thumbnail+with+Video+-+2025-01-04T203557.819.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8547dba4-f75f-4fce-9973-fbdaa6be5df0/Ebook+Thumbnail+with+Video+-+2025-01-04T203804.576.png",
    ],
    bg:"#1A1A1A", accent:"#F8F8F8",
    tags:["black","white","crystal-clear","gray-smoke","silver","dark","matte-black"],
  },

  {
    id:"foil-zebra-number", type:"foil", numberBalloon:true, name:"40\" Zebra Number Balloon",
    desc:"40\" foil number balloon", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5daa3d3b-50bd-45ec-8dfd-4968ae2c52e0/Ebook+Thumbnail+with+Video+-+2025-01-06T165405.036.png",
    bg:"#1A1A1A", accent:"#F8F8F8",
    tags:["black","white","crystal-clear","gray-smoke","silver","dalmatian","cow"],
  },

  {
    id:"foil-robin-egg-number", type:"foil", numberBalloon:true, name:"34\" Robin Egg Blue Number Balloon",
    desc:"34\" foil number balloon", price:"$10.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/639ba48a-8d67-4c99-af71-2688dc8b8324/Ebook+Thumbnail+with+Video+-+2025-01-04T204751.446.png",
    bg:"#81D4FA", accent:"#F8F8F8",
    tags:["baby-blue","monet","georgia","teal","turquoise","seafoam","sea-glass","white","crystal-clear","silver","confetti"],
  },

  {
    id:"foil-fruit-green-number", type:"foil", numberBalloon:true, name:"34\" Fruit Green Number Balloon",
    desc:"Count on style! These fabulous 34\" fruit green foil number balloons make any age or date totally party worthy.",
    bullets:["1 count, each number is sold separately","Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$10.99",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/694d760118bbbd208c50fba5/1768010901550/Ebook+Thumbnail+with+Video-363.png?format=1500w",
    images:[
      "https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/694d760118bbbd208c50fba5/1768010901550/Ebook+Thumbnail+with+Video-363.png?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b5af3179-4bec-48d0-99ae-93763121a610/Ebook+Thumbnail+with+Video-367.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/52a8acbc-6d54-45d8-816b-5cb50d5c1f25/Ebook+Thumbnail+with+Video-364.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6ab2c58d-3111-4f7c-b908-2eb7b3ecc736/Ebook+Thumbnail+with+Video-393.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/d3434bdb-fa71-466c-9afc-0f33269c606f/Ebook+Thumbnail+with+Video-394.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a4f91419-ec73-41b5-b4e9-79770910bbd8/Ebook+Thumbnail+with+Video-396.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/daa8f674-1ded-4558-94a7-88233f113075/Ebook+Thumbnail+with+Video-365.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/57af63a3-81a4-4d6e-b998-0e15c74f0d12/Ebook+Thumbnail+with+Video-366.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5cdf8a65-242a-44d1-9632-6051d37c308e/Ebook+Thumbnail+with+Video-395.png",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/bede3c13-e52f-4aeb-a43c-a0774d12b68e/Eboo6.png",
    ],
    bg:"#66BB6A", accent:"#F8F8F8",
    tags:["green","lime-green","meadow","empower-mint","white","crystal-clear"],
  },

  {
    id:"foil-barbie", type:"foil", name:"32\" Barbie Balloon",
    desc:"This barbie 32\" foil balloon isn't just decor; it's a whole vibe! Perfectly pairs with pink and silver color scheme for the ultimate glam party setup.",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate; foil balloons can pop"],
    price:"$12.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/cb785271-e3c2-41c2-8a2d-e3d9e60bc027/Ebook+Thumbnail+with+Video+-+2025-01-04T201354.576.png",
    bg:"#E91E8C", accent:"#FFB5C2",
    tags:["hotpink","blush","baby-pink","pink","white","crystal-clear","metallic-fuchsia","crystal-magenta","lavender"],
  },

  {
    id:"foil-rainbow", type:"foil", name:"32\" Rainbow Balloon",
    desc:"Add a pop of party magic with this glam 32\" rainbow balloon! Shiny, bold, and totally extra. It's the ultimate show stealer for your girls' night bash!",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$9.15",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/da86e345-3981-4898-866a-c09dfc2316fb/Ebook+Thumbnail+with+Video+-+2025-01-04T223406.603.png",
    bg:"#FFD700", accent:"#E91E8C",
    tags:["red","orange","yellow","green","blue","purple","hotpink","rainbow","confetti","white","crystal-clear"],
  },

  {
    id:"foil-flamingle", type:"foil", name:"31\" Let's Flamingle Drink Balloon",
    desc:"Turn up the fun with our 31\" let's flamingle drink foil balloon. Sip, mingle, and party in style with this festive decor!",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$11.54",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f33cab70-33a5-4ff4-83da-b7bf3520aaab/Ebook+Thumbnail+with+Video+-+2025-05-18T172704.423.png",
    bg:"#E91E8C", accent:"#FF6B1A",
    tags:["hotpink","blush","baby-pink","pink","coral","taffy","orange","aloha","teal","turquoise","white","crystal-clear"],
  },

  {
    id:"foil-cactus", type:"foil", name:"41\" Cactus Plant Balloon",
    desc:"Bring the fun to your bachelorette party with this 41\" cactus plant foil balloon! Perfect for adding a desert vibe to your tropical or southwestern themed celebration.",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$10.22",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/e5332727-1602-4afd-9a89-45e2f6a17e94/Ebook+Thumbnail+with+Video+-+2025-05-17T221304.722.png",
    bg:"#4CAF50", accent:"#E91E8C",
    tags:["green","lime-green","meadow","empower-mint","red","coral","aloha","hotpink","white","crystal-clear","yellow","lemonade"],
  },

  {
    id:"foil-whimsy-mushroom", type:"foil", name:"30\" Whimsy Mushroom Balloon",
    desc:"Add some sparkle and shroomy charm to your party! This 30\" whimsical shroom shine balloon is pure cottagecore magic.",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$12.99",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6907e07b2e1a513d9a3a8f6a/1768007861860/Ebook+Thumbnail+with+Video+-+2025-10-21T102050.023.png?format=1500w",
    bg:"#F4A460", accent:"#FF69B4",
    tags:["orange","coral","aloha","blush","baby-pink","pink","hotpink","gold","champagne","white","crystal-clear","mushroom","cottagecore"],
  },

  {
    id:"foil-silver-starburst", type:"foil", name:"40\" Silver Starburst Balloon",
    desc:"Sparkly silver starburst balloon bringing major party glam and bachelorette vibes.",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$7.25",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6951c7f49e309b737483876a/1768084248069/Ebook+Thumbnail+with+Video+-+2025-12-30T163546.241.png?format=1500w",
    bg:"#C0C0C0", accent:"#F8F8F8",
    tags:["silver","gray-smoke","fog","white","crystal-clear","metallic-silver","champagne","gold","metallic-gold","navy","black"],
  },

  {
    id:"foil-mushroom", type:"foil", name:"30\" Whimsy Mushroom Balloon",
    desc:"30\" specialty foil balloon", price:"$12.99",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6907e07b2e1a513d9a3a8f6a/1768007861860/Ebook+Thumbnail+with+Video+-+2025-10-21T102050.023.png?format=1500w",
    bg:"#CE93D8", accent:"#4CAF50",
    tags:["purple","lavender","blossom","green","lime-green","meadow","hotpink","blush","orange","burnt-orange","white","crystal-clear","rainbow"],
  },

  {
    id:"foil-half-moon", type:"foil", name:"26\" Half Moon Balloon",
    desc:"Cute curves, big party energy! Our half moon balloon is the perfect backdrop for your bash.",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$8.58",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6951c74e4a48c45392c3aaab/1768007821696/Ebook+Thumbnail+with+Video-398.png?format=1500w",
    bg:"#1A1A1A", accent:"#FFD700",
    suggested:["plate-star","cup-iridescent-stripe"],
    tags:["black","navy","metallic-midnight-blue","gold","metallic-gold","silver","white","crystal-clear","purple","plum","gray-smoke"],
  },

  {
    id:"foil-sweetheart-cherry", type:"foil", name:"34\" Sweetheart Cherry Balloon",
    desc:"Make your party extra juicy with this 34\" sweetheart cherry balloon. The ultimate mix of sweet, cheeky, and perfect for your bachelorette bash!",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$12.88",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0ece9eb4-7fda-4942-9d2c-e839f2404c0c/Ebook+Thumbnail+with+Video+-+2025-10-21T110010.874.png",
    bg:"#E8112D", accent:"#4CAF50",
    tags:["red","scarlett","crystal-red","hotpink","blush","green","meadow","lime-green","white","sugar","crystal-clear"],
  },

  {
    id:"foil-ladybird", type:"foil", name:"30\" Ladybird Balloon",
    desc:"Make your party bloom with this sweet ladybird balloon. Fun, colorful, and perfect for any garden or nature inspired event!",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$13.28",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6907d9b02e1a513d9a3a8793/1768008758540/Ebook+Thumbnail+with+Video+-+2025-10-21T124712.439.png?format=1500w",
    bg:"#E8112D", accent:"#1A1A1A",
    tags:["red","scarlett","crystal-red","black","white","crystal-clear","hotpink","orange","burnt-orange"],
  },

  {
    id:"foil-wings", type:"foil", name:"41\" Wings Balloon",
    desc:"Float into the celebration with a white wings foil balloon made for bachelorette party fun.",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$12.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6951c76c3f4b3e6c55dcd8b2/1767991514412/Ebook+Thumbnail+with+Video-399.png?format=1500w",
    bg:"#F8F8F8", accent:"#C0C0C0",
    tags:["white","crystal-clear","silver","fog","gray-smoke","champagne","gold","lace","lavender","blush","baby-pink"],
  },

  {
    id:"foil-pink-leopard-bride", type:"foil", name:"14\" Pink Leopard Bride Balloon",
    desc:"Bring the wild vibes to your bachelorette bash with our 14\" pink leopard print bride foil balloon! Bold, glam, and totally fierce.",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$9.03",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68e2ef53a7ac865209b90f28/1767991479563/Ebook+Thumbnail+with+Video+-+2025-05-18T172244.028.png?format=1500w",
    bg:"#E91E8C", accent:"#1A1A1A",
    tags:["hotpink","blush","baby-pink","pink","black","white","crystal-clear","metallic-fuchsia","crystal-magenta"],
  },

  {
    id:"foil-sweet-summer", type:"foil", name:"18\" Sweet Summer Balloon",
    desc:"Add a pop of fruity fun to your celebration with our 18\" tutti frutti sweet summer foil balloon.",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$7.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68e2ebbef9144c3031440514/1767991430764/Ebook+Thumbnail+with+Video+-+2025-03-02T110414.905.png?format=1500w",
    bg:"#FFD700", accent:"#E91E8C",
    tags:["yellow","lemonade","orange","coral","aloha","hotpink","blush","lime-green","green","turquoise","teal","rainbow","confetti","white","crystal-clear"],
  },

  {
    id:"foil-fruit-green-starburst", type:"foil", name:"40\" Fruit Green Starburst Balloon",
    desc:"Pop of green, pop of glam. This starburst balloon is perfect for a cute bachelorette setup.",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$7.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/16c2266a-8927-4036-a6b7-b7122365d506/Ebook+Thumbnail+with+Video+-+2025-12-30T163339.900.png",
    bg:"#4CAF50", accent:"#FFD700",
    tags:["green","lime-green","meadow","empower-mint","yellow","lemonade","teal","turquoise","white","crystal-clear"],
  },

  {
    id:"foil-pineapple", type:"foil", name:"31\" Pineapple Balloon",
    desc:"Shine bright with this 31\" pineapple foil balloon! Its shimmering finish is pure tropical magic for any luau, pool party, or bach trip.",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$11.54",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68e2e8b2f9144c303144021f/1767991369257/Ebook+Thumbnail+with+Video+-+2025-05-17T231131.222.png?format=1500w",
    bg:"#FFD700", accent:"#4CAF50",
    tags:["yellow","lemonade","goldenrod","mustard","crystal-yellow","green","lime-green","meadow","orange","aloha","white","crystal-clear"],
  },

  {
    id:"foil-red-bow", type:"foil", name:"40\" Red Bow Balloon",
    desc:"Turn up the glam with our 40\" red bow foil balloon! The perfect extra for your bride to be's big weekend, this giant foil balloon gives serious gift wrapped vibes.",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$14.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68e2e51be650b237f2cf983b/1767991346113/Ebook+Thumbnail+with+Video+-+2025-05-25T230643.948.png?format=1500w",
    bg:"#E8112D", accent:"#F8F8F8",
    tags:["red","scarlett","crystal-red","white","crystal-clear","sugar","hotpink","coral","gold","champagne"],
  },

  {
    id:"foil-polka-dot-bow", type:"foil", name:"40\" Polka Dot Bow Balloon",
    desc:"Add a pop of playful charm with our 40\" polka dot bow foil balloon! With its oversized bow shape and sweet polka dot print, use it as a photo backdrop, centerpiece, or stylish party accent that's full of flirty fun!",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$12.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d4972576809b67b84d6704/1767991290378/Ebook+Thumbnail+with+Video+-+2025-05-18T171923.294.png?format=1500w",
    bg:"#F4A7B9", accent:"#F8F8F8",
    tags:["blush","hotpink","baby-pink","pink","white","crystal-clear","sugar","lavender","champagne","cameo"],
  },
  {
    id:"foil-sunglasses", type:"foil", name:"31\" Sunglasses Balloon",
    desc:"Add bold, fun vibes to your bachelorette or bridal shower with this 31\" neon shades foil balloon, perfect for retro or summer party themes.",
    bullets:["Ships flat and uninflated","Fill with helium for floating","Hand pump or straw not included","Do not overinflate, foil balloons can pop"],
    price:"$11.02",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d59f2b4fb669549073cb77/1767990638539/Ebook+Thumbnail+with+Video+-+2025-02-24T220518.516.png?format=1500w",
    bg:"#FFD700", accent:"#E91E8C",
    tags:["yellow","lemonade","orange","hotpink","blush","lime-green","green","blue","baby-blue","purple","rainbow","white","crystal-clear"],
  },

  {
    id:"foil-martini-glass", type:"foil", name:"40\" Martini Glass Balloon",
    desc:"40\" specialty foil balloon", price:"$13.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1b00f3a8-7d21-47b7-8a9f-35e395047e57/Ebook+Thumbnail+with+Video+-+2025-05-25T232657.639.png",
    bg:"#E91E8C", accent:"#FFD700",
    tags:["hotpink","blush","baby-pink","pink","coral","taffy","gold","metallic-gold","champagne","black","gray-smoke","white","crystal-clear"],
  },

  {
    id:"foil-holo-butterfly", type:"foil", name:"30\" Butterfly Balloon",
    desc:"30\" holographic specialty foil balloon", price:"$11.54",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d1f17576809b67b84afe3d/1767990599130/Ebook+Thumbnail+with+Video+-+2025-05-17T230146.973.png?format=1500w",
    bg:"#CE93D8", accent:"#81D4FA",
    tags:["lavender","purple","plum","crystal-purple","blossom","baby-blue","monet","blush","baby-pink","hotpink","green","lime-green","meadow","empower-mint","silver","white","crystal-clear","confetti","rainbow"],
  },
  {
    id:"foil-pearl-white-dove", type:"foil", name:"34\" Pearl White Dove Balloon",
    desc:"34\" specialty foil balloon", price:"$9.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68c705f08328676059d29666/1767990464132/Ebook+Thumbnail+with+Video+-+2025-01-08T194309.437.png?format=1500w",
    bg:"#F8F8F8", accent:"#C0C0C0",
    tags:["white","crystal-clear","sugar","silver","fog","lace","champagne","blush","baby-pink","lavender"],
  },
  {
    id:"foil-usa-burst", type:"foil", name:"41\" USA Burst Balloon",
    desc:"41\" specialty foil balloon", price:"$12.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/cb2b5664-d14a-4310-89a2-4cb49335d19b/Ebook+Thumbnail+with+Video+-+2025-01-05T145634.708.png",
    bg:"#B22234", accent:"#3C3B6E",
    tags:["red","cranberry","cherry","navy","blue","royal-blue","white","crystal-clear","silver","patriotic"],
  },
  {
    id:"foil-tiki", type:"foil", name:"30\" Tiki Balloon",
    desc:"30\" specialty foil balloon", price:"$12.12",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d1f5579f62a20a3fe79fe4/1767989855779/Ebook+Thumbnail+with+Video+-+2025-02-26T185353.765.png?format=1500w",
    bg:"#2E7D32", accent:"#FF8F00",
    tags:["green","lime-green","tropical","orange","yellow","gold","brown","tan","tiki","empower-mint"],
  },
  {
    id:"foil-pink-prowl", type:"foil", name:"40\" Pink Prowl Balloon",
    desc:"40\" specialty foil balloon", price:"$14.20",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d4905976809b67b84d6283/1767989775466/Ebook+Thumbnail+with+Video+-+2025-05-13T183658.239.png?format=1500w",
    bg:"#F48FB1", accent:"#FFD700",
    tags:["hotpink","pink","baby-pink","blush","gold","leopard","glam","bachelorette"],
  },
  {
    id:"foil-watermelon", type:"foil", name:"35\" Watermelon Balloon",
    desc:"35\" specialty foil balloon", price:"$9.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d304bd9f62a20a3fe87fab/1767987100618/Ebook+Thumbnail+with+Video+-+2025-01-04T230333.934.png?format=1500w",
    bg:"#E53935", accent:"#388E3C",
    tags:["red","cherry","cranberry","green","lime-green","empower-mint","tropical","summer","white"],
  },
  {
    id:"foil-seashell", type:"foil", name:"36\" Seashell Balloon",
    desc:"36\" specialty foil balloon", price:"$17.23",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d317c7e17edb6fe4ec9e8f/1767987123950/Ebook+Thumbnail+with+Video+-+2025-06-07T164630.583.png?format=1500w",
    bg:"#FFDCC2", accent:"#A0887A",
    tags:["peach","blush","champagne","cream","tan","brown","sand","lace","white","coastal","tropical"],
  },
  {
    id:"foil-gold-ring", type:"foil", name:"30\" Gold Ring Balloon",
    desc:"30\" specialty foil balloon", price:"$12.12",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d1eb02e17edb6fe4eba069/1767987142796/Ebook+Thumbnail+with+Video+-+2025-01-06T084646.147.png?format=1500w",
    bg:"#FFF8E1", accent:"#FFD700",
    tags:["gold","champagne","cream","white","silver","glam","bachelorette","lace"],
  },
  {
    id:"foil-celebrate-bubbly-bottle", type:"foil", name:"39\" Celebrate Bubbly Bottle Balloon",
    desc:"39\" specialty foil balloon", price:"$10.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6941a776144d875d2d96d9ba/1767987163285/Ebook+Thumbnail+with+Video+-+2025-01-05T144837.496.png?format=1500w",
    bg:"#FFF8E1", accent:"#FFD700",
    tags:["gold","champagne","cream","white","silver","glam","bachelorette","celebrate"],
  },
  {
    id:"foil-heartburst", type:"foil", name:"33\" Heartburst Balloon",
    desc:"33\" specialty foil balloon", price:"$12.99",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68cc95e676809b67b84736b4/1767987184620/Ebook+Thumbnail+with+Video+-+2025-03-02T103931.656.png?format=1500w",
    bg:"#FCE4EC", accent:"#E91E8C",
    tags:["hotpink","pink","baby-pink","blush","rainbow","iridescent","silver","white","crystal-clear","confetti","bachelorette","purple","lavender","plum","blue","baby-blue","monet","yellow","gold","lemon"],
  },
  {
    id:"foil-seashell-bride-to-be", type:"foil", name:"20\" Seashell Bride To Be Balloon",
    desc:"20\" specialty foil balloon", price:"$13.36",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d1c67c9f62a20a3fe778cf/1767645485303/Ebook+Thumbnail+with+Video+-+2025-08-08T074156.666.png?format=1500w",
    bg:"#FFDCC2", accent:"#A0887A",
    tags:["peach","blush","champagne","cream","tan","sand","white","crystal-clear","coastal","bride","bachelorette","pink","baby-pink","hotpink","lace"],
  },
  {
    id:"foil-crown", type:"foil", name:"17\" Crown Balloon",
    desc:"17\" specialty foil balloon", price:"$13.36",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d1befc76809b67b84ad142/1767987354198/Ebook+Thumbnail+with+Video+-+2025-08-07T191055.png?format=1500w",
    bg:"#FFF8E1", accent:"#FFD700",
    tags:["gold","champagne","cream","white","silver","glam","bachelorette","bride"],
  },
  {
    id:"foil-poppin-bride", type:"foil", name:"36\" Poppin' Bride Balloon",
    desc:"36\" specialty foil balloon", price:"$16.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d313f576809b67b84bf71d/1767987991603/Ebook+Thumbnail+with+Video+-+2025-05-18T172228.075.png?format=1500w",
    bg:"#FCE4EC", accent:"#FFD700",
    tags:["hotpink","pink","baby-pink","blush","gold","champagne","white","glam","bachelorette","bride","green","lime-green","empower-mint"],
  },
  {
    id:"foil-neon-sugar-skull", type:"foil", name:"22\" Neon Sugar Skull Balloon",
    desc:"22\" specialty foil balloon", price:"$10.99",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d1ca609f62a20a3fe77c0d/1767988032403/Ebook+Thumbnail+with+Video+-+2025-03-02T122032.068.png?format=1500w",
    bg:"#1A1A2E", accent:"#FF00FF",
    tags:["black","neon","hotpink","pink","purple","green","lime-green","yellow","orange","red","rainbow","spooky"],
  },
  {
    id:"foil-lovely-butterfly", type:"foil", name:"34\" Lovely Butterfly Balloon",
    desc:"34\" specialty foil balloon", price:"$8.99",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68c6fa56f4bdc7234d3535c8/1767988050594/Ebook+Thumbnail+with+Video+-+2025-01-06T172741.825.png?format=1500w",
    bg:"#F8BBD0", accent:"#CE93D8",
    tags:["pink","baby-pink","blush","lavender","purple","white","crystal-clear","pastel","blossom"],
  },
  {
    id:"foil-floral-teapot", type:"foil", name:"36\" Floral Teapot Balloon",
    desc:"36\" specialty foil balloon", price:"$12.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68c5e1b21e42e418769f6929/1767988073322/Ebook+Thumbnail+with+Video+-+2025-05-26T000850.496.png?format=1500w",
    bg:"#E8F5E9", accent:"#F48FB1",
    tags:["green","lime-green","empower-mint","pink","baby-pink","blush","white","floral","blossom","pastel"],
  },
  {
    id:"foil-bumblebee", type:"foil", name:"22\" Bumblebee Balloon",
    desc:"22\" specialty foil balloon", price:"$8.99",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6824e3d4f9c801658600ce1f/1767988090801/Ebook+Thumbnail+with+Video+-+2025-05-13T183552.671.png?format=1500w",
    bg:"#FFF176", accent:"#212121",
    tags:["yellow","gold","lemon","black","white","honey","blue","baby-blue","navy","royal-blue"],
  },
  {
    id:"foil-she-said-yes-ring", type:"foil", name:"28\" She Said Yes Ring Balloon",
    desc:"28\" specialty foil balloon", price:"$13.36",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d1e6ae76809b67b84af519/1767988133712/Ebook+Thumbnail+with+Video+-+2025-05-28T110542.390.png?format=1500w",
    bg:"#FFF8E1", accent:"#FFD700",
    tags:["gold","silver","champagne","cream","white","crystal-clear","glam","bride","bachelorette","pink","baby-pink","blush","hotpink"],
  },
  {
    id:"foil-pink-strawberry", type:"foil", name:"17\" Pink Strawberry Balloon",
    desc:"17\" specialty foil balloon", price:"$12.79",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6824e03519aabf2f07a2d6a7/1767988111946/Ebook+Thumbnail+with+Video+-+2025-05-13T183626.924.png?format=1500w",
    bg:"#FCE4EC", accent:"#FFD700",
    tags:["pink","hotpink","baby-pink","blush","red","cherry","gold","white","sugar","yellow","lemon"],
  },
  {
    id:"foil-boo-la-la-ghost", type:"foil", name:"24\" Boo La La Ghost Balloon",
    desc:"24\" specialty foil balloon", price:"$10.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67edbbbcb9673100d710851b/1767988163130/Ebook+Thumbnail+with+Video+-+2025-01-04T165509.178.png?format=1500w",
    bg:"#F5F5F5", accent:"#212121",
    tags:["white","crystal-clear","black","spooky","fog","silver","lace"],
  },
  {
    id:"foil-spider-web", type:"foil", name:"33\" Spider Web Balloon",
    desc:"33\" specialty foil balloon", price:"$11.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68cc10a0466b913bd11defb1/1767988178718/Ebook+Thumbnail+with+Video+-+2025-01-05T145503.478.png?format=1500w",
    bg:"#1A1A2E", accent:"#9E9E9E",
    tags:["black","silver","white","spooky","fog","dark"],
  },
  {
    id:"foil-roller-skate", type:"foil", name:"30\" Roller Skate Balloon",
    desc:"30\" specialty foil balloon", price:"$13.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/85cebfa7-478b-4135-8c21-efacffc28560/Ebook+Thumbnail+with+Video+-+2025-05-13T183340.172.png",
    bg:"#FCE4EC", accent:"#FF4081",
    tags:["hotpink","pink","baby-pink","red","rainbow","retro","neon","white","silver"],
  },
  {
    id:"foil-long-leg-flamingo", type:"foil", name:"30\" Long Leg Flamingo Balloon",
    desc:"30\" specialty foil balloon", price:"$21.03",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67edc70ab9673100d710910f/1767988237979/Ebook+Thumbnail+with+Video+-+2025-05-13T183846.846.png?format=1500w",
    bg:"#FCE4EC", accent:"#F48FB1",
    tags:["hotpink","pink","baby-pink","blush","tropical","coral","peach","white","gold","champagne","lemon","yellow"],
  },
  {
    id:"foil-zebra", type:"foil", name:"32\" Zebra Balloon",
    desc:"32\" specialty foil balloon", price:"$14.33",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68cc9ee49f62a20a3fe3dff1/1767988256638/Ebook+Thumbnail+with+Video+-+2025-08-05T191453.675.png?format=1500w",
    bg:"#F5F5F5", accent:"#212121",
    tags:["black","white","silver","crystal-clear","zebra","wild","glam"],
  },
  {
    id:"foil-tropical-hawaiian-drink", type:"foil", name:"37\" Tropical Hawaiian Drink Balloon",
    desc:"37\" specialty foil balloon", price:"$12.99",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67edc70aacb4bf75c1c1a6f9/1767988398986/Ebook+Thumbnail+with+Video+-+2025-01-20T132521.236.png?format=1500w",
    bg:"#E0F7FA", accent:"#FF8F00",
    tags:["tropical","teal","blue","baby-blue","orange","yellow","green","lime-green","empower-mint","coral","summer"],
  },
  {
    id:"foil-catty-wild", type:"foil", name:"18\" Catty Wild Balloon",
    desc:"18\" specialty foil balloon", price:"$9.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f1b228b4-51e7-4644-92de-9e4b12cc9669/Ebook+Thumbnail+with+Video+-+2025-01-06T173415.985.png",
    bg:"#FCE4EC", accent:"#212121",
    tags:["black","white","pink","hotpink","baby-pink","leopard","wild","glam"],
  },
  {
    id:"foil-sombrero", type:"foil", name:"32\" Sombrero Balloon",
    desc:"32\" specialty foil balloon", price:"$13.04",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8ed95db9-d93c-4130-a70e-2a050dc021a6/Ebook+Thumbnail+with+Video+-+2025-01-04T223847.407.png",
    bg:"#FFF9C4", accent:"#FF6F00",
    tags:["yellow","gold","orange","red","green","lime-green","fiesta","rainbow","colorful"],
  },
  {
    id:"foil-red-kissy-lips", type:"foil", name:"27\" Red Kissy Lips Balloon",
    desc:"27\" specialty foil balloon", price:"$11.60",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67edba1ac2c3e8556bd5127d/1767988712950/Ebook+Thumbnail+with+Video+-+2025-02-24T215315.923.png?format=1500w",
    bg:"#FFEBEE", accent:"#D32F2F",
    tags:["red","cherry","cranberry","hotpink","pink","black","glam","bachelorette"],
  },
  {
    id:"foil-disco-western-hat", type:"foil", name:"33\" Disco Western Hat Balloon",
    desc:"33\" specialty foil balloon", price:"$12.02",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67edb3c322e8e62c8789f2be/1767988752833/Ebook+Thumbnail+with+Video+-+2025-01-20T132243.663.png?format=1500w",
    bg:"#F5F5F5", accent:"#FFD700",
    tags:["silver","gold","white","crystal-clear","iridescent","western","cowgirl","glam","disco","champagne"],
  },
  {
    id:"foil-bloody-mary", type:"foil", name:"37\" Bloody Mary Balloon",
    desc:"37\" specialty foil balloon", price:"$10.03",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d31da9e17edb6fe4eca4d3/1767988771795/Ebook+Thumbnail+with+Video+-+2025-03-02T115000.485.png?format=1500w",
    bg:"#FFEBEE", accent:"#B71C1C",
    tags:["red","cranberry","cherry","green","lime-green","white","black","spooky","dark"],
  },
  {
    id:"foil-iridescent-wedding-ring", type:"foil", name:"27\" Iridescent Wedding Ring Balloon",
    desc:"27\" specialty foil balloon", price:"$13.22",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/19118914-d178-4378-8358-79661e2cf37e/Ebook+Thumbnail+with+Video+-+2025-01-20T131014.569.png",
    bg:"#F3E5F5", accent:"#E0E0E0",
    tags:["iridescent","silver","white","crystal-clear","champagne","rainbow","glam","bride","bachelorette","lavender","pink","blush","hotpink","baby-pink","blue","baby-blue","monet","royal-blue","purple","plum","crystal-purple","gold"],
  },
  {
    id:"foil-polka-dot-mushroom", type:"foil", name:"33\" Polka Dot Mushroom Balloon",
    desc:"33\" specialty foil balloon", price:"$9.99",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67ed9592c2c3e8556bd4e2a1/1768087713450/Ebook+Thumbnail+with+Video+-+2025-01-20T131839.960.png?format=1500w",
    bg:"#FFEBEE", accent:"#E53935",
    tags:["red","white","cherry","cranberry","whimsy","pastel"],
  },
  {
    id:"foil-guitar", type:"foil", name:"35\" Guitar Balloon",
    desc:"35\" specialty foil balloon", price:"$11.24",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67ed901122e8e62c8789bf60/1767988865552/Ebook+Thumbnail+with+Video+-+2025-01-04T230816.813.png?format=1500w",
    bg:"#FFF8E1", accent:"#8B4513",
    tags:["brown","tan","gold","champagne","black","white","wood","western","cowgirl","red","cherry","yellow","lemon","blue","baby-blue","royal-blue","purple","plum","lavender","orange","coral"],
  },
  {
    id:"foil-toucan", type:"foil", name:"39\" Toucan Balloon",
    desc:"39\" specialty foil balloon", price:"$9.78",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67ed8eabc2c3e8556bd4d3af/1767988895809/Ebook+Thumbnail+with+Video+-+2025-02-25T095402.100.png?format=1500w",
    bg:"#1B5E20", accent:"#FF8F00",
    tags:["green","lime-green","tropical","orange","yellow","lemon","red","black","white","crystal-clear","rainbow","jungle","empower-mint","blue","baby-blue","royal-blue","pink","hotpink","baby-pink"],
  },
  {
    id:"foil-kiwi", type:"foil", name:"18\" Kiwi Balloon",
    desc:"18\" specialty foil balloon", price:"$8.25",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67ed8b17acb4bf75c1c15a4c/1767988917026/Ebook+Thumbnail+with+Video+-+2025-02-25T082709.526.png?format=1500w",
    bg:"#E8F5E9", accent:"#388E3C",
    tags:["green","lime-green","empower-mint","white","cream","tropical","summer"],
  },
  {
    id:"foil-rose", type:"foil", name:"33\" Rose Balloon",
    desc:"33\" specialty foil balloon", price:"$10.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f5841ec5-e606-4682-b694-30346cdb4455/Ebook+Thumbnail+with+Video+-+2025-01-20T131721.767.png",
    bg:"#FCE4EC", accent:"#E91E8C",
    tags:["pink","hotpink","baby-pink","blush","red","cherry","floral","blossom","bachelorette"],
  },
  {
    id:"foil-shamrock", type:"foil", name:"38\" Shamrock Balloon",
    desc:"38\" specialty foil balloon", price:"$9.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/089cf72c-d304-45f4-8aed-5aa5ed8ef68a/Ebook+Thumbnail+with+Video+-+2025-03-30T224116.002.png",
    bg:"#E8F5E9", accent:"#2E7D32",
    tags:["green","lime-green","empower-mint","iridescent","silver","white","crystal-clear","rainbow","holographic"],
  },
  {
    id:"foil-magic-mushroom", type:"foil", name:"35\" Magic Mushroom Balloon",
    desc:"35\" specialty foil balloon", price:"$8.60",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67bf1cbfbb34477609d0474a/1767653807187/Ebook+Thumbnail+with+Video+-+2025-02-24T215917.617.png?format=1500w",
    bg:"#FCE4EC", accent:"#CE93D8",
    tags:["pink","hotpink","baby-pink","blush","lavender","purple","white","whimsy","pastel"],
  },
  {
    id:"foil-tropical-parrot", type:"foil", name:"31\" Tropical Parrot Balloon",
    desc:"31\" specialty foil balloon", price:"$7.45",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/036020e5-eda7-487f-b6a9-9b1e4da2a61b/Ebook+Thumbnail+with+Video+-+2025-02-25T095425.689.png",
    bg:"#E0F7FA", accent:"#FF8F00",
    tags:["green","lime-green","tropical","orange","coral","peach","yellow","red","blue","baby-blue","royal-blue","navy","rainbow","jungle","empower-mint","white","pink","hotpink","baby-pink","blush"],
  },
  {
    id:"foil-bride-swimsuit", type:"foil", name:"30\" Bride Swimsuit Balloon",
    desc:"30\" specialty foil balloon", price:"$14.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/bdc1b06a-04a0-4477-95f4-e40713066693/Ebook+Thumbnail+with+Video+-+2025-05-28T110654.070.png",
    bg:"#FCE4EC", accent:"#FFD700",
    tags:["white","crystal-clear","gold","champagne","bride","bachelorette","blush","baby-pink","pink","hotpink"],
  },
  {
    id:"foil-coconut-pina-colada", type:"foil", name:"30\" Coconut Piña Colada Balloon",
    desc:"30\" specialty foil balloon", price:"$9.45",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f3426f48-88e6-4e53-8e94-268ff74e5c62/Ebook+Thumbnail+with+Video+-+2025-02-25T094444.750.png",
    bg:"#FFF9C4", accent:"#8BC34A",
    tags:["yellow","lemon","gold","green","lime-green","tropical","white","cream","brown","tan","summer","empower-mint"],
  },
  {
    id:"foil-iridescent-cherry", type:"foil", name:"30\" Iridescent Cherry Balloon",
    desc:"30\" specialty foil balloon", price:"$11.60",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/7e23a93a-ee27-41c8-ab18-a53c1dd717af/Ebook+Thumbnail+with+Video+-+2025-02-24T214709.688.png",
    bg:"#FFEBEE", accent:"#D32F2F",
    tags:["red","cherry","cranberry","iridescent","silver","white","crystal-clear","rainbow","pink","hotpink"],
  },
  {
    id:"foil-lime", type:"foil", name:"21\" Lime Balloon",
    desc:"21\" specialty foil balloon", price:"$9.22",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/678ec191cd961b05ac3e19d8/1767653053113/Ebook+Thumbnail+with+Video+-+2025-01-20T130525.591.png?format=1500w",
    bg:"#F1F8E9", accent:"#7CB342",
    tags:["green","lime-green","empower-mint","yellow","tropical","summer","white"],
  },
  {
    id:"foil-love-at-first-sight", type:"foil", name:"36\" Love at First Sight Balloon",
    desc:"36\" specialty foil balloon", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ea9348f6-16bd-496f-879b-6419e733b532/Ebook+Thumbnail+with+Video+-+2025-01-19T125800.252.png",
    bg:"#FCE4EC", accent:"#E91E8C",
    tags:["hotpink","pink","baby-pink","blush","blossom","peach","coral","lace","sugar","champagne","red","cherry","white","glam","bachelorette","bride"],
  },
  {
    id:"foil-penis", type:"foil", name:"40\" Penis Balloon",
    desc:"40\" specialty foil balloon", price:"$14.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/e03ebbfd-f41a-479e-af31-9bb2e5b02058/Ebook+Thumbnail+with+Video+-+2025-01-20T123831.227.png",
    bg:"#FCE4EC", accent:"#E91E8C",
    tags:["hotpink","pink","baby-pink","blush","bachelorette","glam","silver","crystal-clear","white","champagne","fog"],
  },
  {
    id:"foil-dancing-boot", type:"foil", name:"26\" Dancing Boot Balloon",
    desc:"26\" specialty foil balloon", price:"$12.60",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/9fffb470-7906-4c2a-bd3d-b90fe4994f48/Ebook+Thumbnail+with+Video+-+2025-01-20T133734.234.png",
    bg:"#FFF8E1", accent:"#8B4513",
    tags:["brown","tan","gold","champagne","white","western","cowgirl","country","hotpink","pink","baby-pink","blush","blossom","silver","crystal-clear","fog"],
  },
  {
    id:"foil-lipstick", type:"foil", name:"41\" Lipstick Balloon",
    desc:"41\" specialty foil balloon", price:"$12.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/678eced52b47a06ca051239d/1767989486147/Ebook+Thumbnail+with+Video+-+2025-01-20T132042.960.png?format=1500w",
    bg:"#FCE4EC", accent:"#FFD700",
    tags:["hotpink","pink","baby-pink","blush","red","cherry","gold","champagne","glam","bachelorette"],
  },
  {
    id:"foil-disco-ball", type:"foil", name:"15\" Disco Ball Balloon",
    desc:"15\" specialty foil balloon", price:"$9.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/7cea1e5c-b9e1-452b-90e8-008448ae0584/Ebook+Thumbnail+with+Video+-+2025-01-20T133128.129.png",
    bg:"#F5F5F5", accent:"#9E9E9E",
    tags:["silver","crystal-clear","white","iridescent","disco","glam","rainbow","holographic","champagne"],
  },
  {
    id:"foil-silver-wedding-ring", type:"foil", name:"38\" Silver Wedding Ring Balloon",
    desc:"38\" specialty foil balloon", price:"$13.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8c1a8043-1d7c-4a6e-89c0-8b82f850ef54/Ebook+Thumbnail+with+Video+-+2025-01-20T132945.093.png",
    bg:"#F5F5F5", accent:"#9E9E9E",
    tags:["silver","crystal-clear","white","champagne","glam","bride","bachelorette","iridescent","blue","baby-blue","navy","royal-blue","monet","teal"],
  },
  {
    id:"foil-iridescent-bow", type:"foil", name:"24\" Iridescent Bow Balloon",
    desc:"24\" specialty foil balloon", price:"$15.40",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/678ed838a165a16c98b239c5/1767989631041/Ebook+Thumbnail+with+Video+-+2025-01-20T130452.315.png?format=1500w",
    bg:"#F3E5F5", accent:"#E0E0E0",
    tags:["iridescent","silver","white","crystal-clear","champagne","rainbow","holographic","glam","bachelorette","lavender","pink","blush"],
  },
  {
    id:"foil-checkerboard", type:"foil", name:"17\" Checkerboard Balloon",
    desc:"17\" specialty foil balloon", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b2e4a10f-0ffb-4f3a-aa25-66ece975797f/Ebook+Thumbnail+with+Video+-+2025-01-20T132001.449.png",
    bg:"#F5F5F5", accent:"#212121",
    tags:["black","white","silver","crystal-clear","retro","glam"],
  },
  {
    id:"foil-chameleon", type:"foil", name:"39\" Chameleon Balloon",
    desc:"39\" specialty foil balloon", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/e893cf82-7cad-4196-bc21-1e84937105ce/Ebook+Thumbnail+with+Video+-+2025-01-20T131626.030.png",
    bg:"#E8F5E9", accent:"#7CB342",
    tags:["green","lime-green","empower-mint","teal","blue","baby-blue","yellow","orange","rainbow","tropical","jungle"],
  },
  {
    id:"foil-put-a-ring-on-it", type:"foil", name:"40\" Put A Ring On It Balloon",
    desc:"40\" specialty foil balloon", price:"$13.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/678edb122b47a06ca0513366/1767989721259/Ebook+Thumbnail+with+Video+-+2025-01-19T125800.252.png?format=1500w",
    bg:"#FFF8E1", accent:"#FFD700",
    tags:["gold","silver","champagne","white","crystal-clear","glam","bride","bachelorette","hotpink","pink","baby-pink","blush","blossom","coral","peach","red","cherry","cranberry"],
  },
  {
    id:"foil-diamond", type:"foil", name:"17\" Diamond Balloon",
    desc:"17\" specialty foil balloon", price:"$16.89",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/678edbf0a165a16c98b23ed0/1767935670102/Ebook+Thumbnail+with+Video+-+2025-01-20T132653.310.png?format=1500w",
    bg:"#FFF8E1", accent:"#E91E8C",
    tags:["rose-gold","gold","champagne","blush","baby-pink","pink","silver","crystal-clear","white","iridescent","glam","bride","bachelorette"],
  },
  {
    id:"foil-palm-tree", type:"foil", name:"67\" Palm Tree Balloon",
    desc:"67\" specialty foil balloon", price:"$15.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8cf0a9d0-0485-42a4-8d3a-956d7deb95a2/Ebook+Thumbnail+with+Video+-+2025-01-20T132415.234.png",
    bg:"#E8F5E9", accent:"#FF8F00",
    tags:["green","lime-green","empower-mint","tropical","brown","tan","yellow","gold","summer","beach","coastal"],
  },
  {
    id:"foil-blue-bell-bowknot", type:"foil", name:"31\" Blue Bell Bowknot Balloon",
    desc:"31\" specialty foil balloon", price:"$8.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67d71281b8f32226f0bde21e/1767935597503/Ebook+Thumbnail+with+Video+-+2025-02-24T213620.013.png?format=1500w",
    bg:"#E3F2FD", accent:"#90CAF9",
    tags:["blue","baby-blue","monet","teal","white","crystal-clear","pastel","lavender","silver"],
  },

  // ── Treat Bags ────────────────────────────────────────────────────────────────
  {
    id:"treatbag-envelope-boxes", type:"treatbag", name:"Envelope Treat Boxes",
    desc:"8 ct · 4\"l × 3\"w × 5\"h", bullets:["Set of 8","Size: 4\"l x 3\"w x 5\"h"], price:"$16.33",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ad30a4bb-2235-4d7d-bed8-25f93f5ddbce/Ebook+Thumbnail+with+Video-381.png",
    bg:"#FFF8E1", accent:"#FFD700",
    tags:["white","cream","gold","champagne","lace","bachelorette","bride","hotpink","pink","baby-pink","blush","blossom","coral","peach"],
  },
  {
    id:"treatbag-diamond", type:"treatbag", name:"Diamond Treat Bags",
    desc:"10 ct · 10\"l × 6.5\"h", bullets:["Set of 10","Size: 10\"l x 6.5\"h"], price:"$8.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/9f063251-2cfa-4fa5-a6b4-c945e8d14048/Ebook+Thumbnail+with+Video+-+2025-12-31T235300.051.png",
    bg:"#FFF9C4", accent:"#FFD700",
    tags:["yellow","gold","white","crystal-clear","champagne","glam","bachelorette","blue","baby-blue","navy","royal-blue","monet","teal","green","lime-green","empower-mint"],
  },
  {
    id:"treatbag-lunar-dragon", type:"treatbag", name:"Lunar Dragon Treat Box",
    desc:"6 ct · takeout-style w/ gold foil", bullets:["Set of 6","Takeout-style w/ gold foil"], price:"$12.24",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6824f23e19aabf2f07a2ed44/1767924305633/Ebook+Thumbnail+with+Video+-+2025-05-13T192702.718.png?format=1500w",
    bg:"#B71C1C", accent:"#FFD700",
    tags:["red","cranberry","cherry","gold","black","dark","spooky","glam"],
  },
  {
    id:"treatbag-shell", type:"treatbag", name:"Shell Treat Bags",
    desc:"8 ct · 6.5\"h × 6\"l × 3\"w", bullets:["Set of 8","Size: 6\"l x 3\"w x 6.5\"h"], price:"$26.84",
    image:"https://i.etsystatic.com/40669879/r/il/22cd03/6871762780/il_fullxfull.6871762780_fmjj.jpg",
    bg:"#E0F7FA", accent:"#F48FB1",
    tags:["teal","blue","baby-blue","monet","pink","baby-pink","blush","peach","iridescent","silver","white","coastal","tropical","mermaid"],
  },
  {
    id:"treatbag-cactus", type:"treatbag", name:"Cactus Treat Boxes",
    desc:"10 ct · 2.3\" × 2.3\"", bullets:["Set of 10","Size: 2.3\"l x 2.3\"w"], price:"$12.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f6e036d4-a9f2-4fa9-8c66-e3683052052e/Ebook+Thumbnail+with+Video+-+2025-05-13T191208.374.png",
    bg:"#E8F5E9", accent:"#FF8F00",
    tags:["green","lime-green","empower-mint","pink","baby-pink","blush","yellow","orange","pastel","western","cowgirl","boho"],
  },
  {
    id:"treatbag-fast-lane", type:"treatbag", name:"Fast Lane Treat Boxes",
    desc:"8 ct · 3.5\"l × 2.5\"w × 5\"h", bullets:["Set of 8","Size: 3.5\"l x 2.5\"w x 5\"h"], price:"$16.38",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/dfcae7f3-8390-40b8-9d93-11757814f71f/Ebook+Thumbnail+with+Video+-+2025-07-21T223405.337.png",
    bg:"#212121", accent:"#FFD700",
    tags:["black","gold","red","white","silver","dark","glam","bachelorette"],
  },
  {
    id:"treatbag-tea-time", type:"treatbag", name:"Tea Time Treat Boxes",
    desc:"24 ct · 3.5\"l × 2.4\"w × 3.9\"h", bullets:["Set of 24","Size: 3.5\"l x 2.4\"w x 3.9\"h"], price:"$38.58",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68a0fe6786322825a8be6da3/1767924184425/Ebook+Thumbnail+with+Video+-+2025-07-21T171314.458.png?format=1500w",
    bg:"#FCE4EC", accent:"#CE93D8",
    tags:["pink","baby-pink","blush","lavender","purple","white","pastel","floral","blossom","bachelorette"],
  },
  {
    id:"treatbag-black-stripes", type:"treatbag", name:"Black Stripes Treat Bags",
    desc:"16 ct · 5.25\"h × 3.25\"w × 8\"l", bullets:["Set of 16","Size: 8\"l x 3.25\"w x 5.25\"h"], price:"$16.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/550c2ad0-964a-497b-868b-88179dae489d/Ebook+Thumbnail+with+Video-403.png",
    bg:"#212121", accent:"#F5F5F5",
    tags:["black","white","silver","crystal-clear","dark","glam","bachelorette","retro"],
  },

  // ── Banners & Backdrops ───────────────────────────────────────────────────────
  {
    id:"banner-star", type:"banner", name:"Star Banner",
    desc:"6ft–10ft", price:"$55.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/94993674-2307-427c-9b81-e91e477b2c37/Ebook+Thumbnail+with+Video-405.png",
    bg:"#1A1A2E", accent:"#FFD700",
    tags:["gold","silver","white","crystal-clear","iridescent","glam","bachelorette","rainbow","holographic"],
  },
  {
    id:"banner-floral-garland", type:"banner", name:"Floral Garland",
    desc:"6ft–10ft", price:"$44.89",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3fd46307-1fc7-42cb-8845-08587f5013e4/Ebook+Thumbnail+with+Video-434.png",
    bg:"#F8BBD0", accent:"#A5D6A7",
    tags:["pink","baby-pink","blush","blossom","floral","green","lime-green","white","pastel","whimsy","bachelorette"],
  },
  {
    id:"banner-molly-paper-lanterns", type:"banner", name:"Molly Paper Lanterns",
    desc:"Varies", price:"$38.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b3ef3e6e-10ae-42c2-90f1-74697391dae0/Ebook+Thumbnail+with+Video+-+2025-12-29T210340.995.png",
    bg:"#FCE4EC", accent:"#CE93D8",
    tags:["pink","baby-pink","blush","lavender","purple","white","pastel","whimsy","bachelorette"],
  },
  {
    id:"banner-baby-pink-fringe-backdrop", type:"banner", name:"Baby Pink Foil Fringe Backdrop",
    desc:"3ft w × 7ft l", price:"$6.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/695da2a4b652cb2a3b41a5eb/1767925375980/Ebook+Thumbnail+with+Video+-+2026-01-06T110503.249.png?format=1500w",
    bg:"#FCE4EC", accent:"#F48FB1",
    tags:["baby-pink","pink","blush","blossom","lace","sugar","glam","bachelorette","bride"],
  },
  {
    id:"banner-metallic-pink-fringe-backdrop", type:"banner", name:"Metallic Pink Foil Fringe Backdrop",
    desc:"3ft w × 7ft l", price:"$6.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3032563d-005e-4659-834e-55f2fe71ad05/Ebook+Thumbnail+with+Video+-+2025-01-22T204555.167.png",
    bg:"#F8BBD0", accent:"#E91E8C",
    tags:["hotpink","pink","baby-pink","blush","iridescent","silver","glam","bachelorette","bride"],
  },

  // ── Confetti ──────────────────────────────────────────────────────────────────
  {
    id:"confetti-whimsy", type:"confetti", name:"Whimsy Confetti",
    desc:"Make it pop with our whimsy confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: pink, yellow, orange, blue, green, iridescent"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c9f67d29-b39f-4ab5-92a9-bd5ebb643dbe/Ebook+Thumbnail+with+Video+-+2025-05-12T180718.730.png",
    tubeImage:"https://i.etsystatic.com/40669879/r/il/b4605f/7123941961/il_fullxfull.7123941961_8bg4.jpg",
    bg:"#FFB5C2", accent:"#CE93D8",
    tags:["hotpink","blush","baby-pink","pink","lavender","purple","blossom","white","crystal-clear","confetti","rainbow","silver"],
  },
  {
    id:"confetti-snow-cone", type:"confetti", name:"Snow Cone Confetti",
    desc:"Make it pop with our snow cone confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Color: blue"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/033d0c7a-a10f-4350-922d-69ea5311be32/Ebook+Thumbnail+with+Video+-+2025-08-04T185123.341.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/2573be59-c8c7-4c52-873c-eb20c27e6fa3/Ebook+Thumbnail+with+Video+-+2025-08-04T185319.408.png",
    bg:"#29B6F6", accent:"#E91E8C",
    tags:["blue","baby-blue","monet","hotpink","blush","baby-pink","pink","turquoise","seafoam","white","crystal-clear","rainbow","confetti"],
  },
  {
    id:"confetti-rainbow", type:"confetti", name:"Rainbow Confetti",
    desc:"Make it pop with our rainbow confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: pink, yellow, orange, blue, green, purple, red, gold"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/fab217a5-436d-4ea9-beb7-e6c10318f92f/Ebook+Thumbnail+with+Video+-+2025-08-04T195425.251.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3f17e22c-6bbf-48c0-ad3f-2e399e13dcde/Ebook+Thumbnail+with+Video+-+2025-08-04T195349.654.png",
    bg:"#FFD700", accent:"#E91E8C",
    tags:["red","orange","yellow","green","blue","purple","hotpink","rainbow","confetti","white","crystal-clear"],
  },
  {
    id:"confetti-potion", type:"confetti", name:"Potion Confetti",
    desc:"Make it pop with our potion confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: purple and silver"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/46a4883c-bf03-4872-86f1-7efb99096811/Ebook+Thumbnail+with+Video+-+2025-05-12T180749.388.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a217a475-fead-45fd-a70a-b7a8f4b68334/Ebook+Thumbnail+with+Video+-+2025-08-02T201002.793.png",
    bg:"#9C27B0", accent:"#4CAF50",
    tags:["purple","plum","crystal-purple","lavender","green","lime-green","evergreen","orange","burnt-orange","black","white","crystal-clear"],
  },
  {
    id:"confetti-trick-or-treat", type:"confetti", name:"Trick or Treat Confetti",
    desc:"Make it pop with our trick or treat confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: green, purple, orange, pink, silver"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/213da648-e51b-456a-956a-8496f96fd76d/Ebook+Thumbnail+with+Video+-+2025-05-12T180650.943.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/87764ca9-c7ff-40ed-aa1f-3811e1322ab8/Ebook+Thumbnail+with+Video+-+2025-08-02T211247.547.png",
    bg:"#FF6B1A", accent:"#9C27B0",
    tags:["orange","burnt-orange","black","purple","plum","crystal-purple","green","lime-green","evergreen","white","crystal-clear","yellow","lemonade","hotpink","blush","baby-pink","pink"],
  },
  {
    id:"confetti-popcorn", type:"confetti", name:"Popcorn Confetti",
    desc:"Make it pop with our popcorn confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: yellow and gold"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/51eb7d88-b407-4028-83fb-f4717cbfbfaf/Ebook+Thumbnail+with+Video+-+2025-08-02T212704.395.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/10125391-5317-4beb-a0cc-9ad91664c705/Ebook+Thumbnail+with+Video+-+2025-08-02T211829.708.png",
    bg:"#FFE800", accent:"#E8112D",
    tags:["yellow","lemonade","goldenrod","mustard","crystal-yellow","red","scarlett","white","sugar","crystal-clear","champagne","gold"],
  },
  {
    id:"confetti-peace-love", type:"confetti", name:"Peace & Love Confetti",
    desc:"Make it pop with our peace & love confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: purple, pink, yellow, blue, white, gold"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/d07abd32-5f07-40a5-8dea-a0c80d1b0fc5/Ebook+Thumbnail+with+Video+-+2025-08-04T203531.863.png",
    tubeImage:"https://i.etsystatic.com/40669879/r/il/0b2d83/7081259658/il_fullxfull.7081259658_7vjl.jpg",
    bg:"#9C27B0", accent:"#FFD700",
    tags:["purple","plum","lavender","blossom","hotpink","blush","baby-pink","pink","yellow","lemonade","goldenrod","blue","baby-blue","monet","white","crystal-clear","sugar","gold","metallic-gold","champagne"],
  },
  {
    id:"confetti-patriotic", type:"confetti", name:"Patriotic Confetti",
    desc:"Make it pop with our patriotic confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: blue, red, and silver"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/049647dd-febe-4a0a-9d2c-3e286102cd4e/Ebook+Thumbnail+with+Video+-+2025-08-04T201549.622.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/558aa9bb-95de-46b7-b9d9-f61e3ad776c2/Ebook+Thumbnail+with+Video+-+2025-08-04T201240.930.png",
    bg:"#E8112D", accent:"#0052A5",
    tags:["red","scarlett","blue","royalty","navy","crystal-sapphire","white","crystal-clear","silver","naval"],
  },
  {
    id:"confetti-neon", type:"confetti", name:"Neon Confetti",
    desc:"Make it pop with our neon confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","¾\" squares","Colors: orange, pink, yellow, green"],
    price:"$9.99",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/689e97de86322825a8bce922/1767924972649/Ebook+Thumbnail+with+Video+-+2025-05-12T180621.466.png?format=1500w",
    bg:"#E91E8C", accent:"#FFE800",
    tags:["hotpink","neon-pink","green","lime-green","yellow","lemonade","orange","coral","blue","baby-blue","purple","lavender","white","crystal-clear","rainbow","confetti"],
  },
  {
    id:"confetti-maple-syrup", type:"confetti", name:"Maple Syrup Confetti",
    desc:"Make it pop with our maple syrup confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: brown and bronze"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/60422e9d-fb29-4636-8e42-b88db4ed9143/Ebook+Thumbnail+with+Video+-+2025-05-12T180824.202.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5cabb493-0c20-4897-b5d0-11d83040af1b/Ebook+Thumbnail+with+Video+-+2025-08-02T195000.435.png",
    bg:"#C4956A", accent:"#FFD700",
    tags:["terracotta","muse","malted","earth","cocoa","stone","burnt-orange","champagne","lace","fog","white","sugar","crystal-clear","gold","metallic-gold","mustard"],
  },
  {
    id:"confetti-lovestruck", type:"confetti", name:"Lovestruck Confetti",
    desc:"Make it pop with our lovestruck confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: pink, red, ivory, gold"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3a7da4e6-60c9-410f-bbd0-8f266ee6db17/Ebook+Thumbnail+with+Video+-+2025-08-02T213331.993.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/7c5d670b-6544-469a-a65b-1ee88cf976c8/Ebook+Thumbnail+with+Video+-+2025-08-02T213345.951.png",
    bg:"#E8112D", accent:"#E91E8C",
    tags:["red","scarlett","hotpink","blush","baby-pink","pink","crystal-red","coral","taffy","white","sugar","crystal-clear","gold","champagne"],
  },
  {
    id:"confetti-ice-cream", type:"confetti", name:"Ice Cream Confetti",
    desc:"Make it pop with our ice cream confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: blue, yellow, pink, and gold"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f269d887-c136-4fe6-975a-2f44c0a6fe3e/Ebook+Thumbnail+with+Video+-+2025-05-11T155651.923.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/de8f8c36-22b9-4138-8fb6-0bdfc6cf7556/Ebook+Thumbnail+with+Video+-+2025-08-02T183908.196.png",
    bg:"#FFB5C2", accent:"#29B6F6",
    tags:["hotpink","blush","baby-pink","pink","blue","baby-blue","monet","yellow","lemonade","mint","seafoam","white","sugar","crystal-clear","rainbow","confetti"],
  },
  {
    id:"confetti-happy", type:"confetti", name:"Happy Confetti",
    desc:"Make it pop with our happy confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: pink, yellow, green, blue, and gold"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0ea4afb3-a59f-4a55-8d19-9bf778012c0f/Ebook+Thumbnail+with+Video+-+2025-05-12T180924.103.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/12481952-df60-4297-b2e5-597ea5c15ee4/Ebook+Thumbnail+with+Video+-+2025-08-02T194436.295.png",
    bg:"#FFD700", accent:"#E91E8C",
    tags:["yellow","lemonade","goldenrod","hotpink","blush","orange","coral","lime-green","green","blue","baby-blue","purple","lavender","white","crystal-clear","rainbow","confetti","gold","champagne"],
  },
  {
    id:"confetti-grape-soda", type:"confetti", name:"Grape Soda Confetti",
    desc:"Make it pop with our grape soda confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Color: purple"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ca29f64a-f558-474a-82dd-edf1239d0720/Ebook+Thumbnail+with+Video+-+2025-05-11T165034.038.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/d4a8763e-783f-463e-98ab-ab0a9fce091c/Ebook+Thumbnail+with+Video+-+2025-08-02T193542.851.png",
    bg:"#9C27B0", accent:"#CE93D8",
    tags:["purple","plum","crystal-purple","lavender","blossom","peri","navy","metallic-midnight-blue","white","crystal-clear","silver","fog"],
  },
  {
    id:"confetti-evergreen", type:"confetti", name:"Evergreen Confetti",
    desc:"Make it pop with our evergreen confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: evergreen and gold"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/fead4cf1-fbcb-4f06-ba3b-0f169847de20/Ebook+Thumbnail+with+Video+-+2025-08-04T190158.014.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/152b7569-d249-409c-88b5-f42fde174d8b/Ebook+Thumbnail+with+Video+-+2025-08-04T190114.634.png",
    bg:"#2E7D32", accent:"#FFD700",
    tags:["green","evergreen","meadow","lime-green","metallic-forest-green","teal","seafoam","white","crystal-clear","gold","champagne","earth"],
  },
  {
    id:"confetti-dream", type:"confetti", name:"Dream Confetti",
    desc:"Make it pop with our dream confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: blush, ivory, white, iridescent"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f442dbe8-a458-405b-a468-35ec8d6171e1/Ebook+Thumbnail+with+Video+-+2025-05-11T164809.368.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f7f1860e-a0aa-4785-850d-51775700f267/Ebook+Thumbnail+with+Video+-+2025-08-02T185303.213.png",
    bg:"#CE93D8", accent:"#81D4FA",
    tags:["lavender","purple","blossom","baby-blue","monet","blush","baby-pink","hotpink","white","crystal-clear","silver","confetti","rainbow"],
  },
  {
    id:"confetti-creamsicle", type:"confetti", name:"Creamsicle Confetti",
    desc:"Make it pop with our creamsicle confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Color: orange"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f059de43-e228-4af1-a773-562b96b897fb/Ebook+Thumbnail+with+Video+-+2025-08-02T214408.601.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ab6a62d9-3f0f-4de0-8d0f-237eb9148fc8/Ebook+Thumbnail+with+Video+-+2025-08-02T214418.120.png",
    bg:"#FF6B1A", accent:"#FFF3E0",
    tags:["orange","burnt-orange","aloha","coral","taffy","champagne","lace","white","sugar","crystal-clear","yellow","lemonade","peach"],
  },
  {
    id:"confetti-cotton-candy", type:"confetti", name:"Cotton Candy Confetti",
    desc:"Make it pop with our cotton candy confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: pink, white, blue, iridescent"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/76b1696f-5574-45f6-a0da-3a8a071df420/Ebook+Thumbnail+with+Video+-+2025-08-02T221140.087.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/bed4be18-4fd7-45c0-a9b2-0fc0ca6f6a2b/Ebook+Thumbnail+with+Video+-+2025-08-02T220922.973.png",
    bg:"#FFB5C2", accent:"#81D4FA",
    tags:["hotpink","blush","baby-pink","pink","baby-blue","monet","lavender","blossom","white","sugar","crystal-clear","confetti","rainbow"],
  },
  {
    id:"confetti-cherries", type:"confetti", name:"Cherries Confetti",
    desc:"Make it pop with our cherries confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Color: red"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/934d86db-b566-407a-bd36-4ba90ca225ad/Ebook+Thumbnail+with+Video+-+2025-08-02T221944.808.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/e23bd9e0-e245-4fae-84cc-cdc9f1f39f61/Ebook+Thumbnail+with+Video+-+2025-08-02T221920.145.png",
    bg:"#E8112D", accent:"#4CAF50",
    tags:["red","scarlett","crystal-red","hotpink","blush","green","meadow","lime-green","white","sugar","crystal-clear"],
  },
  {
    id:"confetti-candy-cane", type:"confetti", name:"Candy Cane Confetti",
    desc:"Make it pop with our candy cane confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: red, pink, and gold"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8511817a-2ee0-40cf-97b9-90336b933d8c/Ebook+Thumbnail+with+Video+-+2025-05-11T164358.955.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/46a80d9f-a3fb-4011-891e-bea3c9122afe/Ebook+Thumbnail+with+Video+-+2025-07-21T230307.536.png",
    bg:"#E8112D", accent:"#F8F8F8",
    tags:["red","scarlett","crystal-red","white","sugar","crystal-clear","hotpink","blush","baby-pink","silver","fog"],
  },
  {
    id:"confetti-butterfly", type:"confetti", name:"Butterfly Confetti",
    desc:"Make it pop with our butterfly confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: pink, purple, orange, blue, iridescent"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a84d2df4-6a74-4e87-bef5-a1f517477f41/Ebook+Thumbnail+with+Video+-+2025-08-04T191714.525.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/61f94cc8-1057-4a49-975f-98a8c52291b1/Ebook+Thumbnail+with+Video+-+2025-08-04T191434.917.png",
    bg:"#CE93D8", accent:"#81D4FA",
    tags:["lavender","purple","blossom","baby-blue","monet","blush","baby-pink","hotpink","mint","seafoam","white","crystal-clear","confetti","rainbow","silver"],
  },
  {
    id:"confetti-bubblegum", type:"confetti", name:"Bumblegum Confetti",
    desc:"Make it pop with our bubblegum confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Color: pink"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a3bd21ee-b06b-4756-b915-c77a1e6f599a/Ebook+Thumbnail+with+Video+-+2025-08-04T193308.492.png",
    bg:"#E91E8C", accent:"#FFB5C2",
    tags:["hotpink","blush","baby-pink","pink","coral","taffy","white","sugar","crystal-clear","champagne","metallic-fuchsia","crystal-magenta"],
  },
  {
    id:"confetti-boo", type:"confetti", name:"Boo Confetti",
    desc:"Make it pop with our boo confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Colors: pink, orange, iridescent"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/2d422ab5-9113-4518-9140-0940e25203fc/Ebook+Thumbnail+with+Video+-+2025-08-04T192703.881.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/edd93d8c-409d-4684-bef6-22b75cd724e9/Ebook+Thumbnail+with+Video+-+2025-08-04T192626.074.png",
    bg:"#1A1A1A", accent:"#FF6B1A",
    tags:["black","orange","burnt-orange","purple","plum","crystal-purple","white","crystal-clear","gray-smoke","green","lime-green"],
  },
  {
    id:"confetti-licorice", type:"confetti", name:"Licorice Confetti",
    desc:"Make it pop with our licorice confetti! Hand pressed; adds instant party fun.",
    bullets:["Mini Bag: ¼oz","Tube: 1oz","0.5\" diameter circles","Color: black"],
    price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1ccf1516-8501-4fcf-8764-924c0c815aa0/Ebook+Thumbnail+with+Video+-+2025-12-29T195018.786.png",
    tubeImage:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0ce5b8fb-0092-4b33-8020-897411217ff0/Ebook+Thumbnail+with+Video+-+2025-12-29T195100.211.png",
    bg:"#1A1A1A", accent:"#E8112D",
    tags:["black","red","scarlett","orange","burnt-orange","purple","plum","gray-smoke","white"],
  },
];

function matchTableware(selectedColorIds) {
  if (!selectedColorIds.length) return [];
  // Score each tableware item: +1 per matching tag
  const scored = TABLEWARE.map(item => ({
    ...item,
    score: item.tags.filter(t => selectedColorIds.includes(t)).length,
  }));
  const plates   = scored.filter(i=>i.type==="plate"   ).sort((a,b)=>b.score-a.score).slice(0,2);
  const cups     = scored.filter(i=>i.type==="cup"     ).sort((a,b)=>b.score-a.score).slice(0,2);
  const napkins  = scored.filter(i=>i.type==="napkin"  ).sort((a,b)=>b.score-a.score).slice(0,2);
  const confetti = scored.filter(i=>i.type==="confetti").sort((a,b)=>b.score-a.score).slice(0,2);
  return [...plates, ...cups, ...napkins, ...confetti].filter(i=>i.score>0 || selectedColorIds.length>=1);
}

// CSS plate/cup visual (used when image is null)
function proxyImg(url) {
  if (!url) return null;
  if (url.includes("images.weserv.nl")) return url; // already proxied
  if (url.includes("squarespace-cdn.com") || url.includes("squarespace.com/static")) {
    const stripped = url.replace(/^https?:\/\//, "").split("?")[0];
    return `https://images.weserv.nl/?url=${encodeURIComponent(stripped)}&w=600&output=webp&q=85`;
  }
  return url;
}

function TablewearVisual({ item }) {
  if (item.image) {
    return (
      <img
        src={proxyImg(item.image)} alt={item.name}
        style={{width:"100%",height:"100%",objectFit:"contain",display:"block",background:"#fff",padding:"6px",boxSizing:"border-box"}}
        onError={e=>{e.target.style.display="none";}}
      />
    );
  }
  if (item.type === "plate") {
    const isCow = item.id.includes("cow");
    return (
      <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff"}}>
        <div style={{
          width:64,height:64,borderRadius:"50%",
          background:item.bg,
          border:`3px solid ${item.accent}44`,
          boxShadow:`0 2px 12px rgba(0,0,0,0.12),inset 0 0 0 8px rgba(255,255,255,0.25)`,
          position:"relative",overflow:"hidden",
          display:"flex",alignItems:"center",justifyContent:"center",
        }}>
          {isCow && (
            <>
              <div style={{position:"absolute",top:"18%",left:"22%",width:10,height:13,borderRadius:"40%",background:"#1a1a1a",opacity:0.7}}/>
              <div style={{position:"absolute",top:"50%",left:"55%",width:12,height:10,borderRadius:"40%",background:"#1a1a1a",opacity:0.7}}/>
              <div style={{position:"absolute",top:"65%",left:"20%",width:8,height:11,borderRadius:"40%",background:"#1a1a1a",opacity:0.7}}/>
            </>
          )}
          <div style={{width:48,height:48,borderRadius:"50%",border:`2px solid ${item.accent}33`,position:"absolute"}}/>
        </div>
      </div>
    );
  }
  // Cup visual
  return (
    <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#fdf5f8"}}>
      <div style={{position:"relative",width:44,height:58}}>
        {/* Cup body */}
        <div style={{
          position:"absolute",bottom:0,left:0,right:0,height:52,
          background:item.bg,
          borderRadius:"4px 4px 10px 10px",
          clipPath:"polygon(8% 0%,92% 0%,100% 100%,0% 100%)",
          boxShadow:`0 2px 10px rgba(0,0,0,0.15)`,
          border:`1.5px solid ${item.accent}55`,
        }}/>
        {/* Rim */}
        <div style={{
          position:"absolute",top:0,left:-2,right:-2,height:8,
          background:item.accent,borderRadius:4,opacity:0.6,
        }}/>
        {/* Shine */}
        <div style={{
          position:"absolute",bottom:6,left:"18%",width:6,height:28,
          background:"rgba(255,255,255,0.35)",borderRadius:4,
          transform:"rotate(-5deg)",
        }}/>
      </div>
    </div>
  );
}

function TablewearRecommendations({ selectedColors, cart, setCart }) {
  const matches = matchTableware(selectedColors);
  if (!matches.length || !selectedColors.length) return null;

  const plates   = matches.filter(i=>i.type==="plate");
  const cups     = matches.filter(i=>i.type==="cup");
  const napkins  = matches.filter(i=>i.type==="napkin");
  const confetti = matches.filter(i=>i.type==="confetti");

  const inCart = id => cart.some(c=>c.id===id);
  const addToCart = item => {
    if (inCart(item.id)) return;
    setCart(prev=>[...prev,{ id:item.id, name:item.name, price:parseFloat(item.price.replace("$","")), image:null, category:"tableware" }]);
  };

  const ItemCard = ({ item }) => (
    <div style={{ background:WHITE, border:`1.5px solid ${inCart(item.id)?HOT:BORDER}`, borderRadius:14, overflow:"hidden", transition:"all 0.2s" }}>
      <div style={{position:"relative",width:"100%",aspectRatio:"1/1",overflow:"hidden"}}>
        <TablewearVisual item={item}/>
      </div>
      <div style={{padding:"8px 10px"}}>
        <div style={{fontSize:11,fontWeight:700,color:DARK,fontFamily:"'Nunito',sans-serif",lineHeight:1.3}}>{item.name}</div>
        <div style={{fontSize:10,color:"#aaa",fontFamily:"'Nunito',sans-serif",marginTop:1}}>{item.desc}</div>
        <div style={{marginTop:6}}>
          <div style={{fontSize:13,fontWeight:900,color:PUNCH,fontFamily:"'Nunito',sans-serif",marginBottom:6}}>{item.price}</div>
          <button onClick={()=>addToCart(item)} style={{
            background:inCart(item.id)?SOFT:`#f496c3`,
            color:inCart(item.id)?HOT:WHITE,
            border:inCart(item.id)?`1.5px solid ${HOT}`:"none",
            borderRadius:20,padding:"6px 0",width:"100%",
            fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:700,cursor:"pointer",
          }}>
            {inCart(item.id)?"✓ Added":"+ Add"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{marginTop:20,paddingTop:18,borderTop:`1.5px solid ${SOFT}`}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <div style={{fontSize:16}}>🍽️</div>
        <div>
          <div style={{fontSize:13,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>Matching Tableware</div>
          <div style={{fontSize:11,color:HOT,fontFamily:"'Nunito',sans-serif",opacity:0.85}}>Coordinated with your garland — add to your package</div>
        </div>
      </div>

      {plates.length > 0 && (
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,color:"#aaa",fontFamily:"'Nunito',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Plates</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {plates.map(item=><ItemCard key={item.id} item={item}/>)}
          </div>
        </div>
      )}

      {cups.length > 0 && (
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,color:"#aaa",fontFamily:"'Nunito',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Cups</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {cups.map(item=><ItemCard key={item.id} item={item}/>)}
          </div>
        </div>
      )}

      {napkins.length > 0 && (
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,color:"#aaa",fontFamily:"'Nunito',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Napkins</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {napkins.map(item=><ItemCard key={item.id} item={item}/>)}
          </div>
        </div>
      )}

      {confetti.length > 0 && (
        <div style={{marginBottom:4}}>
          <div style={{fontSize:10,fontWeight:700,color:"#aaa",fontFamily:"'Nunito',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Confetti</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {confetti.map(item=><ItemCard key={item.id} item={item}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

function GarlandBuilder({ cart, setCart, setTab, selected, setSelected }) {
  const [arrangement, setArrangement] = useState("mixed");

  const maxColors = 5;

  const toggleColor = id => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(c=>c!==id);
      if (prev.length >= maxColors) return [...prev.slice(1), id]; // rotate out oldest
      return [...prev, id];
    });
  };

  const price = "$75";

  return (
    <div style={{marginTop:8,paddingTop:24,borderTop:`2px solid ${MID}`}}>
      {/* Section header */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <div style={{flex:1,height:1.5,background:MID,borderRadius:2}}/>
        <div style={{fontSize:11,fontWeight:700,color:HOT,fontFamily:"'Nunito',sans-serif",letterSpacing:"1.5px",textTransform:"uppercase",whiteSpace:"nowrap"}}>Custom Balloon Garland</div>
        <div style={{flex:1,height:1.5,background:MID,borderRadius:2}}/>
      </div>

      {/* Live preview */}
      <GarlandPreview selectedColors={selected} arrangement={arrangement}/>

      {/* Selected color pills */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10,marginBottom:14,minHeight:28}}>
        {selected.length === 0
          ? null
          : selected.map(id=>{
              const col = BALLOON_COLORS.find(c=>c.id===id);
              return (
                <div key={id} onClick={()=>toggleColor(id)} style={{
                  display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:20,
                  background:SOFT,border:`1.5px solid ${col.color==="F8F8F8"?BORDER:col.color}`,
                  cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:600,color:DARK,
                }}>
                  <span style={{width:12,height:12,borderRadius:"50%",background:col.color,display:"inline-block",border:"1px solid rgba(0,0,0,0.12)",flexShrink:0}}/>
                  {col.label} ×
                </div>
              );
            })
        }
      </div>



      {/* Color palette grid */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:HOT,fontFamily:"'Nunito',sans-serif",textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:10}}>
          Pick Up to 5 Colors
          <span style={{marginLeft:8,fontWeight:400,color:"#bbb",textTransform:"none",letterSpacing:0}}>{selected.length}/{maxColors} selected</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
          {BALLOON_COLORS.filter(c => arrangement==="colorblock" ? !c.pattern : true).map(c=>{
            const isSel = selected.includes(c.id);
            return (
              <div key={c.id} onClick={()=>toggleColor(c.id)} style={{
                display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",
              }}>
                <div style={{
                  width:44,height:44,borderRadius:"50%",
                  background:c.pattern?`radial-gradient(circle at 33% 30%,rgba(255,255,255,0.5),${c.color})`:`radial-gradient(circle at 33% 30%,rgba(255,255,255,0.45),${c.color})`,
                  border:isSel?`3px solid ${HOT}`:`2px solid ${c.color==="F8F8F8"?"#ddd":c.color}88`,
                  boxShadow:isSel?`0 0 0 2px white,0 0 0 4px ${HOT}`:
                    `2px 3px 8px rgba(0,0,0,0.18),inset -1px -2px 4px rgba(0,0,0,0.1)`,
                  position:"relative",overflow:"hidden",transition:"all 0.15s",
                  transform:isSel?"scale(1.1)":"scale(1)",
                }}>
                  {c.pattern && <PatternDots pattern={c.pattern} size={44}/>}
                  {isSel && (
                    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(233,30,140,0.18)"}}>
                      <span style={{fontSize:14,color:HOT,fontWeight:900}}>✓</span>
                    </div>
                  )}
                </div>
                <div style={{fontSize:9,color:isSel?HOT:"#bbb",fontFamily:"'Nunito',sans-serif",fontWeight:isSel?700:400,textAlign:"center",lineHeight:1.2}}>
                  {c.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kit contents */}
      <div style={{marginBottom:14,padding:"14px 16px",borderRadius:14,background:"#fff",border:`1.5px solid ${BORDER}`}}>
        <div style={{fontSize:14,fontWeight:400,color:DARK,fontFamily:"'Playfair Display',Georgia,serif",marginBottom:10}}>
          What's Included: 130 Balloons
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[
            { size:'24"', count:5,  label:"Statement",  note:"Large focal balloons" },
            { size:'18"', count:15, label:"Accent",      note:"Midsize highlights"  },
            { size:'11"', count:80, label:"Base",        note:"Core of the garland"  },
            { size:'5"',  count:40, label:"Fillers",     note:"Gap filling clusters" },
          ].map(b => (
            <div key={b.size} style={{padding:"10px 12px",borderRadius:10,background:WHITE,border:`1px solid ${MID}`}}>
              <div style={{fontSize:13,fontWeight:400,color:DARK,fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1}}>{b.count} balloons: {b.size}</div>
              <div style={{fontSize:10,color:HOT,fontFamily:"'Nunito',sans-serif",fontWeight:600,marginTop:2}}>{b.label}</div>
              <div style={{fontSize:9,fontWeight:300,color:DARK,fontFamily:"'Nunito',sans-serif",marginTop:1}}>{b.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add garland to cart */}
      {selected.length > 0 && (
        <button onClick={()=>{
          const garlandId = `garland-${arrangement}`;
          if (!cart.some(c=>c.id===garlandId)) {
            setCart(prev=>[...prev,{
              id: garlandId,
              name: `Custom Balloon Garland, ${arrangement==="mixed"?"Mixed":"Color Block"}`,
              price: parseFloat(price.replace("$","")),
              image: null,
              category: "garland",
              colors: selected,
            }]);
          }
        }} style={{
          ...BP, width:"100%", padding:"14px", fontSize:14,
          ...(cart.some(c=>c.id===`garland-${arrangement}`) ? {
            background: SOFT, color: HOT, border: `1.5px solid ${HOT}`,
          } : {}),
        }}>
          {cart.some(c=>c.id===`garland-${arrangement}`) ? "✓ Garland Added to Package" : "Add Garland to My Package"}
        </button>
      )}
      <div style={{height:20}}/>

    </div>
  );
}

// ─── Reusable Carousel ────────────────────────────────────────────────────────
function Carousel({ items, renderItem }) {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const total   = Math.ceil(items.length / perPage);
  const slice   = items.slice(page * perPage, (page + 1) * perPage);
  const ArrowBtn = ({ dir, disabled, onClick }) => (
    <button onClick={onClick} disabled={disabled} style={{
      width:30,height:30,borderRadius:"50%",flexShrink:0,
      border:`1.5px solid ${disabled?BORDER:HOT}`,
      background:disabled?WHITE:SOFT,
      color:disabled?"#ccc":HOT,
      fontSize:18,fontWeight:700,cursor:disabled?"default":"pointer",
      display:"flex",alignItems:"center",justifyContent:"center",
      transition:"all 0.15s",lineHeight:1,
    }}>{dir}</button>
  );
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <ArrowBtn dir="‹" disabled={page===0} onClick={()=>setPage(p=>p-1)}/>
        <div style={{flex:1,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {slice.map((item,i) => renderItem(item, page*perPage+i))}
        </div>
        <ArrowBtn dir="›" disabled={page===total-1} onClick={()=>setPage(p=>p+1)}/>
      </div>
      {total > 1 && (
        <div style={{display:"flex",justifyContent:"center",gap:5,marginTop:10}}>
          {Array.from({length:total}).map((_,i)=>(
            <div key={i} onClick={()=>setPage(i)} style={{
              width:i===page?16:6,height:6,borderRadius:3,cursor:"pointer",
              background:i===page?HOT:BORDER,transition:"all 0.2s",
            }}/>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Product Step ─────────────────────────────────────────────────────────────
function ProductStep({ stepNum, emoji, title, subtitle, type, selectedColors, cart, setCart }) {
  const mobile = useIsMobile();
  const items = TABLEWARE.filter(i => i.type === type);
  const scored = items.map(item => ({
    ...item,
    score: item.tags.filter(t => selectedColors.includes(t)).length,
  })).sort((a,b) => b.score - a.score);

  const [quantities, setQuantities] = useState({});
  const getQty = id => quantities[id] || 1;
  const adjQty = (id, val) => setQuantities(prev => ({ ...prev, [id]: Math.max(1, val) }));

  const inCart = id => cart.some(c => c.id === id);
  const toggle = (item) => {
    const qty = getQty(item.id);
    if (inCart(item.id)) {
      setCart(prev => prev.filter(c => c.id !== item.id));
    } else {
      setCart(prev => [...prev, {
        id: item.id, name: item.name,
        price: parseFloat(item.price.replace("$","")) * qty,
        qty, image: item.image, category: "tableware",
      }]);
    }
  };

  const getCountSize = (item) => {
    if (item.bullets?.length >= 2) {
      const b1 = item.bullets[1]
        .replace(/^Dimensions:/i, "Size:")
        .replace(/^Capacity:\s*(\S+)/i, "$1 capacity");
      return `${item.bullets[0]} · ${b1}`;
    }
    if (item.bullets?.length === 1) return item.bullets[0];
    if (item.desc) return item.desc;
    return null;
  };

  const renderProductItem = (item) => {
    const added = inCart(item.id);
    const qty = getQty(item.id);
    const shadow = added
      ? `0 0 0 2px ${HOT}, 0 4px 16px rgba(233,30,140,0.15)`
      : "0 4px 16px rgba(0,0,0,0.09)";
    return (
      <div key={item.id} style={{background:WHITE,borderRadius:"0 0 18px 18px",boxShadow:shadow,transition:"all 0.2s",display:"flex",flexDirection:"column",position:"relative"}}>
        <div style={{position:"relative",width:"100%",aspectRatio:"1/1",overflow:"hidden",flexShrink:0,background:"#fff"}}>
          <TablewearVisual item={item}/>
        </div>
        <div style={{padding:"7px 8px 8px",flex:1,display:"flex",flexDirection:"column"}}>
          <div style={{fontSize:11,fontWeight:400,color:"#f496c3",fontFamily:"'Acme',sans-serif",lineHeight:1.3,marginBottom:2}}>{item.name}</div>
          {item.bullets?.length >= 1 && (
            <div style={{fontSize:8,fontWeight:300,color:DARK,fontFamily:"'Nunito',sans-serif",lineHeight:1.6,marginBottom:4}}>
              {mobile ? (
                <>
                  <div>{item.bullets[0]}</div>
                  {item.bullets[1] && <div>{item.bullets[1].replace(/^Dimensions:/i,"Size:")}</div>}
                </>
              ) : (
                <div>{item.bullets[0]}{item.bullets[1] ? ` · ${item.bullets[1].replace(/^Dimensions:/i,"Size:")}` : ""}</div>
              )}
            </div>
          )}
          <div style={{fontSize:11,fontWeight:300,color:DARK,fontFamily:"'Nunito',sans-serif",marginBottom:5}}>{item.price}</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:5}}>
            <button onClick={()=>adjQty(item.id, qty-1)} style={{width:20,height:20,borderRadius:"50%",border:`1.5px solid ${BORDER}`,background:"none",fontSize:13,color:HOT,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1}}>−</button>
            <span style={{fontSize:11,fontWeight:300,color:DARK,fontFamily:"'Nunito',sans-serif",minWidth:14,textAlign:"center"}}>{qty}</span>
            <button onClick={()=>adjQty(item.id, qty+1)} style={{width:20,height:20,borderRadius:"50%",border:`1.5px solid ${BORDER}`,background:"none",fontSize:13,color:HOT,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1}}>+</button>
          </div>
          <button onClick={()=>toggle(item)} style={{
            background:added?SOFT:`#f496c3`,
            color:added?HOT:WHITE,
            border:added?`1.5px solid ${HOT}`:"none",
            borderRadius:20, padding:"5px 0", width:"100%",
            fontFamily:"'Nunito',sans-serif", fontSize:9, fontWeight:700, cursor:"pointer",
          }}>{added ? "✓ Added" : "+ Add"}</button>
        </div>
      </div>
    );
  };

  return (
    <div style={{marginBottom:28}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,paddingTop:20,borderTop:`2px solid ${MID}`}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:`#f496c3`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:WHITE,flexShrink:0}}>{stepNum}</div>
        <div>
          <div style={{fontSize:14,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{title}</div>
        </div>
      </div>
      {selectedColors.length === 0 ? (
        <div style={{textAlign:"center",padding:"24px 16px",background:SOFT,borderRadius:16}}>
          <div style={{fontSize:13,fontWeight:700,color:HOT,fontFamily:"'Nunito',sans-serif",marginBottom:4}}>Customize your garland first</div>
          <div style={{fontSize:11,color:"#888",fontFamily:"'Nunito',sans-serif",lineHeight:1.5}}>Pick your balloon colors in Step 1 and we'll show you only the products that match.</div>
        </div>
      ) : (
        <Carousel items={scored.filter(i => i.score >= 1)} renderItem={renderProductItem} />
      )}
    </div>
  );
}

// ─── Confetti Step (with size selector) ──────────────────────────────────────
// ─── Party Accessories Step ───────────────────────────────────────────────────
export const PARTY_ACCESSORIES = [
  {
    id:"acc-kick-the-dick",
    type:"accessory",
    name:"Kick The Dick Party Game",
    price:"$11.25",
    desc:"Say hello to your new favorite party stress reliever! Blow it up, line it up, and let the kicks fly. Bride's orders.",
    bullets:["Set of 1","Dimensions: 5.5ft"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a579aa76-6511-4fd7-b15b-be8f4471f706/Ebook+Thumbnail+with+Video+-+2025-08-07T212529.590.png?format=500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/kick-the-dick-party-game",
  },
  {
    id:"acc-drink-chaps",
    type:"accessory",
    name:"Drink Chaps Drink Markers",
    price:"$16.00",
    desc:"Giddy up! These fun and flirty drink tags keep everyone's cocktails in check; no mix ups, just laughs!",
    bullets:["Set of 4","Dimensions: 1.5\"l x 2.5\"w"],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3643129d-50f4-4b44-8a99-5037ffb85c59/Ebook+Thumbnail+with+Video+-+2025-06-02T195713.079.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b782242b-dc11-411b-9eea-a3fdd22c0e9e/Ebook+Thumbnail+with+Video+-+2025-06-02T195703.327.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/e45f3ad5-3267-442e-87f4-ff895308b0ad/Ebook+Thumbnail+with+Video+-+2025-06-02T201205.705.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3643129d-50f4-4b44-8a99-5037ffb85c59/Ebook+Thumbnail+with+Video+-+2025-06-02T195713.079.png?format=500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/drink-chaps-drink-markers",
  },
  {
    id:"acc-blow-job-bib",
    type:"accessory",
    name:"Blow Job Bib",
    price:"$11.25",
    desc:"Keep your couture cute and your humor dirty! The blow job bib is the ultimate gag gift for brides to be who aren't afraid to have a little fun. Clean shirt, dirty mind. What's not to love?",
    bullets:["Set of 1"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1140cd81-b965-4690-8636-dabe64e54dec/Ebook+Thumbnail+with+Video+-+2025-06-24T154950.567.png?format=500w",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1140cd81-b965-4690-8636-dabe64e54dec/Ebook+Thumbnail+with+Video+-+2025-06-24T154950.567.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/bdd51687-2535-46f1-9bce-8e185f698569/Ebook+Thumbnail+with+Video+-+2025-06-24T155029.434.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/820d4ce2-0ddd-441c-84eb-7aa8f60099e7/Ebook+Thumbnail+with+Video+-+2025-06-24T154958.279.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ca24fe18-be53-40b8-8440-05a3bdddb1d6/Ebook+Thumbnail+with+Video+-+2025-06-24T154932.235.png?format=500w",
    ],
    variants:[
      { label:"Red",       imgIdx:0 },
      { label:"Baby Blue", imgIdx:1 },
      { label:"Rainbow",   imgIdx:2 },
      { label:"Pink",      imgIdx:3 },
    ],
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/blow-job-bib",
  },
  {
    id:"acc-beverage-helmet",
    type:"accessory",
    name:"Beverage Helmet",
    price:"$26.33",
    desc:"This bold pink beer helmet is the party sidekick. Pop in two cans, sip through the straws, and let the good times flow. No effort required!",
    bullets:["Set of 1","One size fits all","Adjustable inner strap","Holds 2 cans (soda or beer)"],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/bf8adb75-0e2b-43ff-b643-55aac576efb5/Ebook+Thumbnail+with+Video+-+2025-04-28T204735.461.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5286f07d-150d-482f-9868-f6ee975da20b/Ebook+Thumbnail+with+Video+-+2025-04-28T203735.294.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/bf8adb75-0e2b-43ff-b643-55aac576efb5/Ebook+Thumbnail+with+Video+-+2025-04-28T204735.461.png?format=500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/beverage-helmet",
  },
  {
    id:"acc-wine-charmers",
    type:"accessory",
    name:"Wine Charmers Drink Markers",
    price:"$15.00",
    desc:"Get ready to wine and swoon with these charming muscle men wine glass holders! Freddie, Jack, Blake, and Spencer are here to flex while you sip.",
    bullets:["Set of 4","Dimensions: 1.5\"l x 2.5\"w"],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3c5bc323-bc61-4783-b41f-d77f51c6a237/Ebook+Thumbnail+with+Video+-+2025-03-26T093257.985.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b3d17631-8226-4fcf-a30c-8bd861174522/Ebook+Thumbnail+with+Video+-+2025-03-26T093318.175.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f225e569-9f6c-4a7b-92e1-da5257b9a612/Ebook+Thumbnail+with+Video+-+2025-03-26T093308.437.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3c5bc323-bc61-4783-b41f-d77f51c6a237/Ebook+Thumbnail+with+Video+-+2025-03-26T093257.985.png?format=500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/wine-charmers-drink-markers",
  },
  {
    id:"acc-boob-drink-markers",
    type:"accessory",
    name:"Boob Drink Markers",
    price:"$16.00",
    desc:"Because your drink deserves a little personality. Grab a boob bottle charm and keep the party going!",
    bullets:["Set of 4","Dimensions: 2.5\"l x 2\"w"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0f9bd949-074d-4b7a-a279-181a334286d0/Ebook+Thumbnail+with+Video+-+2025-07-18T080459.625.png?format=500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/boob-drink-markers",
  },
  {
    id:"acc-cactus-pool-float",
    type:"accessory",
    name:"Cactus Pool Float",
    price:"$56.00",
    desc:"Saddle up for sunshine, babe! This oversized cactus pool float brings major desert glam to your western theme bachelorette bash, add SPF and cocktails.",
    bullets:["Set of 1","Dimensions: 44.75\"l x 6.25\"w x 69.5\"h","Material: PVC plastic","Manual or electric pump compatible","Includes 1 repair patch"],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/82b086c9-fd5b-4995-9101-6ed78043bee9/Ebook+Thumbnail+with+Video+-+2025-02-18T194517.243.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8db95fa1-7609-4a5e-87ae-01b9eaf8e3af/Ebook+Thumbnail+with+Video+-+2025-02-18T194500.592.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/82b086c9-fd5b-4995-9101-6ed78043bee9/Ebook+Thumbnail+with+Video+-+2025-02-18T194517.243.png?format=500w",
    bg:"#A8D8A8", accent:"#4CAF50",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/cactus-pool-float",
  },
  {
    id:"acc-silver-disco-ice-bucket",
    type:"accessory",
    name:"Silver Disco Ice Bucket",
    price:"$52.00",
    desc:"Shine bright, sip bold! This silver disco ball ice bucket isn't just functional. It's the party centerpiece your bar cart's been begging for.",
    bullets:["Set of 1","Dimensions: 10\"l x 10\"w"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ad5570a3-6f00-4548-83ba-de8b87a9aeb3/Ebook+Thumbnail+with+Video+-+2025-03-01T121735.163.png?format=500w",
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ad5570a3-6f00-4548-83ba-de8b87a9aeb3/Ebook+Thumbnail+with+Video+-+2025-03-01T121735.163.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/fd546f77-552d-4fc2-825a-665f00daa050/Ebook+Thumbnail+with+Video+-+2025-03-01T121819.988.png?format=500w",
    ],
    bg:"#C0C0C0", accent:"#808080",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/silver-disco-ice-bucket",
  },
  {
    id:"acc-girl-code-game",
    type:"accessory",
    name:"Girl Code Game",
    price:"$21.02",
    desc:"Girl Code = chaos, confessions, and nonstop laughs. With 275 cards packed with flirty Qs, wild dares, and zero filters, this is the game that turns girls' night into a full blown party.",
    bullets:["275 cards","Ideal for 3+ players","Rated 17+"],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/e2b05e54-9e8c-47f3-8415-3708138093b6/Ebook+Thumbnail+with+Video+-+2025-04-22T145319.069.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/018c35df-0bf1-46d9-9253-57a0458eec4a/Ebook+Thumbnail+with+Video+-+2025-04-22T150024.634.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a56ed747-2243-4174-a28f-16db14c874b2/Ebook+Thumbnail+with+Video+-+2025-04-22T145924.274.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/e2b05e54-9e8c-47f3-8415-3708138093b6/Ebook+Thumbnail+with+Video+-+2025-04-22T145319.069.png?format=500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/girl-code-party-game",
  },
  {
    id:"acc-men-in-uniform-markers",
    type:"accessory",
    name:"Men in Uniform Drink Markers",
    price:"$16.00",
    desc:"Hot guys + cold drinks = party perfection. Our men in uniform drink markers are here to tag your glass and steal your heart (just a little).",
    bullets:["Set of 4","Dimensions: 2\"l x 1\"w"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0b21511c-1176-4e40-a303-7e680fbb3c5f/Ebook+Thumbnail+with+Video+-+2025-02-16T151446.198.png?format=500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/men-in-uniform-drink-markers",
  },
  {
    id:"acc-dice-ice-bucket",
    type:"accessory",
    name:"Dice Ice Bucket",
    price:"$45.50",
    desc:"Ice cold drinks? You just rolled a 10/10. Our jumbo dice ice bucket is the perfect party sidekick fun, functional, and totally fabulous for any celebration.",
    bullets:["Set of 1","Dimensions: 10\"l x 10\"w"],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/50d3d033-146d-48c6-b768-e62b68bb533b/Ebook+Thumbnail+with+Video+-+2025-02-25T100739.771.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/7e9c674a-913f-46a3-b4fe-05f05f09cb1e/Ebook+Thumbnail+with+Video+-+2025-02-25T100950.695.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/50d3d033-146d-48c6-b768-e62b68bb533b/Ebook+Thumbnail+with+Video+-+2025-02-25T100739.771.png?format=500w",
    bg:"#E8E8E8", accent:"#1A1A1A",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/dice-ice-bucket",
  },
  {
    id:"acc-girls-night-xoxo-game",
    type:"accessory",
    name:"Girls Night Xoxo Game",
    price:"$19.87",
    desc:"Flirty, fun, and a little savage. Girl's night xoxo is packed with 100 juicy cards that'll have your girls spilling secrets and cracking up all night. Think you know your girls?",
    bullets:["100 total cards","4 fun & bold categories","Ideal for 3+ players"],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b3cde017-c2cf-485e-b7e7-d06c101886e5/Ebook+Thumbnail+with+Video+-+2025-04-22T145441.386.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/72be5394-8a63-443c-bb6b-4484ffbd31cd/Ebook+Thumbnail+with+Video+-+2025-04-22T145213.656.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/d1748297-045d-43f1-86ed-eccbf9faf50d/Ebook+Thumbnail+with+Video+-+2025-04-22T145145.170.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b3cde017-c2cf-485e-b7e7-d06c101886e5/Ebook+Thumbnail+with+Video+-+2025-04-22T145441.386.png?format=500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/girls-night-xoxo-game",
  },
  {
    id:"acc-disco-stars-headband",
    type:"accessory",
    name:"Disco Stars Headband",
    price:"$23.00",
    desc:"Ready to shine? This disco ball headband is the perfect party starter for the bride tribe, adding a fun, glittery vibe to your celebration!",
    bullets:["Set of 1","Dimensions: 4.5\"w x 7.5\"l","One size fits all"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0b21511c-1176-4e40-a303-7e680fbb3c5f/Ebook+Thumbnail+with+Video+-+2025-02-16T151446.198.png?format=500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/disco-stars-headband",
  },
  {
    id:"acc-something-blue-sunglasses",
    type:"accessory",
    name:"Something Blue Sunglasses",
    price:"$19.00",
    desc:"Make a statement with our something blue sunnies! Fun, stylish, and embossed for a fresh twist on bridal accessories.",
    bullets:["Set of 1","Dimensions: 6\"w"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f6d55d6f-c4ca-4099-b490-4ed707a30292/Ebook+Thumbnail+with+Video+-+2025-01-20T134834.956.png?format=500w",
    bg:"#87CEEB", accent:"#4A90D9",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/something-blue-sunglasses",
  },
  {
    id:"acc-seashell-pool-float",
    type:"accessory",
    name:"Seashell Pool Float",
    price:"$61.00",
    desc:"Bring the magical escape to your pool with our inflatable iridescent seashell pool float! This oversized float is the perfect way to relax, soak up the sun, and add a fun, stylish element to your pool parties.",
    bullets:["Set of 1","Dimensions: 54\"l x 10\"w x 61.75\"h","Manual or electric pump compatible","Includes 1 repair patch"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767934960350/Ebook+Thumbnail+with+Video+-+2025-02-18T195035.694.png?format=1500w",
    bg:"#FFDAB9", accent:"#E8A87C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/seashell-pool-float",
  },
  {
    id:"acc-disco-cowboy-markers",
    type:"accessory",
    name:"Disco Cowboy Drink Markers",
    price:"$16.00",
    desc:"Yeehaw, bride tribe! Add a disco twist to your wild west bash with our disco cowboy drink markers! They bring the glam to your country bash; no lost cocktails, just nonstop fun!",
    bullets:["Set of 4","Dimensions: 2.5\"l x 2\"w"],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8177a69f-6352-47ac-9801-a64b4c703ca2/Ebook+Thumbnail+with+Video+-+2025-04-22T155722.481.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/2cfb5bb6-df4d-46e1-9161-ee74ee7ac089/Ebook+Thumbnail+with+Video+-+2025-04-22T155756.552.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/feed885c-6a91-4682-a022-8ef6a50932ae/Ebook+Thumbnail+with+Video+-+2025-04-22T160007.244.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8177a69f-6352-47ac-9801-a64b4c703ca2/Ebook+Thumbnail+with+Video+-+2025-04-22T155722.481.png?format=500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/disco-cowboy-drink-markers",
  },
  {
    id:"acc-cheeky-wine-stopper",
    type:"accessory",
    name:"Cheeky Wine Stopper",
    price:"$14.00",
    desc:"This little stopper's got big party energy! A humorous accessory perfect for bachelorette celebrations and girls' nights out.",
    bullets:["Set of 1","Dimensions: 3.3\"l x 5.6\"h x 1.2\"w"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/08a548e6-9c7f-4b9d-860b-5eaf4766ba7f/Ebook+Thumbnail+with+Video+-+2025-03-01T155823.154.png?format=500w",
    bg:"#FFDAB9", accent:"#E8A87C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/cheeky-wine-stopper",
  },
  {
    id:"acc-magic-mike-markers",
    type:"accessory",
    name:"Magic Mike Drink Markers",
    price:"$16.00",
    desc:"Sips, laughs, and six packs. Our magic mike inspired drink markers keep your cocktails safe and your party wild!",
    bullets:["Set of 4","Dimensions: 2\"l x 1.5\"w"],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/de2cd38a-da05-4cb2-8093-42969a6fc3b8/Ebook+Thumbnail+with+Video+-+2025-03-16T183111.495.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b9d7c7e3-c44e-4f46-a87b-e4d477382f3b/Ebook+Thumbnail+with+Video+-+2025-03-16T183212.205.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/cadcb9a2-36cc-4bf9-bb50-57adae1c9d72/Ebook+Thumbnail+with+Video+-+2025-03-16T183242.937.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/de2cd38a-da05-4cb2-8093-42969a6fc3b8/Ebook+Thumbnail+with+Video+-+2025-03-16T183111.495.png?format=500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/magic-mike-drink-markers",
  },
  {
    id:"acc-dice-bottle-opener",
    type:"accessory",
    name:"Dice Bottle Opener",
    price:"$12.00",
    image:"https://images.weserv.nl/?url=images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b0f3fd24-96a2-4830-a664-6303e51052ad/Ebook+Thumbnail+with+Video+-+2025-02-25T095551.263.png&w=400&output=jpg",
    bg:"#E8E8E8", accent:"#1A1A1A",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/dice-bottle-opener",
  },
  {
    id:"acc-diamond-ring-pool-float",
    type:"accessory",
    name:"Diamond Ring Pool Float",
    price:"$28.00",
    desc:"Bling it on! This oversized diamond ring float is your ultimate summer sidekick for pool parties, beach hangs, and turning heads in the sunshine.",
    bullets:["Set of 1","Dimensions: 43\"l x 34\"w","Manual or electric pump compatible","Includes 1 repair patch"],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ff8cbe41-5735-4a70-abc1-f38e9f7bbf26/Ebook+Thumbnail+with+Video+-+2025-02-17T203136.876.png?format=500w",
    bg:"#E8F4FD", accent:"#87CEEB",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/diamond-ring-pool-float",
  },
  {
    id:"acc-size-matters-markers",
    type:"accessory",
    name:"Size Matters Drink Markers",
    price:"$16.50",
    desc:"Let's get naughty! No more drink mix ups. Just sass, style, and a whole lot of fun!",
    bullets:["Set of 4","Dimensions: 2.5\"l x 1.5\"w"],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/08a548e6-9c7f-4b9d-860b-5eaf4766ba7f/Ebook+Thumbnail+with+Video+-+2025-03-01T155823.154.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/43e3a688-10ef-4a05-a9ef-0314cd615a92/Ebook+Thumbnail+with+Video+-+2025-03-01T155845.847.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/e547d5b2-4d0c-4fcd-96e9-e170cc459fd3/Ebook+Thumbnail+with+Video+-+2025-03-01T155856.949.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/08a548e6-9c7f-4b9d-860b-5eaf4766ba7f/Ebook+Thumbnail+with+Video+-+2025-03-01T155823.154.png?format=500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/size-matters-drink-markers",
  },
  {
    id:"acc-pink-disco-ice-bucket",
    type:"accessory",
    name:"Pink Disco Ice Bucket",
    price:"$57.00",
    desc:"Serving cold drinks and hot disco energy! Our pink disco ice bucket is the ultimate party centerpiece for any glam loving bride or her sparkle squad.",
    bullets:["Set of 1","Dimensions: 10\"l x 10\"w"],
    images:[
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/872acb99-83b0-4754-b9a6-fe9be7fac322/Ebook+Thumbnail+with+Video+-+2025-02-25T101251.742.png?format=500w",
      "https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/5c818187-b073-4796-8615-8452d081271e/Ebook+Thumbnail+with+Video+-+2025-02-25T101147.048.png?format=500w",
    ],
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/872acb99-83b0-4754-b9a6-fe9be7fac322/Ebook+Thumbnail+with+Video+-+2025-02-25T101251.742.png?format=500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/pink-disco-ice-bucket",
  },
  {
    id:"acc-palm-leaf-pool-float",
    type:"accessory",
    name:"Palm Leaf Pool Float",
    price:"$26.00",
    bullets:["Set of 1","Manual or electric pump compatible","Includes 1 repair patch"],
    image:"https://images.weserv.nl/?url=images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b4902972-c1ce-4548-a892-314d22301f6e/Ebook+Thumbnail+with+Video+-+2025-02-17T202053.165.png&w=400&output=jpg",
    bg:"#A8D8A8", accent:"#4CAF50",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/palm-leaf-pool-float",
  },
  {
    id:"acc-pineapple-sunglasses",
    type:"accessory",
    name:"Pineapple Sunglasses",
    price:"$10.33",
    image:"https://images.weserv.nl/?url=images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/9db6afd3-c79a-421c-a691-23f6142bbdbc/Ebook+Thumbnail+with+Video+-+2025-02-20T173419.662.png&w=400&output=jpg",
    bg:"#FFD700", accent:"#FFA500",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/pineapple-sunglasses",
  },
  {
    id:"acc-cowboy-hat-ice-bucket",
    type:"accessory",
    name:"Cowboy Hat Ice Bucket",
    price:"$70.00",
    image:"https://images.weserv.nl/?url=images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/111aa550-ce70-4484-8875-fe92d9d0acb8/Ebook+Thumbnail+with+Video+-+2025-02-25T100515.439.png&w=400&output=jpg",
    bg:"#C4956A", accent:"#8B6340",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/cowboy-hat-ice-bucket",
  },
  {
    id:"acc-red-lips-pool-float",
    type:"accessory",
    name:"Red Lips Pool Float",
    price:"$26.00",
    bullets:["Set of 1","Manual or electric pump compatible","Includes 1 repair patch"],
    image:"https://images.weserv.nl/?url=images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/65ba97fa-7e08-4c9e-a90d-0d49939a83e9/Ebook+Thumbnail+with+Video+-+2025-02-17T193427.505.png&w=400&output=jpg",
    bg:"#E8112D", accent:"#B71C1C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/red-lips-pool-float",
  },
  {
    id:"acc-cat-eye-bride-sunglasses",
    type:"accessory",
    name:"Cat Eye Bride Sunglasses",
    price:"$19.22",
    image:"https://images.weserv.nl/?url=images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/98b0b34f-a381-45cb-9a34-c3417529f75e/Ebook+Thumbnail+with+Video+-+2025-01-20T124005.489.png&w=400&output=jpg",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/cat-eye-bride-sunglasses",
  },
  {
    id:"acc-disco-ball-headband",
    type:"accessory",
    name:"Disco Ball Headband",
    price:"$21.00",
    image:"https://images.weserv.nl/?url=images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ee471a51-8450-4a9a-b34a-6bbc209c22cc/Ebook+Thumbnail+with+Video+-+2025-01-20T122406.368.png&w=400&output=jpg",
    bg:"#C0C0C0", accent:"#808080",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/disco-ball-headband",
  },
  {
    id:"acc-groovy-flower-sunglasses",
    type:"accessory",
    name:"Groovy Flower Sunglasses",
    price:"$22.00",
    image:"https://images.weserv.nl/?url=images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/121446f9-d824-4b66-964c-d685e69e9106/Ebook+Thumbnail+with+Video+-+2025-01-20T194402.177.png&w=400&output=jpg",
    bg:"#FFB6C1", accent:"#E91E8C",
    etsyUrl:"https://bachhotline.squarespace.com/party-accessories/p/groovy-flower-sunglasses",
  },
  {
    id:"acc-self-love-club-towel",
    type:"accessory",
    name:"Self Love Club Beach Towel",
    price:"$36.99",
    bullets:["Set of 1","Size: 30\"w x 60\"l"],
    image:"https://i.etsystatic.com/40669879/r/il/8a9508/7776683551/il_fullxfull.7776683551_bdow.jpg",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://www.etsy.com/listing/4460461226/self-love-club-beach-towel-girls-trip",
  },
  {
    id:"acc-modern-sardinas-towel",
    type:"accessory",
    name:"Modern Sardinas Beach Towel",
    price:"$36.99",
    bullets:["Set of 1","Size: 30\"w x 60\"l"],
    image:"https://i.etsystatic.com/40669879/r/il/2e7ab3/7795365021/il_fullxfull.7795365021_6o5f.jpg",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotlinesupplies.etsy.com/listing/4463176097/modern-sardinas-beach-towel-girls-trip",
  },
  {
    id:"acc-cocktail-club-towel",
    type:"accessory",
    name:"Cocktail Club Beach Towel",
    price:"$36.99",
    bullets:["Set of 1","Size: 30\"w x 60\"l"],
    image:"https://i.etsystatic.com/40669879/r/il/32a856/7795306529/il_fullxfull.7795306529_ppp2.jpg",
    bg:"#F4A7B9", accent:"#E91E8C",
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"acc-pur-baby-panther-towel",
    type:"accessory",
    name:"Pur Baby Panther Beach Towel",
    price:"$36.99",
    bullets:["Set of 1","Size: 30\"w x 60\"l"],
    image:"https://i.etsystatic.com/40669879/r/il/77b973/7795351957/il_fullxfull.7795351957_ixu2.jpg",
    bg:"#1A1A1A", accent:"#555",
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"acc-floral-groovy-towel",
    type:"accessory",
    name:"Floral Groovy Beach Towel",
    price:"$36.99",
    bullets:["Set of 1","Size: 30\"w x 60\"l"],
    image:"https://i.etsystatic.com/40669879/r/il/3ba46b/7743346430/il_fullxfull.7743346430_efzo.jpg",
    bg:"#FFB6C1", accent:"#E91E8C",
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"acc-fast-food-towel",
    type:"accessory",
    name:"Fast Food Beach Towel",
    price:"$36.99",
    bullets:["Set of 1","Size: 30\"w x 60\"l"],
    image:"https://i.etsystatic.com/40669879/r/il/df92e8/7791280017/il_fullxfull.7791280017_qdsr.jpg",
    bg:"#FFD700", accent:"#FF6B1A",
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"acc-ocean-tide-towel",
    type:"accessory",
    name:"Ocean Tide Beach Towel",
    price:"$36.99",
    bullets:["Set of 1","Size: 30\"w x 60\"l"],
    image:"https://i.etsystatic.com/40669879/r/il/7fcb8a/7739743318/il_fullxfull.7739743318_qafb.jpg",
    bg:"#87CEEB", accent:"#1E88E5",
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"acc-spaghetti-upsetti-towel",
    type:"accessory",
    name:"Spaghetti Upsetti Beach Towel",
    price:"$36.99",
    bullets:["Set of 1","Size: 30\"w x 60\"l"],
    image:"https://i.etsystatic.com/40669879/r/il/13578b/7739621152/il_fullxfull.7739621152_kglb.jpg",
    bg:"#E8112D", accent:"#B71C1C",
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
];

function PartyAccessoriesStep({ stepNum, cart, setCart }) {
  const mobile = useIsMobile();
  const [quantities, setQuantities] = useState({});
  const getQty = id => quantities[id] || 1;
  const adjQty = (id, val) => setQuantities(prev => ({ ...prev, [id]: Math.max(1, val) }));

  const inCart = id => cart.some(c => c.id === id);
  const toggle = (item) => {
    const qty = getQty(item.id);
    if (inCart(item.id)) {
      setCart(prev => prev.filter(c => c.id !== item.id));
    } else {
      setCart(prev => [...prev, {
        id: item.id, name: item.name,
        price: parseFloat(item.price.replace("$","")) * qty,
        qty, image: item.image, category: "accessory",
      }]);
    }
  };

  const getCountSize = (item) => {
    if (item.bullets?.length >= 2) {
      const b1 = item.bullets[1]
        .replace(/^Dimensions:/i, "Size:")
        .replace(/^Capacity:\s*(\S+)/i, "$1 capacity");
      return `${item.bullets[0]} · ${b1}`;
    }
    if (item.bullets?.length === 1) return item.bullets[0];
    if (item.desc) return item.desc;
    return null;
  };

  const renderItem = (item) => {
    const added = inCart(item.id);
    const qty = getQty(item.id);
    const shadow = added ? `0 0 0 2px ${HOT}, 0 4px 16px rgba(233,30,140,0.15)` : "0 4px 16px rgba(0,0,0,0.09)";
    return (
      <div key={item.id} style={{background:WHITE,borderRadius:"0 0 18px 18px",boxShadow:shadow,transition:"all 0.2s",display:"flex",flexDirection:"column",position:"relative"}}>
        <div style={{position:"relative",width:"100%",aspectRatio:"1/1",overflow:"hidden",flexShrink:0,background:"#fff"}}>
          <TablewearVisual item={item}/>
        </div>
        <div style={{padding:"7px 8px 8px",flex:1,display:"flex",flexDirection:"column"}}>
          <div style={{fontSize:11,fontWeight:400,color:"#f496c3",fontFamily:"'Acme',sans-serif",lineHeight:1.3,marginBottom:2}}>{item.name}</div>
          {item.bullets?.length >= 1 && (
            <div style={{fontSize:8,fontWeight:300,color:DARK,fontFamily:"'Nunito',sans-serif",lineHeight:1.6,marginBottom:4}}>
              {mobile ? (
                <>
                  <div>{item.bullets[0]}</div>
                  {item.bullets[1] && <div>{item.bullets[1].replace(/^Dimensions:/i,"Size:")}</div>}
                </>
              ) : (
                <div>{item.bullets[0]}{item.bullets[1] ? ` · ${item.bullets[1].replace(/^Dimensions:/i,"Size:")}` : ""}</div>
              )}
            </div>
          )}
          <div style={{fontSize:11,fontWeight:300,color:DARK,fontFamily:"'Nunito',sans-serif",marginBottom:5}}>{item.price}</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:5}}>
            <button onClick={()=>adjQty(item.id, qty-1)} style={{width:20,height:20,borderRadius:"50%",border:`1.5px solid ${BORDER}`,background:"none",fontSize:13,color:HOT,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1}}>−</button>
            <span style={{fontSize:11,fontWeight:300,color:DARK,fontFamily:"'Nunito',sans-serif",minWidth:14,textAlign:"center"}}>{qty}</span>
            <button onClick={()=>adjQty(item.id, qty+1)} style={{width:20,height:20,borderRadius:"50%",border:`1.5px solid ${BORDER}`,background:"none",fontSize:13,color:HOT,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1}}>+</button>
          </div>
          <button onClick={()=>toggle(item)} style={{
            background:added?SOFT:`#f496c3`,
            color:added?HOT:WHITE,
            border:added?`1.5px solid ${HOT}`:"none",
            borderRadius:20, padding:"5px 0", width:"100%",
            fontFamily:"'Nunito',sans-serif", fontSize:9, fontWeight:700, cursor:"pointer",
          }}>{added ? "✓ Added" : "+ Add"}</button>
        </div>
      </div>
    );
  };

  return (
    <div style={{marginBottom:28}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,paddingTop:20,borderTop:`2px solid ${MID}`}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:`#f496c3`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:WHITE,flexShrink:0}}>{stepNum}</div>
        <div>
          <div style={{fontSize:14,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>Party Accessories</div>
        </div>
      </div>
      {PARTY_ACCESSORIES.length === 0 ? (
        <div style={{textAlign:"center",padding:"28px 20px",background:SOFT,borderRadius:16}}>
          <div style={{fontSize:28,marginBottom:8}}>🎀</div>
          <div style={{fontSize:13,fontWeight:700,color:HOT,fontFamily:"'Nunito',sans-serif",marginBottom:4}}>Coming Soon</div>
          <div style={{fontSize:11,color:"#aaa",fontFamily:"'Nunito',sans-serif",lineHeight:1.5}}>Party accessories are being added. Check back soon!</div>
        </div>
      ) : (
        <Carousel items={PARTY_ACCESSORIES} renderItem={renderItem} />
      )}
    </div>
  );
}

function ConfettiStep({ stepNum, selectedColors, cart, setCart }) {
  const items = TABLEWARE.filter(i => i.type === "confetti");
  const [sizes, setSizes] = useState({}); // itemId → "mini" | "tube"
  const [quantities, setQuantities] = useState({}); // itemId → qty
  const getQty = id => quantities[id] || 1;
  const adjQty = (id, val) => setQuantities(prev => ({ ...prev, [id]: Math.max(1, val) }));

  const scored = items.map(item => ({
    ...item,
    score: item.tags.filter(t => selectedColors.includes(t)).length,
  })).sort((a,b) => b.score - a.score);

  const getSize = id => sizes[id] || "tube";
  const cartId  = (id, size) => `${id}-${size}`;

  const inCart = (id, size) => cart.some(c => c.id === cartId(id, size));
  const toggle = (item, size) => {
    const cid = cartId(item.id, size);
    const sizeLabel = size === "mini" ? "Mini Pack ¼oz" : "Tube 1oz";
    const sizePrice = size === "mini" ? parseFloat(item.price.replace("$","")) : parseFloat(item.price.replace("$","")) * 2;
    if (cart.some(c => c.id === cid)) {
      setCart(prev => prev.filter(c => c.id !== cid));
    } else {
      setCart(prev => [...prev, {
        id: cid, name: `${item.name} — ${sizeLabel}`,
        price: sizePrice, image: item.image, category: "confetti",
      }]);
    }
  };

  const renderConfettiItem = (item) => {
    const size = getSize(item.id);
    const added = inCart(item.id, size);
    const qty = getQty(item.id);
    const sizePrice = size === "mini"
      ? parseFloat(item.price.replace("$","")).toFixed(2)
      : (parseFloat(item.price.replace("$","")) * 2).toFixed(2);
    const shadow = added ? `0 0 0 2px ${HOT}, 0 4px 16px rgba(233,30,140,0.15)` : "0 4px 16px rgba(0,0,0,0.09)";
    const displayItem = size === "tube" && item.tubeImage
      ? { ...item, image: item.tubeImage }
      : item;
    return (
      <div key={item.id} style={{background:WHITE,borderRadius:"0 0 18px 18px",boxShadow:shadow,transition:"all 0.2s",display:"flex",flexDirection:"column",position:"relative"}}>
        <div style={{position:"relative",width:"100%",aspectRatio:"1/1",overflow:"hidden",flexShrink:0,background:"#fff"}}>
          <TablewearVisual item={displayItem}/>
        </div>
        <div style={{padding:"7px 8px 8px",flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
          <div style={{fontSize:13,fontWeight:400,color:"#f496c3",fontFamily:"'Acme',sans-serif",lineHeight:1.3,marginBottom:4}}>{item.name}</div>
          <div style={{display:"flex",gap:3,marginBottom:5}}>
            {[{id:"mini",label:"Mini: 0.25oz"},{id:"tube",label:"Tube: 1oz"}].map(opt => (
              <button key={opt.id} onClick={() => setSizes(prev => ({...prev,[item.id]:opt.id}))} style={{
                flex:1, padding:"2px 0", borderRadius:6, cursor:"pointer",
                fontFamily:"'Nunito',sans-serif", fontSize:8, fontWeight:700,
                border: size===opt.id ? `1.5px solid ${HOT}` : `1px solid ${BORDER}`,
                background: size===opt.id ? SOFT : WHITE,
                color: size===opt.id ? HOT : "#aaa",
              }}>{opt.label}</button>
            ))}
          </div>
          <div style={{fontSize:11,fontWeight:300,color:DARK,fontFamily:"'Nunito',sans-serif",marginBottom:5}}>${sizePrice}</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:5}}>
            <button onClick={()=>adjQty(item.id, qty-1)} style={{width:20,height:20,borderRadius:"50%",border:`1.5px solid ${BORDER}`,background:"none",fontSize:13,color:HOT,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1}}>−</button>
            <span style={{fontSize:11,fontWeight:300,color:DARK,fontFamily:"'Nunito',sans-serif",minWidth:14,textAlign:"center"}}>{qty}</span>
            <button onClick={()=>adjQty(item.id, qty+1)} style={{width:20,height:20,borderRadius:"50%",border:`1.5px solid ${BORDER}`,background:"none",fontSize:13,color:HOT,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1}}>+</button>
          </div>
          <button onClick={() => toggle(item, size)} style={{
            background:added?SOFT:`#f496c3`, color:added?HOT:WHITE, border:added?`1.5px solid ${HOT}`:"none",
            borderRadius:20, padding:"5px 0", width:"100%",
            fontFamily:"'Nunito',sans-serif", fontSize:9, fontWeight:700, cursor:"pointer",
          }}>{added ? "✓ Added" : "+ Add"}</button>
        </div>
      </div>
    );
  };

  return (
      <div style={{marginBottom:28}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,paddingTop:20,borderTop:`2px solid ${MID}`}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:`#f496c3`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:WHITE,flexShrink:0}}>{stepNum}</div>
        <div>
          <div style={{fontSize:14,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>Add Some Confetti</div>
        </div>
      </div>
      {selectedColors.length === 0 ? (
        <div style={{textAlign:"center",padding:"24px 16px",background:SOFT,borderRadius:16}}>
          <div style={{fontSize:13,fontWeight:700,color:HOT,fontFamily:"'Nunito',sans-serif",marginBottom:4}}>Customize your garland first</div>
          <div style={{fontSize:11,color:"#888",fontFamily:"'Nunito',sans-serif",lineHeight:1.5}}>Pick your balloon colors in Step 1 and we'll show you only the products that match.</div>
        </div>
      ) : (
        <Carousel items={scored.filter(i => i.score >= 1)} renderItem={renderConfettiItem} />
      )}
    </div>
  );
}

// ─── Foil Balloon Step ────────────────────────────────────────────────────────
function FoilStep({ stepNum, selectedColors, cart, setCart }) {
  const items = TABLEWARE.filter(i => i.type === "foil");
  const scored = items.map(item => ({
    ...item,
    score: item.tags.filter(t => selectedColors.includes(t)).length,
  })).sort((a,b) => {
    const aNum = a.numberBalloon ? 1 : 0;
    const bNum = b.numberBalloon ? 1 : 0;
    if (bNum !== aNum) return bNum - aNum;
    return b.score - a.score;
  });

  const [activeNumId, setActiveNumId] = useState(null);

  const numberId = (item, n) => `${item.id}-num${n}`;
  const numInCart = (item, n) => cart.some(c => c.id === numberId(item, n));
  const toggleNum = (item, n) => {
    const cid = numberId(item, n);
    if (cart.some(c => c.id === cid)) {
      setCart(prev => prev.filter(c => c.id !== cid));
    } else {
      setCart(prev => [...prev, {
        id: cid, name: `${item.name} — #${n}`,
        price: parseFloat(item.price.replace("$","")),
        image: item.image, category: "foil",
      }]);
    }
  };

  const inCart = id => cart.some(c => c.id === id);
  const toggle = item => {
    if (inCart(item.id)) {
      setCart(prev => prev.filter(c => c.id !== item.id));
    } else {
      setCart(prev => [...prev, {
        id: item.id, name: item.name,
        price: parseFloat(item.price.replace("$","")),
        image: item.image, category: "foil",
      }]);
    }
  };

  const activeNumItem = scored.find(i => i.id === activeNumId);

  const [foilQty, setFoilQty] = useState({});
  const getFoilQty = id => foilQty[id] || 0;
  const adjFoilQty = (item, delta) => {
    const unitPrice = parseFloat(item.price.replace("$",""));
    const cur = getFoilQty(item.id);
    const nq = Math.max(0, cur + delta);
    setFoilQty(q => { const n={...q}; if(nq===0){delete n[item.id]}else{n[item.id]=nq}; return n; });
    if (nq === 0) {
      setCart(prev => prev.filter(c => c.id !== item.id));
    } else if (cur === 0) {
      setCart(prev => [...prev, { id:item.id, name:item.name, price:unitPrice*nq, qty:nq, unitPrice, image:item.image, category:"foil" }]);
    } else {
      setCart(prev => prev.map(c => c.id===item.id ? {...c, price:unitPrice*nq, qty:nq} : c));
    }
  };

  const renderFoilItem = (item) => {
    const sizeMatch = item.name.match(/^(\d+)"\s*/);
    const inchSize = sizeMatch ? sizeMatch[1] : null;
    const displayName = item.name.replace(/^\d+"\s*/, "");
    const countSize = inchSize ? { line1:"Set of 1", line2:`Size: ${inchSize}"` } : { line1:"Set of 1", line2:null };

    if (item.numberBalloon) {
      const selectedNums = [0,1,2,3,4,5,6,7,8,9].filter(n => numInCart(item,n));
      const hasNums = selectedNums.length > 0;
      const shadow = hasNums ? `0 0 0 2px ${HOT}, 0 4px 16px rgba(233,30,140,0.15)` : "0 4px 16px rgba(0,0,0,0.09)";
      const btnBg = hasNums ? SOFT : `#f496c3`;
      const btnColor = hasNums ? HOT : WHITE;
      const btnBorder = hasNums ? `1.5px solid ${HOT}` : "none";
      const btnLabel = hasNums ? `#${selectedNums.join(", ")} ✓` : "Pick Numbers";
      return (
        <div key={item.id} style={{background:WHITE,borderRadius:"0 0 18px 18px",boxShadow:shadow,transition:"all 0.2s",display:"flex",flexDirection:"column"}}>
          <div style={{position:"relative",width:"100%",aspectRatio:"1/1",overflow:"hidden",flexShrink:0}}>
            <TablewearVisual item={item}/>
          </div>
          <div style={{padding:"7px 8px 8px",flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{fontSize:13,fontWeight:400,color:"#f496c3",fontFamily:"'Acme',sans-serif",lineHeight:1.3,marginBottom:2}}>{displayName}</div>
            <div style={{fontSize:8,fontWeight:300,color:DARK,fontFamily:"'Nunito',sans-serif",lineHeight:1.6,marginBottom:4}}>{countSize.line1}{countSize.line2 ? ` · Size: ${inchSize}"` : ""}</div>
            <div>
              <div style={{fontSize:11,fontWeight:300,color:DARK,fontFamily:"'Nunito',sans-serif",marginBottom:4}}>{item.price} each</div>
              <button onClick={() => setActiveNumId(activeNumId === item.id ? null : item.id)} style={{
                width:"100%", background:btnBg, color:btnColor, border:btnBorder,
                borderRadius:20, padding:"5px 0",
                fontFamily:"'Nunito',sans-serif", fontSize:9, fontWeight:700, cursor:"pointer",
              }}>{btnLabel}</button>
            </div>
          </div>
        </div>
      );
    }
    const qty = getFoilQty(item.id);
    const added = qty > 0;
    const shadow = added ? `0 0 0 2px ${HOT}, 0 4px 16px rgba(233,30,140,0.15)` : "0 4px 16px rgba(0,0,0,0.09)";
    return (
      <div key={item.id} style={{background:WHITE,borderRadius:"0 0 18px 18px",boxShadow:shadow,transition:"all 0.2s",display:"flex",flexDirection:"column"}}>
        <div style={{position:"relative",width:"100%",aspectRatio:"1/1",overflow:"hidden",flexShrink:0}}>
          <TablewearVisual item={item}/>
        </div>
        <div style={{padding:"7px 8px 8px",flex:1,display:"flex",flexDirection:"column"}}>
          <div style={{fontSize:11,fontWeight:400,color:"#f496c3",fontFamily:"'Acme',sans-serif",lineHeight:1.3,marginBottom:2}}>{displayName}</div>
          <div style={{fontSize:8,fontWeight:300,color:DARK,fontFamily:"'Nunito',sans-serif",lineHeight:1.6,marginBottom:4}}>{countSize.line1}{countSize.line2 ? ` · Size: ${inchSize}"` : ""}</div>
          <div style={{fontSize:11,fontWeight:300,color:DARK,fontFamily:"'Nunito',sans-serif",marginBottom:5}}>{item.price}</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:5}}>
            <button onClick={e=>{e.stopPropagation();adjFoilQty(item,-1);}} style={{width:20,height:20,borderRadius:"50%",border:`1.5px solid ${BORDER}`,background:"none",fontSize:13,color:HOT,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1}}>&minus;</button>
            <span style={{fontSize:11,fontWeight:300,color:DARK,fontFamily:"'Nunito',sans-serif",minWidth:14,textAlign:"center"}}>{qty}</span>
            <button onClick={e=>{e.stopPropagation();adjFoilQty(item,1);}} style={{width:20,height:20,borderRadius:"50%",border:`1.5px solid ${BORDER}`,background:"none",fontSize:13,color:HOT,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1}}>+</button>
          </div>
          <button onClick={e=>{e.stopPropagation();adjFoilQty(item, added?-qty:1);}} style={{
            background:added?SOFT:`#f496c3`,
            color:added?HOT:WHITE,
            border:added?`1.5px solid ${HOT}`:"none",
            borderRadius:20, padding:"5px 0", width:"100%",
            fontFamily:"'Nunito',sans-serif", fontSize:9, fontWeight:700, cursor:"pointer",
          }}>{added ? "✓ Added" : "+ Add"}</button>
        </div>
      </div>
    );
  };

  const digits = [0,1,2,3,4,5,6,7,8,9];

  return (
    <div style={{marginBottom:28}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,paddingTop:20,borderTop:`2px solid ${MID}`}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:`#f496c3`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:WHITE,flexShrink:0}}>{stepNum}</div>
        <div>
          <div style={{fontSize:14,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>Add Foil Balloons</div>
        </div>
      </div>
      {selectedColors.length === 0 ? (
        <div style={{textAlign:"center",padding:"24px 16px",background:SOFT,borderRadius:16}}>
          <div style={{fontSize:13,fontWeight:700,color:HOT,fontFamily:"'Nunito',sans-serif",marginBottom:4}}>Customize your garland first</div>
          <div style={{fontSize:11,color:"#888",fontFamily:"'Nunito',sans-serif",lineHeight:1.5}}>Pick your balloon colors in Step 1 and we'll show you only the products that match.</div>
        </div>
      ) : (
        <Carousel items={scored.filter(i => i.score >= 1)} renderItem={renderFoilItem} />
      )}
      {activeNumItem && (
        <div style={{marginTop:12,background:WHITE,borderRadius:18,padding:"14px 14px 16px",boxShadow:"0 4px 20px rgba(233,30,140,0.15)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:800,color:HOT,fontFamily:"'Nunito',sans-serif"}}>{activeNumItem.name} — Pick Your Numbers</div>
            <button onClick={() => setActiveNumId(null)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#aaa",lineHeight:1}}>×</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
            {digits.map(n => {
              const sel = numInCart(activeNumItem, n);
              const bg = sel ? SOFT : WHITE;
              const col = sel ? HOT : DARK;
              const bdr = sel ? `2px solid ${HOT}` : `1.5px solid ${BORDER}`;
              return (
                <button key={n} onClick={() => toggleNum(activeNumItem, n)} style={{
                  aspectRatio:"1/1", borderRadius:12, cursor:"pointer",
                  fontFamily:"'Nunito',sans-serif", fontSize:20, fontWeight:900,
                  border:bdr, background:bg, color:col, transition:"all 0.15s",
                }}>{n}</button>
              );
            })}
          </div>
          {digits.filter(n => numInCart(activeNumItem,n)).length > 0 && (
            <div style={{marginTop:10,fontSize:11,color:HOT,fontFamily:"'Nunito',sans-serif",fontWeight:700}}>
              Selected: {digits.filter(n => numInCart(activeNumItem,n)).join(", ")} · ${(digits.filter(n => numInCart(activeNumItem,n)).length * parseFloat(activeNumItem.price.replace("$",""))).toFixed(2)} total
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Curated Themes ───────────────────────────────────────────────────────────
const CURATED_THEMES = [
  {
    id:"theme-zesty-bride",
    name:"Zesty Bride",
    emoji:"🍋",
    desc:"A fresh, playful mix of pinks, blues, and sunny lemon yellows for a bright, bold, and citrus sweet party.",
    colors:["#F4A7B9","#87CEEB","#FFD700","#E91E8C"],
    items:[
      "plate-lemon-zest",
      "cup-pink-lemonade",
      "napkin-simple-blue",
      "treatbag-diamond",
      "treatbag-envelope-boxes",
      "foil-blue-bell-bowknot",
      "banner-baby-pink-fringe-backdrop",
      "confetti-dream-tube",
      "confetti-popcorn-tube",
    ],
  },
  {
    id:"theme-flutter-glow",
    name:"Flutter & Glow",
    emoji:"🦋",
    desc:"Soft pastels, garden lanterns, and delicate butterflies come together for a dreamy, magical celebration.",
    colors:["#FFB6C1","#DDA0DD","#B0E0E6","#FFE4B5"],
    items:[
      "plate-butterfly",
      "cup-blues-checker",
      "napkin-love-heart",
      "napkin-wavy",
      "banner-molly-paper-lanterns",
      "banner-floral-garland",
      "confetti-whimsy-tube",
      "confetti-butterfly-tube",
    ],
  },
  {
    id:"theme-deal-me-love",
    name:"Deal Me Love",
    emoji:"🃏",
    desc:"Bold red hues, sleek black accents, and edgy queen card details create a fierce, flirty energy for an unapologetic girls only gathering.",
    colors:["#E8112D","#1A1A1A","#F4A7B9","#E91E8C"],
    items:[
      "napkin-queen-card",
      "napkin-yes-girl",
      "cup-dusty-pinky",
      "foil-zebra",
      "confetti-cherries-tube",
      "confetti-lovestruck-tube",
      "confetti-licorice-tube",
    ],
  },
];

function CuratedThemes({ cart, setCart }) {
  const [itemQtys, setItemQtys] = useState({});

  const allItems = id => {
    // handle confetti with size suffix
    if (id.endsWith("-mini") || id.endsWith("-tube")) {
      const baseId = id.replace(/-mini$|-tube$/, "");
      const size   = id.endsWith("-mini") ? "mini" : "tube";
      const item   = TABLEWARE.find(i => i.id === baseId);
      if (!item) return null;
      const sizeLabel = size === "mini" ? "Mini: 0.25oz" : "Tube: 1oz";
      const sizePrice = size === "mini" ? parseFloat(item.price.replace("$","")) : parseFloat(item.price.replace("$","")) * 2;
      const sizeBullets = size === "tube" ? ["Set of 1"] : item.bullets;
      const sizeImage = size === "tube" ? (item.tubeImage || item.image) : item.image;
      return { ...item, id, name:`${item.name} — ${sizeLabel}`, price:`$${sizePrice.toFixed(2)}`, bullets: sizeBullets, image: sizeImage };
    }
    return TABLEWARE.find(i => i.id === id) || null;
  };

  const getSetSize = item => {
    if (!item || !item.bullets) return 1;
    const match = item.bullets[0] && item.bullets[0].match(/Set of (\d+)/i);
    return match ? parseInt(match[1], 10) : 1;
  };

  const getItemQty = (item) => itemQtys[item.id] ?? 1;

  const setItemQty = (id, qty) => setItemQtys(prev => ({ ...prev, [id]: Math.max(1, qty) }));

  const themeAllAdded = theme => theme.items.every(id => cart.some(c => c.id === id));

  const addTheme = theme => {
    const toAdd = theme.items.map(allItems).filter(item => item && !cart.some(c => c.id === item.id));
    if (!toAdd.length) return;
    setCart(prev => [...prev, ...toAdd.map(item => ({
      id: item.id, name: item.name,
      price: parseFloat(item.price.replace("$","")),
      image: item.image, category: "tableware",
      qty: getItemQty(item),
    }))]);
  };

  return (
    <div style={{marginTop:28,paddingTop:20,borderTop:`2px solid ${MID}`}}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {CURATED_THEMES.map(theme => {
          const allAdded = themeAllAdded(theme);
          return (
            <div key={theme.id} style={{borderRadius:18,border:`1.5px solid ${allAdded?HOT:BORDER}`,background:allAdded?SOFT:WHITE,padding:"16px",transition:"all 0.2s"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <div style={{fontSize:14,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{theme.name}</div>
                  <div style={{fontSize:11,color:"#aaa",fontFamily:"'Nunito',sans-serif",marginTop:2}}>{theme.desc}</div>
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0,marginLeft:10,marginTop:4}}>
                  {theme.colors.map((c,i)=>(
                    <div key={i} style={{width:14,height:14,borderRadius:"50%",background:c,border:"1.5px solid rgba(0,0,0,0.12)"}}/>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {theme.items.map(id => {
                  const item = allItems(id);
                  if (!item) return null;
                  const added = cart.some(c => c.id === id);
                  const imgSrc = (item.images && item.images[0]) || item.image || "";
                  const qty = getItemQty(item);
                  const setSize = getSetSize(item);
                  return (
                    <div key={id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:10,background:added?SOFT:WHITE,border:`1px solid ${added?HOT:BORDER}`}}>
                      {imgSrc
                        ? <img src={imgSrc} alt={item.name} style={{width:34,height:34,objectFit:"contain",borderRadius:6,background:"#fff",border:`1px solid ${BORDER}`,padding:2,boxSizing:"border-box",flexShrink:0}}/>
                        : <div style={{width:34,height:34,borderRadius:6,background:SOFT,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🎀</div>
                      }
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:400,color:added?HOT:DARK,lineHeight:1.3,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{added?"✓ ":""}{item.name}</div>
                        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:10,color:"#aaa",marginTop:1}}>Set of {setSize}</div>
                        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:10,color:"#aaa",marginTop:1}}>{item.price}</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                        <button onClick={e=>{e.stopPropagation();setItemQty(id, qty-1);}} style={{width:20,height:20,borderRadius:"50%",border:`1.5px solid ${HOT}`,background:WHITE,color:HOT,fontSize:13,fontWeight:300,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1}}>−</button>
                        <span style={{fontFamily:"'Nunito',sans-serif",fontSize:12,fontWeight:300,color:DARK,minWidth:14,textAlign:"center"}}>{qty}</span>
                        <button onClick={e=>{e.stopPropagation();setItemQty(id, qty+1);}} style={{width:20,height:20,borderRadius:"50%",border:`1.5px solid ${HOT}`,background:WHITE,color:HOT,fontSize:13,fontWeight:300,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1}}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={()=>allAdded?null:addTheme(theme)} style={{
                ...BP,width:"100%",padding:"12px",fontSize:13,
                ...(allAdded?{background:SOFT,color:HOT,border:`1.5px solid ${HOT}`}:{}),
              }}>
                {allAdded?"✓ All Items Added":`Add ${theme.name} Set →`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Package card ─────────────────────────────────────────────────────────────
function PackageCard({ pkg, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      background:selected?pkg.bg:WHITE,
      border:selected?`2.5px solid ${pkg.border}`:`1.5px solid ${BORDER}`,
      borderRadius:18,padding:"14px 12px",cursor:"pointer",textAlign:"left",
      transition:"all 0.2s",flex:1,
      boxShadow:selected?`0 4px 18px ${pkg.border}44`:"none",
    }}>
      <div style={{fontSize:24,marginBottom:5}}>{pkg.emoji}</div>
      <div style={{fontSize:12,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:selected?pkg.headlineColor:DARK,marginBottom:2}}>{pkg.name}</div>
      <div style={{fontSize:10,color:"#bbb",fontFamily:"'Nunito',sans-serif",marginBottom:6}}>{pkg.tagline}</div>
      <div style={{fontSize:15,fontWeight:900,color:selected?pkg.headlineColor:PUNCH,fontFamily:"'Nunito',sans-serif"}}>{pkg.price}</div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DecorTab({ groupSize, cart, setCart, setTab, openCart }) {
  const [selected, setSelected] = useState([]); // shared garland colors → drives sort order in all steps

  return (
    <div style={{paddingBottom:32}}>

      {/* ── Hero ── */}
      <div style={{
        borderRadius:22,padding:"22px 18px",marginBottom:18,textAlign:"center",
        background:`linear-gradient(135deg,${SOFT} 0%,${MID} 100%)`,
        border:`1.5px solid ${MID}`,
      }}>
        <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:22,fontWeight:900,margin:"0 0 6px",color:DARK}}>
          <em style={{color:HOT}}>Build Your Decor Package</em>
        </h2>
        <p style={{fontSize:12,color:HOT,fontFamily:"'Nunito',sans-serif",margin:0,opacity:0.85,lineHeight:1.6}}>
          Pick your garland colors · shop matching tableware · check out in one go
        </p>
      </div>

      {/* ── Step 1: Balloon Garland ── */}
      <GarlandBuilder
        cart={cart||[]} setCart={setCart||(_=>{})} setTab={setTab}
        selected={selected} setSelected={setSelected}
      />

      {/* ── Step 2: Foil Balloons ── */}
      <FoilStep
        stepNum={2} selectedColors={selected}
        cart={cart||[]} setCart={setCart||(_=>{})}
      />

      {/* ── Step 3: Plates ── */}
      <ProductStep
        stepNum={3} emoji="" title="Pick Your Plates"
        subtitle=""
        type="plate" selectedColors={selected}
        cart={cart||[]} setCart={setCart||(_=>{})}
      />

      {/* ── Step 4: Cups ── */}
      <ProductStep
        stepNum={4} emoji="" title="Pick Your Cups"
        subtitle=""
        type="cup" selectedColors={selected}
        cart={cart||[]} setCart={setCart||(_=>{})}
      />

      {/* ── Step 5: Napkins ── */}
      <ProductStep
        stepNum={5} emoji="" title="Pick Your Napkins"
        subtitle=""
        type="napkin" selectedColors={selected}
        cart={cart||[]} setCart={setCart||(_=>{})}
      />

      {/* ── Step 6: Confetti ── */}
      <ConfettiStep
        stepNum={6} selectedColors={selected}
        cart={cart||[]} setCart={setCart||(_=>{})}
      />

      {/* ── Step 7: Treat Bags ── */}
      <ProductStep
        stepNum={7} emoji="" title="Pick Your Treat Bags"
        subtitle=""
        type="treatbag" selectedColors={selected}
        cart={cart||[]} setCart={setCart||(_=>{})}
      />

      {/* ── Step 8: Banners & Backdrops ── */}
      <ProductStep
        stepNum={8} emoji="" title="Banners & Backdrops"
        subtitle=""
        type="banner" selectedColors={selected}
        cart={cart||[]} setCart={setCart||(_=>{})}
      />

      {/* ── Step 9: Party Accessories ── */}
      <PartyAccessoriesStep
        stepNum={9}
        cart={cart||[]} setCart={setCart||(_=>{})}
      />

      {/* ── Curated Themes ── */}
      <CuratedThemes cart={cart||[]} setCart={setCart||(_=>{})}/>

      {/* ── Cart Summary ── */}
      {(cart||[]).length > 0 && (
        <div style={{marginTop:28,padding:"16px",borderRadius:18,background:`linear-gradient(135deg,${SOFT},${MID})`,border:`1.5px solid ${MID}`}}>
          <div style={{fontSize:14,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>🎉 Your Party Package</div>
          <div style={{fontSize:11,color:HOT,fontFamily:"'Nunito',sans-serif",marginBottom:12,opacity:0.85}}>Everything you've added — one checkout</div>
          {cart.map(item=>(
            <div key={item.id} style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontFamily:"'Nunito',sans-serif",fontSize:12}}>
              <span style={{color:DARK,flex:1,marginRight:8,lineHeight:1.4}}>{item.name}</span>
              <span style={{fontWeight:700,color:PUNCH,flexShrink:0}}>${typeof item.price==="number"?item.price.toFixed(2):item.price}</span>
            </div>
          ))}
          <div style={{height:1,background:MID,margin:"10px 0"}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Nunito',sans-serif",fontWeight:900,fontSize:15,marginBottom:14}}>
            <span style={{color:DARK}}>Total</span>
            <span style={{color:HOT}}>${cart.reduce((s,i)=>s+(typeof i.price==="number"?i.price:parseFloat(i.price)||0),0).toFixed(2)}</span>
          </div>
          <button onClick={()=>openCart?openCart():setTab&&setTab("shop")} style={{...BP,width:"100%",padding:"14px",fontSize:14}}>
            Review & Checkout →
          </button>
        </div>
      )}
    </div>
  );
}
