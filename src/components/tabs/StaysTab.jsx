import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C, BP } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

// ─── Curated stay listings per destination ───────────────────────────────────
const STAYS = {
  miami: [
    {
      id:"miami-s1", name:"Brickell Penthouse with Infinity Pool", type:"Penthouse",
      sleeps:10, bedrooms:4, rating:4.97, reviews:214, pricePerNight:650,
      tags:["Pool","Rooftop","City Views"],
      image:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      ],
      desc:"A stunning 4-bedroom penthouse in the heart of Brickell with wraparound skyline views, a private rooftop infinity pool, and a chef's kitchen. Walk to Komodo, Swan, and all of Brickell's hottest spots.",
      amenities:["Private Rooftop Pool","City & Bay Views","Chef's Kitchen","Concierge Service","Parking Included","Smart Home"],
      whyWeLoveIt:["Rooftop pool with 360 skyline + bay views — perfect for group photos","Steps from Brickell's best bars and restaurants","Concierge can arrange private chef, boat rentals, and more"],
      airbnbUrl:"https://www.airbnb.com/s/Miami--FL/homes?adults=10&place_id=ChIJEcHIDqKw2YgRZU-t3XHylv8",
    },
    {
      id:"miami-s2", name:"South Beach Art Deco Villa", type:"Villa",
      sleeps:12, bedrooms:5, rating:4.93, reviews:187, pricePerNight:820,
      tags:["Pool","Beach Access","Art Deco"],
      image:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      ],
      desc:"A fully restored 1930s Art Deco villa two blocks from the beach. Five bedrooms, a private courtyard pool, outdoor bar, and a statement living room that screams bachelorette glam. The perfect South Beach basecamp.",
      amenities:["Private Courtyard Pool","Outdoor Bar","2 Blocks to Beach","Outdoor Shower","Bluetooth Sound System","BBQ Grill"],
      whyWeLoveIt:["Iconic South Beach architecture — every inch is photo-ready","Private outdoor bar great for pre-game nights in","Walk to Ocean Drive, Lincoln Road, and beach clubs"],
      airbnbUrl:"https://www.airbnb.com/s/South-Beach--Miami-Beach--FL/homes?adults=12",
    },
    {
      id:"miami-s3", name:"Wynwood Luxury Loft — Pool & Mural Garden", type:"Loft",
      sleeps:8, bedrooms:3, rating:4.89, reviews:142, pricePerNight:480,
      tags:["Pool","Art District","Loft"],
      image:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
      ],
      desc:"An architecturally designed loft in the heart of Wynwood, surrounded by world-class street murals. Features a private splash pool, rooftop terrace, and walls of glass. Walk to Wynwood Walls, craft cocktail bars, and trendy brunch spots.",
      amenities:["Private Splash Pool","Rooftop Terrace","Designer Interiors","Mural Garden","Smart TV","Full Kitchen"],
      whyWeLoveIt:["Wynwood Walls literally outside your door — effortless content","Unique industrial-chic design unlike anything else","Short Uber to South Beach or Brickell nightlife"],
      airbnbUrl:"https://www.airbnb.com/s/Wynwood--Miami--FL/homes?adults=8",
    },
  ],
  nashville: [
    {
      id:"nashville-s1", name:"12South Bungalow with Hot Tub", type:"Bungalow",
      sleeps:10, bedrooms:4, rating:4.96, reviews:308, pricePerNight:520,
      tags:["Hot Tub","Walkable","Trendy Neighborhood"],
      image:"https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        "https://images.unsplash.com/photo-1560185008-b033106af5c3?w=800&q=80",
      ],
      desc:"A fully renovated Nashville bungalow in the heart of 12South — the most walkable bachelorette neighborhood in the city. Four bedrooms, a private hot tub, big back deck, and neon sign included. Walk to brunch, boutiques, and bars in minutes.",
      amenities:["Private Hot Tub","Back Deck","Neon Sign","Full Kitchen","Smart TV","1 Block to 12South Shops"],
      whyWeLoveIt:["12South's best brunch spots are literally walkable","Private hot tub for end-of-night wind-down sessions","Custom neon sign for group photos — already included"],
      airbnbUrl:"https://www.airbnb.com/s/12South--Nashville--TN/homes?adults=10",
    },
    {
      id:"nashville-s2", name:"Downtown Honky Tonk Penthouse", type:"Penthouse",
      sleeps:14, bedrooms:5, rating:4.91, reviews:219, pricePerNight:890,
      tags:["Rooftop","Broadway Views","Sleeps 14"],
      image:"https://images.unsplash.com/photo-1600607687939-ce8a6d349def?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1600607687939-ce8a6d349def?w=800&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      ],
      desc:"Sleep right above the action on Broadway. This luxury penthouse sleeps 14, with a rooftop terrace overlooking the neon lights of Lower Broadway. Party all night and roll straight to bed — no Uber needed.",
      amenities:["Rooftop Terrace","Broadway Views","5 Bedrooms","Game Room","Bar Cart","Elevator Access"],
      whyWeLoveIt:["Walk to every honky tonk on Broadway in under 2 minutes","Rooftop terrace for group toast before hitting the strip","Sleeps 14 — bring the whole crew"],
      airbnbUrl:"https://www.airbnb.com/s/Downtown-Nashville--Nashville--TN/homes?adults=14",
    },
    {
      id:"nashville-s3", name:"East Nashville Boho House", type:"House",
      sleeps:8, bedrooms:3, rating:4.94, reviews:176, pricePerNight:380,
      tags:["Boho","Backyard","Local Vibe"],
      image:"https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      ],
      desc:"Colorful, cozy, and so Nashville. This East Nashville boho house features an eclectic mix of vintage finds, a sprawling backyard with string lights, and a fire pit. The indie dining and bar scene is steps away.",
      amenities:["Private Backyard","Fire Pit","String Lights","Full Kitchen","Vinyl Record Collection","2 Bikes Included"],
      whyWeLoveIt:["East Nashville's coolest bars and restaurants walkable","Backyard fire pit for night cap under the stars","Laid-back alternative to Downtown — great for low-key squads"],
      airbnbUrl:"https://www.airbnb.com/s/East-Nashville--Nashville--TN/homes?adults=8",
    },
  ],
  vegas: [
    {
      id:"vegas-s1", name:"The Strip High-Rise — Private Pool Suite", type:"Suite",
      sleeps:12, bedrooms:4, rating:4.88, reviews:412, pricePerNight:1200,
      tags:["Strip Views","Pool","Luxury"],
      image:"https://images.unsplash.com/photo-1551882547-ff0ebe82e07e?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1551882547-ff0ebe82e07e?w=800&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      ],
      desc:"The ultimate Vegas bachelorette base camp: a sky-high luxury suite on the Las Vegas Strip with floor-to-ceiling windows, a private plunge pool, and panoramic views of the Strip. Concierge, limo service, and bottle service arrangements available.",
      amenities:["Private Plunge Pool","Strip Views","Concierge Service","Limo Service Available","Full Bar Setup","4 Bedrooms"],
      whyWeLoveIt:["Floor-to-ceiling Strip views that hit different at night","Concierge handles nightclub reservations and VIP access","Private plunge pool for pre-game or morning recovery"],
      airbnbUrl:"https://www.airbnb.com/s/Las-Vegas-Strip--Las-Vegas--NV/homes?adults=12",
    },
    {
      id:"vegas-s2", name:"Henderson Desert Oasis — Pool & Cabana", type:"Villa",
      sleeps:16, bedrooms:6, rating:4.95, reviews:293, pricePerNight:750,
      tags:["Pool","Cabana","Desert Views","Sleeps 16"],
      image:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
      ],
      desc:"Six bedrooms, a resort-style pool with swim-up bar, private cabana, and jaw-dropping mountain and desert views. The ideal mix of Vegas energy and a peaceful retreat — 20 minutes from the Strip.",
      amenities:["Resort-Style Pool","Swim-Up Bar","Cabana","Desert + Mountain Views","Outdoor Kitchen","Game Room"],
      whyWeLoveIt:["Swim-up bar makes for an incredible pool day without leaving home","Sleeps 16 — everyone under one roof","20 minutes to the Strip; peaceful enough to actually sleep"],
      airbnbUrl:"https://www.airbnb.com/s/Henderson--NV/homes?adults=16",
    },
  ],
  nola: [
    {
      id:"nola-s1", name:"French Quarter Mansion — Courtyard Pool", type:"Mansion",
      sleeps:14, bedrooms:5, rating:4.97, reviews:341, pricePerNight:980,
      tags:["Pool","French Quarter","Historic"],
      image:"https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      ],
      desc:"A jaw-dropping 19th-century mansion steps from Bourbon Street, with a private courtyard pool, iron balconies dripping in charm, and five luxury bedrooms. Sip Sazeracs on the balcony, then stumble into the French Quarter below.",
      amenities:["Private Courtyard Pool","Bourbon Street Balcony","5 Bedrooms","Full Bar","Period Architecture","Concierge"],
      whyWeLoveIt:["Literally steps from Bourbon Street — the ultimate NOLA location","Courtyard pool for lazy afternoon recovery sessions","That balcony is going to be in every photo you take"],
      airbnbUrl:"https://www.airbnb.com/s/French-Quarter--New-Orleans--LA/homes?adults=14",
    },
    {
      id:"nola-s2", name:"Garden District Victorian", type:"House",
      sleeps:10, bedrooms:4, rating:4.93, reviews:198, pricePerNight:560,
      tags:["Garden District","Victorian","Wraparound Porch"],
      image:"https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      ],
      desc:"An authentic Garden District Victorian loaded with original details: hardwood floors, 12-foot ceilings, a wraparound porch, and a full chef's kitchen. Walk to Magazine Street boutiques, Commander's Palace, and the St. Charles streetcar.",
      amenities:["Wraparound Porch","Chef's Kitchen","12-Ft Ceilings","Hardwood Floors","Streetcar Access","Outdoor Dining"],
      whyWeLoveIt:["Garden District's most photogenic street — magic hour photos are unreal","Walkable to top NOLA restaurants on Magazine Street","Authentic New Orleans architecture you cannot find in a hotel"],
      airbnbUrl:"https://www.airbnb.com/s/Garden-District--New-Orleans--LA/homes?adults=10",
    },
  ],
  scottsdale: [
    {
      id:"scottsdale-s1", name:"Old Town Scottsdale Pool Villa", type:"Villa",
      sleeps:12, bedrooms:5, rating:4.96, reviews:387, pricePerNight:680,
      tags:["Pool","Hot Tub","Old Town","Desert Modern"],
      image:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
      ],
      desc:"A sleek desert-modern villa in Old Town Scottsdale with a heated pool, spa, and mountain views. Walk to all the best bars and rooftops — then come home to your private oasis. Bachelorette perfection.",
      amenities:["Heated Pool","Hot Tub","Mountain Views","Outdoor Kitchen","Pool Floats Provided","Walk to Old Town"],
      whyWeLoveIt:["Walk to Old Town's restaurant and bar scene in under 5 minutes","Heated pool means a perfect day no matter the season","Pool floats included — no hauling them from home"],
      airbnbUrl:"https://www.airbnb.com/s/Old-Town-Scottsdale--Scottsdale--AZ/homes?adults=12",
    },
    {
      id:"scottsdale-s2", name:"Desert Retreat — Private Pool + Saguaro Views", type:"House",
      sleeps:16, bedrooms:6, rating:4.94, reviews:271, pricePerNight:880,
      tags:["Pool","Desert Views","Sleeps 16","Hot Tub"],
      image:"https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80",
      ],
      desc:"Six bedrooms, a resort-style pool with saguaro cactus views, a hot tub, fire pit, and an outdoor kitchen. The ultimate Scottsdale bachelorette compound for a group that wants to do it big in the desert.",
      amenities:["Resort Pool","Hot Tub","Saguaro Views","Fire Pit","Outdoor Kitchen","6 Bedrooms"],
      whyWeLoveIt:["That golden hour pool light with saguaro backdrops is everything","Fire pit nights under the Arizona stars are unforgettable","Space for 16 means no one gets left out"],
      airbnbUrl:"https://www.airbnb.com/s/Scottsdale--AZ/homes?adults=16",
    },
  ],
  austin: [
    {
      id:"austin-s1", name:"South Congress Bungalow — Porch & Pool", type:"Bungalow",
      sleeps:10, bedrooms:4, rating:4.95, reviews:314, pricePerNight:490,
      tags:["Pool","South Congress","Walkable"],
      image:"https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
        "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
      ],
      desc:"A beautifully renovated Austin bungalow on South Congress, steps from the city's best boutiques, restaurants, and live music. Private pool, screened-in porch, and full chef's kitchen. Keep Austin weird from your perfect basecamp.",
      amenities:["Private Pool","Screened-In Porch","Chef's Kitchen","Walk to SoCo","Fire Pit","Smart Home"],
      whyWeLoveIt:["South Congress is Austin's most iconic bachelorette neighborhood","Pool makes the afternoon before going out extra magical","Fire pit for late-night wind-downs between bar nights"],
      airbnbUrl:"https://www.airbnb.com/s/South-Congress--Austin--TX/homes?adults=10",
    },
    {
      id:"austin-s2", name:"East Austin Modern — Rooftop Deck", type:"House",
      sleeps:12, bedrooms:5, rating:4.91, reviews:228, pricePerNight:620,
      tags:["Rooftop","East Austin","Modern"],
      image:"https://images.unsplash.com/photo-1600607687939-ce8a6d349def?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1600607687939-ce8a6d349def?w=800&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      ],
      desc:"Sleek, modern, and in the heart of East Austin's coolest streets. Five bedrooms, a rooftop deck with skyline views, and a short walk to the city's hottest bars, taquerias, and live music venues.",
      amenities:["Rooftop Deck","Skyline Views","5 Bedrooms","Full Kitchen","Bike Rentals Nearby","Smart Home"],
      whyWeLoveIt:["East Austin rooftop sunsets are absolutely stunning","Walking distance to bars, tacos, and live music","Modern finishes make every common space feel photo-ready"],
      airbnbUrl:"https://www.airbnb.com/s/East-Austin--Austin--TX/homes?adults=12",
    },
  ],
  portaransas: [
    {
      id:"portaransas-s1", name:"Beachfront Gulf House — 5BR", type:"Beach House",
      sleeps:14, bedrooms:5, rating:4.97, reviews:189, pricePerNight:580,
      tags:["Beachfront","Gulf Views","Pool"],
      image:"https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
      ],
      desc:"Wake up to Gulf Coast waves from this stunning 5-bedroom beachfront home. Private pool, direct beach access, wrap-around decks, and an outdoor shower. Sunsets from the upper deck will make your whole group emotional.",
      amenities:["Direct Beach Access","Private Pool","Wraparound Decks","Outdoor Shower","Gulf Views","Fully Equipped Kitchen"],
      whyWeLoveIt:["Private beach access — no hiking to the water with chairs and coolers","Upper deck sunset views are absolutely breathtaking","Pool plus Gulf is the ultimate bachelorette beach day combo"],
      airbnbUrl:"https://www.airbnb.com/s/Port-Aransas--TX/homes?adults=14",
    },
    {
      id:"portaransas-s2", name:"Island Escape — Pool, Hot Tub & Golf Cart", type:"House",
      sleeps:12, bedrooms:4, rating:4.93, reviews:142, pricePerNight:420,
      tags:["Pool","Hot Tub","Golf Cart","Island Vibes"],
      image:"https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=800&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
      ],
      desc:"The quintessential Port Aransas bachelorette house: private pool, hot tub, a golf cart for buzzing around the island, and a massive deck built for group hangs. Minutes from the beach, restaurants, and the ferry dock.",
      amenities:["Private Pool","Hot Tub","Golf Cart Included","Large Deck","Outdoor Grill","Steps to Beach"],
      whyWeLoveIt:["Golf cart included — the Port A way to get around the island","Hot tub under the Gulf Coast stars is a bucket-list moment","Pool + hot tub combo covers morning, afternoon, AND night"],
      airbnbUrl:"https://www.airbnb.com/s/Port-Aransas--TX/homes?adults=12",
    },
  ],
  charleston: [
    {
      id:"charleston-s1", name:"Historic Downtown Single House — Private Garden", type:"Historic Home",
      sleeps:10, bedrooms:4, rating:4.96, reviews:267, pricePerNight:540,
      tags:["Historic","Garden","Downtown"],
      image:"https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      ],
      desc:"A classic Charleston 'single house' on the historic peninsula — pastel exterior, private garden with hanging ferns, and four beautiful bedrooms. Walk to King Street boutiques, rooftop bars, and the city market.",
      amenities:["Private Garden","Historic Architecture","Walk to King Street","Full Kitchen","Piazza Porch","Outdoor Dining"],
      whyWeLoveIt:["That pastel Charleston exterior is worth the trip alone","Private garden makes for an intimate group dinner outside","Walk to every top restaurant and bar on King Street"],
      airbnbUrl:"https://www.airbnb.com/s/Downtown-Charleston--Charleston--SC/homes?adults=10",
    },
  ],
  cabo: [
    {
      id:"cabo-s1", name:"Pedregal Clifftop Villa — Infinity Pool", type:"Villa",
      sleeps:12, bedrooms:5, rating:4.98, reviews:341, pricePerNight:1800,
      tags:["Infinity Pool","Cliff Views","Private Chef Available"],
      image:"https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
        "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80",
      ],
      desc:"Perched on the cliffs of Pedregal, this 5-bedroom villa has an infinity pool that spills toward the Pacific, panoramic views of Land's End, and a private chef available on request. This is the Cabo bachelorette experience.",
      amenities:["Infinity Pool","Pacific & Land's End Views","Private Chef Available","Butler Service","5 Bedrooms","Boat Charter Arrangements"],
      whyWeLoveIt:["Infinity pool at sunset with Land's End behind you — unmatched","Private chef means you can eat in on days between adventures","Butler can arrange yacht charters, tours, and club reservations"],
      airbnbUrl:"https://www.airbnb.com/s/Cabo-San-Lucas--Mexico/homes?adults=12",
    },
  ],
};

// ─── Stay Detail View ────────────────────────────────────────────────────────
function StayDetail({ stay, onBack }) {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs = stay.images || [stay.image];
  return (
    <div>
      <button onClick={onBack} style={{
        background:"none", border:"none", cursor:"pointer",
        color:HOT, fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:700,
        padding:"0 0 10px 0", display:"flex", alignItems:"center", gap:4,
      }}>
        Back to results
      </button>

      {/* Image carousel */}
      <div style={{ position:"relative", borderRadius:16, overflow:"hidden", marginBottom:14, height:220 }}>
        <img src={imgs[imgIdx]} alt={stay.name}
          style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        {imgs.length > 1 && (
          <div style={{ position:"absolute", bottom:10, left:0, right:0, display:"flex", justifyContent:"center", gap:6 }}>
            {imgs.map((_,i) => (
              <button key={i} onClick={()=>setImgIdx(i)} style={{
                width:8, height:8, borderRadius:"50%",
                background: i===imgIdx ? WHITE : "rgba(255,255,255,0.5)",
                border:"none", cursor:"pointer", padding:0,
              }} />
            ))}
          </div>
        )}
        {imgs.length > 1 && imgIdx > 0 && (
          <button onClick={()=>setImgIdx(i=>i-1)} style={{
            position:"absolute", left:10, top:"50%", transform:"translateY(-50%)",
            background:"rgba(0,0,0,0.4)", border:"none", borderRadius:"50%",
            width:32, height:32, color:WHITE, cursor:"pointer", fontSize:16,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>‹</button>
        )}
        {imgs.length > 1 && imgIdx < imgs.length-1 && (
          <button onClick={()=>setImgIdx(i=>i+1)} style={{
            position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
            background:"rgba(0,0,0,0.4)", border:"none", borderRadius:"50%",
            width:32, height:32, color:WHITE, cursor:"pointer", fontSize:16,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>›</button>
        )}
      </div>

      {/* Name + meta */}
      <div style={{ ...C, marginBottom:12 }}>
        <div style={{ fontSize:16, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:6 }}>
          {stay.name}
        </div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:8 }}>
          <span style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif", fontWeight:700 }}>
            {stay.type}
          </span>
          <span style={{ fontSize:11, color:"#bbb", fontFamily:"'Nunito',sans-serif" }}>
            Sleeps {stay.sleeps} · {stay.bedrooms} BR
          </span>
          <span style={{ fontSize:11, color:DARK, fontFamily:"'Nunito',sans-serif", fontWeight:700 }}>
            ~${stay.pricePerNight}/night
          </span>
          <span style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif" }}>
            {stay.rating} ({stay.reviews} reviews)
          </span>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {stay.tags.map(t => (
            <span key={t} style={{
              fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20,
              background:SOFT, color:HOT, border:`1px solid ${MID}`,
              fontFamily:"'Nunito',sans-serif",
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div style={{ ...C, marginBottom:12 }}>
        <div style={{ fontSize:13, color:DARK, fontFamily:"'Nunito',sans-serif", lineHeight:1.6 }}>
          {stay.desc}
        </div>
      </div>

      {/* Amenities */}
      <div style={{ ...C, marginBottom:12 }}>
        <div style={{ fontSize:12, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>
          Amenities
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {stay.amenities.map(a => (
            <span key={a} style={{
              fontSize:11, padding:"4px 10px", borderRadius:20,
              background:SOFT, color:DARK, border:`1px solid ${BORDER}`,
              fontFamily:"'Nunito',sans-serif",
            }}>{a}</span>
          ))}
        </div>
      </div>

      {/* Why We Love It */}
      <div style={{ ...C, marginBottom:14 }}>
        <div style={{ fontSize:12, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>
          Why We Love It
        </div>
        {stay.whyWeLoveIt.map((item, i) => (
          <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
            <div style={{
              minWidth:20, height:20, borderRadius:"50%",
              background:`linear-gradient(135deg,#f472b0,${HOT})`,
              color:WHITE, fontSize:10, fontWeight:800,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:"'Nunito',sans-serif", marginTop:1,
            }}>{i+1}</div>
            <div style={{ fontSize:12, color:DARK, fontFamily:"'Nunito',sans-serif", lineHeight:1.5 }}>{item}</div>
          </div>
        ))}
      </div>

      {/* Book CTA */}
      <div style={{ ...C, background:SOFT, border:`1.5px solid ${MID}`, textAlign:"center" }}>
        <div style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif", marginBottom:12, opacity:0.8 }}>
          Prices are estimated — check Airbnb for real-time availability
        </div>
        <button
          onClick={() => window.open(stay.airbnbUrl, "_blank")}
          style={{
            width:"100%",
            background:`linear-gradient(135deg,#f472b0,${HOT})`,
            color:WHITE, border:"none", borderRadius:14,
            padding:"15px", cursor:"pointer",
            fontFamily:"'Nunito',sans-serif", fontSize:14, fontWeight:800,
            letterSpacing:"0.3px",
          }}
        >
          Book on Airbnb
        </button>
      </div>
    </div>
  );
}

// ─── Main StaysTab ────────────────────────────────────────────────────────────
const usDests   = DESTS.filter(d => !d.international && d.id !== "all");
const intlDests = DESTS.filter(d =>  d.international);

export default function StaysTab({ groupSize: initialGroupSize, initialCity }) {
  const [groupSize, setGroupSize] = useState(initialGroupSize || 8);
  const [city,      setCity]      = useState(initialCity || "");
  const [checkIn,   setCheckIn]   = useState("");
  const [checkOut,  setCheckOut]  = useState("");
  const [results,   setResults]   = useState(() => { if (!initialCity) return null; const s = STAYS[initialCity]; return s?.length ? s.filter(x=>x.sleeps>=(initialGroupSize||8)) || s : null; });
  const [selected,  setSelected]  = useState(null);
  const [showCityPicker, setShowCityPicker] = useState(!initialCity);

  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const diff = (new Date(checkOut) - new Date(checkIn)) / 86400000;
    return diff > 0 ? diff : 0;
  })();

  const selectedDest = DESTS.find(d => d.id === city);
  const minDate = new Date().toISOString().split("T")[0];

  function findStays() {
    if (!city) return;
    const cityStays = STAYS[city];
    if (cityStays && cityStays.length > 0) {
      setResults(cityStays.filter(s => s.sleeps >= groupSize));
      if (!STAYS[city] || STAYS[city].filter(s => s.sleeps >= groupSize).length === 0) {
        setResults(cityStays); // fallback: show all if none fit group size
      }
    } else {
      // Fallback: open Airbnb directly if no curated data
      const dest = encodeURIComponent(selectedDest?.name || city);
      const url = checkIn && checkOut
        ? `https://www.airbnb.com/s/${dest}/homes?checkin=${checkIn}&checkout=${checkOut}&adults=${groupSize}`
        : `https://www.airbnb.com/s/${dest}/homes?adults=${groupSize}`;
      window.open(url, "_blank");
    }
    setSelected(null);
  }

  const SM = {
    background: SOFT, border: `1.5px solid ${MID}`, color: HOT,
    borderRadius: 8, width: 28, height: 28, cursor: "pointer",
    fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 15,
    display: "flex", alignItems: "center", justifyContent: "center",
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: `1.5px solid ${BORDER}`, fontFamily: "'Nunito',sans-serif",
    fontSize: 13, color: DARK, background: WHITE, boxSizing: "border-box",
    outline: "none",
  };

  const labelStyle = {
    fontSize: 10, fontWeight: 700, color: HOT,
    fontFamily: "'Nunito',sans-serif",
    textTransform: "uppercase", letterSpacing: 1, marginBottom: 6,
  };

  // ── Detail view ──
  if (selected) {
    return <StayDetail stay={selected} onBack={() => setSelected(null)} />;
  }

  // ── Results view ──
  if (results) {
    return (
      <div>
        <button onClick={() => { setResults(null); setSelected(null); }} style={{
          background:"none", border:"none", cursor:"pointer",
          color:HOT, fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:700,
          padding:"0 0 10px 0", display:"flex", alignItems:"center", gap:4,
        }}>
          Back to search
        </button>

        <div style={{ fontSize:15, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:4 }}>
          Stays in {selectedDest?.name}
        </div>
        <div style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif", marginBottom:14, opacity:0.85 }}>
          {results.length} curated picks · {groupSize} guests
          {nights > 0 ? ` · ${nights} night${nights!==1?"s":""}` : ""}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
          {results.map(stay => (
            <div key={stay.id} onClick={() => setSelected(stay)} style={{
              borderRadius:14, overflow:"hidden", border:`1.5px solid ${BORDER}`,
              background:WHITE, cursor:"pointer",
              boxShadow:"0 2px 8px rgba(213,36,56,0.06)",
            }}>
              <div style={{ height:110, overflow:"hidden" }}>
                <img src={stay.image} alt={stay.name}
                  style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
              <div style={{ padding:"8px 10px 10px" }}>
                <div style={{ fontSize:11, fontWeight:700, color:DARK, fontFamily:"'Nunito',sans-serif", lineHeight:1.3, marginBottom:3 }}>
                  {stay.name}
                </div>
                <div style={{ fontSize:10, color:HOT, fontFamily:"'Nunito',sans-serif", marginBottom:3 }}>
                  {stay.type} · Sleeps {stay.sleeps}
                </div>
                <div style={{ fontSize:10, color:DARK, fontFamily:"'Nunito',sans-serif", fontWeight:700 }}>
                  ~${stay.pricePerNight}/night
                </div>
                <div style={{ fontSize:10, color:"#bbb", fontFamily:"'Nunito',sans-serif" }}>
                  {stay.rating} ({stay.reviews})
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...C, background:SOFT, border:`1.5px solid ${MID}`, textAlign:"center", marginBottom:14 }}>
          <div style={{ fontSize:12, color:HOT, fontFamily:"'Nunito',sans-serif", marginBottom:8 }}>
            Don't see what you're looking for?
          </div>
          <button
            onClick={() => {
              const dest = encodeURIComponent(selectedDest?.name || city);
              const url = checkIn && checkOut
                ? `https://www.airbnb.com/s/${dest}/homes?checkin=${checkIn}&checkout=${checkOut}&adults=${groupSize}`
                : `https://www.airbnb.com/s/${dest}/homes?adults=${groupSize}`;
              window.open(url, "_blank");
            }}
            style={{
              background:"none", border:`1.5px solid ${HOT}`, borderRadius:10,
              color:HOT, padding:"8px 20px", cursor:"pointer",
              fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:700,
            }}
          >
            Search all of Airbnb
          </button>
        </div>
      </div>
    );
  }

  // ── Search form ──
  return (
    <div>
      <SH title="Find Your Stay" sub="Search real availability for your crew" />

      {/* Destination */}
      <div style={{ ...C, marginBottom: 12 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
          <div style={labelStyle}>Destination</div>
          {city && !showCityPicker && (
            <button onClick={()=>setShowCityPicker(true)} style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif", background:"none", border:"none", cursor:"pointer", textDecoration:"underline", padding:0 }}>Change</button>
          )}
        </div>
        {city && !showCityPicker ? (
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, border:`1.5px solid ${HOT}`, background:SOFT }}>
            <span style={{ fontSize:18 }}>{DESTS.find(d=>d.id===city)?.emoji || "📍"}</span>
            <div>
              <div style={{ fontSize:13, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>{DESTS.find(d=>d.id===city)?.name}</div>
              <div style={{ fontSize:10, color:HOT, fontFamily:"'Nunito',sans-serif", opacity:0.8 }}>{groupSize} guests</div>
            </div>
          </div>
        ) : (
          <select
            value={city}
            onChange={e => { setCity(e.target.value); setShowCityPicker(false); setResults(null); }}
            style={{ ...inputStyle, appearance: "none" }}
          >
            <option value="">Choose a city…</option>
            <optgroup label="US Cities">
              {usDests.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </optgroup>
            <optgroup label="International">
              {intlDests.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </optgroup>
          </select>
        )}
      </div>

      {/* Dates */}
      <div style={{ ...C, marginBottom: 12 }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 120px", minWidth:0 }}>
            <div style={labelStyle}>Check In</div>
            <input
              type="date" value={checkIn}
              min={minDate}
              onChange={e => { setCheckIn(e.target.value); if(checkOut && e.target.value >= checkOut) setCheckOut(""); }}
              style={{...inputStyle, fontSize:12}}
            />
          </div>
          <div style={{ flex:"1 1 120px", minWidth:0 }}>
            <div style={labelStyle}>Check Out</div>
            <input
              type="date" value={checkOut}
              min={checkIn || minDate}
              onChange={e => setCheckOut(e.target.value)}
              style={{...inputStyle, fontSize:12}}
            />
          </div>
        </div>
      </div>

      {/* Group size + nights summary */}
      <div style={{ ...C, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={labelStyle}>Group Size</div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:4 }}>
            <button style={SM} onClick={() => setGroupSize(g => Math.max(1, g-1))}>−</button>
            <div style={{ fontSize:22, fontWeight:900, color:PUNCH, fontFamily:"'Playfair Display',Georgia,serif", minWidth:30, textAlign:"center" }}>
              {groupSize}
            </div>
            <button style={SM} onClick={() => setGroupSize(g => Math.min(50, g+1))}>+</button>
          </div>
        </div>
        {nights > 0 && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: HOT, fontFamily: "'Nunito',sans-serif" }}>
              {nights} night{nights !== 1 ? "s" : ""}
            </div>
            <div style={{ fontSize: 11, color: "#bbb", fontFamily: "'Nunito',sans-serif" }}>
              {checkIn} → {checkOut}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ ...C, background: SOFT, border: `1.5px solid ${MID}`, marginBottom: 14 }}>
        {city ? (
          <>
            <div style={{ fontSize: 14, fontWeight: 400, fontFamily: "'Playfair Display',Georgia,serif", color: DARK, marginBottom: 4 }}>
              {selectedDest?.name}
            </div>
            <div style={{ fontSize: 11, color: HOT, fontFamily: "'Nunito',sans-serif", marginBottom: 14, opacity: 0.85 }}>
              {groupSize} guests
              {nights > 0 ? ` · ${nights} nights · ${checkIn} → ${checkOut}` : " · flexible dates"}
            </div>
            <button onClick={findStays} style={{
              width: "100%",
              background: `linear-gradient(135deg,#f472b0,${HOT})`,
              color: WHITE, border: "none", borderRadius: 14,
              padding: "15px", cursor: "pointer",
              fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 800,
              letterSpacing: "0.3px",
            }}>
              Find Best Stays
            </button>
            <div style={{ fontSize: 10, color: "#bbb", fontFamily: "'Nunito',sans-serif", marginTop: 8, textAlign: "center" }}>
              We'll surface the best available options for your group
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 13, fontWeight: 400, fontFamily: "'Playfair Display',Georgia,serif", color: DARK }}>Pick a destination above</div>
            <div style={{ fontSize: 11, color: HOT, fontFamily: "'Nunito',sans-serif", marginTop: 4, opacity: 0.75 }}>
              Then we'll find the best stays for {groupSize} people
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
