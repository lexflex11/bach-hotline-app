import React, { useState, useRef } from 'react';
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
  { id:"blush",      label:"Blush",       color:"#F4A7B9", dot:"#F4A7B9" },
  { id:"hotpink",    label:"Hot Pink",    color:"#E91E8C", dot:"#E91E8C" },
  { id:"white",      label:"White",       color:"#F8F8F8", dot:"#F0F0F0" },
  { id:"champagne",  label:"Champagne",   color:"#F5DEB3", dot:"#F5DEB3" },
  { id:"gold",       label:"Gold",        color:"#FFD700", dot:"#FFD700" },
  { id:"silver",     label:"Silver",      color:"#D0D0D0", dot:"#C0C0C0" },
  { id:"black",      label:"Black",       color:"#1A1A1A", dot:"#111"    },
  { id:"red",        label:"Red",         color:"#E53935", dot:"#E53935" },
  { id:"purple",     label:"Purple",      color:"#9C27B0", dot:"#9C27B0" },
  { id:"lavender",   label:"Lavender",    color:"#CE93D8", dot:"#CE93D8" },
  { id:"blue",       label:"Blue",        color:"#1E88E5", dot:"#1E88E5" },
  { id:"mint",       label:"Mint",        color:"#80CBC4", dot:"#80CBC4" },
  { id:"sage",       label:"Sage",        color:"#8FAF8F", dot:"#8FAF8F" },
  { id:"terracotta", label:"Terracotta",  color:"#C4956A", dot:"#C4956A" },
  { id:"mauve",      label:"Mauve",       color:"#C48B9F", dot:"#C48B9F" },
  { id:"cow",        label:"Cow Print",   color:"#fff",    dot:"#fff",   pattern:"cow"   },
  { id:"dalmatian",  label:"Dalmatian",   color:"#fff",    dot:"#fff",   pattern:"dalmatian" },
  { id:"confetti",   label:"Confetti",    color:"#FFB6C1", dot:"#FFB6C1",pattern:"confetti"  },
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

function GarlandPreview({ selectedColors, arrangement }) {
  if (selectedColors.length === 0) {
    return (
      <div style={{height:180,display:"flex",alignItems:"center",justifyContent:"center",background:"#fdf5f8",borderRadius:14,border:`2px dashed ${BORDER}`}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:6}}>🎈</div>
          <div style={{fontSize:12,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>Pick colors to preview your garland</div>
        </div>
      </div>
    );
  }
  const palette = selectedColors.map(id => BALLOON_COLORS.find(c=>c.id===id)).filter(Boolean);
  const getColor = (ci) => palette[ci % palette.length];

  return (
    <div style={{position:"relative",height:200,background:"linear-gradient(135deg,#fdf5f8 0%,#fff8fc 100%)",borderRadius:14,overflow:"hidden",border:`1.5px solid ${BORDER}`}}>
      {GARLAND_BALLOONS.map((b,i)=>{
        const col = getColor(b.ci);
        return (
          <div key={i} style={{
            position:"absolute",
            left:`${b.x}%`, top:`${b.y}%`,
            width:b.s, height:b.s*1.12,
            transform:"translate(-50%,-50%)",
            borderRadius:"50% 50% 48% 52%/55% 55% 45% 45%",
            background:`radial-gradient(circle at 33% 30%,rgba(255,255,255,0.55),${col.color})`,
            boxShadow:`2px 3px 8px rgba(0,0,0,0.18),inset -2px -3px 6px rgba(0,0,0,0.1)`,
            border:col.color==="#F8F8F8"?`1px solid #ddd`:"none",
          }}>
            {col.pattern && <PatternDots pattern={col.pattern} size={b.s}/>}
          </div>
        );
      })}
      {/* Shadow beneath garland */}
      <div style={{position:"absolute",bottom:"4%",left:"8%",right:"8%",height:16,borderRadius:"50%",background:"rgba(0,0,0,0.08)",filter:"blur(6px)"}}/>
    </div>
  );
}

// ─── Tableware data ───────────────────────────────────────────────────────────
// 💡 TO ADD YOUR REAL ETSY PHOTOS: replace the `image: null` lines below with
//    your Etsy listing image URL wrapped in the proxy, like:
//    image: "https://images.weserv.nl/?url=i.etsystatic.com/YOUR_IMAGE_ID.jpg"
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
    image: null,         bg:"#FF69B4", accent:"#E91E8C",
    tags:["hotpink","blush","lavender","confetti","mauve"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"plate-sardine",  type:"plate", name:"Sardine Can Paper Plates",
    desc:"Bachelorette Party",     price:"$13.98",
    image: null,         bg:"#81D4FA", accent:"#0288D1",
    tags:["blue","mint","white"],
    etsyUrl:"https://bachhotlinesupplies.etsy.com",
  },
  {
    id:"plate-vegas",    type:"plate", name:"Vegas Casino Paper Plates",
    desc:"Bachelorette Party",     price:"$10.95",
    image: null,         bg:"#F4A7B9", accent:"#C4956A",
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
  // ── Cups (add your real cup products below) ──────────────────────────────────
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
];

function matchTableware(selectedColorIds) {
  if (!selectedColorIds.length) return [];
  // Score each tableware item: +1 per matching tag
  const scored = TABLEWARE.map(item => ({
    ...item,
    score: item.tags.filter(t => selectedColorIds.includes(t)).length,
  }));
  // Sort by score desc, take top 4 (2 plates + 2 cups preferred)
  const plates = scored.filter(i=>i.type==="plate").sort((a,b)=>b.score-a.score).slice(0,2);
  const cups   = scored.filter(i=>i.type==="cup"  ).sort((a,b)=>b.score-a.score).slice(0,2);
  return [...plates, ...cups].filter(i=>i.score>0 || selectedColorIds.length>=1);
}

// CSS plate/cup visual (used when image is null)
function TablewearVisual({ item }) {
  if (item.image) {
    return (
      <img
        src={item.image} alt={item.name}
        style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
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

function TablewearRecommendations({ selectedColors }) {
  const matches = matchTableware(selectedColors);
  if (!matches.length || !selectedColors.length) return null;

  const plates = matches.filter(i=>i.type==="plate");
  const cups   = matches.filter(i=>i.type==="cup");

  return (
    <div style={{marginTop:20,paddingTop:18,borderTop:`1.5px solid ${SOFT}`}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <div style={{fontSize:16}}>🍽️</div>
        <div>
          <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>
            Matching Tableware
          </div>
          <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.85}}>
            Coordinated with your garland colors
          </div>
        </div>
      </div>

      {/* Plates */}
      {plates.length > 0 && (
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,color:"#aaa",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Plates</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {plates.map(item=>(
              <a key={item.id} href={item.etsyUrl} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                <div style={{
                  background:WHITE,border:`1.5px solid ${BORDER}`,borderRadius:14,
                  overflow:"hidden",cursor:"pointer",transition:"all 0.15s",
                }}>
                  <div style={{height:90,position:"relative"}}>
                    <TablewearVisual item={item}/>
                    <div style={{
                      position:"absolute",top:6,right:6,background:`linear-gradient(135deg,${HOT},${PUNCH})`,
                      color:WHITE,fontSize:8,fontWeight:700,fontFamily:"'DM Sans',sans-serif",
                      padding:"2px 7px",borderRadius:10,
                    }}>Shop →</div>
                  </div>
                  <div style={{padding:"8px 10px"}}>
                    <div style={{fontSize:11,fontWeight:700,color:DARK,fontFamily:"'DM Sans',sans-serif",lineHeight:1.3}}>{item.name}</div>
                    <div style={{fontSize:10,color:"#aaa",fontFamily:"'DM Sans',sans-serif",marginTop:1}}>{item.desc}</div>
                    <div style={{fontSize:12,fontWeight:900,color:PUNCH,fontFamily:"'DM Sans',sans-serif",marginTop:3}}>{item.price}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Cups */}
      {cups.length > 0 && (
        <div style={{marginBottom:4}}>
          <div style={{fontSize:10,fontWeight:700,color:"#aaa",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Cups</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {cups.map(item=>(
              <a key={item.id} href={item.etsyUrl} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                <div style={{
                  background:WHITE,border:`1.5px solid ${BORDER}`,borderRadius:14,
                  overflow:"hidden",cursor:"pointer",transition:"all 0.15s",
                }}>
                  <div style={{height:90,position:"relative"}}>
                    <TablewearVisual item={item}/>
                    <div style={{
                      position:"absolute",top:6,right:6,background:`linear-gradient(135deg,${HOT},${PUNCH})`,
                      color:WHITE,fontSize:8,fontWeight:700,fontFamily:"'DM Sans',sans-serif",
                      padding:"2px 7px",borderRadius:10,
                    }}>Shop →</div>
                  </div>
                  <div style={{padding:"8px 10px"}}>
                    <div style={{fontSize:11,fontWeight:700,color:DARK,fontFamily:"'DM Sans',sans-serif",lineHeight:1.3}}>{item.name}</div>
                    <div style={{fontSize:10,color:"#aaa",fontFamily:"'DM Sans',sans-serif",marginTop:1}}>{item.desc}</div>
                    <div style={{fontSize:12,fontWeight:900,color:PUNCH,fontFamily:"'DM Sans',sans-serif",marginTop:3}}>{item.price}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GarlandBuilder() {
  const [mode,        setMode]        = useState("diy");      // diy | preinflated
  const [arrangement, setArrangement] = useState("mixed");    // mixed | colorblock
  const [selected,    setSelected]    = useState([]);

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
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
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
      <a href="https://bachhotlinesupplies.etsy.com" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
        <button style={{...BP,width:"100%",padding:"14px",fontSize:14}}>
          Order Custom Garland on Etsy →
        </button>
      </a>

      {/* Matching tableware — appears after colors are selected */}
      <TablewearRecommendations selectedColors={selected}/>
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
export default function DecorTab({ groupSize }) {
  const fileRef  = useRef();
  const [photo,  setPhoto]  = useState(null);
  const [pkgId,  setPkgId]  = useState(null);
  const [vibeId, setVibeId] = useState(null);

  const pkg  = PACKAGES.find(p => p.id === pkgId);
  const vibe = pkg?.vibes.find(v => v.id === vibeId);

  const handleFile = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const selectPkg = id => {
    setPkgId(id);
    setVibeId(PACKAGES.find(p => p.id === id)?.vibes[0]?.id || null);
  };

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
          <em style={{color:HOT}}>Decor Studio</em>
        </h2>
        <p style={{fontSize:12,color:HOT,fontFamily:"'DM Sans',sans-serif",margin:0,opacity:0.85,lineHeight:1.6}}>
          Upload your space · choose a package · see the look before you book
        </p>
      </div>

      {/* ── Step 1: Upload ── */}
      <div style={{marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{width:26,height:26,borderRadius:"50%",background:photo?`linear-gradient(135deg,${HOT},${PUNCH})`:`linear-gradient(135deg,${MID},${SOFT})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:photo?WHITE:HOT,flexShrink:0}}>1</div>
          <div>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>Upload Your Space</div>
            <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.8}}>Bedroom, living room, kitchen — any room works</div>
          </div>
        </div>

        {!photo ? (
          <div onClick={()=>fileRef.current?.click()} style={{
            border:`2px dashed ${BORDER}`,borderRadius:18,padding:"38px 20px",
            textAlign:"center",background:"#fdf8fb",cursor:"pointer",
          }}>
            <div style={{fontSize:46,marginBottom:10}}>📷</div>
            <div style={{fontSize:14,fontWeight:700,color:DARK,fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>Tap to upload a photo</div>
            <div style={{fontSize:12,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>Your room becomes the canvas</div>
          </div>
        ) : (
          <div style={{position:"relative",borderRadius:18,overflow:"hidden",aspectRatio:"4/3"}}>
            <img src={photo} alt="Your space" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
            <button onClick={()=>{setPhoto(null);setPkgId(null);setVibeId(null);}} style={{
              position:"absolute",top:10,right:10,background:"rgba(0,0,0,0.55)",border:"none",
              borderRadius:"50%",width:32,height:32,cursor:"pointer",color:WHITE,fontSize:16,
              display:"flex",alignItems:"center",justifyContent:"center",
            }}>×</button>
            <div style={{position:"absolute",bottom:10,left:10,background:"rgba(0,0,0,0.5)",borderRadius:8,padding:"4px 10px",fontSize:11,color:WHITE,fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>
              ✓ Photo uploaded — choose a package below
            </div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
      </div>

      {/* ── Step 2: Package ── */}
      {photo && (
        <div style={{marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:pkgId?`linear-gradient(135deg,${HOT},${PUNCH})`:`linear-gradient(135deg,${MID},${SOFT})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:pkgId?WHITE:HOT,flexShrink:0}}>2</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>Choose a Decor Package</div>
              <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.8}}>Four packages — tap to compare</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {PACKAGES.map(p=>(
              <PackageCard key={p.id} pkg={p} selected={pkgId===p.id} onClick={()=>selectPkg(p.id)}/>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 3: Vibe ── */}
      {photo && pkg && (
        <div style={{marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:vibeId?`linear-gradient(135deg,${HOT},${PUNCH})`:`linear-gradient(135deg,${MID},${SOFT})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:vibeId?WHITE:HOT,flexShrink:0}}>3</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>Pick Your Color Vibe</div>
              <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.8}}>{pkg.name} palette options</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {pkg.vibes.map(v=>(
              <button key={v.id} onClick={()=>setVibeId(v.id)} style={{
                padding:"9px 16px",borderRadius:50,cursor:"pointer",
                border:vibeId===v.id?`2px solid ${pkg.border}`:`1.5px solid ${BORDER}`,
                background:vibeId===v.id?pkg.bg:WHITE,
                fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,
                color:vibeId===v.id?pkg.headlineColor:DARK,
                transition:"all 0.15s",display:"flex",alignItems:"center",gap:6,
              }}>
                <span style={{display:"flex",gap:2}}>
                  {v.colors.slice(0,3).map((c,i)=>(
                    <span key={i} style={{width:10,height:10,borderRadius:"50%",background:c,border:"1px solid rgba(0,0,0,0.12)",display:"inline-block"}}/>
                  ))}
                </span>
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 4: Preview ── */}
      {photo && pkg && vibe && (
        <div style={{marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:`linear-gradient(135deg,${HOT},${PUNCH})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:WHITE,flexShrink:0}}>4</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>Your Room, Transformed</div>
              <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.8}}>{pkg.name} · {vibe.label}</div>
            </div>
          </div>

          {/* Canvas */}
          <div style={{position:"relative",borderRadius:18,overflow:"hidden",aspectRatio:"4/3",boxShadow:"0 8px 32px rgba(0,0,0,0.18)",marginBottom:14}}>
            <img src={photo} alt="Your space" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
            <div style={{position:"absolute",inset:0}}>
              <DecorationOverlay pkg={pkg} vibe={vibe}/>
            </div>
            <div style={{
              position:"absolute",top:12,left:12,
              background:`linear-gradient(135deg,${HOT},${PUNCH})`,
              color:WHITE,fontSize:10,fontWeight:700,fontFamily:"'DM Sans',sans-serif",
              padding:"4px 12px",borderRadius:20,boxShadow:"0 2px 8px rgba(0,0,0,0.25)",
            }}>
              {pkg.emoji} {pkg.name} · {vibe.label}
            </div>
          </div>

          {/* What's included */}
          <div style={{padding:"16px",borderRadius:16,background:pkg.bg,border:`1.5px solid ${pkg.border}33`,marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:700,color:pkg.headlineColor,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>
              {pkg.emoji} What's Included
            </div>
            {pkg.includes.map((item,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:7,fontFamily:"'DM Sans',sans-serif",fontSize:12,color:DARK}}>
                <span style={{color:pkg.headlineColor,fontWeight:700,flexShrink:0}}>✦</span>
                <span>{item}</span>
              </div>
            ))}
            <div style={{marginTop:14,padding:"10px 14px",borderRadius:12,background:"rgba(255,255,255,0.75)",border:`1px solid ${pkg.border}33`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:10,color:"#aaa",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:0.8}}>Package Price</div>
                <div style={{fontSize:22,fontWeight:900,color:pkg.headlineColor,fontFamily:"'DM Sans',sans-serif"}}>{pkg.price}</div>
              </div>
              <div style={{fontSize:11,color:"#bbb",fontFamily:"'DM Sans',sans-serif",textAlign:"right"}}>
                Setup for<br/><span style={{fontWeight:700,color:DARK}}>{groupSize} ladies</span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <a href="https://bachhotlinesupplies.etsy.com" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
              <button style={{...BP,width:"100%",padding:"14px",fontSize:14}}>
                Shop This Package on Etsy →
              </button>
            </a>
            <button style={{...BS,width:"100%",padding:"12px",fontSize:13}}>
              💌 Request a Custom Setup Quote
            </button>
          </div>

          <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>
            Tap a different package above to compare looks
          </div>
        </div>
      )}

      {/* ── Custom Balloon Garland Builder ── */}
      <GarlandBuilder />
    </div>
  );
}
