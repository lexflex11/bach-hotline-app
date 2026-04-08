import React, { useState, useRef } from 'react';
import { WHITE, SOFT, MID, HOT, PUNCH, DARK, BORDER, GREEN } from '../../constants/colors.js';
import { C, BP, BG } from '../../constants/styles.js';
import { AESTHETICS, PRODUCTS } from '../../constants/data.js';
import { ANTHROPIC_API_KEY } from '../../constants/api.js';
import SH from '../ui/SH.jsx';

export default function MoodTab({ setTab }) {
  const [selected, setSelected]   = useState(null);
  const [photo,    setPhoto]      = useState(null);
  const [loading,  setLoading]    = useState(false);
  const [result,   setResult]     = useState(null);
  const fileRef = useRef();

  const aesthetic = AESTHETICS.find(a => a.id === selected);

  const handleFile = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setPhoto(ev.target.result); setResult(null); };
    reader.readAsDataURL(file);
  };

  const goBack = () => { setSelected(null); setPhoto(null); setResult(null); };

  const runAI = async () => {
    if (!photo || !aesthetic) return;
    setLoading(true); setResult(null);
    try {
      const b64  = photo.split(",")[1];
      const mime = photo.split(";")[0].split(":")[1];
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: [
            { type: "image", source: { type: "base64", media_type: mime, data: b64 } },
            { type: "text", text: `You are a bachelorette décor designer. Analyze this space for a "${aesthetic.name}" theme using these colors: ${aesthetic.colors.join(", ")}. Give specific placement advice based on what you see in the photo. JSON only (no fences): {"headline":"punchy headline for this theme","vision":"2-3 sentences describing the transformation","keyPieces":["5 specific décor items with exact placement in the space"],"lighting":"one specific lighting tip","photoMoment":"best backdrop spot in this space","shoppingList":["3 items to buy"]}` }
          ]}]
        })
      });
      const data = await res.json();
      setResult(JSON.parse(data.content.map(i => i.text || "").join("").replace(/```json|```/g, "").trim()));
    } catch (err) {
      console.error(err);
      setResult({ headline:"Oops — try again 😅", vision:"Something went wrong. Make sure your API key is set up in Vercel.", keyPieces:[], shoppingList:[] });
    }
    setLoading(false);
  };

  // ── THEME GRID (home screen) ──────────────────────────────────────────────
  if (!selected) return (
    <div>
      <SH title="Vibes & Décor" sub="Pick your aesthetic — outfits, décor, AI space visualizer" />
      <div style={{fontSize:13,color:HOT,fontFamily:"'DM Sans',sans-serif",marginBottom:14,opacity:0.8}}>
        Choose a theme and we'll give you the full guide — outfits, décor ideas, photo inspo, hashtags, and AI visualization of your actual space. ✨
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {AESTHETICS.map(a => (
          <button key={a.id} onClick={() => setSelected(a.id)}
            style={{background:WHITE,border:`1.5px solid ${BORDER}`,borderRadius:18,padding:"16px 14px",cursor:"pointer",textAlign:"left",transition:"all 0.2s",boxShadow:`0 2px 10px rgba(230,101,130,0.07)`}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 20px rgba(230,101,130,0.18)`;e.currentTarget.style.transform="translateY(-2px)"}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow=`0 2px 10px rgba(230,101,130,0.07)`;e.currentTarget.style.transform="translateY(0)"}}>
            <div style={{fontSize:28,marginBottom:8}}>{a.emoji}</div>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>{a.name}</div>
            <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",lineHeight:1.4,opacity:0.8}}>{a.vibe}</div>
            <div style={{display:"flex",gap:4,marginTop:10}}>
              {a.colors.map((c,i) => <div key={i} style={{width:16,height:16,borderRadius:"50%",background:c,border:"1.5px solid rgba(255,255,255,0.8)",boxShadow:"0 1px 3px rgba(0,0,0,0.15)"}} />)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // ── THEME DETAIL + AI VISUALIZER ─────────────────────────────────────────
  return (
    <div>
      <button onClick={goBack} style={{...BG,marginBottom:16,fontSize:12,padding:"7px 14px"}}>← All Themes</button>

      {/* Hero */}
      <div style={{borderRadius:18,padding:"20px 16px",background:SOFT,border:`1.5px solid ${MID}`,marginBottom:14,textAlign:"center"}}>
        <div style={{fontSize:36,marginBottom:8}}>{aesthetic.emoji}</div>
        <div style={{fontSize:20,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{aesthetic.name}</div>
        <div style={{fontSize:13,color:HOT,fontFamily:"'DM Sans',sans-serif",marginTop:6,lineHeight:1.5,fontStyle:"italic"}}>"{aesthetic.vibe}"</div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:14,flexWrap:"wrap"}}>
          {aesthetic.colors.map((c,i) => (
            <div key={i} style={{textAlign:"center"}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:c,margin:"0 auto 4px",border:"2px solid white",boxShadow:"0 2px 8px rgba(0,0,0,0.15)"}} />
              <div style={{fontSize:9,color:DARK,fontFamily:"'DM Sans',sans-serif",opacity:0.7}}>{aesthetic.palette[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Outfits */}
      <div style={{...C,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>What to Wear</div>
        {aesthetic.outfits.map((item,i) => (
          <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"center"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:aesthetic.colors[0],flexShrink:0}} />
            <div style={{fontSize:13,fontFamily:"'DM Sans',sans-serif",color:DARK}}>{item}</div>
          </div>
        ))}
      </div>

      {/* Décor */}
      <div style={{...C,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>Décor Ideas</div>
        {aesthetic.decor.map((item,i) => (
          <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"center"}}>
            <span style={{color:HOT,fontSize:12}}>✦</span>
            <div style={{fontSize:13,fontFamily:"'DM Sans',sans-serif",color:DARK}}>{item}</div>
          </div>
        ))}
      </div>

      {/* Photo shots */}
      <div style={{...C,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>Photo Moments</div>
        {aesthetic.shots.map((item,i) => (
          <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"center"}}>
            <span style={{fontSize:14}}>📷</span>
            <div style={{fontSize:13,fontFamily:"'DM Sans',sans-serif",color:DARK}}>{item}</div>
          </div>
        ))}
      </div>

      {/* Hashtags */}
      <div style={{...C,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>Hashtag Pack</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {aesthetic.hashtags.map((tag,i) => (
            <span key={i} style={{fontSize:11,padding:"4px 11px",borderRadius:50,background:SOFT,border:`1.5px solid ${MID}`,color:HOT,fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>{tag}</span>
          ))}
        </div>
      </div>

      {/* ── AI DÉCOR VISUALIZER ───────────────────────────────────────────── */}
      <div style={{...C, marginBottom:12, border:`2px solid ${HOT}`, background:SOFT}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>
          ✨ AI Décor Visualizer
        </div>
        <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginBottom:14,opacity:0.85}}>
          Upload a photo of your party space and AI will show you exactly how to style it in the <strong>{aesthetic.name}</strong> theme.
        </div>

        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}} />

        {!photo ? (
          <button onClick={() => fileRef.current?.click()} style={{...BP,width:"100%",padding:"13px",borderRadius:14}}>
            📷 Upload Your Space Photo
          </button>
        ) : (
          <div>
            <img src={photo} alt="Your space" style={{width:"100%",borderRadius:12,maxHeight:180,objectFit:"cover",border:`1.5px solid ${MID}`,marginBottom:8}} />
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"'DM Sans',sans-serif",fontSize:13,marginBottom:12}}>
              <span style={{color:GREEN,fontWeight:700}}>✅ Photo ready!</span>
              <button onClick={() => { setPhoto(null); setResult(null); }} style={{...BG,fontSize:12,padding:"4px 12px"}}>Change</button>
            </div>
            <button onClick={runAI} disabled={loading} style={{...BP,width:"100%",padding:"13px",fontSize:14,borderRadius:14,opacity:loading?0.6:1}}>
              {loading ? "✨ Transforming your space..." : `Transform in ${aesthetic.name} Style`}
            </button>
          </div>
        )}

        {loading && (
          <div style={{textAlign:"center",padding:"24px 0",color:HOT,fontFamily:"'DM Sans',sans-serif",fontSize:13}}>
            ✨ Analyzing your space and applying the {aesthetic.name} theme...
          </div>
        )}

        {result && (
          <div style={{marginTop:14}}>
            <div style={{fontSize:17,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:8}}>{result.headline}</div>
            <p style={{fontSize:13,lineHeight:1.6,color:DARK,fontFamily:"'DM Sans',sans-serif",marginBottom:12,opacity:0.85}}>{result.vision}</p>

            {result.keyPieces?.length > 0 && (
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:HOT,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Key Décor Pieces</div>
                {result.keyPieces.map((p,i) => (
                  <div key={i} style={{display:"flex",gap:8,marginBottom:6,fontFamily:"'DM Sans',sans-serif",fontSize:12}}>
                    <span style={{color:HOT}}>✦</span>
                    <span style={{color:DARK,opacity:0.85}}>{p}</span>
                  </div>
                ))}
              </div>
            )}

            {result.lighting && (
              <div style={{padding:"10px 12px",borderRadius:10,background:WHITE,border:`1px solid ${BORDER}`,marginBottom:10}}>
                <span style={{fontSize:11,fontWeight:700,color:HOT,fontFamily:"'DM Sans',sans-serif"}}>💡 Lighting: </span>
                <span style={{fontSize:12,color:DARK,fontFamily:"'DM Sans',sans-serif"}}>{result.lighting}</span>
              </div>
            )}

            {result.photoMoment && (
              <div style={{padding:"10px 12px",borderRadius:10,background:WHITE,border:`1px solid ${BORDER}`,marginBottom:12}}>
                <span style={{fontSize:11,fontWeight:700,color:HOT,fontFamily:"'DM Sans',sans-serif"}}>📸 Photo Moment: </span>
                <span style={{fontSize:12,color:DARK,fontFamily:"'DM Sans',sans-serif"}}>{result.photoMoment}</span>
              </div>
            )}

            {result.shoppingList?.length > 0 && (
              <div style={{background:WHITE,border:`1.5px solid ${BORDER}`,borderRadius:12,padding:"11px 13px",marginBottom:12}}>
                <div style={{fontSize:10,color:HOT,fontFamily:"'DM Sans',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>🛍️ Shopping List</div>
                {result.shoppingList.map((item,i) => (
                  <div key={i} style={{fontSize:12,fontFamily:"'DM Sans',sans-serif",color:DARK,opacity:0.8,marginBottom:4}}>• {item}</div>
                ))}
              </div>
            )}

            <button onClick={() => setTab("shop")} style={{...BP,width:"100%",fontSize:12,padding:"11px"}}>
              🛍️ Shop These Items on Etsy
            </button>
          </div>
        )}
      </div>

      {/* Shop this look */}
      <div style={{...C,background:SOFT,border:`1.5px solid ${MID}`}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:12}}>Shop This Look</div>
        <div style={{display:"flex",gap:8}}>
          {aesthetic.shopItems.slice(0,3).map(id => {
            const p = PRODUCTS.find(pr => pr.id === id);
            if (!p) return null;
            return (
              <a key={id} href={p.url} target="_blank" rel="noreferrer" style={{flex:1,textDecoration:"none"}}>
                <div style={{background:WHITE,border:`1.5px solid ${BORDER}`,borderRadius:12,overflow:"hidden",textAlign:"center"}}>
                  <img src={p.image} alt={p.name} style={{width:"100%",aspectRatio:"1/1",objectFit:"cover",display:"block"}} />
                  <div style={{padding:"6px 8px"}}>
                    <div style={{fontSize:10,fontFamily:"'DM Sans',sans-serif",color:DARK,fontWeight:600,lineHeight:1.3}}>{p.name}</div>
                    <div style={{fontSize:11,color:PUNCH,fontFamily:"'DM Sans',sans-serif",fontWeight:700,marginTop:2}}>${p.price.toFixed(2)}</div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
        <a href="https://bachhotlinesupplies.etsy.com" target="_blank" rel="noreferrer"
          style={{...BP,display:"block",textAlign:"center",textDecoration:"none",marginTop:12,fontSize:12,padding:"10px"}}>
          Shop All 534 Items on Etsy 🛍️
        </a>
      </div>
    </div>
  );
}
