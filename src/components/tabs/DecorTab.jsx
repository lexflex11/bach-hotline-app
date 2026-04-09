import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C, BP } from '../../constants/styles.js';

// ─── Venue Scenes ─────────────────────────────────────────────────────────────
const VENUES = [
  { id:"backyard",  label:"Backyard",    emoji:"🌿", desc:"Patio · Garden · Outdoor",
    sky:"linear-gradient(180deg,#B8D8F0 0%,#E8C9A0 80%,#7DB87D 100%)",
    floor:"#7DB87D", floorH:18 },
  { id:"rooftop",   label:"Rooftop",     emoji:"🌆", desc:"Skyline · Sunset · Open air",
    sky:"linear-gradient(180deg,#2D1535 0%,#7B3070 40%,#E66582 70%,#F5C5A0 100%)",
    floor:"#4A3A5A", floorH:12 },
  { id:"hotel",     label:"Hotel Suite", emoji:"🛎️", desc:"Ballroom · Chic interior",
    sky:"linear-gradient(180deg,#F5EEE8 0%,#EDE0D4 100%)",
    floor:"#C8A882", floorH:20 },
  { id:"beach",     label:"Beach",       emoji:"🌊", desc:"Sand · Ocean · Sunset",
    sky:"linear-gradient(180deg,#5BBFEA 0%,#F7D68A 70%,#E8C47A 100%)",
    floor:"#F2D799", floorH:22 },
];

// ─── Color Palettes ───────────────────────────────────────────────────────────
const PALETTES = [
  { id:"hotpink",   label:"Hot Pink",     primary:"#E91E8C", secondary:"#FFFFFF", accent:"#FF69B4", dark:"#9B1060" },
  { id:"dustyrose", label:"Dusty Rose",   primary:"#C9A0A0", secondary:"#FAF0E6", accent:"#E8B4B8", dark:"#8B6060" },
  { id:"sage",      label:"Sage & Gold",  primary:"#8B9E78", secondary:"#F5F0E8", accent:"#D4AF37", dark:"#4A5E38" },
  { id:"lavender",  label:"Lavender",     primary:"#9B8EC4", secondary:"#F8F5FF", accent:"#C9B8E8", dark:"#6B4E9B" },
  { id:"blackgold", label:"Black & Gold", primary:"#2D2D2D", secondary:"#F5F0DC", accent:"#D4AF37", dark:"#1A1A1A" },
  { id:"teal",      label:"Teal & Blush", primary:"#4DADA8", secondary:"#FFF0F5", accent:"#E8A0B0", dark:"#2D7A75" },
];

// ─── Decoration Styles ────────────────────────────────────────────────────────
const STYLES = [
  { id:"balloonarch",  label:"Balloon Arch",   emoji:"🎈", desc:"Classic balloon arch + bouquets" },
  { id:"boho",         label:"Boho Garden",    emoji:"🌸", desc:"Florals, pampas, macramé" },
  { id:"glam",         label:"Glam Disco",     emoji:"✨", desc:"Disco balls, metallics, feathers" },
  { id:"minimal",      label:"Minimalist",     emoji:"🤍", desc:"Clean, modern, elegant" },
  { id:"tropical",     label:"Tropical",       emoji:"🌺", desc:"Palms, bright colors, leis" },
  { id:"neon",         label:"Neon Party",     emoji:"💜", desc:"Neon signs, dark vibe, LED" },
];

// ─── Shop items per style ─────────────────────────────────────────────────────
// Links to Bach Hotline's own shop products
const BH = url => url; // Bach Hotline Etsy store
const SHOP_ITEMS = {
  balloonarch: [
    { name:"Garden Foil Balloon 40\"",     where:"Bach Hotline", icon:"🎈", url:"https://www.etsy.com/listing/1861810967" },
    { name:"Zebra Foil Balloon 40\"",      where:"Bach Hotline", icon:"🎈", url:"https://www.etsy.com/listing/1840533580" },
    { name:"Bach Weekend Survival Kit",    where:"Bach Hotline", icon:"🎀", url:"https://www.etsy.com/listing/4464005263" },
    { name:"In My Bride Era Bach Kit",     where:"Bach Hotline", icon:"💍", url:"https://www.etsy.com/listing/4463704232" },
    { name:"Let's Go Girls Bach Kit",      where:"Bach Hotline", icon:"✨", url:"https://www.etsy.com/listing/4464002387" },
  ],
  boho: [
    { name:"Custom Face Beach Towel",      where:"Bach Hotline", icon:"🌸", url:"https://www.etsy.com/listing/4479721592" },
    { name:"Floral Groovy Beach Towel",    where:"Bach Hotline", icon:"🌺", url:"https://www.etsy.com/listing/4462571690" },
    { name:"Bach Weekend Survival Kit",    where:"Bach Hotline", icon:"🎀", url:"https://www.etsy.com/listing/4464005263" },
    { name:"Corpus Christi Itinerary PDF", where:"Bach Hotline", icon:"📋", url:"https://www.etsy.com/listing/1845781336" },
    { name:"Custom Puzzle — Bach Favor",   where:"Bach Hotline", icon:"🧩", url:"https://www.etsy.com/listing/4480916715" },
  ],
  glam: [
    { name:"Disco Ball Headband",          where:"Bach Hotline", icon:"🪩", url:"https://www.etsy.com/listing/1861486865" },
    { name:"Custom Face Bikini",           where:"Bach Hotline", icon:"👙", url:"https://www.etsy.com/listing/4476018031" },
    { name:"Cowgirl Espresso Cup",         where:"Bach Hotline", icon:"☕", url:"https://www.etsy.com/listing/4472132477" },
    { name:"Custom Poker Playing Cards",   where:"Bach Hotline", icon:"🃏", url:"https://www.etsy.com/listing/4480941333" },
    { name:"In My Bride Era Bach Kit",     where:"Bach Hotline", icon:"💅", url:"https://www.etsy.com/listing/4463704232" },
  ],
  minimal: [
    { name:"Custom Puzzle — Bach Favor",   where:"Bach Hotline", icon:"🧩", url:"https://www.etsy.com/listing/4480916715" },
    { name:"Custom Poker Playing Cards",   where:"Bach Hotline", icon:"🃏", url:"https://www.etsy.com/listing/4480941333" },
    { name:"Corpus Christi Itinerary PDF", where:"Bach Hotline", icon:"📋", url:"https://www.etsy.com/listing/1845781336" },
    { name:"Custom Face Beach Towel",      where:"Bach Hotline", icon:"🤍", url:"https://www.etsy.com/listing/4479721592" },
    { name:"Bach Weekend Survival Kit",    where:"Bach Hotline", icon:"🎀", url:"https://www.etsy.com/listing/4464005263" },
  ],
  tropical: [
    { name:"Cocktail Club Beach Towel",    where:"Bach Hotline", icon:"🌊", url:"https://www.etsy.com/listing/4463167702" },
    { name:"Custom Face Beach Towel",      where:"Bach Hotline", icon:"🌴", url:"https://www.etsy.com/listing/4479721592" },
    { name:"Sardinas Beach Towel",         where:"Bach Hotline", icon:"🐠", url:"https://www.etsy.com/listing/4463176097" },
    { name:"Cowgirl Espresso Cup",         where:"Bach Hotline", icon:"🍹", url:"https://www.etsy.com/listing/4472132477" },
    { name:"Let's Go Girls Bach Kit",      where:"Bach Hotline", icon:"🦩", url:"https://www.etsy.com/listing/4464002387" },
  ],
  neon: [
    { name:"Disco Ball Headband",          where:"Bach Hotline", icon:"🪩", url:"https://www.etsy.com/listing/1861486865" },
    { name:"In My Bride Era Bach Kit",     where:"Bach Hotline", icon:"💜", url:"https://www.etsy.com/listing/4463704232" },
    { name:"Custom Poker Playing Cards",   where:"Bach Hotline", icon:"🃏", url:"https://www.etsy.com/listing/4480941333" },
    { name:"Custom Face Bikini",           where:"Bach Hotline", icon:"💡", url:"https://www.etsy.com/listing/4476018031" },
    { name:"Bach Weekend Survival Kit",    where:"Bach Hotline", icon:"✨", url:"https://www.etsy.com/listing/4464005263" },
  ],
};

// ─── Scene Renderer ───────────────────────────────────────────────────────────
function SceneCanvas({ venue, palette, style }) {
  const pal = palette || PALETTES[0];
  const P = pal.primary;
  const A = pal.accent;
  const S = pal.secondary;

  const balloons = (count, x, bottom, size=28) =>
    Array.from({length:count}).map((_,i)=>(
      <div key={i} style={{
        position:"absolute", bottom, left:`${x + i*(size+4)}px`,
        width:size, height:size*1.2, borderRadius:"50% 50% 50% 50% / 55% 55% 45% 45%",
        background:i%3===0?P:i%3===1?A:S, border:`1.5px solid rgba(0,0,0,0.08)`,
        boxShadow:`inset -4px -4px 8px rgba(0,0,0,0.12)`,
      }}/>
    ));

  return (
    <div style={{
      position:"relative", width:"100%", paddingTop:"58%",
      borderRadius:18, overflow:"hidden",
      background:venue?.sky || VENUES[0].sky,
      border:`2px solid ${MID}`,
      boxShadow:"0 8px 32px rgba(45,10,24,0.15)",
    }}>
      <div style={{position:"absolute",inset:0}}>

        {/* ── Floor ── */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          height:`${venue?.floorH||18}%`,
          background:venue?.floor||"#7DB87D",
          borderTop:"2px solid rgba(0,0,0,0.1)",
        }}/>

        {/* ── Style-specific decorations ── */}

        {(!style || style.id==="balloonarch") && (
          <>
            {/* Left balloon cluster */}
            {balloons(4, 8, "62%", 30)}
            {balloons(3, 14, "72%", 26)}
            {balloons(2, 22, "80%", 22)}
            {/* Right balloon cluster */}
            {balloons(4, null, "62%", 30) /* handled below via mirroring */}

            {/* Arch top center */}
            <div style={{position:"absolute",top:"8%",left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>
              {[P,A,S,P,A,S,P].map((c,i)=>(
                <div key={i} style={{
                  width:22,height:26,borderRadius:"50% 50% 50% 50% / 55% 55% 45% 45%",
                  background:c,boxShadow:`inset -3px -3px 6px rgba(0,0,0,0.12)`,
                }}/>
              ))}
            </div>
            {/* Right cluster */}
            <div style={{position:"absolute",right:8,bottom:"62%",display:"flex",gap:4,flexDirection:"column"}}>
              {[P,A,S,P].map((c,i)=>(
                <div key={i} style={{width:28+i*3,height:34+i*3,borderRadius:"50% 50% 50% 50% / 55% 55% 45% 45%",background:c,boxShadow:`inset -3px -3px 6px rgba(0,0,0,0.12)`}}/>
              ))}
            </div>
            {/* Left cluster */}
            <div style={{position:"absolute",left:8,bottom:"62%",display:"flex",gap:4,flexDirection:"column"}}>
              {[S,P,A,P].map((c,i)=>(
                <div key={i} style={{width:28+i*3,height:34+i*3,borderRadius:"50% 50% 50% 50% / 55% 55% 45% 45%",background:c,boxShadow:`inset -3px -3px 6px rgba(0,0,0,0.12)`}}/>
              ))}
            </div>
            {/* BRIDE banner */}
            <div style={{position:"absolute",top:"32%",left:"50%",transform:"translateX(-50%)",background:S,border:`2px solid ${P}`,borderRadius:8,padding:"4px 16px",fontSize:14,fontWeight:900,fontFamily:"'Playfair Display',Georgia,serif",color:P,letterSpacing:3,whiteSpace:"nowrap",boxShadow:`0 4px 12px rgba(0,0,0,0.15)`}}>
              ✨ BRIDE ✨
            </div>
          </>
        )}

        {style?.id==="boho" && (
          <>
            {/* Pampas arch */}
            <div style={{position:"absolute",top:"5%",left:"50%",transform:"translateX(-50%)",display:"flex",gap:8,alignItems:"flex-end"}}>
              {["🌾","🌸","🌿","🌷","🌿","🌸","🌾"].map((e,i)=>(
                <div key={i} style={{fontSize:i===3?28:22,transform:`rotate(${(i-3)*8}deg)`}}>{e}</div>
              ))}
            </div>
            {/* Macramé backdrop suggestion */}
            <div style={{position:"absolute",top:"18%",left:"50%",transform:"translateX(-50%)",display:"flex",gap:3}}>
              {Array.from({length:9}).map((_,i)=>(
                <div key={i} style={{width:3,height:80+Math.sin(i)*20,background:A,borderRadius:2,opacity:0.7}}/>
              ))}
            </div>
            {/* Floral table runner suggestion */}
            <div style={{position:"absolute",bottom:`${(venue?.floorH||18)+2}%`,left:"20%",right:"20%",height:12,background:`linear-gradient(90deg,${P},${A},${P})`,borderRadius:6,opacity:0.6}}/>
            {/* Bride sign */}
            <div style={{position:"absolute",top:"40%",left:"50%",transform:"translateX(-50%)",background:S,border:`1.5px solid ${A}`,borderRadius:10,padding:"5px 18px",fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:pal.dark,letterSpacing:2}}>
              🌸 she said yes 🌸
            </div>
          </>
        )}

        {style?.id==="glam" && (
          <>
            {/* Disco ball */}
            <div style={{position:"absolute",top:"6%",left:"50%",transform:"translateX(-50%)",width:52,height:52,borderRadius:"50%",background:`radial-gradient(circle at 35% 35%, #fff 0%, ${A} 30%, ${P} 70%, ${pal.dark} 100%)`,boxShadow:`0 0 20px ${A}88, 0 0 40px ${P}44`,border:`2px solid ${A}`}}/>
            {/* String from top */}
            <div style={{position:"absolute",top:0,left:"50%",width:2,height:"10%",background:A,transform:"translateX(-50%)"}}/>
            {/* Sparkle rays */}
            {[30,60,120,150,200,230,280,310].map((deg,i)=>(
              <div key={i} style={{position:"absolute",top:"8%",left:"50%",width:40+i*5,height:2,background:`linear-gradient(90deg,${A},transparent)`,transform:`translateX(-50%) rotate(${deg}deg)`,transformOrigin:"left center",opacity:0.6}}/>
            ))}
            {/* Feather boas left/right */}
            <div style={{position:"absolute",left:0,top:"20%",bottom:`${venue?.floorH||18}%`,width:18,background:`repeating-linear-gradient(90deg,${P},${A} 6px,${P} 12px)`,borderRadius:"0 8px 8px 0",opacity:0.75}}/>
            <div style={{position:"absolute",right:0,top:"20%",bottom:`${venue?.floorH||18}%`,width:18,background:`repeating-linear-gradient(90deg,${A},${P} 6px,${A} 12px)`,borderRadius:"8px 0 0 8px",opacity:0.75}}/>
            {/* Neon sign */}
            <div style={{position:"absolute",top:"42%",left:"50%",transform:"translateX(-50%)",background:"#1A1A2E",border:`2px solid ${P}`,borderRadius:10,padding:"5px 20px",fontSize:13,fontWeight:900,fontFamily:"'DM Sans',sans-serif",color:P,letterSpacing:2,textShadow:`0 0 10px ${P}, 0 0 20px ${A}`,whiteSpace:"nowrap"}}>
              ✦ BRIDE ✦
            </div>
            {/* Champagne bubbles */}
            {[15,28,42,56,70,80].map((x,i)=>(
              <div key={i} style={{position:"absolute",bottom:`${(venue?.floorH||18)+2+i*4}%`,left:`${x}%`,width:6,height:6,borderRadius:"50%",background:A,opacity:0.5}}/>
            ))}
          </>
        )}

        {style?.id==="minimal" && (
          <>
            {/* Single elegant clear balloon cluster */}
            <div style={{position:"absolute",top:"10%",left:"50%",transform:"translateX(-50%)",display:"flex",gap:8,alignItems:"flex-end"}}>
              {[36,44,40,48,36].map((h,i)=>(
                <div key={i} style={{width:h*0.85,height:h,borderRadius:"50%",background:`rgba(255,255,255,0.35)`,border:`1.5px solid ${P}`,backdropFilter:"blur(2px)"}}/>
              ))}
            </div>
            {/* Thin ribbon */}
            <div style={{position:"absolute",top:"25%",left:"25%",right:"25%",height:1,background:A,opacity:0.6}}/>
            {/* Elegant sign */}
            <div style={{position:"absolute",top:"36%",left:"50%",transform:"translateX(-50%)",background:"rgba(255,255,255,0.85)",border:`1px solid ${P}`,borderRadius:6,padding:"6px 22px",fontSize:12,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:pal.dark,letterSpacing:4,whiteSpace:"nowrap"}}>
              bride
            </div>
            {/* Thin table line */}
            <div style={{position:"absolute",bottom:`${(venue?.floorH||18)+1}%`,left:"15%",right:"15%",height:6,background:S,border:`1px solid ${BORDER}`,borderRadius:3}}/>
            {/* Small flower accents */}
            <div style={{position:"absolute",bottom:`${(venue?.floorH||18)+5}%`,left:"22%",fontSize:20}}>🌷</div>
            <div style={{position:"absolute",bottom:`${(venue?.floorH||18)+5}%`,right:"22%",fontSize:20}}>🌷</div>
          </>
        )}

        {style?.id==="tropical" && (
          <>
            {/* Palm leaves left */}
            <div style={{position:"absolute",left:-10,top:"10%",fontSize:60,transform:"rotate(-20deg)",opacity:0.9}}>🌴</div>
            <div style={{position:"absolute",right:-10,top:"10%",fontSize:60,transform:"rotate(20deg) scaleX(-1)",opacity:0.9}}>🌴</div>
            {/* Flower garland */}
            <div style={{position:"absolute",top:"28%",left:"10%",right:"10%",display:"flex",justifyContent:"space-around"}}>
              {["🌺","🌸","🌼","🌺","🌸","🌼","🌺"].map((e,i)=>(
                <span key={i} style={{fontSize:18,transform:`rotate(${(i-3)*5}deg) translateY(${Math.abs(i-3)*4}px)`}}>{e}</span>
              ))}
            </div>
            {/* Flamingos */}
            <div style={{position:"absolute",bottom:`${(venue?.floorH||18)+2}%`,left:"15%",fontSize:36}}>🦩</div>
            <div style={{position:"absolute",bottom:`${(venue?.floorH||18)+2}%`,right:"15%",fontSize:36,transform:"scaleX(-1)"}}>🦩</div>
            {/* Sign */}
            <div style={{position:"absolute",top:"44%",left:"50%",transform:"translateX(-50%)",background:"rgba(255,255,255,0.9)",border:`2px solid ${P}`,borderRadius:12,padding:"5px 16px",fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:pal.dark,letterSpacing:2,whiteSpace:"nowrap"}}>
              🌺 BRIDE VIBES 🌺
            </div>
          </>
        )}

        {style?.id==="neon" && (
          <>
            {/* Dark overlay for neon effect */}
            <div style={{position:"absolute",inset:0,background:"rgba(10,5,20,0.55)"}}/>
            {/* Neon sign */}
            <div style={{position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",border:`2px solid ${P}`,borderRadius:10,padding:"8px 24px",fontSize:16,fontWeight:900,fontFamily:"'DM Sans',sans-serif",color:P,textShadow:`0 0 8px ${P}, 0 0 20px ${A}, 0 0 40px ${P}`,letterSpacing:3,whiteSpace:"nowrap",boxShadow:`0 0 15px ${P}44, inset 0 0 15px ${P}22`}}>
              BACHELORETTE
            </div>
            <div style={{position:"absolute",top:"38%",left:"50%",transform:"translateX(-50%)",border:`1.5px solid ${A}`,borderRadius:8,padding:"5px 18px",fontSize:13,fontWeight:700,fontFamily:"'DM Sans',sans-serif",color:A,textShadow:`0 0 8px ${A}`,letterSpacing:4,whiteSpace:"nowrap"}}>
              ✦ BRIDE ✦
            </div>
            {/* LED strips */}
            <div style={{position:"absolute",bottom:`${(venue?.floorH||18)+1}%`,left:0,right:0,height:4,background:`linear-gradient(90deg,${P},${A},${P},${A},${P})`,boxShadow:`0 0 12px ${A}`}}/>
            {/* Glow orbs */}
            {[15,35,55,75,85].map((x,i)=>(
              <div key={i} style={{position:"absolute",top:`${30+Math.sin(i)*15}%`,left:`${x}%`,width:10,height:10,borderRadius:"50%",background:i%2===0?P:A,boxShadow:`0 0 12px ${i%2===0?P:A}`,opacity:0.8}}/>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function DecorTab({ groupSize }) {
  const [venue,   setVenue]   = useState(VENUES[0]);
  const [palette, setPalette] = useState(PALETTES[0]);
  const [style,   setStyle]   = useState(STYLES[0]);

  const shopItems = SHOP_ITEMS[style.id] || [];

  return (
    <div style={{paddingBottom:24}}>

      {/* ── Hero ── */}
      <div style={{
        borderRadius:22, padding:"20px 18px",
        background:`linear-gradient(135deg,${SOFT} 0%,${MID} 100%)`,
        border:`1.5px solid ${MID}`, marginBottom:16, textAlign:"center",
      }}>
        <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>
          Bach Hotline
        </div>
        <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:22,fontWeight:900,margin:"0 0 6px",color:DARK}}>
          <em style={{color:HOT,fontStyle:"italic"}}>Decor Studio</em>
        </h2>
        <p style={{fontSize:12,color:HOT,fontFamily:"'DM Sans',sans-serif",margin:0,opacity:0.85}}>
          Visualize your party setup before you buy a single thing
        </p>
      </div>

      {/* ── Live Preview ── */}
      <div style={{marginBottom:16}}>
        <SceneCanvas venue={venue} palette={palette} style={style} />
        <div style={{textAlign:"center",marginTop:8,fontSize:11,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>
          {venue.emoji} {venue.label} · {style.emoji} {style.label} · <span style={{color:palette.primary,fontWeight:700}}>●</span> {palette.label}
        </div>
      </div>

      {/* ── Step 1: Pick a Venue ── */}
      <div style={{...C, marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>
          1. Pick your venue
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {VENUES.map(v=>(
            <button key={v.id} onClick={()=>setVenue(v)} style={{
              background:venue.id===v.id?SOFT:WHITE,
              border:venue.id===v.id?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,
              borderRadius:12, padding:"10px", cursor:"pointer", textAlign:"left", transition:"all 0.15s",
            }}>
              <div style={{fontSize:22,marginBottom:3}}>{v.emoji}</div>
              <div style={{fontSize:12,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:venue.id===v.id?HOT:DARK}}>{v.label}</div>
              <div style={{fontSize:10,color:"#aaa",fontFamily:"'DM Sans',sans-serif",marginTop:2}}>{v.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Step 2: Pick a Style ── */}
      <div style={{...C, marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>
          2. Pick your vibe
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {STYLES.map(s=>(
            <button key={s.id} onClick={()=>setStyle(s)} style={{
              background:style.id===s.id?SOFT:WHITE,
              border:style.id===s.id?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,
              borderRadius:12, padding:"10px", cursor:"pointer", textAlign:"left", transition:"all 0.15s",
            }}>
              <div style={{fontSize:22,marginBottom:3}}>{s.emoji}</div>
              <div style={{fontSize:12,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:style.id===s.id?HOT:DARK}}>{s.label}</div>
              <div style={{fontSize:10,color:"#aaa",fontFamily:"'DM Sans',sans-serif",marginTop:2}}>{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Step 3: Pick a Palette ── */}
      <div style={{...C, marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>
          3. Choose your colors
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {PALETTES.map(p=>(
            <button key={p.id} onClick={()=>setPalette(p)} style={{
              display:"flex",alignItems:"center",gap:8,
              padding:"8px 12px", borderRadius:50,
              border:palette.id===p.id?`2px solid ${p.primary}`:`1.5px solid ${BORDER}`,
              background:palette.id===p.id?p.secondary:WHITE,
              cursor:"pointer", transition:"all 0.15s",
            }}>
              <div style={{display:"flex",gap:3}}>
                <div style={{width:14,height:14,borderRadius:"50%",background:p.primary}}/>
                <div style={{width:14,height:14,borderRadius:"50%",background:p.accent}}/>
              </div>
              <span style={{fontSize:11,fontWeight:700,fontFamily:"'DM Sans',sans-serif",color:palette.id===p.id?p.dark:DARK,whiteSpace:"nowrap"}}>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Shop This Look ── */}
      <div style={{...C, background:SOFT, border:`1.5px solid ${MID}`, marginBottom:12}}>
        <div style={{fontSize:15,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>
          🛍 Shop This Look
        </div>
        <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginBottom:14,opacity:0.85}}>
          Everything you need for {style.label.toLowerCase()} vibes
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {shopItems.map((item,i)=>(
            <a key={i} href={item.url} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
              <div style={{
                display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"10px 12px",background:WHITE,borderRadius:12,border:`1px solid ${BORDER}`,
              }}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:20}}>{item.icon}</span>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:DARK,fontFamily:"'DM Sans',sans-serif"}}>{item.name}</div>
                    <div style={{fontSize:10,color:HOT,fontFamily:"'DM Sans',sans-serif",marginTop:1,fontWeight:600}}>Bach Hotline Shop</div>
                  </div>
                </div>
                <div style={{background:`linear-gradient(135deg,${HOT},${PUNCH})`,color:WHITE,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:700,fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>
                  Shop →
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Share look ── */}
      <div style={{textAlign:"center",padding:"12px",borderRadius:14,background:WHITE,border:`1.5px solid ${BORDER}`}}>
        <div style={{fontSize:12,color:"#bbb",fontFamily:"'DM Sans',sans-serif",marginBottom:8}}>Love this vibe? Share it with your group</div>
        <button
          onClick={()=>{
            const text = `Check out our bachelorette party vibe: ${style.label} at ${venue.label} in ${palette.label} 🎉`;
            if (navigator.share) { navigator.share({ title:"Our Bach Party Vibe", text }); }
            else if (navigator.clipboard) { navigator.clipboard.writeText(text); alert("Copied to clipboard!"); }
          }}
          style={{...BP, fontSize:12, padding:"10px 24px"}}
        >
          📲 Share This Vibe
        </button>
      </div>

    </div>
  );
}
