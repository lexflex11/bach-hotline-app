import React, { useState, useEffect } from 'react';
import { WHITE, PAGE, SOFT, HOT, PUNCH, DARK, BORDER } from '../../constants/colors.js';
import {
  isConfigured, getDb,
  collection, addDoc, doc, updateDoc,
  onSnapshot, query, orderBy, arrayUnion, serverTimestamp,
} from '../../firebase.js';

function getVoterId() {
  let id = localStorage.getItem('bachVoterId');
  if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('bachVoterId', id); }
  return id;
}

const TEMPLATES = [
  { label: "  Where should we go?",  options: ["Nashville", "Miami", "Scottsdale", "New Orleans"] },
  { label: "  Which hotel?",          options: ["Option A", "Option B", "Option C", ""] },
  { label: "  What activity?",        options: ["Cocktail class", "Boat party", "Spa day", "Dance class"] },
  { label: "  Restaurant vote",       options: ["Italian", "Rooftop bar", "Sushi", "BBQ"] },
  { label: "  Custom question",        options: ["", "", "", ""] },
];

const card = { background:WHITE, borderRadius:18, padding:"18px 16px", marginBottom:14, boxShadow:"0 2px 12px rgba(230,101,130,0.08)", border:`1.5px solid ${BORDER}` };
const btn1 = { background:`linear-gradient(135deg,#f472b0,${HOT})`, color:WHITE, border:"none", borderRadius:50, padding:"13px 0", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:14, cursor:"pointer", width:"100%", letterSpacing:"0.5px" };
const btnG = { background:"none", border:`1.5px solid ${BORDER}`, borderRadius:50, padding:"11px 0", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", width:"100%", color:HOT };
const inp  = { width:"100%", border:`1.5px solid ${BORDER}`, borderRadius:12, padding:"11px 14px", fontFamily:"'Nunito',sans-serif", fontSize:14, background:PAGE, color:DARK, outline:"none", boxSizing:"border-box" };
const lbl  = { fontSize:12, fontWeight:700, fontFamily:"'Nunito',sans-serif", color:HOT, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6, display:"block" };
function SH({ title, sub }) {
  return <div style={{ marginBottom:18 }}><div style={{ fontSize:20, fontWeight:800, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{title}</div>{sub&&<div style={{ fontSize:12, color:"#aaa", fontFamily:"'Nunito',sans-serif", marginTop:3 }}>{sub}</div>}</div>;
}

function SetupPrompt() {
  return (
    <div>
      <SH title="Group Polls " sub="Vote together on destinations, hotels & activities" />
      <div style={{ ...card, textAlign:"center", padding:"28px 20px" }}>
        <div style={{ fontSize:40, marginBottom:12 }}></div>
        <div style={{ fontSize:16, fontWeight:800, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:8 }}>One quick setup needed</div>
        <div style={{ fontSize:13, color:"#888", fontFamily:"'Nunito',sans-serif", lineHeight:1.6, marginBottom:20 }}>Polls use Firebase (free) to sync votes across your group in real time. Takes about 5 minutes.</div>
        <div style={{ background:SOFT, borderRadius:14, padding:"16px", marginBottom:16, textAlign:"left" }}>
          {["Go to console.firebase.google.com",'Click "Add project" → name it Bach Hotline','Click the </> icon → register a web app',"Copy the firebaseConfig values into src/firebase.js","Enable Firestore Database → Start in test mode","In Terminal: npm install  (in the src folder)"].map((step,i)=>(
            <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
              <div style={{ minWidth:22, height:22, borderRadius:"50%", background:`linear-gradient(135deg,#f472b0,${HOT})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:WHITE, fontWeight:700 }}>{i+1}</div>
              <div style={{ fontSize:12, color:DARK, fontFamily:"'Nunito',sans-serif", lineHeight:1.5, paddingTop:2 }}>{step}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:11, color:"#aaa", fontFamily:"'Nunito',sans-serif" }}>Free · No credit card · ~5 minutes</div>
      </div>
    </div>
  );
}

function PollList({ user, onSelect, onCreateNew }) {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const voterId = getVoterId();
  useEffect(() => {
    const db = getDb(); if (!db) return;
    const q = query(collection(db, "polls"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => { setPolls(snap.docs.map(d=>({id:d.id,...d.data()}))); setLoading(false); });
    return ()=>unsub();
  }, []);
  return (
    <div>
      <SH title="Group Polls " sub="Vote on destinations, hotels, activities & more" />
      <button onClick={onCreateNew} style={{ ...btn1, marginBottom:20 }}>+ Create a Poll</button>
      {loading ? <div style={{ textAlign:"center", padding:40, color:"#aaa", fontFamily:"'Nunito',sans-serif" }}>Loading...</div>
        : polls.length === 0 ? <div style={{ ...card, textAlign:"center", padding:"32px 20px" }}><div style={{ fontSize:36, marginBottom:8 }}></div><div style={{ color:"#aaa", fontFamily:"'Nunito',sans-serif", fontSize:13 }}>No polls yet! Create one and share it with your group.</div></div>
        : polls.map(poll => {
          const total = Object.values(poll.votes||{}).reduce((s,v)=>s+v.length,0);
          const hasVoted = Object.values(poll.votes||{}).flat().includes(voterId);
          return (
            <button key={poll.id} onClick={()=>onSelect(poll.id)} style={{ ...card, display:"block", width:"100%", textAlign:"left", cursor:"pointer", padding:"14px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  {poll.tripName&&<div style={{ fontSize:10, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:3 }}>{poll.tripName}</div>}
                  <div style={{ fontSize:15, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:4 }}>{poll.question}</div>
                  <div style={{ fontSize:11, color:"#aaa", fontFamily:"'Nunito',sans-serif" }}>{total} vote{total!==1?"s":""}</div>
                </div>
                <div style={{ marginLeft:10 }}>
                  {hasVoted ? <span style={{ fontSize:11, background:SOFT, color:HOT, padding:"3px 10px", borderRadius:50, fontWeight:700, fontFamily:"'Nunito',sans-serif" }}>Voted </span>
                    : <span style={{ fontSize:11, background:`linear-gradient(135deg,#f472b0,${HOT})`, color:WHITE, padding:"3px 10px", borderRadius:50, fontWeight:700, fontFamily:"'Nunito',sans-serif" }}>Vote</span>}
                </div>
              </div>
            </button>
          );
        })}
    </div>
  );
}

function CreatePoll({ user, onCreated, onBack }) {
  const [step, setStep] = useState(0);
  const [question, setQuestion] = useState("");
  const [tripName, setTripName] = useState("");
  const [options, setOptions] = useState(["",""]);
  const [creating, setCreating] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  if (step === 0) return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", color:HOT, fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", marginBottom:16, padding:0 }}>← Back</button>
      <SH title="Create a Poll" sub="Pick a template to get started" />
      {TEMPLATES.map((t,i)=>(
        <button key={i} onClick={()=>{ setQuestion(t.label.replace(/^[^\s]+\s+/,"")); setOptions([...t.options.filter(Boolean),"",""].slice(0,4)); setStep(1); }}
          style={{ ...card, display:"block", width:"100%", textAlign:"left", cursor:"pointer", padding:"14px 16px", marginBottom:10 }}>
          <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Nunito',sans-serif", color:DARK }}>{t.label}</div>
          {t.options[0]&&<div style={{ fontSize:12, color:"#aaa", marginTop:3 }}>{t.options.slice(0,2).join(" · ")}...</div>}
        </button>
      ))}
    </div>
  );

  if (step === 1) return (
    <div>
      <button onClick={()=>setStep(0)} style={{ background:"none", border:"none", color:HOT, fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", marginBottom:16, padding:0 }}>← Back</button>
      <SH title="Customize" sub="Edit your question and options" />
      <div style={card}>
        <span style={lbl}>Question</span>
        <input style={inp} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="e.g. Where should we go?" />
        <span style={{ ...lbl, marginTop:16 }}>Trip / Group Name (optional)</span>
        <input style={inp} value={tripName} onChange={e=>setTripName(e.target.value)} placeholder="e.g. Mia's Bachelorette 2026" />
        <span style={{ ...lbl, marginTop:16 }}>Answer Options</span>
        {options.map((opt,i)=>(
          <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
            <div style={{ minWidth:22, height:22, borderRadius:"50%", background:SOFT, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:HOT }}>{i+1}</div>
            <input style={inp} value={opt} onChange={e=>{ const a=[...options]; a[i]=e.target.value; setOptions(a); }} placeholder={`Option ${i+1}`} />
          </div>
        ))}
        {options.length<4&&<button onClick={()=>setOptions(p=>[...p,""])} style={{ ...btnG, marginTop:4, padding:"8px 0", fontSize:12 }}>+ Add option</button>}
      </div>
      <button disabled={creating} style={{ ...btn1, opacity:creating?0.7:1 }} onClick={async()=>{
        const valid=options.filter(o=>o.trim()); if(!question.trim()||valid.length<2) return;
        setCreating(true); const db=getDb(); const votes={};
        valid.forEach((_,i)=>{ votes[`opt_${i}`]=[]; });
        const ref=await addDoc(collection(db,"polls"),{ question:question.trim(), tripName:tripName.trim()||"Bachelorette Poll", createdBy:user?.name||"MOH", createdAt:serverTimestamp(), options:valid.map((text,i)=>({id:`opt_${i}`,text})), votes });
        const url=`${window.location.origin}${window.location.pathname}?poll=${ref.id}`;
        setShareUrl(url); setStep(2); setCreating(false); onCreated&&onCreated(ref.id);
      }}>{creating?"Creating...":"Create Poll & Get Link "}</button>
    </div>
  );

  return (
    <div>
      <SH title="Poll Created! " sub="Share the link with your group" />
      <div style={{ ...card, textAlign:"center" }}>
        <div style={{ fontSize:36, marginBottom:8 }}></div>
        <div style={{ fontSize:13, fontFamily:"'Nunito',sans-serif", color:"#888", marginBottom:12 }}>Anyone with this link can vote!</div>
        <div style={{ background:PAGE, borderRadius:10, padding:"10px 14px", fontSize:11, fontFamily:"monospace", color:DARK, wordBreak:"break-all", marginBottom:16, border:`1px solid ${BORDER}` }}>{shareUrl}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <button onClick={()=>navigator.clipboard.writeText(shareUrl)} style={btnG}> Copy link</button>
          <button onClick={()=>window.open(`sms:?body=${encodeURIComponent("Vote on my bachelorette poll! \n"+shareUrl)}`)} style={btn1}> iMessage</button>
        </div>
      </div>
      <button onClick={()=>{ setStep(0); setQuestion(""); setOptions(["",""]); setShareUrl(""); onBack(); }} style={{ ...btnG, marginTop:8 }}>← Back to polls</button>
    </div>
  );
}

function VoteScreen({ pollId, onBack }) {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [votedOptId, setVotedOptId] = useState(null);
  const voterId = getVoterId();
  useEffect(() => {
    const db=getDb(); if(!db) return;
    const unsub=onSnapshot(doc(db,"polls",pollId), snap=>{
      if(snap.exists()){ const data={id:snap.id,...snap.data()}; setPoll(data);
        const all=Object.values(data.votes||{}).flat();
        if(all.includes(voterId)){ setVoted(true); Object.entries(data.votes||{}).forEach(([oid,v])=>{ if(v.includes(voterId)) setVotedOptId(oid); }); }
      } setLoading(false);
    });
    return()=>unsub();
  }, [pollId]);

  if(loading) return <div style={{ textAlign:"center", padding:40, color:"#aaa", fontFamily:"'Nunito',sans-serif" }}>Loading poll...</div>;
  if(!poll)   return <div style={{ textAlign:"center", padding:40, color:"#aaa", fontFamily:"'Nunito',sans-serif" }}>Poll not found.</div>;

  const total=Object.values(poll.votes||{}).reduce((s,v)=>s+v.length,0);
  const maxVotes=Math.max(...Object.values(poll.votes||{}).map(v=>v.length),0);

  return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", color:HOT, fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", marginBottom:16, padding:0 }}>← All polls</button>
      <div style={card}>
        {poll.tripName&&<div style={{ fontSize:11, fontWeight:700, fontFamily:"'Nunito',sans-serif", color:HOT, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6 }}>{poll.tripName}</div>}
        <div style={{ fontSize:19, fontWeight:800, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:4 }}>{poll.question}</div>
        <div style={{ fontSize:11, color:"#aaa", fontFamily:"'Nunito',sans-serif", marginBottom:20 }}>{total} vote{total!==1?"s":""} · by {poll.createdBy}</div>
        {(poll.options||[]).map(opt=>{
          const count=(poll.votes?.[opt.id]||[]).length;
          const pct=total>0?Math.round((count/total)*100):0;
          const isMe=votedOptId===opt.id;
          const isTop=voted&&count===maxVotes&&count>0;
          return (
            <div key={opt.id} style={{ marginBottom:12 }}>
              <button onClick={async()=>{ if(voted)return; setVoted(true); setVotedOptId(opt.id); const db=getDb(); await updateDoc(doc(db,"polls",pollId),{[`votes.${opt.id}`]:arrayUnion(voterId)}); }} disabled={voted}
                style={{ width:"100%", textAlign:"left", background:isMe?SOFT:PAGE, border:`2px solid ${isMe?HOT:BORDER}`, borderRadius:14, padding:"13px 16px", cursor:voted?"default":"pointer", transition:"all 0.2s", position:"relative", overflow:"hidden" }}>
                {voted&&<div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:isMe?`linear-gradient(90deg,${SOFT},rgba(255,231,249,0))`:`linear-gradient(90deg,rgba(253,245,250,1),rgba(253,245,250,0))`, transition:"width 0.6s ease", borderRadius:12 }}/>}
                <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {isMe&&<span></span>}
                    <span style={{ fontSize:14, fontFamily:"'Nunito',sans-serif", fontWeight:isMe?700:500, color:DARK }}>{opt.text}</span>
                    {isTop&&<span style={{ fontSize:11, background:`linear-gradient(135deg,#f472b0,${HOT})`, color:WHITE, padding:"2px 8px", borderRadius:50, fontWeight:700, fontFamily:"'Nunito',sans-serif" }}>Leading</span>}
                  </div>
                  {voted&&<span style={{ fontSize:13, fontWeight:700, fontFamily:"'Nunito',sans-serif", color:isMe?HOT:"#aaa" }}>{pct}%</span>}
                </div>
              </button>
            </div>
          );
        })}
        {!voted&&<div style={{ textAlign:"center", fontSize:12, color:"#bbb", fontFamily:"'Nunito',sans-serif", marginTop:8 }}>Tap an option to vote</div>}
        {voted&&<div style={{ textAlign:"center", fontSize:12, color:HOT, fontFamily:"'Nunito',sans-serif", fontWeight:700, marginTop:8 }}>You voted! Results update live </div>}
      </div>
      <button onClick={()=>navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?poll=${pollId}`)} style={{ ...btnG, maxWidth:200, margin:"0 auto", display:"block" }}> Share this poll</button>
    </div>
  );
}

function AccountGate({ onSignUp }) {
  return (
    <div style={{textAlign:"center",padding:"48px 24px"}}>
      <div style={{fontSize:48,marginBottom:16}}></div>
      <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:22,fontWeight:700,color:HOT,margin:"0 0 10px"}}>Members Only</h2>
      <p style={{fontSize:13,color:"#888",fontFamily:"'Nunito',sans-serif",lineHeight:1.6,marginBottom:28}}>
        Group Polls is for the bride tribe only.<br/>Create a free account to create and vote on polls.
      </p>
      <button onClick={onSignUp} style={{background:`linear-gradient(135deg,#f472b0,${HOT})`,color:WHITE,border:"none",borderRadius:50,padding:"13px 32px",fontFamily:"'Nunito',sans-serif",fontSize:14,fontWeight:700,cursor:"pointer",width:"100%",maxWidth:280}}>
        Create Free Account
      </button>
      <p style={{fontSize:11,color:"#bbb",fontFamily:"'Nunito',sans-serif",marginTop:14}}>Already have an account? Sign in from the home screen.</p>
    </div>
  );
}

export default function PollsTab({ user, onSignUp }) {
  if (!user || user.id === "g") return <AccountGate onSignUp={onSignUp} />;
  const [screen, setScreen] = useState("list");
  const [activePollId, setActivePollId] = useState(null);
  useEffect(() => {
    const pid=new URLSearchParams(window.location.search).get("poll");
    if(pid){ setActivePollId(pid); setScreen("vote"); }
  }, []);
  if(!isConfigured) return <SetupPrompt />;
  if(screen==="create") return <CreatePoll user={user} onBack={()=>setScreen("list")} onCreated={id=>{ setActivePollId(id); setScreen("vote"); }} />;
  if(screen==="vote"&&activePollId) return <VoteScreen pollId={activePollId} onBack={()=>setScreen("list")} />;
  return <PollList user={user} onSelect={id=>{ setActivePollId(id); setScreen("vote"); }} onCreateNew={()=>setScreen("create")} />;
}
