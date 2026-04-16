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
    <div onClick={onView} style={{ cursor:"pointer" }}>
      {/* Image box with brackets */}
      <div style={{
        position:"relative", width:"100%", aspectRatio:"1/1",
        background:"#FDF5F8", borderRadius:4, overflow:"hidden",
        marginBottom:8,
      }}>
        {!err ? (
          <img
            src={p.image} alt={p.name}
            onLoad={()=>setLoaded(true)}
            onError={()=>setErr(true)}
            style={{
              width:"100%", height:"100%", objectFit:"cover",
              opacity:loaded?1:0, transition:"opacity 0.35s",
              display:"block",
            }}
          />
        ) : (
          <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>
            🎀
          </div>
        )}
        {/* Pink corner brackets */}
        <Brackets />
        {p.bestseller && (
          <div style={{
            position:"absolute",bottom:8,left:8,
            background:PUNCH,color:WHITE,fontSize:8,fontWeight:900,
            fontFamily:"'DM Sans',sans-serif",padding:"3px 7px",borderRadius:4,
            textTransform:"uppercase",letterSpacing:0.5,
          }}>Best Seller</div>
        )}
      </div>
      {/* Name + Price */}
      <div style={{fontSize:12,fontWeight:600,color:DARK,fontFamily:"'DM Sans',sans-serif",lineHeight:1.35,marginBottom:3}}>
        {p.name}
      </div>
      <div style={{fontSize:13,fontWeight:700,color:DARK,fontFamily:"'DM Sans',sans-serif"}}>
        ${p.price.toFixed(2)}
      </div>
    </div>
  );
}

// ─── Product Detail Modal ─────────────────────────────────────────────────────
function ProductModal({ p, onClose, onAdd, inCart }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  if (!p) return null;
  return (
    <div style={{ position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(45,10,24,0.45)",backdropFilter:"blur(6px)" }}/>
      <div style={{
        position:"relative",zIndex:1,width:"100%",maxWidth:430,
        background:WHITE,borderRadius:"26px 26px 0 0",
        border:`1.5px solid ${BORDER}`,borderBottom:"none",
        maxHeight:"92vh",overflowY:"auto",paddingBottom:40,
      }}>
        {/* Drag handle */}
        <div style={{width:44,height:4,borderRadius:2,background:MID,margin:"14px auto 0"}}/>
        <button onClick={onClose} style={{
          position:"absolute",top:14,right:16,background:SOFT,
          border:`1px solid ${BORDER}`,borderRadius:"50%",width:32,height:32,
          cursor:"pointer",color:HOT,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",
        }}>×</button>

        {/* Large image with brackets */}
        <div style={{margin:"16px 16px 0",position:"relative",aspectRatio:"1/1",background:"#FDF5F8",borderRadius:8,overflow:"hidden"}}>
          {!imgLoaded && (
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:52}}>🎀</div>
          )}
          <img
            src={p.image} alt={p.name}
            onLoad={()=>setImgLoaded(true)}
            style={{width:"100%",height:"100%",objectFit:"cover",opacity:imgLoaded?1:0,transition:"opacity 0.4s"}}
          />
          <Brackets size={18} thick={3} gap={10}/>
        </div>

        <div style={{padding:"20px 18px 0"}}>
          {/* Category breadcrumb */}
          <div style={{fontSize:10,color:"#aaa",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>
            Bach Hotline › {p.category}
          </div>

          {/* Product name */}
          <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:20,fontWeight:700,color:HOT,margin:"0 0 8px",lineHeight:1.3}}>
            {p.fullName || p.name}
          </h2>

          {/* Price */}
          <div style={{fontSize:22,fontWeight:900,color:DARK,fontFamily:"'DM Sans',sans-serif",marginBottom:16}}>
            ${p.price.toFixed(2)}
          </div>

          {/* Qty + Add to Cart row */}
          <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}>
            <button onClick={()=>onAdd(p)} style={{
              ...BP, flex:1, padding:"13px", fontSize:14,
              background:inCart?SOFT:undefined,
              color:inCart?HOT:undefined,
              border:inCart?`1.5px solid ${HOT}`:undefined,
            }}>
              {inCart ? "✓ In Cart" : "Add To Cart"}
            </button>
            <a href={p.url} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
              <button style={{...BS,padding:"13px 16px",fontSize:13,whiteSpace:"nowrap"}}>
                View on Etsy
              </button>
            </a>
          </div>

          {/* Tags */}
          {p.tags?.length > 0 && (
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
              {p.tags.map(t=>(
                <span key={t} style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:SOFT,border:`1px solid ${MID}`,color:HOT,fontFamily:"'DM Sans',sans-serif"}}>
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Ratings */}
          <div style={{display:"flex",alignItems:"center",gap:6,paddingTop:12,borderTop:`1px solid ${BORDER}`}}>
            <span style={{fontSize:13,color:HOT}}>{"★".repeat(Math.floor(p.rating))}</span>
            <span style={{fontSize:11,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>{p.rating} · {p.reviews} reviews</span>
            {p.isDigital && <span style={{marginLeft:"auto",fontSize:10,color:HOT,fontFamily:"'DM Sans',sans-serif",fontWeight:700}}>📥 Instant Download</span>}
          </div>
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
            <div style={{textAlign:"center",padding:"32px 0",color:"#bbb",fontFamily:"'DM Sans',sans-serif",fontSize:13}}>
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
                    <div style={{fontSize:13,fontWeight:600,color:DARK,fontFamily:"'DM Sans',sans-serif",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                    <div style={{fontSize:14,fontWeight:700,color:DARK,fontFamily:"'DM Sans',sans-serif"}}>${item.price.toFixed(2)}</div>
                  </div>
                  <button onClick={()=>onRemove(item.id)} style={{background:SOFT,border:`1px solid ${BORDER}`,borderRadius:"50%",width:28,height:28,cursor:"pointer",color:PUNCH,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:15}}>
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

      {/* ── Header ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div>
          <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:20,fontWeight:700,color:HOT}}>
            Bach Hotline
          </div>
          <div style={{fontSize:11,color:"#aaa",fontFamily:"'DM Sans',sans-serif",marginTop:1}}>
            Party Supplies · {filtered.length} products
          </div>
        </div>
        {/* Cart button */}
        <button onClick={()=>setCartOpen(true)} style={{
          position:"relative",background:cart.length>0?`linear-gradient(135deg,#f472b0,${HOT})`:SOFT,
          border:`1.5px solid ${cart.length>0?HOT:BORDER}`,borderRadius:50,
          padding:"8px 16px",cursor:"pointer",
          fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,
          color:cart.length>0?WHITE:HOT,display:"flex",alignItems:"center",gap:6,
        }}>
          🛒 Cart
          {cart.length>0&&(
            <span style={{background:WHITE,color:HOT,borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900}}>
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Search ── */}
      <div style={{position:"relative",marginBottom:14}}>
        <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:14,opacity:0.35,pointerEvents:"none"}}>🔍</span>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search products..."
          style={{...IN,paddingLeft:38,borderRadius:50,border:`1.5px solid ${BORDER}`}}
        />
        {search && (
          <button onClick={()=>setSearch("")} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:HOT,fontSize:16}}>×</button>
        )}
      </div>

      {/* ── Category list — matches Squarespace sidebar style ── */}
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:16,scrollbarWidth:"none"}}>
        {SHOP_CATS.map(c=>(
          <button key={c.id} onClick={()=>setCat(c.id)} style={{
            flexShrink:0,padding:"7px 16px",borderRadius:50,
            background:cat===c.id?DARK:WHITE,
            color:cat===c.id?WHITE:DARK,
            border:cat===c.id?`1.5px solid ${DARK}`:`1.5px solid ${BORDER}`,
            fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,
            cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap",
          }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Product Grid — Squarespace style ── */}
      {filtered.length > 0 ? (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px 14px"}}>
          {filtered.map(p=>(
            <ProductTile key={p.id} p={p} onView={()=>setSelected(p)}/>
          ))}
        </div>
      ) : (
        <div style={{textAlign:"center",padding:"48px 20px"}}>
          <div style={{fontSize:36,marginBottom:12}}>🔍</div>
          <div style={{fontSize:14,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:8}}>No products found</div>
          <button onClick={()=>{setSearch("");setCat("all");}} style={{...BS,fontSize:12}}>Clear filters</button>
        </div>
      )}

      {/* ── View all on Etsy ── */}
      {filtered.length > 0 && (
        <div style={{textAlign:"center",marginTop:28,paddingTop:20,borderTop:`1px solid ${BORDER}`}}>
          <a href="https://bachhotlinesupplies.etsy.com" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
            <button style={{...BP,fontSize:13,padding:"12px 28px"}}>
              View All Products on Etsy →
            </button>
          </a>
          <div style={{marginTop:8,fontSize:10,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>
            bachhotlinesupplies.etsy.com · ⭐ 4.9 · Houston, TX
          </div>
        </div>
      )}

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
