import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C, BP, SM } from '../../constants/styles.js';
import { DESTS, BRIDE_TYPES } from '../../constants/data.js';
import { ANTHROPIC_API_KEY, flightUrl, airbnbUrl, viatorUrl, opentableUrl } from '../../constants/api.js';

export default function PlanTab({ groupSize, setGroupSize, setTab }) {
  const [dest,    setDest]    = useState(null);
  const [days,    setDays]    = useState(3);
  const [bt,      setBt]      = useState(null);
  const [region,  setRegion]  = useState("us");   // "us" | "intl"
  const [budget,  setBudget]  = useState(null);   // budget tier id
  const [customBudget, setCustomBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);

  const BUDGET_TIERS = [
    { id:"budget",   label:"Budget",   range:"$300–600",   desc:"Smart savings, still iconic",  emoji:"💸", color:"#4CAF50" },
    { id:"moderate", label:"Moderate", range:"$600–1,200", desc:"Best of both worlds",           emoji:"✨", color:HOT       },
    { id:"luxury",   label:"Luxury",   range:"$1,200–2,500",desc:"All the yes, none of the stress",emoji:"👑",color:PUNCH   },
    { id:"custom",   label:"Custom",   range:"You decide", desc:"Set your own per-person budget",emoji:"🎯", color:"#9C27B0" },
  ];

  const activeBudget = BUDGET_TIERS.find(b => b.id === budget);
  const budgetLabel  = budget === "custom" && customBudget
    ? `$${customBudget}/person`
    : activeBudget?.range || "";

  const tEmoji = { morning:"🌅", afternoon:"☀️", evening:"🌆", nightlife:"🌙" };

  const slotBookingUrl = (slot, activityName, destName) => {
    if (slot === "evening") return opentableUrl(activityName, destName);
    return viatorUrl(activityName, destName);
  };

  const selectedBride = BRIDE_TYPES.find(b => b.id === bt);
  const selectedDest  = DESTS.find(d => d.id === dest);

  const generate = async () => {
    if (!dest || !bt || !budget) return;
    setLoading(true); setResult(null);
    const d = selectedDest;
    const b = selectedBride;
    try {
      if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === "YOUR_API_KEY_HERE") {
        setResult({ title:"API Key Missing 🔑", tagline:"Almost there!", brideMessage:"Add your Anthropic API key to unlock AI itineraries. Go to console.anthropic.com to get your free key.", days:[], mustPack:["1. Go to console.anthropic.com","2. Create an API key","3. Paste it into src/constants/api.js"], proTip:"Once your key is added, AI will generate a fully personalized itinerary based on your bride's personality!", estimatedBudget:"Free to start" });
        setLoading(false); return;
      }
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1200,
          messages: [{ role:"user", content:
            `Create a ${days}-day bachelorette itinerary for ${groupSize} ladies in ${d.name}.\n\nBRIDE TYPE: ${b.label} — ${b.desc}\nVIBE: ${b.vibe}\nACTIVITIES TO INCLUDE: ${b.activities}\nDESTINATION VIBE: ${d.vibe}\nBUDGET: ${budgetLabel} per person (${activeBudget?.label||"moderate"} tier — ${activeBudget?.desc||""})\n\nIMPORTANT: All activity costs MUST fit within the ${budgetLabel} per-person budget. Tailor EVERYTHING to this exact bride personality and budget. JSON only (no fences):\n{"title":"fun title matching personality","tagline":"one punchy vibe line","brideMessage":"personal hype message to the bride 1-2 sentences","days":[{"day":1,"theme":"day theme","morning":{"activity":"name","tip":"tip","cost":"$XX/person","bookingTip":"how to book this"},"afternoon":{"activity":"name","tip":"tip","cost":"$XX/person","bookingTip":"how to book"},"evening":{"activity":"name","tip":"tip","cost":"$XX/person","bookingTip":"how to book"},"nightlife":{"activity":"name","tip":"tip","cost":"$XX/person","bookingTip":"how to book"}}],"mustPack":["3 items for this bride type"],"proTip":"amazing tip for this personality+destination","estimatedBudget":"$XXX–$XXX per person total"}`
          }]
        })
      });
      const data = await res.json();
      // Surface the real Anthropic error if the request failed
      if (!res.ok) {
        const errMsg = data?.error?.message || `HTTP ${res.status}`;
        const errType = data?.error?.type || "api_error";
        const isAuthErr = errType.includes("auth") || res.status === 401;
        const isBilling = errType.includes("billing") || errMsg.includes("credit");
        setResult({
          title: isAuthErr ? "Invalid API Key 🔑" : isBilling ? "Billing Issue 💳" : "API Error ⚠️",
          tagline: errMsg,
          brideMessage: isAuthErr
            ? "Your Anthropic API key is invalid or not set in Vercel. Go to Vercel → Settings → Environment Variables and confirm VITE_ANTHROPIC_KEY is correct."
            : isBilling
            ? "Your Anthropic account needs a billing method. Go to console.anthropic.com → Billing to add a card."
            : `The API returned an error: ${errMsg}`,
          days: [],
          mustPack: [
            "1. Go to console.anthropic.com → API Keys",
            "2. Make sure your key starts with sk-ant-",
            "3. In Vercel: Settings → Environment Variables → VITE_ANTHROPIC_KEY",
            "4. Redeploy after saving the key",
          ],
          proTip: `Error type: ${errType}`,
          estimatedBudget: "",
        });
        setLoading(false); return;
      }
      setResult(JSON.parse(data.content.map(i=>i.text||"").join("").replace(/```json|```/g,"").trim()));
    } catch(err) {
      console.error("AI error:", err);
      setResult({ title:"Connection Error 📡", tagline:"Could not reach the AI.", brideMessage:`Error: ${err.message}. This is usually a network issue or an invalid API key. Check Vercel → Settings → Environment Variables → VITE_ANTHROPIC_KEY.`, days:[], mustPack:["✓ Confirm VITE_ANTHROPIC_KEY is set in Vercel","✓ Key must start with sk-ant-","✓ Redeploy after adding/changing the key"], proTip:`Raw error: ${err.message}`, estimatedBudget:"" });
    }
    setLoading(false);
  };

  return (
    <div>

      {/* ── HERO ── */}
      <div style={{
        borderRadius:22, padding:"22px 18px",
        background:`linear-gradient(135deg,${SOFT} 0%,${MID} 100%)`,
        border:`1.5px solid ${MID}`, marginBottom:16, textAlign:"center",
      }}>
        <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>
          Bach Hotline
        </div>
        <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:22,fontWeight:900,margin:"0 0 6px",color:DARK}}>
          <em style={{color:HOT,fontStyle:"italic"}}>Build Your Itinerary</em>
        </h2>
        <p style={{fontSize:12,color:HOT,fontFamily:"'DM Sans',sans-serif",margin:0,opacity:0.85}}>
          Answer 4 questions, get a custom itinerary in seconds
        </p>
      </div>

      {/* ── GROUP SIZE ── */}
      <div style={{...C, marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:14,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>👯 Your Bride Tribe</div>
          <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginTop:2,opacity:0.8}}>Budget & splits auto-calculate for your group</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setGroupSize&&setGroupSize(Math.max(2,groupSize-1))} style={SM}>−</button>
          <span style={{fontWeight:900,color:PUNCH,fontSize:22,minWidth:28,textAlign:"center",fontFamily:"'Playfair Display',Georgia,serif"}}>{groupSize}</span>
          <button onClick={()=>setGroupSize&&setGroupSize(groupSize+1)} style={SM}>+</button>
        </div>
      </div>

      {/* ── STEP 1: Bride personality ── */}
      <div style={{...C, marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{width:26,height:26,borderRadius:"50%",background:bt?`linear-gradient(135deg,${HOT},${PUNCH})`:`linear-gradient(135deg,${MID},${SOFT})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:bt?WHITE:HOT,flexShrink:0}}>1</div>
          <div>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>What kind of bride is she?</div>
            <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.8}}>Every personality gets a completely different itinerary ✨</div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {BRIDE_TYPES.map(b=>(
            <button key={b.id} onClick={()=>setBt(b.id)} style={{
              background:bt===b.id?b.bg:WHITE,
              border:bt===b.id?`2px solid ${b.color}`:`1.5px solid ${BORDER}`,
              borderRadius:14,padding:"12px 10px",cursor:"pointer",textAlign:"left",
              transition:"all 0.2s",
              boxShadow:bt===b.id?`0 3px 12px ${b.color}33`:"none",
            }}>
              <div style={{fontSize:24,marginBottom:5}}>{b.emoji}</div>
              <div style={{fontSize:12,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:bt===b.id?b.color:DARK}}>{b.label}</div>
              <div style={{fontSize:10,color:"#888",fontFamily:"'DM Sans',sans-serif",marginTop:3,lineHeight:1.3}}>{b.desc}</div>
            </button>
          ))}
        </div>

        {selectedBride && (
          <div style={{marginTop:12,padding:"10px 12px",borderRadius:12,background:selectedBride.bg,border:`1.5px solid ${selectedBride.border||selectedBride.color}`}}>
            <div style={{fontSize:11,fontWeight:700,color:selectedBride.color,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1}}>Planning for: {selectedBride.label}</div>
            <div style={{fontSize:11,color:"#555",fontFamily:"'DM Sans',sans-serif",marginTop:4}}>Activities: <em>{selectedBride.activities}</em></div>
          </div>
        )}
      </div>

      {/* ── STEP 2: Destination — reveals after bride type picked ── */}
      {bt && (
        <div style={{...C, marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:dest?`linear-gradient(135deg,${HOT},${PUNCH})`:`linear-gradient(135deg,${MID},${SOFT})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:dest?WHITE:HOT,flexShrink:0}}>2</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>Where are you going?</div>
              <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.8}}>Select your destination</div>
            </div>
          </div>

          {/* Region dropdown */}
          <select
            value={region}
            onChange={e=>{setRegion(e.target.value);setDest(null);}}
            style={{width:"100%",marginBottom:10,padding:"10px 12px",borderRadius:10,border:`1.5px solid ${BORDER}`,fontFamily:"'DM Sans',sans-serif",fontSize:13,color:DARK,background:WHITE,appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23e66582' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center",cursor:"pointer"}}
          >
            <option value="us">🇺🇸 United States</option>
            <option value="intl">✈️ International</option>
          </select>

          {/* City dropdown */}
          <select
            value={dest||""}
            onChange={e=>setDest(e.target.value||null)}
            style={{width:"100%",padding:"10px 12px",borderRadius:10,border:dest?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,fontFamily:"'DM Sans',sans-serif",fontSize:13,color:dest?HOT:DARK,background:dest?SOFT:WHITE,appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23e66582' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center",cursor:"pointer"}}
          >
            <option value="">Choose a city…</option>
            {DESTS.filter(d => region==="us" ? !d.international : d.international).map(d=>(
              <option key={d.id} value={d.id}>{d.emoji} {d.name} — {d.vibe}</option>
            ))}
          </select>

          {/* Vibe hint after selection */}
          {dest && selectedDest && (
            <div style={{marginTop:10,padding:"8px 12px",borderRadius:10,background:SOFT,border:`1px solid ${MID}`,fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif"}}>
              {selectedDest.emoji} <strong>{selectedDest.name}</strong> — {selectedDest.vibe}
              {selectedDest.trend && <span style={{color:"#bbb",marginLeft:6}}>{selectedDest.trend}</span>}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: Budget — reveals after destination picked ── */}
      {bt && dest && (
        <div style={{...C, marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:budget?`linear-gradient(135deg,${HOT},${PUNCH})`:`linear-gradient(135deg,${MID},${SOFT})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:budget?WHITE:HOT,flexShrink:0}}>3</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>What's your budget?</div>
              <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.8}}>Per person — AI will tailor costs to fit</div>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            {BUDGET_TIERS.map(tier=>(
              <button key={tier.id} onClick={()=>setBudget(tier.id)} style={{
                background:budget===tier.id?`${tier.color}18`:WHITE,
                border:budget===tier.id?`2px solid ${tier.color}`:`1.5px solid ${BORDER}`,
                borderRadius:14,padding:"12px 10px",cursor:"pointer",textAlign:"left",
                transition:"all 0.2s",
                boxShadow:budget===tier.id?`0 3px 12px ${tier.color}33`:"none",
              }}>
                <div style={{fontSize:20,marginBottom:4}}>{tier.emoji}</div>
                <div style={{fontSize:12,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:budget===tier.id?tier.color:DARK}}>{tier.label}</div>
                <div style={{fontSize:11,fontWeight:700,color:budget===tier.id?tier.color:PUNCH,fontFamily:"'DM Sans',sans-serif",marginTop:1}}>{tier.range}</div>
                <div style={{fontSize:10,color:"#888",fontFamily:"'DM Sans',sans-serif",marginTop:2,lineHeight:1.3}}>{tier.desc}</div>
              </button>
            ))}
          </div>

          {/* Custom budget input */}
          {budget === "custom" && (
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:SOFT,borderRadius:12,border:`1.5px solid ${MID}`}}>
              <span style={{fontSize:16}}>💵</span>
              <span style={{fontSize:13,fontWeight:700,color:DARK,fontFamily:"'DM Sans',sans-serif"}}>$</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={customBudget}
                onChange={e=>setCustomBudget(e.target.value)}
                style={{flex:1,border:"none",background:"transparent",fontSize:14,fontWeight:700,color:DARK,fontFamily:"'DM Sans',sans-serif",outline:"none"}}
              />
              <span style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif"}}>per person</span>
            </div>
          )}

          {/* Selected summary */}
          {budget && (budget !== "custom" || customBudget) && (
            <div style={{marginTop:10,padding:"8px 12px",borderRadius:10,background:SOFT,border:`1px solid ${MID}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:HOT,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1}}>Budget: {activeBudget?.label}</div>
                <div style={{fontSize:13,fontWeight:900,color:PUNCH,fontFamily:"'DM Sans',sans-serif"}}>{budgetLabel} · {groupSize} ladies</div>
              </div>
              {budget !== "custom" && (
                <div style={{fontSize:11,color:"#888",fontFamily:"'DM Sans',sans-serif",textAlign:"right"}}>
                  Total est.<br/>
                  <span style={{fontWeight:700,color:DARK}}>
                    ${(parseInt(activeBudget?.range?.replace(/[^0-9–-]/g,'').split(/[–-]/)[0]||0)*groupSize).toLocaleString()}+
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 4: Days — reveals after budget picked ── */}
      {bt && dest && budget && (budget !== "custom" || customBudget) && (
        <div style={{...C, marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:`linear-gradient(135deg,${HOT},${PUNCH})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:WHITE,flexShrink:0}}>4</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>How many days?</div>
              <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",opacity:0.8}}>Up to 5 days</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {[1,2,3,4,5].map(d=>(
              <button key={d} onClick={()=>setDays(d)} style={{
                flex:1,padding:"13px 0",borderRadius:12,
                border:days===d?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,
                background:days===d?HOT:WHITE,
                color:days===d?WHITE:DARK,
                fontWeight:700,fontSize:16,
                fontFamily:"'DM Sans',sans-serif",
                cursor:"pointer",transition:"all 0.15s",
                boxShadow:days===d?`0 2px 10px rgba(230,101,130,0.3)`:"none",
              }}>{d}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── GENERATE BUTTON ── */}
      {bt && dest && budget && (budget !== "custom" || customBudget) && (
        <button onClick={generate} disabled={loading} style={{
          ...BP, width:"100%", padding:"14px", fontSize:14, borderRadius:14, marginBottom:16,
        }}>
          {loading
            ? `✨ Planning the perfect ${selectedBride?.label||""} trip...`
            : `Generate My ${days}-Day ${selectedDest?.name||""} Itinerary`}
        </button>
      )}

      {/* Hint when steps incomplete */}
      {(!bt || !dest || !budget || (budget === "custom" && !customBudget)) && (
        <div style={{textAlign:"center",fontSize:12,color:"#bbb",fontFamily:"'DM Sans',sans-serif",marginBottom:16}}>
          {!bt ? "👆 Start by picking the bride's personality"
            : !dest ? "👆 Now choose your destination"
            : !budget || (budget === "custom" && !customBudget) ? "👆 Set your per-person budget"
            : ""}
        </div>
      )}

      {/* ── LOADING ── */}
      {loading && (
        <div style={{textAlign:"center",padding:"32px"}}>
          <div style={{fontSize:14,color:HOT,fontFamily:"'DM Sans',sans-serif",fontWeight:700,marginBottom:6}}>
            Creating the perfect {selectedBride?.label} trip...
          </div>
          <div style={{fontSize:12,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>Tailoring every detail to her vibe ✨</div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {result?.days?.length > 0 && (
        <div>
          {/* Result hero */}
          <div style={{borderRadius:18,padding:"20px 18px",marginBottom:14,background:selectedBride?.bg||SOFT,border:`1.5px solid ${selectedBride?.border||MID}`}}>
            <div style={{fontSize:19,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{result.title}</div>
            <div style={{fontSize:13,color:selectedBride?.color||HOT,fontFamily:"'DM Sans',sans-serif",marginTop:5}}>{result.tagline}</div>
            {result.brideMessage && (
              <div style={{marginTop:12,padding:"10px 12px",background:WHITE,borderRadius:10,border:`1px solid ${selectedBride?.border||MID}`}}>
                <div style={{fontSize:10,color:selectedBride?.color||HOT,fontFamily:"'DM Sans',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>💌 Message to the bride</div>
                <div style={{fontSize:13,color:DARK,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic",lineHeight:1.5}}>"{result.brideMessage}"</div>
              </div>
            )}
            <div style={{display:"flex",gap:16,marginTop:12,fontFamily:"'DM Sans',sans-serif",fontSize:12,flexWrap:"wrap"}}>
              <span><span style={{color:"#bbb"}}>Group: </span><span style={{color:PUNCH,fontWeight:700}}>{groupSize} ladies</span></span>
              <span><span style={{color:"#bbb"}}>Days: </span><span style={{color:PUNCH,fontWeight:700}}>{days}</span></span>
              {result.estimatedBudget && <span><span style={{color:"#bbb"}}>Budget: </span><span style={{color:selectedBride?.color||HOT,fontWeight:700}}>{result.estimatedBudget}</span></span>}
            </div>
          </div>

          {/* Day cards */}
          {result.days.map((day,di)=>(
            <div key={di} style={{...C,marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${HOT},${PUNCH})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",color:WHITE,flexShrink:0}}>D{day.day}</div>
                <div style={{fontSize:15,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{day.theme}</div>
              </div>
              {["morning","afternoon","evening","nightlife"].map(slot=>{
                const item = day[slot]; if (!item) return null;
                return (
                  <div key={slot} style={{marginBottom:12,paddingBottom:12,borderBottom:slot!=="nightlife"?`1px solid ${SOFT}`:"none"}}>
                    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{fontSize:16,flexShrink:0,marginTop:2}}>{tEmoji[slot]}</div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                          <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{item.activity}</div>
                          <div style={{fontSize:12,color:PUNCH,fontFamily:"'DM Sans',sans-serif",fontWeight:700,flexShrink:0,marginLeft:8}}>{item.cost}</div>
                        </div>
                        <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginTop:3,fontStyle:"italic",opacity:0.8}}>💡 {item.tip}</div>
                        {item.bookingTip && <div style={{fontSize:10,color:"#888",fontFamily:"'DM Sans',sans-serif",marginTop:5,background:"#fdf5fa",border:`1px solid ${BORDER}`,borderRadius:8,padding:"4px 9px",display:"inline-block"}}>🔗 {item.bookingTip}</div>}
                        <div style={{marginTop:8}}>
                          <a href={slotBookingUrl(slot, item.activity, selectedDest?.name||"")} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                            <button style={{background:`linear-gradient(135deg,${HOT},${PUNCH})`,color:WHITE,border:"none",borderRadius:20,padding:"5px 14px",fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                              {slot==="evening"?"🍽 Reserve →":"🎯 Book →"}
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Must pack */}
          {result.mustPack?.length > 0 && (
            <div style={{...C,marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:10}}>Must-Pack for the {selectedBride?.label}</div>
              {result.mustPack.map((item,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:6,fontFamily:"'DM Sans',sans-serif",fontSize:12}}>
                  <span style={{color:selectedBride?.color||HOT}}>✦</span>
                  <span style={{color:DARK,opacity:0.85}}>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pro tip */}
          {result.proTip && (
            <div style={{padding:"14px 16px",borderRadius:14,background:selectedBride?.bg||SOFT,border:`1.5px solid ${selectedBride?.border||MID}`,marginBottom:14}}>
              <div style={{fontSize:10,color:selectedBride?.color||PUNCH,fontFamily:"'DM Sans',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>✨ Pro Tip</div>
              <div style={{fontSize:13,color:DARK,fontFamily:"'DM Sans',sans-serif",lineHeight:1.55}}>{result.proTip}</div>
            </div>
          )}

          {/* Book Your Full Trip */}
          <div style={{...C,background:SOFT,border:`1.5px solid ${MID}`,marginBottom:14}}>
            <div style={{fontSize:15,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>🗓 Book Your Full Trip</div>
            <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginBottom:14,opacity:0.85}}>Tap any activity to book — she just has to show up 💅</div>

            {/* Activity-by-activity checklist */}
            {result.days.map((day,di)=>(
              <div key={di} style={{marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:PUNCH,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Day {day.day} — {day.theme}</div>
                {["morning","afternoon","evening","nightlife"].map(slot=>{
                  const item = day[slot]; if (!item) return null;
                  return (
                    <div key={slot} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:6,padding:"8px 10px",background:WHITE,borderRadius:10,border:`1px solid ${BORDER}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
                        <span style={{fontSize:14,flexShrink:0}}>{tEmoji[slot]}</span>
                        <div style={{minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:700,color:DARK,fontFamily:"'DM Sans',sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.activity}</div>
                          <div style={{fontSize:10,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>{item.cost}</div>
                        </div>
                      </div>
                      <a href={slotBookingUrl(slot, item.activity, selectedDest?.name||"")} target="_blank" rel="noreferrer" style={{textDecoration:"none",flexShrink:0}}>
                        <button style={{background:`linear-gradient(135deg,${HOT},${PUNCH})`,color:WHITE,border:"none",borderRadius:20,padding:"6px 14px",fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                          {slot==="evening"?"🍽 Reserve":"🎯 Book"}
                        </button>
                      </a>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Divider */}
            <div style={{height:1,background:MID,margin:"14px 0"}}/>

            {/* Flights + Hotel always at bottom */}
            <div style={{fontSize:11,fontWeight:700,color:HOT,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Flights & Hotel</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <a href={flightUrl(selectedDest?.toFull||"",groupSize)} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                <button style={{...BP,width:"100%",fontSize:13,padding:"11px"}}>✈️ Search Flights on Expedia</button>
              </a>
              <a href={airbnbUrl(selectedDest?.name||"",groupSize)} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                <button style={{width:"100%",background:"linear-gradient(135deg,#FF5A5F,#FF3D42)",color:WHITE,border:"none",borderRadius:50,padding:"11px",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,cursor:"pointer"}}>🏠 Search Airbnbs for {groupSize} ladies</button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Result with no days (error/missing key) */}
      {result && result.days?.length === 0 && (
        <div style={{...C,marginBottom:12}}>
          <div style={{fontSize:15,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:6}}>{result.title}</div>
          <div style={{fontSize:12,color:HOT,fontFamily:"'DM Sans',sans-serif",marginBottom:12}}>{result.tagline}</div>
          <div style={{fontSize:13,color:DARK,fontFamily:"'DM Sans',sans-serif",lineHeight:1.55,marginBottom:12}}>{result.brideMessage}</div>
          {result.mustPack?.map((item,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:8,fontFamily:"'DM Sans',sans-serif",fontSize:12,padding:"8px 10px",background:SOFT,borderRadius:8}}>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
      {/* ── PLANNING TOOLS ── */}
      <div style={{marginTop:24}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <div style={{flex:1,height:1.5,background:MID,borderRadius:2}}/>
          <div style={{fontSize:11,fontWeight:700,color:HOT,fontFamily:"'DM Sans',sans-serif",letterSpacing:"1.5px",textTransform:"uppercase",whiteSpace:"nowrap"}}>Planning Tools</div>
          <div style={{flex:1,height:1.5,background:MID,borderRadius:2}}/>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[
            { icon:"🧾", label:"Split the Bill",     sub:`Divide costs fairly — bride pays nothing · ${groupSize} people`,   tab:"split"  },
            { icon:"💰", label:"Budget Calculator",   sub:`Estimate your full trip cost for ${groupSize} ladies`,             tab:"budget" },
            { icon:"🗳️", label:"Group Polls",         sub:"Vote on destinations, activities & more",                          tab:"polls"  },
          ].map(tool=>(
            <button key={tool.tab} onClick={()=>setTab&&setTab(tool.tab)} style={{
              ...C, display:"flex", alignItems:"center", gap:14,
              cursor:"pointer", textAlign:"left", width:"100%",
            }}>
              <span style={{fontSize:26}}>{tool.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{tool.label}</div>
                <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginTop:2,opacity:0.75}}>{tool.sub}</div>
              </div>
              <span style={{color:HOT,fontSize:20}}>›</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
