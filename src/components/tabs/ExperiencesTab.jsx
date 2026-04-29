import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C, BP } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

//  Curated experiences per destination 
const EXPERIENCES = {
  miami: [
    { id:"mia-1", name:"Private Yacht Charter", category:"Boat/Yacht", priceRange:"$$$$", vibe:"Luxury · Water · Group-Friendly", rating:5.0, reviews:312, tags:["boat","yacht","luxury"],
      image:"https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80",
      images:["https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80","https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"],
      desc:"Sail Biscayne Bay on a private yacht with your whole crew. Includes a captain, open bar, and all the sunset views you can handle. The ultimate Miami bachelorette moment.",
      highlights:["Private yacht for your group","Open bar included","Captain & crew on board","Sunset views of the Miami skyline","Music & party setup"],
      whyWeLoveIt:["Best group photo backdrop in all of Miami","No experience needed — captain handles everything","Customizable to your vibe: party boat or chill cruise"],
      bookUrl:"https://www.viator.com/searchResults/all?text=private+yacht+bachelorette+miami" },
    { id:"mia-2", name:"Drag Brunch Experience", category:"Brunch", priceRange:"$$$", vibe:"Brunch · Entertainment · Fun", rating:4.9, reviews:540, tags:["brunch","entertainment","show"],
      image:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      images:["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"],
      desc:"Miami's most iconic drag brunch is a non-stop party of bottomless mimosas, hilarious performances, and unforgettable moments with your crew.",
      highlights:["Bottomless mimosas","Live drag performances","DJ & dancing","Bachelorette-friendly seating","Group reservation available"],
      whyWeLoveIt:["Hands-down the most fun brunch in Miami","Performers interact with the bachelorette party","Starts the day with maximum energy and laughs"],
      bookUrl:"https://www.viator.com/searchResults/all?text=drag+brunch+bachelorette+miami" },
    { id:"mia-3", name:"South Beach Bar Crawl", category:"Nightlife", priceRange:"$$", vibe:"Nightlife · Party · Bar Hopping", rating:4.8, reviews:890, tags:["nightlife","bar","party"],
      image:"https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80",
      images:["https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80","https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80"],
      desc:"Hit Miami's most iconic bars on Ocean Drive and Collins Ave with a guided bar crawl built for bachelorette groups. VIP entry, free shots, and a guide who knows every door.",
      highlights:["VIP entry to 4–5 top bars","Welcome shot at each venue","Professional guide all night","Bachelorette sash & accessories","Meet other groups"],
      whyWeLoveIt:["Skip the lines at South Beach's hottest spots","Guide keeps the energy up and the group together","Best value way to experience Miami nightlife"],
      bookUrl:"https://www.viator.com/searchResults/all?text=bar+crawl+bachelorette+miami" },
    { id:"mia-4", name:"Luxury Spa Day", category:"Spa", priceRange:"$$$", vibe:"Relaxation · Wellness · Pampering", rating:4.9, reviews:210, tags:["spa","wellness","relaxation"],
      image:"https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
      images:["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80","https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80"],
      desc:"Treat your crew to a full day of pampering at one of Miami's top luxury spas. Massages, facials, sauna, and champagne — the perfect pre-wedding refresh.",
      highlights:["Full-body massages","Facial treatments","Sauna & steam room access","Champagne welcome","Group packages available"],
      whyWeLoveIt:["Perfect balance to a night out — the girls deserve it","Private group treatment rooms available","Send the bride into her wedding glowing"],
      bookUrl:"https://www.viator.com/searchResults/all?text=spa+day+bachelorette+miami" },
  ],
  nashville: [
    { id:"nash-1", name:"Honky Tonk Bar Crawl", category:"Nightlife", priceRange:"$$", vibe:"Country · Bar Hopping · Party", rating:4.9, reviews:1240, tags:["nightlife","bar","party"],
      image:"https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80",
      images:["https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80","https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80"],
      desc:"Broadway's legendary honky tonks, live music, and cold beer — all guided by a local who knows where to take a bachelorette group for the best time on Lower Broadway.",
      highlights:["Guided tour of 4–5 honky tonks","Live music at every stop","Welcome drinks","Bachelorette VIP treatment","Local insider tips"],
      whyWeLoveIt:["Nashville was made for this kind of night","Every bar has live music — no cover charges on Broadway","Guides know the bartenders and get you the best spots"],
      bookUrl:"https://www.viator.com/searchResults/all?text=honky+tonk+bar+crawl+bachelorette+nashville" },
    { id:"nash-2", name:"Line Dancing Class", category:"Classes", priceRange:"$", vibe:"Fun · Dancing · Nashville Classic", rating:4.8, reviews:620, tags:["classes","dancing","fun"],
      image:"https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80",
      images:["https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80","https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80"],
      desc:"No Nashville bachelorette is complete without a line dancing lesson. Get your crew boot-scootin' before hitting Broadway — you'll fit right in on the dance floor.",
      highlights:["1–2 hour lesson with a pro instructor","Learn 3–4 line dances","Beginner-friendly, no experience needed","Group packages available","Photo opportunities"],
      whyWeLoveIt:["The perfect pre-bar warmup activity","You'll actually know what you're doing on Broadway later","Hilarious and unforgettable group bonding moment"],
      bookUrl:"https://www.viator.com/searchResults/all?text=line+dancing+class+bachelorette+nashville" },
    { id:"nash-3", name:"Pedal Tavern Party Bike", category:"Outdoor", priceRange:"$$", vibe:"Outdoor · Party · Unique", rating:4.9, reviews:980, tags:["outdoor","party","unique"],
      image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      images:["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80","https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80"],
      desc:"Pedal through downtown Nashville on a party bike with your whole crew, stopping at bars along the way. BYOB and bring the playlist — this is the most fun way to see Music City.",
      highlights:["2-hour guided ride","Stops at 2–3 bars","BYOB coolers welcome","Bluetooth speaker","Perfect for groups of 10–16"],
      whyWeLoveIt:["Nashville's most photographed bachelorette activity","You pedal together, drink together, laugh together","Covers Broadway AND the surrounding neighborhoods"],
      bookUrl:"https://www.viator.com/searchResults/all?text=pedal+tavern+bachelorette+nashville" },
    { id:"nash-4", name:"Drag Brunch at Ole Red", category:"Brunch", priceRange:"$$$", vibe:"Brunch · Show · Entertainment", rating:4.9, reviews:430, tags:["brunch","show","entertainment"],
      image:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      images:["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"],
      desc:"Nashville's hottest drag brunch with bottomless mimosas, world-class drag performances, and a front-row seat to the most entertaining brunch in Music City.",
      highlights:["Bottomless mimosas for 2 hours","Live drag show performances","Southern brunch menu","Bachelorette-friendly seating","DJ between performances"],
      whyWeLoveIt:["Blake Shelton's Ole Red is an iconic Nashville venue","The performers know how to hype up a bachelorette group","Best way to start the Nashville bach weekend"],
      bookUrl:"https://www.viator.com/searchResults/all?text=drag+brunch+bachelorette+nashville" },
  ],
  vegas: [
    { id:"lv-1", name:"Vegas Nightclub VIP Package", category:"Nightlife", priceRange:"$$$$", vibe:"VIP · Nightlife · Luxury", rating:5.0, reviews:2100, tags:["nightlife","vip","party"],
      image:"https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80",
      images:["https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80","https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80"],
      desc:"Skip the line and party like a VIP at Vegas's most iconic nightclubs. Table service, bottle packages, and a host who makes sure your bachelorette crew gets the royal treatment.",
      highlights:["VIP table at a top Vegas nightclub","Bottle service package","Line bypass for the group","Personal host all night","Bachelorette décor at the table"],
      whyWeLoveIt:["Vegas clubs are on another level — VIP is worth every penny","Your host handles everything so you just show up and party","Hakkasan, Omnia, Drai's — we know the best spots"],
      bookUrl:"https://www.viator.com/searchResults/all?text=nightclub+vip+bachelorette+las+vegas" },
    { id:"lv-2", name:"Las Vegas Strip Pool Party", category:"Outdoor", priceRange:"$$$", vibe:"Pool · Dayclub · Sun", rating:4.8, reviews:1560, tags:["outdoor","pool","party","dayclub"],
      image:"https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80",
      images:["https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80","https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"],
      desc:"Vegas dayclub pool parties are legendary. Your crew gets VIP access, a cabana, and bottle service poolside while DJs spin and the Strip bakes in the sun.",
      highlights:["VIP pool access & cabana","Bottle service at the pool","DJ & live entertainment","Bachelorette group priority entry","Wet & wild all day"],
      whyWeLoveIt:["Marquee Dayclub, Rehab at Hard Rock, Wet Republic — iconic","Perfect daytime activity before the real night begins","The photos are unmatched — Vegas pools are stunning"],
      bookUrl:"https://www.viator.com/searchResults/all?text=pool+party+dayclub+bachelorette+las+vegas" },
    { id:"lv-3", name:"Magic Mike Live Show", category:"Show", priceRange:"$$$", vibe:"Entertainment · Show · Girls Night", rating:5.0, reviews:3200, tags:["show","entertainment","nightlife"],
      image:"https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
      images:["https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"],
      desc:"The ultimate girls' night show on the Las Vegas Strip. Magic Mike Live is an immersive, interactive experience that will have your whole crew screaming, laughing, and creating memories for life.",
      highlights:["Reserved bachelorette seating","Interactive performance","Cocktail service during the show","Photo opportunities","Bachelorette package upgrades available"],
      whyWeLoveIt:["The #1 bachelorette show in Las Vegas — book early","Performers actually interact with the audience","An experience the bride will literally never forget"],
      bookUrl:"https://www.viator.com/searchResults/all?text=magic+mike+live+bachelorette+las+vegas" },
  ],
  nola: [
    { id:"nola-1", name:"Haunted Cemetery & Cocktail Tour", category:"Outdoor", priceRange:"$$", vibe:"Unique · History · Cocktails", rating:4.9, reviews:780, tags:["outdoor","unique","food","show"],
      image:"https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
      images:["https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80","https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80"],
      desc:"Explore New Orleans' infamous above-ground cemeteries with cocktails in hand. Your guide weaves voodoo legends, ghost stories, and NOLA history into the most unique bachelorette activity in the city.",
      highlights:["Guided walking tour of historic cemeteries","Cocktails included throughout","Voodoo & ghost stories","French Quarter route","Small group experience"],
      whyWeLoveIt:["You can't do this anywhere else — it's pure New Orleans","Cocktails + history + mystery = the perfect NOLA afternoon","Perfect precursor to a Bourbon Street night"],
      bookUrl:"https://www.viator.com/searchResults/all?text=haunted+tour+cocktails+bachelorette+new+orleans" },
    { id:"nola-2", name:"Bourbon Street Bar Crawl", category:"Nightlife", priceRange:"$$", vibe:"Party · Nightlife · Iconic", rating:4.9, reviews:1890, tags:["nightlife","bar","party"],
      image:"https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80",
      images:["https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80","https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80"],
      desc:"Bourbon Street was literally made for bachelorette parties. A guided crawl hits all the legendary spots — Hand Grenade in hand, beads around your neck, and a guide who knows every bartender on the block.",
      highlights:["Guided tour of Bourbon Street's best bars","Welcome drink at each stop","Bachelorette sash & beads","Local guide with insider access","French Quarter route"],
      whyWeLoveIt:["Bourbon Street is a bachelorette party rite of passage","Your guide knows how to get you to the front of every line","Open container laws = drinks all the way down the street"],
      bookUrl:"https://www.viator.com/searchResults/all?text=bourbon+street+bar+crawl+bachelorette+new+orleans" },
  ],
  scottsdale: [
    { id:"scot-1", name:"Desert Jeep & Cocktail Tour", category:"Outdoor", priceRange:"$$$", vibe:"Outdoor · Adventure · Desert", rating:4.9, reviews:430, tags:["outdoor","adventure","unique"],
      image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      images:["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80","https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80"],
      desc:"Off-road through the Sonoran Desert in open-air Jeeps at sunset, then sip cocktails as the sky turns pink and orange. Uniquely Scottsdale and unforgettable.",
      highlights:["Open-air Jeep adventure","Sunset desert scenery","Cocktails at the scenic overlook","Guide & snacks included","Group-friendly setup"],
      whyWeLoveIt:["The sunset over the Sonoran Desert is absolutely breathtaking","You can't do this anywhere else — pure Arizona","Your Instagram will thank you for the rest of the year"],
      bookUrl:"https://www.viator.com/searchResults/all?text=jeep+desert+sunset+bachelorette+scottsdale" },
    { id:"scot-2", name:"Pool Cabana & Bottomless Brunch", category:"Brunch", priceRange:"$$$", vibe:"Pool · Brunch · Relaxation", rating:4.8, reviews:310, tags:["brunch","pool","relaxation"],
      image:"https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80",
      images:["https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"],
      desc:"Scottsdale has the best resort pool scene in the country. Book a private cabana at a luxury resort for bottomless brunch, bottle service, and an all-day pool party under the Arizona sun.",
      highlights:["Private cabana reservation","Bottomless brunch package","Poolside bottle service","Luxury resort amenities","Group bachelorette setup"],
      whyWeLoveIt:["Scottsdale resorts have the most stunning pools in America","The Arizona sun + a cabana + your crew = perfection","Easy, glamorous day with zero planning stress"],
      bookUrl:"https://www.viator.com/searchResults/all?text=pool+cabana+brunch+bachelorette+scottsdale" },
  ],
  austin: [
    { id:"aus-1", name:"Lake Austin Boat Party", category:"Boat/Yacht", priceRange:"$$$", vibe:"Water · Party · Outdoor", rating:4.9, reviews:560, tags:["boat","outdoor","party"],
      image:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
      images:["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80","https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80"],
      desc:"Party on Lake Austin with your whole crew on a private pontoon or party boat. Float, swim, sip, and soak up the Texas sun — then hit 6th Street at night for the full Austin experience.",
      highlights:["Private boat rental for your group","Cooler & BYOB welcome","Swimming & floating","Bluetooth speaker","Captain included"],
      whyWeLoveIt:["Austin's lake days are legendary bachelorette territory","Combine a lake day with a 6th Street night for the ultimate weekend","Texas sun + cold drinks + your crew = unbeatable"],
      bookUrl:"https://www.viator.com/searchResults/all?text=lake+boat+party+bachelorette+austin" },
    { id:"aus-2", name:"6th Street Bar Crawl", category:"Nightlife", priceRange:"$$", vibe:"Party · Live Music · Nightlife", rating:4.8, reviews:940, tags:["nightlife","bar","party"],
      image:"https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80",
      images:["https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80","https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80"],
      desc:"Austin's 6th Street is legendary live music and bar hopping territory. A guided crawl hits the best spots — from dive bars with killer live bands to rooftop cocktail bars overlooking the city.",
      highlights:["Guided crawl of 4–5 top spots","Live music at every stop","Welcome drinks","Bachelorette VIP treatment","Local guide who knows the scene"],
      whyWeLoveIt:["Keep Austin Weird — and your bachelorette unforgettable","Live music is free at virtually every bar on 6th Street","Guides take you to spots tourists never find"],
      bookUrl:"https://www.viator.com/searchResults/all?text=6th+street+bar+crawl+bachelorette+austin" },
  ],
  portaransas: [
    { id:"porta-exp-1", name:"Private Dolphin Boat Tour", category:"Boat/Yacht", priceRange:"$$", vibe:"Water · Nature · Relaxing", rating:4.9, reviews:320, tags:["boat","outdoor","unique"],
      image:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
      images:["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80","https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80"],
      desc:"Cruise the Port Aransas waters on a private boat and spot wild dolphins in their natural habitat. Bring drinks, soak up the Gulf breeze, and let the island vibes work their magic.",
      highlights:["Private boat for your group","Dolphin watching in the wild","Gulf of Mexico views","BYOB friendly","Captain & guide included"],
      whyWeLoveIt:["Port A is one of the best spots in Texas to see dolphins","An unforgettable, peaceful contrast to a night out","Perfect day activity before hitting the island bars"],
      bookUrl:"https://www.viator.com/searchResults/all?text=dolphin+boat+tour+port+aransas+texas" },
    { id:"porta-exp-2", name:"Beach Bonfire & Sunset Party", category:"Outdoor", priceRange:"$$", vibe:"Beach · Bonfire · Sunset", rating:4.8, reviews:180, tags:["outdoor","beach","unique"],
      image:"https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80",
      images:["https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
      desc:"End your Port Aransas day the right way — a private beach bonfire at sunset with your whole crew, cold drinks, s'mores, and the sound of waves crashing. Pure island magic.",
      highlights:["Private beach bonfire setup","Sunset timing for golden hour","S'mores & firewood included","BYO drinks & food","Beach chairs & setup"],
      whyWeLoveIt:["There is nothing more romantic or fun than a beach bonfire","Port A's sunsets over the Gulf are genuinely breathtaking","The perfect low-key night that everyone remembers forever"],
      bookUrl:"https://www.viator.com/searchResults/all?text=beach+bonfire+bachelorette+port+aransas" },
  ],
};

//  Experience Detail Page 
function ExperienceDetail({ item, onBack, groupSize, date }) {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs = item.images || [item.image];
  return (
    <div>
      {/* Back */}
      <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:700, marginBottom:14, padding:0 }}>
        ← Back to results
      </button>

      {/* Image carousel */}
      <div style={{ position:"relative", width:"100%", borderRadius:18, overflow:"hidden", marginBottom:18, aspectRatio:"16/9" }}>
        <img src={imgs[imgIdx]} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
        {imgs.length > 1 && (
          <div style={{ position:"absolute", bottom:10, left:0, right:0, display:"flex", justifyContent:"center", gap:6 }}>
            {imgs.map((_,i) => <div key={i} onClick={()=>setImgIdx(i)} style={{ width:i===imgIdx?18:7, height:7, borderRadius:4, background:i===imgIdx?WHITE:"rgba(255,255,255,0.5)", cursor:"pointer", transition:"all 0.2s" }} />)}
          </div>
        )}
      </div>

      {/* Name + rating */}
      <div style={{ marginBottom:6 }}>
        <div style={{ fontSize:22, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", color:DARK, marginBottom:4 }}>{item.name}</div>
        <div style={{ display:"flex", alignItems:"center", gap:10, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12 }}>
          <span style={{ color:HOT, fontWeight:700 }}> {item.rating}</span>
          <span style={{ color:"#aaa" }}>({item.reviews} reviews)</span>
          <span style={{ color:HOT }}>{item.priceRange}</span>
        </div>
      </div>

      {/* Meta pills */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
        {[item.category, item.vibe].map((t,i) => (
          <div key={i} style={{ background:SOFT, border:`1px solid ${MID}`, borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", color:HOT }}>{t}</div>
        ))}
      </div>

      {/* Description */}
      <p style={{ fontSize:14, color:DARK, fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:1.75, marginBottom:20 }}>{item.desc}</p>

      {/* Highlights */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:16, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", color:DARK, marginBottom:12 }}>What's Included</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {item.highlights.map((h,i) => (
            <div key={i} style={{ background:SOFT, border:`1px solid ${MID}`, borderRadius:20, padding:"5px 12px", fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif", color:DARK }}>{h}</div>
          ))}
        </div>
      </div>

      {/* Why we love it */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:16, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", color:DARK, marginBottom:12 }}>Why We Love It for Your Group</div>
        {item.whyWeLoveIt.map((w,i) => (
          <div key={i} style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
            <div style={{ width:22, height:22, borderRadius:"50%", background:`linear-gradient(135deg,#f472b0,${HOT})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:WHITE, flexShrink:0 }}>{i+1}</div>
            <div style={{ fontSize:13, color:DARK, fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:1.6 }}>{w}</div>
          </div>
        ))}
      </div>

      {/* Book CTA */}
      <div style={{ background:SOFT, border:`1.5px solid ${MID}`, borderRadius:18, padding:"18px 16px", marginBottom:24 }}>
        <div style={{ fontSize:18, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", color:HOT, marginBottom:4 }}>Book This Experience</div>
        <div style={{ fontSize:12, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:16, opacity:0.75 }}>
          {groupSize} guests{date ? ` · ${date}` : ""}: check availability and secure your spot
        </div>
        <a href={item.bookUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
          <button style={{
            width:"100%", background:`linear-gradient(135deg,#f472b0,${HOT})`,
            color:WHITE, border:"none", borderRadius:14, padding:"15px",
            fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, fontWeight:800,
            letterSpacing:"0.3px", cursor:"pointer",
          }}>
            Book on Viator →
          </button>
        </a>
      </div>
    </div>
  );
}

//  Main ExperiencesTab 
export default function ExperiencesTab({ groupSize: initialGroupSize, setGroupSize: setGlobalGroupSize, user, initialCity }) {
  const [city,       setCity]      = useState(initialCity || "");
  const [date,       setDate]      = useState("");
  const [vibe,       setVibe]      = useState("");
  const [groupSize,  setGroupSize] = useState(initialGroupSize || 8);
  const [results,    setResults]   = useState(() => initialCity ? (EXPERIENCES[initialCity] || null) : null);
  const [selected,   setSelected]  = useState(null);   // detail view
  const [showCityPicker, setShowCityPicker] = useState(!initialCity);

  const savedKey = user ? `bh_exp_saved_${user.id}` : null;
  const [saved, setSaved] = useState(() => {
    if (!savedKey) return [];
    try { return JSON.parse(localStorage.getItem(savedKey) || "[]"); } catch { return []; }
  });

  const isSaved = id => saved.some(s => s.id === id);
  const toggleSave = (e, item) => {
    e.stopPropagation();
    if (!user || !user.email) return;
    setSaved(prev => {
      const next = isSaved(item.id)
        ? prev.filter(s => s.id !== item.id)
        : [...prev, { id: item.id, name: item.name, image: item.image, url: item.bookUrl }];
      localStorage.setItem(savedKey, JSON.stringify(next));
      return next;
    });
  };

  const adjGroupSize = (val) => {
    const next = Math.max(1, val);
    setGroupSize(next);
    if (setGlobalGroupSize) setGlobalGroupSize(next);
  };

  const selectedDest = DESTS.find(d => d.id === city);

  const VIBES = [
    { id:"",          label:"Any vibe" },
    { id:"brunch",    label:"Drag Brunch" },
    { id:"boat",      label:"Boat / Yacht" },
    { id:"spa",       label:"Spa Day" },
    { id:"nightlife", label:"Nightlife" },
    { id:"outdoor",   label:"Outdoor Adventure" },
    { id:"classes",   label:"Dance / Classes" },
    { id:"food",      label:"Food Tour" },
    { id:"show",      label:"Live Show" },
  ];

  function findExperiences() {
    if (!city) return;
    const all = EXPERIENCES[city] || [];
    const filtered = vibe ? all.filter(e => e.tags.includes(vibe)) : all;
    setResults(filtered);
    setSelected(null);
  }

  const inputStyle = {
    width:"100%", padding:"10px 12px", borderRadius:10,
    border:`1.5px solid ${BORDER}`, fontFamily:"'Plus Jakarta Sans',sans-serif",
    fontSize:13, color:DARK, background:WHITE, boxSizing:"border-box", outline:"none",
  };

  const labelStyle = {
    fontSize:10, fontWeight:700, color:HOT,
    fontFamily:"'Plus Jakarta Sans',sans-serif",
    textTransform:"uppercase", letterSpacing:1, marginBottom:6,
  };

  // Detail view
  if (selected) return <ExperienceDetail item={selected} onBack={()=>setSelected(null)} groupSize={groupSize} date={date} />;

  return (
    <div>
      <SH title="Find Experiences" sub="Activities, shows & adventures for your crew" />

      {/* Destination */}
      <div style={{ ...C, marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
          <div style={labelStyle}>Destination</div>
          {city && !showCityPicker && (
            <button onClick={()=>setShowCityPicker(true)} style={{ fontSize:11, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", background:"none", border:"none", cursor:"pointer", textDecoration:"underline", padding:0 }}>Change</button>
          )}
        </div>
        {city && !showCityPicker ? (
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, border:`1.5px solid ${HOT}`, background:SOFT }}>
            <span style={{ fontSize:18 }}>{DESTS.find(d=>d.id===city)?.emoji || ""}</span>
            <div style={{ fontSize:13, fontWeight:400, fontFamily:"'Plus Jakarta Sans',sans-serif", color:DARK }}>{DESTS.find(d=>d.id===city)?.name}</div>
          </div>
        ) : (
          <select value={city} onChange={e=>{ setCity(e.target.value); setShowCityPicker(false); setResults(null); }} style={{ ...inputStyle, appearance:"none" }}>
            <option value="">Choose a city…</option>
            {DESTS.filter(d => d.id !== "all").map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Vibe */}
      <div style={{ ...C, marginBottom:12 }}>
        <div style={labelStyle}>What kind of experience?</div>
        <select value={vibe} onChange={e=>setVibe(e.target.value)} style={{ ...inputStyle, appearance:"none" }}>
          {VIBES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
        </select>
      </div>

      {/* Date */}
      <div style={{ ...C, marginBottom:12 }}>
        <div style={labelStyle}>Date</div>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inputStyle} />
      </div>

      {/* Group size */}
      <div style={{ ...C, marginBottom:14 }}>
        <div style={labelStyle}>Group Size</div>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginTop:4 }}>
          <button onClick={()=>adjGroupSize(groupSize-1)} style={{ width:32, height:32, borderRadius:"50%", border:`1.5px solid ${BORDER}`, background:"none", fontSize:20, color:HOT, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
          <div style={{ fontSize:22, fontWeight:900, color:PUNCH, fontFamily:"'Plus Jakarta Sans',sans-serif", minWidth:24, textAlign:"center" }}>{groupSize}</div>
          <button onClick={()=>adjGroupSize(groupSize+1)} style={{ width:32, height:32, borderRadius:"50%", border:`1.5px solid ${BORDER}`, background:"none", fontSize:20, color:HOT, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
        </div>
      </div>

      {/* CTA */}
      <div style={{ ...C, background:SOFT, border:`1.5px solid ${MID}`, marginBottom:20 }}>
        {city ? (
          <>
            <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", color:DARK, marginBottom:4 }}>
              {selectedDest?.name}
            </div>
            <div style={{ fontSize:11, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:14, opacity:0.85 }}>
              {groupSize} guests{vibe ? ` · ${VIBES.find(v=>v.id===vibe)?.label}` : ""}{date ? ` · ${date}` : " · flexible date"}
            </div>
            <button onClick={findExperiences} style={{
              width:"100%", background:`linear-gradient(135deg,#f472b0,${HOT})`,
              color:WHITE, border:"none", borderRadius:14, padding:"15px", cursor:"pointer",
              fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, fontWeight:800, letterSpacing:"0.3px",
            }}>
              Find Best Experiences
            </button>
            <div style={{ fontSize:10, color:"#bbb", fontFamily:"'Plus Jakarta Sans',sans-serif", marginTop:8, textAlign:"center" }}>
              Curated activities perfect for bachelorette groups
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center", padding:"8px 0" }}>
            <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", color:DARK }}>Pick a destination above</div>
            <div style={{ fontSize:11, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", marginTop:4, opacity:0.75 }}>
              Then we'll find the best experiences for {groupSize} people
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {results !== null && (
        results.length === 0 ? (
          <div style={{ textAlign:"center", padding:"32px 16px", background:SOFT, borderRadius:18 }}>
            <div style={{ fontSize:13, fontWeight:700, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:4 }}>No experiences found for that vibe yet</div>
            <div style={{ fontSize:11, color:"#aaa", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Try selecting "Any vibe" to see all options</div>
          </div>
        ) : (
          <>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", color:DARK }}>{results.length} Experience{results.length !== 1 ? "s" : ""} Found</div>
              <div style={{ fontSize:11, color:"#aaa", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{selectedDest?.name}</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:24 }}>
              {results.map(item => (
                <div key={item.id} onClick={()=>setSelected(item)}
                  style={{ borderRadius:12, overflow:"hidden", cursor:"pointer", background:WHITE, boxShadow:"0 2px 10px rgba(0,0,0,0.08)", transition:"transform 0.15s" }}>
                  <div style={{ position:"relative", width:"100%", aspectRatio:"1/1", overflow:"hidden" }}>
                    <img src={item.image} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                    <div style={{ position:"absolute", top:5, left:5, background:"rgba(0,0,0,0.55)", color:WHITE, fontSize:8, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", padding:"2px 6px", borderRadius:20 }}>
                      {item.category}
                    </div>
                    <button onClick={e=>toggleSave(e,item)} style={{ position:"absolute", top:5, right:5, width:26, height:26, borderRadius:"50%", background:"rgba(255,255,255,0.9)", border:"none", cursor:user?.email?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", padding:0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={isSaved(item.id)?HOT:"none"} stroke={HOT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                  </div>
                  <div style={{ padding:"6px 7px 8px" }}>
                    <div style={{ fontSize:10, fontWeight:700, color:DARK, fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:1.25, marginBottom:3 }}>{item.name}</div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ fontSize:9, color:HOT, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600 }}> {item.rating}</div>
                      <div style={{ fontSize:9, color:PUNCH, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700 }}>{item.priceRange}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
}
