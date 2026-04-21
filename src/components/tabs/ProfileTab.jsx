import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE, GREEN } from '../../constants/colors.js';
import { C, BP, BS, IN } from '../../constants/styles.js';
import SH from '../ui/SH.jsx';

export default function ProfileTab({ user, onLogout, cart }) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.name);
  const expSaved = (() => { try { return JSON.parse(localStorage.getItem(`bh_exp_saved_${user.id}`) || "[]").length; } catch { return 0; } })();
  const ROLE_MAP = { bride:"👰 The Bride", moh:"💍 Maid of Honor", guest:"👯 Bride Tribe" };
  return (
    <div>
      <div style={{ borderRadius:22, padding:"26px 18px", background:`linear-gradient(135deg,${SOFT},${MID})`, border:`1.5px solid ${MID}`, marginBottom:16, textAlign:"center" }}>
        <div style={{ width:68, height:68, borderRadius:"50%", background:`linear-gradient(135deg,#f472b0,${HOT})`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", boxShadow:`0 6px 22px rgba(213,36,56,0.25)`, border:`3px solid ${WHITE}` }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </div>
        {editing?(<div style={{ display:"flex", gap:8, justifyContent:"center", alignItems:"center", marginBottom:8 }}><input value={displayName} onChange={e=>setDisplayName(e.target.value)} style={{ ...IN, maxWidth:180, padding:"8px 12px", textAlign:"center" }} /><button onClick={()=>setEditing(false)} style={{ ...BP, padding:"8px 14px", fontSize:12 }}>Save</button></div>):(<div style={{ fontSize:20, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:4, color:DARK }}>{displayName} <button onClick={()=>setEditing(true)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:HOT, verticalAlign:"middle" }}>✏️</button></div>)}
        <div style={{ fontSize:13, color:HOT, fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>{ROLE_MAP[user.role]||"✨ Bach Tribe"}</div>
        <div style={{ fontSize:11, color:`rgba(45,10,24,0.5)`, fontFamily:"'Nunito',sans-serif", marginTop:4 }}>{user.email}</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        {[["✈️","Flights Saved","3"],["🏠","Stays Saved","5"],["🛒","Cart Items",String(cart.length)],["🔔","Active Alerts","4"],["🎟️","Experiences Saved",String(expSaved)]].map(([icon,label,val])=>(
          <div key={label} style={{ ...C, textAlign:"center", padding:"14px 10px" }}>
            <div style={{ fontSize:22, marginBottom:4 }}>{icon}</div>
            <div style={{ fontSize:20, fontWeight:900, color:HOT, fontFamily:"'Playfair Display',Georgia,serif" }}>{val}</div>
            <div style={{ fontSize:10, color:"#bbb", fontFamily:"'Nunito',sans-serif" }}>{label}</div>
          </div>
        ))}
      </div>
      <SH title="My Trips 🗺️" />
      {[{ dest:"Nashville",emoji:"🎸",dates:"Jun 14–17",members:8,status:"Planning" },{ dest:"Miami",emoji:"🌴",dates:"Aug 2–5",members:10,status:"Saved" }].map((t,i)=>(
        <div key={i} style={{ ...C, marginBottom:10, display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ fontSize:30 }}>{t.emoji}</div>
          <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{t.dest} Bachelorette</div><div style={{ fontSize:12, color:HOT, fontFamily:"'Nunito',sans-serif", marginTop:2, opacity:0.75 }}>{t.dates} · {t.members} ladies</div></div>
          <div style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, background:t.status==="Planning"?`rgba(46,125,50,0.1)`:SOFT, color:t.status==="Planning"?GREEN:HOT, border:`1px solid ${t.status==="Planning"?"rgba(46,125,50,0.25)":MID}`, fontFamily:"'Nunito',sans-serif" }}>{t.status}</div>
        </div>
      ))}
      <SH title="Settings ⚙️" sub={null} />
      {[["🔔","Deal Alerts","Flights, Airbnb & Vrbo price drops",true,true],["📧","Email Updates","Weekly destination deals",true,false],["💳","Payment Methods","Add cards for fast checkout",false,false],["🔒","Privacy","Manage your data",false,false]].map(([icon,label,sub,hasToggle,isOn])=>(
        <div key={label} style={{ ...C, marginBottom:8, display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}>
          <span style={{ fontSize:20 }}>{icon}</span>
          <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600, fontFamily:"'Nunito',sans-serif", color:DARK }}>{label}</div><div style={{ fontSize:11, color:"#bbb", fontFamily:"'Nunito',sans-serif" }}>{sub}</div></div>
          {hasToggle?(<div style={{ width:40, height:22, borderRadius:50, background:isOn?HOT:SOFT, border:`1.5px solid ${isOn?HOT:MID}`, display:"flex", alignItems:"center", padding:2, cursor:"pointer" }}><div style={{ width:17, height:17, borderRadius:"50%", background:WHITE, marginLeft:isOn?17:0, transition:"margin 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.15)" }} /></div>):<span style={{ color:HOT, fontSize:18 }}>›</span>}
        </div>
      ))}
      <button onClick={onLogout} style={{ ...BS, width:"100%", marginTop:20, padding:"13px", fontSize:14, color:PUNCH, border:`1.5px solid rgba(213,36,56,0.3)`, background:`rgba(213,36,56,0.06)` }}>Sign Out</button>
    </div>
  );
}
