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
    {
      id:"nola-3", name:"GW Fins", cuisine:"Seafood", priceRange:"$$$",
      vibe:"Upscale · French Quarter · Date Night",
      rating:4.8, reviews:892, groupMin:2, groupMax:18,
      tags:["Seafood","Fine Dining","French Quarter"],
      image:"https://images.unsplash.com/photo-1606852836066-f64c9f7ebfaa?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1606852836066-f64c9f7ebfaa?w=800&q=80",
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80",
      ],
      hours:"Sun–Thu 5pm–10pm · Fri–Sat 5pm–11pm",
      address:"808 Bienville St, New Orleans, LA 70112",
      desc:"GW Fins is the French Quarter's premier seafood destination — daily-changing menu sourced from the best local purveyors. The lamb chops and wood-grilled fish of the day are legendary. Perfect for an elevated bach dinner.",
      menuHighlights:["Wood-Grilled Fish of the Day","Tuna Crudo","Gulf Shrimp Bisque","Crispy Oysters","Gulf Fish Amandine"],
      whyWeLoveIt:["Daily-changing menu means every visit is unique","French Quarter location for a night out after dinner","One of the most consistent fine dining spots in the city"],
      reserveUrl:"https://www.opentable.com/gw-fins",
    },
    {
      id:"nola-4", name:"Cochon", cuisine:"Cajun / Creole", priceRange:"$$",
      vibe:"Rustic · Warehouse District · Crowd-Pleaser",
      rating:4.7, reviews:764, groupMin:2, groupMax:22,
      tags:["Cajun","Group-Friendly","Craft Cocktails"],
      image:"https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      ],
      hours:"Mon–Fri 11am–10pm · Sat 5:30pm–10pm",
      address:"930 Tchoupitoulas St, New Orleans, LA 70130",
      desc:"James Beard Award-winning chef Donald Link's love letter to Louisiana's Cajun heritage. Cochon's wood-fired oven and whole-animal approach produce some of the boldest, most satisfying food in the city. The fried alligator with chili garlic mayo is an absolute must.",
      menuHighlights:["Fried Alligator with Chili Garlic Mayo","Cochon de Lait Sandwich","Catfish Court-Bouillon","Rabbit & Dumplings","Cochon Bread Pudding"],
      whyWeLoveIt:["Warehouse District location close to all the action","Group-friendly large tables and sharable plates","Award-winning without the stuffiness"],
      reserveUrl:"https://www.opentable.com/cochon-restaurant",
    },
    {
      id:"nola-5", name:"Emeril's", cuisine:"New American / Seafood", priceRange:"$$$$",
      vibe:"Iconic · Warehouse District · Celebratory",
      rating:4.8, reviews:1103, groupMin:2, groupMax:24,
      tags:["Iconic","Fine Dining","Celebratory"],
      image:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
        "https://images.unsplash.com/photo-1428515613728-6b4607e44363?w=800&q=80",
      ],
      hours:"Tue–Sat 6pm–9:30pm",
      address:"800 Tchoupitoulas St, New Orleans, LA 70130",
      desc:"The restaurant that put New Orleans on the national fine dining map. Emeril's blends Louisiana soul with refined technique — now led by son E.J. Lagasse. The tasting menus are showstopping and perfect for a celebratory bach dinner.",
      menuHighlights:["Gulf Fish with Creole Meunière","Shrimp & Andouille Cheesecake","New Orleans BBQ Shrimp","Banana Cream Pie","Andouille-Crusted Gulf Fish"],
      whyWeLoveIt:["Tasting menus designed for celebrating","One of the most legendary names in New Orleans food","Wine list is exceptional for a group toast"],
      reserveUrl:"https://www.opentable.com/emerils-new-orleans",
    },
    {
      id:"nola-6", name:"Gris-Gris", cuisine:"Southern Contemporary", priceRange:"$$",
      vibe:"Lively · Lower Garden District · Balcony Views",
      rating:4.7, reviews:536, groupMin:2, groupMax:20,
      tags:["Lively","Cocktails","Group-Friendly","Brunch"],
      image:"https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80",
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
      ],
      hours:"Mon–Fri 11am–10pm · Sat–Sun 10am–10pm (Brunch till 3pm)",
      address:"1800 Magazine St, New Orleans, LA 70130",
      desc:"Gris-Gris brings elevated Southern soul food to the Lower Garden District with lively energy and gorgeous balcony views. The Sunday jazz brunch is one of the city's best-kept secrets. Show up hungry — the portions are massive.",
      menuHighlights:["Crispy Oyster Po'Boy","Shrimp & Grits","Sweet Potato Cornbread","Fried Green Tomatoes","Peach Bellini"],
      whyWeLoveIt:["Balcony seating perfect for group photos","Jazz brunch is a must-do bachelorette morning","Large group tables easily accommodated"],
      reserveUrl:"https://www.exploretock.com/gris-gris",
    },
    {
      id:"nola-7", name:"Oceana Grill", cuisine:"Cajun / Seafood", priceRange:"$$",
      vibe:"Classic NOLA · French Quarter · No-Reservations Fun",
      rating:4.5, reviews:16709, groupMin:2, groupMax:30,
      tags:["Classic NOLA","Cajun","Seafood","French Quarter"],
      image:"https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80",
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
        "https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?w=800&q=80",
      ],
      hours:"Daily 11am–11pm (Bar open late)",
      address:"739 Conti St, New Orleans, LA 70130",
      desc:"In the heart of the French Quarter, Oceana Grill is NOLA comfort food at its most iconic — gumbo, jambalaya, etouffée, and the best fried seafood platter you've ever had. With over 16k reviews, this place speaks for itself.",
      menuHighlights:["NOLA Gumbo","Shrimp Étouffée","Seafood Platter","Oysters on the Half Shell","Hurricane Cocktail"],
      whyWeLoveIt:["French Quarter location in the middle of the action","Open until midnight — ideal pre-party dinner spot","Huge group capacity with no-fuss reservations"],
      reserveUrl:"https://www.opentable.com/oceana-grill",
    },
    {
      id:"nola-8", name:"Tipsy Trumpet", cuisine:"American / Gastropub", priceRange:"$$",
      vibe:"Jazz · Cocktails · Bourbon Street Energy",
      rating:4.8, reviews:347, groupMin:2, groupMax:16,
      tags:["Jazz","Craft Cocktails","Fun","French Quarter"],
      image:"https://www.tipsytrumpet.com/wp-content/uploads/2024/01/1-1536x864.jpg",
      images:[
        "https://www.tipsytrumpet.com/wp-content/uploads/2024/01/1-1536x864.jpg",
        "https://www.tipsytrumpet.com/wp-content/uploads/2024/01/2-1536x864.jpg",
        "https://www.tipsytrumpet.com/wp-content/uploads/2024/01/3-1536x864.jpg",
        "https://www.tipsytrumpet.com/wp-content/uploads/2024/01/4-1536x864.jpg",
      ],
      hours:"Daily 12pm–12am",
      address:"214 Bourbon St, New Orleans, LA 70130",
      desc:"Right on Bourbon Street, Tipsy Trumpet nails the NOLA trifecta: killer cocktails, live jazz, and seriously good food. It's the perfect spot to kick off the bach night — crab cakes, Hurricanes, and a saxophonist in the corner.",
      menuHighlights:["Jumbo Lump Crab Cakes","Blackened Redfish","Shrimp & Grits","Tipsy Hurricane","Pecan Bread Pudding"],
      whyWeLoveIt:["Live jazz every night: no cover charge","Bourbon Street location for the ultimate NOLA bach night","Creative craft cocktails on top of classic NOLA drinks"],
      reserveUrl:"https://www.opentable.com/r/tipsy-trumpet-new-orleans",
    },
    {
      id:"nola-9", name:"Dooky Chase's", cuisine:"Creole Soul Food", priceRange:"$$",
      vibe:"Historic · Legendary · Soulful",
      rating:4.6, reviews:614, groupMin:2, groupMax:30,
      tags:["Historic","Iconic","Creole","Soul Food"],
      image:"https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      ],
      hours:"Tue–Fri 11am–3pm · Thu–Sat 5pm–9pm · Buffet Fri–Sat",
      address:"2301 Orleans Ave, New Orleans, LA 70119",
      desc:"A true New Orleans institution — Leah Chase's legendary restaurant has been serving queens for over 75 years. President Obama, Beyoncé, and every local worth their salt have eaten here. The Friday & Saturday buffet with fried chicken and red beans is pure magic.",
      menuHighlights:["Fried Chicken","Red Beans & Rice","Shrimp Creole","Gumbo Z'Herbes","Sweet Potato Pie"],
      whyWeLoveIt:["One of the most historically significant restaurants in America","Friday & Saturday buffet is an unbeatable group experience","The story and legacy make for unforgettable dinner conversation"],
      reserveUrl:"https://www.opentable.com/dooky-chases-restaurant",
    },
    {
      id:"nola-10", name:"Tableau", cuisine:"French Creole", priceRange:"$$$",
      vibe:"Romantic · French Quarter Courtyard · Brunch Queen",
      rating:4.7, reviews:718, groupMin:2, groupMax:20,
      tags:["Brunch","Courtyard","Romantic","French Quarter"],
      image:"https://images.unsplash.com/photo-1428515613728-6b4607e44363?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1428515613728-6b4607e44363?w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
      ],
      hours:"Mon–Fri 11:30am–9:30pm · Sat–Sun 10am–9:30pm",
      address:"616 St. Peter St, New Orleans, LA 70116",
      desc:"Tucked inside the historic Le Petit Théâtre in the French Quarter, Tableau is the most beautiful bach brunch spot in New Orleans. Courtyard seating, French Creole cuisine, and bottomless mimosas surrounded by ivy-draped brick walls.",
      menuHighlights:["Eggs Sardou","Grillades & Grits","Shrimp Bienville","Beignet French Toast","Bottomless Mimosa Package"],
      whyWeLoveIt:["Most picturesque courtyard in the French Quarter — incredible photo backdrop","Bottomless mimosa brunch package perfect for the group","Historic French Quarter setting feels straight out of a movie"],
      reserveUrl:"https://www.opentable.com/tableau-new-orleans",
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
      desc:"Corpus Christi's premier fine dining destination. USDA Prime steaks wet-aged 45 days and grilled over mesquite wood, fresh Gulf seafood, and an impressive whiskey bar: all wrapped in an upscale yet rustic Texan atmosphere. Winner of Best New Restaurant 2023.",
      photo:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      ],
      menuHighlights:["14 oz Ribeye","Crab Stuffed Flounder","Colorado Lamb Chops","Ahi Tuna Ceviche","Stuffed Lobster Tail"],
      whyWeLoveIt:[
        "Best New Restaurant 2023: the most impressive dinner spot in Corpus Christi",
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
      desc:"The best dang Tex-Mex this side of the Rio Grande. Born from the soul of the south and inspired by bold Texas flavors, El Camino serves up sizzling fajitas, barbecued oysters, creamy queso, and the best margaritas in Corpus Christi: right in the heart of downtown.",
      photo:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
        "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80",
        "https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?w=800&q=80",
      ],
      menuHighlights:["Sizzling Fajitas","Barbecued Oysters","Creamy Queso","Signature Margaritas","Fresh Seafood Apps"],
      whyWeLoveIt:[
        "Private Margarita Garden fits up to 200 guests: perfect for a full bach takeover",
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
        "6-time winner of Best Italian in Corpus Christi: a guaranteed wow dinner for the bride",
        "First restaurant in Texas to serve Pinsa, the Roman-style pizza: a unique group experience",
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
        "Happy Hour daily 3–6pm: half-price oysters, sushi & wine: perfect pre-night-out stop",
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
      desc:"A Neo-Tokyo-inspired sushi bar in the heart of downtown Corpus Christi. Dokyo blends Japanese and Korean flavors into a vibrant, industrial-chic dining experience: think specialty rolls, charred tuna, sashimi-grade fish, and a full cocktail bar with sake and soju.",
      photo:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
        "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&q=80",
        "https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&q=80",
      ],
      menuHighlights:["Lobster Dynamite Roll","Dokyo Tower","Charred Tuna","Manzana Hamachi Ceviche","Dokyo House Fried Rice"],
      whyWeLoveIt:[
        "The most Instagram-worthy spot in Corpus Christi with neon lights and Neo-Tokyo vibes",
        "Signature Dokyo Tower roll is a showstopper: perfect for the group photo",
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
      desc:"A slice of Paris in South Texas. Bien Merite is a modernly chic French café and chocolate bakery serving authentically flaky croissants, house-made macarons, crème brûlée waffles, and specialty lattes: all inside a pink, flower-filled space that's completely photo-worthy.",
      photo:"https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
        "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80",
        "https://images.unsplash.com/photo-1579888944880-d98341245702?w=800&q=80",
      ],
      menuHighlights:["Raspberry Pistachio Croissant","Box of Macarons","Crème Brûlée Waffle","Matcha Latte","Opera Cake"],
      whyWeLoveIt:[
        "The most Instagrammable café in Corpus Christi: pink interior and fresh flowers everywhere",
        "Private event room for up to 30 guests: perfect for a bach brunch or mimosa morning",
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
      desc:"Inside the Art Museum of South Texas with breathtaking harbor views, Elizabeth's serves Mediterranean-inspired mezze, seasonal flatbreads, and craft cocktails. No museum admission required: just stunning waterfront dining in one of Corpus Christi's most beautiful settings.",
      photo:"https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      ],
      menuHighlights:["Charcuterie Board","Ahi Tuna Crudo","Shakshuka","Seasonal Flatbreads","Sangria of the Season"],
      whyWeLoveIt:[
        "Stunning harbor views inside an art museum: the most unique brunch setting in Corpus Christi",
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
      desc:"The #1 Quick Bites spot in Corpus Christi since 2006. Hester's is a beloved scratch-kitchen café serving breakfast and lunch all day: from fresh omelets and French toast to house-made cheesecakes and specialty coffee drinks. A true local institution with a warm, community feel.",
      photo:"https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
        "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
      ],
      menuHighlights:["Lemon-Blueberry Cheesecake","French Toast","Cheesy B.E.A.T. Sandwich","Fresh-Squeezed Juice","Specialty Lattes"],
      whyWeLoveIt:[
        "Rated #1 Quick Bites in Corpus Christi on TripAdvisor with 500+ reviews",
        "Everything made from scratch daily: real ingredients, real flavors",
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
        "20th floor panoramic bay views: the most dramatic dinner setting in Corpus Christi",
        "Wine Spectator Award winner 4 years running: the wine list is exceptional",
        "Wild game menu (nilgai, venison, quail) is a one-of-a-kind Texas experience",
      ],
      reserveUrl:"https://www.opentable.com/republic-of-texas-bar-and-grill",
    },
    {
      id:"cc-10",
      name:"The Post at Lamar Park",
      cuisine:"American Pub & Fusion",
      priceRange:"$$",
      rating:4.7,
      reviewCount:342,
      vibe:"Craft Cocktails · Shareable Plates · Late Night",
      tags:["Craft Cocktails","Late Night","Brunch","Pub","Local Favorite"],
      address:"411 Doddridge St #102, Corpus Christi, TX",
      hours:"Tue–Thu 3pm–10pm (bar til midnight) · Fri 3pm–11pm (bar til 2am) · Sat 12pm–11pm (bar til 2am) · Sun Brunch 10am–4pm · Closed Monday",
      groupMax:30,
      desc:"A neighborhood pub founded by Corpus Christi locals, built around high-quality food meant to be shared among friends. The Post pairs fresh, locally sourced small plates and shareable dishes with hand-crafted cocktails and craft beer: plus a popular Sunday brunch and a late-night bar on weekends.",
      photo:"https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80",
        "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
        "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=800&q=80",
      ],
      menuHighlights:["Shareable Small Plates","Hand-Crafted Cocktails","Craft Beer Selection","Sunday Brunch","Locally Sourced Dishes"],
      whyWeLoveIt:[
        "Bar stays open until 2am on Fridays and Saturdays: perfect for extending the night",
        "Menu is built for sharing, making it ideal for a group dinner with lots of variety",
        "Sunday brunch is a CC local favorite: great for a post-night-out recovery meal",
      ],
      reserveUrl:"https://thepostlamarpark.com",
    },
    {
      id:"cc-11",
      name:"Tannins Wine Bar & Grill",
      cuisine:"Wine Bar & American Grill",
      priceRange:"$$$",
      rating:4.4,
      reviewCount:114,
      vibe:"Wine Bar · Craft Cocktails · Late Night",
      tags:["Wine Bar","Craft Cocktails","Late Night","Date Night","Group Friendly"],
      address:"7629 S Staples St Suite A111, Corpus Christi, TX 78413",
      hours:"Mon–Tue 11am–10pm · Wed–Thu 11am–midnight · Fri 11am–1am · Sat 10am–1am · Sun 10am–10pm",
      groupMax:30,
      desc:"Corpus Christi's go-to wine bar and grill, blending traditional dishes with innovative creations and an exceptional cocktail program. Known for house-made syrups, hand-dehydrated fruit garnishes, and a warm atmosphere: the kind of place where a 2-hour dinner turns into a 4-hour night.",
      photo:"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
      ],
      menuHighlights:["Ahi Tuna Tower","Baked Brie","Salmon Crostini","Meatball Sliders","Craft Cocktails with House-Made Syrups"],
      whyWeLoveIt:[
        "Open until 1am Friday and Saturday: the perfect dinner-to-drinks spot for the group",
        "Craft cocktails made with house-made syrups and hand-dehydrated garnishes: seriously impressive",
        "Full wine list plus cold Texas craft beers means everyone in the group is happy",
      ],
      reserveUrl:"https://tanninsgrill.com",
    },
    {
      id:"cc-12",
      name:"Central Kitchen",
      cuisine:"American Café & Bakery",
      priceRange:"$$",
      rating:4.6,
      reviewCount:298,
      vibe:"Downtown · Bakery · Cozy Brunch",
      tags:["Bakery","Breakfast","Brunch","Coffee","Downtown"],
      address:"320 Lomax St Suite C, Corpus Christi, TX 78401",
      hours:"Open Daily 7am–5pm",
      groupMax:20,
      desc:"Downtown Corpus Christi's beloved scratch bakery and café, located steps from Water Street Market. You can see and smell the baking from the street: sourdough loaves, buttery croissants, kolaches, and hearty sandwiches on house-baked bread, all made fresh every single day.",
      photo:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
        "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80",
      ],
      menuHighlights:["Almond Croissant","Kouign Aman","Lox & Everything Toast","Maple Glazed Donut with Bacon","Lemon Meringue Tart"],
      whyWeLoveIt:[
        "Open 7 days a week: perfect for a morning bach breakfast before hitting the beach",
        "Everything baked fresh in-house daily, you can smell it from the street",
        "Party sandwich trays available for catering your bach group breakfast or brunch",
      ],
      reserveUrl:"https://centralkitchencc.com",
    },
    {
      id:"cc-13",
      name:"Texas House of Rock",
      cuisine:"Pizza & Live Music Venue",
      priceRange:"$$",
      rating:4.6,
      reviewCount:421,
      vibe:"Live Music · Late Night · Downtown",
      tags:["Live Music","Pizza","Craft Beer","Late Night","No Cover"],
      address:"511 Starr St, Corpus Christi, TX 78401",
      hours:"Mon–Wed 11am–10pm · Thu 11am–midnight · Fri–Sat 11am–1am · Sun 11am–10pm · Happy Hour daily 4–7pm",
      groupMax:50,
      desc:"A downtown Corpus Christi institution since 2005. Texas House of Rock is a live music venue, craft beer bar, and pizza kitchen all in one: with over 80 craft beers, specialty pizzas, and live music Wednesday through Sunday. No cover charge, ever.",
      photo:"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
        "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=800&q=80",
        "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&q=80",
      ],
      menuHighlights:["Specialty Pizzas","80+ Craft Beers","Appetizers & Salads","Sandwiches","Cheesy Garlic Bread"],
      whyWeLoveIt:[
        "Live music Wed–Sun with no cover charge: built-in entertainment for the whole group",
        "80+ craft beers from around the world plus full cocktail bars across three spaces",
        "Private venue space available for bachelorette takeovers and group events",
      ],
      reserveUrl:"https://texashouseofrock.com",
    },
    {
      id:"cc-14",
      name:"Fika Coffee & Bakery",
      cuisine:"Swedish-Inspired Café & Bakery",
      priceRange:"$",
      rating:4.8,
      reviewCount:189,
      vibe:"Cozy · Artisan Coffee · Swedish Bakery",
      tags:["Coffee","Bakery","Breakfast","Brunch","Artisan"],
      address:"4411 S Alameda St, Corpus Christi, TX 78412",
      hours:"Tue–Sat 7am–3pm · Closed Sunday & Monday",
      groupMax:15,
      desc:"A Swedish-inspired scratch bakery celebrating fika: the ritual of slowing down with great coffee and a sweet treat. Founded by Executive Pastry Chef Jeannette Del Angel, Fika serves locally roasted espresso drinks, seasonal scones, croissants, kouign amann, and artisan breads, all made fresh from scratch.",
      photo:"https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
        "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80",
      ],
      menuHighlights:["Kouign Amann","Seasonal Croissants","Mango Matcha","Honey Vanilla Shaken Espresso","Cardamom Apple Pie"],
      whyWeLoveIt:[
        "The most charming morning stop in Corpus Christi: perfect for a slow bach breakfast",
        "Executive Pastry Chef founder means every pastry is next-level quality",
        "Seasonal specials and house-made syrups make every visit feel unique",
      ],
      reserveUrl:"https://www.fikacc.com",
    },
    {
      id:"cc-15",
      name:"BKK Thai Kitchen + Bar",
      cuisine:"Thai & Sushi Bar",
      priceRange:"$$",
      rating:4.7,
      reviewCount:533,
      vibe:"Thai · Sushi Bar · Craft Cocktails",
      tags:["Thai","Sushi","Craft Cocktails","Brunch","Patio"],
      address:"3850 S Alameda St, Corpus Christi, TX 78411",
      hours:"Mon–Thu 11am–9:30pm · Fri–Sat 11am–11pm · Sun Brunch 10am–3pm",
      groupMax:35,
      desc:"Corpus Christi's stylish Thai kitchen and sushi bar, named after Bangkok's airport code. Founded in 2017 by world traveler Ryan Rios, BKK blends authentic Thai flavors with a full sushi menu and craft cocktail bar: all inside a contemporary space with indoor and outdoor seating.",
      photo:"https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80",
        "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80",
        "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&q=80",
      ],
      menuHighlights:["Golden Money Bags","Tiger Cry","Pineapple Fried Rice","Sticky Rice + Mango","Tom Yum Talay"],
      whyWeLoveIt:[
        "Thai food, sushi, AND craft cocktails all under one roof: something for everyone in the group",
        "Open until 11pm on Fridays and Saturdays with a full bar to keep the night going",
        "Sunday brunch menu is a local favorite: perfect for the morning after",
      ],
      reserveUrl:"https://www.bkkthaikitchenbar.com",
    },
    {
      id:"cc-16",
      name:"Birdie's Wings and Bar",
      cuisine:"Wings & American Bar",
      priceRange:"$$",
      rating:4.6,
      reviewCount:278,
      vibe:"Casual · Wings · Cold Beer · Good Times",
      tags:["Wings","Bar","Casual","Draft Beer","Cocktails"],
      address:"7514 S Padre Island Dr #206, Corpus Christi, TX 78412",
      hours:"Mon–Thu 11am–10pm · Fri–Sat 11am–11pm · Sun 11am–9pm",
      groupMax:30,
      desc:"The go-to spot in Corpus Christi for crispy wings, hand-breaded tenders, and homemade beef burgers: paired with the freshest draft beer in town and creative cocktails. Birdie's is a laid-back, fun bar perfect for a casual group night without the fuss.",
      photo:"https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80",
        "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
        "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=800&q=80",
      ],
      menuHighlights:["Buffalo Wings","Hand-Breaded Tenders","Homemade Beef Burgers","Margarita Flight","Draft Beer on Tap"],
      whyWeLoveIt:[
        "Margarita flights plus draft beer on tap: easy crowd pleaser for any size group",
        "Casual and fun with no pretension: the perfect low-key bach lunch or dinner",
        "Open until 11pm on weekends with a full bar to keep the party going",
      ],
      reserveUrl:"https://birdieswingsandbartx.com",
    },
    {
      id:"cc-17",
      name:"Gallery 41 Water's Edge Grill",
      cuisine:"American Seafood & Grill",
      priceRange:"$$$",
      rating:4.5,
      reviewCount:312,
      vibe:"Waterfront · Historic Venue · Sunday Brunch",
      tags:["Waterfront","Seafood","Brunch","Live Music","Historic"],
      address:"100 N Shoreline Blvd, Corpus Christi, TX 78401",
      hours:"Tue–Thu 11am–9pm · Fri–Sat 11am–11pm · Sun Brunch 11am–3:30pm · Closed Monday",
      groupMax:50,
      desc:"Set inside a historic 1941 former USO building on the Corpus Christi bayfront, Gallery 41 offers waterfront dining with locally sourced Gulf seafood, prime steaks, and an unforgettable Sunday champagne brunch buffet with live music: all inside an art gallery space.",
      photo:"https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      ],
      menuHighlights:["Blackened Red Snapper","Filet Mignon","Oyster Corpus","Crab Cake Salad","Chocolate Churro Cake"],
      whyWeLoveIt:[
        "Sunday champagne brunch buffet for $60/person with bottomless mimosas and live piano: the ultimate bach brunch",
        "Historic 1941 bayfront building with stunning water views and art on every wall",
        "Happy hour every Tuesday 3–6pm with half-price drinks",
      ],
      reserveUrl:"https://www.gallery41cc.com",
    },
    {
      id:"cc-18",
      name:"Harrison's Landing",
      cuisine:"Gulf Coast Seafood & Bar",
      priceRange:"$$$",
      rating:4.6,
      reviewCount:487,
      vibe:"Waterfront · Pier Dining · Speakeasy Bar",
      tags:["Waterfront","Seafood","Speakeasy","Pier","Boat Tours"],
      address:"108 Peoples St T-Head, Corpus Christi, TX 78401",
      hours:"Mini Bar daily 11am–8pm · The Mariner Wed–Thu 11am–10pm · Fri–Sat 11am–midnight",
      groupMax:40,
      desc:"A family-owned waterfront gem sitting right on the T-Head pier on Corpus Christi Bay since 2006. Harrison's Landing combines Gulf Coast seafood dining, a speakeasy-style upstairs bar called The Mariner, boutique shopping, and bay boat tours: all in one iconic location.",
      photo:"https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
      ],
      menuHighlights:["Tropical Tuna Nachos","Firecracker Shrimp","Big Kahuna Tuna","Key Lime Pie","Cajun Tenders"],
      whyWeLoveIt:[
        "Right on the T-Head pier with unobstructed bay views: one of the best settings in CC",
        "The Mariner is a speakeasy-style upstairs bar open until midnight on Fridays and Saturdays",
        "Bay boat tours available: a fun add-on activity for the whole bachelorette group",
      ],
      reserveUrl:"https://harrisonslanding.net",
    },
    {
      id:"cc-20",
      name:"Landry's Seafood House",
      cuisine:"Gulf Coast Seafood",
      priceRange:"$$$",
      rating:4.5,
      reviewCount:892,
      vibe:"Waterfront · Bayfront Views · Happy Hour",
      tags:["Seafood","Waterfront","Happy Hour","Group Friendly","Bayfront"],
      address:"600 N Shoreline Blvd, Corpus Christi, TX 78401",
      hours:"Mon–Thu 11am–9pm · Fri–Sat 11am–10pm · Sun 11:30am–9pm · Happy Hour Mon–Fri 3:30–6:30pm",
      groupMax:50,
      desc:"A Corpus Christi waterfront staple serving Gulf-inspired seafood with panoramic bay views. Landry's is known for fresh Gulf flavors, a laid-back atmosphere, and one of the best happy hours in town: winner of Diners' Choice 'Most Booked Restaurant' honors.",
      photo:"https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=800&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
      ],
      menuHighlights:["Oysters on the Half Shell","Blackened Swordfish with Lobster Cream","Crawfish Etouffee","Shrimp Cocktail","Fresh Gulf Fish"],
      whyWeLoveIt:[
        "Panoramic Corpus Christi Bay views from every seat: unbeatable waterfront setting",
        "Happy Hour Mon–Fri 3:30–6:30pm with $4–$7 cocktails: perfect pre-dinner stop",
        "Private events and catering available for the full bachelorette group experience",
      ],
      reserveUrl:"https://www.landrysseafoodhouse.com/location/landrys-seafood-corpus-christi/",
    },
  ],
  portaransas: [
    // ── Cuisines ──
    {
      id:"porta-1", name:"BlueWater Cowboy Saloon & Mercantile", cuisine:"Seafood & Sushi", priceRange:"$$",
      vibe:"Rooftop · Panoramic Gulf Views · Cocktails",
      rating:4.8, reviews:430, groupMin:2, groupMax:30,
      tags:["Seafood","Sushi","Cocktails","Rooftop","Gulf Views"],
      image:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
      ],
      hours:"Mon & Wed–Thu 4–9pm · Fri–Sun 11am–9pm · Closed Tue",
      address:"Port Aransas, TX",
      desc:"One of the most unique dining experiences in Port Aransas. BlueWater Cowboy serves sushi, fresh Gulf seafood, hand-cut ribeyes and craft cocktails from a stunning third-story bar designed like the transom of a sportfishing boat — with panoramic Gulf of Mexico views to match.",
      menuHighlights:["Sushi Rolls & Nigiri","Gulf Seafood","Hand-Cut Ribeye","Signature Cocktails","10 Beers on Draft"],
      whyWeLoveIt:["The only bottom-filling draft beer system in Port A — totally unique","Panoramic Gulf views from the 3rd story bar: best view in town","Family-owned with made-to-order everything"],
      reserveUrl:"https://bwcporta.com",
    },
    {
      id:"porta-2", name:"The Salty Bag", cuisine:"Coastal American", priceRange:"$$",
      vibe:"Island Casual · Local Hangout",
      rating:4.5, reviews:210, groupMin:2, groupMax:25,
      tags:["American","Seafood","Cocktails","Casual"],
      image:"https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
      ],
      hours:"Check website for current hours",
      address:"Port Aransas, TX",
      desc:"A laid-back island spot with that classic Port A charm. Great food, cold drinks, and the kind of relaxed vibe that makes you never want to leave the island.",
      menuHighlights:["Gulf Seafood","Island Bites","Cold Cocktails"],
      whyWeLoveIt:["Classic Port Aransas island energy","Perfect casual stop for the group","Local favorite worth the visit"],
      reserveUrl:"https://www.tsbag.com",
    },
    {
      id:"porta-3", name:"Virginia's on the Bay", cuisine:"Fresh Dockside Seafood", priceRange:"$$",
      vibe:"Dockside · Bayfront · Fresh Catches",
      rating:4.7, reviews:380, groupMin:2, groupMax:40,
      tags:["Seafood","Waterfront","Bayfront","Casual"],
      image:"https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=800&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      ],
      hours:"Check website for current hours",
      address:"Port Aransas, TX",
      desc:"Fresh dockside dining right on the bay. Virginia's is your go-to for straight-from-the-water Gulf seafood with that breezy waterfront atmosphere your bachelorette crew will love.",
      menuHighlights:["Fresh Gulf Catches","Dockside Seafood","Bay Views"],
      whyWeLoveIt:["Authentic dockside dining experience","Fresh seafood you can't beat","Beautiful bayfront setting for group photos"],
      reserveUrl:"https://virginiasonthebay.com",
    },
    {
      id:"porta-4", name:"Port A Pizzeria", cuisine:"Pizza & Italian", priceRange:"$",
      vibe:"Casual · Family-Friendly · All-Day",
      rating:4.5, reviews:620, groupMin:2, groupMax:50,
      tags:["American","Pizza","Italian","Casual","Group Friendly"],
      image:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      ],
      hours:"Regular: Daily 11am–10pm · Summer: Daily 11am–11pm",
      address:"407 E Avenue G, Port Aransas, TX 78373",
      desc:"Port A's go-to pizza spot for a casual, group-friendly meal. Their all-day buffet is perfect for a hungry bach crew — pizza, calzones, pasta, salad, soup, and dessert all in one stop.",
      menuHighlights:["All-Day Pizza Buffet","Calzones","Pasta","Fresh Salads","Dessert"],
      whyWeLoveIt:["All-day buffet feeds the whole group without fuss","Open late in summer — perfect post-beach dinner","Easy, affordable, and delicious: crowd pleaser guaranteed"],
      reserveUrl:"https://www.portapizzeria.com",
    },
    {
      id:"porta-5", name:"Lelo's Bar", cuisine:"Bar & Bites", priceRange:"$$",
      vibe:"Bar Scene · Cocktails · Island Nightlife",
      rating:4.5, reviews:290, groupMin:2, groupMax:30,
      tags:["Cocktails","Bar","Drinks","Nightlife"],
      image:"https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
      ],
      hours:"Check website for current hours",
      address:"Port Aransas, TX",
      desc:"Lelo's brings the island bar energy your bachelorette night deserves. Cold drinks, fun vibes, and a crowd that's always down for a good time — a Port A nightlife staple.",
      menuHighlights:["Craft Cocktails","Cold Beer","Island Drinks"],
      whyWeLoveIt:["Classic Port A bar experience","Great for a night out with the bach crew","Island nightlife at its finest"],
      reserveUrl:"https://www.lelosbar.com",
    },
    {
      id:"porta-6", name:"Venetian Hot Plate", cuisine:"Casual American", priceRange:"$$",
      vibe:"Local Favorite · Casual Dining",
      rating:4.6, reviews:340, groupMin:2, groupMax:30,
      tags:["American","Casual","Local Fave"],
      image:"https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
      ],
      hours:"Check listing for current hours",
      address:"Port Aransas, TX",
      desc:"A beloved Port Aransas local favorite. The Venetian Hot Plate delivers satisfying comfort food with that cozy, unpretentious island dining vibe your group will appreciate.",
      menuHighlights:["Comfort Food Classics","Local Favorites","Fresh Gulf Dishes"],
      whyWeLoveIt:["A true Port A staple loved by locals","Cozy, no-fuss atmosphere perfect for the group","Authentic island dining experience"],
      reserveUrl:"https://www.portaransas.org/listing/venetian-hot-plate/224/",
    },
    {
      id:"porta-7", name:"Ridley's on the Island", cuisine:"American & Brunch", priceRange:"$$",
      vibe:"Island Casual · Brunch · Happy Hour",
      rating:4.7, reviews:510, groupMin:2, groupMax:40,
      tags:["American","Brunch","Cocktails","Happy Hour","Bar"],
      image:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
      ],
      hours:"Daily 8am–9pm · Happy Hour daily 3–6pm",
      address:"11862 HWY 361, Corpus Christi, TX 78418",
      desc:"Ridley's is your island all-in-one: brunch, dinner, craft cocktails, a bakery, and daily happy hour. The social, laid-back energy makes it a perfect group spot from morning mimosas to evening drinks.",
      menuHighlights:["Brunch Plates","Craft Cocktails","Bakery & Pastries","Dinner Entrees","Happy Hour Specials"],
      whyWeLoveIt:["Daily happy hour 3–6pm: perfect pre-dinner drinks for the crew","Open 8am–9pm: works for brunch or dinner any day","In-house bakery means fresh pastries and treats on site"],
      reserveUrl:"https://www.ridleysontheisland.com",
    },
    // ── Bars ──
    {
      id:"porta-8", name:"Sip Yard Port A", cuisine:"Bar & Food Court", priceRange:"$$",
      vibe:"Outdoor · Multi-Vendor · Cocktails",
      rating:4.6, reviews:380, groupMin:2, groupMax:60,
      tags:["Cocktails","Bar","Mexican","Asian","Pizza","Outdoor"],
      image:"https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      ],
      hours:"Wed–Thu 11am–10pm · Fri–Sat 11am–Midnight · Sun 11am–10pm · Closed Mon–Tue",
      address:"123 W. Cotter Avenue, Port Aransas, TX 78373",
      desc:"Port A's coolest outdoor gathering spot. Sip Yard brings together multiple food vendors — tacos, Asian cuisine, pizza — alongside a full bar. It's the perfect place to let the group pick what they're feeling while the drinks keep flowing.",
      menuHighlights:["Tacos (Bayou Bistro & Vibe Tacos)","Asian Cuisine (Wok On)","Coastal Pizza Kitchen","Craft Cocktails","Cold Beer"],
      whyWeLoveIt:["Multiple cuisines in one spot: everyone in the group gets their pick","Open until midnight on weekends for the full bach night out","Outdoor communal vibe perfect for a big group"],
      reserveUrl:"https://www.sipyardporta.com/eats",
    },
    {
      id:"porta-9", name:"Bron's Beach Carts — Shaved Ice & To-Go Bar", cuisine:"Bar & Sweets", priceRange:"$",
      vibe:"Tropical · To-Go · Beach Vibes",
      rating:4.7, reviews:265, groupMin:1, groupMax:50,
      tags:["Cocktails","Bar","Sweets","Tropical","To-Go"],
      image:"https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=800&q=80",
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
      ],
      hours:"Seasonal — reopens March",
      address:"314 E Avenue G, Port Aransas, TX 78373",
      desc:"Tastes of paradise in every cup. Bron's serves premium shaved ice with gourmet flavors alongside frozen margaritas, piña coladas, tropical cocktails, and cold beer — all to-go. The ultimate beach day companion for your bachelorette crew.",
      menuHighlights:["Gourmet Shaved Ice","Frozen Margaritas","Piña Coladas","Tropical Cocktails","Cold Beer & Wine"],
      whyWeLoveIt:["Perfect grab-and-go stop before hitting the beach","Frozen cocktails that taste like a vacation in a cup","Fun, island-party energy the whole crew will love"],
      reserveUrl:"https://bronsbeachcarts.com/shaved-ice-%26-to-go-bar",
    },
    // ── Coffee ──
    {
      id:"porta-10", name:"Coffee Waves", cuisine:"Coffee & Café", priceRange:"$",
      vibe:"Artisan · Coastal · Chill",
      rating:4.8, reviews:490, groupMin:1, groupMax:20,
      tags:["Coffee","Café","Sweets","Casual"],
      image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
        "https://images.unsplash.com/photo-1442975631134-648073687e37?w=800&q=80",
      ],
      hours:"Check website for current hours",
      address:"1007 TX-361, Port Aransas, TX 78373 · Also at 123 W. Cotter Ave (Sip Yard)",
      desc:"Port A's artisan coffee gem. Coffee Waves sources small-batch specialty beans roasted weekly and pairs them with homemade Italian gelato and fresh paninis. Whether you need a morning fuel-up or a mid-day pick-me-up, this is the spot. Sit. Sip. Surf.",
      menuHighlights:["Specialty Espresso Drinks","Homemade Italian Gelato","Fresh Paninis","Frozen Beverages","Energy Drinks"],
      whyWeLoveIt:["Two Port A locations including inside Sip Yard — so convenient","Homemade gelato is a must for the group","Artisan coffee that actually rivals your home city's best cafés"],
      reserveUrl:"https://www.coffeewaves.com",
    },
    {
      id:"porta-11", name:"Barefoot Beans Coffee Bar", cuisine:"Coffee & Café", priceRange:"$",
      vibe:"Cozy · Community · Patio Vibes",
      rating:4.8, reviews:320, groupMin:1, groupMax:15,
      tags:["Coffee","Café","Casual"],
      image:"https://images.unsplash.com/photo-1442975631134-648073687e37?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1442975631134-648073687e37?w=800&q=80",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      ],
      hours:"Daily 6am–4pm",
      address:"345 N. Alister Suite E1, Port Aransas, TX 78373",
      desc:"The early bird bach crew's best friend. Barefoot Beans serves organic, fair-trade coffee and tea from 6am, making it the perfect morning stop before a beach day. Grab a spot on the sunny patio and stay awhile.",
      menuHighlights:["Organic Fair-Trade Coffee","Specialty Teas","Nitro Brew","Iced Drinks","Patio Seating"],
      whyWeLoveIt:["Opens at 6am: perfect for early beach days or airport runs","Organic and fair-trade sourcing for the conscious queen","Sunny patio is the perfect morning vibe for the group"],
      reserveUrl:"https://barefootbeans.com",
    },
    // ── Sweets & Treats ──
    {
      id:"porta-12", name:"Winton's Candy Co", cuisine:"Sweets & Candy", priceRange:"$",
      vibe:"Nostalgic · Family-Owned · Island Treat",
      rating:4.9, reviews:580, groupMin:1, groupMax:50,
      tags:["Sweets","Dessert","Candy","Treats"],
      image:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
        "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80",
      ],
      hours:"Daily 9am–6pm",
      address:"601 S Alister Street, Port Aransas, TX 78373",
      desc:"A Port Aransas must-stop for 27 years and counting. Winton's handcrafts everything from salt water taffy and fudge to nut clusters, chocolates, caramels, and gummies. The perfect treat run for your bachelorette crew — or the sweetest souvenir to bring home.",
      menuHighlights:["Salt Water Taffy","Handcrafted Fudge","Chocolate & Caramels","Nut Clusters","Sours & Gummies"],
      whyWeLoveIt:["A 27-year Port A tradition: you have to stop here","Handcrafted confections you won't find anywhere else","Perfect treat stop or sweet souvenir for the group to take home"],
      reserveUrl:"https://wintonscandies.com",
    },
    {
      id:"porta-13", name:"Island Scoop", cuisine:"Ice Cream & Sweets", priceRange:"$",
      vibe:"Fun · Beachy · Sweet Treats",
      rating:4.7, reviews:190, groupMin:1, groupMax:50,
      tags:["Sweets","Dessert","Ice Cream","Treats"],
      image:"https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80",
      images:[
        "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80",
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
      ],
      hours:"Check Facebook for current hours",
      address:"Port Aransas, TX",
      desc:"Sweet, scoopable fun for the whole bachelorette crew. Island Scoop serves up ice cream with that breezy Port A energy — the perfect post-beach treat to cool down and keep the good times rolling.",
      menuHighlights:["Ice Cream Scoops","Specialty Flavors","Sweet Treats"],
      whyWeLoveIt:["Perfect post-beach cool-down for the group","Fun, festive island vibe everyone will love","Because every bachelorette weekend needs an ice cream run"],
      reserveUrl:"https://www.facebook.com/p/Island-Scoop-100094123568846/",
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
function RestaurantCard({ r, onView, favorites, onToggleFavorite }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isFav = favorites.includes(r.id);
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
        {/* Favorite heart */}
        <button
          onClick={e=>{ e.stopPropagation(); onToggleFavorite(r.id); }}
          style={{
            position:"absolute", top:10, right:10,
            background: isFav ? HOT : "rgba(255,255,255,0.85)",
            border:"none", borderRadius:"50%",
            width:36, height:36, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 2px 8px rgba(230,101,130,0.25)",
            transition:"all 0.2s",
          }}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <span style={{ fontSize:18, lineHeight:1, color: isFav ? WHITE : HOT }}>{isFav ? "♥" : "♡"}</span>
        </button>
      </div>

      {/* Info */}
      <div style={{ padding:"14px 16px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
          <div style={{ flex:1, paddingRight:8 }}>
            <div style={{ fontSize:16, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:DARK, marginBottom:2 }}>{r.name}</div>
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
        fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:300,
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
              <span style={{ fontSize:13, fontWeight:300, color:DARK, fontFamily:"'Nunito',sans-serif" }}>{r.rating}</span>
              <span style={{ fontSize:12, fontWeight:300, color:HOT, fontFamily:"'Nunito',sans-serif", textDecoration:"underline" }}>{r.reviews} Reviews</span>
            </div>
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
              <div style={{ fontSize:12, color:DARK, fontFamily:"'Nunito',sans-serif", lineHeight:1.6 }}>
                {r.hours.split(" · ").map((slot, i) => (
                  <div key={i}>{slot}</div>
                ))}
              </div>
            </div>
            <div style={{ background:SOFT, borderRadius:12, padding:"10px 12px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:HOT, fontFamily:"'Nunito',sans-serif", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Group Size</div>
              <div style={{ fontSize:12, color:DARK, fontFamily:"'Nunito',sans-serif" }}>Up to {r.groupMax} guests</div>
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
            Menu Highlights
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
            Why We Love It for Your Group
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
        <div style={{ background:WHITE, borderRadius:20, padding:"20px 18px", marginBottom:14, border:`1.5px solid ${BORDER}` }}>
          <div style={{ fontSize:20, fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", color:HOT, marginBottom:4 }}>
            Book Your Table
          </div>
          <div style={{ fontSize:12, color:DARK, fontFamily:"'Nunito',sans-serif", marginBottom:16 }}>
            {groupSize} guests{date ? ` · ${date}` : ""}: secure your spot before it fills up
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
const CUISINE_CATS = [
  { id:"all",       label:"All",           emoji:"🍽️" },
  { id:"brunch",    label:"Brunch",        emoji:"🥞" },
  { id:"sushi",     label:"Sushi",         emoji:"🍣" },
  { id:"mexican",   label:"Mexican",       emoji:"🌮" },
  { id:"american",  label:"American",      emoji:"🍔" },
  { id:"cocktails", label:"Cocktails",     emoji:"🍹" },
  { id:"asian",     label:"Asian",         emoji:"🥢" },
  { id:"seafood",   label:"Seafood",       emoji:"🦞" },
  { id:"coffee",    label:"Coffee",        emoji:"☕" },
  { id:"sweets",    label:"Sweet Treats",  emoji:"🍰" },
];

function matchCategory(r, cat) {
  if (cat === "all") return true;
  const haystack = [r.cuisine, r.vibe, ...(r.tags||[])].join(" ").toLowerCase();
  const map = {
    brunch:    ["brunch","breakfast","mimosa","morning"],
    sushi:     ["sushi","japanese","robata","omakase"],
    mexican:   ["mexican","taco","cantina","tequila"],
    american:  ["american","southern","burger","farm","bbq","brasserie"],
    cocktails: ["cocktail","bar","drinks","speakeasy"],
    asian:     ["asian","fusion","chinese","korean","thai","vietnamese"],
    seafood:   ["seafood","fish","lobster","oyster","crab","shrimp"],
    coffee:    ["coffee","cafe","espresso","latte"],
    sweets:    ["sweet","dessert","bakery","pastry","cake","ice cream"],
  };
  return (map[cat]||[]).some(kw => haystack.includes(kw));
}

export default function EatsTab({ groupSize: initialGroupSize }) {
  const [city,       setCity]       = useState("");
  const [date,       setDate]       = useState("");
  const [time,       setTime]       = useState("");
  const [groupSize,  setGroupSize]  = useState(initialGroupSize || 8);
  const [category,   setCategory]   = useState("all");
  const [results,    setResults]    = useState(null);  // null = not searched yet
  const [selected,   setSelected]   = useState(null);  // restaurant detail view
  const [favorites,  setFavorites]  = useState(() => {
    try { return JSON.parse(localStorage.getItem("eats_favorites") || "[]"); }
    catch { return []; }
  });

  function toggleFavorite(id) {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem("eats_favorites", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  const selectedDest = DESTS.find(d => d.id === city);

  function findEats() {
    if (!city) return;
    const data = RESTAURANTS[city] || DEFAULT_RESTAURANTS;
    setResults(data);
  }

  const filteredResults = results
    ? results.filter(r => matchCategory(r, category))
    : null;

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
      <SH title="Bites & Sips" sub="Fuel for the festivities" />

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

      <div style={{ ...C, marginBottom:12, display:"flex", gap:10, overflow:"hidden" }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={labelStyle}>Date</div>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{...inputStyle, minWidth:0}} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={labelStyle}>Time</div>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)} style={{...inputStyle, minWidth:0}} />
        </div>
      </div>

      <div style={{ ...C, marginBottom:14 }}>
        <div style={labelStyle}>Group Size</div>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginTop:4 }}>
          <button onClick={()=>setGroupSize(g=>Math.max(1,g-1))} style={{ width:32, height:32, borderRadius:"50%", border:`1.5px solid ${BORDER}`, background:"none", fontSize:20, color:HOT, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Nunito',sans-serif" }}>−</button>
          <div style={{ fontSize:22, fontWeight:300, color:DARK, fontFamily:"'Playfair Display',Georgia,serif", minWidth:24, textAlign:"center" }}>{groupSize}</div>
          <button onClick={()=>setGroupSize(g=>Math.min(50,g+1))} style={{ width:32, height:32, borderRadius:"50%", border:`1.5px solid ${BORDER}`, background:"none", fontSize:20, color:HOT, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Nunito',sans-serif" }}>+</button>
        </div>
      </div>

      {/* Category chips */}
      <div style={{ marginBottom:14 }}>
        <div style={{ ...labelStyle, paddingLeft:2, marginBottom:8 }}>Cuisine / Vibe <span style={{ textTransform:"none", fontWeight:400, opacity:0.6 }}>(optional)</span></div>
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:6, WebkitOverflowScrolling:"touch", scrollbarWidth:"none" }}>
          {CUISINE_CATS.map(cat => (
            <button key={cat.id} onClick={()=>setCategory(cat.id)} style={{
              flexShrink:0, display:"flex", alignItems:"center", gap:5,
              padding:"8px 14px", borderRadius:50, fontSize:12, fontWeight:700,
              fontFamily:"'Nunito',sans-serif", cursor:"pointer",
              background: category===cat.id ? "#F496C2" : WHITE,
              color: category===cat.id ? WHITE : DARK,
              border: category===cat.id ? "none" : `1.5px solid ${BORDER}`,
              boxShadow: category===cat.id ? "0 2px 8px rgba(244,150,194,0.35)" : "none",
              transition:"all 0.15s",
            }}>
              <span>{cat.emoji}</span>{cat.label}
            </button>
          ))}
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
      {filteredResults && (
        <>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:17, fontWeight:700, color:DARK }}>
              {filteredResults.length} Restaurant{filteredResults.length !== 1 ? "s" : ""} Found
            </div>
            <div style={{ fontSize:11, color:HOT, fontFamily:"'Nunito',sans-serif" }}>
              {selectedDest?.name}
            </div>
          </div>
          {filteredResults.length === 0 ? (
            <div style={{ textAlign:"center", padding:"32px 16px", color:DARK, fontFamily:"'Nunito',sans-serif" }}>
              <div style={{ fontSize:28, marginBottom:8 }}>🔍</div>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>No matches for this category</div>
              <div style={{ fontSize:12, color:HOT, opacity:0.8 }}>Try a different cuisine or pick "All"</div>
            </div>
          ) : (
            filteredResults.map(r => (
              <RestaurantCard key={r.id} r={r} onView={setSelected} favorites={favorites} onToggleFavorite={toggleFavorite} />
            ))
          )}
        </>
      )}
    </div>
  );
}
