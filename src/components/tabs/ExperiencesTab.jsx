import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C, BP } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

export default function ExperiencesTab({ groupSize }) {
  const [city,  setCity]  = useState("");
  const [date,  setDate]  = useState("");
  const [vibe,  setVibe]  = useState("");

  const selectedDest = DESTS.find(d => d.id === city);

  const VIBES = [
    { id:"",          label:"Any vibe" },
    { id:"brunch",    label:"🥂 Drag Brunch" },
    { id:"boat",      label:"⛵ Boat / Yacht" },
    { id:"spa",       label:"💆 Spa Day" },
    { id:"nightlife", label:"🪩 Nightlife" },
    { id:"outdoor",   label:"🌅 Outdoor Adventure" },
    { id:"classes",   label:"💃 Dance / Classes" },
    { id:"food",      label:"🍕 Food Tour" },
    { id:"show",      label:"🎭 Live Show" },
  ];

  function findExperiences() {
    if (!city) return;
    const dest = selectedDest?.name || city;
    const query = [vibe ? VIBES.find(v => v.id === vibe)?.label.replace(/[^a-zA-Z ]/g,"").trim() : "bachelorette", "experience", dest].join(" ");
    const url = `https://www.viator.com/searchResults/all?text=${encodeURIComponent(query)}&startDate=${date || ""}&paxMix=A_${groupSize || 4}`;
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
      <SH title="Find Experiences" sub="Activities, shows & adventures for your crew" />

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

      {/* Vibe */}
      <div style={{ ...C, marginBottom: 12 }}>
        <div style={labelStyle}>What kind of experience?</div>
        <select
          value={vibe}
          onChange={e => setVibe(e.target.value)}
          style={{ ...inputStyle, appearance: "none" }}
        >
          {VIBES.map(v => (
            <option key={v.id} value={v.id}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div style={{ ...C, marginBottom: 12 }}>
        <div style={labelStyle}>Date</div>
        <input
          type="date" value={date}
          onChange={e => setDate(e.target.value)}
          style={inputStyle}
        />
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
              {vibe ? ` · ${VIBES.find(v=>v.id===vibe)?.label}` : ""}
              {date ? ` · ${date}` : " · flexible date"}
            </div>
            <button onClick={findExperiences} style={{
              width: "100%",
              background: `linear-gradient(135deg,${HOT},${PUNCH})`,
              color: WHITE, border: "none", borderRadius: 14,
              padding: "15px", cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 800,
              letterSpacing: "0.3px",
            }}>
              🎉 Find Best Experiences
            </button>
            <div style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans',sans-serif", marginTop: 8, textAlign: "center" }}>
              We'll surface the best activities & experiences for your group
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>🎉</div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Playfair Display',Georgia,serif", color: DARK }}>Pick a destination above</div>
            <div style={{ fontSize: 11, color: HOT, fontFamily: "'DM Sans',sans-serif", marginTop: 4, opacity: 0.75 }}>
              Then we'll find the best experiences for {groupSize} people
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
