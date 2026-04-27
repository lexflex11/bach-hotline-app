import React, { useState, useRef } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE, GREEN } from '../../constants/colors.js';
import { C, BP, BS, IN } from '../../constants/styles.js';
import { DESTS, BUDGET_DATA } from '../../constants/data.js';
import SH from '../ui/SH.jsx';
import {
  isConfigured, getDb,
  collection, addDoc, doc, updateDoc,
  onSnapshot, query, orderBy, arrayUnion, serverTimestamp,
} from '../../firebase.js';
import { useEffect } from 'react';

// ─── Polls ────────────────────────────────────────────────────────────────────
function getVoterId() {
  let id = localStorage.getItem('bachVoterId');
  if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('bachVoterId', id); }
  return id;
}
const POLL_TEMPLATES = [
  { label:"Where should we go?",    options:["Nashville","Miami","Scottsdale","New Orleans"] },
  { label:"Which hotel?",           options:["Option A","Option B","Option C",""] },
  { label:"What activity?",         options:["Cocktail class","Boat party","Spa day","Dance class"] },
  { label:"Restaurant vote",        options:["Italian","Rooftop bar","Sushi","BBQ"] },
  { label:"Custom question",        options:["","","",""] },
];

const card   = { background:WHITE, borderRadius:18, padding:"18px 16px", marginBottom:12, border:`1.5px solid ${BORDER}` };
const btn1   = { background:`linear-gradient(135deg,#f472b0,${HOT})`, color:WHITE, border:"none", borderRadius:50, padding:"13px 0", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:14, cursor:"pointer", width:"100%", letterSpacing:"0.5px" };
const btnG   = { background:"none", border:`1.5px solid ${BORDER}`, borderRadius:50, padding:"11px 0", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", width:"100%", color:HOT };
const pollInp = { width:"100%", border:`1.5px solid ${BORDER}`, borderRadius:12, padding:"11px 14px", fontFamily:"'Nunito',sans-serif", fontSize:14, background:"#fdf8fb", color:DARK, outline:"none", boxSizing:"border-box" };
const lbl    = { fontSize:11, fontWeight:700, fontFamily:"'Nunito',sans-serif", color:HOT, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6, display:"block" };

function PollsSection({ user }) {
  const [screen, setScreen] = useState("list");
  const [activePollId, setActivePollId] = useState(null);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [question, setQuestion] = useState("");
  const [tripName, setTripName] = useState("");
  const [options, setOptions] = useState(["",""]);
  const [creating, setCreating] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [votedOptId, setVotedOptId] = useState(null);
  const voterId = getVoterId();

  useEffect(() => {
    const pid = new URLSearchParams(window.location.search).get("poll");
    if (pid) { setActivePollId(pid); setScreen("vote"); }
  }, []);

  useEffect(() => {
    if (screen !== "list") return;
    const db = getDb(); if (!db) return;
    const q = query(collection(db, "polls"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => { setPolls(snap.docs.map(d=>({id:d.id,...d.data()}))); setLoading(false); });
    return () => unsub();
  }, [screen]);

  useEffect(() => {
    if (screen !== "vote" || !activePollId) return;
    const db = getDb(); if (!db) return;
    const unsub = onSnapshot(doc(db, "polls", activePollId), snap => {
      if (snap.exists()) {
        const data = { id:snap.id, ...snap.data() }; setPoll(data);
        const all = Object.values(data.votes||{}).flat();
        if (all.includes(voterId)) { setVoted(true); Object.entries(data.votes||{}).forEach(([oid,v])=>{ if(v.includes(voterId)) setVotedOptId(oid); }); }
      }
    });
    return () => unsub();
  }, [screen, activePollId]);

  if (!isConfigured) return (
    <div style={{ ...card, textAlign:"center", padding:"20px" }}>
      <div style={{ fontSize:13, color:"#888", fontFamily:"'Nunito',sans-serif", lineHeight:1.6 }}>
        Polls require a Firebase setup. See the Planning tab for setup instructions.
      </div>
    </div>
  );

  // Vote screen
  if (screen === "vote" && activePollId) {
    if (!poll) return <div style={{ textAlign:"center", padding:24, color:"#aaa", fontFamily:"'Nunito',sans-serif", fontSize:12 }}>Loading poll...</div>;
    const total = Object.values(poll.votes||{}).reduce((s,v)=>s+v.length,0);
    const maxVotes = Math.max(...Object.values(poll.votes||{}).map(v=>v.length), 0);
    return (
      <div>
        <button onClick={()=>{ setScreen("list"); setPoll(null); setVoted(false); setVotedOptId(null); }} style={{ background:"none", border:"none", color:HOT, fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", marginBottom:14, padding:0 }}>← All polls</button>
        <div style={card}>
          {poll.tripName && <div style={{ fontSize:10, fontWeight:700, fontFamily:"'Nunito',sans-serif", color:HOT, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6 }}>{poll.tripName}</div>}
          <div style={{ fontSize:17, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:4 }}>{poll.question}</div>
          <div style={{ fontSize:11, color:"#aaa", fontFamily:"'Nunito',sans-serif", marginBottom:18 }}>{total} vote{total!==1?"s":""} · by {poll.createdBy}</div>
          {(poll.options||[]).map(opt => {
            const count = (poll.votes?.[opt.id]||[]).length;
            const pct   = total>0 ? Math.round((count/total)*100) : 0;
            const isMe  = votedOptId===opt.id;
            const isTop = voted && count===maxVotes && count>0;
            return (
              <div key={opt.id} style={{ marginBottom:10 }}>
                <button onClick={async()=>{ if(voted)return; setVoted(true); setVotedOptId(opt.id); const db=getDb(); await updateDoc(doc(db,"polls",activePollId),{[`votes.${opt.id}`]:arrayUnion(voterId)}); }} disabled={voted}
                  style={{ width:"100%", textAlign:"left", background:isMe?SOFT:"#fdf8fb", border:`2px solid ${isMe?HOT:BORDER}`, borderRadius:14, padding:"12px 14px", cursor:voted?"default":"pointer", position:"relative", overflow:"hidden" }}>
                  {voted && <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:isMe?`linear-gradient(90deg,${SOFT},rgba(255,231,249,0))`:`linear-gradient(90deg,rgba(253,245,250,1),rgba(253,245,250,0))`, transition:"width 0.6s ease", borderRadius:12 }}/>}
                  <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      {isMe && <span style={{ color:HOT }}>✓</span>}
                      <span style={{ fontSize:13, fontFamily:"'Nunito',sans-serif", fontWeight:isMe?700:500, color:DARK }}>{opt.text}</span>
                      {isTop && <span style={{ fontSize:10, background:`linear-gradient(135deg,#f472b0,${HOT})`, color:WHITE, padding:"2px 8px", borderRadius:50, fontWeight:700, fontFamily:"'Nunito',sans-serif" }}>Leading</span>}
                    </div>
                    {voted && <span style={{ fontSize:12, fontWeight:700, fontFamily:"'Nunito',sans-serif", color:isMe?HOT:"#aaa" }}>{pct}%</span>}
                  </div>
                </button>
              </div>
            );
          })}
          {!voted && <div style={{ textAlign:"center", fontSize:11, color:"#bbb", fontFamily:"'Nunito',sans-serif", marginTop:6 }}>Tap an option to vote</div>}
          {voted  && <div style={{ textAlign:"center", fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif", fontWeight:700, marginTop:6 }}>You voted! Results update live</div>}
        </div>
        <button onClick={()=>navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?poll=${activePollId}`)} style={{ ...btnG, maxWidth:220, margin:"0 auto", display:"block" }}>Copy share link</button>
      </div>
    );
  }

  // Create flow
  if (screen === "create") {
    if (step === 0) return (
      <div>
        <button onClick={()=>setScreen("list")} style={{ background:"none", border:"none", color:HOT, fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", marginBottom:14, padding:0 }}>← Back</button>
        <div style={{ fontSize:15, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:12 }}>Pick a template</div>
        {POLL_TEMPLATES.map((t,i) => (
          <button key={i} onClick={()=>{ setQuestion(t.label); setOptions([...t.options.filter(Boolean),"",""].slice(0,4)); setStep(1); }}
            style={{ ...card, display:"block", width:"100%", textAlign:"left", cursor:"pointer", padding:"12px 14px", marginBottom:8 }}>
            <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Nunito',sans-serif", color:DARK }}>{t.label}</div>
            {t.options[0] && <div style={{ fontSize:11, color:"#aaa", marginTop:3 }}>{t.options.slice(0,2).join(" · ")}...</div>}
          </button>
        ))}
      </div>
    );
    if (step === 1) return (
      <div>
        <button onClick={()=>setStep(0)} style={{ background:"none", border:"none", color:HOT, fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", marginBottom:14, padding:0 }}>← Back</button>
        <div style={card}>
          <span style={lbl}>Question</span>
          <input style={pollInp} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="e.g. Where should we go?" />
          <span style={{ ...lbl, marginTop:14 }}>Trip / Group Name (optional)</span>
          <input style={pollInp} value={tripName} onChange={e=>setTripName(e.target.value)} placeholder="e.g. Mia's Bachelorette 2026" />
          <span style={{ ...lbl, marginTop:14 }}>Answer Options</span>
          {options.map((opt,i) => (
            <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
              <div style={{ minWidth:22, height:22, borderRadius:"50%", background:SOFT, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:HOT }}>{i+1}</div>
              <input style={pollInp} value={opt} onChange={e=>{ const a=[...options]; a[i]=e.target.value; setOptions(a); }} placeholder={`Option ${i+1}`} />
            </div>
          ))}
          {options.length < 4 && <button onClick={()=>setOptions(p=>[...p,""])} style={{ ...btnG, marginTop:4, padding:"8px 0", fontSize:12 }}>+ Add option</button>}
        </div>
        <button disabled={creating} style={{ ...btn1, opacity:creating?0.7:1 }} onClick={async()=>{
          const valid = options.filter(o=>o.trim()); if(!question.trim()||valid.length<2) return;
          setCreating(true); const db=getDb(); const votes={};
          valid.forEach((_,i)=>{ votes[`opt_${i}`]=[]; });
          const ref = await addDoc(collection(db,"polls"),{ question:question.trim(), tripName:tripName.trim()||"Bachelorette Poll", createdBy:user?.name||"MOH", createdAt:serverTimestamp(), options:valid.map((text,i)=>({id:`opt_${i}`,text})), votes });
          const url = `${window.location.origin}${window.location.pathname}?poll=${ref.id}`;
          setShareUrl(url); setStep(2); setCreating(false);
        }}>{creating?"Creating...":"Create Poll & Get Link"}</button>
      </div>
    );
    return (
      <div>
        <div style={{ fontSize:16, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:4 }}>Poll Created!</div>
        <div style={{ ...card, textAlign:"center" }}>
          <div style={{ fontSize:11, fontFamily:"'Nunito',sans-serif", color:"#888", marginBottom:10 }}>Anyone with this link can vote!</div>
          <div style={{ background:"#fdf8fb", borderRadius:10, padding:"10px 14px", fontSize:11, fontFamily:"monospace", color:DARK, wordBreak:"break-all", marginBottom:14, border:`1px solid ${BORDER}` }}>{shareUrl}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <button onClick={()=>navigator.clipboard.writeText(shareUrl)} style={btnG}>Copy link</button>
            <button onClick={()=>window.open(`sms:?body=${encodeURIComponent("Vote on my bachelorette poll!\n"+shareUrl)}`)} style={btn1}>iMessage</button>
          </div>
        </div>
        <button onClick={()=>{ setStep(0); setQuestion(""); setOptions(["",""]); setShareUrl(""); setScreen("list"); }} style={{ ...btnG, marginTop:8 }}>← Back to polls</button>
      </div>
    );
  }

  // Poll list
  return (
    <div>
      <button onClick={()=>{ setScreen("create"); setStep(0); }} style={{ ...btn1, marginBottom:14 }}>+ Create a Poll</button>
      {loading
        ? <div style={{ textAlign:"center", padding:24, color:"#aaa", fontFamily:"'Nunito',sans-serif", fontSize:12 }}>Loading...</div>
        : polls.length === 0
          ? <div style={{ ...card, textAlign:"center", padding:"24px 16px" }}><div style={{ fontSize:13, color:"#aaa", fontFamily:"'Nunito',sans-serif" }}>No polls yet. Create one and share it with your group.</div></div>
          : polls.map(p => {
              const total = Object.values(p.votes||{}).reduce((s,v)=>s+v.length,0);
              const hasVoted = Object.values(p.votes||{}).flat().includes(voterId);
              return (
                <button key={p.id} onClick={()=>{ setActivePollId(p.id); setScreen("vote"); }} style={{ ...card, display:"block", width:"100%", textAlign:"left", cursor:"pointer", padding:"12px 14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ flex:1 }}>
                      {p.tripName && <div style={{ fontSize:10, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:2 }}>{p.tripName}</div>}
                      <div style={{ fontSize:14, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:3 }}>{p.question}</div>
                      <div style={{ fontSize:11, color:"#aaa", fontFamily:"'Nunito',sans-serif" }}>{total} vote{total!==1?"s":""}</div>
                    </div>
                    <div style={{ marginLeft:10 }}>
                      {hasVoted
                        ? <span style={{ fontSize:11, background:SOFT, color:HOT, padding:"3px 10px", borderRadius:50, fontWeight:700, fontFamily:"'Nunito',sans-serif" }}>Voted</span>
                        : <span style={{ fontSize:11, background:`linear-gradient(135deg,#f472b0,${HOT})`, color:WHITE, padding:"3px 10px", borderRadius:50, fontWeight:700, fontFamily:"'Nunito',sans-serif" }}>Vote</span>}
                    </div>
                  </div>
                </button>
              );
            })
      }
    </div>
  );
}

// ─── Media Upload ─────────────────────────────────────────────────────────────
const MOMENTS = [
  { id:"gettingready", label:"Getting Ready"  },
  { id:"pool",         label:"Pool Party"      },
  { id:"nightout",     label:"Night Out"       },
  { id:"brunch",       label:"Brunch"          },
  { id:"activities",   label:"Activities"      },
  { id:"travel",       label:"Travel"          },
  { id:"spa",          label:"Spa Day"         },
  { id:"other",        label:"Other"           },
];

const CLOUDINARY_CLOUD = "du3qkblhi";
const CLOUDINARY_PRESET = "Bach Hotline";

function MediaSection({ user }) {
  const fileRef = useRef();
  const [dest,      setDest]      = useState("");
  const [moment,    setMoment]    = useState("");
  const [caption,   setCaption]   = useState("");
  const [files,     setFiles]     = useState([]); // { id, url, name, isVideo, raw }
  const [submitted, setSubmitted] = useState([]);
  const [success,   setSuccess]   = useState(false);
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);

  const processFiles = rawFiles => {
    Array.from(rawFiles).forEach(file => {
      const reader = new FileReader();
      const isVideo = file.type.startsWith("video/");
      reader.onload = ev => setFiles(p => [...p, { id:Date.now()+Math.random(), url:ev.target.result, name:file.name, isVideo, raw:file }]);
      reader.readAsDataURL(file);
    });
  };
  const handleDrop = e => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); };
  const removeFile = id => setFiles(p => p.filter(f => f.id !== id));
  const canSubmit = dest && moment && files.length > 0 && !uploading;

  const submit = async () => {
    if (!canSubmit) return;
    setUploading(true); setProgress(0);
    const destObj   = DESTS.find(d => d.id === dest);
    const momentObj = MOMENTS.find(m => m.id === moment);
    const folder    = `bach-hotline/${destObj?.name||dest}/${momentObj?.label||moment}`;
    const uploaded  = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const fd = new FormData();
      fd.append("file", f.raw);
      fd.append("upload_preset", CLOUDINARY_PRESET);
      fd.append("folder", folder);
      if (caption) fd.append("context", `caption=${caption}|user=${user?.name||"guest"}`);
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/auto/upload`, { method:"POST", body:fd });
      const data = await res.json();
      uploaded.push({ url:f.url, secure_url:data.secure_url, isVideo:f.isVideo });
      setProgress(Math.round(((i+1)/files.length)*100));
    }
    setSubmitted(p => [...p, { id:Date.now(), dest:destObj?.name||dest, moment:momentObj?.label||moment, caption, files:uploaded, date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) }]);
    setDest(""); setMoment(""); setCaption(""); setFiles([]);
    setUploading(false); setProgress(0);
    setSuccess(true); setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ borderRadius:18, padding:"18px 16px", marginBottom:14, textAlign:"center", background:`linear-gradient(135deg,${SOFT} 0%,${MID} 100%)`, border:`1.5px solid ${MID}` }}>
        <div style={{ fontSize:32, marginBottom:6 }}>📸</div>
        <div style={{ fontSize:17, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:4 }}>Pics or It Didn't Happen</div>
        <div style={{ fontSize:12, color:HOT, fontFamily:"'Nunito',sans-serif", opacity:0.85, lineHeight:1.5 }}>
          Drop your pics and vids — your memories help other bach crews plan smarter.
        </div>
      </div>

      {success && (
        <div style={{ padding:"12px 14px", borderRadius:12, background:"rgba(46,125,50,0.1)", border:"1.5px solid rgba(46,125,50,0.35)", marginBottom:14, textAlign:"center" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#2e7d32", fontFamily:"'Nunito',sans-serif" }}>Submitted! Thanks for sharing.</div>
        </div>
      )}

      <div style={{ ...card }}>
        {/* Trip */}
        <div style={{ marginBottom:12 }}>
          <span style={lbl}>Select Your Trip</span>
          <select value={dest} onChange={e=>setDest(e.target.value)}
            style={{ width:"100%", border:`1.5px solid ${BORDER}`, borderRadius:12, padding:"11px 14px", fontFamily:"'Nunito',sans-serif", fontSize:13, background:"#fdf8fb", color:DARK, outline:"none", boxSizing:"border-box", appearance:"none" }}>
            <option value="">Choose a destination…</option>
            {DESTS.filter(d => d.id && d.id !== "all").map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        {/* Moment */}
        <div style={{ marginBottom:12 }}>
          <span style={lbl}>The Moment</span>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {MOMENTS.map(m => (
              <button key={m.id} onClick={()=>setMoment(m.id)} style={{
                padding:"9px 10px", border:moment===m.id?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,
                borderRadius:12, background:moment===m.id?SOFT:WHITE, cursor:"pointer",
                fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:600,
                color:moment===m.id?HOT:DARK, textAlign:"left",
              }}>{m.label}</button>
            ))}
          </div>
        </div>
        {/* Upload */}
        <div style={{ marginBottom:12 }}>
          <span style={lbl}>Media</span>
          <div
            onDragOver={e=>{ e.preventDefault(); setDragging(true); }}
            onDragLeave={()=>setDragging(false)}
            onDrop={handleDrop}
            onClick={()=>fileRef.current?.click()}
            style={{ border:`2px dashed ${dragging?HOT:BORDER}`, borderRadius:14, padding:"24px 16px", textAlign:"center", background:dragging?SOFT:"#fdf8fb", cursor:"pointer" }}
          >
            <div style={{ fontSize:28, marginBottom:6 }}>📷</div>
            <div style={{ fontSize:13, fontWeight:700, color:DARK, fontFamily:"'Nunito',sans-serif", marginBottom:4 }}>Upload Photos & Videos</div>
            <div style={{ fontSize:11, color:"#aaa", fontFamily:"'Nunito',sans-serif", marginBottom:12 }}>Drag and drop here or</div>
            <div style={{ display:"inline-block", padding:"8px 20px", borderRadius:50, border:`1.5px solid ${DARK}`, fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:700, color:DARK, background:WHITE }}>
              Select from your device
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*,video/*" style={{ display:"none" }} onChange={e=>processFiles(e.target.files)} />
          </div>
          {files.length > 0 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginTop:10 }}>
              {files.map(f => (
                <div key={f.id} style={{ position:"relative", aspectRatio:"1/1", borderRadius:10, overflow:"hidden", background:SOFT }}>
                  <img src={f.url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                  <button onClick={()=>removeFile(f.id)} style={{ position:"absolute", top:4, right:4, width:20, height:20, borderRadius:"50%", background:"rgba(0,0,0,0.55)", border:"none", cursor:"pointer", color:WHITE, fontSize:12, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Caption */}
        <div style={{ marginBottom:14 }}>
          <span style={lbl}>Caption (optional)</span>
          <textarea value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Tell us about this moment" rows={3}
            style={{ width:"100%", border:`1.5px solid ${BORDER}`, borderRadius:12, padding:"11px 14px", fontFamily:"'Nunito',sans-serif", fontSize:13, background:"#fdf8fb", color:DARK, outline:"none", boxSizing:"border-box", resize:"none", lineHeight:1.5 }} />
        </div>
        <div style={{ fontSize:11, color:"#bbb", fontFamily:"'Nunito',sans-serif", marginBottom:12, lineHeight:1.5 }}>
          Your upload goes directly to our media library so we can review and share it.
        </div>
        {uploading && (
          <div style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif", fontWeight:700 }}>Uploading...</span>
              <span style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif" }}>{progress}%</span>
            </div>
            <div style={{ height:6, borderRadius:6, background:SOFT, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,#f472b0,${HOT})`, borderRadius:6, transition:"width 0.3s" }} />
            </div>
          </div>
        )}
        <button onClick={submit} disabled={!canSubmit} style={{ ...btn1, opacity:canSubmit?1:0.4, cursor:canSubmit?"pointer":"not-allowed" }}>
          {uploading ? `Uploading ${progress}%...` : "Submit"}
        </button>
      </div>

      {submitted.length > 0 && submitted.map(s => (
        <div key={s.id} style={{ ...card }}>
          <div style={{ fontSize:12, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", marginBottom:4 }}>{s.dest} · {s.moment} · {s.date}</div>
          {s.files.length > 0 && (
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(s.files.length,3)},1fr)`, gap:6, marginBottom:8 }}>
              {s.files.map(f => (
                <div key={f.id} style={{ aspectRatio:"1/1", borderRadius:10, overflow:"hidden", background:SOFT }}>
                  <img src={f.url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                </div>
              ))}
            </div>
          )}
          {s.caption && <div style={{ fontSize:12, color:DARK, fontFamily:"'Nunito',sans-serif", fontStyle:"italic", opacity:0.85 }}>"{s.caption}"</div>}
          <div style={{ marginTop:8, padding:"5px 10px", borderRadius:8, background:SOFT, display:"inline-block", fontSize:10, color:HOT, fontFamily:"'Nunito',sans-serif", fontWeight:700 }}>Submitted for review</div>
        </div>
      ))}
    </div>
  );
}

// ─── Budget Section ───────────────────────────────────────────────────────────
function BudgetSection({ groupSize }) {
  const [city,  setCity]  = useState("");
  const [nights, setNights] = useState(3);
  const [tier,  setTier]  = useState("mid");
  const SM2 = { background:SOFT, border:`1.5px solid ${MID}`, color:HOT, borderRadius:8, width:28, height:28, cursor:"pointer", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" };

  const dest = DESTS.find(d => d.id === city);
  const data = city && BUDGET_DATA?.[city]?.[tier];

  const cats = data ? [
    { label:"Flights",       val: data.flight   * groupSize        },
    { label:"Stay",          val: data.stay     * nights           },
    { label:"Food & Drinks", val: data.food     * groupSize * nights },
    { label:"Experiences",   val: data.exp      * groupSize        },
    { label:"Extras",        val: data.extras   * groupSize        },
  ] : [];
  const total = cats.reduce((s,c) => s + c.val, 0);

  return (
    <div>
      <div style={{ ...card }}>
        <div style={{ marginBottom:12 }}>
          <span style={lbl}>Destination</span>
          <select value={city} onChange={e=>setCity(e.target.value)}
            style={{ width:"100%", border:`1.5px solid ${BORDER}`, borderRadius:12, padding:"11px 14px", fontFamily:"'Nunito',sans-serif", fontSize:13, background:"#fdf8fb", color:DARK, outline:"none", boxSizing:"border-box", appearance:"none" }}>
            <option value="">Choose a city…</option>
            {DESTS.filter(d=>d.id&&d.id!=="all"&&BUDGET_DATA?.[d.id]).map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div style={{ display:"flex", gap:10, marginBottom:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 120px" }}>
            <span style={lbl}>Nights</span>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <button style={SM2} onClick={()=>setNights(n=>Math.max(1,n-1))}>−</button>
              <span style={{ fontWeight:900, color:PUNCH, fontSize:20, minWidth:24, textAlign:"center", fontFamily:"'Playfair Display',Georgia,serif" }}>{nights}</span>
              <button style={SM2} onClick={()=>setNights(n=>Math.min(14,n+1))}>+</button>
            </div>
          </div>
          <div style={{ flex:"1 1 120px" }}>
            <span style={lbl}>Budget Style</span>
            <div style={{ display:"flex", gap:6 }}>
              {[["budget","Budget"],["mid","Mid"],["luxury","Luxury"]].map(([id,label])=>(
                <button key={id} onClick={()=>setTier(id)} style={{ flex:1, padding:"8px 4px", borderRadius:10, border:`1.5px solid ${tier===id?HOT:BORDER}`, background:tier===id?SOFT:WHITE, cursor:"pointer", fontFamily:"'Nunito',sans-serif", fontSize:11, fontWeight:700, color:tier===id?HOT:DARK }}>{label}</button>
              ))}
            </div>
          </div>
        </div>

        {data ? (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
              {cats.map(c => (
                <div key={c.label} style={{ background:SOFT, borderRadius:12, padding:"10px 12px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>{c.label}</div>
                  <div style={{ fontSize:16, fontWeight:900, color:DARK, fontFamily:"'Playfair Display',Georgia,serif" }}>${c.val.toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div style={{ borderRadius:14, padding:"14px 16px", background:`linear-gradient(135deg,${SOFT},${MID})`, border:`1.5px solid ${MID}`, textAlign:"center" }}>
              <div style={{ fontSize:11, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Total for {groupSize} people · {nights} nights</div>
              <div style={{ fontSize:28, fontWeight:900, color:PUNCH, fontFamily:"'Playfair Display',Georgia,serif" }}>${total.toLocaleString()}</div>
              <div style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif", marginTop:4, opacity:0.8 }}>${Math.round(total/groupSize).toLocaleString()} per person</div>
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center", padding:"16px 0", color:"#bbb", fontFamily:"'Nunito',sans-serif", fontSize:12 }}>
            Pick a destination to see the estimate
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Meal Planner ─────────────────────────────────────────────────────────────
const MEAL_SLOTS = [
  { id:"brunch",    label:"BRUNCH",     icon:"🍴", empty:"No brunch planned yet"   },
  { id:"lunch",     label:"LUNCH",      icon:"🥗", empty:"No lunch planned yet"    },
  { id:"dinner",    label:"DINNER",     icon:"🍽️", empty:"No dinner planned yet"   },
  { id:"lateNight", label:"LATE NIGHT", icon:"🌙", empty:"No late night plans yet" },
];

function MealPlannerSection({ user }) {
  const storageKey = `bh_mealplan_${user.id}`;
  const [days,      setDays]      = useState(3);
  const [activeDay, setActiveDay] = useState(0);
  const [plan,      setPlan]      = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch { return {}; }
  });
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");

  const slotKey   = (d, s) => `day${d}_${s}`;
  const savePlan  = next => { setPlan(next); localStorage.setItem(storageKey, JSON.stringify(next)); };

  const startEdit = (d, s) => { setEditVal(plan[slotKey(d,s)] || ""); setEditing(slotKey(d,s)); };
  const commit    = () => { if (editing) savePlan({ ...plan, [editing]: editVal.trim() }); setEditing(null); setEditVal(""); };
  const clearDay  = d => { const next={...plan}; MEAL_SLOTS.forEach(s=>delete next[slotKey(d,s.id)]); savePlan(next); };
  const hasAny    = d => MEAL_SLOTS.some(s => plan[slotKey(d,s.id)]);

  return (
    <div>
      {/* Day tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {Array.from({ length:days }, (_,i) => (
          <button key={i} onClick={()=>setActiveDay(i)} style={{
            minWidth:52, height:52, borderRadius:"50%", flexShrink:0,
            background:activeDay===i?`linear-gradient(135deg,#f472b0,${HOT})`:SOFT,
            border:activeDay===i?"none":`1.5px solid ${MID}`,
            color:activeDay===i?WHITE:HOT, cursor:"pointer",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          }}>
            <div style={{ fontSize:8, fontWeight:700, fontFamily:"'Nunito',sans-serif", letterSpacing:"0.5px", opacity:0.85 }}>DAY</div>
            <div style={{ fontSize:18, fontWeight:900, fontFamily:"'Playfair Display',Georgia,serif", lineHeight:1.1 }}>{i+1}</div>
          </button>
        ))}
        {days < 7 && (
          <button onClick={()=>setDays(d=>d+1)} style={{ minWidth:52, height:52, borderRadius:"50%", background:WHITE, border:`1.5px dashed ${BORDER}`, color:"#ccc", fontSize:24, cursor:"pointer", flexShrink:0 }}>+</button>
        )}
      </div>

      {/* Meal slots */}
      {MEAL_SLOTS.map(slot => {
        const k   = slotKey(activeDay, slot.id);
        const val = plan[k];
        const isEd = editing === k;
        return (
          <div key={slot.id} style={{ marginBottom:10 }}>
            <div style={{ fontSize:10, fontWeight:700, fontFamily:"'Nunito',sans-serif", color:HOT, textTransform:"uppercase", letterSpacing:"1px", marginBottom:5, display:"flex", alignItems:"center", gap:5 }}>
              <span>{slot.icon}</span>{slot.label}
            </div>
            {isEd ? (
              <div style={{ display:"flex", gap:8 }}>
                <input
                  autoFocus
                  value={editVal}
                  onChange={e=>setEditVal(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter") commit(); if(e.key==="Escape") setEditing(null); }}
                  placeholder="e.g. Hash Kitchen, hotel brunch..."
                  style={{ flex:1, border:`1.5px solid ${HOT}`, borderRadius:12, padding:"11px 14px", fontFamily:"'Nunito',sans-serif", fontSize:13, background:"#fdf8fb", color:DARK, outline:"none", boxSizing:"border-box" }}
                />
                <button onClick={commit} style={{ ...btn1, width:"auto", padding:"11px 18px", borderRadius:12, fontSize:13 }}>Save</button>
              </div>
            ) : val ? (
              <button onClick={()=>startEdit(activeDay,slot.id)} style={{ width:"100%", textAlign:"left", background:SOFT, border:`1.5px solid ${MID}`, borderRadius:14, padding:"13px 14px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:13, fontFamily:"'Nunito',sans-serif", fontWeight:600, color:DARK }}>{val}</span>
                <span style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif" }}>Edit ›</span>
              </button>
            ) : (
              <button onClick={()=>startEdit(activeDay,slot.id)} style={{ width:"100%", textAlign:"left", background:"#fdf4f8", border:`1.5px dashed ${MID}`, borderRadius:14, padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:12, fontFamily:"'Nunito',sans-serif", color:"rgba(213,36,56,0.35)" }}>{slot.empty}</span>
                <span style={{ fontSize:22, color:MID, lineHeight:1 }}>+</span>
              </button>
            )}
          </div>
        );
      })}

      {hasAny(activeDay) && (
        <button onClick={()=>clearDay(activeDay)} style={{ background:"none", border:"none", color:"#ccc", fontFamily:"'Nunito',sans-serif", fontSize:11, cursor:"pointer", marginTop:4, padding:0 }}>
          Clear Day {activeDay+1}
        </button>
      )}
    </div>
  );
}

// ─── Collapsible section wrapper ──────────────────────────────────────────────
function Section({ title, children, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div style={{ marginBottom:12 }}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
        background:WHITE, border:`1.5px solid ${BORDER}`, borderRadius:open?`14px 14px 0 0`:14,
        padding:"14px 16px", cursor:"pointer", textAlign:"left",
      }}>
        <div style={{ fontSize:15, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{title}</div>
        <span style={{ color:HOT, fontSize:18, fontWeight:700, transform:open?"rotate(90deg)":"none", transition:"transform 0.2s" }}>›</span>
      </button>
      {open && (
        <div style={{ border:`1.5px solid ${BORDER}`, borderTop:"none", borderRadius:`0 0 14px 14px`, padding:"16px 14px", background:"#fdf8fb" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main ProfileTab ──────────────────────────────────────────────────────────
export default function ProfileTab({ user, onLogout, cart, groupSize }) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.name);
  const expSaved = (() => { try { return JSON.parse(localStorage.getItem(`bh_exp_saved_${user.id}`) || "[]").length; } catch { return 0; } })();
  const ROLE_MAP = { bride:"The Bride", moh:"Maid of Honor", guest:"Bride Tribe" };

  return (
    <div>
      {/* ── Profile header ── */}
      <div style={{ borderRadius:22, padding:"26px 18px", background:`linear-gradient(135deg,${SOFT},${MID})`, border:`1.5px solid ${MID}`, marginBottom:16, textAlign:"center" }}>
        <div style={{ width:68, height:68, borderRadius:"50%", background:`linear-gradient(135deg,#f472b0,${HOT})`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", boxShadow:`0 6px 22px rgba(213,36,56,0.25)`, border:`3px solid ${WHITE}` }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </div>
        {editing ? (
          <div style={{ display:"flex", gap:8, justifyContent:"center", alignItems:"center", marginBottom:8 }}>
            <input value={displayName} onChange={e=>setDisplayName(e.target.value)} style={{ ...IN, maxWidth:180, padding:"8px 12px", textAlign:"center" }} />
            <button onClick={()=>setEditing(false)} style={{ ...BP, padding:"8px 14px", fontSize:12 }}>Save</button>
          </div>
        ) : (
          <div style={{ fontSize:20, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:4, color:DARK }}>
            {displayName} <button onClick={()=>setEditing(true)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:HOT, verticalAlign:"middle" }}>✏️</button>
          </div>
        )}
        <div style={{ fontSize:13, color:HOT, fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>{ROLE_MAP[user.role]||"Bach Tribe"}</div>
        <div style={{ fontSize:11, color:`rgba(45,10,24,0.5)`, fontFamily:"'Nunito',sans-serif", marginTop:4 }}>{user.email}</div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        {[["Cart Items",String(cart.length)],["Experiences Saved",String(expSaved)]].map(([label,val])=>(
          <div key={label} style={{ ...C, textAlign:"center", padding:"14px 10px" }}>
            <div style={{ fontSize:20, fontWeight:900, color:HOT, fontFamily:"'Playfair Display',Georgia,serif" }}>{val}</div>
            <div style={{ fontSize:10, color:"#bbb", fontFamily:"'Nunito',sans-serif" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── My Trips ── */}
      <SH title="My Trips" />
      {[
        { dest:"Nashville", emoji:"🎸", dates:"Jun 14–17", members:8,  status:"Planning" },
        { dest:"Miami",     emoji:"🌴", dates:"Aug 2–5",  members:10, status:"Saved"    },
      ].map((t,i) => (
        <div key={i} style={{ ...C, marginBottom:10, display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ fontSize:30 }}>{t.emoji}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{t.dest} Bachelorette</div>
            <div style={{ fontSize:12, color:HOT, fontFamily:"'Nunito',sans-serif", marginTop:2, opacity:0.75 }}>{t.dates} · {t.members} ladies</div>
          </div>
          <div style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, background:t.status==="Planning"?`rgba(46,125,50,0.1)`:SOFT, color:t.status==="Planning"?GREEN:HOT, border:`1px solid ${t.status==="Planning"?"rgba(46,125,50,0.25)":MID}`, fontFamily:"'Nunito',sans-serif" }}>{t.status}</div>
        </div>
      ))}

      {/* ── Meal Planner (members only) ── */}
      {user.role !== "guest" && (
        <Section title="🍽️ Meal Planner" defaultOpen>
          <MealPlannerSection user={user} />
        </Section>
      )}

      {/* ── Group Polls ── */}
      <Section title="Group Polls">
        <PollsSection user={user} />
      </Section>

      {/* ── Budget Calculator ── */}
      <Section title="Budget Calculator">
        <BudgetSection groupSize={groupSize || 8} />
      </Section>

      {/* ── Share Media ── */}
      <Section title="Share Your Memories">
        <MediaSection user={user} />
      </Section>

      {/* ── Settings ── */}
      <SH title="Settings" sub={null} />
      {[
        ["Deal Alerts","Flights, Airbnb & Vrbo price drops",true,true],
        ["Email Updates","Weekly destination deals",true,false],
        ["Payment Methods","Add cards for fast checkout",false,false],
        ["Privacy","Manage your data",false,false],
      ].map(([label,sub,hasToggle,isOn])=>(
        <div key={label} style={{ ...C, marginBottom:8, display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, fontFamily:"'Nunito',sans-serif", color:DARK }}>{label}</div>
            <div style={{ fontSize:11, color:"#bbb", fontFamily:"'Nunito',sans-serif" }}>{sub}</div>
          </div>
          {hasToggle
            ? <div style={{ width:40, height:22, borderRadius:50, background:isOn?HOT:SOFT, border:`1.5px solid ${isOn?HOT:MID}`, display:"flex", alignItems:"center", padding:2, cursor:"pointer" }}><div style={{ width:17, height:17, borderRadius:"50%", background:WHITE, marginLeft:isOn?17:0, transition:"margin 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.15)" }} /></div>
            : <span style={{ color:HOT, fontSize:18 }}>›</span>
          }
        </div>
      ))}

      <button onClick={onLogout} style={{ ...BS, width:"100%", marginTop:20, padding:"13px", fontSize:14, color:PUNCH, border:`1.5px solid rgba(213,36,56,0.3)`, background:`rgba(213,36,56,0.06)` }}>Sign Out</button>
    </div>
  );
}
