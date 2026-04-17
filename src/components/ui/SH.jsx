import React from 'react';
import { DARK, HOT } from '../../constants/colors.js';

export default function SH({ title, sub }) {
  return (
    <div style={{ marginBottom:16 }}>
      <h2 style={{ fontSize:20, fontWeight:700, letterSpacing:"-0.4px", margin:0, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{title}</h2>
      {sub && <p style={{ fontSize:12, color:HOT, fontFamily:"'Nunito',sans-serif", marginTop:3, margin:"3px 0 0" }}>{sub}</p>}
    </div>
  );
}
