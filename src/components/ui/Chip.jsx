import React from 'react';
import { WHITE, HOT, BORDER } from '../../constants/colors.js';

export default function Chip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ flexShrink:0, padding:"6px 13px", borderRadius:50, border:active?`2px solid ${HOT}`:`1.5px solid ${BORDER}`, background:active?HOT:WHITE, color:active?WHITE:HOT, fontFamily:"'Nunito',sans-serif", fontSize:10, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.18s", boxShadow:active?`0 3px 10px rgba(230,101,130,0.28)`:"none" }}>
      {label}
    </button>
  );
}
