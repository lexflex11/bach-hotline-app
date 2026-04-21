import React, { useState, useEffect } from 'react';

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 500);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 500);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
}
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { BP, BS, IN } from '../../constants/styles.js';
import { PRODUCTS, SHOP_CATS } from '../../constants/data.js';
import { TABLEWARE, PARTY_ACCESSORIES } from '../tabs/DecorTab.jsx';

// ─── Map DecorTab types → ShopTab category IDs ───────────────────────────────
const TYPE_TO_CAT = {
  plate:     "Plates",
  napkin:    "Napkins",
  cup:       "Cups",
  foil:      "Balloons",
  confetti:  "Confetti",
  banner:    "Banners & Backdrops",
  treatbag:  "Treat Bags & Boxes",
  cutlery:   "Cutlery",
  accessory: "Party Accessories",
};

// Clean image URL: strip weserv proxy → direct URL; add size hint to Squarespace CDN
function cleanImg(url) {
  if (!url) return "";
  // Strip weserv proxy and use source URL directly
  if (url.includes("images.weserv.nl")) {
    const m = url.match(/[?&]url=([^&]+)/);
    if (m) url = decodeURIComponent(m[1]);
    // Restore full https:// if protocol was stripped
    if (!url.startsWith("http")) url = "https://" + url;
  }
  // Add Squarespace size param for sharp rendering if not already specified
  if ((url.includes("squarespace-cdn.com") || url.includes("squarespace.com")) && !url.includes("format=")) {
    url = url + (url.includes("?") ? "&" : "?") + "format=500w";
  }
  return url;
}

// Combine and normalise: TABLEWARE + PARTY_ACCESSORIES → same shape as PRODUCTS
const DECOR_PRODUCTS = [...TABLEWARE, ...PARTY_ACCESSORIES].map(p => {
  // Support both single `image` and `images: []` array
  const imgs = (p.images || []).map(cleanImg).filter(Boolean);
  const main = cleanImg(p.image);
  if (main && !imgs.includes(main)) imgs.unshift(main);
  return {
  id:        p.id,
  name:      p.name,
  fullName:  p.name,
  price:     typeof p.price === "number" ? p.price : (parseFloat(String(p.price || "0").replace(/[^0-9.]/g, "")) || 0),
  category:  TYPE_TO_CAT[p.type] || "Party Accessories",
  image:     imgs[0] || "",
  images:    imgs,
  url:       p.etsyUrl || "",
  desc:      p.desc || "",
  bullets:   p.bullets || [],
  variants:  p.variants || [],
  isDigital: false,
  bestseller:false,
  };
});

// ─── Product image tile ───────────────────────────────────────────────────────
function ProductTile({ p, onView }) {
  const [loaded, setLoaded] = useState(false);
  const [err,    setErr]    = useState(false);
  return (
    <div onClick={onView} style={{ cursor:"pointer", textAlign:"center" }}>
      {/* Image box */}
      <div style={{
        position:"relative", width:"100%", aspectRatio:"1/1",
        background:WHITE,
        marginBottom:10,
      }}>
        {!err && p.image ? (
          <img
            src={p.image} alt={p.name}
            onLoad={()=>setLoaded(true)}
            onError={()=>setErr(true)}
            style={{
              width:"100%", height:"100%", objectFit:"contain",
              padding:12, boxSizing:"border-box",
              opacity:loaded?1:0, transition:"opacity 0.3s",
              display:"block",
            }}
          />
        ) : (
          <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,color:"#f4a0c0"}}>
            🎀
          </div>
        )}
      </div>
      {/* Name + Price */}
      <div style={{fontSize:13,fontWeight:400,color:"#f496c3",fontFamily:"'Acme',sans-serif",lineHeight:1.3,marginBottom:3}}>
        {p.name}
      </div>
      <div style={{fontSize:12,color:DARK,fontFamily:"'Nunito',sans-serif"}}>
        ${(+p.price || 0).toFixed(2)}
      </div>
    </div>
  );
}

// ─── Product Detail Page (inline, no fixed overlay) ──────────────────────────
function ProductDetail({ p, onBack, onAdd, inCart, recommended, onView }) {
  const [imgIdx,   setImgIdx]   = useState(0);
  const [qty,      setQty]      = useState(1);
  const [variantI, setVariantI] = useState(0);
  const [recQty,   setRecQty]   = useState({});
  const mobile = useIsMobile();

  if (!p) return null;

  const imgs  = (p.images?.length > 0) ? p.images : (p.image ? [p.image] : []);
  const total = imgs.length;
  const src   = imgs[imgIdx] || "";
  const price = +(p.price) || 0;

  /* ── Mobile image carousel (arrows inside) ── */
  const ChevronLeft  = <svg width="10" height="18" viewBox="0 0 10 18" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9,1 1,9 9,17"/></svg>;
  const ChevronRight = <svg width="10" height="18" viewBox="0 0 10 18" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1,1 9,9 1,17"/></svg>;

  const MobileCarousel = (
    <div style={{ position:"relative", aspectRatio:"1/1", background:"#fff", borderRadius:12, overflow:"hidden", marginBottom:6 }}>
      {src ? <img src={src} alt={p.name||""} style={{ width:"100%", height:"100%", objectFit:"contain", padding:10, boxSizing:"border-box", display:"block" }}/> : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40 }}>🎀</div>}
      {total > 1 && <>
        <button onClick={()=>setImgIdx(i=>(i-1+total)%total)} style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.9)", border:"none", borderRadius:"50%", width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.12)" }}>{ChevronLeft}</button>
        <button onClick={()=>setImgIdx(i=>(i+1)%total)} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.9)", border:"none", borderRadius:"50%", width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.12)" }}>{ChevronRight}</button>
      </>}
    </div>
  );

  /* ── Desktop image gallery: arrow | image | arrow | thumbnails ── */
  const DesktopGallery = (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      {/* Prev arrow */}
      <button onClick={()=>setImgIdx(i=>(i-1+total)%total)} style={{ background:"none", border:"none", cursor:"pointer", padding:"0 8px", opacity: total>1?1:0.2, flexShrink:0 }}>{ChevronLeft}</button>
      {/* Main image */}
      <div style={{ flex:1, aspectRatio:"1/1", background:"#fff", borderRadius:16, overflow:"hidden" }}>
        {src ? <img src={src} alt={p.name||""} style={{ width:"100%", height:"100%", objectFit:"contain", padding:20, boxSizing:"border-box", display:"block" }}/> : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:52 }}>🎀</div>}
      </div>
      {/* Next arrow */}
      <button onClick={()=>setImgIdx(i=>(i+1)%total)} style={{ background:"none", border:"none", cursor:"pointer", padding:"0 8px", opacity: total>1?1:0.2, flexShrink:0 }}>{ChevronRight}</button>
      {/* Thumbnail column */}
      {total > 1 && (
        <div style={{ display:"flex", flexDirection:"column", gap:8, flexShrink:0 }}>
          {imgs.map((url,i) => (
            <div key={i} onClick={()=>setImgIdx(i)} style={{ width:64, height:64, borderRadius:10, overflow:"hidden", border: i===imgIdx ? `2px solid ${HOT}` : `1.5px solid ${BORDER}`, background:WHITE, cursor:"pointer" }}>
              <img src={url} alt="" style={{ width:"100%", height:"100%", objectFit:"contain", padding:4, boxSizing:"border-box" }}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ── Product info panel ── */
  const InfoPanel = (
    <div style={{ flex:1, minWidth:0 }}>
      <h2 style={{ fontFamily:"'Acme',sans-serif", fontSize:mobile?22:30, fontWeight:400, fontStyle:"normal", color:"#f496c3", margin:"0 0 10px", lineHeight:1.2 }}>
        {p.fullName || p.name || ""}
      </h2>
      <div style={{ fontSize:mobile?17:20, fontWeight:700, color:DARK, fontFamily:"'Nunito',sans-serif", marginBottom:20, paddingBottom:20, borderBottom:`1px solid ${BORDER}` }}>
        ${price.toFixed(2)}
      </div>
      {p.variants?.length > 0 && (
        <div style={{ marginBottom:20, paddingBottom:20, borderBottom:`1px solid ${BORDER}` }}>
          <div style={{ fontSize:12, fontWeight:700, fontFamily:"'Nunito',sans-serif", color:DARK, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.08em" }}>
            Color: <span style={{ color:HOT }}>{p.variants[variantI].label}</span>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {p.variants.map((v,i) => (
              <button key={i} onClick={()=>{ setVariantI(i); setImgIdx(v.imgIdx ?? i); }} style={{
                padding:"7px 14px", borderRadius:50, fontSize:12, fontWeight:700,
                fontFamily:"'Nunito',sans-serif", cursor:"pointer",
                background: i===variantI ? "#F496C2" : WHITE,
                color: i===variantI ? WHITE : DARK,
                border: i===variantI ? "none" : `1.5px solid ${BORDER}`,
              }}>{v.label}</button>
            ))}
          </div>
        </div>
      )}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28, paddingBottom:28, borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, border:`1px solid ${BORDER}`, borderRadius:50, padding:"4px 12px" }}>
          <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:DARK, lineHeight:1, padding:0 }}>−</button>
          <span style={{ fontSize:13, fontWeight:700, fontFamily:"'Nunito',sans-serif", color:DARK, minWidth:16, textAlign:"center" }}>{qty}</span>
          <button onClick={()=>setQty(q=>q+1)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:DARK, lineHeight:1, padding:0 }}>+</button>
        </div>
        <button onClick={()=>onAdd(p)} style={{
          flex:1, padding:mobile?"12px":"14px", fontSize:mobile?14:16, fontFamily:"'Nunito',sans-serif",
          fontWeight:700, borderRadius:50, cursor:"pointer",
          background: inCart ? SOFT : "#F496C2",
          color: inCart ? HOT : WHITE, border: inCart ? `1.5px solid ${HOT}` : "none",
        }}>
          {inCart ? "✓ In Cart" : "Add To Cart"}
        </button>
      </div>
      {p.desc ? <p style={{ fontSize:mobile?13:15, color:DARK, fontFamily:"'Lato',sans-serif", lineHeight:1.8, margin:"0 0 16px" }}>{p.desc}</p> : null}
      {(p.bullets?.length > 0) ? (
        <ul style={{ listStyle:"none", padding:0, margin:0 }}>
          {p.bullets.map((b,i) => (
            <li key={i} style={{ fontSize:mobile?13:14, color:DARK, fontFamily:"'Lato',sans-serif", lineHeight:1.8, marginBottom:8, display:"flex", gap:10 }}>
              <span style={{ color:HOT, flexShrink:0 }}>·</span>{b}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  return (
    <div style={{ background:WHITE, paddingBottom:40 }}>
      <button onClick={onBack} style={{
        display:"flex", alignItems:"center", gap:6,
        background:"none", border:`1.5px solid ${BORDER}`,
        borderRadius:50, padding:"8px 16px", marginBottom:20,
        fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:700,
        color:DARK, cursor:"pointer",
      }}>← Back</button>

      {mobile ? (
        /* ── MOBILE: image on top, info below ── */
        <div>
          <div style={{ marginBottom:20 }}>{MobileCarousel}</div>
          {InfoPanel}
        </div>
      ) : (
        /* ── DESKTOP: info left, gallery right ── */
        <div style={{ display:"flex", gap:32, alignItems:"flex-start" }}>
          {InfoPanel}
          <div style={{ flexShrink:0, width:"52%" }}>{DesktopGallery}</div>
        </div>
      )}

      {/* ── Recommended products ── */}
      {recommended?.length > 0 && (
        <div style={{ marginTop:40, paddingTop:28, borderTop:`1.5px solid ${BORDER}` }}>
          <div style={{ fontFamily:"'Acme',sans-serif", fontSize:mobile?18:22, color:"#f496c3", marginBottom:16 }}>
            You Might Also Like
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {recommended.map((r, i) => (
              <div key={r.id} onClick={()=>onView(r)} style={{
                display:"flex", alignItems:"center", gap:14,
                padding:"14px 16px",
                border:`1.5px solid ${BORDER}`,
                borderBottom: i === recommended.length-1 ? `1.5px solid ${BORDER}` : "none",
                borderRadius: i===0 ? "12px 12px 0 0" : i===recommended.length-1 ? "0 0 12px 12px" : 0,
                cursor:"pointer", background:WHITE,
              }}>
                {/* Thumbnail */}
                <div style={{ width:60, height:60, borderRadius:8, overflow:"hidden", background:WHITE, flexShrink:0, border:`1px solid ${BORDER}` }}>
                  {r.image
                    ? <img src={r.image} alt={r.name} style={{ width:"100%", height:"100%", objectFit:"contain", padding:4, boxSizing:"border-box" }}/>
                    : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🎀</div>
                  }
                </div>
                {/* Name + price */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Acme',sans-serif", fontSize:15, color:"#f496c3", lineHeight:1.3, marginBottom:3 }}>{r.name}</div>
                  <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:DARK }}>${(+r.price||0).toFixed(2)}</div>
                </div>
                {/* Add button / qty stepper */}
                {recQty[r.id] > 0 ? (
                  <div onClick={e=>e.stopPropagation()} style={{ display:"flex", alignItems:"center", gap:0, border:`1.5px solid #F496C2`, borderRadius:50, overflow:"hidden", flexShrink:0 }}>
                    <button onClick={()=>setRecQty(q=>{ const n={...q}; if(n[r.id]<=1){delete n[r.id]}else{n[r.id]--}; return n; })} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"#F496C2", fontWeight:700, padding:"4px 10px", lineHeight:1 }}>−</button>
                    <span style={{ fontSize:13, fontWeight:700, fontFamily:"'Nunito',sans-serif", color:DARK, minWidth:20, textAlign:"center" }}>{recQty[r.id]}</span>
                    <button onClick={()=>setRecQty(q=>({...q,[r.id]:(q[r.id]||0)+1}))} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"#F496C2", fontWeight:700, padding:"4px 10px", lineHeight:1 }}>+</button>
                  </div>
                ) : (
                  <button onClick={e=>{ e.stopPropagation(); onAdd(r); setRecQty(q=>({...q,[r.id]:1})); }} style={{
                    flexShrink:0, padding:"8px 20px", borderRadius:50, fontSize:13, fontWeight:700,
                    fontFamily:"'Nunito',sans-serif", cursor:"pointer",
                    background:"#F496C2", color:WHITE, border:"none",
                    boxShadow:"0 3px 12px rgba(244,150,194,0.30)",
                  }}>Add</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({ cart, onRemove, onClose }) {
  const total = cart.reduce((s,i)=>s+i.price,0);
  return (
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(45,10,24,0.45)",backdropFilter:"blur(6px)"}}/>
      <div style={{
        position:"relative",zIndex:1,width:"100%",maxWidth:430,
        background:WHITE,borderRadius:"26px 26px 0 0",
        border:`1.5px solid ${BORDER}`,borderBottom:"none",
        maxHeight:"80vh",overflowY:"auto",paddingBottom:36,
      }}>
        <div style={{width:44,height:4,borderRadius:2,background:MID,margin:"14px auto 10px"}}/>
        <div style={{padding:"0 18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:18,fontWeight:700,color:DARK,margin:0}}>
              Your Cart ({cart.length})
            </h3>
            <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#aaa"}}>×</button>
          </div>

          {cart.length === 0 ? (
            <div style={{textAlign:"center",padding:"32px 0",color:"#bbb",fontFamily:"'Nunito',sans-serif",fontSize:13}}>
              Your cart is empty 💔
            </div>
          ) : (
            <>
              {cart.map(item=>(
                <div key={item.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${BORDER}`}}>
                  <div style={{position:"relative",width:58,height:58,borderRadius:6,overflow:"hidden",background:"#FDF5F8",flexShrink:0}}>
                    <img src={item.image} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:DARK,fontFamily:"'Nunito',sans-serif",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                    <div style={{fontSize:14,fontWeight:700,color:DARK,fontFamily:"'Nunito',sans-serif"}}>${item.price.toFixed(2)}</div>
                  </div>
                  <button onClick={()=>onRemove(item.id)} style={{background:SOFT,border:`1px solid ${BORDER}`,borderRadius:"50%",width:28,height:28,cursor:"pointer",color:PUNCH,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:15}}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button style={{...BP,width:"100%",padding:"14px",fontSize:14}}>Checkout — ${total.toFixed(2)}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Shop Tab ────────────────────────────────────────────────────────────
export default function ShopTab({ cart, setCart }) {
  const [cat,      setCat]      = useState("all");
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const mobile = useIsMobile();

  const inCart = id => cart.some(c=>c.id===id);
  const add    = p  => { if (!inCart(p.id)) setCart(prev=>[...prev,p]); };
  const remove = id => setCart(prev=>prev.filter(c=>c.id!==id));

  const filtered = DECOR_PRODUCTS.filter(p => {
    const mc = cat === "all" || p.category === cat;
    const ms = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  // Show product detail page inline (replaces grid)
  if (selected) {
    const recommended = DECOR_PRODUCTS
      .filter(p => p.id !== selected.id && p.category === selected.category)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    return (
      <div style={{ paddingBottom:24 }}>
        <ProductDetail
          p={selected}
          onBack={()=>setSelected(null)}
          onAdd={add}
          inCart={inCart(selected.id)}
          recommended={recommended}
          onView={p=>{ setSelected(p); window.scrollTo(0,0); }}
        />
      </div>
    );
  }

  return (
    <div style={{paddingBottom:24}}>

      {/* ── Two-column layout: sidebar + grid ── */}
      <div style={{display:"flex",gap:0,alignItems:"flex-start"}}>

        {/* ── Left sidebar: plain text category list ── */}
        <div style={{width:mobile?88:130,flexShrink:0,paddingRight:mobile?8:16,paddingTop:4}}>
          {SHOP_CATS.map(c=>(
            <div key={c.id} onClick={()=>setCat(c.id)} style={{
              fontFamily:"'Playfair Display',Georgia,serif",
              fontSize:mobile?12:15,
              fontWeight: cat===c.id ? 700 : 400,
              color: cat===c.id ? HOT : DARK,
              cursor:"pointer",
              marginBottom:mobile?12:18,
              lineHeight:1.2,
              transition:"color 0.15s",
            }}>
              {c.label}
            </div>
          ))}
        </div>

        {/* ── Right: product grid (2 cols mobile, 4 cols desktop) ── */}
        <div style={{flex:1,minWidth:0}}>
          {filtered.length > 0 ? (
            <div style={{display:"grid",gridTemplateColumns:mobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:mobile?"16px 10px":"20px 12px"}}>
              {filtered.map(p=>(
                <ProductTile key={p.id} p={p} onView={()=>setSelected(p)}/>
              ))}
            </div>
          ) : (
            <div style={{textAlign:"center",padding:"48px 20px"}}>
              <div style={{fontSize:36,marginBottom:12}}>🔍</div>
              <div style={{fontSize:14,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:8}}>No products found</div>
              <button onClick={()=>setCat("all")} style={{...BS,fontSize:12}}>Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
