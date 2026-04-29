import React, { useState } from 'react';
import { WHITE, SOFT, MID, HOT, PUNCH, DARK, BORDER, GOLD, GREEN } from '../../constants/colors.js';
import { C, BP, BS, IN } from '../../constants/styles.js';
import { DESTS, MOH_CHECKLIST } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

export default function MOHTab({ groupSize }) {
  const [checklist, setChecklist]     = useState(MOH_CHECKLIST);
  const [tripDate, setTripDate]       = useState("");
  const [tripDest, setTripDest]       = useState("");
  const [inviteText, setInviteText]   = useState("");
  const [showInvite, setShowInvite]   = useState(false);

  const toggle = (id) => setChecklist(p => p.map(item => item.id===id ? {...item,done:!item.done} : item));
  const done   = checklist.filter(i=>i.done).length;
  const pct    = Math.round((done/checklist.length)*100);

  const categories = [...new Set(MOH_CHECKLIST.map(i=>i.category))];

  const daysUntil = tripDate ? Math.max(0, Math.ceil((new Date(tripDate) - new Date()) / (1000*60*60*24))) : null;

  const generateInvite = () => {
    const dest = DESTS.find(d=>d.id===tripDest);
    const text = ` You're invited to the Bach!

 ${dest ? dest.name : "[Destination]"} Bachelorette Weekend
 ${tripDate || "[Date TBD]"}
 Group of ${groupSize}

You're officially part of the bride tribe — and this is going to be the best weekend of her life.

 More details coming soon via Bach Hotline
 Estimated cost: $[X] per person
 Theme: [Your Theme]

RSVP by replying to this message!

Powered by Bach Hotline `;
    setInviteText(text);
    setShowInvite(true);
  };

  return (
    <div>
      <SH title="MOH Command Center" sub="Your planning hub — keep everything on track" />

      {/* Countdown */}
      <div style={{...C,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:400,fontFamily:"'Plus Jakarta Sans',sans-serif",color:DARK,marginBottom:12}}> Trip Date</div>
        <input type="date" value={tripDate} onChange={e=>setTripDate(e.target.value)} style={{...IN,marginBottom:daysUntil!==null?10:0}} />
        {daysUntil !== null && (
          <div style={{textAlign:"center",padding:"12px",background:SOFT,borderRadius:12,border:`1.5px solid ${MID}`}}>
            <div style={{fontSize:11,color:HOT,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Days Until the Bach </div>
            <div style={{fontSize:44,fontWeight:900,color:PUNCH,fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:4}}>{daysUntil}</div>
          </div>
        )}
      </div>

      {/* Progress */}
      <div style={{...C,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:13,fontWeight:400,fontFamily:"'Plus Jakarta Sans',sans-serif",color:DARK}}> Planning Progress</div>
          <div style={{fontSize:14,fontWeight:900,color:pct>=80?GREEN:pct>=50?GOLD:PUNCH,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{pct}%</div>
        </div>
        <div style={{height:8,background:SOFT,borderRadius:50,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${HOT},${PUNCH})`,borderRadius:50,transition:"width 0.5s"}} />
        </div>
        <div style={{fontSize:11,color:HOT,fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:6,opacity:0.75}}>{done} of {checklist.length} tasks complete</div>
      </div>

      {/* Invite Generator */}
      <div style={{...C,marginBottom:12,background:SOFT,border:`1.5px solid ${MID}`}}>
        <div style={{fontSize:13,fontWeight:400,fontFamily:"'Plus Jakarta Sans',sans-serif",color:DARK,marginBottom:10}}> Digital Invite Generator</div>
        <select value={tripDest} onChange={e=>setTripDest(e.target.value)} style={{...IN,marginBottom:10}}>
          <option value="">Pick destination...</option>
          {DESTS.map(d=><option key={d.id} value={d.id}>{d.emoji} {d.name}</option>)}
        </select>
        <button onClick={generateInvite} style={{...BP,width:"100%",fontSize:12,padding:"10px"}}> Generate Invite Text</button>
        {showInvite && inviteText && (
          <div style={{marginTop:12}}>
            <textarea readOnly value={inviteText} style={{...IN,borderRadius:12,height:180,resize:"none",fontSize:12,lineHeight:1.6}} />
            <button onClick={()=>{navigator.clipboard?.writeText(inviteText);}} style={{...BS,width:"100%",marginTop:8,fontSize:12}}>Copy to Clipboard</button>
          </div>
        )}
      </div>

      {/* Checklist */}
      <SH title="The Complete Checklist" sub="Check off as you go — shared with the whole group" />
      {categories.map(cat=>(
        <div key={cat} style={{marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:700,color:PUNCH,fontFamily:"'Plus Jakarta Sans',sans-serif",textTransform:"uppercase",letterSpacing:1.5,marginBottom:8,paddingLeft:2}}>{cat}</div>
          {checklist.filter(i=>i.category===cat).map(item=>(
            <button key={item.id} onClick={()=>toggle(item.id)} style={{...C,display:"flex",alignItems:"center",gap:12,cursor:"pointer",width:"100%",marginBottom:6,padding:"11px 13px",textAlign:"left",background:item.done?"rgba(46,125,50,0.06)":WHITE,border:item.done?"1.5px solid rgba(46,125,50,0.3)":`1.5px solid ${BORDER}`}}>
              <div style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${item.done?GREEN:BORDER}`,background:item.done?GREEN:WHITE,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,color:WHITE,transition:"all 0.2s"}}>
                {item.done?"":""}
              </div>
              <div style={{fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",color:item.done?"#888":DARK,fontWeight:item.done?400:500,textDecoration:item.done?"line-through":"none"}}>{item.item}</div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
