import React, { useState } from 'react';
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
  isDigital: false,
  bestseller:false,
  };
});

// ─── Pink corner brackets — signature Squarespace look ───────────────────────
function Brackets({ size = 14, thick = 3, color = "#E91E8C", gap = 7 }) {
  const base = { position:"absolute", width:size, height:size };
  const c = `${thick}px solid ${color}`;
  return (
    <>
      <div style={{...base, top:gap, left:gap,    borderTop:c, borderLeft:c  }}/>
      <div style={{...base, top:gap, right:gap,   borderTop:c, borderRight:c }}/>
      <div style={{...base, bottom:gap, left:gap,  borderBottom:c, borderLeft:c }}/>
      <div style={{...base, bottom:gap, right:gap, borderBottom:c, borderRight:c}}/>
    </>
  );
}

// ─── Product image tile ───────────────────────────────────────────────────────
function ProductTile({ p, onView }) {
  const [loaded, setLoaded] = useState(false);
  const [err,    setErr]    = useState(false);
  return (
    <div onClick={onView} style={{ cursor:"pointer", textAlign:"center" }}>
      {/* Image box — blush background, no border, pink brackets + Bach Hotline badge */}
      <div style={{
        position:"relative", width:"100%", aspectRatio:"1/1",
        background:"#FDF5F8",
        marginBottom:8,
      }}>
        {!err && p.image ? (
          <img
            src={p.image} alt={p.name}
            onLoad={()=>setLoaded(true)}
            onError={()=>setErr(true)}
            style={{
              width:"100%", height:"100%", objectFit:"contain",
              padding:8, boxSizing:"border-box",
              opacity:loaded?1:0, transition:"opacity 0.3s",
              display:"block", imageRendering:"auto",
            }}
          />
        ) : (
          <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,color:"#f4a0c0"}}>
            🎀
          </div>
        )}
      </div>
      {/* Name + Price */}
      <div style={{fontSize:12,fontWeight:500,color:DARK,fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1.3,marginBottom:3}}>
        {p.name}
      </div>
      <div style={{fontSize:12,color:DARK,fontFamily:"'Nunito',sans-serif"}}>
        ${(+p.price || 0).toFixed(2)}
      </div>
    </div>
  );
}

// ─── Product Detail Modal — two-column layout matching reference ─────────────
function ProductModal({ p, onClose, onAdd, inCart }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [qty,    setQty]    = useState(1);

  React.useEffect(() => { setImgIdx(0); setQty(1); }, [p?.id]);
  if (!p) return null;

  const imgs  = (p.images?.length > 0) ? p.images : (p.image ? [p.image] : []);
  const total = imgs.length;
  const src   = imgs[imgIdx] || "";

  const prev = e => { e.stopPropagation(); setImgIdx(i => (i - 1 + total) % total); };
  const next = e => { e.stopPropagation(); setImgIdx(i => (i + 1) % total); };

  const touchRef = React.useRef(null);
  const onTouchStart = e => { touchRef.current = e.touches[0].clientX; };
  const onTouchEnd   = e => {
    if (touchRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchRef.current;
    if (Math.abs(dx) > 40) dx < 0 ? setImgIdx(i=>(i+1)%total) : setImgIdx(i=>(i-1+total)%total);
    touchRef.current = null;
  };

  return (
    <div style={{ position:"fixed",inset:0,zIndex:500,background:WHITE,overflowY:"auto" }}>

      {/* Close button */}
      <button onClick={onClose} style={{
        position:"fixed",top:14,right:16,background:"none",border:"none",
        fontSize:22,cursor:"pointer",color:DARK,zIndex:10,lineHeight:1,
      }}>×</button>

      {/* ── Two-column layout ── */}
      <div style={{display:"flex",flexDirection:"row",minHeight:"100vh",alignItems:"flex-start"}}>

        {/* LEFT — product info */}
        <div style={{flex:"0 0 48%",padding:"48px 28px 40px 24px",boxSizing:"border-box"}}>

          {/* Name */}
          <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:26,fontWeight:700,fontStyle:"italic",color:HOT,margin:"0 0 12px",lineHeight:1.2}}>
            {p.fullName || p.name}
          </h2>

          {/* Price */}
          <div style={{fontSize:18,fontWeight:700,color:DARK,fontFamily:"'Nunito',sans-serif",marginBottom:22}}>
            ${(+p.price || 0).toFixed(2)}
          </div>

          {/* Qty stepper + Add to Cart */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28,paddingBottom:24,borderBottom:`1px solid ${BORDER}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,borderBottom:`1.5px solid ${DARK}`,paddingBottom:2}}>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:DARK,fontWeight:300,lineHeight:1,padding:"0 4px"}}>−</button>
              <span style={{fontSize:15,fontWeight:600,fontFamily:"'Nunito',sans-serif",color:DARK,minWidth:18,textAlign:"center"}}>{qty}</span>
              <button onClick={()=>setQty(q=>q+1)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:DARK,fontWeight:300,lineHeight:1,padding:"0 4px"}}>+</button>
            </div>
            <button onClick={()=>onAdd(p)} style={{
              flex:1, padding:"11px 14px", fontSize:13, fontFamily:"'Nunito',sans-serif",
              fontWeight:700, borderRadius:50, cursor:"pointer",
              background: inCart ? SOFT : `linear-gradient(135deg,#f472b0,${HOT})`,
              color: inCart ? HOT : WHITE,
              border: inCart ? `1.5px solid ${HOT}` : "none",
            }}>
              {inCart ? "✓ In Cart" : "Add To Cart"}
            </button>
          </div>

          {/* Description */}
          {p.desc && (
            <p style={{fontSize:13,color:DARK,fontFamily:"'Nunito',sans-serif",lineHeight:1.8,margin:"0 0 16px"}}>
              {p.desc}
            </p>
          )}

          {/* Bullets */}
          {p.bullets?.length > 0 && (
            <ul style={{listStyle:"none",padding:0,margin:0}}>
              {p.bullets.map((b,i)=>(
                <li key={i} style={{fontSize:13,color:DARK,fontFamily:"'Nunito',sans-serif",lineHeight:1.7,marginBottom:6,display:"flex",gap:8,alignItems:"flex-start"}}>
                  <span style={{color:HOT,flexShrink:0}}>·</span>{b}
                </li>
              ))}
            </ul>
          )}

          {p.isDigital && (
            <div style={{marginTop:16,padding:"10px 14px",background:SOFT,borderRadius:10,fontSize:12,color:HOT,fontFamily:"'Nunito',sans-serif",fontWeight:600}}>
              📥 Instant Download — delivered to your email after purchase
            </div>
          )}
        </div>

        {/* RIGHT — image carousel + vertical thumbnail strip */}
        <div style={{flex:"0 0 52%",display:"flex",gap:8,padding:"32px 16px 32px 0",boxSizing:"border-box",alignItems:"flex-start"}}>

          {/* Main image area */}
          <div
            style={{flex:1,position:"relative",aspectRatio:"1/1",background:"#FDF5F8",userSelect:"none"}}
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          >
            {src ? (
              <img key={src} src={src} alt={p.name}
                style={{width:"100%",height:"100%",objectFit:"contain",padding:16,boxSizing:"border-box",display:"block"}}
              />
            ) : (
              <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:52}}>🎀</div>
            )}

            {/* Prev / Next arrows */}
            {total > 1 && (
              <>
                <button onClick={prev} style={{
                  position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",
                  background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",
                  width:34,height:34,cursor:"pointer",fontSize:18,color:DARK,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:"0 1px 4px rgba(0,0,0,0.12)",
                }}>‹</button>
                <button onClick={next} style={{
                  position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
                  background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",
                  width:34,height:34,cursor:"pointer",fontSize:18,color:DARK,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:"0 1px 4px rgba(0,0,0,0.12)",
                }}>›</button>
              </>
            )}
          </div>

          {/* Vertical thumbnail strip */}
          {total > 1 && (
            <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
              {imgs.map((url,i) => (
                <div key={i} onClick={()=>setImgIdx(i)} style={{
                  width:52,height:52,borderRadius:6,overflow:"hidden",
                  border: i===imgIdx ? `2px solid ${HOT}` : `1.5px solid ${BORDER}`,
                  background:"#FDF5F8",cursor:"pointer",position:"relative",
                }}>
                  <img src={url} alt="" style={{width:"100%",height:"100%",objectFit:"contain",padding:3,boxSizing:"border-box"}}/>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
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

  const inCart = id => cart.some(c=>c.id===id);
  const add    = p  => { if (!inCart(p.id)) setCart(prev=>[...prev,p]); };
  const remove = id => setCart(prev=>prev.filter(c=>c.id!==id));

  const filtered = DECOR_PRODUCTS.filter(p => {
    const mc = cat === "all" || p.category === cat;
    const ms = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  return (
    <div style={{paddingBottom:24}}>

      {/* ── Two-column layout: sidebar + grid ── */}
      <div style={{display:"flex",gap:0,alignItems:"flex-start"}}>

        {/* ── Left sidebar: plain text category list ── */}
        <div style={{width:130,flexShrink:0,paddingRight:16,paddingTop:4}}>
          {SHOP_CATS.map(c=>(
            <div key={c.id} onClick={()=>setCat(c.id)} style={{
              fontFamily:"'Playfair Display',Georgia,serif",
              fontSize:15,
              fontWeight: cat===c.id ? 700 : 400,
              color: cat===c.id ? HOT : DARK,
              cursor:"pointer",
              marginBottom:18,
              lineHeight:1.2,
              transition:"color 0.15s",
            }}>
              {c.label}
            </div>
          ))}
        </div>

        {/* ── Right: 4-column product grid ── */}
        <div style={{flex:1,minWidth:0}}>
          {filtered.length > 0 ? (
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"24px 12px"}}>
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

        </div>{/* end right column */}
      </div>{/* end two-column row */}

      {/* ── Modals ── */}
      <ProductModal
        p={selected}
        onClose={()=>setSelected(null)}
        onAdd={add}
        inCart={selected ? inCart(selected.id) : false}
      />
      {cartOpen && <CartDrawer cart={cart} onRemove={remove} onClose={()=>setCartOpen(false)}/>}
    </div>
  );
}
