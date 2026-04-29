import React, { useState, useRef } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C, BP, BS, IN } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';

const MOMENTS = [
  { id:"gettingready", label:" Getting Ready"   },
  { id:"pool",         label:" Pool Party"       },
  { id:"nightout",     label:" Night Out"        },
  { id:"brunch",       label:" Brunch"           },
  { id:"activities",   label:" Activities"       },
  { id:"travel",       label:" Travel"           },
  { id:"spa",          label:" Spa Day"          },
  { id:"other",        label:" Other"            },
];

//  Account gate 
function AccountGate({ onSignUp }) {
  return (
    <div style={{ textAlign:"center", padding:"48px 24px" }}>
      <div style={{ fontSize:52, marginBottom:16 }}></div>
      <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:24, fontWeight:700, color:HOT, margin:"0 0 10px", lineHeight:1.2 }}>
        Pics or It Didn't Happen
      </h2>
      <p style={{ fontSize:13, color:"#888", fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:1.7, marginBottom:28 }}>
        Share your bachelorette memories with the Bach Hotline community. Create a free account to upload photos and videos from your trip.
      </p>
      <button onClick={onSignUp} style={{
        background:`linear-gradient(135deg,#f472b0,${HOT})`, color:WHITE, border:"none",
        borderRadius:50, padding:"13px 32px", fontFamily:"'Plus Jakarta Sans',sans-serif",
        fontSize:14, fontWeight:700, cursor:"pointer", width:"100%", maxWidth:300,
      }}>
        Create Free Account
      </button>
      <p style={{ fontSize:11, color:"#bbb", fontFamily:"'Plus Jakarta Sans',sans-serif", marginTop:14 }}>
        Already have an account? Sign in from the home screen.
      </p>
    </div>
  );
}

//  Photo thumbnail 
function MediaThumb({ item, onRemove }) {
  return (
    <div style={{ position:"relative", aspectRatio:"1/1", borderRadius:10, overflow:"hidden", background:SOFT }}>
      <img src={item.url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
      {item.isVideo && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}></div>
        </div>
      )}
      <button onClick={()=>onRemove(item.id)} style={{
        position:"absolute", top:4, right:4, width:22, height:22, borderRadius:"50%",
        background:"rgba(0,0,0,0.55)", border:"none", cursor:"pointer",
        color:WHITE, fontSize:12, display:"flex", alignItems:"center", justifyContent:"center",
      }}>×</button>
    </div>
  );
}

//  Main tab 
export default function MediaTab({ user, onSignUp }) {
  if (!user || user.id === "g") return <AccountGate onSignUp={onSignUp} />;

  const fileRef  = useRef();
  const [dest,    setDest]    = useState("");
  const [moment,  setMoment]  = useState("");
  const [caption, setCaption] = useState("");
  const [files,   setFiles]   = useState([]);   // { id, url, name, isVideo }
  const [submitted, setSubmitted] = useState([]);
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);

  const processFiles = rawFiles => {
    Array.from(rawFiles).forEach(file => {
      const reader = new FileReader();
      const isVideo = file.type.startsWith("video/");
      reader.onload = ev => {
        setFiles(p => [...p, { id: Date.now() + Math.random(), url: ev.target.result, name: file.name, isVideo }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = e => {
    e.preventDefault(); setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeFile = id => setFiles(p => p.filter(f => f.id !== id));

  const canSubmit = dest && moment && files.length > 0;

  const submit = () => {
    if (!canSubmit) return;
    const destObj = DESTS.find(d => d.id === dest);
    const momentObj = MOMENTS.find(m => m.id === moment);
    setSubmitted(p => [...p, {
      id: Date.now(),
      dest: destObj?.name || dest,
      destEmoji: destObj?.emoji || "",
      moment: momentObj?.label || moment,
      caption,
      files: [...files],
      user: user.name,
      avatar: user.avatar,
      date: new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }),
    }]);
    setDest(""); setMoment(""); setCaption(""); setFiles([]);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div style={{ paddingBottom:24 }}>

      {/*  Hero  */}
      <div style={{
        borderRadius:22, padding:"22px 18px", marginBottom:16, textAlign:"center",
        background:`linear-gradient(135deg,${SOFT} 0%,${MID} 100%)`,
        border:`1.5px solid ${MID}`,
      }}>
        <div style={{ fontSize:11, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:8 }}>
          Bach Hotline Community
        </div>
        <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:900, margin:"0 0 6px", color:DARK }}>
          Pics or It Didn't Happen <span style={{ fontStyle:"normal" }}></span>
        </h2>
        <p style={{ fontSize:12, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", margin:0, opacity:0.85, lineHeight:1.6 }}>
          You lived it. You filmed it. Drop your pics & vids — your memories help other bach crews plan smarter and party harder.
        </p>
      </div>

      {/*  Success banner  */}
      {success && (
        <div style={{ padding:"12px 16px", borderRadius:14, background:"rgba(46,125,50,0.1)", border:"1.5px solid rgba(46,125,50,0.35)", marginBottom:16, textAlign:"center", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          <div style={{ fontSize:20, marginBottom:4 }}></div>
          <div style={{ fontSize:13, fontWeight:700, color:"#2e7d32" }}>Submitted! Thanks for sharing.</div>
          <div style={{ fontSize:11, color:"#888", marginTop:2 }}>Your content could be featured in the Bach Hotline community.</div>
        </div>
      )}

      {/*  Upload form  */}
      <div style={{ ...C, marginBottom:14 }}>

        {/* Select trip */}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:700, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.8px", display:"block", marginBottom:6 }}>
            Select Your Trip *
          </label>
          <select
            value={dest}
            onChange={e => setDest(e.target.value)}
            style={{ ...IN, appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23e66582' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center", paddingRight:32 }}
          >
            <option value="">Choose a destination…</option>
            {DESTS.map(d => <option key={d.id} value={d.id}>{d.emoji} {d.name}</option>)}
          </select>
        </div>

        {/* Select moment */}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:700, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.8px", display:"block", marginBottom:6 }}>
            The Moment *
          </label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {MOMENTS.map(m => (
              <button key={m.id} onClick={() => setMoment(m.id)} style={{
                padding:"9px 10px", border:moment===m.id?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,
                borderRadius:12, background:moment===m.id?SOFT:WHITE, cursor:"pointer",
                fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, fontWeight:600,
                color:moment===m.id?HOT:DARK, textAlign:"left", transition:"all 0.15s",
              }}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upload area */}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:700, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.8px", display:"block", marginBottom:6 }}>
            Media *
          </label>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border:`2px dashed ${dragging ? HOT : BORDER}`,
              borderRadius:16, padding:"32px 20px", textAlign:"center",
              background:dragging ? SOFT : "#fdf8fb",
              cursor:"pointer", transition:"all 0.2s",
            }}
          >
            <div style={{ fontSize:36, marginBottom:8 }}></div>
            <div style={{ fontSize:14, fontWeight:700, color:DARK, fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:4 }}>Upload Photos & Videos</div>
            <div style={{ fontSize:12, color:"#aaa", fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:14 }}>Drag and drop here or</div>
            <div style={{
              display:"inline-block", padding:"9px 22px", borderRadius:50,
              border:`1.5px solid ${DARK}`, fontFamily:"'Plus Jakarta Sans',sans-serif",
              fontSize:13, fontWeight:700, color:DARK, background:WHITE,
            }}>
              Select from your device
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,video/*"
              style={{ display:"none" }}
              onChange={e => processFiles(e.target.files)}
            />
          </div>
        </div>

        {/* Preview grid */}
        {files.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
            {files.map(f => <MediaThumb key={f.id} item={f} onRemove={removeFile} />)}
          </div>
        )}

        {/* Caption */}
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, fontWeight:700, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.8px", display:"block", marginBottom:6 }}>
            Caption (optional)
          </label>
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Tell us about this moment "
            rows={3}
            style={{ ...IN, resize:"none", lineHeight:1.5 }}
          />
        </div>

        <p style={{ fontSize:11, color:"#bbb", fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:14, lineHeight:1.5 }}>
          If it makes the cut, your content could be featured in the Bach Hotline community to help other groups plan their trip.
        </p>

        <button onClick={submit} disabled={!canSubmit} style={{
          ...BP, width:"100%", padding:"14px", fontSize:14,
          opacity:canSubmit ? 1 : 0.45, cursor:canSubmit ? "pointer" : "not-allowed",
        }}>
          Submit
        </button>
      </div>

      {/*  Past submissions  */}
      {submitted.length > 0 && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
            <div style={{ flex:1, height:1.5, background:MID, borderRadius:2 }}/>
            <div style={{ fontSize:11, fontWeight:700, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:"1.5px", textTransform:"uppercase", whiteSpace:"nowrap" }}>Your Submissions</div>
            <div style={{ flex:1, height:1.5, background:MID, borderRadius:2 }}/>
          </div>

          {submitted.map(s => (
            <div key={s.id} style={{ ...C, marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ fontSize:24 }}>{s.avatar}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:DARK, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{s.user}</div>
                  <div style={{ fontSize:11, color:"#aaa", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{s.destEmoji} {s.dest} · {s.moment} · {s.date}</div>
                </div>
              </div>
              {s.files.length > 0 && (
                <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(s.files.length,3)},1fr)`, gap:6, marginBottom:8 }}>
                  {s.files.map(f => (
                    <div key={f.id} style={{ aspectRatio:"1/1", borderRadius:10, overflow:"hidden", background:SOFT }}>
                      <img src={f.url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                    </div>
                  ))}
                </div>
              )}
              {s.caption && (
                <div style={{ fontSize:13, color:DARK, fontFamily:"'Plus Jakarta Sans',sans-serif", fontStyle:"italic", opacity:0.85 }}>"{s.caption}"</div>
              )}
              <div style={{ marginTop:8, padding:"6px 10px", borderRadius:8, background:SOFT, display:"inline-block", fontSize:10, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700 }}>
                 Submitted for review
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
