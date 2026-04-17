import React from 'react';
import { GREEN } from '../../constants/colors.js';

// ─── COMMISSION BANNER ────────────────────────────────────────────────────────
// Shown at top of Flights and Stays tabs — explains affiliate model to admin
export default function CommissionNote({ platform, amount }) {
  return (
    <div style={{ background:`rgba(46,125,50,0.07)`, border:`1.5px solid rgba(46,125,50,0.2)`, borderRadius:12, padding:"10px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
      <span style={{ fontSize:20 }}></span>
      <div>
        <div style={{ fontSize:11, fontWeight:700, color:GREEN, fontFamily:"'Nunito',sans-serif" }}>
          You earn commission on every booking!
        </div>
        <div style={{ fontSize:11, color:"#555", fontFamily:"'Nunito',sans-serif", marginTop:2 }}>
          Sign up for free at <strong>{platform}</strong> affiliate program → earn 3–8% per booking automatically.
        </div>
      </div>
    </div>
  );
}
