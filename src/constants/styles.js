import { WHITE, SOFT, MID, HOT, PUNCH, DARK, BORDER } from './colors.js';

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
export const C  = { background:WHITE, border:`1.5px solid ${BORDER}`, borderRadius:18, padding:"14px 13px", boxShadow:`0 2px 10px rgba(230,101,130,0.07)` };
export const BP = { background:"#F496C2", color:WHITE, border:"none", borderRadius:50, padding:"11px 22px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:`0 3px 12px rgba(244,150,194,0.35)`, transition:"transform .15s, box-shadow .15s" };
export const BS = { background:"#F496C2", color:WHITE, border:"none", borderRadius:50, padding:"9px 18px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, fontWeight:700, cursor:"pointer", boxShadow:`0 3px 12px rgba(244,150,194,0.30)`, transition:"transform .15s" };
export const BG = { background:"#F496C2", color:WHITE, border:"none", borderRadius:50, padding:"6px 14px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, fontWeight:700, cursor:"pointer", boxShadow:`0 2px 8px rgba(244,150,194,0.25)`, transition:"transform .15s" };
export const IN = { width:"100%", padding:"10px 14px", borderRadius:50, background:SOFT, border:`1.5px solid ${BORDER}`, color:DARK, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, outline:"none", boxSizing:"border-box" };
export const SM = { background:SOFT, border:`1.5px solid ${MID}`, color:HOT, borderRadius:8, width:28, height:28, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" };
