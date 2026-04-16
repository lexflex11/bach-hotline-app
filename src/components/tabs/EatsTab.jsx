import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C, BP } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

export default function EatsTab({ groupSize }) {
  const [city,    setCity]    = useState("");
  const [date,    setDate]    = useState("");
  const [time,    setTime]    = useState("");

  const selectedDest = DESTS.find(d => d.id === city);

  function findEats() {
    if (!city) return;
    const dest = encodeURIComponent(selectedDest?.name || city);
    const query = encodeURIComponent(`bachelorette party restaurants brunch ${selectedDest?.name || city}`);
    const url = `https://www.opentable.com/s/?covers=${groupSize || 4}&dateTime=${date || ""}T${time || "19:00"}&metroId=&term=${encodeURIComponent(selectedDest?.name || city)}&latitude=&longitude=&radius=5&sort=1&lang=en-US`;
    window.open(url, "_blank");
  }

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
      <SH title="Find Restaurants & Brunch" sub="The best tables for your group" />

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

      {/* Date + Time */}
      <div style={{ ...C, marginBottom: 12, display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>Date</div>
          <input
            type="date" value={date}
            onChange={e => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>Time</div>
          <input
            type="time" value={time}
            onChange={e => setTime(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Group size */}
      <div style={{ ...C, marginBottom: 14 }}>
        <div style={labelStyle}>Group Size</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: PUNCH, fontFamily: "'Playfair Display',Georgia,serif" }}>
          {groupSize} 👯
        </div>
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
              {date ? ` · ${date}` : " · flexible date"}
              {time ? ` at ${time}` : ""}
            </div>
            <button onClick={findEats} style={{
              width: "100%",
              background: `linear-gradient(135deg,#f472b0,${HOT})`,
              color: WHITE, border: "none", borderRadius: 14,
              padding: "15px", cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 800,
              letterSpacing: "0.3px",
            }}>
              🍽️ Find Best Tables
            </button>
            <div style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans',sans-serif", marginTop: 8, textAlign: "center" }}>
              We'll find the best restaurants & brunch spots for your group
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>🍽️</div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Playfair Display',Georgia,serif", color: DARK }}>Pick a destination above</div>
            <div style={{ fontSize: 11, color: HOT, fontFamily: "'DM Sans',sans-serif", marginTop: 4, opacity: 0.75 }}>
              Then we'll find the best tables for {groupSize} people
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
