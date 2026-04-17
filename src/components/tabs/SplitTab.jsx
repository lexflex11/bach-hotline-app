import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE, GOLD, GREEN } from '../../constants/colors.js';
import { C, BP, BS, IN } from '../../constants/styles.js';
import SH from '../ui/SH.jsx';

function AccountGate({ onSignUp }) {
  return (
    <div style={{textAlign:"center",padding:"48px 24px"}}>
      <div style={{fontSize:48,marginBottom:16}}>🧾</div>
      <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:22,fontWeight:700,color:HOT,margin:"0 0 10px"}}>Members Only</h2>
      <p style={{fontSize:13,color:"#888",fontFamily:"'Nunito',sans-serif",lineHeight:1.6,marginBottom:28}}>
        Split the Bill is for the bride tribe only.<br/>Create a free account to access this feature.
      </p>
      <button onClick={onSignUp} style={{background:`linear-gradient(135deg,#E91E8C,#FF4081)`,color:"#fff",border:"none",borderRadius:50,padding:"13px 32px",fontFamily:"'Nunito',sans-serif",fontSize:14,fontWeight:700,cursor:"pointer",width:"100%",maxWidth:280}}>
        Create Free Account
      </button>
      <p style={{fontSize:11,color:"#bbb",fontFamily:"'Nunito',sans-serif",marginTop:14}}>Already have an account? Sign in from the home screen.</p>
    </div>
  );
}

export default function SplitTab({ groupSize, user, onSignUp }) {
  if (!user || user.id === "g") return <AccountGate onSignUp={onSignUp} />;
  const [members, setMembers] = useState([
    { id:1, name:"Sarah (Bride)", paid:true  },
    { id:2, name:"Jessica (MOH)", paid:true  },
    { id:3, name:"Taylor",        paid:false },
    { id:4, name:"Morgan",        paid:true  },
    { id:5, name:"Ashley",        paid:false },
  ]);
  const [expenses] = useState([
    { id:1, name:"Airbnb — 3 nights", amount:840, cat:"🏠" },
    { id:2, name:"Flights (avg)",      amount:536, cat:"✈️" },
    { id:3, name:"Bottomless Brunch",  amount:320, cat:"🥂" },
    { id:4, name:"Pole Dance Class",   amount:180, cat:"💃" },
    { id:5, name:"Party Supplies",     amount:95,  cat:"🎀" },
  ]);
  const [view, setView] = useState("summary");
  const [newMember, setNewMember] = useState("");
  const total = expenses.reduce((s,e) => s+e.amount, 0);
  const nonBride = members.filter(m => !m.name.includes("Bride"));
  const perPerson = nonBride.length > 0 ? total/nonBride.length : 0;
  const toggle = id => setMembers(p => p.map(m => m.id===id ? {...m,paid:!m.paid} : m));
  const addMember = () => { if (!newMember.trim()) return; setMembers(p => [...p, { id:Date.now(), name:newMember.trim(), paid:false }]); setNewMember(""); };
  return (
    <div>
      <SH title="Split the Bill" sub="Who owes what — the bride pays nothing!" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
        <div style={{ ...C, textAlign:"center" }}><div style={{ fontSize:10, color:HOT, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>Total Trip</div><div style={{ fontSize:26, fontWeight:900, color:PUNCH, fontFamily:"'Playfair Display',Georgia,serif" }}>${total.toFixed(0)}</div></div>
        <div style={{ ...C, textAlign:"center" }}><div style={{ fontSize:10, color:HOT, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>Per Person</div><div style={{ fontSize:26, fontWeight:900, color:HOT, fontFamily:"'Playfair Display',Georgia,serif" }}>${perPerson.toFixed(0)}</div></div>
      </div>
      <div style={{ background:SOFT, border:`1.5px solid ${MID}`, borderRadius:12, padding:"11px 14px", marginBottom:14, fontFamily:"'Nunito',sans-serif", fontSize:12, color:DARK }}>
        <div style={{ fontSize:10, fontWeight:700, color:HOT, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>👰 Bride Coverage Rule</div>
        The bride's share is automatically split among the group — she pays $0!
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:14 }}>
        {["summary","expenses","members"].map(v => (
          <button key={v} onClick={()=>setView(v)} style={{ flex:1, padding:"9px", borderRadius:50, border:view===v?`2px solid ${HOT}`:`1.5px solid ${BORDER}`, background:view===v?HOT:WHITE, color:view===v?WHITE:HOT, fontFamily:"'Nunito',sans-serif", fontSize:11, fontWeight:700, cursor:"pointer" }}>
            {v==="summary"?"Summary":v==="expenses"?"Expenses":"Members"}
          </button>
        ))}
      </div>
      {view==="summary" && members.map(m => {
        const isBride = m.name.includes("Bride");
        return (
          <div key={m.id} style={{ ...C, marginBottom:8, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:SOFT, border:`1.5px solid ${MID}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
              {isBride?"👰":m.name.includes("MOH")?"💍":"👯"}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{m.name}</div>
              {isBride && <div style={{ fontSize:11, color:GOLD, fontFamily:"'Nunito',sans-serif" }}>🎉 Pays nothing!</div>}
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:18, fontWeight:900, color:isBride?GOLD:PUNCH, fontFamily:"'Playfair Display',Georgia,serif" }}>{isBride?"$0":`$${perPerson.toFixed(0)}`}</div>
              <button onClick={()=>toggle(m.id)} style={{ fontSize:10, padding:"3px 9px", borderRadius:20, border:"none", cursor:"pointer", fontFamily:"'Nunito',sans-serif", fontWeight:700, background:m.paid?`rgba(46,125,50,0.1)`:SOFT, color:m.paid?GREEN:HOT, marginTop:3 }}>
                {m.paid?"Paid":"Mark Paid"}
              </button>
            </div>
          </div>
        );
      })}
      {view==="expenses" && expenses.map(e => (
        <div key={e.id} style={{ ...C, marginBottom:9, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:26 }}>{e.cat}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{e.name}</div>
            <div style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif", opacity:0.75 }}>${(e.amount/(members.length-1)).toFixed(0)}/person</div>
          </div>
          <div style={{ fontSize:17, fontWeight:900, color:PUNCH, fontFamily:"'Playfair Display',Georgia,serif" }}>${e.amount}</div>
        </div>
      ))}
      {view==="members" && (
        <div>
          {members.map(m => (
            <div key={m.id} style={{ ...C, marginBottom:8, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ fontSize:24 }}>{m.name.includes("Bride")?"👰":m.name.includes("MOH")?"💍":"👯"}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{m.name}</div>
                <div style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif", opacity:0.75 }}>{m.name.includes("Bride")?"Queen — pays nothing 👑":`Owes: $${perPerson.toFixed(0)}`}</div>
              </div>
              <button onClick={()=>toggle(m.id)} style={{ fontSize:11, padding:"5px 12px", borderRadius:20, border:`1.5px solid ${m.paid?"rgba(46,125,50,0.3)":MID}`, cursor:"pointer", fontFamily:"'Nunito',sans-serif", fontWeight:700, background:m.paid?`rgba(46,125,50,0.08)`:SOFT, color:m.paid?GREEN:HOT }}>
                {m.paid?"Paid":"Unpaid"}
              </button>
            </div>
          ))}
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <input value={newMember} onChange={e=>setNewMember(e.target.value)} placeholder="Add a member..." style={{ ...IN, flex:1 }} onKeyDown={e=>e.key==="Enter"&&addMember()} />
            <button onClick={addMember} style={{ ...BP, padding:"11px 16px", flexShrink:0 }}>+</button>
          </div>
        </div>
      )}
    </div>
  );
}
