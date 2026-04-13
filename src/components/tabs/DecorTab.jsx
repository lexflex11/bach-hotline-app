import React, { useState, useMemo, useRef } from 'react';
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
  // ── Patterns ─────────────────────────────────────────────────────────────
  { id:"cow",       label:"Cow Print",  color:"#fff", dot:"#fff", pattern:"cow"       },
  { id:"dalmatian", label:"Dalmatian",  color:"#fff", dot:"#fff", pattern:"dalmatian" },
  { id:"confetti",  label:"Confetti",   color:"#FFB6C1", dot:"#FFB6C1", pattern:"confetti" },
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

function PatternDots({ pattern, size }) {
  if (pattern === "cow") return (
    <div style={{position:"absolute",inset:0,borderRadius:"50%",overflow:"hidden"}}>
      {[{t:"20%",l:"25%",w:10,h:13},{t:"45%",l:"55%",w:13,h:10},{t:"60%",l:"20%",w:9,h:12},{t:"30%",l:"60%",w:8,h:11}].map((s,i)=>(
        <div key={i} style={{position:"absolute",top:s.t,left:s.l,width:s.w,height:s.h,borderRadius:"40%",background:"#1a1a1a",opacity:0.75}}/>
      ))}
    </div>
  );
  if (pattern === "dalmatian") return (
    <div style={{position:"absolute",inset:0,borderRadius:"50%",overflow:"hidden"}}>
      {[{t:"15%",l:"30%",w:7,h:7},{t:"50%",l:"15%",w:6,h:6},{t:"60%",l:"55%",w:8,h:7},{t:"30%",l:"60%",w:6,h:8},{t:"70%",l:"35%",w:5,h:5}].map((s,i)=>(
        <div key={i} style={{position:"absolute",top:s.t,left:s.l,width:s.w,height:s.h,borderRadius:"50%",background:"#333",opacity:0.7}}/>
      ))}
    </div>
  );
  if (pattern === "confetti") return (
    <div style={{position:"absolute",inset:0,borderRadius:"50%",overflow:"hidden"}}>
      {["#E91E8C","#FFD700","#1E88E5","#4CAF50","#9C27B0"].map((c,i)=>(
        <div key={i} style={{position:"absolute",top:`${15+i*14}%`,left:`${10+i*15}%`,width:4,height:8,borderRadius:2,background:c,transform:`rotate(${i*35}deg)`,opacity:0.85}}/>
      ))}
    </div>
  );
  return null;
}

// ── 3D Garland Preview ────────────────────────────────────────────────────────
// Fixed balloon positions — only colors swap when user picks new palette
const GARLAND_3D_LAYOUT = [
  // [x,    y,    z,    radius, colorIndex]
  // Top-left cluster
  [-3.0,  2.8,  0.0,  0.85, 0],
  [-2.3,  3.3,  0.5,  0.65, 1],
  [-3.5,  3.2, -0.3,  0.55, 2],
  [-2.8,  2.0,  0.7,  0.45, 0],
  [-1.8,  3.0,  0.2,  0.40, 1],
  [-3.2,  2.3, -0.8,  0.30, 2],
  // Upper-middle
  [-1.2,  2.2, -0.2,  0.90, 1],
  [-0.5,  2.8,  0.6,  0.60, 2],
  [-1.5,  1.5,  0.4,  0.50, 0],
  [-0.2,  1.8, -0.5,  0.40, 1],
  [-0.8,  1.0, -0.3,  0.45, 0],
  // Center
  [ 0.5,  1.2,  0.3,  0.95, 0],
  [ 1.2,  1.8, -0.4,  0.55, 2],
  [ 0.2,  0.5,  0.7,  0.50, 1],
  [ 1.0,  0.6,  0.0,  0.45, 0],
  [ 1.6,  1.0,  0.5,  0.35, 2],
  [ 0.7, -0.2, -0.4,  0.35, 1],
  [ 0.0,  0.0,  0.5,  0.40, 2],
  [-0.3,  0.2,  0.6,  0.35, 0],
  // Lower-right
  [ 2.0,  0.0, -0.2,  0.90, 2],
  [ 2.6,  0.6,  0.5,  0.60, 0],
  [ 2.3, -0.8,  0.3,  0.55, 1],
  [ 3.0, -0.3, -0.4,  0.40, 2],
  [ 1.8, -1.2,  0.6,  0.40, 0],
  [ 2.8, -1.0,  0.1,  0.30, 1],
  [ 1.3, -0.5, -0.5,  0.35, 1],
  [ 2.0, -0.5,  0.6,  0.30, 0],
  [ 1.5, -1.5, -0.3,  0.35, 2],
  // Bottom cluster
  [ 2.5, -1.8, -0.1,  0.85, 0],
  [ 3.2, -1.5,  0.6,  0.60, 2],
  [ 2.0, -2.4,  0.4,  0.55, 1],
  [ 3.3, -2.2, -0.3,  0.45, 0],
  [ 2.7, -2.8,  0.5,  0.40, 2],
  [ 3.5, -2.6,  0.2,  0.30, 1],
  [ 0.5, -0.8,  0.3,  0.30, 0],
];

function Balloon3D({ position, radius, color }) {
  const meshRef = useRef();
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial
        color={color}
        roughness={0.28}
        metalness={0.06}
      />
    </mesh>
  );
}

function GarlandScene({ selectedColors }) {
  const palette = selectedColors.map(id => {
    const col = BALLOON_COLORS.find(c => c.id === id);
    return col ? col.color : '#ffb6c1';
  });
  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 8, 4]} intensity={1.4} castShadow />
      <directionalLight position={[-4, -2, -3]} intensity={0.35} color="#ffd0e8" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.7}
      />
      {GARLAND_3D_LAYOUT.map((b, i) => (
        <Balloon3D
          key={i}
          position={[b[0]*0.78, b[1]*0.78, b[2]*0.78]}
          radius={b[3]*1.42}
          color={palette[b[4] % palette.length]}
        />
      ))}
    </>
  );
}

function GarlandPreview({ selectedColors }) {
  if (selectedColors.length === 0) {
    return (
      <div style={{height:300,display:"flex",alignItems:"center",justifyContent:"center",background:"#fdf5f8",borderRadius:14,border:`2px dashed ${BORDER}`}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:6}}>🎈</div>
          <div style={{fontSize:12,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>Pick colors below to preview your 3D garland</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{borderRadius:14,overflow:"hidden",border:`1.5px solid ${BORDER}`,background:"#fdf5f8"}}>
      <div style={{height:300}}>
        <Canvas camera={{ position:[0, 0, 11], fov:50 }}>
          <GarlandScene selectedColors={selectedColors} />
        </Canvas>
      </div>
      <div style={{textAlign:"center",fontSize:10,color:"#bbb",fontFamily:"'DM Sans',sans-serif",padding:"5px 0 6px",background:"#fdf5f8",letterSpacing:"0.5px"}}>
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
const TABLEWARE = [
  // ── Plates (real products from bachhotlinesupplies.etsy.com) ────────────────
  {
    id:"plate-xo",       type:"plate", name:"XO Paper Plates",
    desc:"Galentine's Day Party",  price:"$12.50",
    image: null,         bg:"#F4A7B9", accent:"#CC0000",
    tags:["blush","hotpink","red","mauve","confetti"],
    etsyUrl:"https://www.etsy.com/listing/1865391529/xo-paper-plates-galentines-day-party",
  },
  {
    id:"plate-strawberry", type:"plate", name:"Strawberry Paper Plates",
    desc:"Summer Fruit Party",     price:"$13.00",
    image: null,          bg:"#E53935", accent:"#B71C1C",
    tags:["red","hotpink","blush"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"plate-star",     type:"plate", name:"Foil Star Paper Plates",
    desc:"Bachelorette Party",     price:"$12.50",
    image: null,         bg:"#D0D0D0", accent:"#A0A0A0",
    tags:["silver","white","champagne","gold"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"plate-romcom",   type:"plate", name:"RomCom Paper Plates",
    desc:"Bachelorette Party",     price:"$13.50",
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/e66bc5/7879283220/il_fullxfull.7879283220_8chy.jpg",
    bg:"#FF69B4", accent:"#E91E8C",
    tags:["hotpink","blush","lavender","confetti","mauve"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"plate-sardine",  type:"plate", name:"Sardine Can Paper Plates",
    desc:"Bachelorette Party",     price:"$13.98",
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/b22232/7879236574/il_fullxfull.7879236574_k366.jpg",
    bg:"#81D4FA", accent:"#0288D1",
    tags:["blue","mint","white"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"plate-vegas",    type:"plate", name:"Vegas Casino Paper Plates",
    desc:"Bachelorette Party",     price:"$10.95",
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/41c451/7875376356/il_fullxfull.7875376356_mnir.jpg",
    bg:"#F4A7B9", accent:"#C4956A",
    tags:["hotpink","blush","gold","champagne"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"plate-skull",    type:"plate", name:"Sugar Skull Paper Plates",
    desc:"Dia De Los Muertos",     price:"$12.66",
    image: null,         bg:"#F8F8F8", accent:"#CE93D8",
    tags:["white","lavender","mint","sage"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"plate-shootingstar", type:"plate", name:"Shooting Star Paper Plates",
    desc:"Bachelorette Party",     price:"$12.50",
    image: null,         bg:"#D0D0D0", accent:"#9E9E9E",
    tags:["silver","white","gold","champagne"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"plate-aries", type:"plate", name:"Aries Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b4c690d8-7c49-4cb4-a1c0-73aa4eb1300f/Ebook+Thumbnail+with+Video+-+2025-06-18T124935.484.png",
    bg:"#E8112D", accent:"#FFD700",
    tags:["red","scarlett","hotpink","coral","orange","burnt-orange","gold","champagne","white","crystal-red"],
  },
  {
    id:"plate-sagittarius", type:"plate", name:"Sagittarius Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767900031846/Ebook+Thumbnail+with+Video+-+2025-06-19T153901.572.png?format=1500w",
    bg:"#FF6B1A", accent:"#9C27B0",
    tags:["orange","burnt-orange","aloha","coral","purple","plum","gold","champagne","white","red","scarlett"],
  },
  {
    id:"plate-leo", type:"plate", name:"Leo Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767900052272/Ebook+Thumbnail+with+Video+-+2025-06-19T145332.931.png",
    bg:"#FFD700", accent:"#E8112D",
    tags:["gold","metallic-gold","goldenrod","yellow","lemonade","orange","burnt-orange","red","champagne","white","mustard"],
  },
  {
    id:"plate-virgo", type:"plate", name:"Virgo Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767900074561/Ebook+Thumbnail+with+Video+-+2025-06-20T144445.334.png?format=1500w",
    bg:"#76A96C", accent:"#C8A882",
    tags:["green","sage","meadow","willow","evergreen","empower-mint","fiona","lace","muse","champagne","white","gold"],
  },
  {
    id:"plate-scorpio", type:"plate", name:"Scorpio Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767900090796/Ebook+Thumbnail+with+Video+-+2025-06-20T143712.766.png?format=1500w",
    bg:"#1A1A1A", accent:"#E8112D",
    tags:["black","red","scarlett","sangria","crystal-burgundy","purple","plum","crystal-purple","orange","burnt-orange","gray-smoke","navy"],
  },
  {
    id:"plate-taurus", type:"plate", name:"Taurus Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767900108766/Ebook+Thumbnail+with+Video+-+2025-06-20T145011.368.png?format=1500w",
    bg:"#76A96C", accent:"#FFD700",
    tags:["green","meadow","sage","evergreen","empower-mint","gold","champagne","white","lace","muse","terracotta"],
  },
  {
    id:"plate-cancer", type:"plate", name:"Cancer Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767900131843/Ebook+Thumbnail+with+Video+-+2025-06-19T140359.246.png",
    bg:"#B8D8E8", accent:"#CE93D8",
    tags:["baby-blue","monet","sea-glass","seafoam","lavender","blossom","silver","white","sugar","champagne","peri"],
  },
  {
    id:"plate-libra", type:"plate", name:"Libra Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767900151827/Ebook+Thumbnail+with+Video+-+2025-06-19T151048.912.png?format=1500w",
    bg:"#F4A7B9", accent:"#FFD700",
    tags:["blush","baby-pink","pink","cameo","lavender","blossom","gold","champagne","white","silver","peri"],
  },
  {
    id:"plate-gemini", type:"plate", name:"Gemini Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767900178397/Ebook+Thumbnail+with+Video+-+2025-06-19T144433.522.png?format=1500w",
    bg:"#FFE800", accent:"#9C27B0",
    tags:["yellow","lemonade","goldenrod","lavender","purple","blossom","peri","gold","champagne","white","silver"],
  },
  {
    id:"plate-aquarius", type:"plate", name:"Aquarius Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767900202424/Ebook+Thumbnail+with+Video+-+2025-06-19T141417.059.png?format=1500w",
    bg:"#81D4FA", accent:"#0288D1",
    tags:["blue","baby-blue","monet","georgia","blue-slate","seafoam","teal","turquoise","sea-glass","navy","silver","white"],
  },
  {
    id:"plate-pisces", type:"plate", name:"Pisces Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767900598923/Ebook+Thumbnail+with+Video+-+2025-06-19T153612.085.png?format=1500w",
    bg:"#68DACA", accent:"#9C27B0",
    tags:["seafoam","teal","turquoise","sea-glass","baby-blue","lavender","purple","blossom","silver","white","monet"],
  },
  {
    id:"plate-capricorn", type:"plate", name:"Capricorn Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.66",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767900624866/Ebook+Thumbnail+with+Video+-+2025-06-19T143322.139.png?format=1500w",
    bg:"#1A1A1A", accent:"#C8A882",
    tags:["black","navy","metallic-midnight-blue","stone","muse","lace","champagne","silver","gold","metallic-gold","evergreen"],
  },
  {
    id:"plate-zodiac", type:"plate", name:"Zodiac Plates",
    desc:"8 ct · 7.25\" x 7.25\"", price:"$12.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767900652929/Ebook+Thumbnail+with+Video+-+2025-06-20T154150.275.png",
    bg:"#1A1A1A", accent:"#FFD700",
    tags:["black","gold","metallic-gold","champagne","purple","plum","lavender","silver","navy","metallic-midnight-blue","white"],
  },
  {
    id:"plate-shooting-star", type:"plate", name:"Shooting Star Plates",
    desc:"4 ct · 19.25\" x 9\"", price:"$12.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/690d45e9b0c4a7226c513c4e/1767900673093/Ebook+Thumbnail+with+Video+-+2025-07-20T111448.980.png?format=1500w",
    bg:"#D0D0D0", accent:"#FFD700",
    tags:["silver","gold","metallic-gold","white","champagne","crystal-clear","black","navy","metallic-midnight-blue"],
  },
  {
    id:"plate-queen-playing-card", type:"plate", name:"Queen Playing Card Plates",
    desc:"8 ct · 6\" x 9\"", price:"$12.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/690d25d9dd14c753a31b50be/1767900692108/Ebook+Thumbnail+with+Video+-+2025-05-18T120552.586.png?format=1500w",
    bg:"#E8112D", accent:"#FFB5C2",
    tags:["red","scarlett","hotpink","blush","baby-pink","pink","black","white","gold","crystal-red"],
  },
  {
    id:"plate-lunar-dragon", type:"plate", name:"Lunar Dragon Plates",
    desc:"12 ct · 9\" x 9\"", price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b84ae199-7202-4eef-b3dd-114e67b293bc/Ebook+Thumbnail+with+Video+-+2025-05-13T192702.718.png",
    bg:"#E8112D", accent:"#FFD700",
    tags:["red","scarlett","gold","metallic-gold","black","orange","burnt-orange","champagne","white","crystal-red"],
  },
  {
    id:"plate-butterfly", type:"plate", name:"Butterfly Plates",
    desc:"8 ct · 10\" x 10\"", price:"$16.25",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767828084540/Ebook+Thumbnail+with+Video+-+2025-01-30T083952.589.png?format=1500w",
    bg:"#CE93D8", accent:"#FFD700",
    tags:["lavender","purple","blossom","peri","blush","baby-pink","gold","champagne","mint","sea-glass","white","sugar"],
  },
  {
    id:"plate-cowboy-hat", type:"plate", name:"Cowboy Hat Plates",
    desc:"8 ct · 9\" x 12\"", price:"$10.33",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f6eeb6ea-f9d2-470d-b1f9-3c63121230a4/Ebook+Thumbnail+with+Video+-+2025-05-08T102554.943.png",
    bg:"#C8A882", accent:"#1A1A1A",
    tags:["muse","malted","stone","lace","terracotta","champagne","burnt-orange","black","cocoa","mustard"],
  },
  {
    id:"plate-clam-shell", type:"plate", name:"Clam Shell Plates",
    desc:"8 ct · 7.25\" x 7.25\"", price:"$13.56",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68488e361ef4b52dec057a41/1767900799147/Ebook+Thumbnail+with+Video+-+2025-06-07T180250.169.png?format=1500w",
    bg:"#A8D8D8", accent:"#FFD700",
    tags:["sea-glass","seafoam","teal","turquoise","baby-blue","monet","mint","champagne","gold","white","lace"],
  },
  {
    id:"plate-disco-daisy-van", type:"plate", name:"Disco Daisy Van Plates",
    desc:"8 ct · 9\" x 9\"", price:"$13.76",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767900988207/Ebook+Thumbnail+with+Video+-+2025-05-08T104844.492.png?format=1500w",
    bg:"#FFE800", accent:"#E91E8C",
    tags:["yellow","lemonade","hotpink","orange","green","lime-green","blue","lavender","white","confetti","rainbow"],
  },
  {
    id:"plate-cowgirl-hat", type:"plate", name:"Cowgirl Hat Plates",
    desc:"8 ct · 9\" x 12\"", price:"$13.80",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6849976ab91f060aa521e0e5/1767901042792/Ebook+Thumbnail+with+Video+-+2025-05-08T102554.943.png?format=1500w",
    bg:"#F4A7B9", accent:"#C4956A",
    tags:["hotpink","blush","baby-pink","pink","cameo","terracotta","muse","malted","champagne","lace","canyon-rose"],
  },
  {
    id:"plate-book-of-spells", type:"plate", name:"Book of Spells Plates",
    desc:"8 ct · 9\" x 6\"", price:"$12.68",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68acd848c1bfc45b6dc3764b/1767901009483/Ebook+Thumbnail+with+Video+-+2025-07-10T170217.337.png?format=1500w",
    bg:"#1A1A1A", accent:"#CE93D8",
    tags:["black","purple","plum","crystal-purple","sangria","lavender","evergreen","metallic-forest-green","gray-smoke","orange"],
  },
  {
    id:"plate-zebra", type:"plate", name:"Zebra Plates",
    desc:"8 ct · 8\" x 8\"", price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767901076534/Ebook+Thumbnail+with+Video+-+2025-07-05T094202.906.png?format=1500w",
    bg:"#F8F8F8", accent:"#1A1A1A",
    tags:["white","black","hotpink","pink","blush","silver","gray-smoke","crystal-clear","sugar"],
  },
  {
    id:"plate-retro-blooms", type:"plate", name:"Retro Blooms Plates",
    desc:"8 ct · 9\" x 9\"", price:"$15.78",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/690cc785dc1bc40ece1c8483/1767901099850/Ebook+Thumbnail+with+Video+-+2025-11-06T112025.926.png?format=1500w",
    bg:"#FF9B7A", accent:"#4CAF50",
    tags:["orange","coral","burnt-orange","aloha","yellow","lemonade","green","lime-green","hotpink","taffy","turquoise"],
  },
  {
    id:"plate-heartbeat-gang", type:"plate", name:"Heartbeat Gang Plates",
    desc:"8 ct · 7.5\" x 7.5\"", price:"$12.76",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767901170761/Ebook+Thumbnail+with+Video+-+2025-11-06T162327.491.png",
    bg:"#E8112D", accent:"#FFB5C2",
    tags:["red","scarlett","hotpink","blush","baby-pink","coral","pink","white","gold","champagne"],
  },
  {
    id:"plate-lemon-zest", type:"plate", name:"Lemon Zest Plates",
    desc:"8 ct · 8.5\" round", price:"$10.25",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69501ea618bbbd208c522116/1768078219828/Ebook+Thumbnail+with+Video-379.png?format=1500w",
    bg:"#FFEA5A", accent:"#4CAF50",
    tags:["yellow","lemonade","goldenrod","mustard","lime-green","green","meadow","white","sugar","crystal-yellow"],
  },
  {
    id:"plate-girl-power", type:"plate", name:"Girl Power Plates",
    desc:"8 ct · 7.5\" x 7.5\"", price:"$12.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68487d911ef4b52dec0565fb/1767901315872/Ebook+Thumbnail+with+Video+-+2025-05-18T120725.978.png?format=1500w",
    bg:"#F4A7B9", accent:"#C0C0C0",
    tags:["blush","hotpink","baby-pink","pink","lavender","white","silver","champagne","gold","sugar","peri","blossom"],
  },
  {
    id:"plate-vinyl-disco", type:"plate", name:"Vinyl Disco Plates",
    desc:"8 ct · 9\" x 9\"", price:"$11.22",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68ebfd05c8d07324547aaea0/1767901345848/Ebook+Thumbnail+with+Video-123.png?format=1500w",
    bg:"#1A1A1A", accent:"#C0C0C0",
    tags:["black","silver","gray-smoke","fog","metallic-blue","navy","purple","plum","hotpink","metallic-fuchsia","metallic-midnight-blue"],
  },
  {
    id:"plate-yolks", type:"plate", name:"Yolks on You Plates",
    desc:"8 ct · 9\" x 9\"", price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767901360809/Ebook+Thumbnail+with+Video+-+2025-05-11T155238.849.png",
    bg:"#FFE800", accent:"#FF6B1A",
    tags:["yellow","lemonade","goldenrod","mustard","orange","aloha","cheeky","white","sugar","champagne"],
  },
  {
    id:"plate-monsters-eye", type:"plate", name:"Monsters Eye Plates",
    desc:"8 ct · 7.5\" x 7.5\"", price:"$15.23",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68ba53d90ddc3c70e0e57097/1767901398270/Ebook+Thumbnail+with+Video+-+2025-09-04T221241.884.png?format=1500w",
    bg:"#4CAF50", accent:"#E91E8C",
    tags:["green","lime-green","evergreen","metallic-green","black","purple","plum","orange","burnt-orange","gray-smoke"],
  },
  {
    id:"plate-sweet-spots", type:"plate", name:"Sweet Spots Plates",
    desc:"8 ct · 7\" x 7\"", price:"$12.66",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68ba43aa91ca2a75c5a96789/1767901430686/Ebook+Thumbnail+with+Video+-+2025-07-10T190101.641.png?format=1500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    tags:["blush","hotpink","pink","baby-pink","white","sugar","champagne","gold","lavender","mauve"],
  },
  {
    id:"plate-olive", type:"plate", name:"Olive Plates",
    desc:"8 ct · 6.75\" x 8\"", price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767901447821/Ebook+Thumbnail+with+Video+-+2025-07-06T205033.943.png?format=1500w",
    bg:"#76A96C", accent:"#C8A882",
    tags:["green","meadow","sage","willow","evergreen","empower-mint","fiona","olive","terracotta","muse","lace","champagne"],
  },
  {
    id:"plate-witchy-hat", type:"plate", name:"Witchy Hat Plates",
    desc:"8 ct · 12.5\" x 11.5\"", price:"$15.54",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b8e3ddd0ce84605cb7f6e8/1767899967128/Ebook+Thumbnail+with+Video+-+2025-08-27T224152.162.png?format=1500w",
    bg:"#1A1A1A", accent:"#9C27B0",
    tags:["black","purple","plum","crystal-purple","sangria","orange","burnt-orange","evergreen","gray-smoke","metallic-midnight-blue"],
  },
  {
    id:"plate-frills-thrills", type:"plate", name:"Frills & Thrills Plates",
    desc:"8 ct · 8.25\" x 8.25\"", price:"$16.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b8d9eff5b31a6537947025/1767899945602/Ebook+Thumbnail+with+Video+-+2025-09-02T173858.536.png?format=1500w",
    bg:"#FFB5C2", accent:"#E91E8C",
    tags:["hotpink","blush","baby-pink","pink","cameo","coral","taffy","lavender","white","sugar","gold","champagne"],
  },
  {
    id:"plate-camp-bach", type:"plate", name:"Camp Bachelorette Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68acdc1610a90473ab295ae8/1767899924417/Ebook+Thumbnail+with+Video+-+2025-11-06T123554.536.png?format=1500w",
    bg:"#76A96C", accent:"#C4956A",
    tags:["green","sage","evergreen","meadow","willow","empower-mint","terracotta","burnt-orange","muse","stone","lace","champagne"],
  },
  {
    id:"plate-rock-on-skeleton", type:"plate", name:"Rock On Skeleton Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/690cf49b03d8727c4c7c0abc/1767899702325/Ebook+Thumbnail+with+Video+-+2025-11-07T112344.695.png?format=1500w",
    bg:"#1A1A1A", accent:"#E91E8C",
    tags:["black","gray-smoke","hotpink","red","scarlett","purple","plum","metallic-starfire-red","white","silver"],
  },
  {
    id:"plate-sugar-skull", type:"plate", name:"Sugar Skull Plates",
    desc:"8 ct · 10\" x 7.25\"", price:"$12.66",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b9d7f2bb187f4ec7c279e0/1767899670354/Ebook+Thumbnail+with+Video+-+2025-07-20T134000.393.png?format=1500w",
    bg:"#CE93D8", accent:"#E91E8C",
    tags:["purple","lavender","plum","crystal-purple","hotpink","coral","orange","yellow","lemonade","teal","turquoise","black","white"],
  },
  {
    id:"plate-penis", type:"plate", name:"Penis Plates",
    desc:"25 ct · 5\" x 7\"", price:"$13.03",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767899624325/Ebook+Thumbnail+with+Video+-+2025-02-16T113626.828.png?format=1500w",
    bg:"#F4A7B9", accent:"#E91E8C",
    tags:["hotpink","blush","pink","baby-pink","coral","taffy","pixie","metallic-fuchsia","white","gold","champagne"],
  },
  {
    id:"plate-summer-bow", type:"plate", name:"Summer Bow Plates",
    desc:"8 ct · 9\" x 9\"", price:"$13.21",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767899563444/Ebook+Thumbnail+with+Video+-+2025-06-06T130811.387.png?format=1500w",
    bg:"#FFB5C2", accent:"#FFD700",
    tags:["hotpink","blush","baby-pink","pink","cameo","coral","gold","champagne","white","sugar","lemonade","yellow"],
  },
  {
    id:"plate-rainbow", type:"plate", name:"Rainbow Plates",
    desc:"8 ct · 9\" x 6\"", price:"$12.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684881ae36c31823d93e6e25/1767899537951/Ebook+Thumbnail+with+Video+-+2025-05-08T105007.289.png?format=1500w",
    bg:"#FFE800", accent:"#E91E8C",
    tags:["confetti","hotpink","red","orange","yellow","lemonade","green","blue","lavender","turquoise","coral","lime-green"],
  },
  {
    id:"plate-queen-of-hearts", type:"plate", name:"Queen of Hearts Plates",
    desc:"8 ct · 8\" x 10\"", price:"$14.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/01f64bcb-5201-49c6-a7f7-14919103f9f3/Ebook+Thumbnail+with+Video+-+2025-06-08T010753.060.png",
    bg:"#E8112D", accent:"#FFD700",
    tags:["red","scarlett","samba","hotpink","crystal-red","gold","metallic-gold","black","white","sangria","crystal-burgundy"],
  },
  {
    id:"plate-ephemera-skeleton", type:"plate", name:"Ephemera Skeleton Plates",
    desc:"8 ct · 5.5\" x 9\"", price:"$12.10",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6793bc8c6c9a8e41d1c331e4/1767899122995/Ebook+Thumbnail+with+Video+-+2025-01-26T154613.995.png?format=1500w",
    bg:"#1A1A1A", accent:"#CE93D8",
    tags:["black","purple","plum","crystal-purple","sangria","lavender","gray-smoke","white","fog","evergreen"],
  },
  {
    id:"plate-ditzy-floral", type:"plate", name:"Ditzy Floral Plates",
    desc:"8 ct · 9\" x 9\"", price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767897939002/Ebook+Thumbnail+with+Video+-+2025-01-30T095126.115.png?format=1500w",
    bg:"#F4A7B9", accent:"#76A96C",
    tags:["blush","hotpink","pink","baby-pink","coral","lavender","meadow","green","sage","willow","empower-mint","fiona","white","sugar"],
  },
  {
    id:"plate-red-bow", type:"plate", name:"Red Bow Plates",
    desc:"8 ct · 9\" x 9\"", price:"$12.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6793bc23268ad1226ad3646a/1767899095891/Ebook+Thumbnail+with+Video+-+2025-01-25T135854.526.png?format=1500w",
    bg:"#E8112D", accent:"#FFD700",
    tags:["red","scarlett","samba","crystal-red","gold","metallic-gold","champagne","white","black","sangria"],
  },
  {
    id:"plate-let-love-bloom", type:"plate", name:"Let Love Bloom Plates",
    desc:"8 ct · 9\" x 9\"", price:"$11.48",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6793bc689ae1111daaf83736/1767899074707/Ebook+Thumbnail+with+Video+-+2025-01-25T183851.969.png?format=1500w",
    bg:"#F4A7B9", accent:"#76A96C",
    tags:["blush","hotpink","pink","baby-pink","coral","lavender","meadow","green","sage","willow","empower-mint","yellow","lemonade"],
  },
  {
    id:"plate-floral-skull", type:"plate", name:"Floral Skull Spider Plates",
    desc:"8 ct · 8.25\" round", price:"$10.00",
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
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68abcdaa27630e0353af3e1b/1767898930623/Ebook+Thumbnail+with+Video+-+2025-11-07T113409.047.png?format=1500w",
    bg:"#A8D8D8", accent:"#C8A882",
    tags:["seafoam","teal","sea-glass","turquoise","mint","monet","baby-blue","lace","muse","stone","champagne","white"],
  },
  {
    id:"plate-strawberry", type:"plate", name:"Strawberry Plates",
    desc:"8 ct · 7\" x 10\"", price:"$13.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67919be89ae1111daaf68616/1767898896518/Ebook+Thumbnail+with+Video+-+2025-01-22T193036.107.png?format=1500w",
    bg:"#E53935", accent:"#4CAF50",
    tags:["red","scarlett","hotpink","blush","coral","baby-pink","pink","green","lime-green","white","sugar"],
  },
  {
    id:"plate-happy-disco", type:"plate", name:"Happy Disco Plates",
    desc:"8 ct · 7\" x 7\"", price:"$12.22",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767898868490/Ebook+Thumbnail+with+Video+-+2025-05-18T191748.541.png?format=1500w",
    bg:"#E91E8C", accent:"#FF6B1A",
    tags:["hotpink","orange","coral","taffy","aloha","cheeky","pixie","metallic-fuchsia","yellow","lemonade","burnt-orange"],
  },
  {
    id:"plate-checkered-heart", type:"plate", name:"Checkered Heart Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767898846535/Ebook+Thumbnail+with+Video+-+2025-01-23T140517.309.png?format=1500w",
    bg:"#E91E8C", accent:"#1A1A1A",
    tags:["hotpink","pink","blush","baby-pink","red","scarlett","black","white","crystal-magenta","metallic-fuchsia","pixie"],
  },
  {
    id:"plate-sweet-strawberry", type:"plate", name:"Sweet Strawberry Plates",
    desc:"8 ct · 8.5\" x 8.5\"", price:"$11.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684a16ceb91f060aa5226859/1767898822640/Ebook+Thumbnail+with+Video+-+2025-05-18T120736.773.png?format=1500w",
    bg:"#E53935", accent:"#4CAF50",
    tags:["red","scarlett","hotpink","blush","coral","taffy","baby-pink","pink","green","lime-green","white","sugar"],
  },
  {
    id:"plate-diamond", type:"plate", name:"Diamond Plates",
    desc:"8 ct · 10.5\" x 10.5\"", price:"$16.23",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b7912a64121927f4c30afe/1767898776985/Ebook+Thumbnail+with+Video+-+2025-08-27T221852.336.png?format=1500w",
    bg:"#1A1A1A", accent:"#CE93D8",
    tags:["black","purple","plum","crystal-purple","sangria","lavender","silver","metallic-silver","gray-smoke","fog","crystal-clear"],
  },
  {
    id:"plate-spooky-icons", type:"plate", name:"Spooky Icons Plates",
    desc:"8 ct · 9\" round", price:"$14.38",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767898758872/Ebook+Thumbnail+with+Video+-+2025-01-23T112234.965.png?format=1500w",
    bg:"#1A1A1A", accent:"#9C27B0",
    tags:["black","purple","plum","crystal-purple","sangria","evergreen","metallic-forest-green","orange","burnt-orange","gray-smoke"],
  },
  {
    id:"plate-spicy-bottle", type:"plate", name:"Spicy Bottle Canape Plates",
    desc:"8 ct · 2.5\" x 5.5\"", price:"$10.22",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767898551264/Ebook+Thumbnail+with+Video+-+2025-05-11T155124.164.png?format=1500w",
    bg:"#E8112D", accent:"#FF6B1A",
    tags:["red","scarlett","samba","crystal-red","orange","burnt-orange","taffy","coral","hotpink","black"],
  },
  {
    id:"plate-shimmer-cake", type:"plate", name:"Shimmer Birthday Cake Plates",
    desc:"8 ct · 7.5\" x 9.5\"", price:"$14.36",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684af95264f4dd59c05b309d/1767898630517/Ebook+Thumbnail+with+Video+-+2025-05-12T192943.480.png?format=1500w",
    bg:"#F5DEB3", accent:"#FFD700",
    tags:["champagne","gold","metallic-gold","silver","white","sugar","lace","blush","baby-pink","lavender","crystal-clear"],
  },
  {
    id:"plate-swan", type:"plate", name:"Swan Plates",
    desc:"8 ct · 11.5\" x 7.5\"", price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767898667035/Ebook+Thumbnail+with+Video+-+2025-05-11T155407.049.png?format=1500w",
    bg:"#F8F8F8", accent:"#FFD700",
    tags:["white","sugar","champagne","gold","metallic-gold","silver","lace","blush","baby-pink","monet"],
  },
  {
    id:"plate-denim-star", type:"plate", name:"Denim Star Stripes Plates",
    desc:"8 ct · 9\" x 9\"", price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767898646461/Ebook+Thumbnail+with+Video+-+2025-05-09T083705.780.png?format=1500w",
    bg:"#1A3A6B", accent:"#E8112D",
    tags:["navy","naval","blue","royalty","metallic-blue","red","scarlett","white","crystal-sapphire","blue-slate"],
  },
  {
    id:"plate-hello-kitty", type:"plate", name:"Hello Kitty Plates",
    desc:"8 ct · 8\" x 8\"", price:"$12.58",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684ae85e64f4dd59c05b2093/1767898689607/Ebook+Thumbnail+with+Video+-+2025-05-18T191011.864.png?format=1500w",
    bg:"#FFB5C2", accent:"#E91E8C",
    tags:["hotpink","blush","baby-pink","pink","cameo","white","sugar","red","scarlett","lavender"],
  },
  {
    id:"plate-wildflowers", type:"plate", name:"Wildflowers Plates",
    desc:"8 ct · 9\" x 9.25\"", price:"$14.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6849a8b1b7ad9e539ec6699e/1767898737677/Ebook+Thumbnail+with+Video+-+2025-05-18T120815.577.png?format=1500w",
    bg:"#76A96C", accent:"#F87171",
    tags:["meadow","green","sage","willow","empower-mint","fiona","coral","blush","baby-pink","lemonade","yellow","lavender"],
  },
  {
    id:"plate-hot-wheels", type:"plate", name:"Hot Wheels Checker Plates",
    desc:"8 ct · 10\" round", price:"$10.12",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69601037c85bb24f5c846130/1767917635112/Ebook+Thumbnail+with+Video-407.png?format=1500w",
    bg:"#E8112D", accent:"#1A1A1A",
    tags:["red","scarlett","samba","crystal-red","orange","burnt-orange","black","yellow","lemonade"],
  },
  {
    id:"plate-bananas", type:"plate", name:"Bananas For You Plates",
    desc:"8 ct · 10\" x 10\"", price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68abc56727630e0353af3741/1767904124668/Ebook+Thumbnail+with+Video-401.png?format=1500w",
    bg:"#FFE800", accent:"#4CAF50",
    tags:["yellow","lemonade","goldenrod","mustard","lime-green","green","meadow","orange","aloha","cheeky"],
  },
  {
    id:"plate-summer-cake", type:"plate", name:"Summer Cake Plates",
    desc:"8 ct · 7.5\" x 11\"", price:"$14.04",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684999f51ef4b52dec0631cd/1767898324611/Ebook+Thumbnail+with+Video+-+2025-06-13T132740.712.png?format=1500w",
    bg:"#FFEA5A", accent:"#FF6B8A",
    tags:["yellow","lemonade","goldenrod","hotpink","coral","taffy","blush","baby-pink","turquoise","seafoam","mint"],
  },
  {
    id:"plate-happy-face", type:"plate", name:"Happy Face Plates",
    desc:"8 ct · 10.5\" x 10.5\"", price:"$16.30",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6848ae27cc6de75b44de261f/1767898403813/Ebook+Thumbnail+with+Video+-+2025-05-18T120745.117.png?format=1500w",
    bg:"#FFE800", accent:"#E91E8C",
    tags:["yellow","lemonade","hotpink","pink","coral","mint","turquoise","lavender","rainbow","confetti"],
  },
  {
    id:"plate-silver-disco", type:"plate", name:"Silver Disco Plates",
    desc:"8 ct · 9\" x 9\"", price:"$12.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6793bc8ca165a16c98b66474/1767898308845/Ebook+Thumbnail+with+Video+-+2025-01-27T125554.572.png?format=1500w",
    bg:"#D0D0D0", accent:"#9E9E9E",
    tags:["silver","white","crystal-clear","fog","gray-smoke","metallic-blue","navy","naval","metallic-midnight-blue","metallic-green","metallic-fuchsia","metallic-gold"],
  },
  {
    id:"plate-jaguar", type:"plate", name:"Jaguar Plates",
    desc:"8 ct · 8.75\" x 7.5\"", price:"$13.56",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767898290723/Ebook+Thumbnail+with+Video+-+2025-06-07T234024.878.png?format=1500w",
    bg:"#C8A882", accent:"#1A1A1A",
    tags:["muse","malted","terracotta","stone","cocoa","lace","champagne","orange","burnt-orange","mustard","black"],
  },
  {
    id:"plate-daisy", type:"plate", name:"Daisy Plates",
    desc:"12 ct · 9\" x 9\"", price:"$12.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684894bb1ef4b52dec058349/1767555917671/Ebook+Thumbnail+with+Video+-+2025-06-07T171246.235.png?format=1500w",
    bg:"#FFEE00", accent:"#4CAF50",
    tags:["yellow","lemonade","goldenrod","white","green","lime-green","meadow","empower-mint","sugar"],
  },
  {
    id:"plate-pastel-stripe", type:"plate", name:"Pastel Stripe Plates",
    desc:"8 ct · 9\" x 9\"", price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b3ef3e6e-10ae-42c2-90f1-74697391dae0/Ebook+Thumbnail+with+Video+-+2025-12-29T210340.995.png",
    bg:"#F4A7B9", accent:"#FFD700",
    tags:["blush","lavender","mint","baby-blue","baby-pink","gold","champagne","sugar","lemonade","monet","sea-glass"],
  },
  {
    id:"plate-disco-cherry", type:"plate", name:"Disco Cherry Drink Plates",
    desc:"8 ct · 9\" x 9\"", price:"$12.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684aeb982427cd1f49ac1344/1767473564389/Ebook+Thumbnail+with+Video+-+2025-05-18T120827.502.png?format=1500w",
    bg:"#E91E8C", accent:"#9C27B0",
    tags:["hotpink","red","scarlett","crystal-red","purple","plum","crystal-purple","sangria","metallic-fuchsia"],
  },
  {
    id:"plate-cactus", type:"plate", name:"Cactus Plates",
    desc:"8 ct · 8.5\" x 9\"", price:"$13.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6791a5e79ae1111daaf6920f/1767898212097/Ebook+Thumbnail+with+Video+-+2025-01-22T201457.935.png?format=1500w",
    bg:"#4CAF50", accent:"#C4956A",
    tags:["green","lime-green","evergreen","meadow","sage","empower-mint","terracotta","orange","mustard"],
  },
  {
    id:"plate-pink-pony-club", type:"plate", name:"Pink Pony Club Plates",
    desc:"24 ct · 9\" x 9\"", price:"$17.22",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6848a1a41ef4b52dec059186/1767557348516/Ebook+Thumbnail+with+Video+-+2025-05-18T120703.581.png?format=1500w",
    bg:"#F4A7B9", accent:"#C4956A",
    tags:["hotpink","blush","pink","baby-pink","cameo","mauve","canyon-rose","terracotta","champagne"],
  },
  {
    id:"plate-foil-star", type:"plate", name:"Foil Star Plates",
    desc:"8 ct · 11\" x 11\"", price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767897977380/Ebook+Thumbnail+with+Video+-+2025-01-22T204555.167.png?format=1500w",
    bg:"#D0D0D0", accent:"#9E9E9E",
    tags:["silver","white","gold","champagne","crystal-clear","fog","gray-smoke","metallic-gold"],
  },
  {
    id:"plate-blue-floral", type:"plate", name:"Blue Floral Plates",
    desc:"12 ct · 10\" x 10\"", price:"$13.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67928a2ea165a16c98b562e9/1767557636786/Ebook+Thumbnail+with+Video+-+2025-01-23T122858.717.png?format=1500w",
    bg:"#B8D8E8", accent:"#0084C1",
    tags:["blue","baby-blue","monet","georgia","blue-slate","seafoam","sea-glass","mint","lavender"],
  },
  {
    id:"plate-roller-skate", type:"plate", name:"Roller Skate Plates",
    desc:"8 ct · 7\" x 10\"",  price:"$13.90",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684b09e90a63794fee8a6a3d/1767898444935/Ebook+Thumbnail+with+Video+-+2025-05-12T190919.641.png?format=1500w",
    bg:"#4CAF50", accent:"#388E3C",
    tags:["green","lime-green","meadow","empower-mint","mint","sage","evergreen"],
  },
  {
    id:"plate-flaming-heart", type:"plate", name:"Flaming Heart Plates",
    desc:"8 ct · 9\" x 12\"",  price:"$13.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68486d8cb91f060aa5210568/1767827872670/Ebook+Thumbnail+with+Video+-+2025-06-07T231851.197.png?format=1500w",
    bg:"#E53935", accent:"#FF6B1A",
    tags:["red","orange","hotpink","scarlett","samba","coral","taffy"],
  },
  {
    id:"plate-fire-checker", type:"plate", name:"Fire Flames Checker Plates",
    desc:"8 ct · 10.75\"",   price:"$10.12",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69604843095f8b783bc99ee0/1767921199759/Ebook+Thumbnail+with+Video-411.png?format=1500w",
    bg:"#1A3A6B", accent:"#FF6B1A",
    tags:["blue","orange","red","black","navy"],
  },
  // ── Napkins ───────────────────────────────────────────────────────────────────
  {
    id:"napkin-black-heart", type:"napkin", name:"Mini Heart Napkins",
    desc:"24 ct · 5\" x 5\"", price:"$9.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/679b92dd268ad1226ad9e6b9/1767921905280/Ebook+Thumbnail+with+Video+-+2025-01-30T091042.364.png?format=1500w",
    bg:"#1A1A1A", accent:"#E8112D",
    tags:["black","gray-smoke","silver","white","red","scarlett","hotpink","sangria","crystal-burgundy","navy","purple"],
  },
  {
    id:"napkin-dirty", type:"napkin", name:"I Like It Dirty Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$12.62",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684875571ef4b52dec055da0/1767921918181/Ebook+Thumbnail+with+Video+-+2025-06-07T235757.012.png?format=1500w",
    bg:"#1A1A1A", accent:"#C0C0C0",
    tags:["black","silver","gray-smoke","white","navy","metallic-midnight-blue","fog","crystal-clear","gold","champagne"],
  },
  {
    id:"napkin-kiss-me", type:"napkin", name:"Kiss Me Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$10.94",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68abbf9210a90473ab2884c6/1767921928321/Ebook+Thumbnail+with+Video+-+2025-11-06T093347.207.png?format=1500w",
    bg:"#E8112D", accent:"#FFB5C2",
    tags:["red","scarlett","hotpink","blush","baby-pink","pink","coral","taffy","sangria","crystal-burgundy","white","sugar"],
  },
  {
    id:"napkin-love-heart", type:"napkin", name:"Love Heart Napkins",
    desc:"24 ct · 5\" x 5\"", price:"$9.99",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6953400f3a0c95476cd12595/1767921944923/Ebook+Thumbnail+with+Video+-+2025-12-29T205724.491.png?format=1500w",
    bg:"#E8112D", accent:"#FFB5C2",
    tags:["red","scarlett","hotpink","blush","baby-pink","pink","coral","taffy","white","sugar","champagne","lavender","black","gray-smoke","lace","muse","stone","fog","crystal-clear"],
  },
  {
    id:"napkin-wavy", type:"napkin", name:"Wavy Napkins",
    desc:"16 ct · 8\" x 5\"", price:"$10.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767921956868/Ebook+Thumbnail+with+Video+-+2025-12-29T205103.659.png",
    bg:"#29B6F6", accent:"#FFD700",
    tags:["blue","baby-blue","turquoise","teal","seafoam","sea-glass","yellow","lemonade","orange","coral","burnt-orange","aloha","green","lime-green","meadow","empower-mint","white","champagne"],
  },
  {
    id:"napkin-yes-girl", type:"napkin", name:"Yes Girl Napkins",
    desc:"20 ct · 6\" x 6\"", price:"$11.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6951959c18bbbd208c52f899/1767921977792/Ebook+Thumbnail+with+Video-53.png?format=1500w",
    bg:"#E91E8C", accent:"#FFD700",
    tags:["hotpink","blush","baby-pink","pink","gold","champagne","white","lavender","confetti","metallic-fuchsia"],
  },
  {
    id:"napkin-necktie", type:"napkin", name:"Necktie Napkins",
    desc:"18 ct · 7.75\" x 3.75\"", price:"$13.82",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/690cc785b0c4a7226c50976b/1767921991898/Ebook+Thumbnail+with+Video+-+2025-07-10T203419.976.png?format=1500w",
    bg:"#1A1A1A", accent:"#E91E8C",
    tags:["black","navy","naval","metallic-midnight-blue","white","silver","gray-smoke","hotpink","red","scarlett","gold"],
  },
  {
    id:"napkin-stay-fierce", type:"napkin", name:"Stay Fierce Napkins",
    desc:"16 ct · 6\" x 7.75\"", price:"$8.36",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767922026611/Ebook+Thumbnail+with+Video+-+2026-01-06T164649.173.png?format=1500w",
    bg:"#E91E8C", accent:"#FFD700",
    tags:["hotpink","blush","pink","baby-pink","gold","metallic-gold","champagne","orange","burnt-orange","terracotta","muse","malted"],
  },
  {
    id:"napkin-tying-knot", type:"napkin", name:"Tying The Knot Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$11.22",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/690bedadf5e03b6b9ab2dbc7/1767922046903/Ebook+Thumbnail+with+Video+-+2025-11-06T084457.159.png?format=1500w",
    bg:"#F8F8F8", accent:"#B8D8E8",
    tags:["white","sugar","crystal-clear","lace","baby-blue","monet","silver","champagne","blush","lavender","fog"],
  },
  {
    id:"napkin-ring-box", type:"napkin", name:"Ring Box Napkins",
    desc:"16 ct · 5\" x 5\"", price:"$12.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/690be610f5e03b6b9ab2d454/1767922066865/Ebook+Thumbnail+with+Video+-+2025-05-18T171533.911.png?format=1500w",
    bg:"#F8F8F8", accent:"#FFD700",
    tags:["white","sugar","crystal-clear","silver","gold","metallic-gold","champagne","blush","baby-pink","lace"],
  },
  {
    id:"napkin-chill-pill", type:"napkin", name:"Chill Pill Napkins",
    desc:"16 ct · 8\" x 4.25\"", price:"$14.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/690be3f903d8727c4c7b20ac/1767922096092/Ebook+Thumbnail+with+Video+-+2025-07-10T205820.627.png?format=1500w",
    bg:"#B8D8E8", accent:"#C0C0C0",
    tags:["blue","baby-blue","monet","georgia","blue-slate","royalty","navy","crystal-sapphire","white","sugar","crystal-clear","silver","fog","gray-smoke"],
  },
  {
    id:"napkin-drink-up", type:"napkin", name:"Drink Up Bitches Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$14.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/690a9f6a03d8727c4c79e7d9/1767922112019/Ebook+Thumbnail+with+Video+-+2025-11-04T185532.784.png?format=1500w",
    bg:"#9C27B0", accent:"#E91E8C",
    tags:["purple","plum","crystal-purple","lavender","blossom","peri","hotpink","blush","baby-pink","pink","white","sugar","crystal-clear"],
  },
  {
    id:"napkin-sun-cabana", type:"napkin", name:"Sun Kissed Cabana Napkins",
    desc:"20 ct · 7.75\" x 4.25\"", price:"$12.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68ba086fbb187f4ec7c2bf9c/1767922122644/Ebook+Thumbnail+with+Video+-+2025-08-27T223748.256.png?format=1500w",
    bg:"#9C27B0", accent:"#FF6B1A",
    tags:["purple","plum","lavender","blossom","orange","burnt-orange","aloha","coral","gold","champagne","white"],
  },
  {
    id:"napkin-orchid", type:"napkin", name:"Orchid Napkins",
    desc:"16 ct · 6\" x 6\"", price:"$14.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b8e9d781cdb105e8e968e5/1767922135971/Ebook+Thumbnail+with+Video+-+2025-11-05T171549.970.png?format=1500w",
    bg:"#00A591", accent:"#FFD700",
    tags:["teal","turquoise","seafoam","metallic-teal","hotpink","crystal-magenta","metallic-fuchsia","gold","metallic-gold","champagne","sea-glass"],
  },
  {
    id:"napkin-pies-guys", type:"napkin", name:"Pies Before Guys Napkins",
    desc:"20 ct · 7\" x 7\"", price:"$11.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/690bd53adc1bc40ece1bca0d/1767922153487/Ebook+Thumbnail+with+Video+-+2025-11-05T170905.079.png?format=1500w",
    bg:"#FFE800", accent:"#E91E8C",
    tags:["yellow","lemonade","goldenrod","mustard","crystal-yellow","hotpink","blush","baby-pink","pink","coral","white","sugar","champagne"],
  },
  {
    id:"napkin-witch-hat-broom", type:"napkin", name:"Witch Hat & Broom Napkins",
    desc:"20 ct · 6.5\" x 6.5\"", price:"$14.36",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/aaebd523-df15-4eca-86ac-072e70c3b2fa/Ebook+Thumbnail+with+Video+-+2025-08-27T224152.162.png",
    bg:"#1A1A1A", accent:"#9C27B0",
    tags:["black","purple","plum","crystal-purple","orange","burnt-orange","evergreen","metallic-forest-green","sangria","gray-smoke"],
  },
  {
    id:"napkin-ticket", type:"napkin", name:"Ticket Napkins",
    desc:"24 ct · 7.75\" x 4.25\"", price:"$13.90",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b9cea90ddc3c70e0e4d807/1767922208811/Ebook+Thumbnail+with+Video+-+2025-07-10T194502.948.png?format=1500w",
    bg:"#E8112D", accent:"#FFD700",
    tags:["red","scarlett","gold","metallic-gold","black","white","champagne","silver","navy","hotpink"],
  },
  {
    id:"napkin-taco-party", type:"napkin", name:"Taco Party Napkins",
    desc:"25 ct · 7\" x 4.5\"", price:"$11.33",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767922221696/Ebook+Thumbnail+with+Video+-+2025-07-10T203346.148.png?format=1500w",
    bg:"#FF6B1A", accent:"#4CAF50",
    tags:["orange","burnt-orange","aloha","coral","lime-green","green","yellow","lemonade","red","scarlett","terracotta","mustard"],
  },
  {
    id:"napkin-pinky-minty", type:"napkin", name:"Pinky Minty Napkins",
    desc:"16 ct · 8\" x 4.25\"", price:"$10.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767922413706/Ebook+Thumbnail+with+Video+-+2026-01-06T163614.057.png?format=1500w",
    bg:"#80CBC4", accent:"#E91E8C",
    tags:["mint","seafoam","empower-mint","teal","turquoise","hotpink","blush","baby-pink","pink","sea-glass","white","sugar"],
  },
  {
    id:"napkin-love-bunches", type:"napkin", name:"Love You Bunches Napkins",
    desc:"16 ct · 6\" x 6\"", price:"$11.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68acde6bc1bfc45b6dc37ca2/1767922286023/Ebook+Thumbnail+with+Video+-+2025-11-06T085748.248.png?format=1500w",
    bg:"#FFE800", accent:"#4CAF50",
    tags:["yellow","lemonade","goldenrod","crystal-yellow","mustard","lime-green","green","meadow","white","sugar","orange","aloha"],
  },
  {
    id:"napkin-vampire-lips", type:"napkin", name:"Vampire Lips Napkins",
    desc:"24 ct · 4.5\" x 5\"", price:"$12.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684a08a8cc6de75b44df2cd1/1767922304325/Ebook+Thumbnail+with+Video+-+2025-05-18T171358.603.png?format=1500w",
    bg:"#1A1A1A", accent:"#E8112D",
    tags:["black","red","scarlett","sangria","crystal-burgundy","purple","plum","gray-smoke","white","crystal-clear"],
  },
  {
    id:"napkin-party-zone", type:"napkin", name:"Party Zone Napkins",
    desc:"24 ct · 7\" x 7\"", price:"$10.58",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6849cf98cc6de75b44deee46/1767921291480/Ebook+Thumbnail+with+Video+-+2025-05-19T215630.420.png?format=1500w",
    bg:"#E91E8C", accent:"#FFD700",
    tags:["hotpink","blush","baby-pink","pink","gold","champagne","white","yellow","lemonade","confetti","silver"],
  },
  {
    id:"napkin-music-note", type:"napkin", name:"Music Note Napkins",
    desc:"16 ct · 5\" x 6.5\"", price:"$10.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6849b309b7ad9e539ec67455/1767921347595/Ebook+Thumbnail+with+Video+-+2025-05-18T130657.702.png?format=1500w",
    bg:"#1A1A1A", accent:"#E91E8C",
    tags:["black","hotpink","white","silver","gold","metallic-gold","purple","navy","gray-smoke","crystal-clear"],
  },
  {
    id:"napkin-simple-blue", type:"napkin", name:"Simple Blue Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$11.15",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767921382800/Ebook+Thumbnail+with+Video-375.png",
    bg:"#B8D8E8", accent:"#0084C1",
    tags:["blue","baby-blue","monet","georgia","blue-slate","seafoam","teal","turquoise","sea-glass","navy","white","crystal-clear"],
  },
  {
    id:"napkin-game-controller", type:"napkin", name:"Game Controller Napkins",
    desc:"16 ct · 6.5\" x 4.75\"", price:"$19.77",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6849a458b91f060aa521ee5b/1767921394401/Ebook+Thumbnail+with+Video+-+2025-05-18T124517.706.png?format=1500w",
    bg:"#1A1A1A", accent:"#0084C1",
    tags:["black","blue","royalty","navy","metallic-blue","gray-smoke","silver","white","red","green","purple"],
  },
  {
    id:"napkin-witch-please", type:"napkin", name:"Witch Please Napkins",
    desc:"16 ct · 5\" x 5\"", price:"$12.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b7912a64121927f4c30aff/1767921410093/Ebook+Thumbnail+with+Video+-+2025-11-04T170641.337.png?format=1500w",
    bg:"#1A1A1A", accent:"#9C27B0",
    tags:["black","purple","plum","crystal-purple","orange","burnt-orange","sangria","evergreen","metallic-forest-green","gray-smoke"],
  },
  {
    id:"napkin-off-market", type:"napkin", name:"Off The Market Napkins",
    desc:"8 ct · 5\" x 5\"", price:"$9.36",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6852f6000a63794fee8fd22f/1767921428491/Ebook+Thumbnail+with+Video+-+2025-05-18T185535.880.png?format=1500w",
    bg:"#E91E8C", accent:"#FFD700",
    tags:["hotpink","blush","baby-pink","pink","white","sugar","gold","champagne","metallic-fuchsia","crystal-magenta"],
  },
  {
    id:"napkin-time-celebrate", type:"napkin", name:"Time To Celebrate Napkins",
    desc:"18 ct · 5\" x 5\"", price:"$9.75",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67d71a2cab754663f48e5307/1767921441084/Ebook+Thumbnail+with+Video+-+2025-07-21T170845.645.png?format=1500w",
    bg:"#FFD700", accent:"#E91E8C",
    tags:["gold","metallic-gold","champagne","hotpink","white","sugar","silver","lace","blush","crystal-clear"],
  },
  {
    id:"napkin-pink-bow", type:"napkin", name:"Cottage Core Bow Napkins",
    desc:"16 ct · 6.5\" x 5.25\"", price:"$11.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767921470160/Ebook+Thumbnail+with+Video+-+2025-05-13T195007.791.png?format=1500w",
    bg:"#FFB5C2", accent:"#E91E8C",
    tags:["hotpink","blush","baby-pink","pink","cameo","white","sugar","lavender","gold","champagne","mauve","canyon-rose"],
  },
  {
    id:"napkin-americana", type:"napkin", name:"Americana Polka Dot Napkins",
    desc:"24 ct · 5\" x 5\"", price:"$12.73",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767921503339/Ebook+Thumbnail+with+Video+-+2025-06-07T111520.978.png?format=1500w",
    bg:"#E8112D", accent:"#0052A5",
    tags:["red","scarlett","blue","royalty","navy","metallic-blue","white","crystal-clear","crystal-sapphire","naval"],
  },
  {
    id:"napkin-lemon-zest", type:"napkin", name:"Lemon Zest Napkins",
    desc:"20 ct · 6.5\" x 6.5\"", price:"$13.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684af4c864f4dd59c05b2c7e/1767921521159/Ebook+Thumbnail+with+Video+-+2025-05-18T125656.306.png?format=1500w",
    bg:"#FFEA5A", accent:"#0084C1",
    tags:["yellow","lemonade","goldenrod","crystal-yellow","mustard","blue","baby-blue","monet","white","sugar","lime-green"],
  },
  {
    id:"napkin-luau", type:"napkin", name:"Luau Tropical Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$12.58",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/684af19c1ef4b52dec073b2d/1767921598371/Ebook+Thumbnail+with+Video+-+2025-05-18T171244.102.png?format=1500w",
    bg:"#29B6F6", accent:"#4CAF50",
    tags:["turquoise","teal","seafoam","sea-glass","lime-green","green","aloha","orange","coral","hotpink","yellow","lemonade"],
  },
  {
    id:"napkin-lemon", type:"napkin", name:"Lemon Napkins",
    desc:"16 ct · 5\" x 4.62\"", price:"$12.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767921615744/Ebook+Thumbnail+with+Video+-+2025-05-19T222647.996.png?format=1500w",
    bg:"#FFEA5A", accent:"#4CAF50",
    tags:["yellow","lemonade","goldenrod","crystal-yellow","lime-green","green","meadow","white","sugar","mustard"],
  },
  {
    id:"napkin-ring-on-it", type:"napkin", name:"Put A Ring On It Napkins",
    desc:"25 ct · 9\" x 9\"", price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/149395c0-5bf6-4ac3-b1a9-e03105afdb4d/Ebook+Thumbnail+with+Video+-+2025-05-18T171621.760.png",
    bg:"#F4A7B9", accent:"#FFD700",
    tags:["blush","hotpink","baby-pink","pink","white","sugar","gold","champagne","silver","lavender","crystal-clear"],
  },
  {
    id:"napkin-hot-wheels", type:"napkin", name:"Hot Wheels Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$8.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c3d58fe3-ca6d-4c8b-bbed-a4fb7dedefb8/Ebook+Thumbnail+with+Video-407.png",
    bg:"#E8112D", accent:"#1A1A1A",
    tags:["red","scarlett","orange","burnt-orange","black","yellow","lemonade","metallic-starfire-red"],
  },
  {
    id:"napkin-diamond", type:"napkin", name:"Diamond Napkins",
    desc:"18 ct · 5\" x 5\"", price:"$9.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767921712029/Ebook+Thumbnail+with+Video+-+2025-01-24T180336.314.png?format=1500w",
    bg:"#1A1A1A", accent:"#CE93D8",
    tags:["black","purple","plum","crystal-purple","silver","gray-smoke","lavender","navy","metallic-midnight-blue"],
  },
  {
    id:"napkin-queen-card", type:"napkin", name:"Queen Card Napkins",
    desc:"16 ct · 5.5\" x 7\"", price:"$12.62",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68499f331ef4b52dec0636bc/1767922376235/Ebook+Thumbnail+with+Video+-+2025-06-08T010753.060.png?format=1500w",
    bg:"#E8112D", accent:"#FFD700",
    tags:["red","scarlett","hotpink","black","white","gold","metallic-gold","champagne","crystal-red"],
  },
  {
    id:"napkin-fries-guys", type:"napkin", name:"Fries Before Guys Napkins",
    desc:"16 ct · 6\" x 4\"", price:"$11.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767921683797/Ebook+Thumbnail+with+Video+-+2025-07-05T085433.945.png?format=1500w",
    bg:"#FFE800", accent:"#9C27B0",
    tags:["yellow","lemonade","goldenrod","mustard","crystal-yellow","purple","plum","lavender","blossom","peri","white","sugar"],
  },
  {
    id:"napkin-milk-carton", type:"napkin", name:"Milk Carton Napkins",
    desc:"16 ct · 5\" x 7\"", price:"$12.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8a0e60d7-79ad-44d6-ba7e-7203b1ffea28/Ebook+Thumbnail+with+Video+-+2025-05-11T155238.849.png",
    bg:"#F8F8F8", accent:"#E91E8C",
    tags:["white","sugar","baby-pink","blush","hotpink","baby-blue","monet","lemonade","yellow","crystal-clear","red","scarlett"],
  },
  {
    id:"napkin-vegas", type:"napkin", name:"Vegas Casino Bachelorette Paper Napkins",
    desc:"Bachelorette Party", price:"$10.36",
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/0505db/7876408656/il_fullxfull.7876408656_mqya.jpg",
    bg:"#F4A7B9", accent:"#C4956A",
    tags:["hotpink","blush","gold","champagne","metallic-gold","black","red","scarlett","white"],
  },
  {
    id:"napkin-bach-club", type:"napkin", name:"Bach Club Paper Napkins",
    desc:"Bachelorette Party", price:"$11.14",
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
    desc:"20 ct · 5\" x 5\"", price:"$10.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/694b4d5918bbbd208c5057a6/1767828152834/Ebook+Thumbnail+with+Video-350.png?format=1500w",
    bg:"#FFD700", accent:"#E8112D",
    tags:["gold","metallic-gold","champagne","red","scarlett","black","white","silver","crystal-red","hotpink"],
  },
  {
    id:"napkin-rhombuses", type:"napkin", name:"Rhombuses Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$9.75",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767921758774/Ebook+Thumbnail+with+Video-348.png?format=1500w",
    bg:"#F8F8F8", accent:"#9C27B0",
    tags:["white","sugar","crystal-clear","silver","gold","hotpink","blush","purple","lavender","navy","black","champagne"],
  },

  {
    id:"napkin-zodiac", type:"napkin", name:"Zodiac Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$11.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68601364c130655fc0b61fe7/1767923345946/Ebook+Thumbnail+with+Video+-+2025-06-24T144821.727.png?format=1500w",
    bg:"#1A1A1A", accent:"#FFD700",
    tags:["black","gold","metallic-gold","champagne","purple","plum","navy","metallic-midnight-blue","silver","white","crystal-clear"],
  },

  {
    id:"napkin-capricorn", type:"napkin", name:"Capricorn Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$10.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a8e3bdc3-4a08-47c0-9c74-226169383560/Ebook+Thumbnail+with+Video+-+2025-06-19T132725.198.png",
    bg:"#1A1A1A", accent:"#C0C0C0",
    tags:["black","silver","gray-smoke","navy","metallic-midnight-blue","white","crystal-clear","gold","champagne","purple","plum"],
  },

  {
    id:"napkin-aquarius", type:"napkin", name:"Aquarius Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$10.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/334d901e-4c8f-42e2-a0ef-b80f8fe41c3b/Ebook+Thumbnail+with+Video+-+2025-06-19T125658.376.png",
    bg:"#29B6F6", accent:"#9C27B0",
    tags:["blue","baby-blue","monet","georgia","blue-slate","teal","turquoise","purple","lavender","white","crystal-clear","silver"],
  },

  {
    id:"napkin-pisces", type:"napkin", name:"Pisces Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$10.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6e660cf1-0424-41c2-b949-624acfd536e4/Ebook+Thumbnail+with+Video+-+2025-06-19T121950.331.png",
    bg:"#29B6F6", accent:"#9C27B0",
    tags:["blue","baby-blue","monet","teal","turquoise","seafoam","purple","lavender","blossom","white","crystal-clear","silver","sea-glass"],
  },

  {
    id:"napkin-cancer", type:"napkin", name:"Cancer Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$10.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/27bf5109-0459-46c2-8306-4cfb76f2eb39/Ebook+Thumbnail+with+Video+-+2025-06-19T130441.099.png",
    bg:"#F4A7B9", accent:"#C0C0C0",
    tags:["blush","hotpink","baby-pink","pink","silver","white","crystal-clear","lavender","champagne","monet","sea-glass"],
  },

  {
    id:"napkin-aries", type:"napkin", name:"Aires Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$10.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ff6df11b-0d5e-461c-bdfc-a1a89a798235/Ebook+Thumbnail+with+Video+-+2025-06-18T125022.716.png",
    bg:"#E8112D", accent:"#FFD700",
    tags:["red","scarlett","crystal-red","gold","metallic-gold","champagne","white","crystal-clear","orange","burnt-orange","hotpink"],
  },

  {
    id:"napkin-taurus", type:"napkin", name:"Taurus Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$10.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ca7815a9-65a1-4b6d-b7b0-d591d1b82db2/Ebook+Thumbnail+with+Video+-+2025-06-24T100417.041.png",
    bg:"#4CAF50", accent:"#FFD700",
    tags:["green","meadow","lime-green","evergreen","gold","metallic-gold","champagne","white","crystal-clear","earth","stone","lace"],
  },

  {
    id:"napkin-libra", type:"napkin", name:"Libra Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$10.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/eab38ba9-6217-4599-8a29-148bc080a337/Ebook+Thumbnail+with+Video+-+2025-06-19T120523.385.png",
    bg:"#F4A7B9", accent:"#9C27B0",
    tags:["blush","hotpink","baby-pink","pink","lavender","purple","blossom","white","crystal-clear","champagne","gold","silver"],
  },

  {
    id:"napkin-virgo", type:"napkin", name:"Virgo Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$10.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/344cb799-9258-416f-8519-1476ae90ebde/Ebook+Thumbnail+with+Video+-+2025-06-24T140524.467.png",
    bg:"#F8F8F8", accent:"#4CAF50",
    tags:["white","crystal-clear","sugar","green","meadow","lime-green","gold","champagne","silver","lace","earth","stone"],
  },

  {
    id:"napkin-gemini", type:"napkin", name:"Gemini Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$10.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f142cbf0-9c1e-49d3-ae79-4040c8c2e9af/Ebook+Thumbnail+with+Video+-+2025-06-20T155423.542.png",
    bg:"#FFD700", accent:"#9C27B0",
    tags:["yellow","lemonade","goldenrod","crystal-yellow","purple","lavender","blossom","white","crystal-clear","silver","champagne","hotpink"],
  },

  {
    id:"napkin-leo", type:"napkin", name:"Leo Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$10.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/d1619272-b5e5-40c4-ab85-077afd670443/Ebook+Thumbnail+with+Video+-+2025-06-24T091155.266.png",
    bg:"#FFD700", accent:"#E8112D",
    tags:["gold","metallic-gold","champagne","orange","burnt-orange","aloha","red","scarlett","yellow","lemonade","white","crystal-clear"],
  },

  {
    id:"napkin-scorpio", type:"napkin", name:"Scorpio Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$10.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/16b52bfb-9df4-4bbc-b904-451b384aef0d/Ebook+Thumbnail+with+Video+-+2025-06-20T160650.136.png",
    bg:"#E91E8C", accent:"#FFD700",
    tags:["hotpink","blush","baby-pink","pink","gold","metallic-gold","champagne","white","crystal-clear","sugar","metallic-fuchsia"],
  },

  {
    id:"napkin-sagittarius", type:"napkin", name:"Sagittarius Napkins",
    desc:"20 ct · 5\" x 5\"", price:"$10.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1a2ec52a-4839-4efe-a850-b69a4c7ed06d/Ebook+Thumbnail+with+Video+-+2025-06-24T095218.092.png",
    bg:"#29B6F6", accent:"#C0C0C0",
    tags:["blue","baby-blue","monet","georgia","blue-slate","navy","crystal-sapphire","silver","gray-smoke","fog","white","crystal-clear","sugar"],
  },

  // ── Cups ─────────────────────────────────────────────────────────────────────
  {
    id:"cup-pink-lemonade", type:"cup", name:"Pink Lemonade Cups",
    desc:"12 ct · 12 oz", price:"$9.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69501be34a48c45392c2ab6e/1767901691890/Ebook+Thumbnail+with+Video-378.png?format=1500w",
    bg:"#FFB5C2", accent:"#FFE800",
    tags:["hotpink","blush","baby-pink","pink","yellow","lemonade","coral","taffy","white","sugar","champagne"],
  },
  {
    id:"cup-black-suit-potion", type:"cup", name:"Black Suit Potion Cups",
    desc:"12 ct · 12 oz", price:"$13.80",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/679ba45c6c9a8e41d1c9c8fb/1767901711078/Ebook+Thumbnail+with+Video+-+2025-01-30T101320.249.png?format=1500w",
    bg:"#1A1A1A", accent:"#9C27B0",
    tags:["black","purple","plum","crystal-purple","navy","metallic-midnight-blue","silver","gray-smoke","white","crystal-clear"],
  },
  {
    id:"cup-test-tube", type:"cup", name:"Test Tube Shot Glasses",
    desc:"10 ct · 2 oz", price:"$18.68",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1768408091504/Ebook+Thumbnail+with+Video+-+2025-09-02T190400.620.png?format=1500w",
    bg:"#F8F8F8", accent:"#E91E8C",
    tags:["white","crystal-clear","hotpink","blush","baby-pink","silver","confetti","rainbow","neon-pink","neon-green"],
  },
  {
    id:"cup-love-notes", type:"cup", name:"Love Notes Cups",
    desc:"12 ct · 12 oz", price:"$11.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b8e9c34727185646d0d184/1767901854567/Ebook+Thumbnail+with+Video+-+2025-11-04T124253.381.png?format=1500w",
    bg:"#F4A7B9", accent:"#E8112D",
    tags:["blush","hotpink","baby-pink","pink","red","scarlett","white","sugar","crystal-clear","champagne","taffy","coral"],
  },
  {
    id:"cup-cherry", type:"cup", name:"Cherry Cups",
    desc:"12 ct · 12 oz", price:"$11.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68acdd9210a90473ab295c88/1767901897133/Ebook+Thumbnail+with+Video+-+2025-11-03T153201.078.png?format=1500w",
    bg:"#E8112D", accent:"#4CAF50",
    tags:["red","scarlett","crystal-red","hotpink","blush","green","meadow","lime-green","white","sugar","crystal-clear"],
  },
  {
    id:"cup-girl-power", type:"cup", name:"Girl Power Cups",
    desc:"12 ct · 12 oz", price:"$11.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b8dfda81cdb105e8e9616f/1767901943357/Ebook+Thumbnail+with+Video+-+2025-11-04T142254.958.png?format=1500w",
    bg:"#E91E8C", accent:"#9C27B0",
    tags:["hotpink","blush","baby-pink","pink","purple","lavender","blossom","white","sugar","crystal-clear","metallic-fuchsia","crystal-magenta"],
  },
  {
    id:"cup-palm-tree", type:"cup", name:"Palm Palm Tree Cups",
    desc:"12 ct · 12 oz", price:"$11.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b8efa9f5b31a653794883d/1767901988596/Ebook+Thumbnail+with+Video+-+2025-11-04T121323.219.png?format=1500w",
    bg:"#29B6F6", accent:"#4CAF50",
    tags:["teal","turquoise","seafoam","sea-glass","lime-green","green","meadow","aloha","orange","coral","yellow","lemonade","hotpink","white"],
  },
  {
    id:"cup-heartbeat-gang", type:"cup", name:"Heartbeat Gang Cups",
    desc:"12 ct · 12 oz", price:"$11.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1768407395338/Ebook+Thumbnail+with+Video+-+2025-11-03T172558.659.png?format=1500w",
    bg:"#E8112D", accent:"#E91E8C",
    tags:["red","scarlett","hotpink","blush","baby-pink","pink","white","sugar","crystal-clear","coral","taffy"],
  },
  {
    id:"cup-fiesta-striped", type:"cup", name:"Fiesta Striped Cups",
    desc:"12 ct · 12 oz", price:"$11.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1768407296354/Ebook+Thumbnail+with+Video+-+2025-01-27T162539.289.png?format=1500w",
    bg:"#FF6B1A", accent:"#4CAF50",
    tags:["orange","burnt-orange","aloha","coral","lime-green","green","red","scarlett","yellow","lemonade","hotpink","turquoise","white"],
  },
  {
    id:"cup-butterfly", type:"cup", name:"Butterfly Cups",
    desc:"8 ct · 9 oz", price:"$11.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69093158251a3c395b53abf3/1767902138322/Ebook+Thumbnail+with+Video+-+2025-11-03T165151.639.png?format=1500w",
    bg:"#CE93D8", accent:"#81D4FA",
    tags:["lavender","purple","blossom","baby-blue","monet","blush","baby-pink","hotpink","white","crystal-clear","silver","confetti"],
  },
  {
    id:"cup-mermaid-fringe", type:"cup", name:"Mermaid Fringe Cups",
    desc:"12 ct · 12 oz", price:"$11.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68ba5d74bb187f4ec7c30cab/1767902046881/Ebook+Thumbnail+with+Video+-+2025-09-04T225037.656.png?format=1500w",
    bg:"#00B8D4", accent:"#CE93D8",
    tags:["teal","turquoise","seafoam","sea-glass","metallic-teal","blue","baby-blue","monet","purple","lavender","hotpink","silver","white"],
  },
  {
    id:"cup-island-vibes", type:"cup", name:"Island Vibes Cups",
    desc:"12 ct · 12 oz", price:"$20.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68e2fb47f9144c3031441181/1767902090554/Ebook+Thumbnail+with+Video+-+2025-11-03T164536.370.png?format=1500w",
    bg:"#29B6F6", accent:"#4CAF50",
    tags:["turquoise","teal","seafoam","sea-glass","aloha","lime-green","green","orange","coral","burnt-orange","yellow","lemonade","hotpink","white"],
  },
  {
    id:"cup-iridescent-stripe", type:"cup", name:"Iridescent Stripe Cups",
    desc:"12 ct · 12 oz", price:"$9.12",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767902114614/Ebook+Thumbnail+with+Video-371.png?format=1500w",
    bg:"#F8F8F8", accent:"#CE93D8",
    tags:["silver","white","crystal-clear","confetti","lavender","baby-pink","blush","baby-blue","monet","champagne","metallic-silver","fog"],
  },
  {
    id:"cup-blues-checker", type:"cup", name:"Blues Checker Cups",
    desc:"12 ct · 12 oz", price:"$9.12",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69533cf93f4b3e6c55dde81f/1768082136340/Ebook+Thumbnail+with+Video+-+2025-12-29T203447.293.png?format=1500w",
    bg:"#29B6F6", accent:"#F8F8F8",
    tags:["blue","baby-blue","monet","georgia","blue-slate","navy","crystal-sapphire","royalty","white","crystal-clear","silver"],
  },
  {
    id:"cup-pop-petal", type:"cup", name:"Pop Petal Cups",
    desc:"12 ct · 12 oz", price:"$13.25",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/690a378362cc1b156338d5ba/1767902189676/Ebook+Thumbnail+with+Video+-+2025-11-04T113936.835.png?format=1500w",
    bg:"#E91E8C", accent:"#FFD700",
    tags:["hotpink","blush","baby-pink","pink","coral","taffy","orange","yellow","lemonade","white","sugar","champagne","gold"],
  },
  {
    id:"cup-doomsday", type:"cup", name:"Doomsday Cups",
    desc:"12 ct · 12 oz", price:"$11.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68acda86c1bfc45b6dc378a3/1767375195900/Ebook+Thumbnail+with+Video+-+2025-11-03T162756.279.png?format=1500w",
    bg:"#1A1A1A", accent:"#E8112D",
    tags:["black","red","scarlett","orange","burnt-orange","purple","plum","gray-smoke","silver","white","crystal-clear"],
  },
  {
    id:"cup-bow", type:"cup", name:"Bow Cups",
    desc:"12 ct · 12 oz", price:"$11.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68abd10c10a90473ab289320/1767902211224/Ebook+Thumbnail+with+Video+-+2025-11-03T140749.604.png?format=1500w",
    bg:"#FFB5C2", accent:"#E91E8C",
    tags:["hotpink","blush","baby-pink","pink","white","sugar","crystal-clear","champagne","lavender","gold","taffy","cameo","lace","stone","fog","cocoa","malted","muse","earth"],
  },
  {
    id:"cup-pixelation", type:"cup", name:"Pixelation Cups",
    desc:"12 ct · 12 oz", price:"$11.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69093cb4251a3c395b53ba62/1767902239652/Ebook+Thumbnail+with+Video+-+2025-11-03T174833.491.png?format=1500w",
    bg:"#9C27B0", accent:"#29B6F6",
    tags:["purple","plum","crystal-purple","lavender","blue","baby-blue","monet","hotpink","blush","silver","gray-smoke","white","crystal-clear","confetti","orange","burnt-orange","aloha","coral","cocoa","malted","muse","earth"],
  },
  {
    id:"cup-dusty-pinky", type:"cup", name:"Dusty Pinky Cups",
    desc:"12 ct · 12 oz", price:"$9.75",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/01f64bcb-5201-49c6-a7f7-14919103f9f3/Ebook+Thumbnail+with+Video+-+2025-06-08T010753.060.png",
    bg:"#F4A7B9", accent:"#CE93D8",
    tags:["blush","baby-pink","pink","mauve","cameo","canyon-rose","lavender","blossom","muse","stone","lace","white","sugar","champagne"],
  },
  {
    id:"cup-blood-bags", type:"cup", name:"Blood Plastic Bags",
    desc:"10 ct · drink bags", price:"$20.68",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68b7992764121927f4c311ea/1767902296319/Ebook+Thumbnail+with+Video+-+2025-09-02T182534.261.png?format=1500w",
    bg:"#E8112D", accent:"#1A1A1A",
    tags:["red","scarlett","crystal-red","sangria","crystal-burgundy","black","purple","plum","orange","burnt-orange","white","crystal-clear"],
  },
  {
    id:"cup-penis-glasses", type:"cup", name:"Penis Shaped Glasses",
    desc:"Bachelorette Party", price:"$34.07",
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/bb0263/6824885638/il_fullxfull.6824885638_mk0l.jpg",
    bg:"#FFB5C2", accent:"#E91E8C",
    tags:["hotpink","blush","baby-pink","pink","white","crystal-clear","red","coral","taffy","metallic-fuchsia"],
  },
  {
    id:"cup-uncle-sam", type:"cup", name:"Uncle Sam Hat Plastic Cup",
    desc:"Bachelorette Party", price:"$12.34",
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/d58b9f/6854628428/il_fullxfull.6854628428_8x69.jpg",
    bg:"#E8112D", accent:"#0052A5",
    tags:["red","scarlett","blue","royalty","navy","white","crystal-clear","silver","crystal-sapphire","naval"],
  },
  {
    id:"cup-giddy-up", type:"cup", name:"Giddy Up Sluts Espresso Cup",
    desc:"Bachelorette Party", price:"$22.26",
    image:"https://images.weserv.nl/?url=i.etsystatic.com/40669879/r/il/99c7e3/7806352486/il_fullxfull.7806352486_g77x.jpg",
    bg:"#C4956A", accent:"#1A1A1A",
    tags:["terracotta","muse","malted","stone","earth","cocoa","burnt-orange","champagne","lace","white","black","mustard"],
  },
  {
    id:"cup-patriotic-cake", type:"cup", name:"Patriotic Cake Slice Cups",
    desc:"Bachelorette Party", price:"$49.99",
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
    id:"cup-white",      type:"cup",  name:"Pearl White Cups",
    desc:"Bachelorette Party",      price:"$7.99",
    image: null,         bg:"#F8F8F8", accent:"#ddd",
    tags:["white","silver","champagne","lavender","blush"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"cup-cowprint",   type:"cup",  name:"Cow Print Cups",
    desc:"25 ct · 16oz", price:"$11.99",
    image: null,         bg:"#fff", accent:"#1a1a1a",
    tags:["cow","dalmatian","white"],
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
    id:"foil-black-number", type:"foil", numberBalloon:true, name:"34\" Black Number Balloon",
    desc:"34\" foil number balloon", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b22c403e-50df-4c60-b2e1-3c839ea2a26a/Ebook+Thumbnail+with+Video-120.png",
    bg:"#1A1A1A", accent:"#C0C0C0",
    tags:["black","gray-smoke","silver","navy","metallic-midnight-blue","white","crystal-clear"],
  },

  {
    id:"foil-blue-polka-number", type:"foil", numberBalloon:true, name:"34\" Blue Polka Dot Number Balloon",
    desc:"34\" foil number balloon", price:"$9.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/6dcbd859-3897-4890-bd28-1b89c724860f/Ebook+Thumbnail+with+Video+-+2025-03-13T185118.850.png",
    bg:"#29B6F6", accent:"#F8F8F8",
    tags:["blue","baby-blue","monet","georgia","blue-slate","navy","crystal-sapphire","white","crystal-clear","silver"],
  },

  {
    id:"foil-floral-number", type:"foil", numberBalloon:true, name:"40\" Floral Number Balloon",
    desc:"40\" foil number balloon", price:"$19.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/cffbfe26-1d67-475b-8c52-31afefe61a80/Ebook+Thumbnail+with+Video+-+2025-01-20T102142.152.png",
    bg:"#F4A7B9", accent:"#4CAF50",
    tags:["blush","hotpink","baby-pink","pink","green","meadow","lime-green","white","sugar","crystal-clear","champagne","lavender","coral"],
  },

  {
    id:"foil-hotpink-number", type:"foil", numberBalloon:true, name:"34\" Hot Pink Number Balloon",
    desc:"34\" foil number balloon", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ce1235a3-0275-4d1f-a0d4-b9b69e7ad843/Ebook+Thumbnail+with+Video-121.png",
    bg:"#E91E8C", accent:"#FFB5C2",
    tags:["hotpink","blush","baby-pink","pink","coral","taffy","metallic-fuchsia","crystal-magenta","white","crystal-clear"],
  },

  {
    id:"foil-rainbow-number", type:"foil", numberBalloon:true, name:"34\" Rainbow Number Balloon",
    desc:"34\" foil number balloon", price:"$13.68",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8856029c-ae9f-49e0-a03f-379626f119be/Ebook+Thumbnail+with+Video+-+2025-03-13T174918.813.png",
    bg:"#FFD700", accent:"#E91E8C",
    tags:["red","orange","yellow","green","blue","purple","hotpink","rainbow","confetti","white","crystal-clear"],
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
    id:"foil-barbie", type:"foil", name:"32\" Barbie Balloon",
    desc:"32\" specialty foil balloon", price:"$12.99",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6941721926a87274e552847e/1768007753441/Ebook+Thumbnail+with+Video+-+2025-01-04T201354.576.png?format=1500w",
    bg:"#E91E8C", accent:"#FFB5C2",
    tags:["hotpink","blush","baby-pink","pink","white","crystal-clear","metallic-fuchsia","crystal-magenta","lavender"],
  },

  {
    id:"foil-rainbow", type:"foil", name:"32\" Rainbow Balloon",
    desc:"32\" specialty foil balloon", price:"$9.15",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69416d473ac5f331c277931c/1768007798403/Ebook+Thumbnail+with+Video+-+2025-01-04T223406.603.png?format=1500w",
    bg:"#FFD700", accent:"#E91E8C",
    tags:["red","orange","yellow","green","blue","purple","hotpink","rainbow","confetti","white","crystal-clear"],
  },

  {
    id:"foil-flamingle", type:"foil", name:"31\" Let's Flamingle Drink Balloon",
    desc:"31\" specialty foil balloon", price:"$11.54",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6940b8de144d875d2d962032/1768008824827/Ebook+Thumbnail+with+Video+-+2025-05-18T172704.423.png?format=1500w",
    bg:"#E91E8C", accent:"#FF6B1A",
    tags:["hotpink","blush","baby-pink","pink","coral","taffy","orange","aloha","teal","turquoise","white","crystal-clear"],
  },

  {
    id:"foil-silver-starburst", type:"foil", name:"40\" Silver Starburst Balloon",
    desc:"40\" specialty foil balloon", price:"$7.25",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1768084248069/Ebook+Thumbnail+with+Video+-+2025-12-30T163546.241.png?format=1500w",
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
    id:"foil-cactus", type:"foil", name:"41\" Cactus Plant Balloon",
    desc:"41\" specialty foil balloon", price:"$10.22",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6941771a5952ed64469be00f/1768007838556/Ebook+Thumbnail+with+Video+-+2025-05-17T221304.722.png?format=1500w",
    bg:"#4CAF50", accent:"#FF6B1A",
    tags:["green","lime-green","meadow","empower-mint","evergreen","teal","turquoise","orange","coral","aloha","yellow","lemonade","white","crystal-clear"],
  },

  {
    id:"foil-half-moon", type:"foil", name:"26\" Half Moon Balloon",
    desc:"26\" specialty foil balloon", price:"$8.58",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1768007821696/Ebook+Thumbnail+with+Video-398.png?format=1500w",
    bg:"#1A1A1A", accent:"#FFD700",
    tags:["black","navy","metallic-midnight-blue","gold","metallic-gold","silver","white","crystal-clear","purple","plum","gray-smoke"],
  },

  {
    id:"foil-sweetheart-cherry", type:"foil", name:"34\" Sweetheart Cherry Balloon",
    desc:"34\" specialty foil balloon", price:"$12.88",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6907dcd98a3aff4c42d033c2/1768008789656/Ebook+Thumbnail+with+Video+-+2025-10-21T110010.874.png?format=1500w",
    bg:"#E8112D", accent:"#4CAF50",
    tags:["red","scarlett","crystal-red","hotpink","blush","green","meadow","lime-green","white","sugar","crystal-clear"],
  },

  {
    id:"foil-ladybird", type:"foil", name:"30\" Ladybird Balloon",
    desc:"30\" specialty foil balloon", price:"$13.28",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6907d9b02e1a513d9a3a8793/1768008758540/Ebook+Thumbnail+with+Video+-+2025-10-21T124712.439.png?format=1500w",
    bg:"#E8112D", accent:"#1A1A1A",
    tags:["red","scarlett","crystal-red","black","white","crystal-clear","hotpink","orange","burnt-orange"],
  },

  {
    id:"foil-wings", type:"foil", name:"41\" Wings Balloon",
    desc:"41\" specialty foil balloon", price:"$12.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6951c76c3f4b3e6c55dcd8b2/1767991514412/Ebook+Thumbnail+with+Video-399.png?format=1500w",
    bg:"#F8F8F8", accent:"#C0C0C0",
    tags:["white","crystal-clear","silver","fog","gray-smoke","champagne","gold","lace","lavender","blush","baby-pink"],
  },

  {
    id:"foil-pink-leopard-bride", type:"foil", name:"14\" Pink Leopard Bride Balloon",
    desc:"14\" specialty foil balloon", price:"$9.03",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68e2ef53a7ac865209b90f28/1767991479563/Ebook+Thumbnail+with+Video+-+2025-05-18T172244.028.png?format=1500w",
    bg:"#E91E8C", accent:"#1A1A1A",
    tags:["hotpink","blush","baby-pink","pink","black","white","crystal-clear","metallic-fuchsia","crystal-magenta"],
  },

  {
    id:"foil-sweet-summer", type:"foil", name:"18\" Sweet Summer Balloon",
    desc:"18\" specialty foil balloon", price:"$7.00",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68e2ebbef9144c3031440514/1767991430764/Ebook+Thumbnail+with+Video+-+2025-03-02T110414.905.png?format=1500w",
    bg:"#FFD700", accent:"#E91E8C",
    tags:["yellow","lemonade","orange","coral","aloha","hotpink","blush","lime-green","green","turquoise","teal","rainbow","confetti","white","crystal-clear"],
  },

  {
    id:"foil-fruit-green-starburst", type:"foil", name:"40\" Fruit Green Starburst Balloon",
    desc:"40\" specialty foil balloon", price:"$7.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767991390735/Ebook+Thumbnail+with+Video+-+2025-12-30T163339.900.png?format=1500w",
    bg:"#4CAF50", accent:"#FFD700",
    tags:["green","lime-green","meadow","empower-mint","yellow","lemonade","teal","turquoise","white","crystal-clear"],
  },

  {
    id:"foil-pineapple", type:"foil", name:"31\" Pineapple Balloon",
    desc:"31\" specialty foil balloon", price:"$11.54",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b4902972-c1ce-4548-a892-314d22301f6e/Ebook+Thumbnail+with+Video+-+2025-02-17T202053.165.png",
    bg:"#FFD700", accent:"#4CAF50",
    tags:["yellow","lemonade","goldenrod","mustard","crystal-yellow","green","lime-green","meadow","orange","aloha","white","crystal-clear"],
  },

  {
    id:"foil-red-bow", type:"foil", name:"40\" Red Bow Balloon",
    desc:"40\" specialty foil balloon", price:"$14.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767991346113/Ebook+Thumbnail+with+Video+-+2025-05-25T230643.948.png?format=1500w",
    bg:"#E8112D", accent:"#F8F8F8",
    tags:["red","scarlett","crystal-red","white","crystal-clear","sugar","hotpink","coral","gold","champagne"],
  },

  {
    id:"foil-polka-dot-bow", type:"foil", name:"40\" Polka Dot Bow Balloon",
    desc:"40\" specialty foil balloon", price:"$12.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d4972576809b67b84d6704/1767991290378/Ebook+Thumbnail+with+Video+-+2025-05-18T171923.294.png?format=1500w",
    bg:"#F4A7B9", accent:"#F8F8F8",
    tags:["blush","hotpink","baby-pink","pink","white","crystal-clear","sugar","lavender","champagne","cameo"],
  },
  {
    id:"foil-sunglasses", type:"foil", name:"31\" Sunglasses Balloon",
    desc:"31\" specialty foil balloon", price:"$11.02",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68d59f2b4fb669549073cb77/1767990638539/Ebook+Thumbnail+with+Video+-+2025-02-24T220518.516.png?format=1500w",
    bg:"#FFD700", accent:"#E91E8C",
    tags:["yellow","lemonade","orange","hotpink","blush","lime-green","green","blue","baby-blue","purple","rainbow","white","crystal-clear"],
  },

  {
    id:"foil-martini-glass", type:"foil", name:"40\" Martini Glass Balloon",
    desc:"40\" specialty foil balloon", price:"$13.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767990620035/Ebook+Thumbnail+with+Video+-+2025-05-25T232657.639.png?format=1500w",
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
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6941ac529fe36643f87d1a75/1767990443996/Ebook+Thumbnail+with+Video+-+2025-01-05T145634.708.png?format=1500w",
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
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6824dddff9c801658600c67e/1767988195503/Ebook+Thumbnail+with+Video+-+2025-05-13T183340.172.png?format=1500w",
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
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767988689015/Ebook+Thumbnail+with+Video+-+2025-01-04T223847.407.png?format=1500w",
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
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67edb15422e8e62c8789efd4/1767988801824/Ebook+Thumbnail+with+Video+-+2025-01-20T131014.569.png?format=1500w",
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
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767988966457/Ebook+Thumbnail+with+Video+-+2025-01-20T131721.767.png?format=1500w",
    bg:"#FCE4EC", accent:"#E91E8C",
    tags:["pink","hotpink","baby-pink","blush","red","cherry","floral","blossom","bachelorette"],
  },
  {
    id:"foil-shamrock", type:"foil", name:"38\" Shamrock Balloon",
    desc:"38\" specialty foil balloon", price:"$9.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67ea0d4056da4c2a033cd33f/1767989023513/Ebook+Thumbnail+with+Video+-+2025-03-30T224116.002.png?format=1500w",
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
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767989091625/Ebook+Thumbnail+with+Video+-+2025-02-25T095425.689.png?format=1500w",
    bg:"#E0F7FA", accent:"#FF8F00",
    tags:["green","lime-green","tropical","orange","coral","peach","yellow","red","blue","baby-blue","royal-blue","navy","rainbow","jungle","empower-mint","white","pink","hotpink","baby-pink","blush"],
  },
  {
    id:"foil-bride-swimsuit", type:"foil", name:"30\" Bride Swimsuit Balloon",
    desc:"30\" specialty foil balloon", price:"$14.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6837334aa4ab5f5abddedf48/1767989189805/Ebook+Thumbnail+with+Video+-+2025-05-28T110654.070.png?format=1500w",
    bg:"#FCE4EC", accent:"#FFD700",
    tags:["white","crystal-clear","gold","champagne","bride","bachelorette","blush","baby-pink","pink","hotpink"],
  },
  {
    id:"foil-coconut-pina-colada", type:"foil", name:"30\" Coconut Piña Colada Balloon",
    desc:"30\" specialty foil balloon", price:"$9.45",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67d72422b8f32226f0bdf172/1768009197343/Ebook+Thumbnail+with+Video+-+2025-02-25T094444.750.png?format=1500w",
    bg:"#FFF9C4", accent:"#8BC34A",
    tags:["yellow","lemon","gold","green","lime-green","tropical","white","cream","brown","tan","summer","empower-mint"],
  },
  {
    id:"foil-iridescent-cherry", type:"foil", name:"30\" Iridescent Cherry Balloon",
    desc:"30\" specialty foil balloon", price:"$11.60",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/67bf1ca3f900096234f9f717/1767989236574/Ebook+Thumbnail+with+Video+-+2025-02-24T214709.688.png?format=1500w",
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
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767989403031/Ebook+Thumbnail+with+Video+-+2025-01-20T123831.227.png?format=1500w",
    bg:"#FCE4EC", accent:"#E91E8C",
    tags:["hotpink","pink","baby-pink","blush","bachelorette","glam","silver","crystal-clear","white","champagne","fog"],
  },
  {
    id:"foil-dancing-boot", type:"foil", name:"26\" Dancing Boot Balloon",
    desc:"26\" specialty foil balloon", price:"$12.60",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767989429571/Ebook+Thumbnail+with+Video+-+2025-01-20T133734.234.png?format=1500w",
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
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/678edb7e6d486465924192e4/1767989549274/Ebook+Thumbnail+with+Video+-+2025-01-20T133128.129.png?format=1500w",
    bg:"#F5F5F5", accent:"#9E9E9E",
    tags:["silver","crystal-clear","white","iridescent","disco","glam","rainbow","holographic","champagne"],
  },
  {
    id:"foil-silver-wedding-ring", type:"foil", name:"38\" Silver Wedding Ring Balloon",
    desc:"38\" specialty foil balloon", price:"$13.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/2757ff26-a658-4235-a65d-97d27c808752/Ebook+Thumbnail+with+Video+-+2024-12-06T190013.814.png",
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
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767989651538/Ebook+Thumbnail+with+Video+-+2025-01-20T132001.449.png?format=1500w",
    bg:"#F5F5F5", accent:"#212121",
    tags:["black","white","silver","crystal-clear","retro","glam"],
  },
  {
    id:"foil-chameleon", type:"foil", name:"39\" Chameleon Balloon",
    desc:"39\" specialty foil balloon", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/678edb122b47a06ca0513365/1767989680546/Ebook+Thumbnail+with+Video+-+2025-01-20T131626.030.png?format=1500w",
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
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767935618872/Ebook+Thumbnail+with+Video+-+2025-01-20T132415.234.png?format=1500w",
    bg:"#E8F5E9", accent:"#FF8F00",
    tags:["green","lime-green","empower-mint","tropical","brown","tan","yellow","gold","summer","beach","coastal"],
  },
  {
    id:"foil-blue-bell-bowknot", type:"foil", name:"31\" Blue Bell Bowknot Balloon",
    desc:"31\" specialty foil balloon", price:"$8.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767935597503/Ebook+Thumbnail+with+Video+-+2025-02-24T213620.013.png?format=1500w",
    bg:"#E3F2FD", accent:"#90CAF9",
    tags:["blue","baby-blue","monet","teal","white","crystal-clear","pastel","lavender","silver"],
  },

  // ── Treat Bags ────────────────────────────────────────────────────────────────
  {
    id:"treatbag-envelope-boxes", type:"treatbag", name:"Envelope Treat Boxes",
    desc:"Set of 8 treat boxes, 4\"l x 3\"w x 5\"h, ships flat", price:"$16.33",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/69501f769e309b7374828b5b/1767924128193/Ebook+Thumbnail+with+Video-381.png?format=1500w",
    bg:"#FFF8E1", accent:"#FFD700",
    tags:["white","cream","gold","champagne","lace","bachelorette","bride","hotpink","pink","baby-pink","blush","blossom","coral","peach"],
  },
  {
    id:"treatbag-diamond", type:"treatbag", name:"Diamond Treat Bags",
    desc:"Set of 10 diamond-shaped bags, 10\"l x 6.5\"h, ships flat", price:"$8.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767924321739/Ebook+Thumbnail+with+Video+-+2025-12-31T235300.051.png?format=1500w",
    bg:"#FFF9C4", accent:"#FFD700",
    tags:["yellow","gold","white","crystal-clear","champagne","glam","bachelorette","blue","baby-blue","navy","royal-blue","monet","teal","green","lime-green","empower-mint"],
  },
  {
    id:"treatbag-lunar-dragon", type:"treatbag", name:"Lunar Dragon Treat Box",
    desc:"Set of 6 takeout-style boxes with gold foil accents & metal handles", price:"$12.24",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6824f23e19aabf2f07a2ed44/1767924305633/Ebook+Thumbnail+with+Video+-+2025-05-13T192702.718.png?format=1500w",
    bg:"#B71C1C", accent:"#FFD700",
    tags:["red","cranberry","cherry","gold","black","dark","spooky","glam"],
  },
  {
    id:"treatbag-shell", type:"treatbag", name:"Shell Treat Bags",
    desc:"Set of 8 shell-shaped bags, 6.5\"h x 6\"l x 3\"w, ships flat", price:"$26.84",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767924279717/Ebook+Thumbnail+with+Video+-+2025-05-13T194717.269.png",
    bg:"#E0F7FA", accent:"#F48FB1",
    tags:["teal","blue","baby-blue","monet","pink","baby-pink","blush","peach","iridescent","silver","white","coastal","tropical","mermaid"],
  },
  {
    id:"treatbag-cactus", type:"treatbag", name:"Cactus Treat Boxes",
    desc:"Set of 10 mini boxes, 2.3\" x 2.3\", pastel cactus design, ships flat", price:"$12.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767924263739/Ebook+Thumbnail+with+Video+-+2025-05-13T191208.374.png?format=1500w",
    bg:"#E8F5E9", accent:"#FF8F00",
    tags:["green","lime-green","empower-mint","pink","baby-pink","blush","yellow","orange","pastel","western","cowgirl","boho"],
  },
  {
    id:"treatbag-fast-lane", type:"treatbag", name:"Fast Lane Treat Boxes",
    desc:"Set of 8 boxes, 3.5\"l x 2.5\"w x 5\"h, ships flat", price:"$16.38",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767828133462/Ebook+Thumbnail+with+Video+-+2025-07-21T223405.337.png?format=1500w",
    bg:"#212121", accent:"#FFD700",
    tags:["black","gold","red","white","silver","dark","glam","bachelorette"],
  },
  {
    id:"treatbag-tea-time", type:"treatbag", name:"Tea Time Treat Boxes",
    desc:"Set of 24 teapot-shaped boxes, 3.5\"l x 2.4\"w x 3.9\"h, ships flat", price:"$38.58",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/68a0fe6786322825a8be6da3/1767924184425/Ebook+Thumbnail+with+Video+-+2025-07-21T171314.458.png?format=1500w",
    bg:"#FCE4EC", accent:"#CE93D8",
    tags:["pink","baby-pink","blush","lavender","purple","white","pastel","floral","blossom","bachelorette"],
  },
  {
    id:"treatbag-fringe", type:"treatbag", name:"Fringe Treat Bags",
    desc:"Fringe party favor bags for candies & surprises", price:"$22.21",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/b3ef3e6e-10ae-42c2-90f1-74697391dae0/Ebook+Thumbnail+with+Video+-+2025-12-29T210340.995.png",
    bg:"#FCE4EC", accent:"#E91E8C",
    tags:["hotpink","pink","baby-pink","blush","rainbow","colorful","glam","bachelorette"],
  },
  {
    id:"treatbag-black-stripes", type:"treatbag", name:"Black Stripes Treat Bags",
    desc:"Set of 16 bags, 5.25\"h x 3.25\"w x 8\"l, ships flat", price:"$16.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1767923812865/Ebook+Thumbnail+with+Video-403.png?format=1500w",
    bg:"#212121", accent:"#F5F5F5",
    tags:["black","white","silver","crystal-clear","dark","glam","bachelorette","retro"],
  },

  // ── Banners & Backdrops ───────────────────────────────────────────────────────
  {
    id:"banner-star", type:"banner", name:"Star Banner",
    desc:"6ft–10ft cosmic star banner", price:"$55.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1768327615167/Ebook+Thumbnail+with+Video-405.png?format=1500w",
    bg:"#1A1A2E", accent:"#FFD700",
    tags:["gold","silver","white","crystal-clear","iridescent","glam","bachelorette","rainbow","holographic"],
  },
  {
    id:"banner-floral-garland", type:"banner", name:"Floral Garland",
    desc:"6ft–10ft floral garland for backdrops & décor", price:"$44.89",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/6951c6a14a48c45392c3aa31/1768281257630/Ebook+Thumbnail+with+Video-434.png?format=1500w",
    bg:"#F8BBD0", accent:"#A5D6A7",
    tags:["pink","baby-pink","blush","blossom","floral","green","lime-green","white","pastel","whimsy","bachelorette"],
  },
  {
    id:"banner-molly-paper-lanterns", type:"banner", name:"Molly Paper Lanterns",
    desc:"Decorative paper lanterns for overhead or backdrop display", price:"$38.00",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/695341143f4b3e6c55ddeba0/1767925314296/Ebook+Thumbnail+with+Video+-+2025-12-29T210340.995.png?format=1500w",
    bg:"#FCE4EC", accent:"#CE93D8",
    tags:["pink","baby-pink","blush","lavender","purple","white","pastel","whimsy","bachelorette"],
  },
  {
    id:"banner-baby-pink-fringe-backdrop", type:"banner", name:"Baby Pink Foil Fringe Backdrop",
    desc:"3ft w x 7ft l floor-length foil fringe curtain backdrop", price:"$6.50",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/695da2a4b652cb2a3b41a5eb/1767925375980/Ebook+Thumbnail+with+Video+-+2026-01-06T110503.249.png?format=1500w",
    bg:"#FCE4EC", accent:"#F48FB1",
    tags:["baby-pink","pink","blush","blossom","lace","sugar","glam","bachelorette","bride"],
  },
  {
    id:"banner-metallic-pink-fringe-backdrop", type:"banner", name:"Metallic Pink Foil Fringe Backdrop",
    desc:"3ft w x 7ft l floor-length metallic foil fringe curtain backdrop", price:"$6.50",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3032563d-005e-4659-834e-55f2fe71ad05/Ebook+Thumbnail+with+Video+-+2025-01-22T204555.167.png",
    bg:"#F8BBD0", accent:"#E91E8C",
    tags:["hotpink","pink","baby-pink","blush","iridescent","silver","glam","bachelorette","bride"],
  },

  // ── Confetti ──────────────────────────────────────────────────────────────────
  {
    id:"confetti-whimsy", type:"confetti", name:"Whimsy Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/c9f67d29-b39f-4ab5-92a9-bd5ebb643dbe/Ebook+Thumbnail+with+Video+-+2025-05-12T180718.730.png",
    bg:"#FFB5C2", accent:"#CE93D8",
    tags:["hotpink","blush","baby-pink","pink","lavender","purple","blossom","white","crystal-clear","confetti","rainbow","silver"],
  },
  {
    id:"confetti-snow-cone", type:"confetti", name:"Snow Cone Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/033d0c7a-a10f-4350-922d-69ea5311be32/Ebook+Thumbnail+with+Video+-+2025-08-04T185123.341.png",
    bg:"#29B6F6", accent:"#E91E8C",
    tags:["blue","baby-blue","monet","hotpink","blush","baby-pink","pink","turquoise","seafoam","white","crystal-clear","rainbow","confetti"],
  },
  {
    id:"confetti-rainbow", type:"confetti", name:"Rainbow Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/fab217a5-436d-4ea9-beb7-e6c10318f92f/Ebook+Thumbnail+with+Video+-+2025-08-04T195425.251.png",
    bg:"#FFD700", accent:"#E91E8C",
    tags:["red","orange","yellow","green","blue","purple","hotpink","rainbow","confetti","white","crystal-clear"],
  },
  {
    id:"confetti-potion", type:"confetti", name:"Potion Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/46a4883c-bf03-4872-86f1-7efb99096811/Ebook+Thumbnail+with+Video+-+2025-05-12T180749.388.png",
    bg:"#9C27B0", accent:"#4CAF50",
    tags:["purple","plum","crystal-purple","lavender","green","lime-green","evergreen","orange","burnt-orange","black","white","crystal-clear"],
  },
  {
    id:"confetti-trick-or-treat", type:"confetti", name:"Trick or Treat Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/213da648-e51b-456a-956a-8496f96fd76d/Ebook+Thumbnail+with+Video+-+2025-05-12T180650.943.png",
    bg:"#FF6B1A", accent:"#9C27B0",
    tags:["orange","burnt-orange","black","purple","plum","crystal-purple","green","lime-green","evergreen","white","crystal-clear","yellow","lemonade","hotpink","blush","baby-pink","pink"],
  },
  {
    id:"confetti-popcorn", type:"confetti", name:"Popcorn Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/51eb7d88-b407-4028-83fb-f4717cbfbfaf/Ebook+Thumbnail+with+Video+-+2025-08-02T212704.395.png",
    bg:"#FFE800", accent:"#E8112D",
    tags:["yellow","lemonade","goldenrod","mustard","crystal-yellow","red","scarlett","white","sugar","crystal-clear","champagne","gold"],
  },
  {
    id:"confetti-peace-love", type:"confetti", name:"Peace & Love Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/d07abd32-5f07-40a5-8dea-a0c80d1b0fc5/Ebook+Thumbnail+with+Video+-+2025-08-04T203531.863.png",
    bg:"#9C27B0", accent:"#FFD700",
    tags:["purple","plum","lavender","blossom","hotpink","blush","baby-pink","pink","yellow","lemonade","goldenrod","blue","baby-blue","monet","white","crystal-clear","sugar","gold","metallic-gold","champagne"],
  },
  {
    id:"confetti-patriotic", type:"confetti", name:"Patriotic Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/049647dd-febe-4a0a-9d2c-3e286102cd4e/Ebook+Thumbnail+with+Video+-+2025-08-04T201549.622.png",
    bg:"#E8112D", accent:"#0052A5",
    tags:["red","scarlett","blue","royalty","navy","crystal-sapphire","white","crystal-clear","silver","naval"],
  },
  {
    id:"confetti-neon", type:"confetti", name:"Neon Confetti",
    desc:"table scatter", price:"$9.99",
    image:"https://static1.squarespace.com/static/66c512fff5e80a05a6127fea/678ec191cd961b05ac3e19ad/689e97de86322825a8bce922/1767924972649/Ebook+Thumbnail+with+Video+-+2025-05-12T180621.466.png?format=1500w",
    bg:"#E91E8C", accent:"#FFE800",
    tags:["hotpink","neon-pink","green","lime-green","yellow","lemonade","orange","coral","blue","baby-blue","purple","lavender","white","crystal-clear","rainbow","confetti"],
  },
  {
    id:"confetti-maple-syrup", type:"confetti", name:"Maple Syrup Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/60422e9d-fb29-4636-8e42-b88db4ed9143/Ebook+Thumbnail+with+Video+-+2025-05-12T180824.202.png",
    bg:"#C4956A", accent:"#FFD700",
    tags:["terracotta","muse","malted","earth","cocoa","stone","burnt-orange","champagne","lace","fog","white","sugar","crystal-clear","gold","metallic-gold","mustard"],
  },
  {
    id:"confetti-lovestruck", type:"confetti", name:"Lovestruck Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/3a7da4e6-60c9-410f-bbd0-8f266ee6db17/Ebook+Thumbnail+with+Video+-+2025-08-02T213331.993.png",
    bg:"#E8112D", accent:"#E91E8C",
    tags:["red","scarlett","hotpink","blush","baby-pink","pink","crystal-red","coral","taffy","white","sugar","crystal-clear","gold","champagne"],
  },
  {
    id:"confetti-ice-cream", type:"confetti", name:"Ice Cream Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f269d887-c136-4fe6-975a-2f44c0a6fe3e/Ebook+Thumbnail+with+Video+-+2025-05-11T155651.923.png",
    bg:"#FFB5C2", accent:"#29B6F6",
    tags:["hotpink","blush","baby-pink","pink","blue","baby-blue","monet","yellow","lemonade","mint","seafoam","white","sugar","crystal-clear","rainbow","confetti"],
  },
  {
    id:"confetti-happy", type:"confetti", name:"Happy Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/0ea4afb3-a59f-4a55-8d19-9bf778012c0f/Ebook+Thumbnail+with+Video+-+2025-05-12T180924.103.png",
    bg:"#FFD700", accent:"#E91E8C",
    tags:["yellow","lemonade","goldenrod","hotpink","blush","orange","coral","lime-green","green","blue","baby-blue","purple","lavender","white","crystal-clear","rainbow","confetti","gold","champagne"],
  },
  {
    id:"confetti-grape-soda", type:"confetti", name:"Grape Soda Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/ca29f64a-f558-474a-82dd-edf1239d0720/Ebook+Thumbnail+with+Video+-+2025-05-11T165034.038.png",
    bg:"#9C27B0", accent:"#CE93D8",
    tags:["purple","plum","crystal-purple","lavender","blossom","peri","navy","metallic-midnight-blue","white","crystal-clear","silver","fog"],
  },
  {
    id:"confetti-evergreen", type:"confetti", name:"Evergreen Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/fead4cf1-fbcb-4f06-ba3b-0f169847de20/Ebook+Thumbnail+with+Video+-+2025-08-04T190158.014.png",
    bg:"#2E7D32", accent:"#FFD700",
    tags:["green","evergreen","meadow","lime-green","metallic-forest-green","teal","seafoam","white","crystal-clear","gold","champagne","earth"],
  },
  {
    id:"confetti-dream", type:"confetti", name:"Dream Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f442dbe8-a458-405b-a468-35ec8d6171e1/Ebook+Thumbnail+with+Video+-+2025-05-11T164809.368.png",
    bg:"#CE93D8", accent:"#81D4FA",
    tags:["lavender","purple","blossom","baby-blue","monet","blush","baby-pink","hotpink","white","crystal-clear","silver","confetti","rainbow"],
  },
  {
    id:"confetti-creamsicle", type:"confetti", name:"Creamsicle Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/f059de43-e228-4af1-a773-562b96b897fb/Ebook+Thumbnail+with+Video+-+2025-08-02T214408.601.png",
    bg:"#FF6B1A", accent:"#FFF3E0",
    tags:["orange","burnt-orange","aloha","coral","taffy","champagne","lace","white","sugar","crystal-clear","yellow","lemonade","peach"],
  },
  {
    id:"confetti-cotton-candy", type:"confetti", name:"Cotton Candy Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/76b1696f-5574-45f6-a0da-3a8a071df420/Ebook+Thumbnail+with+Video+-+2025-08-02T221140.087.png",
    bg:"#FFB5C2", accent:"#81D4FA",
    tags:["hotpink","blush","baby-pink","pink","baby-blue","monet","lavender","blossom","white","sugar","crystal-clear","confetti","rainbow"],
  },
  {
    id:"confetti-cherries", type:"confetti", name:"Cherries Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/934d86db-b566-407a-bd36-4ba90ca225ad/Ebook+Thumbnail+with+Video+-+2025-08-02T221944.808.png",
    bg:"#E8112D", accent:"#4CAF50",
    tags:["red","scarlett","crystal-red","hotpink","blush","green","meadow","lime-green","white","sugar","crystal-clear"],
  },
  {
    id:"confetti-candy-cane", type:"confetti", name:"Candy Cane Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/8511817a-2ee0-40cf-97b9-90336b933d8c/Ebook+Thumbnail+with+Video+-+2025-05-11T164358.955.png",
    bg:"#E8112D", accent:"#F8F8F8",
    tags:["red","scarlett","crystal-red","white","sugar","crystal-clear","hotpink","blush","baby-pink","silver","fog"],
  },
  {
    id:"confetti-butterfly", type:"confetti", name:"Butterfly Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a84d2df4-6a74-4e87-bef5-a1f517477f41/Ebook+Thumbnail+with+Video+-+2025-08-04T191714.525.png",
    bg:"#CE93D8", accent:"#81D4FA",
    tags:["lavender","purple","blossom","baby-blue","monet","blush","baby-pink","hotpink","mint","seafoam","white","crystal-clear","confetti","rainbow","silver"],
  },
  {
    id:"confetti-bubblegum", type:"confetti", name:"Bumblegum Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/a3bd21ee-b06b-4756-b915-c77a1e6f599a/Ebook+Thumbnail+with+Video+-+2025-08-04T193308.492.png",
    bg:"#E91E8C", accent:"#FFB5C2",
    tags:["hotpink","blush","baby-pink","pink","coral","taffy","white","sugar","crystal-clear","champagne","metallic-fuchsia","crystal-magenta"],
  },
  {
    id:"confetti-boo", type:"confetti", name:"Boo Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/2d422ab5-9113-4518-9140-0940e25203fc/Ebook+Thumbnail+with+Video+-+2025-08-04T192703.881.png",
    bg:"#1A1A1A", accent:"#FF6B1A",
    tags:["black","orange","burnt-orange","purple","plum","crystal-purple","white","crystal-clear","gray-smoke","green","lime-green"],
  },
  {
    id:"confetti-licorice", type:"confetti", name:"Licorice Confetti",
    desc:"table scatter", price:"$8.99",
    image:"https://images.squarespace-cdn.com/content/v1/66c512fff5e80a05a6127fea/1ccf1516-8501-4fcf-8764-924c0c815aa0/Ebook+Thumbnail+with+Video+-+2025-12-29T195018.786.png",
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
function TablewearVisual({ item }) {
  if (item.image) {
    return (
      <img
        src={item.image} alt={item.name}
        style={{width:"100%",height:"100%",objectFit:"contain",display:"block",background:"#fafafa"}}
        onError={e=>{e.target.style.display="none";}}
      />
    );
  }
  if (item.type === "plate") {
    const isCow = item.id.includes("cow");
    return (
      <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#fdf5f8"}}>
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
        <div style={{fontSize:11,fontWeight:700,color:DARK,fontFamily:"'DM Sans',sans-serif",lineHeight:1.3}}>{item.name}</div>
        <div style={{fontSize:10,color:"#aaa",fontFamily:"'DM Sans',sans-serif",marginTop:1}}>{item.desc}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:6}}>
          <div style={{fontSize:13,fontWeight:900,color:PUNCH,fontFamily:"'DM Sans',sans-serif"}}>{item.price}</div>
          <button onClick={()=>addToCart(item)} style={{
            background:inCart(item.id)?SOFT:`linear-gradient(135deg,${HOT},${PUNCH})`,
            color:inCart(item.id)?HOT:WHITE,
            border:inCart(item.id)?`1.5px solid ${HOT}`:"none",
            borderRadius:20,padding:"5px 12px",
            fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,cursor:"pointer",
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
          <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>Matching Tableware</div>
          <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.85}}>Coordinated with your garland — add to your package</div>
        </div>
      </div>

      {plates.length > 0 && (
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,color:"#aaa",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Plates</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {plates.map(item=><ItemCard key={item.id} item={item}/>)}
          </div>
        </div>
      )}

      {cups.length > 0 && (
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,color:"#aaa",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Cups</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {cups.map(item=><ItemCard key={item.id} item={item}/>)}
          </div>
        </div>
      )}

      {napkins.length > 0 && (
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,color:"#aaa",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Napkins</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {napkins.map(item=><ItemCard key={item.id} item={item}/>)}
          </div>
        </div>
      )}

      {confetti.length > 0 && (
        <div style={{marginBottom:4}}>
          <div style={{fontSize:10,fontWeight:700,color:"#aaa",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Confetti</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {confetti.map(item=><ItemCard key={item.id} item={item}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

function GarlandBuilder({ cart, setCart, setTab, selected, setSelected }) {
  const [mode,        setMode]        = useState("diy");
  const [arrangement, setArrangement] = useState("mixed");

  const maxColors = arrangement === "mixed" ? 5 : 4;

  const toggleColor = id => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(c=>c!==id);
      if (prev.length >= maxColors) return [...prev.slice(1), id]; // rotate out oldest
      return [...prev, id];
    });
  };

  const price = mode === "diy" ? "$65" : "$95";

  return (
    <div style={{marginTop:8,paddingTop:24,borderTop:`2px solid ${MID}`}}>
      {/* Section header */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <div style={{flex:1,height:1.5,background:MID,borderRadius:2}}/>
        <div style={{fontSize:11,fontWeight:700,color:HOT,fontFamily:"'DM Sans',sans-serif",letterSpacing:"1.5px",textTransform:"uppercase",whiteSpace:"nowrap"}}>Custom Balloon Garland</div>
        <div style={{flex:1,height:1.5,background:MID,borderRadius:2}}/>
      </div>

      {/* Live preview */}
      <GarlandPreview selectedColors={selected} arrangement={arrangement}/>

      {/* Selected color pills */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10,marginBottom:14,minHeight:28}}>
        {selected.length === 0
          ? <div style={{fontSize:11,color:"#bbb",fontFamily:"'DM Sans',sans-serif",paddingTop:4}}>No colors selected yet — pick up to {maxColors}</div>
          : selected.map(id=>{
              const col = BALLOON_COLORS.find(c=>c.id===id);
              return (
                <div key={id} onClick={()=>toggleColor(id)} style={{
                  display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:20,
                  background:SOFT,border:`1.5px solid ${col.color==="F8F8F8"?BORDER:col.color}`,
                  cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:DARK,
                }}>
                  <span style={{width:12,height:12,borderRadius:"50%",background:col.color,display:"inline-block",border:"1px solid rgba(0,0,0,0.12)",flexShrink:0}}/>
                  {col.label} ×
                </div>
              );
            })
        }
      </div>

      {/* DIY / Pre-Inflated */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:HOT,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:8}}>
          DIY or Pre-Inflated
          <span style={{marginLeft:8,fontWeight:400,color:"#bbb",textTransform:"none",letterSpacing:0}}>{mode==="diy"?"DIY":"Pre-Inflated (Pickup Only)"}</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[{id:"diy",label:"DIY"},{id:"preinflated",label:"Pre-Inflated (Pickup Only)"}].map(o=>(
            <button key={o.id} onClick={()=>setMode(o.id)} style={{
              padding:"9px 16px",borderRadius:8,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
              fontSize:12,fontWeight:700,border:mode===o.id?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,
              background:mode===o.id?SOFT:WHITE,color:mode===o.id?HOT:DARK,transition:"all 0.15s",
            }}>{o.label}</button>
          ))}
        </div>
      </div>

      {/* Mixed / Color Block */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:HOT,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:6}}>
          Color Pattern
          <span style={{marginLeft:8,fontWeight:400,color:"#bbb",textTransform:"none",letterSpacing:0}}>{arrangement==="mixed"?"Mixed":"Color Block"}</span>
        </div>
        <div style={{fontSize:11,color:"#999",fontFamily:"'DM Sans',sans-serif",marginBottom:8,lineHeight:1.5}}>
          {arrangement==="mixed"
            ? "Select Mixed for up to 5 colors including specialty patterned balloons."
            : "Color Block uses up to 4 classic solid colors in clean sections."}
        </div>
        <div style={{display:"flex",gap:8}}>
          {[{id:"mixed",label:"Mixed"},{id:"colorblock",label:"Color Block"}].map(o=>(
            <button key={o.id} onClick={()=>{setArrangement(o.id);setSelected([]);}} style={{
              padding:"9px 16px",borderRadius:8,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
              fontSize:12,fontWeight:700,border:arrangement===o.id?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,
              background:arrangement===o.id?SOFT:WHITE,color:arrangement===o.id?HOT:DARK,transition:"all 0.15s",
            }}>{o.label}</button>
          ))}
        </div>
      </div>

      {/* Color palette grid */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:HOT,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:10}}>
          {arrangement==="mixed"?"Pick Up to 5 Colors":"Pick Up to 4 Colors"}
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
                <div style={{fontSize:9,color:isSel?HOT:"#bbb",fontFamily:"'DM Sans',sans-serif",fontWeight:isSel?700:400,textAlign:"center",lineHeight:1.2}}>
                  {c.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price + CTA */}
      <div style={{padding:"14px 16px",borderRadius:16,background:SOFT,border:`1.5px solid ${MID}`,display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div>
          <div style={{fontSize:10,color:"#aaa",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:0.8}}>Starting at</div>
          <div style={{fontSize:26,fontWeight:900,color:HOT,fontFamily:"'DM Sans',sans-serif"}}>{price}</div>
          <div style={{fontSize:10,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>{mode==="diy"?"Shipped to you":"Pickup only"}</div>
        </div>
        <div style={{textAlign:"right",fontSize:11,color:"#aaa",fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>
          {selected.length} color{selected.length!==1?"s":""} selected<br/>
          {arrangement==="mixed"?"Mixed arrangement":"Color block"}
        </div>
      </div>
      {/* Add garland to cart */}
      {selected.length > 0 && (
        <button onClick={()=>{
          const garlandId = `garland-${mode}-${arrangement}`;
          if (!cart.some(c=>c.id===garlandId)) {
            setCart(prev=>[...prev,{
              id: garlandId,
              name: `Custom Balloon Garland — ${mode==="diy"?"DIY":"Pre-Inflated"}, ${arrangement==="mixed"?"Mixed":"Color Block"}`,
              price: parseFloat(price.replace("$","")),
              image: null,
              category: "garland",
              colors: selected,
            }]);
          }
        }} style={{
          ...BP, width:"100%", padding:"14px", fontSize:14,
          background: cart.some(c=>c.id===`garland-${mode}-${arrangement}`) ? SOFT : undefined,
          color:      cart.some(c=>c.id===`garland-${mode}-${arrangement}`) ? HOT  : undefined,
          border:     cart.some(c=>c.id===`garland-${mode}-${arrangement}`) ? `1.5px solid ${HOT}` : undefined,
        }}>
          {cart.some(c=>c.id===`garland-${mode}-${arrangement}`) ? "✓ Garland Added to Package" : `Add Garland to My Package — ${price}`}
        </button>
      )}

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
  const items = TABLEWARE.filter(i => i.type === type);
  const scored = items.map(item => ({
    ...item,
    score: item.tags.filter(t => selectedColors.includes(t)).length,
  })).sort((a,b) => b.score - a.score);

  const inCart = id => cart.some(c => c.id === id);
  const toggle = item => {
    if (inCart(item.id)) {
      setCart(prev => prev.filter(c => c.id !== item.id));
    } else {
      setCart(prev => [...prev, {
        id: item.id, name: item.name,
        price: parseFloat(item.price.replace("$","")),
        image: item.image, category: "tableware",
      }]);
    }
  };

  return (
    <div style={{marginBottom:28}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,paddingTop:20,borderTop:`2px solid ${MID}`}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${HOT},${PUNCH})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:WHITE,flexShrink:0}}>{stepNum}</div>
        <div>
          <div style={{fontSize:14,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{emoji} {title}</div>
          <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.8}}>{subtitle}</div>
        </div>
      </div>
      {selectedColors.length > 0 && scored.some(i=>i.score>0) && (
        <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginBottom:10,opacity:0.85}}>✨ Best color matches shown first</div>
      )}
      <Carousel items={scored} renderItem={item => {
        const matched = item.score > 0 && selectedColors.length > 0;
        const added   = inCart(item.id);
        return (
          <div key={item.id} style={{background:WHITE,border:`1.5px solid ${added?HOT:matched?MID:BORDER}`,borderRadius:14,overflow:"hidden",transition:"all 0.2s"}}>
            <div style={{position:"relative",width:"100%",aspectRatio:"1/1",overflow:"hidden"}}>
              <TablewearVisual item={item}/>
              {matched && !added && (
                <div style={{position:"absolute",top:4,left:4,background:`linear-gradient(135deg,${HOT},${PUNCH})`,color:WHITE,fontSize:8,fontWeight:700,fontFamily:"'DM Sans',sans-serif",padding:"2px 6px",borderRadius:8}}>✨</div>
              )}
            </div>
            <div style={{padding:"6px 7px"}}>
              <div style={{fontSize:10,fontWeight:700,color:DARK,fontFamily:"'DM Sans',sans-serif",lineHeight:1.3,marginBottom:2}}>{item.name}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:4}}>
                <div style={{fontSize:11,fontWeight:900,color:PUNCH,fontFamily:"'DM Sans',sans-serif"}}>{item.price}</div>
                <button onClick={()=>toggle(item)} style={{
                  background:added?SOFT:`linear-gradient(135deg,${HOT},${PUNCH})`,
                  color:added?HOT:WHITE,border:added?`1.5px solid ${HOT}`:"none",
                  borderRadius:20,padding:"4px 8px",
                  fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:700,cursor:"pointer",
                }}>{added?"✓":"+ Add"}</button>
              </div>
            </div>
          </div>
        );
      }}/>
    </div>
  );
}

// ─── Confetti Step (with size selector) ──────────────────────────────────────
function ConfettiStep({ stepNum, selectedColors, cart, setCart }) {
  const items = TABLEWARE.filter(i => i.type === "confetti");
  const [sizes, setSizes] = useState({}); // itemId → "mini" | "tube"

  const scored = items.map(item => ({
    ...item,
    score: item.tags.filter(t => selectedColors.includes(t)).length,
  })).sort((a,b) => b.score - a.score);

  const getSize = id => sizes[id] || "mini";
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

  return (
    <div style={{marginBottom:28}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,paddingTop:20,borderTop:`2px solid ${MID}`}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${HOT},${PUNCH})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:WHITE,flexShrink:0}}>{stepNum}</div>
        <div>
          <div style={{fontSize:14,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>🎊 Add Some Confetti</div>
          <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.8}}>The perfect finishing touch — choose your size</div>
        </div>
      </div>
      {selectedColors.length > 0 && scored.some(i=>i.score>0) && (
        <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginBottom:10,opacity:0.85}}>✨ Best color matches shown first</div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {scored.map(item => {
          const matched = item.score > 0 && selectedColors.length > 0;
          const size    = getSize(item.id);
          const added   = inCart(item.id, size);
          const sizePrice = size === "mini"
            ? parseFloat(item.price.replace("$","")).toFixed(2)
            : (parseFloat(item.price.replace("$","")) * 2).toFixed(2);
          return (
            <div key={item.id} style={{
              background:WHITE,
              border:`1.5px solid ${added?HOT:matched?MID:BORDER}`,
              borderRadius:14,overflow:"hidden",transition:"all 0.2s",
            }}>
              <div style={{position:"relative",width:"100%",aspectRatio:"1/1",overflow:"hidden"}}>
                <TablewearVisual item={item}/>
                {matched && !added && (
                  <div style={{position:"absolute",top:6,left:6,background:`linear-gradient(135deg,${HOT},${PUNCH})`,color:WHITE,fontSize:9,fontWeight:700,fontFamily:"'DM Sans',sans-serif",padding:"2px 8px",borderRadius:10}}>✨</div>
                )}
              </div>
              <div style={{padding:"8px 10px"}}>
                <div style={{fontSize:11,fontWeight:700,color:DARK,fontFamily:"'DM Sans',sans-serif",lineHeight:1.3}}>{item.name}</div>
                {/* Size selector */}
                <div style={{display:"flex",gap:4,marginTop:6,marginBottom:6}}>
                  {[{id:"mini",label:"Mini ¼oz"},{id:"tube",label:"Tube 1oz"}].map(opt=>(
                    <button key={opt.id} onClick={()=>setSizes(prev=>({...prev,[item.id]:opt.id}))} style={{
                      flex:1,padding:"3px 0",borderRadius:8,cursor:"pointer",
                      fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:700,
                      border:size===opt.id?`1.5px solid ${HOT}`:`1px solid ${BORDER}`,
                      background:size===opt.id?SOFT:WHITE,
                      color:size===opt.id?HOT:"#aaa",
                    }}>{opt.label}</button>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontSize:13,fontWeight:900,color:PUNCH,fontFamily:"'DM Sans',sans-serif"}}>${sizePrice}</div>
                  <button onClick={()=>toggle(item,size)} style={{
                    background:added?SOFT:`linear-gradient(135deg,${HOT},${PUNCH})`,
                    color:added?HOT:WHITE,
                    border:added?`1.5px solid ${HOT}`:"none",
                    borderRadius:20,padding:"5px 12px",
                    fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,cursor:"pointer",
                  }}>
                    {added?"✓ Added":"+ Add"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Foil Balloon Step ────────────────────────────────────────────────────────
function FoilStep({ stepNum, selectedColors, cart, setCart }) {
  const items = TABLEWARE.filter(i => i.type === "foil");
  const scored = items.map(item => ({
    ...item,
    score: item.tags.filter(t => selectedColors.includes(t)).length,
  })).sort((a,b) => b.score - a.score);

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

  return (
    <div style={{marginBottom:28}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,paddingTop:20,borderTop:`2px solid ${MID}`}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${HOT},${PUNCH})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:WHITE,flexShrink:0}}>{stepNum}</div>
        <div>
          <div style={{fontSize:14,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>🎈 Add Foil Balloons</div>
          <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.8}}>Number balloons, letters, shapes & more</div>
        </div>
      </div>
      {selectedColors.length > 0 && scored.some(i=>i.score>0) && (
        <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginBottom:10,opacity:0.85}}>✨ Best color matches shown first</div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {scored.map(item => {
          if (item.numberBalloon) {
            const selectedNums = [0,1,2,3,4,5,6,7,8,9].filter(n => numInCart(item,n));
            return (
              <div key={item.id} style={{background:WHITE,border:`1.5px solid ${selectedNums.length>0?HOT:BORDER}`,borderRadius:14,overflow:"hidden",transition:"all 0.2s"}}>
                <div style={{display:"flex"}}>
                  <div style={{width:90,flexShrink:0,aspectRatio:"1/1",overflow:"hidden"}}>
                    <TablewearVisual item={item}/>
                  </div>
                  <div style={{padding:"10px 12px",flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,color:DARK,fontFamily:"'DM Sans',sans-serif",lineHeight:1.3}}>{item.name}</div>
                    <div style={{fontSize:10,color:"#aaa",fontFamily:"'DM Sans',sans-serif",marginTop:2}}>{item.desc} · {item.price} each</div>
                  </div>
                </div>
                <div style={{padding:"10px 12px 14px",borderTop:`1px solid ${SOFT}`}}>
                  <div style={{fontSize:10,fontWeight:700,color:HOT,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:0.8,marginBottom:8}}>Tap to select your numbers</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6}}>
                    {[0,1,2,3,4,5,6,7,8,9].map(n => {
                      const sel = numInCart(item,n);
                      return (
                        <button key={n} onClick={()=>toggleNum(item,n)} style={{
                          aspectRatio:"1/1",borderRadius:10,cursor:"pointer",
                          fontFamily:"'DM Sans',sans-serif",fontSize:18,fontWeight:900,
                          border:sel?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,
                          background:sel?SOFT:WHITE,color:sel?HOT:DARK,
                          transition:"all 0.15s",
                        }}>{n}</button>
                      );
                    })}
                  </div>
                  {selectedNums.length > 0 && (
                    <div style={{marginTop:10,fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",fontWeight:700}}>
                      Selected: {selectedNums.join(", ")} · ${(selectedNums.length * parseFloat(item.price.replace("$",""))).toFixed(2)} total
                    </div>
                  )}
                </div>
              </div>
            );
          }
          // Regular foil balloon
          const added = inCart(item.id);
          const matched = item.score > 0 && selectedColors.length > 0;
          return (
            <div key={item.id} style={{background:WHITE,border:`1.5px solid ${added?HOT:matched?MID:BORDER}`,borderRadius:14,overflow:"hidden",transition:"all 0.2s"}}>
              <div style={{display:"flex"}}>
                <div style={{width:90,flexShrink:0,aspectRatio:"1/1",overflow:"hidden",position:"relative"}}>
                  <TablewearVisual item={item}/>
                  {matched && !added && (
                    <div style={{position:"absolute",top:6,left:6,background:`linear-gradient(135deg,${HOT},${PUNCH})`,color:WHITE,fontSize:9,fontWeight:700,fontFamily:"'DM Sans',sans-serif",padding:"2px 8px",borderRadius:10}}>✨</div>
                  )}
                </div>
                <div style={{padding:"10px 12px",flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:DARK,fontFamily:"'DM Sans',sans-serif",lineHeight:1.3}}>{item.name}</div>
                    <div style={{fontSize:10,color:"#aaa",fontFamily:"'DM Sans',sans-serif",marginTop:2}}>{item.desc}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}>
                    <div style={{fontSize:14,fontWeight:900,color:PUNCH,fontFamily:"'DM Sans',sans-serif"}}>{item.price}</div>
                    <button onClick={()=>toggle(item)} style={{
                      background:added?SOFT:`linear-gradient(135deg,${HOT},${PUNCH})`,
                      color:added?HOT:WHITE, border:added?`1.5px solid ${HOT}`:"none",
                      borderRadius:20,padding:"6px 14px",
                      fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,cursor:"pointer",
                    }}>{added?"✓ Added":"+ Add"}</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Curated Themes ───────────────────────────────────────────────────────────
const CURATED_THEMES = [
  {
    id:"theme-vegas",
    name:"Vegas Night",
    emoji:"🎰",
    desc:"Casino glam — gold, black, red, hot pink",
    colors:["#FFD700","#1A1A1A","#E8112D","#E91E8C"],
    items:["napkin-jackpot","napkin-ticket","napkin-queen-card","cup-black-suit-potion","confetti-licorice-mini"],
  },
  {
    id:"theme-tropical",
    name:"Tropical Bachelorette",
    emoji:"🌺",
    desc:"Island energy — teal, coral, orange, green",
    colors:["#00B8D4","#FF6B1A","#4CAF50","#E91E8C"],
    items:["napkin-luau","napkin-orchid","napkin-sun-cabana","cup-island-vibes","cup-palm-tree"],
  },
  {
    id:"theme-hot-pink",
    name:"Hot Pink Bride",
    emoji:"🩷",
    desc:"All pink, all the time — no notes",
    colors:["#E91E8C","#F4A7B9","#FFB5C2","#FF4081"],
    items:["napkin-kiss-me","napkin-love-heart","napkin-yes-girl","cup-pink-lemonade","cup-girl-power"],
  },
  {
    id:"theme-spooky",
    name:"Dark & Spooky",
    emoji:"🖤",
    desc:"Witch vibes — black, purple, blood red",
    colors:["#1A1A1A","#9C27B0","#E8112D","#FF6B1A"],
    items:["napkin-witch-please","napkin-vampire-lips","cup-doomsday","cup-blood-bags","confetti-licorice-mini"],
  },
  {
    id:"theme-coastal-cowgirl",
    name:"Coastal Cowgirl",
    emoji:"🤠",
    desc:"Western meets beach — terracotta, cream, teal",
    colors:["#C4956A","#F8F8F8","#00B8D4","#4CAF50"],
    items:["napkin-last-rodeo","napkin-taco-party","cup-giddy-up","cup-fiesta-striped"],
  },
];

function CuratedThemes({ cart, setCart }) {
  const allItems = id => {
    // handle confetti with size suffix
    if (id.endsWith("-mini") || id.endsWith("-tube")) {
      const baseId = id.replace(/-mini$|-tube$/, "");
      const size   = id.endsWith("-mini") ? "mini" : "tube";
      const item   = TABLEWARE.find(i => i.id === baseId);
      if (!item) return null;
      const sizeLabel = size === "mini" ? "Mini Pack ¼oz" : "Tube 1oz";
      const sizePrice = size === "mini" ? parseFloat(item.price.replace("$","")) : parseFloat(item.price.replace("$","")) * 2;
      return { ...item, id, name:`${item.name} — ${sizeLabel}`, price:`$${sizePrice.toFixed(2)}` };
    }
    return TABLEWARE.find(i => i.id === id) || null;
  };

  const themeAllAdded = theme => theme.items.every(id => cart.some(c => c.id === id));

  const addTheme = theme => {
    const toAdd = theme.items.map(allItems).filter(item => item && !cart.some(c => c.id === item.id));
    if (!toAdd.length) return;
    setCart(prev => [...prev, ...toAdd.map(item => ({
      id: item.id, name: item.name,
      price: parseFloat(item.price.replace("$","")),
      image: item.image, category: "tableware",
    }))]);
  };

  return (
    <div style={{marginTop:28,paddingTop:20,borderTop:`2px solid ${MID}`}}>
      <div style={{textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:11,fontWeight:700,color:HOT,fontFamily:"'DM Sans',sans-serif",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:4}}>Not sure where to start?</div>
        <div style={{fontSize:18,fontWeight:900,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>Shop Curated Themes</div>
        <div style={{fontSize:12,color:"#aaa",fontFamily:"'DM Sans',sans-serif"}}>Pre-styled sets — add everything with one tap</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {CURATED_THEMES.map(theme => {
          const allAdded = themeAllAdded(theme);
          return (
            <div key={theme.id} style={{borderRadius:18,border:`1.5px solid ${allAdded?HOT:BORDER}`,background:allAdded?SOFT:WHITE,padding:"16px",transition:"all 0.2s"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <div style={{fontSize:18,marginBottom:4}}>{theme.emoji}</div>
                  <div style={{fontSize:14,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{theme.name}</div>
                  <div style={{fontSize:11,color:"#aaa",fontFamily:"'DM Sans',sans-serif",marginTop:2}}>{theme.desc}</div>
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0,marginLeft:10,marginTop:4}}>
                  {theme.colors.map((c,i)=>(
                    <div key={i} style={{width:14,height:14,borderRadius:"50%",background:c,border:"1.5px solid rgba(0,0,0,0.12)"}}/>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:12}}>
                {theme.items.map(id => {
                  const item = allItems(id);
                  if (!item) return null;
                  const added = cart.some(c => c.id === id);
                  return (
                    <div key={id} style={{display:"flex",justifyContent:"space-between",fontFamily:"'DM Sans',sans-serif",fontSize:11,marginBottom:4,color:added?HOT:DARK}}>
                      <span>{added?"✓ ":""}{item.name}</span>
                      <span style={{fontWeight:700,color:added?HOT:PUNCH,flexShrink:0,marginLeft:8}}>{item.price}</span>
                    </div>
                  );
                })}
              </div>
              <button onClick={()=>allAdded?null:addTheme(theme)} style={{
                ...BP,width:"100%",padding:"12px",fontSize:13,
                background:allAdded?SOFT:undefined,
                color:allAdded?HOT:undefined,
                border:allAdded?`1.5px solid ${HOT}`:undefined,
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
      <div style={{fontSize:12,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:selected?pkg.headlineColor:DARK,marginBottom:2}}>{pkg.name}</div>
      <div style={{fontSize:10,color:"#bbb",fontFamily:"'DM Sans',sans-serif",marginBottom:6}}>{pkg.tagline}</div>
      <div style={{fontSize:15,fontWeight:900,color:selected?pkg.headlineColor:PUNCH,fontFamily:"'DM Sans',sans-serif"}}>{pkg.price}</div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DecorTab({ groupSize, cart, setCart, setTab }) {
  const [selected, setSelected] = useState([]); // shared garland colors → drives sort order in all steps

  return (
    <div style={{paddingBottom:32}}>

      {/* ── Hero ── */}
      <div style={{
        borderRadius:22,padding:"22px 18px",marginBottom:18,textAlign:"center",
        background:`linear-gradient(135deg,${SOFT} 0%,${MID} 100%)`,
        border:`1.5px solid ${MID}`,
      }}>
        <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>Bach Hotline</div>
        <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:22,fontWeight:900,margin:"0 0 6px",color:DARK}}>
          <em style={{color:HOT}}>Build Your Decor Package</em>
        </h2>
        <p style={{fontSize:12,color:HOT,fontFamily:"'DM Sans',sans-serif",margin:0,opacity:0.85,lineHeight:1.6}}>
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
        stepNum={3} emoji="🍽️" title="Pick Your Plates"
        subtitle="Add as many as you like — mix and match"
        type="plate" selectedColors={selected}
        cart={cart||[]} setCart={setCart||(_=>{})}
      />

      {/* ── Step 4: Cups ── */}
      <ProductStep
        stepNum={4} emoji="🥂" title="Pick Your Cups"
        subtitle="Sorted by your garland colors when selected"
        type="cup" selectedColors={selected}
        cart={cart||[]} setCart={setCart||(_=>{})}
      />

      {/* ── Step 5: Napkins ── */}
      <ProductStep
        stepNum={5} emoji="🎀" title="Pick Your Napkins"
        subtitle="From fun to fancy"
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
        stepNum={7} emoji="🎁" title="Pick Your Treat Bags"
        subtitle="Sweet little extras for your crew"
        type="treatbag" selectedColors={selected}
        cart={cart||[]} setCart={setCart||(_=>{})}
      />

      {/* ── Step 8: Banners & Backdrops ── */}
      <ProductStep
        stepNum={8} emoji="🎊" title="Banners & Backdrops"
        subtitle="Set the scene for your squad"
        type="banner" selectedColors={selected}
        cart={cart||[]} setCart={setCart||(_=>{})}
      />

      {/* ── Curated Themes ── */}
      <CuratedThemes cart={cart||[]} setCart={setCart||(_=>{})}/>

      {/* ── Cart Summary ── */}
      {(cart||[]).length > 0 && (
        <div style={{marginTop:28,padding:"16px",borderRadius:18,background:`linear-gradient(135deg,${SOFT},${MID})`,border:`1.5px solid ${MID}`}}>
          <div style={{fontSize:14,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>🎉 Your Party Package</div>
          <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginBottom:12,opacity:0.85}}>Everything you've added — one checkout</div>
          {cart.map(item=>(
            <div key={item.id} style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontFamily:"'DM Sans',sans-serif",fontSize:12}}>
              <span style={{color:DARK,flex:1,marginRight:8,lineHeight:1.4}}>{item.name}</span>
              <span style={{fontWeight:700,color:PUNCH,flexShrink:0}}>${typeof item.price==="number"?item.price.toFixed(2):item.price}</span>
            </div>
          ))}
          <div style={{height:1,background:MID,margin:"10px 0"}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'DM Sans',sans-serif",fontWeight:900,fontSize:15,marginBottom:14}}>
            <span style={{color:DARK}}>Total</span>
            <span style={{color:HOT}}>${cart.reduce((s,i)=>s+(typeof i.price==="number"?i.price:parseFloat(i.price)||0),0).toFixed(2)}</span>
          </div>
          <button onClick={()=>setTab&&setTab("shop")} style={{...BP,width:"100%",padding:"14px",fontSize:14}}>
            Review & Checkout →
          </button>
          <div style={{textAlign:"center",marginTop:8,fontSize:10,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>
            Secure checkout · No Etsy fees
          </div>
        </div>
      )}
    </div>
  );
}
