import React, { useState } from 'react';
import { WHITE, SOFT, HOT, PUNCH, DARK, BORDER, MID } from '../constants/colors.js';
import { BP, BS, IN } from '../constants/styles.js';

// LOGO_SRC is imported from App.jsx shell via prop to avoid duplicating the large base64 string
export default function AuthScreen({ onLogin, LOGO_SRC }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("moh");
  const ROLES = [{ id:"moh",icon:"💍",label:"Maid of Honor" },{ id:"bride",icon:"👰",label:"The Bride" },{ id:"guest",icon:"👯",label:"Bride Tribe" }];
  const submit = () => {
    const av = { bride:"👰", moh:"💍", guest:"👯" };
    onLogin({ id:Date.now(), name:mode==="signup"?name:(email.split("@")[0]||"Babe"), email, role, avatar:av[role], joinedDate:new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"}) });
  };
  return (
    <div style={{ minHeight:"100vh", background:WHITE, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 20px" }}>
      <div style={{ width:"100%", maxWidth:360 }}>
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <img src={LOGO_SRC} alt="Bach Hotline" style={{ width:240, height:"auto", objectFit:"contain", display:"block", margin:"0 auto" }} />
          <p style={{ fontSize:13, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", margin:"0 0 0" }}>Say goodbye to weeks of stressful bachelorette planning</p>
        </div>
        <div style={{ display:"flex", background:SOFT, borderRadius:50, padding:4, marginBottom:20, border:`1.5px solid ${BORDER}` }}>
          {["login","signup"].map(m => (
            <button key={m} onClick={()=>setMode(m)} style={{ flex:1, padding:"10px", border:"none", borderRadius:50, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer", background:mode===m?`linear-gradient(135deg,#f472b0,${HOT})`:WHITE, color:mode===m?WHITE:HOT, transition:"all 0.2s" }}>
              {m==="login"?"Sign In":"Create Account"}
            </button>
          ))}
        </div>
        {mode==="signup" && (
          <div style={{ display:"flex", gap:8, marginBottom:16 }}>
            {ROLES.map(r => (
              <button key={r.id} onClick={()=>setRole(r.id)} style={{ flex:1, padding:"10px 6px", border:role===r.id?`2px solid ${HOT}`:`1.5px solid ${BORDER}`, borderRadius:14, background:role===r.id?SOFT:WHITE, cursor:"pointer", color:DARK }}>
                <div style={{ fontSize:22, marginBottom:3 }}>{r.icon}</div>
                <div style={{ fontSize:10, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", color:HOT }}>{r.label}</div>
              </button>
            ))}
          </div>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
          {mode==="signup" && <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name 💕" style={IN} />}
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" style={IN} />
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" style={IN} />
        </div>
        <button onClick={submit} style={{ ...BP, width:"100%", padding:"13px", fontSize:14, borderRadius:14 }}>
          {mode==="login"?"Sign In":"Create Account"}
        </button>
        <button onClick={()=>onLogin({ id:"g", name:"Guest", email:"", role:"guest", avatar:"✨", joinedDate:"" })} style={{ ...BS, width:"100%", marginTop:10, padding:"11px", borderRadius:14, textAlign:"center" }}>
          Continue as Guest →
        </button>
      </div>
    </div>
  );
}
