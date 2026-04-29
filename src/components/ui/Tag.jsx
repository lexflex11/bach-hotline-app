import React from 'react';
import { SOFT, HOT, MID } from '../../constants/colors.js';

export default function Tag({ label }) {
  return <span style={{ display:"inline-block", padding:"3px 9px", borderRadius:20, fontSize:10, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, background:SOFT, color:HOT, border:`1.5px solid ${MID}` }}>{label}</span>;
}
