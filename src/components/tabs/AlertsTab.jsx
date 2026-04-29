import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE, GREEN } from '../../constants/colors.js';
import { C, BP, BS, IN } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

const ALERT_TYPES = [
  { id:"flight",   icon:"", label:"Flight"        },
  { id:"stay",     icon:"", label:"Stay"          },
  { id:"car",      icon:"", label:"Car Rental"    },
  { id:"activity", icon:"", label:"Activity"      },
];

function AccountGate({ onSignUp }) {
  return (
    <div style={{textAlign:"center", padding:"48px 24px"}}>
      <div style={{fontSize:52, marginBottom:16}}></div>
      <h2 style={{fontFamily:"'Playfair Display',Georgia,serif", fontSize:22, fontWeight:700, color:HOT, margin:"0 0 10px"}}>
        Members-Only Deals
      </h2>
      <p style={{fontSize:13, color:"#888", fontFamily:"'Nunito',sans-serif", lineHeight:1.7, marginBottom:10}}>
        Create a free account to unlock exclusive deal alerts for your bachelorette trip.
      </p>

      {/* Deal type preview */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:28, textAlign:"left"}}>
        {[
          { icon:"", label:"Flight Deals",    desc:"Alerts when fares drop for your destination" },
          { icon:"", label:"Stay Deals",       desc:"Airbnb & hotel price drops for your dates"   },
          { icon:"", label:"Car Rental Deals", desc:"Turo & rental alerts for group pickups"       },
          { icon:"", label:"Activity Deals",   desc:"Discounts on tours, spas & experiences"      },
        ].map(d => (
          <div key={d.icon} style={{background:SOFT, border:`1px solid ${MID}`, borderRadius:14, padding:"12px 12px"}}>
            <div style={{fontSize:22, marginBottom:6}}>{d.icon}</div>
            <div style={{fontSize:12, fontWeight:700, color:DARK, fontFamily:"'Nunito',sans-serif"}}>{d.label}</div>
            <div style={{fontSize:10, color:"#aaa", fontFamily:"'Nunito',sans-serif", marginTop:3, lineHeight:1.4}}>{d.desc}</div>
          </div>
        ))}
      </div>

      <button onClick={onSignUp} style={{
        background:`linear-gradient(135deg,#f472b0,${HOT})`, color:WHITE, border:"none",
        borderRadius:50, padding:"13px 32px", fontFamily:"'Nunito',sans-serif",
        fontSize:14, fontWeight:700, cursor:"pointer", width:"100%", maxWidth:300,
      }}>
        Create Free Account
      </button>
      <p style={{fontSize:11, color:"#bbb", fontFamily:"'Nunito',sans-serif", marginTop:14}}>
        Already have an account? Sign in from the home screen.
      </p>
    </div>
  );
}

export default function AlertsTab({ user, onSignUp }) {
  if (!user || user.id === "g") return <AccountGate onSignUp={onSignUp} />;

  const [alerts, setAlerts] = useState([
    { id:1, label:"NYC → Nashville flights under $75",     current:67,  threshold:75,  triggered:true,  active:true, icon:"" },
    { id:2, label:"Nashville Airbnb under $300/night",      current:280, threshold:300, triggered:true,  active:true, icon:"" },
    { id:3, label:"Turo car rental in Nashville under $80", current:95,  threshold:80,  triggered:false, active:true, icon:"" },
    { id:4, label:"Nashville spa activity under $120",      current:140, threshold:120, triggered:false, active:true, icon:"" },
  ]);
  const [showNew, setShowNew] = useState(false);
  const [newA, setNewA] = useState({ type:"flight", dest:"Nashville", threshold:"" });
  const [notif, setNotif] = useState(false);

  const toggle   = id => setAlerts(p => p.map(a => a.id===id ? {...a, active:!a.active} : a));
  const addAlert = () => {
    if (!newA.threshold) return;
    const typeInfo = ALERT_TYPES.find(t => t.id === newA.type);
    setAlerts(p => [...p, {
      id: Date.now(),
      label: `${newA.dest} ${typeInfo?.label||newA.type} under $${newA.threshold}`,
      current: 999, threshold: parseFloat(newA.threshold),
      triggered: false, active: true, icon: typeInfo?.icon || "",
    }]);
    setNewA({ type:"flight", dest:"Nashville", threshold:"" });
    setShowNew(false);
  };

  const triggered = alerts.filter(a => a.triggered && a.active);
  const watching  = alerts.filter(a => !a.triggered && a.active);

  return (
    <div>
      <SH title="Deal Alerts" sub="Members-only price drops on flights, stays, cars & activities" />

      {/* Enable notifications banner */}
      {!notif && (
        <div style={{...C, marginBottom:14, background:SOFT, border:`1.5px solid ${MID}`}}>
          <div style={{fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6}}> Enable Push Notifications</div>
          <div style={{fontSize:12, color:DARK, fontFamily:"'Nunito',sans-serif", opacity:0.75, marginBottom:12}}>Turn on alerts so we ping you the moment a deal drops!</div>
          <button onClick={()=>setNotif(true)} style={{...BP, width:"100%", padding:"11px", fontSize:13}}>Enable Deal Alerts</button>
        </div>
      )}
      {notif && (
        <div style={{padding:"10px 14px", borderRadius:12, background:"rgba(46,125,50,0.08)", border:"1px solid rgba(46,125,50,0.25)", marginBottom:14, fontFamily:"'Nunito',sans-serif", fontSize:13, color:GREEN}}>
           Push notifications enabled!
        </div>
      )}

      {/* Triggered deals */}
      {triggered.length > 0 && (
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11, fontWeight:700, color:PUNCH, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:10}}> DEALS FOUND — Act Fast!</div>
          {triggered.map(a => (
            <div key={a.id} style={{...C, marginBottom:10, background:"rgba(46,125,50,0.05)", border:"2px solid rgba(46,125,50,0.3)", position:"relative"}}>
              <div style={{position:"absolute", top:14, right:14, width:9, height:9, borderRadius:"50%", background:GREEN}}/>
              <div style={{display:"flex", alignItems:"center", gap:12}}>
                <div style={{fontSize:28}}>{a.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK}}>{a.label}</div>
                  <div style={{display:"flex", gap:12, marginTop:5, fontFamily:"'Nunito',sans-serif", fontSize:11}}>
                    <span style={{color:HOT}}>Target: ${a.threshold}</span>
                    <span style={{color:GREEN, fontWeight:700}}>Now: ${a.current} · Saving ${a.threshold - a.current}!</span>
                  </div>
                </div>
              </div>
              <button style={{...BP, width:"100%", marginTop:12, fontSize:12, padding:"9px", background:`linear-gradient(135deg,${GREEN},#1b5e20)`, boxShadow:"none"}}>
                 Book Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Watching */}
      {watching.length > 0 && (
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:10}}> Watching</div>
          {watching.map(a => (
            <div key={a.id} style={{...C, marginBottom:8}}>
              <div style={{display:"flex", alignItems:"center", gap:12}}>
                <div style={{fontSize:26}}>{a.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK}}>{a.label}</div>
                  <div style={{fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif", marginTop:3, opacity:0.75}}>
                    Now: <span style={{color:PUNCH}}>${a.current}</span> · Target: ${a.threshold}
                  </div>
                  <div style={{marginTop:6, height:4, background:SOFT, borderRadius:2}}>
                    <div style={{height:"100%", width:`${Math.min(100,(a.threshold/a.current)*100)}%`, background:`linear-gradient(90deg,${HOT},${PUNCH})`, borderRadius:2}}/>
                  </div>
                </div>
                <button onClick={()=>toggle(a.id)} style={{background:"none", border:"none", cursor:"pointer", color:HOT, fontSize:18}}></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New alert form */}
      {showNew ? (
        <div style={{...C, border:`1.5px solid ${HOT}`}}>
          <div style={{fontSize:14, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:12}}> New Alert</div>

          {/* Type selector */}
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:12}}>
            {ALERT_TYPES.map(t => (
              <button key={t.id} onClick={()=>setNewA(p=>({...p, type:t.id}))} style={{
                padding:"10px 6px", border:newA.type===t.id?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,
                borderRadius:12, background:newA.type===t.id?SOFT:WHITE, cursor:"pointer",
                color:DARK, fontFamily:"'Nunito',sans-serif", fontSize:11, fontWeight:600,
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <select value={newA.dest} onChange={e=>setNewA(p=>({...p,dest:e.target.value}))} style={{...IN, marginBottom:10}}>
            {DESTS.map(d => <option key={d.id} value={d.name}>{d.emoji} {d.name}</option>)}
          </select>
          <input
            type="number"
            value={newA.threshold}
            onChange={e=>setNewA(p=>({...p, threshold:e.target.value}))}
            placeholder="Alert me when under $..."
            style={{...IN, marginBottom:12}}
          />
          <div style={{display:"flex", gap:8}}>
            <button onClick={()=>setShowNew(false)} style={{...BS, flex:1}}>Cancel</button>
            <button onClick={addAlert} style={{...BP, flex:2}}> Create Alert</button>
          </div>
        </div>
      ) : (
        <button onClick={()=>setShowNew(true)} style={{...BP, width:"100%", padding:"13px", fontSize:14}}>
          + Set a Deal Alert
        </button>
      )}
    </div>
  );
}
