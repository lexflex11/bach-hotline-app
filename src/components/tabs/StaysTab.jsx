import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C, BP } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

export default function StaysTab({ groupSize }) {
  const [city,      setCity]      = useState("");
  const [checkIn,   setCheckIn]   = useState("");
  const [checkOut,  setCheckOut]  = useState("");

  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const diff = (new Date(checkOut) - new Date(checkIn)) / 86400000;
    return diff > 0 ? diff : 0;
  })();

  const selectedDest = DESTS.find(d => d.id === city);

  function findStays() {
    if (!city) return;
    const dest = encodeURIComponent(selectedDest?.name || city);
    const url = checkIn && checkOut
      ? `https://www.airbnb.com/s/${dest}/homes?checkin=${checkIn}&checkout=${checkOut}&adults=${groupSize || 4}`
      : `https://www.airbnb.com/s/${dest}/homes?adults=${groupSize || 4}`;
    window.open(url, "_blank");
  }

  const SM = {
    background: SOFT, border: `1.5px solid ${MID}`, color: HOT,
    borderRadius: 8, width: 28, height: 28, cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 15,
    display: "flex", alignItems: "center", justifyContent: "center",
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: `1.5px solid ${BORDER}`, fontFamily: "'DM Sans',sans-serif",
    fontSize: 13, color: DARK, background: WHITE, boxSizing: "border-box",
    outline: "none",
  };

  const labelStyle = {
    fontSize: 10, fontWeight: 700, color: HOT,
    fontFamily: "'DM Sans',sans-serif",
    textTransform: "uppercase", letterSpacing: 1, marginBottom: 6,
  };

  return (
    <div>
      <SH title="Find Your Stay" sub="Search real availability for your crew" />

      {/* Destination */}
      <div style={{ ...C, marginBottom: 12 }}>
        <div style={labelStyle}>Destination</div>
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          style={{ ...inputStyle, appearance: "none" }}
        >
          <option value="">Choose a city…</option>
          {DESTS.filter(d => d.id !== "all").map(d => (
            <option key={d.id} value={d.id}>{d.emoji} {d.name}</option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div style={{ ...C, marginBottom: 12, display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>Check-In</div>
          <input
            type="date" value={checkIn}
            onChange={e => setCheckIn(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>Check-Out</div>
          <input
            type="date" value={checkOut}
            onChange={e => setCheckOut(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Group + nights summary */}
      <div style={{ ...C, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={labelStyle}>Group</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: PUNCH, fontFamily: "'Playfair Display',Georgia,serif", marginTop: 2 }}>
            {groupSize} 👯
          </div>
        </div>
        {nights > 0 && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: HOT, fontFamily: "'DM Sans',sans-serif" }}>
              {nights} night{nights !== 1 ? "s" : ""}
            </div>
            <div style={{ fontSize: 11, color: "#bbb", fontFamily: "'DM Sans',sans-serif" }}>
              {checkIn} → {checkOut}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ ...C, background: SOFT, border: `1.5px solid ${MID}`, marginBottom: 14 }}>
        {city ? (
          <>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Playfair Display',Georgia,serif", color: DARK, marginBottom: 4 }}>
              {selectedDest?.emoji} {selectedDest?.name}
            </div>
            <div style={{ fontSize: 11, color: HOT, fontFamily: "'DM Sans',sans-serif", marginBottom: 14, opacity: 0.85 }}>
              {groupSize} guests
              {nights > 0 ? ` · ${nights} nights · ${checkIn} → ${checkOut}` : " · flexible dates"}
            </div>
            <button onClick={findStays} style={{
              width: "100%",
              background: `linear-gradient(135deg,#f472b0,${HOT})`,
              color: WHITE, border: "none", borderRadius: 14,
              padding: "15px", cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 800,
              letterSpacing: "0.3px",
            }}>
              🏠 Find Best Stays
            </button>
            <div style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans',sans-serif", marginTop: 8, textAlign: "center" }}>
              We'll surface the best available options for your group
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>🏠</div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Playfair Display',Georgia,serif", color: DARK }}>Pick a destination above</div>
            <div style={{ fontSize: 11, color: HOT, fontFamily: "'DM Sans',sans-serif", marginTop: 4, opacity: 0.75 }}>
              Then we'll find the best stays for {groupSize} people
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
