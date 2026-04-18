import React, { useState } from 'react';
import { SOFT, MID, HOT, PUNCH, DARK, BORDER, WHITE } from '../../constants/colors.js';
import { C, BP } from '../../constants/styles.js';
import { DESTS } from '../../constants/data.js';
import SH from '../ui/SH.jsx';

// ─── Restaurant data per destination ─────────────────────────────────────────
const RESTAURANTS = {
  miami: [
    {
      id:"miami-1", name:"Komodo", cuisine:"Asian Fusion", priceRange:"$$$",
      vibe:"Rooftop · Trendy · Group-Friendly",
      rating:4.8, reviews:312, groupMin:2, groupMax:20,
      tags:["Rooftop","Cocktails","Instagram-worthy"],
      image:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
      ],
      hours:"Mon–Sun 6pm–2am",
      address:"801 Brickell Ave, Miami, FL 33131",
      desc:"Komodo is a wildly popular Brickell hot spot that's perfect for bachelorette dinners: three floors of Asian-fusion glamour, live entertainment, and unmatched cocktails. Expect to be seen.",
      menuHighlights:["Wagyu Beef Skewers","Crispy Rice with Tuna","Komodo Dragon Roll","Miso Black Cod","Lychee Martini"],
      whyWeLoveIt:["Three-floor venue with rooftop, iconic for group photos","DJ nights make it a dinner + party in one","Massive portions perfect for sharing"],
      reserveUrl:"https://www.opentable.com/komodo-miami",
    },
    {
      id:"miami-2", name:"Zuma Miami", cuisine:"Japanese Robata", priceRange:"$$$$",
      vibe:"Upscale · Sushi · Waterfront",
      rating:4.9, reviews:489, groupMin:2, groupMax:16,
      tags:["Fine Dining","Waterfront","Sushi"],
      image:"https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&q=80",
        "https://images.unsplash.com/photo-1428515613728-6b4607e44363?w=800&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      ],
      hours:"Mon–Thu 12pm–11pm · Fri–Sat 12pm–12am",
      address:"270 Biscayne Blvd Way, Miami, FL 33131",
      desc:"Waterfront Japanese dining at its finest. Zuma's contemporary Japanese menu and stunning views of Biscayne Bay make it the ultimate upscale bachelorette dinner. The omakase experience is unforgettable.",
      menuHighlights:["Spicy Edamame","Black Cod Miso","Wagyu Gyoza","Rock Shrimp Tempura","Yuzu Sake Cocktail"],
      whyWeLoveIt:["Waterfront views for gorgeous golden hour photos","Private dining available for groups 8+","Sake flights are a must for the group"],
      reserveUrl:"https://www.opentable.com/zuma-miami",
    },
    {
      id:"miami-3", name:"Beachcraft", cuisine:"Farm-to-Table", priceRange:"$$$",
      vibe:"Beach · Brunch · Outdoor",
      rating:4.7, reviews:201, groupMin:2, groupMax:30,
      tags:["Brunch","Beachside","Bottomless Mimosas"],
      image:"https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
        "https://images.unsplash.com/photo-1527628217451-b4a0e59e0764?w=800&q=80",
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
      ],
      hours:"Daily 7am–3pm (Brunch) · 6pm–10pm (Dinner)",
      address:"1 Hotel South Beach, 2341 Collins Ave, Miami Beach, FL",
      desc:"Situated at the 1 Hotel South Beach, Beachcraft is your go-to for a stunning bachelorette brunch. Bottomless rosé, fresh farm-to-table plates, and an ocean breeze? Yes, please.",
      menuHighlights:["Avocado Toast w/ Burrata","Lobster Benedict","Truffle Fries","Açaí Bowl","Bottomless Rosé"],
      whyWeLoveIt:["Steps from the beach: perfect for a brunch-to-beach day","Large group-friendly with dedicated party seating","Bottomless brunch packages available"],
      reserveUrl:"https://www.opentable.com/beachcraft-at-1-hotel-south-beach",
    },
    {
      id:"miami-4", name:"Swan Miami", cuisine:"American Brasserie", priceRange:"$$$",
      vibe:"Celeb Hotspot · Chic · Scene",
      rating:4.6, reviews:178, groupMin:2, groupMax:18,
      tags:["Celeb Spot","Cocktails","Design District"],
      image:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      ],
      hours:"Tue–Sun 7pm–1am",
      address:"90 NW 25th St, Miami, FL 33127",
      desc:"Pharrell Williams' Design District gem is the definition of bougie brunch energy. Swan draws Miami's most stylish crowd with its Hollywood-inspired menu and electric atmosphere.",
      menuHighlights:["Swan Burger","Truffle Pasta","Tuna Tartare","Smash Cake","Swan Punch"],
      whyWeLoveIt:["Celebrity-approved: snap-worthy at every angle","Design District location for post-dinner boutique crawl","DJ entertainment on weekends"],
      reserveUrl:"https://www.opentable.com/swan-miami",
    },
  ],
  nashville: [
    {
      id:"nash-1", name:"The Mockingbird", cuisine:"Southern American", priceRange:"$$",
      vibe:"Honky Tonk · Lively · Rooftop",
      rating:4.8, reviews:429, groupMin:2, groupMax:25,
      tags:["Rooftop","Live Music","Southern"],
      image:"https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
        "https://images.unsplash.com/photo-1494832944834-a43136c5bded?w=800&q=80",
      ],
      hours:"Daily 11am–2am",
      address:"2623 Gallatin Ave, Nashville, TN 37206",
      desc:"Nashville's ultimate bachelorette brunch spot. The Mockingbird sits in East Nashville with live music, rooftop vibes, and the most iconic Southern comfort food. The hot chicken biscuits alone are worth the trip.",
      menuHighlights:["Hot Chicken Biscuit","Shrimp & Grits","Biscuits & Gravy","Tennessee Mule","Rosé All Day"],
      whyWeLoveIt:["Live music every night: no cover","Rooftop is perfect for group photos in the golden hour","Party-friendly staff who are used to bach groups"],
      reserveUrl:"https://www.opentable.com/the-mockingbird-nashville",
    },
    {
      id:"nash-2", name:"Saint Anejo", cuisine:"Mexican Cantina", priceRange:"$$",
      vibe:"Fun · Tequila Bar · Rooftop",
      rating:4.7, reviews:316, groupMin:2, groupMax:30,
      tags:["Margaritas","Rooftop","Best Views"],
      image:"https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80",
        "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
      ],
      hours:"Mon–Fri 4pm–2am · Sat–Sun 11am–2am",
      address:"1120 McGavock St, Nashville, TN 37203",
      desc:"Rooftop tequila bar overlooking the Nashville skyline: this is your bachelorette happy hour spot. Craft margaritas, shareable Mexican plates, and the best views of Broadway. Start here before hitting the honky tonks.",
      menuHighlights:["Street Tacos (3 ways)","Guacamole Tableside","Margarita Flight (4 flavors)","Birria Quesadilla","Paloma Pitcher"],
      whyWeLoveIt:["Rooftop bar with Nashville skyline views: unreal for photos","Margarita flights perfect for the whole group","Prime location steps from Broadway"],
      reserveUrl:"https://www.opentable.com/saint-anejo-nashville",
    },
    {
      id:"nash-3", name:"The Pharmacy Burger", cuisine:"Burgers & Beer Garden", priceRange:"$",
      vibe:"Casual · Fun · Beer Garden",
      rating:4.9, reviews:602, groupMin:2, groupMax:40,
      tags:["Beer Garden","Casual","Fan Fave"],
      image:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
      ],
      hours:"Daily 11am–10pm",
      address:"731 McFerrin Ave, Nashville, TN 37206",
      desc:"Nashville's most beloved outdoor hangout. The Pharmacy's massive beer garden is the spot to rally the whole squad before a big night out. Craft floats, gourmet burgers, and the best laid-back energy in town.",
      menuHighlights:["Nashville Hot Burger","The Pharmacy Float","Chili Cheese Fries","Fried Pickles","Local Craft Beers on Draft"],
      whyWeLoveIt:["Huge outdoor beer garden fits the whole group easily","Budget-friendly so you save $ for the night out","Central East Nashville location"],
      reserveUrl:"https://www.opentable.com/the-pharmacy-burger-parlor",
    },
  ],
  vegas: [
    {
      id:"vegas-1", name:"Nobu Las Vegas", cuisine:"Japanese", priceRange:"$$$$",
      vibe:"Iconic · Celeb · Omakase",
      rating:4.9, reviews:891, groupMin:2, groupMax:20,
      tags:["Celebrity Chef","Sushi","Iconic"],
      image:"https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&q=80",
        "https://images.unsplash.com/photo-1428515613728-6b4607e44363?w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      ],
      hours:"Daily 5pm–11pm",
      address:"Caesar's Palace, 3570 Las Vegas Blvd S, Las Vegas, NV 89109",
      desc:"Nobu Matsuhisa's legendary Japanese-Peruvian restaurant at Caesars Palace is the gold standard for a Vegas bachelorette dinner. Impeccable sushi, black cod miso, and a sake list that will blow your mind.",
      menuHighlights:["Black Cod Miso","Yellowtail Jalapeño","Wagyu Tacos","Rock Shrimp Tempura","Yuzu Sake"],
      whyWeLoveIt:["The most iconic pre-party dinner in Vegas: everyone knows Nobu","Celebrity sightings are common: eyes peeled!","Private dining room available for large groups"],
      reserveUrl:"https://www.opentable.com/nobu-las-vegas",
    },
    {
      id:"vegas-2", name:"Vanderpump Cocktail Garden", cuisine:"Cocktail Bar & Bites", priceRange:"$$$",
      vibe:"Glam · Pink · Girls Night Out",
      rating:4.7, reviews:1203, groupMin:2, groupMax:30,
      tags:["Pink Vibes","Cocktails","Celeb Owned"],
      image:"https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      ],
      hours:"Daily 12pm–2am",
      address:"Caesars Palace Forum Shops, 3500 Las Vegas Blvd S, Las Vegas, NV",
      desc:"Lisa Vanderpump's show-stopping cocktail garden inside Caesars Palace is THE bach destination in Vegas. Pink everything, signature cocktails, and an atmosphere that screams girls' trip. Non-negotiable.",
      menuHighlights:["Pink Lady Cocktail","Vanderpump Punch Bowl","Truffle Fries","Charcuterie Board","Rosé Spritz Tower"],
      whyWeLoveIt:["The most Instagram-worthy spot in Vegas: pure pink paradise","Cocktail towers for the whole squad","Celebrity owner: expect to see Lisa Vanderpump"],
      reserveUrl:"https://www.opentable.com/vanderpump-cocktail-garden-las-vegas",
    },
    {
      id:"vegas-3", name:"Catch Las Vegas", cuisine:"Seafood & Sushi", priceRange:"$$$",
      vibe:"Rooftop · Party Vibes · Trendy",
      rating:4.8, reviews:567, groupMin:2, groupMax:25,
      tags:["Rooftop","Late Night","DJ"],
      image:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      ],
      hours:"Fri–Sat 6pm–2am · Wed–Thu 6pm–12am",
      address:"ARIA Resort & Casino, 3730 Las Vegas Blvd S, Las Vegas, NV",
      desc:"Catch Vegas transitions from a stunning seafood restaurant to a full-on rooftop party as the night goes on. DJ music, bottle service, and panoramic Strip views make this the perfect dinner-into-nightlife experience.",
      menuHighlights:["Crispy Rice with Tuna","Snow Crab Legs","Lobster Pasta","Rock Shrimp","Passion Fruit Martini"],
      whyWeLoveIt:["Dinner transitions to club: one venue for the whole night","Rooftop Strip views are unbeatable after dark","Party packages available for bachelorette groups"],
      reserveUrl:"https://www.opentable.com/catch-las-vegas",
    },
  ],
  scottsdale: [
    {
      id:"scottsdale-1", name:"Maple & Ash", cuisine:"Steakhouse", priceRange:"$$$$",
      vibe:"Upscale · Fire-Cooked · Chic",
      rating:4.9, reviews:734, groupMin:2, groupMax:20,
      tags:["Steakhouse","Fine Dining","Fire-Cooked"],
      image:"https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
      ],
      hours:"Mon–Thu 4pm–10pm · Fri–Sun 4pm–11pm",
      address:"7135 E Camelback Rd, Scottsdale, AZ 85251",
      desc:"One of the most acclaimed restaurants in the country, Maple & Ash is the ultimate celebratory dinner. Wood-fire cooking, the most decadent steaks, and a wine program that will make you feel like an absolute queen.",
      menuHighlights:["Bone-In Ribeye","Wagyu Carpaccio","Truffle Mac & Cheese","Lobster Tail","Fig & Smoke Cocktail"],
      whyWeLoveIt:["Scottsdale's #1 special occasion restaurant: you'll feel like royalty","Sommelier can curate a wine experience for your group","Desserts are presentation goals"],
      reserveUrl:"https://www.opentable.com/maple-and-ash-scottsdale",
    },
    {
      id:"scottsdale-2", name:"El Chorro", cuisine:"Southwestern", priceRange:"$$$",
      vibe:"Patio · Desert Sunset · Classic",
      rating:4.8, reviews:512, groupMin:2, groupMax:40,
      tags:["Mountain Views","Patio","Sunset Dinner"],
      image:"https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80",
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
      ],
      hours:"Mon–Sun 5pm–10pm · Weekend Brunch 10am–2pm",
      address:"5550 E Lincoln Dr, Paradise Valley, AZ 85253",
      desc:"Tucked in the foothills of Paradise Valley with Camelback Mountain as your backdrop, El Chorro delivers legendary sunsets and even better Southwestern cuisine. Their sticky buns are famous for a reason.",
      menuHighlights:["Sticky Buns (legendary)","Green Chile Corn Bisque","Filet Mignon","Desert Rose Cocktail","Churros Dessert"],
      whyWeLoveIt:["Camelback Mountain backdrop is bucket-list sunset dining","Patio can accommodate large groups in style","Brunch on Sunday with the best views in Arizona"],
      reserveUrl:"https://www.opentable.com/el-chorro-scottsdale",
    },
  ],
  nola: [
    {
      id:"nola-1", name:"Commander's Palace", cuisine:"Creole", priceRange:"$$$",
      vibe:"Historic · Iconic · Tableside Cocktails",
      rating:4.9, reviews:1089, groupMin:2, groupMax:30,
      tags:["Iconic","Creole","Historic"],
      image:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
      ],
      hours:"Mon–Fri 11:30am–1:30pm · Daily 6:30pm–9:30pm · Sat–Sun Brunch 10:30am–1:30pm",
      address:"1403 Washington Ave, New Orleans, LA 70130",
      desc:"The jewel of the Garden District. Commander's Palace has been defining New Orleans dining for over a century: white tablecloths, flaming bananas Foster, and 25-cent martinis at brunch (yes, really). A bucket-list meal.",
      menuHighlights:["Turtle Soup","Shrimp & Tasso Henican","Bread Pudding Soufflé","Bananas Foster Tableside","25¢ Martinis (brunch)"],
      whyWeLoveIt:["25-cent martinis at Saturday jazz brunch: the greatest deal in America","Flaming Bananas Foster tableside is a showstopper","Historic Garden District location for a carriage ride after"],
      reserveUrl:"https://www.opentable.com/commanders-palace",
    },
    {
      id:"nola-2", name:"Compère Lapin", cuisine:"Caribbean Creole", priceRange:"$$$",
      vibe:"Hip · Modern · Craft Cocktails",
      rating:4.8, reviews:421, groupMin:2, groupMax:20,
      tags:["Modern Creole","Craft Cocktails","Trendy"],
      image:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
      ],
      hours:"Mon–Sun 5:30pm–10pm",
      address:"535 Tchoupitoulas St, New Orleans, LA 70130",
      desc:"Chef Nina Compton's James Beard Award-winning restaurant is the modern crown jewel of New Orleans dining. Caribbean-Creole fusion, insanely good cocktails, and an energy that feels like a private party.",
      menuHighlights:["Conch Croquettes","Goat Roti","Sweet Potato Gnocchi","Rum Old Fashioned","Chocolate Budino"],
      whyWeLoveIt:["James Beard Award winning chef: serious bragging rights","Private dining available in the old 'No. 77' room","Cocktail program is among the best in the city"],
      reserveUrl:"https://www.opentable.com/compere-lapin",
    },
  ],
  charleston: [
    {
      id:"chs-1", name:"Hall's Chophouse", cuisine:"Steakhouse", priceRange:"$$$$",
      vibe:"Classic · Lively · Charleston Icon",
      rating:4.9, reviews:1241, groupMin:2, groupMax:20,
      tags:["Best Steakhouse","Charleston Classic","Lively"],
      image:"https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
      ],
      hours:"Mon–Sat 5pm–10pm · Sun 5pm–9pm",
      address:"434 King St, Charleston, SC 29403",
      desc:"Voted Charleston's best restaurant year after year for good reason. Hall's Chophouse is a loud, lively, joyful celebration in itself: the owners will shake your hand and the prime steaks will change your life.",
      menuHighlights:["12oz Prime Filet Mignon","Hall's Wedge Salad","Lobster Mac & Cheese","Crème Brûlée","Classic Sidecar"],
      whyWeLoveIt:["Owner Billy Hall personally greets every table: you'll feel like family","Live music Thursday–Saturday makes it feel like a party","Prime location on King Street for bar-hopping after"],
      reserveUrl:"https://www.opentable.com/halls-chophouse",
    },
    {
      id:"chs-2", name:"The Ordinary", cuisine:"Oyster Bar & Seafood", priceRange:"$$$",
      vibe:"Cool · Oysters · Historic Space",
      rating:4.8, reviews:678, groupMin:2, groupMax:20,
      tags:["Oysters","Best Seafood","Historic"],
      image:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
      ],
      hours:"Tue–Thu 4pm–10pm · Fri–Sat 11:30am–11pm · Sun 11:30am–9pm",
      address:"544 King St, Charleston, SC 29403",
      desc:"Set inside a stunning 1927 bank building, The Ordinary is one of America's great oyster bars. Raw bar towers, craft cocktails, and the most beautiful space in Charleston: it's a bachelorette brunch dream.",
      menuHighlights:["Grand Seafood Tower","Charleston Gold Oysters","Shrimp & Grits","Clam Chowder","The Ordinary Sour"],
      whyWeLoveIt:["Stunning 1927 bank hall converted into an oyster bar: jaw-dropping space","Seafood tower for the group is the most 'gram-worthy thing you'll do","Weekend brunch is the ultimate bach move"],
      reserveUrl:"https://www.opentable.com/the-ordinary-charleston",
    },
  ],
  corpuschristi: [
    {
      id:"cc-1",
      name:"Prime Steakhouse Whiskey Bar",
      cuisine:"Steakhouse & Seafood",
      priceRange:"$$$$",
      rating:4.9,
      reviewCount:186,
      vibe:"Upscale · Whiskey Bar · Texan Fine Dining",
      tags:["Group Friendly","Steakhouse","Whiskey Bar","Special Occasion"],
      address:"6326 Yorktown Blvd Suite 2, Corpus Christi, TX",
      hours:"Mon–Thu 4pm–10pm · Fri–Sat 4pm–11pm · Closed Sunday",
      groupMax:30,
      desc:"Corpus Christi's premier fine dining destination. USDA Prime steaks wet-aged 45 days and grilled over mesquite wood, fresh Gulf seafood, and an impressive whiskey bar — all wrapped in an upscale yet rustic Texan atmosphere. Winner of Best New Restaurant 2023.",
      photo:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      ],
      menuHighlights:["14 oz Ribeye","Crab Stuffed Flounder","Colorado Lamb Chops","Ahi Tuna Ceviche","Stuffed Lobster Tail"],
      whyWeLoveIt:[
        "Best New Restaurant 2023 — the most impressive dinner spot in Corpus Christi",
        "USDA Prime steaks mesquite-grilled to perfection, perfect for a celebration dinner",
        "20% gratuity included for groups of 7+ so no math stress for the MOH",
      ],
      reserveUrl:"https://tables.toasttab.com/restaurants/92e39c06-acb9-492a-8c4f-cd39566033cd/findTime",
    },
    {
      id:"cc-2",
      name:"El Camino Comida & Bar",
      cuisine:"Tex-Mex",
      priceRange:"$$",
      rating:4.7,
      reviewCount:412,
      vibe:"Downtown · Late Night · Margaritas",
      tags:["Tex-Mex","Margaritas","Late Night","Private Events"],
      address:"314 N Chaparral, Corpus Christi, TX 78401",
      hours:"Tue–Thu 5pm–10pm · Fri–Sat 5pm–midnight · Sun 11am–2pm · Closed Monday",
      groupMax:200,
      desc:"The best dang Tex-Mex this side of the Rio Grande. Born from the soul of the south and inspired by bold Texas flavors, El Camino serves up sizzling fajitas, barbecued oysters, creamy queso, and the best margaritas in Corpus Christi — right in the heart of downtown.",
      photo:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
        "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80",
        "https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?w=800&q=80",
      ],
      menuHighlights:["Sizzling Fajitas","Barbecued Oysters","Creamy Queso","Signature Margaritas","Fresh Seafood Apps"],
      whyWeLoveIt:[
        "Private Margarita Garden fits up to 200 guests — perfect for a full bach takeover",
        "Late night kitchen open until midnight on Fridays and Saturdays",
        "Downtown location makes it the perfect start to a Corpus Christi night out",
      ],
      reserveUrl:"https://elcaminotexmex.com",
    },
    {
      id:"cc-3",
      name:"Bellino Ristorante Italiano",
      cuisine:"Authentic Italian & Sicilian",
      priceRange:"$$$",
      rating:4.8,
      reviewCount:527,
      vibe:"Romantic · Upscale Italian · Wine Bar",
      tags:["Italian","Wine","Gluten-Free","Date Night","Group Friendly"],
      address:"3815 S. Alameda St., Corpus Christi, TX 78411",
      hours:"Mon 4pm–9pm · Tue–Thu 11am–9pm · Fri 11am–10pm · Sat 12pm–10pm · Closed Sunday",
      groupMax:30,
      desc:"Corpus Christi's only Italian restaurant with a strong Sicilian influence, owned by Palermo native Chef Francesco Inguaggiato. Every pasta, bread, sauce, and dessert is made fresh in-house daily. Winner of Best Italian Restaurant in Corpus Christi six years running (2019–2025).",
      photo:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80",
      ],
      menuHighlights:["House-Made Pasta","Roman-Style Pinsa","Fresh Sicilian Fish","Imported Italian Wines","House-Made Tiramisu"],
      whyWeLoveIt:[
        "6-time winner of Best Italian in Corpus Christi — a guaranteed wow dinner for the bride",
        "First restaurant in Texas to serve Pinsa, the Roman-style pizza — a unique group experience",
        "All pasta, bread, and desserts made fresh daily by a Sicilian chef",
      ],
      reserveUrl:"https://www.bellinostexas.com/reservations",
    },
    {
      id:"cc-4",
      name:"Water Street Oyster Bar",
      cuisine:"Gulf Coast Seafood",
      priceRange:"$$",
      rating:4.7,
      reviewCount:891,
      vibe:"Waterfront · Oysters · Local Icon",
      tags:["Seafood","Oysters","Happy Hour","Waterfront","Local Favorite"],
      address:"309 North Water Street, Corpus Christi, TX 78401",
      hours:"Open daily for lunch, dinner & late night · Happy Hour daily 3–6pm",
      groupMax:40,
      desc:"A Corpus Christi institution since 1983. Set in a historic former transmission shop steps from the bay, Water Street Oyster Bar has been the city's go-to for famously fresh Gulf seafood for over 40 years. Oysters, sushi, blackened fish, and the best happy hour in town.",
      photo:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
        "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
      ],
      menuHighlights:["Oysters on the Half Shell","Sushi Rolls","Fried Gulf Shrimp","Blackened Fish","Key Lime Pie"],
      whyWeLoveIt:[
        "Happy Hour daily 3–6pm: half-price oysters, sushi & wine — perfect pre-night-out stop",
        "A true Corpus Christi landmark open since 1983, generations of locals swear by it",
        "Downtown location makes it easy to walk to bars and nightlife after dinner",
      ],
      reserveUrl:"https://waterstreetoysterbar.com",
    },
    {
      id:"cc-5",
      name:"Dokyo Dauntaun",
      cuisine:"Japanese Fusion & Sushi",
      priceRange:"$$$",
      rating:4.8,
      reviewCount:634,
      vibe:"Neo-Tokyo · Sushi Bar · Downtown",
      tags:["Sushi","Japanese Fusion","Full Bar","Downtown","Date Night"],
      address:"424 N. Chaparral St., Corpus Christi, TX 78401",
      hours:"Mon–Thu 11am–2pm & 5pm–9:30pm · Fri 11am–2pm & 5pm–10:30pm · Sat 12pm–10:30pm · Sun 12pm–9pm",
      groupMax:30,
      desc:"A Neo-Tokyo-inspired sushi bar in the heart of downtown Corpus Christi. Dokyo blends Japanese and Korean flavors into a vibrant, industrial-chic dining experience — think specialty rolls, charred tuna, sashimi-grade fish, and a full cocktail bar with sake and soju.",
      photo:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
        "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&q=80",
        "https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&q=80",
      ],
      menuHighlights:["Lobster Dynamite Roll","Dokyo Tower","Charred Tuna","Manzana Hamachi Ceviche","Dokyo House Fried Rice"],
      whyWeLoveIt:[
        "The most Instagram-worthy spot in Corpus Christi with neon lights and Neo-Tokyo vibes",
        "Signature Dokyo Tower roll is a showstopper — perfect for the group photo",
        "Full bar with sake, soju, and craft cocktails to keep the party going",
      ],
      reserveUrl:"https://www.opentable.com/r/dokyo-dauntaun-corpus-christi",
    },
    {
      id:"cc-6",
      name:"Bien Merite Chocolate & Bakery",
      cuisine:"French Café & Bakery",
      priceRange:"$$",
      rating:4.9,
      reviewCount:318,
      vibe:"French Café · Pastries · Photo-Worthy",
      tags:["Brunch","French","Bakery","Coffee","Private Events"],
      address:"1336 S Staples St, Corpus Christi, TX 78404",
      hours:"Sun–Wed 7am–4pm · Thu–Sat 7am–4pm & 5pm–9pm",
      groupMax:30,
      desc:"A slice of Paris in South Texas. Bien Merite is a modernly chic French café and chocolate bakery serving authentically flaky croissants, house-made macarons, crème brûlée waffles, and specialty lattes — all inside a pink, flower-filled space that's completely photo-worthy.",
      photo:"https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
        "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80",
        "https://images.unsplash.com/photo-1579888944880-d98341245702?w=800&q=80",
      ],
      menuHighlights:["Raspberry Pistachio Croissant","Box of Macarons","Crème Brûlée Waffle","Matcha Latte","Opera Cake"],
      whyWeLoveIt:[
        "The most Instagrammable café in Corpus Christi — pink interior and fresh flowers everywhere",
        "Private event room for up to 30 guests — perfect for a bach brunch or mimosa morning",
        "House-made macarons, croissants, and chocolate that taste like a Paris patisserie",
      ],
      reserveUrl:"https://bienmerite.com/party",
    },
    {
      id:"cc-7",
      name:"Elizabeth's at the Art Museum",
      cuisine:"Mediterranean & Cocktail Bar",
      priceRange:"$$$",
      rating:4.8,
      reviewCount:274,
      vibe:"Waterfront · Mediterranean · Brunch",
      tags:["Brunch","Mediterranean","Waterfront","Cocktails","Unique Venue"],
      address:"1902 N Shoreline Blvd, Corpus Christi, TX 78401",
      hours:"Tue–Fri 11am–3pm · Sat–Sun 10am–3pm · Closed Monday",
      groupMax:30,
      desc:"Inside the Art Museum of South Texas with breathtaking harbor views, Elizabeth's serves Mediterranean-inspired mezze, seasonal flatbreads, and craft cocktails. No museum admission required — just stunning waterfront dining in one of Corpus Christi's most beautiful settings.",
      photo:"https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      ],
      menuHighlights:["Charcuterie Board","Ahi Tuna Crudo","Shakshuka","Seasonal Flatbreads","Sangria of the Season"],
      whyWeLoveIt:[
        "Stunning harbor views inside an art museum — the most unique brunch setting in Corpus Christi",
        "Weekend brunch with craft cocktails like the Barbary Bloody and Venetian Lemonade",
        "Mediterranean mezze and flatbreads are perfect for sharing across the whole group",
      ],
      reserveUrl:"https://elizabeths-at-artmuseum.com",
    },
    {
      id:"cc-8",
      name:"Hester's Cafe & Coffee Bar",
      cuisine:"American Café & Bakery",
      priceRange:"$$",
      rating:4.6,
      reviewCount:507,
      vibe:"Cozy · Brunch · Local Favorite",
      tags:["Brunch","Breakfast","Bakery","Coffee","Local Favorite"],
      address:"1714 S. Alameda St., Corpus Christi, TX 78404",
      hours:"Mon–Sat 7am–3pm · Closed Sunday",
      groupMax:20,
      desc:"The #1 Quick Bites spot in Corpus Christi since 2006. Hester's is a beloved scratch-kitchen café serving breakfast and lunch all day — from fresh omelets and French toast to house-made cheesecakes and specialty coffee drinks. A true local institution with a warm, community feel.",
      photo:"https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
        "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
      ],
      menuHighlights:["Lemon-Blueberry Cheesecake","French Toast","Cheesy B.E.A.T. Sandwich","Fresh-Squeezed Juice","Specialty Lattes"],
      whyWeLoveIt:[
        "Rated #1 Quick Bites in Corpus Christi on TripAdvisor with 500+ reviews",
        "Everything made from scratch daily — real ingredients, real flavors",
        "Perfect laid-back bach brunch spot before a big night out",
      ],
      reserveUrl:"https://www.toasttab.com/hesters-cafe-six-points-1714-alameda/v3",
    },
    {
      id:"cc-9",
      name:"Republic of Texas Bar & Grill",
      cuisine:"Steakhouse & Wild Game",
      priceRange:"$$$$",
      rating:4.7,
      reviewCount:557,
      vibe:"Rooftop · Fine Dining · Panoramic Bay Views",
      tags:["Steakhouse","Rooftop","Fine Dining","Special Occasion","Wild Game"],
      address:"900 N. Shoreline Blvd., 20th Floor, Corpus Christi, TX 78401",
      hours:"Mon–Sat 5:30pm–10:30pm · Sun 5:30pm–9pm · Happy Hour Mon–Fri 5–7pm",
      groupMax:40,
      desc:"Perched on the 20th floor of the Omni Corpus Christi Hotel, Republic of Texas offers breathtaking panoramic views of Corpus Christi Bay alongside USDA prime steaks, wild game, and fresh Gulf seafood. A Wine Spectator Award winner and one of the most romantic restaurants in America.",
      photo:"https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80",
      ],
      menuHighlights:["USDA Prime Filet Mignon","Nilgai & Venison","Lobster Bisque","Chilean Sea Bass","Pecan Pie"],
      whyWeLoveIt:[
        "20th floor panoramic bay views — the most dramatic dinner setting in Corpus Christi",
        "Wine Spectator Award winner 4 years running — the wine list is exceptional",
        "Wild game menu (nilgai, venison, quail) is a one-of-a-kind Texas experience",
      ],
      reserveUrl:"https://www.opentable.com/republic-of-texas-bar-and-grill",
    },
  ],
};

// Fallback restaurants for destinations without specific data
const DEFAULT_RESTAURANTS = [
  {
    id:"def-1", name:"The Rooftop Restaurant", cuisine:"American & Cocktails", priceRange:"$$$",
    vibe:"Rooftop · Cocktails · Views",
    rating:4.7, reviews:289, groupMin:2, groupMax:25,
    tags:["Rooftop","Cocktails","Views"],
    image:"https://images.unsplash.com/photo-1494832944834-a43136c5bded?w=800&q=80",
    images:[
      "https://images.unsplash.com/photo-1494832944834-a43136c5bded?w=800&q=80",
      "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    ],
    hours:"Daily 5pm–1am",
    address:"Downtown Location",
    desc:"The city's most sought-after rooftop experience. Stunning views, expertly crafted cocktails, and a menu designed for sharing make this the perfect bachelorette dinner spot.",
    menuHighlights:["Truffle Fries","Charcuterie Tower","Signature Cocktails","Rooftop Spritz","Dessert Board"],
    whyWeLoveIt:["Panoramic city views: perfect for golden hour photos","Group-friendly with large shared plate options","Late night cocktail service"],
    reserveUrl:"https://www.opentable.com",
  },
  {
    id:"def-2", name:"Coastal Kitchen", cuisine:"Seafood & Brunch", priceRange:"$$",
    vibe:"Brunch · Bottomless · Beachy",
    rating:4.8, reviews:412, groupMin:2, groupMax:30,
    tags:["Brunch","Bottomless Mimosas","Seafood"],
    image:"https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
    images:[
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
      "https://images.unsplash.com/photo-1527628217451-b4a0e59e0764?w=800&q=80",
      "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
    ],
    hours:"Sat–Sun 10am–3pm (Brunch) · Daily 5pm–10pm",
    address:"Waterfront District",
    desc:"The ultimate bachelorette brunch destination. Bottomless mimosas, fresh seafood, and outdoor seating that feels like a vacation every day of the week.",
    menuHighlights:["Lobster Benedict","Bottomless Mimosas","Avocado Toast Tower","Shrimp Cocktail","Frozen Rosé"],
    whyWeLoveIt:["Bottomless brunch packages for the whole group","Waterfront tables available: book early!","Large group seating with private semi-private areas"],
    reserveUrl:"https://www.opentable.com",
  },
  {
    id:"def-3", name:"The Supper Club", cuisine:"Modern American", priceRange:"$$$",
    vibe:"Upscale · Private Dining · Celebration",
    rating:4.9, reviews:356, groupMin:4, groupMax:20,
    tags:["Fine Dining","Private Room","Celebration"],
    image:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    images:[
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    ],
    hours:"Tue–Sun 6pm–11pm",
    address:"City Center",
    desc:"An intimate supper club experience designed for celebration. Private dining rooms, sommelier-curated wine pairings, and a tasting menu that tells a story. Perfect for the bachelorette who wants it all.",
    menuHighlights:["5-Course Tasting Menu","Wagyu Tartare","Truffle Risotto","Cheese Course","Champagne Toast"],
    whyWeLoveIt:["Private dining room available: your own space all night","Sommelier wine pairing is an experience in itself","Chef will add custom bachelorette touches on request"],
    reserveUrl:"https://www.opentable.com",
  },
];

// ─── Star Rating component ────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span style={{ color:"#FFB800", fontSize:12 }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
    </span>
  );
}

// ─── Restaurant Card ──────────────────────────────────────────────────────────
function RestaurantCard({ r, onView }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div style={{
      background:WHITE, borderRadius:20, overflow:"hidden",
      border:`1.5px solid ${BORDER}`,
      boxShadow:"0 2px 12px rgba(230,101,130,0.07)",
      marginBottom:16,
    }}>
      {/* Photo */}
      <div style={{ position:"relative", width:"100%", aspectRatio:"16/9", background:"#fdf0f5", overflow:"hidden" }}>
        <img
          src={r.image} alt={r.name}
          onLoad={()=>setImgLoaded(true)}
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", opacity:imgLoaded?1:0, transition:"opacity 0.3s" }}
        />
        {/* Price badge */}
        <div style={{
          position:"absolute", top:10, right:10,
          background:"rgba(0,0,0,0.72)", color:WHITE,
          fontSize:11, fontWeight:700, fontFamily:"'Nunito',sans-serif",
          padding:"3px 8px", borderRadius:20, letterSpacing:"0.3px",
        }}>{r.priceRange}</div>
        {/* Tags */}
        <div style={{ position:"absolute", bottom:10, left:10, display:"flex", gap:5, flexWrap:"wrap" }}>
          {r.tags.slice(0,2).map(t => (
            <span key={t} style={{
              background:HOT, color:WHITE, fontSize:9, fontWeight:700,
              fontFamily:"'Nunito',sans-serif", padding:"2px 8px", borderRadius:20,
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding:"14px 16px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
          <div style={{ flex:1, paddingRight:8 }}>
            <div style={{ fontSize:16, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:2 }}>{r.name}</div>
            <div style={{ fontSize:12, color:HOT, fontFamily:"'Nunito',sans-serif", marginBottom:4 }}>{r.cuisine}</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
          <Stars rating={r.rating} />
          <span style={{ fontSize:12, fontWeight:700, color:DARK, fontFamily:"'Nunito',sans-serif" }}>{r.rating}</span>
          <span style={{ fontSize:11, color:"#aaa", fontFamily:"'Nunito',sans-serif" }}>({r.reviews} reviews)</span>
        </div>
        <div style={{ fontSize:11, color:"#888", fontFamily:"'Nunito',sans-serif", marginBottom:12, lineHeight:1.4 }}>
          {r.vibe}
        </div>
        <button onClick={()=>onView(r)} style={{
          width:"100%", padding:"11px",
          background:`linear-gradient(135deg,#f472b0,${HOT})`,
          color:WHITE, border:"none", borderRadius:50,
          fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:700,
          cursor:"pointer", letterSpacing:"0.2px",
        }}>
          View More Details →
        </button>
      </div>
    </div>
  );
}

// ─── Restaurant Detail Page ───────────────────────────────────────────────────
function RestaurantDetail({ r, onBack, groupSize, date }) {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs = r.images || [r.image];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, background:WHITE, overflowY:"auto" }}>

      {/* Back button */}
      <button onClick={onBack} style={{
        position:"sticky", top:0, left:0,
        display:"flex", alignItems:"center", gap:6,
        background:WHITE, border:`1.5px solid ${BORDER}`,
        borderRadius:50, padding:"9px 16px", margin:"14px 16px 0",
        fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:700,
        color:DARK, cursor:"pointer",
        boxShadow:"0 2px 8px rgba(0,0,0,0.08)", zIndex:10,
      }}>
        ← Back to restaurants
      </button>

      <div style={{ padding:"0 16px 48px" }}>

        {/* ── Title + meta ── */}
        <div style={{ marginTop:16, marginBottom:14 }}>
          <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:24, fontWeight:700, color:DARK, margin:"0 0 8px", lineHeight:1.2 }}>
            {r.name}
          </h1>
          <div style={{ display:"flex", flexWrap:"wrap", gap:14, alignItems:"center", marginBottom:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <Stars rating={r.rating} />
              <span style={{ fontSize:13, fontWeight:700, color:DARK, fontFamily:"'Nunito',sans-serif" }}>{r.rating}</span>
              <span style={{ fontSize:12, color:HOT, fontFamily:"'Nunito',sans-serif", textDecoration:"underline" }}>{r.reviews} Reviews</span>
            </div>
            <span style={{ fontSize:12, color:"#888", fontFamily:"'Nunito',sans-serif" }}>🍽️ {r.cuisine}</span>
            <span style={{ fontSize:12, color:"#888", fontFamily:"'Nunito',sans-serif" }}>{r.priceRange}</span>
          </div>
        </div>

        {/* ── Photo Gallery ── */}
        <div style={{ marginBottom:20, borderRadius:16, overflow:"hidden" }}>
          {/* Main image */}
          <div style={{ position:"relative", width:"100%", aspectRatio:"16/9", marginBottom:4, cursor:"pointer" }}
            onClick={()=>setImgIdx(i=>(i+1)%imgs.length)}
          >
            <img src={imgs[imgIdx]} alt={r.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
            {imgs.length > 1 && (
              <div style={{
                position:"absolute", bottom:10, right:10,
                background:"rgba(0,0,0,0.6)", color:WHITE,
                fontSize:11, fontFamily:"'Nunito',sans-serif", fontWeight:700,
                padding:"4px 10px", borderRadius:20,
              }}>
                {imgIdx+1} / {imgs.length}  · tap to cycle
              </div>
            )}
          </div>
          {/* Thumbnail strip */}
          {imgs.length > 1 && (
            <div style={{ display:"flex", gap:4 }}>
              {imgs.map((img,i) => (
                <div key={i} onClick={()=>setImgIdx(i)} style={{
                  flex:1, aspectRatio:"1/1", overflow:"hidden", borderRadius:8,
                  border: i===imgIdx ? `2.5px solid ${HOT}` : "2px solid transparent",
                  cursor:"pointer", opacity: i===imgIdx ? 1 : 0.7, transition:"opacity 0.15s",
                }}>
                  <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── About this restaurant ── */}
        <div style={{ ...C, marginBottom:14 }}>
          <div style={{ fontSize:16, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:10 }}>
            About this Restaurant
          </div>
          <p style={{ fontSize:13, color:DARK, fontFamily:"'Nunito',sans-serif", lineHeight:1.8, margin:"0 0 16px" }}>
            {r.desc}
          </p>

          {/* Details grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
            <div style={{ background:SOFT, borderRadius:12, padding:"10px 12px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Hours</div>
              <div style={{ fontSize:12, color:DARK, fontFamily:"'Nunito',sans-serif", lineHeight:1.5 }}>{r.hours}</div>
            </div>
            <div style={{ background:SOFT, borderRadius:12, padding:"10px 12px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Group Size</div>
              <div style={{ fontSize:12, color:DARK, fontFamily:"'Nunito',sans-serif" }}>Up to {r.groupMax} guests</div>
            </div>
            <div style={{ background:SOFT, borderRadius:12, padding:"10px 12px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Cuisine</div>
              <div style={{ fontSize:12, color:DARK, fontFamily:"'Nunito',sans-serif" }}>{r.cuisine}</div>
            </div>
            <div style={{ background:SOFT, borderRadius:12, padding:"10px 12px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Price Range</div>
              <div style={{ fontSize:12, color:DARK, fontFamily:"'Nunito',sans-serif" }}>{r.priceRange}</div>
            </div>
          </div>

          {/* Address */}
          <div style={{ display:"flex", gap:8, alignItems:"flex-start", padding:"10px 12px", background:SOFT, borderRadius:12 }}>
            <div style={{ fontSize:11, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:1, whiteSpace:"nowrap", marginTop:1 }}>Address:</div>
            <div style={{ fontSize:12, color:DARK, fontFamily:"'Nunito',sans-serif", lineHeight:1.5 }}>{r.address}</div>
          </div>
        </div>

        {/* ── Menu Highlights ── */}
        <div style={{ ...C, marginBottom:14 }}>
          <div style={{ fontSize:16, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:12 }}>
            🍴 Menu Highlights
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {r.menuHighlights.map((item,i) => (
              <div key={i} style={{
                padding:"7px 13px", borderRadius:50,
                background:SOFT, border:`1.5px solid ${BORDER}`,
                fontSize:12, color:DARK, fontFamily:"'Nunito',sans-serif", fontWeight:500,
              }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── Why we love it ── */}
        <div style={{ ...C, marginBottom:14 }}>
          <div style={{ fontSize:16, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:12 }}>
            💕 Why We Love It for Your Group
          </div>
          {r.whyWeLoveIt.map((reason, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
              <div style={{
                width:22, height:22, borderRadius:"50%", flexShrink:0,
                background:`linear-gradient(135deg,#f472b0,${HOT})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:700, color:WHITE, fontFamily:"'Nunito',sans-serif",
              }}>{i+1}</div>
              <div style={{ fontSize:13, color:DARK, fontFamily:"'Nunito',sans-serif", lineHeight:1.6, paddingTop:2 }}>{reason}</div>
            </div>
          ))}
        </div>

        {/* ── Make a Reservation ── */}
        <div style={{ background:"#1a1a1a", borderRadius:20, padding:"20px 18px", marginBottom:14 }}>
          <div style={{ fontSize:20, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:WHITE, marginBottom:4 }}>
            Book Your Table
          </div>
          <div style={{ fontSize:12, color:"#aaa", fontFamily:"'Nunito',sans-serif", marginBottom:16 }}>
            {groupSize} guests{date ? ` · ${date}` : ""}: secure your spot before it fills up
          </div>
          <div style={{ background:"#2a2a2a", borderRadius:14, padding:"14px", marginBottom:14 }}>
            <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:WHITE, marginBottom:4 }}>
              {r.name}
            </div>
            <div style={{ fontSize:12, color:"#aaa", fontFamily:"'Nunito',sans-serif", marginBottom:12 }}>
              {r.cuisine} · {r.priceRange} · Up to {r.groupMax} guests
            </div>
            <div style={{ fontSize:11, color:"#888", fontFamily:"'Nunito',sans-serif", lineHeight:1.5 }}>
              {r.desc.slice(0,100)}...
            </div>
          </div>
          <a href={r.reserveUrl} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
            <button style={{
              width:"100%", padding:"16px",
              background:`linear-gradient(135deg,#f472b0,${HOT})`,
              color:WHITE, border:"none", borderRadius:14,
              fontFamily:"'Nunito',sans-serif", fontSize:15, fontWeight:800,
              cursor:"pointer", letterSpacing:"0.3px",
              boxShadow:"0 4px 16px rgba(233,30,140,0.35)",
            }}>
              Reserve a Table on OpenTable →
            </button>
          </a>
        </div>

      </div>
    </div>
  );
}

// ─── Main EatsTab ─────────────────────────────────────────────────────────────
export default function EatsTab({ groupSize }) {
  const [city,       setCity]       = useState("");
  const [date,       setDate]       = useState("");
  const [time,       setTime]       = useState("");
  const [results,    setResults]    = useState(null);  // null = not searched yet
  const [selected,   setSelected]   = useState(null);  // restaurant detail view

  const selectedDest = DESTS.find(d => d.id === city);

  function findEats() {
    if (!city) return;
    const data = RESTAURANTS[city] || DEFAULT_RESTAURANTS;
    setResults(data);
  }

  const inputStyle = {
    width:"100%", padding:"10px 12px", borderRadius:10,
    border:`1.5px solid ${BORDER}`, fontFamily:"'Nunito',sans-serif",
    fontSize:13, color:DARK, background:WHITE, boxSizing:"border-box", outline:"none",
  };

  const labelStyle = {
    fontSize:10, fontWeight:700, color:HOT,
    fontFamily:"'Nunito',sans-serif",
    textTransform:"uppercase", letterSpacing:1, marginBottom:6,
  };

  // Restaurant detail page
  if (selected) {
    return <RestaurantDetail r={selected} onBack={()=>setSelected(null)} groupSize={groupSize} date={date} />;
  }

  return (
    <div>
      <SH title="Find Restaurants" sub="The best tables for your group" />

      {/* Search form */}
      <div style={{ ...C, marginBottom:12 }}>
        <div style={labelStyle}>Destination</div>
        <select value={city} onChange={e=>{ setCity(e.target.value); setResults(null); }} style={{ ...inputStyle, appearance:"none" }}>
          <option value="">Choose a city…</option>
          {DESTS.filter(d => d.id !== "all").map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      <div style={{ ...C, marginBottom:12, display:"flex", gap:10 }}>
        <div style={{ flex:1 }}>
          <div style={labelStyle}>Date</div>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ flex:1 }}>
          <div style={labelStyle}>Time</div>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div style={{ ...C, marginBottom:14 }}>
        <div style={labelStyle}>Group Size</div>
        <div style={{ fontSize:22, fontWeight:900, color:PUNCH, fontFamily:"'Playfair Display',Georgia,serif" }}>
          {groupSize}
        </div>
      </div>

      {/* CTA / Find button */}
      <div style={{ ...C, background:SOFT, border:`1.5px solid ${MID}`, marginBottom:20 }}>
        {city ? (
          <>
            <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:4 }}>
              {selectedDest?.name}
            </div>
            <div style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif", marginBottom:14, opacity:0.85 }}>
              {groupSize} guests{date ? ` · ${date}` : " · flexible date"}{time ? ` at ${time}` : ""}
            </div>
            <button onClick={findEats} style={{
              width:"100%",
              background:`linear-gradient(135deg,#f472b0,${HOT})`,
              color:WHITE, border:"none", borderRadius:14,
              padding:"15px", cursor:"pointer",
              fontFamily:"'Nunito',sans-serif", fontSize:14, fontWeight:800,
              letterSpacing:"0.3px",
            }}>
                      Find Best Tables
            </button>
            <div style={{ fontSize:10, color:"#bbb", fontFamily:"'Nunito',sans-serif", marginTop:8, textAlign:"center" }}>
              Curated spots perfect for bachelorette groups
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center", padding:"8px 0" }}>
            <div style={{ fontSize:22, marginBottom:6 }}>🍽️</div>
            <div style={{ fontSize:13, color:DARK, fontFamily:"'Playfair Display',Georgia,serif" }}>Pick a destination above</div>
            <div style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif", marginTop:4, opacity:0.75 }}>
              Then we'll find the best tables for {groupSize} people
            </div>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      {results && (
        <>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:17, fontWeight:700, color:DARK }}>
              {results.length} Restaurants Found
            </div>
            <div style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif" }}>
              {selectedDest?.name}
            </div>
          </div>
          {results.map(r => (
            <RestaurantCard key={r.id} r={r} onView={setSelected} />
          ))}
        </>
      )}
    </div>
  );
}
