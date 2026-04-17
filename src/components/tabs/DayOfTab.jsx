import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C, BP, BS } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';
import Chip from '../ui/Chip.jsx';

export default function DayOfTab() {
  const [dest, setDest] = useState("nashville");
  const [currentStop, setCurrentStop] = useState(0);

  const ITINERARIES = {
    nashville:[
      { time:"2:00 PM", name:"Check into the Airbnb",       icon:"🏠", address:"123 Music Row, Nashville TN", note:"Code: 4821. Closest parking: Nissan Stadium lot.", dur:60 },
      { time:"4:00 PM", name:"Getting ready together",       icon:"💄", address:"At the Airbnb",               note:"Allow 90 mins. Designate one bathroom per pair.", dur:90 },
      { time:"6:00 PM", name:"Welcome dinner — The Gulch",   icon:"🥂", address:"1214 3rd Ave S, Nashville TN",note:"Reservation under 'Jessica'. Mention bachelorette for a surprise!", dur:120 },
      { time:"8:30 PM", name:"Broadway bar crawl kicks off", icon:"🎸", address:"Lower Broadway, Nashville TN", note:"Start at Honky Tonk Central. Work your way down to Luke's.", dur:180 },
      { time:"11:30 PM",name:"Late night hot chicken run",   icon:"🍗", address:"Prince's Hot Chicken, Nashville",note:"Nashville tradition. Get the medium heat, trust us.", dur:45 },
      { time:"1:00 AM", name:"Head back to the Airbnb",      icon:"🏠", address:"123 Music Row, Nashville TN", note:"Order Ubers NOW before surge pricing. Split into 2 cars.", dur:0  },
    ],
    miami:[
      { time:"1:00 PM", name:"Airbnb check-in",              icon:"🌴", address:"Collins Ave, Miami Beach FL",  note:"Pool opens at 12. Rooftop access until 10pm.", dur:60 },
      { time:"3:00 PM", name:"South Beach time",             icon:"🏖️", address:"Ocean Drive, Miami Beach FL",  note:"Chairs at 9th Street. Water is COLD in the morning.", dur:180 },
      { time:"7:00 PM", name:"Dinner at Catch Miami",        icon:"🦞", address:"1901 Collins Ave, Miami FL",   note:"Res under 'Bach Hotline'. Ask for the rooftop.", dur:120 },
      { time:"10:00 PM",name:"LIV at Fontainebleau",         icon:"🎰", address:"4441 Collins Ave, Miami FL",   note:"Be on the list — tell door you're a bachelorette party.", dur:240 },
    ],
  };

  const stops = ITINERARIES[dest] || ITINERARIES.nashville;
  const currentItem = stops[currentStop];

  const shareAddress = (address) => {
    if (navigator.share) {
      navigator.share({ title:"Next stop!", text:address });
    } else {
      navigator.clipboard?.writeText(address);
    }
  };

  return (
    <div>
      <SH title="Day-Of Mode" sub="Live mode for the day — tap to navigate each stop" />

      {/* Dest selector */}
      <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:14,paddingBottom:4,scrollbarWidth:"none"}}>
        {DESTS.filter(d=>ITINERARIES[d.id]).map(d=>(
          <Chip key={d.id} label={`${d.emoji} ${d.name}`} active={dest===d.id} onClick={()=>{setDest(d.id);setCurrentStop(0);}} />
        ))}
      </div>

      {/* Current stop hero */}
      <div style={{borderRadius:20,padding:"22px 18px",background:`linear-gradient(135deg,${SOFT},${MID})`,border:`1.5px solid ${MID}`,marginBottom:14,textAlign:"center"}}>
        <div style={{fontSize:11,color:HOT,fontFamily:"'Nunito',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>
          Stop {currentStop+1} of {stops.length}
        </div>
        <div style={{fontSize:36,marginBottom:8}}>{currentItem.icon}</div>
        <div style={{fontSize:20,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>{currentItem.name}</div>
        <div style={{fontSize:14,color:HOT,fontFamily:"'Nunito',sans-serif",fontWeight:600,marginBottom:6}}>🕐 {currentItem.time}</div>
        <div style={{fontSize:12,color:DARK,fontFamily:"'Nunito',sans-serif",opacity:0.75,marginBottom:14}}>{currentItem.address}</div>
        {currentItem.note && (
          <div style={{background:WHITE,borderRadius:10,padding:"10px 12px",marginBottom:14,fontSize:12,color:DARK,fontFamily:"'Nunito',sans-serif",textAlign:"left",lineHeight:1.5}}>
            💡 <strong>MOH tip:</strong> {currentItem.note}
          </div>
        )}
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
          <a href={`https://maps.google.com/maps?q=${encodeURIComponent(currentItem.address)}`} target="_blank" rel="noreferrer" style={{...BP,textDecoration:"none",display:"inline-block",fontSize:12,padding:"9px 16px"}}>
            🗺️ Open in Maps
          </a>
          <button onClick={()=>shareAddress(currentItem.address)} style={{...BS,fontSize:12,padding:"9px 16px"}}>
            📋 Copy Address
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <button onClick={()=>setCurrentStop(Math.max(0,currentStop-1))} disabled={currentStop===0} style={{...BS,flex:1,fontSize:12,opacity:currentStop===0?0.3:1}}>← Previous</button>
        <button onClick={()=>setCurrentStop(Math.min(stops.length-1,currentStop+1))} disabled={currentStop===stops.length-1} style={{...BP,flex:2,fontSize:12,opacity:currentStop===stops.length-1?0.3:1}}>Next Stop →</button>
      </div>

      {/* Full itinerary list */}
      <SH title="Full Schedule" sub={null} />
      {stops.map((stop,i)=>(
        <button key={i} onClick={()=>setCurrentStop(i)} style={{...C,display:"flex",alignItems:"center",gap:12,cursor:"pointer",width:"100%",marginBottom:8,textAlign:"left",background:currentStop===i?SOFT:WHITE,border:currentStop===i?`2px solid ${HOT}`:`1.5px solid ${BORDER}`}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:currentStop===i?HOT:SOFT,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{stop.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:400,fontFamily:"'Playfair Display',Georgia,serif",color:DARK}}>{stop.name}</div>
            <div style={{fontSize:11,color:HOT,fontFamily:"'Nunito',sans-serif",marginTop:2,opacity:0.75}}>{stop.time} · {stop.address}</div>
          </div>
          {currentStop===i && <span style={{color:HOT,fontSize:14}}>📍</span>}
        </button>
      ))}
    </div>
  );
}
