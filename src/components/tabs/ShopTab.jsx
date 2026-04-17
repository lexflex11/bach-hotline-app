import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { BP, BS, IN } from '../../constants/styles.js';
import { PRODUCTS, SHOP_CATS } from '../../constants/data.js';

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
      {/* Image box with brackets */}
      <div style={{
        position:"relative", width:"100%", aspectRatio:"1/1",
        background:"#FDF5F8", overflow:"hidden",
        marginBottom:10,
      }}>
        {!err ? (
          <img
            src={p.image} alt={p.name}
            onLoad={()=>setLoaded(true)}
            onError={()=>setErr(true)}
            style={{
              width:"100%", height:"100%", objectFit:"contain",
              padding:8, boxSizing:"border-box",
              opacity:loaded?1:0, transition:"opacity 0.35s",
              display:"block",
            }}
          />
        ) : (
          <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>
            🎀
          </div>
        )}
        <Brackets size={16} thick={3} color={HOT} gap={6}/>
      </div>
      {/* Name + Price — centered, below card */}
      <div style={{fontSize:13,fontWeight:500,color:DARK,fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1.4,marginBottom:4}}>
        {p.name}
      </div>
      <div style={{fontSize:13,color:DARK,fontFamily:"'Nunito',sans-serif"}}>
        ${p.price.toFixed(2)}
      </div>
    </div>
  );
}

// ─── Product Detail Modal ─────────────────────────────────────────────────────
function ProductModal({ p, onClose, onAdd, inCart }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [qty, setQty] = useState(1);
  if (!p) return null;
  return (
    <div style={{ position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(45,10,24,0.45)",backdropFilter:"blur(6px)" }}/>
      <div style={{
        position:"relative",zIndex:1,width:"100%",maxWidth:480,
        background:WHITE,borderRadius:"20px 20px 0 0",
        maxHeight:"94vh",overflowY:"auto",paddingBottom:40,
      }}>
        {/* Drag handle */}
        <div style={{width:36,height:4,borderRadius:2,background:"#ddd",margin:"12px auto 0"}}/>

        {/* Close button */}
        <button onClick={onClose} style={{
          position:"absolute",top:12,right:14,background:SOFT,
          border:"none",borderRadius:"50%",width:30,height:30,
          cursor:"pointer",color:DARK,fontSize:16,fontWeight:700,
          display:"flex",alignItems:"center",justifyContent:"center",
        }}>×</button>

        {/* Full-width image with corner brackets */}
        <div style={{position:"relative",width:"100%",aspectRatio:"1/1",background:"#FDF5F8",marginTop:8,overflow:"hidden"}}>
          {!imgLoaded && (
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:52}}>🎀</div>
          )}
          <img
            src={p.image} alt={p.name}
            onLoad={()=>setImgLoaded(true)}
            style={{width:"100%",height:"100%",objectFit:"contain",padding:16,boxSizing:"border-box",opacity:imgLoaded?1:0,transition:"opacity 0.4s"}}
          />
          <Brackets size={20} thick={3} color={HOT} gap={8}/>
          {/* Page counter */}
          <div style={{position:"absolute",top:12,right:14,fontSize:11,color:"#aaa",fontFamily:"'Nunito',sans-serif"}}>1 / 1</div>
        </div>

        <div style={{padding:"20px 20px 0"}}>
          {/* Breadcrumb */}
          <div style={{fontSize:10,color:"#aaa",fontFamily:"'Nunito',sans-serif",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>
            Bach Hotline › {p.category}
          </div>

          {/* Product name — pink italic serif */}
          <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:22,fontWeight:700,fontStyle:"italic",color:HOT,margin:"0 0 10px",lineHeight:1.3}}>
            {p.fullName || p.name}
          </h2>

          {/* Price */}
          <div style={{fontSize:20,fontWeight:700,color:DARK,fontFamily:"'Nunito',sans-serif",marginBottom:18}}>
            ${p.price.toFixed(2)}
          </div>

          {/* Qty stepper + Add to Cart */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,paddingBottom:20,borderBottom:`1px solid ${BORDER}`}}>
            {/* Stepper */}
            <div style={{display:"flex",alignItems:"center",gap:12,borderBottom:`1.5px solid ${DARK}`,paddingBottom:2}}>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:DARK,fontWeight:300,lineHeight:1,padding:"0 2px"}}>−</button>
              <span style={{fontSize:15,fontWeight:600,fontFamily:"'Nunito',sans-serif",color:DARK,minWidth:20,textAlign:"center"}}>{qty}</span>
              <button onClick={()=>setQty(q=>q+1)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:DARK,fontWeight:300,lineHeight:1,padding:"0 2px"}}>+</button>
            </div>
            {/* Add to Cart */}
            <button onClick={()=>onAdd(p)} style={{
              flex:1, padding:"13px", fontSize:14, fontFamily:"'Nunito',sans-serif",
              fontWeight:700, border:"none", borderRadius:50, cursor:"pointer",
              background: inCart ? SOFT : `linear-gradient(135deg,#f472b0,${HOT})`,
              color: inCart ? HOT : WHITE,
              border: inCart ? `1.5px solid ${HOT}` : "none",
              transition:"all 0.15s",
            }}>
              {inCart ? "✓ In Cart" : "Add To Cart"}
            </button>
          </div>

          {/* Description */}
          {p.desc && (
            <p style={{fontSize:13,color:DARK,fontFamily:"'Nunito',sans-serif",lineHeight:1.7,margin:"0 0 14px"}}>
              {p.desc}
            </p>
          )}

          {/* Bullet points */}
          {p.bullets?.length > 0 && (
            <ul style={{listStyle:"none",padding:0,margin:0}}>
              {p.bullets.map((b,i)=>(
                <li key={i} style={{fontSize:13,color:DARK,fontFamily:"'Nunito',sans-serif",lineHeight:1.6,marginBottom:4,display:"flex",gap:8,alignItems:"flex-start"}}>
                  <span style={{color:HOT,flexShrink:0,marginTop:2}}>·</span>
                  {b}
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
                    <Brackets size={8} thick={2} gap={4}/>
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

  const filtered = PRODUCTS.filter(p => {
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
              <div style={{fontSize:14,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:8}}>No products found</div>
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
