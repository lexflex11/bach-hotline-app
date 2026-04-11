import React, { useState, useRef } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { BP, BS } from '../../constants/styles.js';

// ─── Packages ────────────────────────────────────────────────────────────────
const PACKAGES = [
  {
    id: "classic",
    name: "Classic Bride",
    tagline: "Timeless elegance",
    emoji: "🤍",
    price: "$149",
    bg: "#f9f9f9",
    border: "#C0C0C0",
    headlineColor: "#777",
    description: "White & silver balloon arrangements, BRIDE letter balloons, and soft floral accents.",
    includes: ["BRIDE foil letter balloon set", "White balloon floor clusters (20 ct)", "Silver streamer curtain", "White floral centerpiece", "Ring dish & candle set"],
    vibes: [
      { id:"silver", label:"Silver & White", colors:["#D8D8D8","#f0f0f0","#C8C8C8","#fff"]    },
      { id:"blush",  label:"Blush & Gold",   colors:["#F4A7B9","#FFD700","#fff","#FFB6C1"]     },
      { id:"ivory",  label:"Ivory & Sage",   colors:["#F5F0E8","#8FAF8F","#D4C5A9","#EFE9DF"] },
    ],
  },
  {
    id: "pink",
    name: "Pink & Wild",
    tagline: "Party mode: activated",
    emoji: "💕",
    price: "$199",
    bg: "#FFF0F6",
    border: "#E91E8C",
    headlineColor: "#E91E8C",
    description: "Balloon garland arch, hot pink table settings, BACH banner, and disco flair.",
    includes: ["Pink & fuchsia balloon garland arch", "BACH foil banner", "Pink table settings (8 ct)", "Sequin foil fringe curtain", "Disco ball + string lights"],
    vibes: [
      { id:"hotpink", label:"Hot Pink & Fuchsia", colors:["#E91E8C","#FF4081","#FF1493","#FFB6C1"] },
      { id:"cowgirl", label:"Last Rodeo",         colors:["#8B4513","#D2691E","#FF69B4","#C4956A"] },
      { id:"barbie",  label:"Barbie Dreamhouse",  colors:["#FF69B4","#FF1493","#FFB6C1","#FF4081"] },
    ],
  },
  {
    id: "boho",
    name: "Boho Luxe",
    tagline: "Elevated & effortless",
    emoji: "✨",
    price: "$279",
    bg: "#FBF7F2",
    border: "#C4956A",
    headlineColor: "#C4956A",
    description: "Pampas grass, gold balloon letters, champagne flutes, and lush floral arrangements.",
    includes: ["Pampas grass arrangements ×2", "Gold BRIDE balloon letter set", "Champagne tower setup", "Linen table runner", "Terracotta & dried floral centerpiece"],
    vibes: [
      { id:"terra",    label:"Terracotta & Gold",  colors:["#C4956A","#D4956A","#FFD700","#E8C99A"] },
      { id:"champagne",label:"Champagne & Cream",  colors:["#F5DEB3","#FAEBD7","#D4AF37","#EDE0C4"] },
      { id:"sage",     label:"Sage & Eucalyptus",  colors:["#8FAF8F","#C8D8C8","#D4AF37","#B5CCB5"] },
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

function DecorationOverlay({ pkg, vibe }) {
  if (!pkg || !vibe) return null;
  if (pkg.id === "classic") return <ClassicOverlay vibe={vibe}/>;
  if (pkg.id === "pink")    return <PinkOverlay    vibe={vibe}/>;
  if (pkg.id === "boho")    return <BohoOverlay    vibe={vibe}/>;
  return null;
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
          Upload your space · pick a package · see the vibe before you buy
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
              <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.8}}>Three complete setups — tap to compare</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
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
    </div>
  );
}
