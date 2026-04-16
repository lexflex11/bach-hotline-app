import React, { useState } from 'react';
import { HOT, PUNCH, DARK, WHITE, SOFT, MID, BORDER } from '../../constants/colors.js';
import { BP, BG, C } from '../../constants/styles.js';
import { viatorUrl, opentableUrl } from '../../constants/api.js';
import { DESTS, BRIDE_TYPES } from '../../constants/data.js';

// ─── Category filters ──────────────────────────────────────────────────────
const CATS = [
  { id:"all",     label:"Popular",          emoji:"🔥" },
  { id:"todo",    label:"Things to Do",     emoji:"🎉" },
  { id:"dining",  label:"Restaurants",      emoji:"🍽️" },
  { id:"bar",     label:"Bars",             emoji:"🍸" },
  { id:"relax",   label:"Relaxation",       emoji:"💆" },
  { id:"shows",   label:"Live Shows",       emoji:"🎭" },
  { id:"water",   label:"Water",            emoji:"🌊" },
  { id:"stay",    label:"Stays",            emoji:"🏠" },
  { id:"flight",  label:"Flights",          emoji:"✈️" },
  { id:"car",     label:"Cars",             emoji:"🚗" },
];

// Maps ExploreTab cat → which filter bucket it belongs to
const CAT_GROUP = {
  activity:   "todo",
  water:      "water",
  spa:        "relax",
  nightlife:  "shows",
  food:       "dining",
  restaurant: "dining",
  bar:        "bar",
  stay:       "stay",
  flight:     "flight",
  car:        "car",
  relax:      "relax",
  show:       "shows",
  bonus:      "bonus",
};

// ─── Gradient palettes per category (app colors) ──────────────────────────
const GRAD = {
  todo:   ["#E66582","#C42050"],
  dining: ["#C42050","#8B1A2E"],
  bar:    ["#9B3070","#E66582"],
  relax:  ["#A078C8","#7B4FA8"],
  shows:  ["#C42050","#7B1A3E"],
  water:  ["#2D8ABE","#1A5A8A"],
  bonus:  ["#D4A017","#A07800"],
  stay:   ["#7B3F6E","#C42050"],
  flight: ["#2D6FA8","#1A4A7A"],
  car:    ["#3A8A6E","#1A5A48"],
};

// ─── Category photos ───────────────────────────────────────────────────────
const IMG = {
  water:      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=220&fit=crop&q=80",
  spa:        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=220&fit=crop&q=80",
  relax:      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=220&fit=crop&q=80",
  bar:        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=220&fit=crop&q=80",
  food:       "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=220&fit=crop&q=80",
  restaurant: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=220&fit=crop&q=80",
  activity:   "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=220&fit=crop&q=80",
  nightlife:  "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&h=220&fit=crop&q=80",
  show:       "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=220&fit=crop&q=80",
  stay:       "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=220&fit=crop&q=80",
  flight:     "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=220&fit=crop&q=80",
  car:        "https://images.unsplash.com/photo-1449965408869-eaa3f722e8bb?w=400&h=220&fit=crop&q=80",
  bonus:      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&h=220&fit=crop&q=80",
};

// ─── Experiences data ──────────────────────────────────────────────────────
const EXP = [
  // Miami
  { id:1,  city:"miami",     name:"Sunset Yacht Charter",       cat:"water",     emoji:"⛵", price:"$$$$", rating:5.0, vibe:"Private · Champagne · 3 hrs",    badge:"Experience", hot:true  },
  { id:2,  city:"miami",     name:"Drag Brunch Miami",           cat:"food",      emoji:"👑", price:"$$$",  rating:4.9, vibe:"Bottomless mimosas · Live show",  badge:"Brunch",     hot:true  },
  { id:3,  city:"miami",     name:"South Beach Bar Crawl",       cat:"bar",       emoji:"🍸", price:"$$",   rating:4.8, vibe:"5 bars · VIP entry · Free shots", badge:"Bar Crawl",  hot:false },
  { id:4,  city:"miami",     name:"Pole Dance Experience",       cat:"activity",  emoji:"💃", price:"$$",   rating:4.9, vibe:"Private class · 90 mins · BYOB", badge:"Activity",   hot:false },
  { id:5,  city:"miami",     name:"Rooftop Pool Party",          cat:"nightlife", emoji:"🏊", price:"$$$",  rating:4.7, vibe:"DJ · Bottle service · Views",    badge:"Nightlife",  hot:true  },
  { id:6,  city:"miami",     name:"Luxury Spa Day",              cat:"spa",       emoji:"💆", price:"$$$$", rating:4.9, vibe:"Full day · Massages · Facials",   badge:"Spa",        hot:false },

  // Nashville
  { id:7,  city:"nashville", name:"Broadway Bar Hop",            cat:"bar",       emoji:"🎸", price:"$$",   rating:4.9, vibe:"Honky tonks · Live music · BYOB",badge:"Bar Crawl",  hot:true  },
  { id:8,  city:"nashville", name:"Nashville Pedal Tavern",      cat:"activity",  emoji:"🚲", price:"$$",   rating:4.7, vibe:"90 mins · BYOB · 16 people",     badge:"Activity",   hot:true  },
  { id:9,  city:"nashville", name:"Hot Chicken Tasting Tour",    cat:"food",      emoji:"🌶️", price:"$$",  rating:4.8, vibe:"3 stops · Nashville staple",     badge:"Food Tour",  hot:false },
  { id:10, city:"nashville", name:"Rooftop Sunset Cocktails",    cat:"bar",       emoji:"🥂", price:"$$$",  rating:4.8, vibe:"Golden hour · Craft cocktails",   badge:"Bar",        hot:false },
  { id:11, city:"nashville", name:"Line Dancing Class",          cat:"activity",  emoji:"🤠", price:"$",    rating:4.7, vibe:"1 hour · Beginner friendly",      badge:"Activity",   hot:false },
  { id:12, city:"nashville", name:"VIP Live Country Show",       cat:"nightlife", emoji:"🎵", price:"$$$",  rating:4.9, vibe:"Front row · Dinner included",    badge:"Show",       hot:true  },

  // Las Vegas
  { id:13, city:"vegas",     name:"Magic Mike Live",             cat:"activity",  emoji:"💪", price:"$$$",  rating:5.0, vibe:"The show · Front row available", badge:"Show",       hot:true  },
  { id:14, city:"vegas",     name:"VIP Club Night",              cat:"nightlife", emoji:"🎰", price:"$$$$", rating:4.8, vibe:"Table service · Open bar",       badge:"Nightlife",  hot:true  },
  { id:15, city:"vegas",     name:"Drag Brunch Extravaganza",    cat:"food",      emoji:"✨", price:"$$$",  rating:5.0, vibe:"Unlimited mimosas · Crown ceremony",badge:"Brunch",   hot:true  },
  { id:16, city:"vegas",     name:"Spa at Aria",                 cat:"spa",       emoji:"💆", price:"$$$$", rating:4.9, vibe:"Full day · Award-winning spa",    badge:"Spa",        hot:false },
  { id:17, city:"vegas",     name:"Helicopter Canyon Tour",      cat:"activity",  emoji:"🚁", price:"$$$$", rating:4.8, vibe:"Grand Canyon · Sunrise option",  badge:"Experience", hot:false },
  { id:18, city:"vegas",     name:"High Roller Cocktail Hour",   cat:"bar",       emoji:"🎡", price:"$$$",  rating:4.7, vibe:"Open bar · 360° Strip views",    badge:"Bar",        hot:false },

  // New Orleans
  { id:19, city:"nola",      name:"Haunted Cocktail Tour",       cat:"bar",       emoji:"👻", price:"$$",   rating:4.8, vibe:"5 bars · Ghost stories · 2 hrs", badge:"Bar Tour",   hot:true  },
  { id:20, city:"nola",      name:"Jazz Brunch Experience",      cat:"food",      emoji:"🎷", price:"$$$",  rating:4.9, vibe:"Live jazz · Creole cuisine",      badge:"Brunch",     hot:true  },
  { id:21, city:"nola",      name:"Swamp & Gator Tour",          cat:"activity",  emoji:"🐊", price:"$$",   rating:4.7, vibe:"Boat tour · Wildlife · 2 hrs",   badge:"Activity",   hot:false },
  { id:22, city:"nola",      name:"Frenchmen Street Bar Night",  cat:"nightlife", emoji:"🎺", price:"$",    rating:4.9, vibe:"Live music every bar · No cover", badge:"Nightlife",  hot:false },
  { id:23, city:"nola",      name:"Voodoo & History Tour",       cat:"activity",  emoji:"🔮", price:"$$",   rating:4.8, vibe:"Walking tour · Mystical NOLA",   badge:"Tour",       hot:false },

  // Scottsdale
  { id:24, city:"scottsdale",name:"Desert Day Club Pool Party",  cat:"nightlife", emoji:"🏊", price:"$$$",  rating:4.8, vibe:"Cabanas · DJ · Bottle service",  badge:"Day Club",   hot:true  },
  { id:25, city:"scottsdale",name:"Sunset Jeep Desert Tour",     cat:"activity",  emoji:"🌵", price:"$$",   rating:4.9, vibe:"Saguaro sunset · 2 hrs",          badge:"Adventure",  hot:false },
  { id:26, city:"scottsdale",name:"Spa at Four Seasons",         cat:"spa",       emoji:"💆", price:"$$$$", rating:5.0, vibe:"Desert spa · Full day access",    badge:"Spa",        hot:true  },
  { id:27, city:"scottsdale",name:"Old Town Bar Crawl",          cat:"bar",       emoji:"🍹", price:"$$",   rating:4.7, vibe:"5 venues · Group perks",          badge:"Bar Crawl",  hot:false },

  // Austin
  { id:28, city:"austin",    name:"6th Street Bar Crawl",        cat:"bar",       emoji:"🎸", price:"$$",   rating:4.8, vibe:"Live music bars · No cover",      badge:"Bar Crawl",  hot:true  },
  { id:29, city:"austin",    name:"Lake Austin Boat Party",      cat:"water",     emoji:"🚤", price:"$$$",  rating:4.9, vibe:"Private boat · Swimming · BYOB",  badge:"Boat Party", hot:true  },
  { id:30, city:"austin",    name:"Texas BBQ Crawl",             cat:"food",      emoji:"🔥", price:"$$",   rating:4.9, vibe:"3 legendary spots · Guided",      badge:"Food Tour",  hot:false },
  { id:31, city:"austin",    name:"Rainey Street Night Out",     cat:"nightlife", emoji:"🌙", price:"$$",   rating:4.8, vibe:"Bungalow bars · Rooftop patios",  badge:"Nightlife",  hot:false },

  // Cabo
  { id:32, city:"cabo",      name:"Private Yacht Party",         cat:"water",     emoji:"🛥️", price:"$$$$", rating:5.0, vibe:"Open bar · Snorkeling · Sunset", badge:"Yacht",      hot:true  },
  { id:33, city:"cabo",      name:"Medano Beach Club",           cat:"activity",  emoji:"🏖️", price:"$$$",  rating:4.8, vibe:"VIP beds · Bottle service",      badge:"Beach Club", hot:true  },
  { id:34, city:"cabo",      name:"ATV Desert Adventure",        cat:"activity",  emoji:"🏜️", price:"$$",   rating:4.7, vibe:"Desert dunes · 2 hrs",            badge:"Adventure",  hot:false },
  { id:35, city:"cabo",      name:"Sunset Sailing Charter",      cat:"water",     emoji:"⛵", price:"$$$",  rating:4.9, vibe:"Champagne · Whale watching",      badge:"Sailing",    hot:false },

  // Mykonos
  { id:36, city:"mykonos",   name:"Nammos Beach Club",           cat:"nightlife", emoji:"🪩", price:"$$$$", rating:5.0, vibe:"World-famous · Bottle service",  badge:"Beach Club", hot:true  },
  { id:37, city:"mykonos",   name:"Windmill Sunset Cocktails",   cat:"bar",       emoji:"🌅", price:"$$$",  rating:4.9, vibe:"Iconic views · Golden hour",      badge:"Bar",        hot:true  },
  { id:38, city:"mykonos",   name:"Private Catamaran Cruise",    cat:"water",     emoji:"⛵", price:"$$$$", rating:5.0, vibe:"All-inclusive · Secluded beaches",badge:"Sailing",    hot:false },
  { id:39, city:"mykonos",   name:"Little Venice Wine Night",    cat:"bar",       emoji:"🥂", price:"$$$",  rating:4.8, vibe:"Seaside · Local wine · Sunset",   badge:"Wine Bar",   hot:false },

  // Charleston
  { id:56, city:"charleston",  name:"Horse Carriage Ghost Tour",    cat:"activity",  emoji:"🐎", price:"$$",   rating:4.8, vibe:"Haunted history · Night tour",    badge:"Tour",       hot:true  },
  { id:57, city:"charleston",  name:"Rainbow Row Bar Crawl",        cat:"bar",       emoji:"🌈", price:"$$",   rating:4.7, vibe:"5 bars · Historic district",       badge:"Bar Crawl",  hot:true  },
  { id:58, city:"charleston",  name:"Lowcountry Brunch",            cat:"food",      emoji:"🥞", price:"$$$",  rating:4.9, vibe:"Southern classics · Bottomless",   badge:"Brunch",     hot:false },
  { id:59, city:"charleston",  name:"Spa at Belmond Charleston",    cat:"spa",       emoji:"💆", price:"$$$$", rating:5.0, vibe:"Historic mansion spa · Full day",  badge:"Spa",        hot:false },
  { id:60, city:"charleston",  name:"Rooftop Sunset Cocktails",     cat:"bar",       emoji:"🌅", price:"$$$",  rating:4.8, vibe:"Harbor views · Craft cocktails",   badge:"Rooftop",    hot:false },

  // Savannah
  { id:61, city:"savannah",    name:"Haunted Pub Crawl",            cat:"bar",       emoji:"👻", price:"$$",   rating:4.9, vibe:"Ghost stories · 4 bars · 2 hrs",  badge:"Bar Tour",   hot:true  },
  { id:62, city:"savannah",    name:"Forsyth Park Champagne Picnic",cat:"activity",  emoji:"🌿", price:"$$",   rating:4.8, vibe:"Private setup · Moss & magnolias", badge:"Activity",   hot:true  },
  { id:63, city:"savannah",    name:"Southern Drag Brunch",         cat:"food",      emoji:"🎭", price:"$$$",  rating:4.9, vibe:"Bottomless · Live performers",     badge:"Brunch",     hot:false },
  { id:64, city:"savannah",    name:"Riverfront Nightlife Crawl",   cat:"nightlife", emoji:"🎺", price:"$$",   rating:4.7, vibe:"River Street · Live music",        badge:"Nightlife",  hot:false },
  { id:65, city:"savannah",    name:"Historic Trolley Tour",        cat:"activity",  emoji:"🚋", price:"$",    rating:4.6, vibe:"Landmark stops · 90 mins",         badge:"Tour",       hot:false },

  // New York City
  { id:66, city:"nyc",         name:"Drag Brunch NYC",              cat:"food",      emoji:"👑", price:"$$$",  rating:5.0, vibe:"Bottomless · Broadway energy",     badge:"Brunch",     hot:true  },
  { id:67, city:"nyc",         name:"Rooftop Bar Hop",              cat:"bar",       emoji:"🗽", price:"$$$",  rating:4.8, vibe:"Manhattan views · 4 rooftop bars", badge:"Bar Crawl",  hot:true  },
  { id:68, city:"nyc",         name:"Sunset Hudson River Cruise",   cat:"water",     emoji:"🚢", price:"$$$",  rating:4.9, vibe:"Champagne · Skyline · 2 hrs",      badge:"Cruise",     hot:true  },
  { id:69, city:"nyc",         name:"Broadway Show + Dinner",       cat:"nightlife", emoji:"🎭", price:"$$$$", rating:5.0, vibe:"Front row · Pre-show dinner",       badge:"Show",       hot:false },
  { id:70, city:"nyc",         name:"Sip & Paint Party",            cat:"activity",  emoji:"🎨", price:"$$",   rating:4.7, vibe:"Private class · BYOB · 2 hrs",     badge:"Activity",   hot:false },
  { id:71, city:"nyc",         name:"Bliss Spa Midtown",            cat:"spa",       emoji:"💆", price:"$$$$", rating:4.8, vibe:"Full day · Award-winning spa",      badge:"Spa",        hot:false },

  // Chicago
  { id:72, city:"chicago",     name:"Architecture Boat Tour",       cat:"water",     emoji:"🏙️", price:"$$",  rating:4.9, vibe:"River · Skyline · Architecture",   badge:"Cruise",     hot:true  },
  { id:73, city:"chicago",     name:"Deep Dish Pizza Crawl",        cat:"food",      emoji:"🍕", price:"$$",   rating:4.8, vibe:"3 iconic spots · Guided tour",     badge:"Food Tour",  hot:true  },
  { id:74, city:"chicago",     name:"Rooftop Bar Night",            cat:"bar",       emoji:"🌃", price:"$$$",  rating:4.7, vibe:"Skyline views · Craft cocktails",  badge:"Rooftop",    hot:false },
  { id:75, city:"chicago",     name:"Jazz & Blues Club Night",      cat:"nightlife", emoji:"🎶", price:"$$",   rating:4.9, vibe:"Live jazz · Dinner option",        badge:"Show",       hot:false },
  { id:76, city:"chicago",     name:"Pole Dance Fitness Class",     cat:"activity",  emoji:"💃", price:"$$",   rating:4.8, vibe:"Private class · Empowering",       badge:"Activity",   hot:false },

  // San Diego
  { id:77, city:"sandiego",    name:"Sunset Catamaran Party",       cat:"water",     emoji:"⛵", price:"$$$",  rating:5.0, vibe:"Open bar · Bay views · 2 hrs",     badge:"Sailing",    hot:true  },
  { id:78, city:"sandiego",    name:"Gaslamp Bar Crawl",            cat:"bar",       emoji:"🍸", price:"$$",   rating:4.8, vibe:"5 bars · VIP entry · Free shots",  badge:"Bar Crawl",  hot:true  },
  { id:79, city:"sandiego",    name:"Little Italy Brunch Crawl",    cat:"food",      emoji:"🥂", price:"$$$",  rating:4.9, vibe:"3 spots · Bottomless mimosas",     badge:"Brunch",     hot:false },
  { id:80, city:"sandiego",    name:"Surf Lesson for Groups",       cat:"activity",  emoji:"🏄", price:"$$",   rating:4.7, vibe:"2 hrs · Beginner friendly · Beach",badge:"Activity",   hot:false },
  { id:81, city:"sandiego",    name:"Hotel Del Coronado Spa",       cat:"spa",       emoji:"💆", price:"$$$$", rating:4.9, vibe:"Iconic beachfront resort spa",     badge:"Spa",        hot:false },

  // Palm Springs
  { id:82, city:"palmsprings", name:"Ace Hotel Pool Party",         cat:"activity",  emoji:"🏊", price:"$$$",  rating:4.9, vibe:"Cabanas · DJ · Vintage poolside", badge:"Pool Party", hot:true  },
  { id:83, city:"palmsprings", name:"Desert Spa Day",               cat:"spa",       emoji:"💆", price:"$$$$", rating:5.0, vibe:"Full day · Mineral pools · Desert",badge:"Spa",        hot:true  },
  { id:84, city:"palmsprings", name:"Cocktails at The Parker",      cat:"bar",       emoji:"🍹", price:"$$$",  rating:4.8, vibe:"Retro glam · Iconic garden bar",   badge:"Bar",        hot:false },
  { id:85, city:"palmsprings", name:"Desert Jeep Adventure",        cat:"activity",  emoji:"🏜️", price:"$$",  rating:4.7, vibe:"Sand dunes · Sunset views · 2 hrs",badge:"Adventure",  hot:false },
  { id:86, city:"palmsprings", name:"Aerial Tramway Sundowner",     cat:"nightlife", emoji:"🌄", price:"$$$",  rating:4.8, vibe:"Mountain top · Views for miles",   badge:"Experience", hot:false },

  // Napa Valley
  { id:87, city:"napa",        name:"Private Wine Cave Tasting",    cat:"food",      emoji:"🍷", price:"$$$$", rating:5.0, vibe:"Exclusive cave · Paired bites",    badge:"Wine",       hot:true  },
  { id:88, city:"napa",        name:"Vineyard Picnic & Bubbly",     cat:"activity",  emoji:"🧺", price:"$$$",  rating:4.9, vibe:"Private setup · Rolling hills",    badge:"Activity",   hot:true  },
  { id:89, city:"napa",        name:"Spa at Solage Auberge",        cat:"spa",       emoji:"💆", price:"$$$$", rating:5.0, vibe:"Mud baths · World-class spa",      badge:"Spa",        hot:false },
  { id:90, city:"napa",        name:"Hot Air Balloon Sunrise",      cat:"activity",  emoji:"🎈", price:"$$$$", rating:4.9, vibe:"Champagne landing · Valley views", badge:"Experience", hot:false },
  { id:91, city:"napa",        name:"Wine Train Dinner",            cat:"food",      emoji:"🚂", price:"$$$",  rating:4.7, vibe:"Scenic route · Multi-course",      badge:"Dining",     hot:false },

  // Key West
  { id:92, city:"keywest",     name:"Sunset Sailing Cruise",        cat:"water",     emoji:"⛵", price:"$$$",  rating:5.0, vibe:"Champagne · Snorkeling · Sunset",  badge:"Sailing",    hot:true  },
  { id:93, city:"keywest",     name:"Duval Street Bar Crawl",       cat:"bar",       emoji:"🦜", price:"$$",   rating:4.8, vibe:"8 bars · Frozen drinks · Nightlife",badge:"Bar Crawl", hot:true  },
  { id:94, city:"keywest",     name:"Drag Show at 801 Bourbon",     cat:"nightlife", emoji:"💋", price:"$$",   rating:4.9, vibe:"Legendary Key West drag show",     badge:"Show",       hot:false },
  { id:95, city:"keywest",     name:"Snorkel & Sea Glass Tour",     cat:"water",     emoji:"🐠", price:"$$",   rating:4.7, vibe:"Reef snorkeling · Catamaran",      badge:"Water",      hot:false },
  { id:96, city:"keywest",     name:"Beach Bonfire Experience",     cat:"activity",  emoji:"🔥", price:"$$$",  rating:4.8, vibe:"Private beach · S'mores · Stars",  badge:"Activity",   hot:false },

  // Sedona
  { id:97,  city:"sedona",     name:"Pink Jeep Red Rock Tour",      cat:"activity",  emoji:"🔴", price:"$$",   rating:5.0, vibe:"Off-road · Iconic views · 2 hrs",  badge:"Adventure",  hot:true  },
  { id:98,  city:"sedona",     name:"Spa at Enchantment Resort",    cat:"spa",       emoji:"💆", price:"$$$$", rating:5.0, vibe:"Red rock backdrop · Full day",     badge:"Spa",        hot:true  },
  { id:99,  city:"sedona",     name:"Sunset Vortex Yoga",           cat:"activity",  emoji:"🧘", price:"$$",   rating:4.8, vibe:"Energy vortex · Private group",    badge:"Wellness",   hot:false },
  { id:100, city:"sedona",     name:"Wine & Stargazing Night",      cat:"bar",       emoji:"🌟", price:"$$$",  rating:4.9, vibe:"Dark sky · Telescope · Wine",      badge:"Experience", hot:false },
  { id:101, city:"sedona",     name:"Tlaquepaque Art & Brunch",     cat:"food",      emoji:"🎨", price:"$$",   rating:4.7, vibe:"Art village · Brunch · Shopping",  badge:"Brunch",     hot:false },

  // Denver / Aspen
  { id:102, city:"denver",     name:"Craft Brewery Crawl",          cat:"bar",       emoji:"🍺", price:"$$",   rating:4.8, vibe:"5 top breweries · Guided · Snacks",badge:"Bar Crawl",  hot:true  },
  { id:103, city:"denver",     name:"Rocky Mountain Hike & Brunch", cat:"activity",  emoji:"⛰️", price:"$$",  rating:4.9, vibe:"Scenic trails · Brunch after",     badge:"Adventure",  hot:true  },
  { id:104, city:"denver",     name:"Rooftop Dinner Mile High",     cat:"food",      emoji:"🌆", price:"$$$",  rating:4.8, vibe:"City views · Craft cocktails",     badge:"Dining",     hot:false },
  { id:105, city:"denver",     name:"RiNo Art District Bar Night",  cat:"nightlife", emoji:"🎨", price:"$$",   rating:4.7, vibe:"Gallery bars · Street art · Vibes",badge:"Nightlife",  hot:false },
  { id:106, city:"denver",     name:"Mountain Spa Retreat",         cat:"spa",       emoji:"💆", price:"$$$",  rating:4.9, vibe:"Alpine setting · Full day",        badge:"Spa",        hot:false },

  // Houston
  { id:107, city:"houston",    name:"Uptown Rooftop Bar Crawl",     cat:"bar",       emoji:"🤘", price:"$$",   rating:4.8, vibe:"4 rooftop bars · Houston skyline", badge:"Bar Crawl",  hot:true  },
  { id:108, city:"houston",    name:"Montrose Brunch Crawl",        cat:"food",      emoji:"🍳", price:"$$$",  rating:4.9, vibe:"3 hotspot brunches · Bottomless",  badge:"Brunch",     hot:true  },
  { id:109, city:"houston",    name:"Midtown Nightlife Tour",       cat:"nightlife", emoji:"🌃", price:"$$",   rating:4.7, vibe:"5 venues · VIP entry · DJ nights", badge:"Nightlife",  hot:false },
  { id:110, city:"houston",    name:"Pole & Burlesque Class",       cat:"activity",  emoji:"💃", price:"$$",   rating:4.8, vibe:"Private group · Empowering",       badge:"Activity",   hot:false },
  { id:111, city:"houston",       name:"Space Center Group Tour",      cat:"activity",  emoji:"🚀", price:"$$",   rating:4.6, vibe:"NASA · Unique bach activity",        badge:"Unique",     hot:false },

  // Corpus Christi
  { id:112, city:"corpuschristi", name:"Bay Sunset Cruise",             cat:"water",    emoji:"⛵", price:"$$$",  rating:4.9, vibe:"Open bar · Dolphin watching · 2 hrs",  badge:"Experience", hot:true  },
  { id:113, city:"corpuschristi", name:"North Beach Bar Crawl",         cat:"bar",      emoji:"🍸", price:"$$",   rating:4.7, vibe:"Waterfront bars · Live music",         badge:"Bar Crawl",  hot:true  },
  { id:114, city:"corpuschristi", name:"Paddleboard & Mimosas",         cat:"water",    emoji:"🏄", price:"$$",   rating:4.8, vibe:"Group lesson · Brunch after",          badge:"Activity",   hot:false },
  { id:115, city:"corpuschristi", name:"Texas Drag Brunch",             cat:"food",     emoji:"👑", price:"$$$",  rating:4.9, vibe:"Bottomless mimosas · Live performance", badge:"Brunch",     hot:false },
  { id:116, city:"corpuschristi", name:"Mustang Island Beach Day",      cat:"activity", emoji:"🏖️",price:"$",    rating:4.8, vibe:"Private beach setup · Chairs & umbrella",badge:"Beach",     hot:false },

  // Boston
  { id:117, city:"boston",        name:"Freedom Trail Cocktail Tour",   cat:"bar",      emoji:"🍸", price:"$$",   rating:4.9, vibe:"Historic bars · Craft cocktails",       badge:"Bar Tour",   hot:true  },
  { id:118, city:"boston",        name:"Drag Brunch Boston",            cat:"food",     emoji:"👑", price:"$$$",  rating:5.0, vibe:"Bottomless mimosas · Live show",         badge:"Brunch",     hot:true  },
  { id:119, city:"boston",        name:"Harbor Cruise & Sunset",        cat:"water",    emoji:"⛵", price:"$$$",  rating:4.8, vibe:"Boston skyline · BYOB · 2 hrs",         badge:"Experience", hot:false },
  { id:120, city:"boston",        name:"SoWa Rooftop Bar Night",        cat:"nightlife",emoji:"🌃", price:"$$",   rating:4.7, vibe:"Rooftop views · DJ · VIP entry",        badge:"Nightlife",  hot:false },
  { id:121, city:"boston",        name:"Seaport Spa Day",               cat:"spa",      emoji:"💆", price:"$$$",  rating:4.9, vibe:"Waterfront spa · Group packages",       badge:"Spa",        hot:false },

  // ── Relaxation / Spa ────────────────────────────────────────────────────────
  { id:300, city:"miami",       name:"Mandarin Oriental Spa",          cat:"spa",   emoji:"💆", price:"$$$$", rating:5.0, vibe:"Oceanfront · Hot stone · Full day pass",         badge:"Spa",      hot:true  },
  { id:301, city:"miami",       name:"The Standard Spa Miami",         cat:"spa",   emoji:"🌿", price:"$$$",  rating:4.9, vibe:"Hammam · Mud lounge · Waterfront",               badge:"Spa",      hot:false },
  { id:302, city:"nashville",   name:"Woodhouse Day Spa",              cat:"spa",   emoji:"💆", price:"$$$",  rating:4.9, vibe:"Private room · Couples massage · Full menu",     badge:"Spa",      hot:true  },
  { id:303, city:"nashville",   name:"SpaFinder Bachelorette Package", cat:"spa",   emoji:"🌸", price:"$$",   rating:4.8, vibe:"Group rates · Mani/pedi · Champagne included",   badge:"Spa",      hot:false },
  { id:304, city:"vegas",       name:"Spa at The Wynn",                cat:"spa",   emoji:"💆", price:"$$$$", rating:5.0, vibe:"Forbes 5-star · Salt cave · Vitality pool",      badge:"Spa",      hot:true  },
  { id:305, city:"vegas",       name:"Qua Baths & Spa at Caesars",     cat:"spa",   emoji:"🛁", rating:4.9, price:"$$$",  vibe:"Roman baths · Arctic ice room · Lap pool",        badge:"Spa",      hot:false },
  { id:306, city:"nola",        name:"Belladonna Day Spa",             cat:"spa",   emoji:"💆", price:"$$$",  rating:4.9, vibe:"Group packages · Facials · Champagne toast",     badge:"Spa",      hot:true  },
  { id:307, city:"scottsdale",  name:"Sanctuary Spa on Camelback",     cat:"spa",   emoji:"🌵", price:"$$$$", rating:5.0, vibe:"Desert setting · Ayurvedic · Mountain views",    badge:"Spa",      hot:true  },
  { id:308, city:"austin",      name:"Austin Stone Spa",               cat:"spa",   emoji:"💆", price:"$$$",  rating:4.8, vibe:"Hot stone · CBD massage · Group bookings",       badge:"Spa",      hot:false },
  { id:309, city:"charleston",  name:"The Spa at Belmond",             cat:"spa",   emoji:"🌺", price:"$$$$", rating:5.0, vibe:"Historic mansion · Floral treatments · Bliss",   badge:"Spa",      hot:true  },
  { id:310, city:"savannah",    name:"Savannah Day Spa & Wellness",    cat:"spa",   emoji:"💆", price:"$$$",  rating:4.8, vibe:"Southern charm · Group packages · Robes incl.", badge:"Spa",      hot:false },
  { id:311, city:"nyc",         name:"Great Jones Spa",                cat:"spa",   emoji:"🏙️", price:"$$$",  rating:4.9, vibe:"Water lounge · Waterfall · SoHo location",       badge:"Spa",      hot:true  },
  { id:312, city:"chicago",     name:"Aire Ancient Baths Chicago",     cat:"spa",   emoji:"🛁", price:"$$$",  rating:5.0, vibe:"Thermal pools · Candlelit · Couples friendly",   badge:"Spa",      hot:true  },
  { id:313, city:"sandiego",    name:"Golden Door Spa at The US Grant",cat:"spa",   emoji:"💆", price:"$$$$", rating:4.9, vibe:"Forbes-rated · Downtown · Group packages",        badge:"Spa",      hot:false },
  { id:314, city:"palmsprings", name:"The Spa at Parker Palm Springs", cat:"spa",   emoji:"🌵", price:"$$$$", rating:5.0, vibe:"Desert bloom · Citrus wraps · Pool day",         badge:"Spa",      hot:true  },
  { id:315, city:"napa",        name:"Spa Solage Auberge",             cat:"spa",   emoji:"🍷", price:"$$$$", rating:5.0, vibe:"Wine & mud baths · Geothermal pools · Vineyard", badge:"Spa",      hot:true  },
  { id:316, city:"keywest",     name:"The Spa on Duval",               cat:"spa",   emoji:"🌺", price:"$$$",  rating:4.8, vibe:"Tropical · Island-inspired · Group rates",       badge:"Spa",      hot:false },
  { id:317, city:"sedona",      name:"Mii Amo Spa at Enchantment",     cat:"spa",   emoji:"🔴", price:"$$$$", rating:5.0, vibe:"Vortex setting · Healing rituals · All-day",     badge:"Spa",      hot:true  },
  { id:318, city:"denver",      name:"The Oxford Club Spa",            cat:"spa",   emoji:"💆", price:"$$$",  rating:4.8, vibe:"Historic hotel · Mountain-inspired · Groups",    badge:"Spa",      hot:false },
  { id:319, city:"houston",     name:"Milk + Honey Spa Houston",       cat:"spa",   emoji:"🍯", price:"$$$",  rating:4.9, vibe:"Group booking · Champagne · Signature wraps",    badge:"Spa",      hot:true  },

  // ── Live Shows ───────────────────────────────────────────────────────────────
  { id:350, city:"miami",       name:"Drag Queen Dinner Show",         cat:"nightlife",emoji:"👑", price:"$$$",  rating:5.0, vibe:"Full dinner · Live performance · Crowning ceremony", badge:"Show",  hot:true  },
  { id:351, city:"miami",       name:"Cirque-Style Acrobat Show",      cat:"nightlife",emoji:"🎪", price:"$$",   rating:4.8, vibe:"Aerial · Fire · Jaw-dropping",               badge:"Show",     hot:false },
  { id:352, city:"nashville",   name:"Nashville Palace Live Show",     cat:"nightlife",emoji:"🎸", price:"$$",   rating:4.9, vibe:"Live country · Dinner included · Front row",  badge:"Show",     hot:true  },
  { id:353, city:"nashville",   name:"Comedy Barn Tennessee",          cat:"nightlife",emoji:"😂", price:"$$",   rating:4.8, vibe:"Clean comedy · Live music · Group discount",  badge:"Comedy",   hot:false },
  { id:354, city:"vegas",       name:"Absinthe at Caesars Palace",     cat:"nightlife",emoji:"🎭", price:"$$$",  rating:5.0, vibe:"Adults-only · Cirque · Most talked-about show",badge:"Show",     hot:true  },
  { id:355, city:"vegas",       name:"Thunder from Down Under",        cat:"nightlife",emoji:"🔥", price:"$$$",  rating:4.9, vibe:"The classic bach show · VIP meet & greet",    badge:"Show",     hot:true  },
  { id:356, city:"nola",        name:"Preservation Hall Jazz Show",    cat:"nightlife",emoji:"🎷", price:"$$",   rating:5.0, vibe:"Historic venue · Authentic jazz · Iconic",     badge:"Show",     hot:true  },
  { id:357, city:"nola",        name:"House of Blues Gospel Brunch",   cat:"nightlife",emoji:"🎵", price:"$$$",  rating:4.9, vibe:"Live gospel · Buffet · Soul-filling morning",  badge:"Show",     hot:false },
  { id:358, city:"scottsdale",  name:"Improv Comedy Club Scottsdale",  cat:"nightlife",emoji:"😂", price:"$$",   rating:4.7, vibe:"National headliners · 2-drink min · Laughs",  badge:"Comedy",   hot:false },
  { id:359, city:"austin",      name:"Esther's Follies Comedy",        cat:"nightlife",emoji:"🎭", price:"$$",   rating:4.9, vibe:"Austin icon · Comedy + magic · 6th St",        badge:"Show",     hot:true  },
  { id:360, city:"charleston",  name:"Redux Studios Comedy Night",     cat:"nightlife",emoji:"😂", price:"$",    rating:4.7, vibe:"Local comedy · Low-key · BYOB friendly",       badge:"Comedy",   hot:false },
  { id:361, city:"nyc",         name:"Sleep No More Immersive Theater",cat:"nightlife",emoji:"🎭", price:"$$$",  rating:5.0, vibe:"Iconic NYC experience · Roam the story",        badge:"Show",     hot:true  },
  { id:362, city:"nyc",         name:"Drag Extravaganza Brunch Show",  cat:"nightlife",emoji:"👑", price:"$$$",  rating:4.9, vibe:"Bottomless · Sickening performance · Midtown", badge:"Show",     hot:false },
  { id:363, city:"chicago",     name:"Second City Comedy Club",        cat:"nightlife",emoji:"😂", price:"$$",   rating:5.0, vibe:"Legendary improv · Alumni: Tina Fey, Colbert",  badge:"Comedy",   hot:true  },
  { id:364, city:"sandiego",    name:"The Comedy Store La Jolla",      cat:"nightlife",emoji:"😂", price:"$$",   rating:4.8, vibe:"National acts · Oceanside location",            badge:"Comedy",   hot:false },
  { id:365, city:"denver",      name:"Comedy Works South",             cat:"nightlife",emoji:"😂", price:"$$",   rating:4.9, vibe:"Top national headliners · Group tables",        badge:"Comedy",   hot:true  },
  { id:366, city:"houston",     name:"Disaster's Drag Brunch",         cat:"nightlife",emoji:"👑", price:"$$$",  rating:5.0, vibe:"Houston fave · Crown the bride · Full show",    badge:"Show",     hot:true  },

  // ── Water Activities ─────────────────────────────────────────────────────────
  { id:400, city:"miami",       name:"Biscayne Bay Party Boat",        cat:"water", emoji:"🚢", price:"$$$",  rating:4.9, vibe:"DJ · Open bar · Sunset cruise · 3 hrs",         badge:"Boat",     hot:true  },
  { id:401, city:"miami",       name:"Jet Ski Beach Day",              cat:"water", emoji:"🏄", price:"$$",   rating:4.8, vibe:"Group rental · South Beach · 1 hr",             badge:"Watersport",hot:false },
  { id:402, city:"nashville",   name:"Nashville Party Pontoon",        cat:"water", emoji:"🚤", price:"$$$",  rating:4.8, vibe:"Percy Priest Lake · BYOB · Captain included",   badge:"Boat",     hot:true  },
  { id:403, city:"nashville",   name:"Paddleboard Yoga on the River",  cat:"water", emoji:"🧘", price:"$$",   rating:4.7, vibe:"SUP yoga · Cumberland River · Beginner-friendly",badge:"Wellness", hot:false },
  { id:404, city:"vegas",       name:"Lake Mead Speedboat Tour",       cat:"water", emoji:"⛵", price:"$$$",  rating:4.8, vibe:"Hoover Dam · Canyons · 3 hrs",                   badge:"Boat",     hot:true  },
  { id:405, city:"vegas",       name:"Aquatic Golf Club Party Pool",   cat:"water", emoji:"🏊", price:"$$$",  rating:4.9, vibe:"Pool day club · Floating · DJ · Bottle service", badge:"Pool",     hot:false },
  { id:406, city:"nola",        name:"Swamp Airboat Adventure",        cat:"water", emoji:"🐊", price:"$$",   rating:4.9, vibe:"Alligators · Bayou · Thrilling 90-min ride",     badge:"Adventure",hot:true  },
  { id:407, city:"nola",        name:"Mississippi Riverboat Cruise",   cat:"water", emoji:"🚢", price:"$$",   rating:4.8, vibe:"Jazz onboard · Open bar · Scenic NOLA views",   badge:"Cruise",   hot:false },
  { id:408, city:"scottsdale",  name:"Salt River Tubing Party",        cat:"water", emoji:"🛟", price:"$",    rating:4.9, vibe:"Floating tubes · BYOB coolers · All day",        badge:"Tubing",   hot:true  },
  { id:409, city:"scottsdale",  name:"Lake Pleasant Boat Day",         cat:"water", emoji:"🚤", price:"$$$",  rating:4.8, vibe:"Private charter · Wakeboarding · Champagne",    badge:"Boat",     hot:false },
  { id:410, city:"austin",      name:"Lake Travis Party Boat",         cat:"water", emoji:"🚤", price:"$$$",  rating:5.0, vibe:"Private deck boat · Captain · Swimming stops",   badge:"Boat",     hot:true  },
  { id:411, city:"austin",      name:"Barton Springs Pool Dip",        cat:"water", emoji:"🏊", price:"$",    rating:4.7, vibe:"Natural spring pool · Refreshing · Free swim",   badge:"Swimming", hot:false },
  { id:412, city:"charleston",  name:"Harbor Sailing Charter",         cat:"water", emoji:"⛵", price:"$$$",  rating:4.9, vibe:"Private sailboat · Sunset · Champagne toast",    badge:"Sailing",  hot:true  },
  { id:413, city:"savannah",    name:"Savannah River Kayak Tour",      cat:"water", emoji:"🚣", price:"$$",   rating:4.8, vibe:"Guided · Historic waterfront · 2 hrs",           badge:"Kayak",    hot:false },
  { id:414, city:"nyc",         name:"NYC Sunset Yacht Party",         cat:"water", emoji:"⛵", price:"$$$$", rating:5.0, vibe:"Private yacht · Manhattan skyline · Champagne",  badge:"Yacht",    hot:true  },
  { id:415, city:"chicago",     name:"Chicago Architecture Boat Tour", cat:"water", emoji:"🚢", price:"$$",   rating:4.9, vibe:"Award-winning · Skyline · Champagne option",     badge:"Cruise",   hot:true  },
  { id:416, city:"sandiego",    name:"Pacific Ocean Kayak & Snorkel",  cat:"water", emoji:"🤿", price:"$$",   rating:4.8, vibe:"Sea caves · La Jolla Cove · Sea lions",           badge:"Snorkel",  hot:true  },
  { id:417, city:"sandiego",    name:"Party Boat Sunset Cruise",       cat:"water", emoji:"🚢", price:"$$$",  rating:4.9, vibe:"Open bar · DJ · Pacific sunset · 3 hrs",         badge:"Cruise",   hot:false },
  { id:418, city:"keywest",     name:"Snorkel & Reef Dive Charter",    cat:"water", emoji:"🤿", price:"$$$",  rating:5.0, vibe:"Coral reef · Private charter · Crystal water",   badge:"Snorkel",  hot:true  },
  { id:419, city:"keywest",     name:"Sunset Catamaran Cruise",        cat:"water", emoji:"⛵", price:"$$$",  rating:4.9, vibe:"Open bar · Snorkeling · Spectacular sunset",      badge:"Cruise",   hot:false },
  { id:420, city:"sedona",      name:"Oak Creek Canyon Slide & Swim",  cat:"water", emoji:"🏊", price:"$",    rating:4.8, vibe:"Natural water slide · Cliff jumping · Scenic",   badge:"Swimming", hot:true  },
  { id:421, city:"denver",      name:"Clear Creek Whitewater Rafting", cat:"water", emoji:"🚣", price:"$$",   rating:4.9, vibe:"Beginner to advanced · Guide included",           badge:"Rafting",  hot:true  },
  { id:422, city:"houston",     name:"Galveston Beach Boat Charter",   cat:"water", emoji:"🚤", price:"$$$",  rating:4.8, vibe:"Gulf Coast · Private charter · 1 hr to beach",   badge:"Boat",     hot:false },
  { id:423, city:"cabo",        name:"Cabo Arch Snorkel Boat Tour",    cat:"water", emoji:"🤿", price:"$$$",  rating:5.0, vibe:"El Arco · Sea of Cortez · Marine life",           badge:"Snorkel",  hot:true  },
  { id:424, city:"mykonos",     name:"Aegean Private Sailing Day",     cat:"water", emoji:"⛵", price:"$$$$", rating:5.0, vibe:"Island hopping · Swim stops · Captain + crew",    badge:"Sailing",  hot:true  },
  { id:425, city:"palmsprings", name:"Desert Oasis Pool Day Charter",  cat:"water", emoji:"🏊", price:"$$$",  rating:4.8, vibe:"Private pool villa rental · Catering available", badge:"Pool",     hot:true  },
  { id:426, city:"napa",        name:"Russian River Canoe Float",      cat:"water", emoji:"🚣", price:"$$",   rating:4.8, vibe:"Wine country paddle · Scenic · BYOB allowed",    badge:"Kayak",    hot:false },

  // ── Bonus Experiences ────────────────────────────────────────────────────────
  { id:450, city:"miami",       name:"Bachelorette Glam Squad",        cat:"bonus", emoji:"💄", price:"$$$",  rating:5.0, vibe:"Hair · Makeup · Whole group · In-villa",         badge:"Glam",     hot:true  },
  { id:451, city:"miami",       name:"Private Photoshoot on the Beach",cat:"bonus", emoji:"📸", price:"$$$",  rating:4.9, vibe:"Professional photographer · 1 hr · Prints incl.",badge:"Photoshoot",hot:false },
  { id:452, city:"nashville",   name:"Custom Sash & Veil Party Kit",   cat:"bonus", emoji:"👑", price:"$$",   rating:4.9, vibe:"Bach essentials · Matching group accessories",    badge:"Extras",   hot:true  },
  { id:453, city:"nashville",   name:"Neon Sign Rental for the Night", cat:"bonus", emoji:"💡", price:"$$",   rating:4.8, vibe:"Bride neon sign · Photo-ready · Delivered",       badge:"Extras",   hot:false },
  { id:454, city:"vegas",       name:"Helicopter Strip Night Tour",    cat:"bonus", emoji:"🚁", price:"$$$$", rating:5.0, vibe:"Vegas lights from above · 30 min · Unforgettable",badge:"Unique",   hot:true  },
  { id:455, city:"vegas",       name:"Private Pole Dance Class",       cat:"bonus", emoji:"💃", price:"$$",   rating:4.9, vibe:"Private studio · Instructor · 1.5 hrs · BYOB",   badge:"Activity",  hot:true  },
  { id:456, city:"nola",        name:"Tarot & Psychic Reading Party",  cat:"bonus", emoji:"🔮", price:"$$",   rating:4.8, vibe:"Group reading · French Quarter · Mystical NOLA",  badge:"Unique",   hot:true  },
  { id:457, city:"nola",        name:"Jazz Funeral Second Line",       cat:"bonus", emoji:"🎺", price:"$$$",  rating:5.0, vibe:"Umbrellas · Brass band · Authentic NOLA tradition",badge:"Unique",   hot:false },
  { id:458, city:"scottsdale",  name:"Desert Sunrise Hot Air Balloon", cat:"bonus", emoji:"🎈", price:"$$$$", rating:5.0, vibe:"Champagne landing · Crew · 1 hr · Breathtaking",  badge:"Unique",   hot:true  },
  { id:459, city:"scottsdale",  name:"Mobile Spray Tan Party",         cat:"bonus", emoji:"🌟", rating:4.8, price:"$$", vibe:"In-villa · Group discount · Vacation ready",       badge:"Glam",     hot:false },
  { id:460, city:"austin",      name:"Bachelorette Paint & Sip",       cat:"bonus", emoji:"🎨", price:"$$",   rating:4.8, vibe:"Guided painting · Wine included · Take it home",  badge:"Creative", hot:true  },
  { id:461, city:"austin",      name:"Couple's Cooking Class",         cat:"bonus", emoji:"👩‍🍳",price:"$$$", rating:4.9, vibe:"Private chef · Texas BBQ · Group experience",    badge:"Unique",   hot:false },
  { id:462, city:"charleston",  name:"Haunted Ghost Tour & Cocktails", cat:"bonus", emoji:"👻", price:"$$",   rating:4.9, vibe:"Spooky history · Walking tour · Drinks in hand",  badge:"Unique",   hot:true  },
  { id:463, city:"savannah",    name:"Southern Charm Cooking Class",   cat:"bonus", emoji:"👩‍🍳",price:"$$$", rating:4.9, vibe:"Lowcountry cuisine · Private chef · Group",       badge:"Unique",   hot:false },
  { id:464, city:"nyc",         name:"NYC Bach Photoshoot Experience", cat:"bonus", emoji:"📸", price:"$$$",  rating:5.0, vibe:"Iconic backdrops · Pro photographer · 1.5 hrs",  badge:"Photoshoot",hot:true  },
  { id:465, city:"nyc",         name:"Pottery Class Bachelorette",     cat:"bonus", emoji:"🏺", price:"$$",   rating:4.8, vibe:"Ghost-style · Private studio · BYOB",             badge:"Creative", hot:false },
  { id:466, city:"chicago",     name:"Architecture & Cocktail Cruise", cat:"bonus", emoji:"🏙️", price:"$$$",  rating:4.9, vibe:"Open bar · Skyline · Only-in-Chicago experience", badge:"Unique",   hot:true  },
  { id:467, city:"sandiego",    name:"Sunset Cliffs Photoshoot",       cat:"bonus", emoji:"📸", price:"$$$",  rating:5.0, vibe:"Golden hour · Pacific views · Pro photographer",  badge:"Photoshoot",hot:true  },
  { id:468, city:"palmsprings", name:"Vintage Air Stream Pool Party",  cat:"bonus", emoji:"✨", price:"$$$",  rating:4.9, vibe:"Private · Retro chic · Catered · Instagrammable", badge:"Unique",   hot:true  },
  { id:469, city:"napa",        name:"Private Vineyard Picnic",        cat:"bonus", emoji:"🍷", price:"$$$$", rating:5.0, vibe:"Wine · Cheese · Roses · Your own vineyard",       badge:"Unique",   hot:true  },
  { id:470, city:"keywest",     name:"Sunset Parasailing Experience",  cat:"bonus", emoji:"🪂", price:"$$$",  rating:5.0, vibe:"500 ft above the Gulf · Pair or solo · Thrill",   badge:"Unique",   hot:true  },
  { id:471, city:"sedona",      name:"Vortex Meditation & Sound Bath", cat:"bonus", emoji:"🧘", price:"$$",   rating:5.0, vibe:"Energy vortex · Crystal bowls · Transformative",  badge:"Wellness", hot:true  },
  { id:472, city:"denver",      name:"Rocky Mtn Horseback Riding",     cat:"bonus", emoji:"🐴", price:"$$$",  rating:4.9, vibe:"Guided trail · Mountain views · 2 hrs",           badge:"Unique",   hot:true  },
  { id:473, city:"houston",     name:"Space City Rooftop Photoshoot",  cat:"bonus", emoji:"📸", price:"$$$",  rating:4.8, vibe:"Houston skyline · Golden hour · Pro photographer",badge:"Photoshoot",hot:false },
  { id:474, city:"cabo",        name:"ATV Desert Adventure Tour",      cat:"bonus", emoji:"🏍️", price:"$$$",  rating:4.9, vibe:"Off-road · Desert · Canyon views · 3 hrs",        badge:"Adventure",hot:true  },
  { id:475, city:"mykonos",     name:"Sunset Catamaran Dinner Party",  cat:"bonus", emoji:"🌅", price:"$$$$", rating:5.0, vibe:"Chef onboard · Aegean sunset · Luxury",            badge:"Unique",   hot:true  },

  // Accommodations — one featured stay per city
  { id:40, city:"miami",      name:"Faena Hotel Miami Beach",     cat:"stay", emoji:"🏨", price:"$$$$", rating:5.0, vibe:"Iconic gold · Beachfront · Full-floor suites", badge:"Hotel",    hot:true  },
  { id:41, city:"miami",      name:"South Beach Bachelorette Villa",cat:"stay",emoji:"🌴",price:"$$$", rating:4.9, vibe:"Private pool · 4BR · Steps to beach",          badge:"Villa",    hot:false },
  { id:42, city:"nashville",  name:"Gulch Party House",           cat:"stay", emoji:"🎸", price:"$$$", rating:4.9, vibe:"6BR · Rooftop · Minutes to Broadway",          badge:"Airbnb",   hot:true  },
  { id:43, city:"nashville",  name:"The Thompson Nashville",      cat:"stay", emoji:"🏨", price:"$$$$",rating:4.8, vibe:"Rooftop pool · Downtown · Bar on site",         badge:"Hotel",    hot:false },
  { id:44, city:"vegas",      name:"Cosmopolitan Suite",          cat:"stay", emoji:"🎰", price:"$$$$",rating:4.9, vibe:"Strip views · Terrace · Marquee access",        badge:"Suite",    hot:true  },
  { id:45, city:"vegas",      name:"Palms 2-story Penthouse",     cat:"stay", emoji:"🌟", price:"$$$$",rating:5.0, vibe:"Private pool · DJ booth · 360° views",          badge:"Penthouse",hot:false },
  { id:46, city:"nola",       name:"Garden District Mansion",     cat:"stay", emoji:"🏛️", price:"$$$", rating:4.9, vibe:"5BR · Private courtyard · Historic charm",      badge:"Mansion",  hot:true  },
  { id:47, city:"nola",       name:"French Quarter Balcony Apt",  cat:"stay", emoji:"🎺", price:"$$",  rating:4.7, vibe:"Bourbon St views · Walk everywhere",            badge:"Airbnb",   hot:false },
  { id:48, city:"scottsdale", name:"Desert Bachelorette Estate",  cat:"stay", emoji:"🌵", price:"$$$$",rating:5.0, vibe:"Private pool · Fire pit · Mountain views",      badge:"Estate",   hot:true  },
  { id:49, city:"scottsdale", name:"W Scottsdale",                cat:"stay", emoji:"🏨", price:"$$$", rating:4.8, vibe:"WET pool deck · Central Old Town location",     badge:"Hotel",    hot:false },
  { id:50, city:"austin",     name:"East Austin Party House",     cat:"stay", emoji:"🤠", price:"$$$", rating:4.8, vibe:"4BR · Hot tub · Walk to Rainey St",              badge:"Airbnb",   hot:true  },
  { id:51, city:"austin",     name:"Lake Travis Waterfront Home", cat:"stay", emoji:"🚤", price:"$$$$",rating:4.9, vibe:"Private dock · Lake views · 5BR",               badge:"Lakehouse",hot:false },
  { id:52, city:"cabo",       name:"Pedregal Cliffside Villa",    cat:"stay", emoji:"🌊", price:"$$$$",rating:5.0, vibe:"Infinity pool · Ocean views · Private chef",     badge:"Villa",    hot:true  },
  { id:53, city:"cabo",       name:"Medano Beach Penthouse",      cat:"stay", emoji:"🏖️", price:"$$$", rating:4.8, vibe:"Beachfront · Rooftop terrace · 3BR",            badge:"Penthouse",hot:false },
  { id:54, city:"mykonos",    name:"Cycladic Cliffside Villa",    cat:"stay", emoji:"🏛️", price:"$$$$",rating:5.0, vibe:"Infinity pool · Sea views · 4BR",               badge:"Villa",    hot:true  },
  { id:55, city:"mykonos",    name:"Mykonos Town Boutique Hotel", cat:"stay", emoji:"🌅", price:"$$$", rating:4.9, vibe:"Rooftop bar · Windmill views · Walking distance",badge:"Hotel",    hot:false },

  // Stays — new US cities
  { id:112, city:"charleston",  name:"Rainbow Row Historic Home",    cat:"stay", emoji:"🌈", price:"$$$", rating:4.9, vibe:"5BR · Private courtyard · Walk everywhere",      badge:"Airbnb",    hot:true  },
  { id:113, city:"charleston",  name:"The Spectator Hotel",          cat:"stay", emoji:"🏨", price:"$$$$",rating:4.8, vibe:"Downtown · Rooftop bar · Classic Charleston",    badge:"Hotel",     hot:false },
  { id:114, city:"savannah",    name:"Forsyth Park Mansion",         cat:"stay", emoji:"🌿", price:"$$$", rating:5.0, vibe:"4BR · Front porch · Fountain views",             badge:"Mansion",   hot:true  },
  { id:115, city:"savannah",    name:"River Street Loft",            cat:"stay", emoji:"🎷", price:"$$",  rating:4.7, vibe:"Riverfront views · Walk to bars",                badge:"Airbnb",    hot:false },
  { id:116, city:"nyc",         name:"Hell's Kitchen Penthouse",     cat:"stay", emoji:"🗽", price:"$$$$",rating:4.9, vibe:"3BR · Manhattan views · Walk to Midtown",        badge:"Penthouse", hot:true  },
  { id:117, city:"nyc",         name:"Brooklyn Brownstone",          cat:"stay", emoji:"🏙️", price:"$$$", rating:4.8, vibe:"4BR · Rooftop deck · Hip neighborhood",          badge:"Airbnb",    hot:false },
  { id:118, city:"chicago",     name:"Gold Coast Party Penthouse",   cat:"stay", emoji:"🌃", price:"$$$$",rating:4.9, vibe:"Lake views · 3BR · Walk to bars",                badge:"Penthouse", hot:true  },
  { id:119, city:"chicago",     name:"Wicker Park Loft",             cat:"stay", emoji:"🎨", price:"$$$", rating:4.8, vibe:"4BR · Trendy neighborhood · Hip vibes",          badge:"Airbnb",    hot:false },
  { id:120, city:"sandiego",    name:"Pacific Beach Oceanfront Home",cat:"stay", emoji:"🏖️", price:"$$$$",rating:5.0, vibe:"4BR · Private deck · Steps to beach",           badge:"Beach Home", hot:true  },
  { id:121, city:"sandiego",    name:"Coronado Island Bungalow",     cat:"stay", emoji:"🌴", price:"$$$", rating:4.8, vibe:"3BR · Quiet island · Del Coronado nearby",       badge:"Airbnb",    hot:false },
  { id:122, city:"palmsprings", name:"Midcentury Pool Estate",       cat:"stay", emoji:"🏊", price:"$$$$",rating:5.0, vibe:"Private pool · 4BR · Mountain views",           badge:"Estate",    hot:true  },
  { id:123, city:"palmsprings", name:"Desert Bungalow Resort",       cat:"stay", emoji:"🌵", price:"$$$", rating:4.8, vibe:"Boutique · Pool · Retro Palm Springs vibes",     badge:"Resort",    hot:false },
  { id:124, city:"napa",        name:"Vineyard Guest House",         cat:"stay", emoji:"🍷", price:"$$$$",rating:5.0, vibe:"Private vineyard · Wine · 3BR",                 badge:"Estate",    hot:true  },
  { id:125, city:"napa",        name:"Napa Valley Cottage",          cat:"stay", emoji:"🧺", price:"$$$", rating:4.9, vibe:"Cozy · Wine country · Walking distance",         badge:"Airbnb",    hot:false },
  { id:126, city:"keywest",     name:"Old Town Conch Compound",      cat:"stay", emoji:"🦜", price:"$$$", rating:4.9, vibe:"Pool · 4BR · Walk to Duval St",                 badge:"Compound",  hot:true  },
  { id:127, city:"keywest",     name:"Sunset Key Cottage",           cat:"stay", emoji:"🌅", price:"$$$$",rating:5.0, vibe:"Private island · All-inclusive · 3BR",           badge:"Resort",    hot:false },
  { id:128, city:"sedona",      name:"Red Rock View Villa",          cat:"stay", emoji:"🔴", price:"$$$$",rating:5.0, vibe:"Private pool · 4BR · Panoramic vortex views",   badge:"Villa",     hot:true  },
  { id:129, city:"sedona",      name:"Enchantment Area Casita",      cat:"stay", emoji:"🌵", price:"$$$", rating:4.8, vibe:"3BR · Boho décor · Desert serenity",             badge:"Airbnb",    hot:false },
  { id:130, city:"denver",      name:"Capitol Hill Party House",     cat:"stay", emoji:"⛰️", price:"$$$", rating:4.9, vibe:"5BR · Hot tub · Mountain views from roof",       badge:"Airbnb",    hot:true  },
  { id:131, city:"denver",      name:"The Crawford Hotel RiNo",      cat:"stay", emoji:"🚂", price:"$$$$",rating:4.8, vibe:"Boutique · Historic Union Station · Lively area",badge:"Hotel",     hot:false },
  { id:132, city:"houston",     name:"Midtown Houston Party House",  cat:"stay", emoji:"🤘", price:"$$$", rating:4.8, vibe:"4BR · Pool · Walk to Montrose bars",             badge:"Airbnb",    hot:true  },
  { id:133, city:"houston",     name:"Heights Victorian Home",       cat:"stay", emoji:"🏠", price:"$$",  rating:4.7, vibe:"3BR · Charming neighborhood · Classic HTX",      badge:"Airbnb",    hot:false },

  // ── Flights ────────────────────────────────────────────────────────────────
  { id:200, city:"miami",       name:"Flights to Miami",              cat:"flight", emoji:"✈️", price:"$$",   rating:4.9, vibe:"MIA · Direct flights from most major US cities",  badge:"Flights", hot:true,  bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:MIA" },
  { id:201, city:"nashville",   name:"Flights to Nashville",          cat:"flight", emoji:"✈️", price:"$$",   rating:4.9, vibe:"BNA · Southwest & Delta hub · Easy connections", badge:"Flights", hot:true,  bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:BNA" },
  { id:202, city:"vegas",       name:"Flights to Las Vegas",          cat:"flight", emoji:"✈️", price:"$",    rating:4.9, vibe:"LAS · Best flight deals in the US",              badge:"Flights", hot:true,  bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:LAS" },
  { id:203, city:"nola",        name:"Flights to New Orleans",        cat:"flight", emoji:"✈️", price:"$$",   rating:4.8, vibe:"MSY · Direct from most Southeast hubs",          badge:"Flights", hot:true,  bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:MSY" },
  { id:204, city:"scottsdale",  name:"Flights to Phoenix/Scottsdale", cat:"flight", emoji:"✈️", price:"$$",   rating:4.8, vibe:"PHX · Southwest stronghold · Great deals",       badge:"Flights", hot:true,  bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:PHX" },
  { id:205, city:"austin",      name:"Flights to Austin",             cat:"flight", emoji:"✈️", price:"$$",   rating:4.8, vibe:"AUS · Growing hub · Southwest, United, Delta",   badge:"Flights", hot:true,  bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:AUS" },
  { id:206, city:"charleston",  name:"Flights to Charleston",         cat:"flight", emoji:"✈️", price:"$$",   rating:4.7, vibe:"CHS · American, Delta, Southwest",                badge:"Flights", hot:false, bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:CHS" },
  { id:207, city:"savannah",    name:"Flights to Savannah",           cat:"flight", emoji:"✈️", price:"$$",   rating:4.7, vibe:"SAV · Delta hub · Easy Southern connections",    badge:"Flights", hot:false, bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:SAV" },
  { id:208, city:"nyc",         name:"Flights to New York City",      cat:"flight", emoji:"✈️", price:"$$$",  rating:4.8, vibe:"JFK/LGA/EWR · All major airlines",               badge:"Flights", hot:true,  bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:JFK" },
  { id:209, city:"chicago",     name:"Flights to Chicago",            cat:"flight", emoji:"✈️", price:"$$",   rating:4.8, vibe:"ORD/MDW · United hub · Great midwest prices",    badge:"Flights", hot:true,  bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:ORD" },
  { id:210, city:"sandiego",    name:"Flights to San Diego",          cat:"flight", emoji:"✈️", price:"$$",   rating:4.8, vibe:"SAN · Southwest & Alaska stronghold",             badge:"Flights", hot:false, bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:SAN" },
  { id:211, city:"palmsprings", name:"Flights to Palm Springs",       cat:"flight", emoji:"✈️", price:"$$",   rating:4.7, vibe:"PSP · Small airport · Direct from LA, SF, SEA",  badge:"Flights", hot:false, bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:PSP" },
  { id:212, city:"napa",        name:"Flights to Napa (SFO)",         cat:"flight", emoji:"✈️", price:"$$$",  rating:4.7, vibe:"Fly into SFO · 1 hr drive to Wine Country",       badge:"Flights", hot:false, bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:SFO" },
  { id:213, city:"keywest",     name:"Flights to Key West",           cat:"flight", emoji:"✈️", price:"$$$",  rating:4.7, vibe:"EYW · Small paradise airport · Direct from MIA", badge:"Flights", hot:false, bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:EYW" },
  { id:214, city:"sedona",      name:"Flights to Sedona (PHX)",       cat:"flight", emoji:"✈️", price:"$$",   rating:4.7, vibe:"Fly into PHX · 2 hr scenic drive to Sedona",      badge:"Flights", hot:false, bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:PHX" },
  { id:215, city:"denver",      name:"Flights to Denver",             cat:"flight", emoji:"✈️", price:"$$",   rating:4.8, vibe:"DEN · United hub · Mountain gateway airport",     badge:"Flights", hot:true,  bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:DEN" },
  { id:216, city:"houston",     name:"Flights to Houston",            cat:"flight", emoji:"✈️", price:"$$",   rating:4.8, vibe:"IAH/HOU · United hub · Great Southern deals",    badge:"Flights", hot:true,  bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:IAH" },
  { id:217, city:"cabo",        name:"Flights to Cabo",               cat:"flight", emoji:"✈️", price:"$$$",  rating:4.9, vibe:"SJD · Direct from most US cities · 3-5 hrs",     badge:"Flights", hot:true,  bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:SJD" },
  { id:218, city:"mykonos",     name:"Flights to Mykonos",            cat:"flight", emoji:"✈️", price:"$$$$", rating:4.9, vibe:"JMK · Via Athens or direct from NYC",             badge:"Flights", hot:true,  bookingUrl:"https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:USA,to:JMK" },

  // ── Cars ───────────────────────────────────────────────────────────────────
  { id:250, city:"miami",       name:"Rent a Car in Miami",           cat:"car", emoji:"🚗", price:"$$",   rating:4.8, vibe:"Turo · Cabrio · Jeep Wrangler · Party van",      badge:"Car Rental", hot:true,  bookingUrl:"https://turo.com/search?location=Miami%2C+FL" },
  { id:251, city:"nashville",   name:"Rent a Car in Nashville",       cat:"car", emoji:"🚗", price:"$$",   rating:4.8, vibe:"Turo · Party bus · Luxury SUV options",          badge:"Car Rental", hot:true,  bookingUrl:"https://turo.com/search?location=Nashville%2C+TN" },
  { id:252, city:"vegas",       name:"Rent a Car in Las Vegas",       cat:"car", emoji:"🚗", price:"$$",   rating:4.8, vibe:"Turo · Convertible · Party van · Strip cruiser",  badge:"Car Rental", hot:true,  bookingUrl:"https://turo.com/search?location=Las+Vegas%2C+NV" },
  { id:253, city:"nola",        name:"Rent a Car in New Orleans",     cat:"car", emoji:"🚗", price:"$",    rating:4.7, vibe:"Turo · Most things walkable · Car for day trips", badge:"Car Rental", hot:false, bookingUrl:"https://turo.com/search?location=New+Orleans%2C+LA" },
  { id:254, city:"scottsdale",  name:"Rent a Car in Scottsdale",      cat:"car", emoji:"🚗", price:"$$",   rating:4.8, vibe:"Turo · Jeep · Convertible · Desert vibes",       badge:"Car Rental", hot:true,  bookingUrl:"https://turo.com/search?location=Scottsdale%2C+AZ" },
  { id:255, city:"austin",      name:"Rent a Car in Austin",          cat:"car", emoji:"🚗", price:"$$",   rating:4.8, vibe:"Turo · Pickup trucks · Vintage Bronco · SUVs",    badge:"Car Rental", hot:true,  bookingUrl:"https://turo.com/search?location=Austin%2C+TX" },
  { id:256, city:"charleston",  name:"Rent a Car in Charleston",      cat:"car", emoji:"🚗", price:"$",    rating:4.7, vibe:"Turo · Golf cart · Vintage convertible",          badge:"Car Rental", hot:false, bookingUrl:"https://turo.com/search?location=Charleston%2C+SC" },
  { id:257, city:"savannah",    name:"Rent a Car in Savannah",        cat:"car", emoji:"🚗", price:"$",    rating:4.7, vibe:"Turo · Golf cart · Historic district cruiser",    badge:"Car Rental", hot:false, bookingUrl:"https://turo.com/search?location=Savannah%2C+GA" },
  { id:258, city:"nyc",         name:"Rent a Car in New York City",   cat:"car", emoji:"🚗", price:"$$$",  rating:4.6, vibe:"Turo · Only for day trips · Subway is king",      badge:"Car Rental", hot:false, bookingUrl:"https://turo.com/search?location=New+York%2C+NY" },
  { id:259, city:"chicago",     name:"Rent a Car in Chicago",         cat:"car", emoji:"🚗", price:"$$",   rating:4.7, vibe:"Turo · Luxury SUV · L train for the city",        badge:"Car Rental", hot:false, bookingUrl:"https://turo.com/search?location=Chicago%2C+IL" },
  { id:260, city:"sandiego",    name:"Rent a Car in San Diego",       cat:"car", emoji:"🚗", price:"$$",   rating:4.8, vibe:"Turo · Convertible · Essential for beach hops",   badge:"Car Rental", hot:true,  bookingUrl:"https://turo.com/search?location=San+Diego%2C+CA" },
  { id:261, city:"palmsprings", name:"Rent a Car in Palm Springs",    cat:"car", emoji:"🚗", price:"$$",   rating:4.8, vibe:"Turo · Convertible · Jeep · Desert essential",    badge:"Car Rental", hot:true,  bookingUrl:"https://turo.com/search?location=Palm+Springs%2C+CA" },
  { id:262, city:"napa",        name:"Rent a Car in Napa",            cat:"car", emoji:"🚗", price:"$$",   rating:4.8, vibe:"Turo · Wine country essential · Scenic drives",   badge:"Car Rental", hot:true,  bookingUrl:"https://turo.com/search?location=Napa%2C+CA" },
  { id:263, city:"keywest",     name:"Rent a Car in Key West",        cat:"car", emoji:"🚗", price:"$$",   rating:4.7, vibe:"Turo · Golf cart · Scooter · Jeep Wrangler",      badge:"Car Rental", hot:false, bookingUrl:"https://turo.com/search?location=Key+West%2C+FL" },
  { id:264, city:"sedona",      name:"Rent a Car in Sedona",          cat:"car", emoji:"🚗", price:"$$",   rating:4.8, vibe:"Turo · Jeep essential · Red rock trail access",   badge:"Car Rental", hot:true,  bookingUrl:"https://turo.com/search?location=Sedona%2C+AZ" },
  { id:265, city:"denver",      name:"Rent a Car in Denver",          cat:"car", emoji:"🚗", price:"$$",   rating:4.8, vibe:"Turo · SUV · 4WD for mountain trips",              badge:"Car Rental", hot:true,  bookingUrl:"https://turo.com/search?location=Denver%2C+CO" },
  { id:266, city:"houston",     name:"Rent a Car in Houston",         cat:"car", emoji:"🚗", price:"$",    rating:4.7, vibe:"Turo · Car essential · Great rates in HTX",        badge:"Car Rental", hot:false, bookingUrl:"https://turo.com/search?location=Houston%2C+TX" },
  { id:267, city:"cabo",        name:"Rent a Car in Cabo",            cat:"car", emoji:"🚗", price:"$$",   rating:4.7, vibe:"Turo · Jeep for beach hops · ATV available",      badge:"Car Rental", hot:true,  bookingUrl:"https://turo.com/search?location=Los+Cabos%2C+Mexico" },
  { id:268, city:"mykonos",     name:"Rent a Car in Mykonos",         cat:"car", emoji:"🚗", price:"$$$",  rating:4.8, vibe:"Turo · ATV · Quad · Essential for the island",    badge:"Car Rental", hot:true,  bookingUrl:"https://turo.com/search?location=Mykonos%2C+Greece" },
];

const CITIES = [
  { id:"all",         name:"All Cities" },
  { id:"miami",       name:"Miami" },
  { id:"nashville",   name:"Nashville" },
  { id:"vegas",       name:"Las Vegas" },
  { id:"nola",        name:"New Orleans" },
  { id:"scottsdale",  name:"Scottsdale" },
  { id:"austin",      name:"Austin" },
  { id:"charleston",  name:"Charleston" },
  { id:"savannah",    name:"Savannah" },
  { id:"nyc",         name:"New York City" },
  { id:"chicago",     name:"Chicago" },
  { id:"sandiego",    name:"San Diego" },
  { id:"palmsprings", name:"Palm Springs" },
  { id:"napa",        name:"Napa Valley" },
  { id:"keywest",     name:"Key West" },
  { id:"sedona",      name:"Sedona" },
  { id:"denver",      name:"Denver / Aspen" },
  { id:"houston",     name:"Houston" },
  { id:"cabo",        name:"Cabo San Lucas" },
  { id:"mykonos",     name:"Mykonos" },
];

// ─── Time slot mapping ────────────────────────────────────────────────────
const CAT_SLOT = {
  spa:        "morning",
  water:      "afternoon",
  activity:   "afternoon",
  food:       "evening",
  restaurant: "evening",
  bar:        "evening",
  nightlife:  "night",
};

const SLOT_LABELS = {
  morning:   { label:"Morning",       emoji:"☀️" },
  afternoon: { label:"Afternoon",     emoji:"🌤️" },
  evening:   { label:"Evening",       emoji:"🌆" },
  night:     { label:"Night Out",     emoji:"🌙" },
};

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Slot rotation so each day pulls from a different pool order
const DAY_SLOT_ORDERS = [
  ["morning",   "afternoon", "evening", "night"],
  ["afternoon", "morning",   "evening", "night"],
  ["morning",   "afternoon", "night",   "evening"],
  ["afternoon", "night",     "morning", "evening"],
  ["morning",   "night",     "afternoon","evening"],
  ["afternoon", "morning",   "night",   "evening"],
  ["morning",   "evening",   "afternoon","night"],
];

function buildItinerary(cityExps, numDays) {
  // Separate stays from schedulable experiences
  const schedulable = cityExps.filter(e => e.cat !== "stay");

  const slots = { morning:[], afternoon:[], evening:[], night:[] };
  schedulable.forEach(e => {
    const s = CAT_SLOT[e.cat];
    if (s) slots[s].push(e);
  });
  // Shuffle each bucket fresh
  Object.keys(slots).forEach(k => { slots[k] = shuffle(slots[k]); });

  // Pointers per slot so we cycle through all items across days
  const ptrs = { morning:0, afternoon:0, evening:0, night:0 };

  const pick = (slot) => {
    const pool = slots[slot];
    if (!pool.length) return null;
    const item = pool[ptrs[slot] % pool.length];
    ptrs[slot]++;
    return item;
  };

  const days = [];
  for (let d = 0; d < numDays; d++) {
    const order = DAY_SLOT_ORDERS[d % DAY_SLOT_ORDERS.length];
    const day = [];
    order.forEach(slot => {
      const item = pick(slot);
      if (item) day.push({ slot, ...item });
    });
    if (day.length) days.push(day);
  }

  return days;
}

// ─── Activity type options for wizard step 4 ─────────────────────────────
const ACT_OPTIONS = [
  { id:"activity",  label:"Activities",    icon:"🎉", cats:["activity"] },
  { id:"food",      label:"Restaurants",   icon:"🍽️", cats:["food","restaurant"] },
  { id:"bar",       label:"Bars",          icon:"🍸", cats:["bar"] },
  { id:"nightlife", label:"Nightlife",     icon:"🌙", cats:["nightlife"] },
  { id:"spa",       label:"Spa",           icon:"💆", cats:["spa"] },
  { id:"water",     label:"Boats & Water", icon:"⛵", cats:["water"] },
];

// ─── Bride type → preferred experience categories ────────────────────────
const BRIDE_PREFS = {
  laid_back:    ["spa","water","activity"],
  party_animal: ["nightlife","bar","activity"],
  foodie:       ["food","restaurant","bar"],
  adventurous:  ["activity","water","nightlife"],
  classy:       ["restaurant","spa","bar"],
  chic:         ["nightlife","restaurant","spa"],
  nature:       ["activity","water","spa"],
  wild:         ["nightlife","bar","activity"],
};

// Cities that have EXP data
const EXPLORE_CITY_IDS = new Set(["miami","nashville","vegas","nola","scottsdale","austin","charleston","savannah","nyc","chicago","sandiego","palmsprings","napa","keywest","sedona","denver","houston","corpuschristi","boston","cabo","mykonos"]);


// ─── Helper: generate detail page content from experience data ───────────────
function expDescription(e, cityName) {
  const base = {
    water:      `Set sail on an unforgettable on-water experience in ${cityName}. ${e.vibe}. This is the kind of memory your group will talk about for years — sun, champagne, and your whole crew together.`,
    spa:        `Escape the chaos and treat your group to pure bliss in ${cityName}. ${e.vibe}. From the moment you arrive you'll be wrapped in calm, luxury, and total relaxation.`,
    bar:        `${cityName}'s bar scene is legendary, and this experience puts you right in the middle of it. ${e.vibe}. Expect VIP treatment, great drinks, and non-stop energy all night.`,
    food:       `Food is how ${cityName} shows off, and this experience delivers the very best of it. ${e.vibe}. Come hungry, leave obsessed.`,
    restaurant: `Food is how ${cityName} shows off, and this experience delivers the very best of it. ${e.vibe}. Come hungry, leave obsessed.`,
    activity:   `This is the experience your group will be talking about long after the weekend ends. ${e.vibe}. Designed for bachelorette groups who want to do something truly unforgettable in ${cityName}.`,
    nightlife:  `When the sun goes down, ${cityName} turns into a whole different world. ${e.vibe}. This experience gets your group straight to the best of it — no waiting, no guessing.`,
    show:       `${e.name} is one of ${cityName}'s most iconic shows, and your group gets front-row access. ${e.vibe}. An experience that goes way beyond a normal night out.`,
  };
  return base[e.cat] || `${e.name} is one of ${cityName}'s top bachelorette experiences. ${e.vibe}. Book early — this one fills up fast.`;
}

function expBullets(e) {
  const bullets = {
    water:      ["Private or semi-private group setup","Champagne & drinks included or available","Breathtaking views & perfect photo ops","Crew handles everything so you just enjoy"],
    spa:        ["Full group booking available","Champagne welcome or add-on available","Head-to-toe treatments for every vibe","Private area for your group"],
    bar:        ["VIP access & skip-the-line entry","Curated stops at the city's best spots","Free shots or welcome drinks included","Perfect for groups of 6–20"],
    food:       ["Local guide with insider picks","Multiple tasting stops","Bottomless or drink add-ons available","No planning required — just show up"],
    restaurant: ["Group reservation handled for you","Bottomless brunch or dinner options","Perfect backdrop for bride photos","Private section available for large groups"],
    activity:   ["Private group booking available","No experience required — beginner friendly","Perfect for groups of all sizes","Unforgettable photos & memories guaranteed"],
    nightlife:  ["VIP table or entry included","Bottle service available","No standing in line","DJ, dancing, and full send vibes"],
    show:       ["Front-row or premium seating available","One-of-a-kind bachelorette experience","Dinner or drink package options","Bride gets special treatment"],
  };
  return bullets[e.cat] || ["Designed for bachelorette groups","Easy group booking","Great for all group sizes","Unforgettable memories"];
}

function expDuration(e) {
  const dur = { water:"2–3 hrs", spa:"3–5 hrs", bar:"2–3 hrs", food:"2 hrs", restaurant:"1.5–2 hrs", activity:"1.5–2 hrs", nightlife:"3–4 hrs", show:"2 hrs" };
  return dur[e.cat] || "2 hrs";
}

function expStartingPrice(e) {
  const map = { "$$$$":"$150", "$$$":"$75", "$$":"$45", "$":"$25" };
  return map[e.price] || "$50";
}

// ─── Experience Detail Page ───────────────────────────────────────────────────
function ExperienceDetail({ e, groupSize, onBack, cityName, similar, viatorUrl, opentableUrl, CAT_GROUP, CITIES, IMG }) {
  const [date, setDate] = React.useState("");
  const [guests, setGuests] = React.useState(groupSize || 4);

  const bookingUrl = e.bookingUrl
    ? e.bookingUrl
    : CAT_GROUP[e.cat] === "dining"
      ? opentableUrl(e.name, cityName)
      : CAT_GROUP[e.cat] === "stay"
        ? `https://www.airbnb.com/s/${encodeURIComponent(cityName)}/homes?adults=${guests}`
        : viatorUrl(e.name, cityName);

  const bullets = expBullets(e);
  const desc    = expDescription(e, cityName);
  const dur     = expDuration(e);
  const price   = expStartingPrice(e);
  const photo   = IMG[e.cat] || IMG.activity;

  const inputStyle = {
    flex:1, padding:"10px 12px", borderRadius:10,
    border:`1.5px solid #e0d0e8`, fontFamily:"'DM Sans',sans-serif",
    fontSize:13, color:"#1a1a2e", background:WHITE, boxSizing:"border-box",
  };

  return (
    <div style={{ paddingBottom:32 }}>
      {/* Back button */}
      <button onClick={onBack} style={{
        display:"flex", alignItems:"center", gap:6, background:"none", border:"none",
        color:HOT, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700,
        cursor:"pointer", padding:"12px 0 8px",
      }}>
        ← Back to Explore
      </button>

      {/* Hero photo */}
      <div style={{ width:"100%", height:220, borderRadius:18, overflow:"hidden", marginBottom:12, position:"relative" }}>
        <img src={photo} alt={e.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
        {e.hot && (
          <div style={{ position:"absolute", bottom:12, left:12, background:PUNCH, borderRadius:50, padding:"3px 10px", fontSize:9, fontWeight:800, color:WHITE, fontFamily:"'DM Sans',sans-serif" }}>
            🔥 POPULAR
          </div>
        )}
      </div>

      {/* Photo grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:16 }}>
        {[IMG[e.cat], IMG.activity, IMG.bar, IMG.stay].filter(Boolean).slice(0,4).map((src,i) => (
          <div key={i} style={{ height:90, borderRadius:12, overflow:"hidden" }}>
            <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          </div>
        ))}
      </div>

      {/* Title + meta */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"inline-block", background:SOFT, border:`1px solid ${MID}`, borderRadius:50, padding:"3px 10px", fontSize:9, fontWeight:700, color:HOT, fontFamily:"'DM Sans',sans-serif", marginBottom:8 }}>
          🎉 {e.badge}
        </div>
        <div style={{ fontSize:20, fontWeight:800, fontFamily:"'Playfair Display',Georgia,serif", color:"#1a1a2e", lineHeight:1.25, marginBottom:10 }}>
          {e.name}
        </div>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          <span style={{ fontSize:12, color:"#555", fontFamily:"'DM Sans',sans-serif" }}>⭐ {e.rating} rating</span>
          <span style={{ fontSize:12, color:"#555", fontFamily:"'DM Sans',sans-serif" }}>⏱ {dur}</span>
          <span style={{ fontSize:12, color:PUNCH, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>Starting at {price}/person</span>
        </div>
      </div>

      {/* Book Now CTA */}
      <a href={bookingUrl} target="_blank" rel="noreferrer" style={{ textDecoration:"none", display:"block", marginBottom:20 }}>
        <button style={{
          width:"100%", background:`linear-gradient(135deg,${HOT},${PUNCH})`,
          color:WHITE, border:"none", borderRadius:14, padding:"15px",
          fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:800,
          cursor:"pointer", letterSpacing:"0.3px",
        }}>
          Book Now →
        </button>
      </a>

      {/* About */}
      <div style={{ background:WHITE, borderRadius:16, padding:"16px", marginBottom:12, boxShadow:"0 2px 12px rgba(45,10,24,0.08)" }}>
        <div style={{ fontSize:15, fontWeight:800, fontFamily:"'Playfair Display',Georgia,serif", color:"#1a1a2e", marginBottom:10 }}>
          About this Experience
        </div>
        <div style={{ fontSize:12, color:"#555", fontFamily:"'DM Sans',sans-serif", lineHeight:1.7, marginBottom:14 }}>
          {desc}
        </div>
        <div style={{ fontSize:13, fontWeight:700, color:"#1a1a2e", fontFamily:"'DM Sans',sans-serif", marginBottom:8 }}>
          Why we love it for your party:
        </div>
        {bullets.map((b, i) => (
          <div key={i} style={{ display:"flex", gap:8, marginBottom:6, alignItems:"flex-start" }}>
            <span style={{ color:HOT, fontWeight:900, flexShrink:0 }}>•</span>
            <span style={{ fontSize:12, color:"#555", fontFamily:"'DM Sans',sans-serif", lineHeight:1.5 }}>{b}</span>
          </div>
        ))}
      </div>

      {/* Check Availability */}
      <div style={{ background:"#1a1a2e", borderRadius:16, padding:"16px", marginBottom:12 }}>
        <div style={{ fontSize:15, fontWeight:800, fontFamily:"'Playfair Display',Georgia,serif", color:WHITE, marginBottom:14 }}>
          Check Availability
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ ...inputStyle, flex:1 }} placeholder="Choose Date"/>
          <select value={guests} onChange={e=>setGuests(Number(e.target.value))} style={{ ...inputStyle, flex:1 }}>
            {[2,3,4,5,6,7,8,9,10,12,15,20].map(n=>(
              <option key={n} value={n}>{n} Guests</option>
            ))}
          </select>
        </div>
        <a href={bookingUrl} target="_blank" rel="noreferrer" style={{ textDecoration:"none", display:"block" }}>
          <button style={{
            width:"100%", background:`linear-gradient(135deg,${HOT},${PUNCH})`,
            color:WHITE, border:"none", borderRadius:12, padding:"13px",
            fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:800, cursor:"pointer",
          }}>
            Select Option →
          </button>
        </a>
      </div>

      {/* Cancellation policy */}
      <div style={{ background:WHITE, borderRadius:16, padding:"14px 16px", marginBottom:12, boxShadow:"0 2px 12px rgba(45,10,24,0.08)" }}>
        <div style={{ fontSize:13, fontWeight:800, fontFamily:"'Playfair Display',Georgia,serif", color:"#1a1a2e", marginBottom:8 }}>
          Cancellation Policy
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ fontSize:18 }}>🛡️</span>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"#1a1a2e", fontFamily:"'DM Sans',sans-serif" }}>Flexible Cancellation</div>
            <div style={{ fontSize:11, color:"#888", fontFamily:"'DM Sans',sans-serif", marginTop:3, lineHeight:1.5 }}>
              Cancel up to 24 hours in advance for a full refund. Policies may vary by provider.
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div style={{ background:WHITE, borderRadius:16, padding:"14px 16px", marginBottom:16, boxShadow:"0 2px 12px rgba(45,10,24,0.08)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:800, fontFamily:"'Playfair Display',Georgia,serif", color:"#1a1a2e" }}>Reviews</div>
            <div style={{ fontSize:11, color:"#888", fontFamily:"'DM Sans',sans-serif" }}>⭐ {e.rating} · Bachelorette approved</div>
          </div>
        </div>
        {[
          { name:"Megan T.", date:"March 2025", text:"Absolutely incredible — the highlight of our entire bachelorette weekend. 10/10 would book again!" },
          { name:"Kayla R.", date:"January 2025", text:"Our group of 9 had the best time. Everything was seamless and the bride was obsessed." },
        ].map((r, i) => (
          <div key={i} style={{ borderTop:`1px solid ${SOFT}`, paddingTop:10, marginTop:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${HOT},${PUNCH})`, display:"flex", alignItems:"center", justifyContent:"center", color:WHITE, fontSize:13, fontWeight:700, fontFamily:"'DM Sans',sans-serif", flexShrink:0 }}>
                {r.name[0]}
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:"#1a1a2e", fontFamily:"'DM Sans',sans-serif" }}>{r.name}</div>
                <div style={{ fontSize:10, color:"#aaa", fontFamily:"'DM Sans',sans-serif" }}>{r.date} · Bachelorette Party</div>
              </div>
            </div>
            <div style={{ fontSize:10, color:"#f59e0b" }}>★★★★★</div>
            <div style={{ fontSize:12, color:"#555", fontFamily:"'DM Sans',sans-serif", marginTop:4, lineHeight:1.5 }}>{r.text}</div>
          </div>
        ))}
      </div>

      {/* Similar Experiences */}
      {similar.length > 0 && (
        <div>
          <div style={{ fontSize:14, fontWeight:800, fontFamily:"'Playfair Display',Georgia,serif", color:"#1a1a2e", marginBottom:12 }}>
            Similar Experiences
          </div>
          <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:8, scrollbarWidth:"none" }}>
            {similar.map(s => (
              <div key={s.id} style={{ flexShrink:0, width:160, borderRadius:14, overflow:"hidden", boxShadow:"0 3px 12px rgba(45,10,24,0.10)", background:WHITE }}>
                <div style={{ height:100, overflow:"hidden", position:"relative" }}>
                  <img src={IMG[s.cat]||IMG.activity} alt={s.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  <div style={{ position:"absolute", top:6, left:6, background:"rgba(0,0,0,0.45)", borderRadius:50, padding:"2px 8px", fontSize:8, fontWeight:700, color:WHITE, fontFamily:"'DM Sans',sans-serif" }}>🎉 {s.badge}</div>
                </div>
                <div style={{ padding:"8px 10px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"#1a1a2e", fontFamily:"'DM Sans',sans-serif", lineHeight:1.3, marginBottom:4 }}>{s.name}</div>
                  <div style={{ fontSize:9, color:"#888", fontFamily:"'DM Sans',sans-serif" }}>⭐ {s.rating} · {s.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExploreTab({ groupSize }) {
  const [brideType, setBrideType] = useState(null);      // bride personality id
  const [region,    setRegion]    = useState("us");      // "us" | "intl"
  const [city,      setCity]      = useState("all");
  const [actTypes,  setActTypes]  = useState(new Set()); // selected ACT_OPTION ids
  const [numDays,   setNumDays]   = useState(3);
  const [itin,      setItin]      = useState(null);
  const [generating, setGen]      = useState(false);
  const [cat,       setCat]       = useState("all");     // browse section filter
  const [saved,     setSaved]     = useState(new Set());
  const [selectedExp, setSelectedExp] = useState(null);

  const handleBrideType = id => {
    setBrideType(id);
    // Pre-select activity types based on bride personality
    const prefs = BRIDE_PREFS[id] || [];
    const matched = new Set(
      ACT_OPTIONS.filter(o => o.cats.some(c => prefs.includes(c))).map(o => o.id)
    );
    setActTypes(matched);
  };

  const handleRegion = r => { setRegion(r); setCity("all"); setItin(null); };

  const toggleAct = id => setActTypes(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const toggleSave = id => setSaved(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const handleGenerate = () => {
    setGen(true); setItin(null);
    let allowedCats = null;
    if (actTypes.size > 0) {
      allowedCats = new Set();
      actTypes.forEach(aid => {
        const opt = ACT_OPTIONS.find(o => o.id === aid);
        if (opt) opt.cats.forEach(c => allowedCats.add(c));
      });
    }
    setTimeout(() => {
      const cityExps = EXP.filter(e => e.city === city && (allowedCats === null || allowedCats.has(e.cat)));
      setItin(buildItinerary(cityExps, numDays));
      setGen(false);
    }, 1200);
  };

  const selectedBride = BRIDE_TYPES?.find(b => b.id === brideType);
  const usDests   = DESTS.filter(d => !d.international && EXPLORE_CITY_IDS.has(d.id));
  const intlDests = DESTS.filter(d =>  d.international);
  const destList  = region === "us" ? usDests : intlDests;

  const cityName = DESTS.find(d => d.id === city)?.name || CITIES.find(c => c.id === city)?.name || "All Cities";
  const grad = e => GRAD[CAT_GROUP[e.cat]] || [HOT, PUNCH];

  // Browse cards
  // Popular = hot:true when browsing all cities; when a city is selected show everything in that city
  const filtered = EXP
    .filter(e => city === "all" || e.city === city)
    .filter(e => {
      if (cat === "all") return city !== "all" ? true : e.hot === true;
      return CAT_GROUP[e.cat] === cat;
    })
    .sort((a, b) => (b.hot ? 1 : 0) - (a.hot ? 1 : 0)); // hot items first

  // Show detail page if an experience is selected
  if (selectedExp) {
    const detailCity = CITIES.find(c=>c.id===selectedExp.city)?.name || DESTS.find(d=>d.id===selectedExp.city)?.name || selectedExp.city;
    const similar = EXP.filter(e => e.city===selectedExp.city && e.id!==selectedExp.id && e.cat===selectedExp.cat).slice(0,6);
    return (
      <ExperienceDetail
        e={selectedExp}
        groupSize={groupSize}
        onBack={()=>setSelectedExp(null)}
        cityName={detailCity}
        similar={similar}
        viatorUrl={viatorUrl}
        opentableUrl={opentableUrl}
        CAT_GROUP={CAT_GROUP}
        CITIES={CITIES}
        IMG={IMG}
      />
    );
  }

  return (
    <div style={{ paddingBottom:8 }}>


      {/* ── CITY FILTER ───────────────────────────────────────────────────── */}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <div style={{position:"relative",flex:"0 0 auto"}}>
          <select
            value={region}
            onChange={e => handleRegion(e.target.value)}
            style={{
              padding:"9px 32px 9px 12px", borderRadius:10, border:`1.5px solid ${BORDER}`,
              fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700,
              color:DARK, background:WHITE, cursor:"pointer", appearance:"none",
            }}
          >
            <option value="us">🇺🇸 US</option>
            <option value="intl">✈️ Intl</option>
          </select>
          <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:12,pointerEvents:"none",color:HOT}}>▾</span>
        </div>
        <div style={{position:"relative",flex:1}}>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            style={{
              width:"100%", padding:"9px 32px 9px 12px",
              borderRadius:10, border:city !== "all" ? `2px solid ${HOT}` : `1.5px solid ${BORDER}`,
              fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700,
              color: city !== "all" ? HOT : "#aaa",
              background: city !== "all" ? SOFT : WHITE, cursor:"pointer", appearance:"none",
            }}
          >
            <option value="all">All cities…</option>
            {destList.map(d => {
              const hasData = EXPLORE_CITY_IDS.has(d.id);
              return (
                <option key={d.id} value={d.id} disabled={!hasData}>
                  {d.name}{!hasData ? " (coming soon)" : ""}
                </option>
              );
            })}
          </select>
          <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:12,pointerEvents:"none",color:HOT}}>▾</span>
        </div>
      </div>

      {/* ── STEP 3: What do you want to do? ──────────────────────────────── */}
      {city !== "all" && (
        <div style={{...C, marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:DARK,marginBottom:4}}>
            What do you want to do?
          </div>
          <div style={{fontSize:11,color:HOT,fontFamily:"'DM Sans',sans-serif",marginBottom:12,opacity:0.8}}>
            Pick all that apply — or leave blank for everything
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {ACT_OPTIONS.map(opt=>{
              const sel = actTypes.has(opt.id);
              return (
                <button key={opt.id} onClick={()=>toggleAct(opt.id)} style={{
                  display:"flex",alignItems:"center",gap:6,
                  padding:"8px 14px",borderRadius:50,
                  border:sel?`2px solid ${HOT}`:`1.5px solid ${BORDER}`,
                  background:sel?HOT:WHITE,
                  color:sel?WHITE:DARK,
                  fontSize:12,fontWeight:700,
                  fontFamily:"'DM Sans',sans-serif",
                  cursor:"pointer",transition:"all 0.15s",
                }}>
                  <span>{opt.icon}</span> {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}


      {/* ── GENERATED ITINERARY ──────────────────────────────────────────── */}
      {Array.isArray(itin) && (
        <div style={{ marginBottom:20 }}>
          <div style={{ textAlign:"center", marginBottom:14 }}>
            <div style={{ fontSize:18, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>
              Your {numDays}-Day {cityName} Itinerary
            </div>
            <div style={{ fontSize:11, color:HOT, fontFamily:"'DM Sans',sans-serif", marginTop:4, opacity:0.8 }}>
              Built just for your group · Never cookie cutter
            </div>
          </div>

          {itin.map((day, di) => (
            <div key={di} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ flex:1, height:1, background:BORDER }} />
                <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:HOT, whiteSpace:"nowrap" }}>
                  Day {di + 1}
                </div>
                <div style={{ flex:1, height:1, background:BORDER }} />
              </div>

              {day.map((item, ii) => {
                const sl = SLOT_LABELS[item.slot] || { label:item.slot, emoji:"📍" };
                const isDining = CAT_GROUP[item.cat] === "dining";
                return (
                  <div key={ii} style={{
                    display:"flex", gap:12, alignItems:"flex-start",
                    marginBottom:10, padding:"12px 14px",
                    background:WHITE, borderRadius:14,
                    border:`1.5px solid ${BORDER}`,
                    boxShadow:"0 2px 8px rgba(45,10,24,0.07)",
                  }}>
                    <div style={{ minWidth:58, textAlign:"center" }}>
                      <div style={{ fontSize:18 }}>{sl.emoji}</div>
                      <div style={{ fontSize:9, fontWeight:700, color:HOT, fontFamily:"'DM Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.5px", marginTop:2 }}>{sl.label}</div>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:2 }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize:10, color:HOT, fontFamily:"'DM Sans',sans-serif", opacity:0.8, marginBottom:4 }}>{item.vibe}</div>
                      <div style={{ fontSize:9, color:"#aaa", fontFamily:"'DM Sans',sans-serif" }}>⭐ {item.rating} · {item.price}</div>
                    </div>
                    <a
                      href={isDining
                        ? opentableUrl(item.name, cityName)
                        : CAT_GROUP[item.cat] === "stay"
                          ? `https://www.airbnb.com/s/${encodeURIComponent(cityName)}/homes?adults=${groupSize||4}`
                          : viatorUrl(item.name, cityName)}
                      target="_blank" rel="noreferrer"
                      style={{ textDecoration:"none", alignSelf:"center" }}
                    >
                      <div style={{
                        background:PUNCH, color:WHITE, borderRadius:8,
                        padding:"6px 10px", fontSize:10, fontWeight:700,
                        fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap",
                      }}>Book →</div>
                    </a>
                  </div>
                );
              })}
            </div>
          ))}

          <div style={{ textAlign:"center", marginTop:4, marginBottom:20 }}>
            <button onClick={handleGenerate} style={{
              background:"none", border:`1.5px solid ${HOT}`, borderRadius:10,
              padding:"8px 20px", color:HOT, fontSize:12, fontWeight:700,
              fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
            }}>
              Shuffle Again ↺
            </button>
          </div>
        </div>
      )}


      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>
          {cat === "all" ? `Popular Picks` : CATS.find(c=>c.id===cat)?.label}
          {city !== "all" && ` · ${cityName}`}
        </div>
        <div style={{ fontSize:11, color:"#bbb", fontFamily:"'DM Sans',sans-serif" }}>{filtered.length} found</div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px 20px" }}>
          <div style={{ fontSize:32, marginBottom:10 }}>🔍</div>
          <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK }}>No results</div>
          <div style={{ fontSize:12, color:"#bbb", fontFamily:"'DM Sans',sans-serif", marginTop:6 }}>Try a different city or category</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {filtered.map(e => {
            const [g1, g2] = grad(e);
            const isSaved  = saved.has(e.id);
            return (
              <div key={e.id} onClick={()=>{ if(!['flight','car'].includes(CAT_GROUP[e.cat])) setSelectedExp(e); }} style={{
                borderRadius:18, overflow:"hidden",
                boxShadow:"0 4px 16px rgba(45,10,24,0.12)",
                background:WHITE, display:"flex", flexDirection:"column",
                cursor:['flight','car'].includes(CAT_GROUP[e.cat]) ? "default" : "pointer",
              }}>
                <div style={{
                  height:110, position:"relative",
                  overflow:"hidden",
                  background:`linear-gradient(140deg,${g1},${g2})`,
                }}>
                  <img
                    src={IMG[e.cat] || IMG.activity}
                    alt={e.name}
                    style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
                    onError={ev=>{ev.target.style.display="none";}}
                  />
                  <div style={{
                    position:"absolute", top:10, left:10,
                    background:"rgba(0,0,0,0.45)", backdropFilter:"blur(6px)",
                    borderRadius:50, padding:"3px 10px",
                    fontSize:9, fontWeight:700, color:WHITE,
                    fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.5px",
                  }}>🎉 {e.badge}</div>
                  <button onClick={() => toggleSave(e.id)} style={{
                    position:"absolute", top:8, right:8,
                    width:30, height:30, borderRadius:"50%",
                    background:isSaved ? HOT : "rgba(255,255,255,0.85)",
                    border:"none", cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:14, boxShadow:"0 2px 8px rgba(0,0,0,0.15)", transition:"all 0.2s",
                  }}>{isSaved ? "❤️" : "🤍"}</button>
                  {e.hot && (
                    <div style={{
                      position:"absolute", bottom:8, left:10,
                      background:PUNCH, borderRadius:50, padding:"2px 8px",
                      fontSize:8, fontWeight:800, color:WHITE,
                      fontFamily:"'DM Sans',sans-serif",
                    }}>🔥 POPULAR</div>
                  )}
                </div>
                <div style={{ padding:"10px 12px 12px", flex:1, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:3, lineHeight:1.3 }}>{e.name}</div>
                    <div style={{ fontSize:10, color:HOT, fontFamily:"'DM Sans',sans-serif", opacity:0.8, marginBottom:6 }}>{e.vibe}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <span style={{ fontSize:10, color:"#888", fontFamily:"'DM Sans',sans-serif" }}>⭐ {e.rating}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:PUNCH, fontFamily:"'DM Sans',sans-serif" }}>{e.price}</span>
                    </div>
                  </div>
                  {['flight','car'].includes(CAT_GROUP[e.cat]) ? (
                    <a
                      href={e.bookingUrl || viatorUrl(e.name, CITIES.find(c=>c.id===e.city)?.name||"")}
                      target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}
                    >
                      <button style={{ ...BP, width:"100%", fontSize:11, padding:"8px", borderRadius:10 }}>
                        {CAT_GROUP[e.cat]==="flight" ? "Search Flights →" : "Browse Cars →"}
                      </button>
                    </a>
                  ) : (
                    <button onClick={ev=>{ev.stopPropagation();setSelectedExp(e);}} style={{ ...BP, width:"100%", fontSize:11, padding:"8px", borderRadius:10 }}>
                      View Details →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ textAlign:"center", padding:"20px 0 8px", fontSize:10, color:"#ccc", fontFamily:"'DM Sans',sans-serif" }}>
        {groupSize} in your group · Tap ❤️ to save favorites
      </div>
    </div>
  );
}
