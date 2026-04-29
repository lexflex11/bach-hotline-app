import React from 'react';
import { DARK, HOT } from '../../constants/colors.js';

export default function SH({ title, sub, weight }) {
  return (
    <div style={{ marginBottom:16 }}>
      <h2 style={{ fontSize:20, fontWeight:weight||700, letterSpacing:"-0.4px", margin:0, fontFamily:"'Plus Jakarta Sans',sans-serif", color:DARK }}>{title}</h2>
      {sub && <p style={{ fontSize:12, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", marginTop:3, margin:"3px 0 0" }}>{sub}</p>}
    </div>
  );
}
