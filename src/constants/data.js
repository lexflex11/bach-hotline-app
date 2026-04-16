import { px } from './api.js';

// ─── BUDGET DATA ──────────────────────────────────────────────────────────────
export const BUDGET_DATA = {
  miami:      { flights:[80,150], stay:[60,120], food:[80,180], activities:[100,250], misc:[40,80] },
  nashville:  { flights:[60,130], stay:[50,100], food:[70,160], activities:[80,200], misc:[35,70] },
  vegas:      { flights:[90,170], stay:[70,140], food:[90,200], activities:[120,300], misc:[50,100] },
  scottsdale: { flights:[80,160], stay:[65,130], food:[75,170], activities:[90,220], misc:[40,80]  },
  nola:       { flights:[65,140], stay:[55,110], food:[70,160], activities:[80,180], misc:[35,70]  },
  charleston: { flights:[55,120], stay:[50,100], food:[65,150], activities:[70,160], misc:[30,60]  },
};

// ─── AESTHETIC MOOD BOARDS ────────────────────────────────────────────────────
export const AESTHETICS = [
  {
    id:"coastal_cowgirl", name:"Coastal Cowgirl", emoji:"🤠🌊",
    colors:["#D4A574","#8FB8D4","#F5E6D3","#C4956A"],
    palette:["Sandy Beige","Ocean Blue","Cream","Warm Terracotta"],
    vibe:"Country meets beach. Cowboy boots in the sand. Sun-kissed and free.",
    outfits:["Denim cutoffs + cowboy boots","Flowy white sundress + hat","Fringe bikini top + jeans","Cowboy hat + linen co-ord"],
    decor:["Hay bales wrapped in linen","Mason jar flower arrangements","Rope fairy lights","Bandana table runners","Sunflower + wildflower centerpieces"],
    shots:["Golden hour silhouette with hats","Boots in the sand overhead shot","Circle formation holding drinks","Bonfire sparkler photos"],
    hashtags:["#CoastalCowgirl","#BachWeekend","#BohoBride","#WesternWedding","#SunsetBach"],
    shopItems:[11,10,7], // Cowgirl Espresso Cup · Let's Go Girls Kit · Custom Face Beach Towel
  },
  {
    id:"old_hollywood", name:"Old Hollywood Glam", emoji:"🎬✨",
    colors:["#1a1a1a","#D4AF37","#F5F0E8","#8B7355"],
    palette:["Noir Black","Champagne Gold","Ivory","Warm Bronze"],
    vibe:"Glamorous. Timeless. Black gowns, gold everything, and champagne on tap.",
    outfits:["Black satin slip dress","Gold sequin co-ord","Little black dress + pearls","Hollywood glam jumpsuit"],
    decor:["Gold candelabras","Black and gold balloons","Vintage Hollywood marquee letters","Feather centerpieces","Film reel props"],
    shots:["Vanity mirror reflection with lights","Staircase descent shot","Champagne tower moment","Black and white filter group shot"],
    hashtags:["#OldHollywood","#GlamBach","#GoldenAgeBride","#BlackAndGold","#VintageBride"],
    shopItems:[12,6,15], // In My Bride Era Kit · Custom Poker Cards · Cocktail Club Towel
  },
  {
    id:"maximalist_pink", name:"Maximalist Pink", emoji:"🩷🎀",
    colors:["#FF6B9D","#FFB3D1","#FFE4F0","#E91E8C"],
    palette:["Hot Pink","Blush","Petal Pink","Fuchsia"],
    vibe:"More is more. Pink EVERYTHING. Bows, balloons, glitter, and zero apologies.",
    outfits:["All-pink matching sets","Pink feather boa + bodysuit","Barbie-core mini dress","Pink sequin co-ord"],
    decor:["Floor-to-ceiling balloon arch","Pink flower walls","Giant BRIDE marquee sign","Pink feather table runners","Disco ball + pink lighting"],
    shots:["Balloon arch group photo","Pink flower wall flat lay","Confetti cannon moment","Mirror selfie in matching outfits"],
    hashtags:["#MaximalistPink","#PinkBach","#BarbieCore","#HotPinkBride","#PinkEverything"],
    shopItems:[12,1,2], // In My Bride Era Kit · Disco Ball Headband · Garden Foil Balloon
  },
  {
    id:"disco_fever", name:"Disco Fever 🪩", emoji:"🪩🕺",
    colors:["#7B2FBE","#E040FB","#FFD700","#00E5FF"],
    palette:["Deep Purple","Electric Violet","Gold","Cyan"],
    vibe:"70s meets now. Disco balls, platform shoes, sequins, and a playlist that doesn't stop.",
    outfits:["Gold sequin mini dress","Metallic co-ord set","Flared pants + halter top","Silver bodysuit + platforms"],
    decor:["Hanging disco balls (all sizes)","Lava lamp centerpieces","Retro neon signs","Metallic fringe curtains","Vinyl record table decor"],
    shots:["Under the disco ball golden hour","Neon sign light photos","Group shot in sequins","Overhead arms-up formation"],
    hashtags:["#DiscoFever","#BachHotline","#DiscoBride","#SeventiesBach","#GlitterAndGold"],
    shopItems:[1,3,12], // Disco Ball Headband · Zebra Foil Balloon · In My Bride Era Kit
  },
  {
    id:"garden_party", name:"Garden Party", emoji:"🌸🍃",
    colors:["#6B8E23","#DDA0DD","#FFF8DC","#FFB6C1"],
    palette:["Garden Green","Lavender","Butter Yellow","Soft Blush"],
    vibe:"English garden meets girlhood. Floral crowns, afternoon tea, and wildflower everything.",
    outfits:["Floral midi dress","Cottagecore blouse + skirt","Linen co-ord + straw hat","Pastel sundress + espadrilles"],
    decor:["Wildflower centerpieces","Twig and vine arch","Pastel balloon clusters","Vintage china teacups","Garden lanterns + candles"],
    shots:["Flower crown flat lay","Walking through a garden path","Picnic blanket overhead","Champagne toast under florals"],
    hashtags:["#GardenPartyBride","#CottageCore","#FloralBach","#EnglishGardenBride","#WildflowerWedding"],
    shopItems:[2,16,13], // Garden Foil Balloon · Floral Groovy Beach Towel · Sardinas Towel
  },
  {
    id:"dark_romance", name:"Dark Romance", emoji:"🖤🌹",
    colors:["#3D1B35","#8B0000","#C9A96E","#2D0A18"],
    palette:["Deep Plum","Crimson Red","Antique Gold","Noir"],
    vibe:"Moody, mysterious, and magnetic. Red roses, black candles, and an undeniable vibe.",
    outfits:["Black velvet slip dress","Deep burgundy co-ord","Corset + wide leg trousers","Lace overlay midi dress"],
    decor:["Black rose centerpieces","Red taper candles","Gothic arch with draping","Velvet table linens","Antique gold candelabras"],
    shots:["Candlelit portrait session","Moody red rose flat lay","Group shot with dramatic lighting","Wine glass cheers silhouette"],
    hashtags:["#DarkRomance","#MoodyBride","#GothicBach","#DarkAcademiaBride","#RedRoseBach"],
    shopItems:[12,14,9], // In My Bride Era Kit · Panther Beach Towel · Bach Weekend Survival Kit
  },
  {
    id:"mob_wives", name:"Mob Wives", emoji:"🐆🕶️",
    colors:["#1C1C1C","#8B6914","#D4AF37","#4A0404"],
    palette:["Noir Black","Rich Camel","Champagne Gold","Deep Burgundy"],
    vibe:"Fur coats, oversized sunglasses, Italian glam. Power in every outfit.",
    outfits:["Faux fur coat over bodycon dress","Animal print co-ord","Oversized blazer + leather pants","Floor-length fur stole + heels"],
    decor:["Leopard print table runners","Gold candle towers","Black roses in gold vases","Velvet chairs","Vintage cigar box centerpieces"],
    shots:["Fur coat drama shot from behind","Sunglasses gang flat lay","Moody candlelit portrait","Power pose group shot"],
    hashtags:["#MobWives","#MobWifeBach","#FurCoatSzn","#GlamBride","#PowerBride"],
    shopItems:[14,12,9], // Panther Beach Towel · In My Bride Era Kit · Bach Survival Kit
  },
  {
    id:"mermaid_core", name:"Mermaid Core", emoji:"🧜‍♀️🌊",
    colors:["#006994","#40E0D0","#B8860B","#7FFFD4"],
    palette:["Ocean Deep","Turquoise","Antique Gold","Aquamarine"],
    vibe:"Iridescent, ethereal, and underwater luxe. Sequins that shimmer like scales.",
    outfits:["Iridescent sequin dress","Ombre blue-to-green co-ord","Holographic swimsuit","Mermaid-cut bodycon gown"],
    decor:["Seashell centerpieces","Iridescent balloon clouds","Blue and teal fairy lights","Pearl garland table runners","Starfish + net décor"],
    shots:["Underwater pool photo","Shell flat lay at the beach","Iridescent backdrop group shot","Sunset ocean silhouette"],
    hashtags:["#MermaidBach","#MermaidCore","#UnderTheSea","#OceanBride","#IridescentVibes"],
    shopItems:[7,8,9], // Custom Face Beach Towel · Custom Face Bikini · Bach Survival Kit
  },
  {
    id:"white_party", name:"White Party", emoji:"🤍✨",
    colors:["#FFFFFF","#F5F0E8","#E8E0D5","#D4AF37"],
    palette:["Pure White","Ivory","Linen","Gold Accent"],
    vibe:"All white everything. Clean, luxe, and effortlessly chic. Less is more.",
    outfits:["White linen co-ord","White mini dress + gold accessories","White bikini + cover-up","White bodysuit + wide-leg trousers"],
    decor:["All-white balloon arch","White flower walls","Gold candle clusters","White feather centerpieces","Linen table settings"],
    shots:["All-white outfit flat lay","White on white group shot","Pool float aerial","Champagne in white with gold foil"],
    hashtags:["#WhiteParty","#AllWhiteBach","#WhitePartyVibes","#LuxeBride","#WhiteAndGold"],
    shopItems:[12,9,6], // In My Bride Era Kit · Bach Survival Kit · Custom Poker Cards
  },
  {
    id:"retro_y2k", name:"Retro Y2K", emoji:"💿🦋",
    colors:["#FF69B4","#00BFFF","#9370DB","#FFD700"],
    palette:["Bubblegum Pink","Electric Blue","Lavender","Butter Yellow"],
    vibe:"Early 2000s nostalgia. Butterfly clips, baby tees, low-rise everything, and total chaos.",
    outfits:["Velour tracksuit","Baby tee + low-rise skirt","Bedazzled co-ord","Butterfly clip hair + crop top"],
    decor:["CD/DVD mirror mobiles","Y2K poster prints","Inflatable furniture","Butterfly decorations","Throwback candy table"],
    shots:["Disposable camera aesthetic","Flip phone group selfie pose","Mall photo booth recreation","Butterfly clip hair moment"],
    hashtags:["#Y2KBach","#RetroVibes","#2000sBride","#Y2KAesthetic","#ButterflyBride"],
    shopItems:[1,3,12], // Disco Ball Headband · Zebra Balloon · In My Bride Era Kit
  },
  {
    id:"tropical_luxe", name:"Tropical Luxe", emoji:"🌺🍹",
    colors:["#FF6B35","#FFD700","#228B22","#FF1493"],
    palette:["Sunset Orange","Golden Yellow","Tropical Green","Hibiscus Pink"],
    vibe:"Resort-ready luxury. Palm prints, fresh florals, gold jewelry, and endless sunsets.",
    outfits:["Palm print co-ord set","Colorful resort maxi dress","Tropical bikini + sarong","Gold jewelry + linen jumpsuit"],
    decor:["Fresh tropical flower centerpieces","Palm leaf table runners","Tiki torch lighting","Pineapple + mango table decor","Colorful paper lanterns"],
    shots:["Golden hour pool float shot","Tropical flower crown portrait","Cheers with colorful cocktails","Hammock between palm trees"],
    hashtags:["#TropicalBach","#ResortMode","#TropicalLuxe","#IslandBride","#SunsetBach"],
    shopItems:[7,15,9], // Custom Face Beach Towel · Cocktail Club Towel · Bach Survival Kit
  },
];

// ─── VENDOR REVIEW DATA ───────────────────────────────────────────────────────
export const VENDOR_REVIEWS = {
  "Catch Miami":           { rating:4.8, count:127, trust:"verified",  reviews:["Perfect for a group of 10. Rooftop views are unreal 🌴","They put us in the best spot when I mentioned bachelorette party!","The lobster mac is everything. Book 2 weeks ahead."] },
  "Nashville Pedal Tavern":{rating:4.7, count:89,  trust:"partner",   reviews:["BEST activity in Nashville for a bach. No debate.","90 mins went by SO fast. Bring your own drinks!","Driver was hilarious and knew every bar stop."] },
  "Drag Brunch Extravaganza":{rating:5.0,count:203, trust:"verified", reviews:["Best $80 I've ever spent. We cried laughing.","The performers remembered our bride's name all show!","Crown ceremony at the end made my friend sob happy tears."] },
  "Sunset Sailing Charter": {rating:4.9, count:56, trust:"partner",   reviews:["Charter crew brought surprise champagne for the bride 🥂","We saw dolphins!!! Sunset was absolutely magical.","Best 3 hours of the whole trip hands down."] },
  "NOLA Haunted Cocktail Tour":{rating:4.8,count:74,trust:"community",reviews:["Guide was amazing and genuinely knew every haunted story.","Stops at great bars — not tourist traps.","Perfect mix of spooky and fun for a mixed group."] },
};

// ─── MOH CHECKLIST ────────────────────────────────────────────────────────────
export const MOH_CHECKLIST = [
  { id:1,  category:"6+ Months Out", item:"Set the date and confirm with key guests",              done:false },
  { id:2,  category:"6+ Months Out", item:"Decide on destination — city trip or local",            done:false },
  { id:3,  category:"6+ Months Out", item:"Set the budget and communicate to the group",           done:false },
  { id:4,  category:"4 Months Out",  item:"Book flights (prices are best now)",                    done:false },
  { id:5,  category:"4 Months Out",  item:"Book Airbnb or Vrbo (weekends fill up fast)",           done:false },
  { id:6,  category:"4 Months Out",  item:"Send digital invites and collect RSVPs",                done:false },
  { id:7,  category:"2 Months Out",  item:"Book main activities (sailing, drag brunch etc.)",      done:false },
  { id:8,  category:"2 Months Out",  item:"Make restaurant reservations",                          done:false },
  { id:9,  category:"2 Months Out",  item:"Order party supplies and swag from Etsy",               done:false },
  { id:10, category:"2 Months Out",  item:"Confirm everyone has paid their share",                 done:false },
  { id:11, category:"1 Month Out",   item:"Plan arrival day dinner / welcome activity",            done:false },
  { id:12, category:"1 Month Out",   item:"Create the weekend itinerary",                          done:false },
  { id:13, category:"1 Month Out",   item:"Arrange transportation between venues",                 done:false },
  { id:14, category:"1 Week Out",    item:"Send final itinerary to group",                         done:false },
  { id:15, category:"1 Week Out",    item:"Confirm all bookings and reservations",                 done:false },
  { id:16, category:"Day Before",    item:"Pack the bride's emergency kit",                        done:false },
  { id:17, category:"Day Before",    item:"Charge all devices, download offline maps",             done:false },
  { id:18, category:"Day Of",        item:"Set group meeting time 30 min earlier than needed",     done:false },
  { id:19, category:"Day Of",        item:"Share Uber/Lyft codes with the group",                  done:false },
  { id:20, category:"Day Of",        item:"Designate a \"sober monitor\" for the night",           done:false },
];

// ─── RAW PRODUCTS ─────────────────────────────────────────────────────────────
export const RAW_PRODUCTS = [
  { id:1,  name:"Disco Ball Headband",         fullName:"Disco Ball Headband, Silver Hair Accessory, Bachelorette or Girls Night Party Supplies",          price:21.00, category:"Party Accessories",     tags:["headband","disco","hair"],             etsy:"https://i.etsystatic.com/40669879/r/il/7aaddb/6583299960/il_340x270.6583299960_27hz.jpg",  url:"https://www.etsy.com/listing/1861486865", bestseller:true,  isDigital:false, rating:4.9, reviews:34 },
  { id:2,  name:"Garden Foil Balloon 40\"",     fullName:"40-Inch Garden Number Foil Balloon, Floral Print, Bachelorette or Birthday Party Decor",           price:19.00, category:"Balloons",              tags:["balloon","foil","garden","floral"],    etsy:"https://i.etsystatic.com/40669879/r/il/0e5ad6/6631445257/il_340x270.6631445257_5nb1.jpg",  url:"https://www.etsy.com/listing/1861810967", bestseller:false, isDigital:false, rating:4.8, reviews:12 },
  { id:3,  name:"Zebra Foil Balloon 40\"",      fullName:"40-Inch Zebra Number Foil Balloon, Birthday Party Decor, Set of 1",                               price:10.99, category:"Balloons",              tags:["balloon","zebra","foil","number"],     etsy:"https://i.etsystatic.com/40669879/r/il/dc5b40/6583487874/il_340x270.6583487874_o2ch.jpg",  url:"https://www.etsy.com/listing/1840533580", bestseller:false, isDigital:false, rating:4.7, reviews:8  },
  { id:4,  name:"Corpus Christi Itinerary PDF", fullName:"Corpus Christi Itinerary PDF, 3 Day Schedule, Bachelorette or Girls Night Weekend Planner",        price:35.00, category:"Curated Itineraries",   tags:["itinerary","digital","pdf"],           etsy:"https://i.etsystatic.com/40669879/r/il/6f4965/6626388803/il_340x270.6626388803_92n4.jpg",  url:"https://www.etsy.com/listing/1845781336", bestseller:true,  isDigital:true,  rating:5.0, reviews:18 },
  { id:5,  name:"Custom Puzzle — Bach Favor",   fullName:"Custom Puzzle, Bachelorette Party Favor, Bridesmaids Gifts",                                       price:20.99, category:"Party Accessories",     tags:["custom","puzzle","favor"],             etsy:"https://i.etsystatic.com/40669879/r/il/b69758/7912465815/il_340x270.7912465815_n4jl.jpg",  url:"https://www.etsy.com/listing/4480916715", bestseller:false, isDigital:false, rating:4.9, reviews:6  },
  { id:6,  name:"Custom Poker Playing Cards",   fullName:"Custom Poker Playing Cards, Bachelorette Party Favor, Bridesmaids Gift",                           price:22.82, category:"Party Accessories",     tags:["custom","poker","cards","game"],       etsy:"https://i.etsystatic.com/40669879/r/il/d46018/7912337697/il_340x270.7912337697_k6v3.jpg",  url:"https://www.etsy.com/listing/4480941333", bestseller:true,  isDigital:false, rating:4.8, reviews:9  },
  { id:7,  name:"Custom Face Beach Towel",      fullName:"Custom Face Beach Towel, Girls Trip Beach Accessory, Bachelorette Party Favor",                    price:36.99, category:"Apparel",               tags:["beach towel","custom","girls trip"],   etsy:"https://i.etsystatic.com/40669879/r/il/da6218/7904215961/il_340x270.7904215961_2iau.jpg",  url:"https://www.etsy.com/listing/4479721592", bestseller:true,  isDigital:false, rating:5.0, reviews:22 },
  { id:8,  name:"Custom Face Bikini",           fullName:"Custom Face Bikini Swimsuit, Bachelorette Apparel",                                                price:33.55, category:"Apparel",               tags:["bikini","swimsuit","custom"],          etsy:"https://i.etsystatic.com/40669879/r/il/85b942/7879645149/il_340x270.7879645149_chlp.jpg",  url:"https://www.etsy.com/listing/4476018031", bestseller:false, isDigital:false, rating:4.9, reviews:7  },
  { id:9,  name:"Bach Weekend Survival Kit",    fullName:"Bach Weekend Bachelorette Kit, Survival Mini Tote, Party Favors",                                  price:28.25, category:"Party Accessories",     tags:["survival kit","tote","favors"],        etsy:"https://i.etsystatic.com/40669879/r/il/be331c/7753024464/il_340x270.7753024464_9auc.jpg",  url:"https://www.etsy.com/listing/4464005263", bestseller:true,  isDigital:false, rating:4.9, reviews:31 },
  { id:10, name:"Let's Go Girls Bach Kit",      fullName:"Let's Go Girls Bachelorette Kit, Survival Mini Tote, Party Favors",                                price:28.25, category:"Party Accessories",     tags:["lets go girls","tote","favor"],        etsy:"https://i.etsystatic.com/40669879/r/il/9594cb/7752997746/il_340x270.7752997746_25sx.jpg",  url:"https://www.etsy.com/listing/4464002387", bestseller:false, isDigital:false, rating:4.8, reviews:14 },
  { id:11, name:"Cowgirl Espresso Cup",         fullName:"Giddy Up Novelty Cowgirl Espresso Mug, Bachelorette Party Favor",                                  price:22.26, category:"Cups",                  tags:["mug","cowgirl","espresso","nashville"],etsy:"https://i.etsystatic.com/40669879/r/il/99c7e3/7806352486/il_340x270.7806352486_g77x.jpg",  url:"https://www.etsy.com/listing/4472132477", bestseller:false, isDigital:false, rating:4.7, reviews:5  },
  { id:12, name:"In My Bride Era Bach Kit",     fullName:"In My Bride Era Bachelorette Kit, Survival Mini Tote, Party Favors",                               price:28.25, category:"Party Accessories",     tags:["bride era","tote","trending"],         etsy:"https://i.etsystatic.com/40669879/r/il/b43b55/7750954064/il_340x270.7750954064_fc2p.jpg",  url:"https://www.etsy.com/listing/4463704232", bestseller:true,  isDigital:false, rating:5.0, reviews:28 },
  { id:13, name:"Sardinas Beach Towel",         fullName:"Modern Sardinas Beach Towel, Girls Trip Beach Accessory, Bachelorette Party Favor",                price:36.99, category:"Apparel",               tags:["beach towel","sardinas","trendy"],     etsy:"https://i.etsystatic.com/40669879/r/il/2e7ab3/7795365021/il_340x270.7795365021_6o5f.jpg",  url:"https://www.etsy.com/listing/4463176097", bestseller:false, isDigital:false, rating:4.8, reviews:10 },
  { id:14, name:"Panther Beach Towel",          fullName:"Pur Baby Panther Beach Towel, Girls Trip Beach Accessory, Bachelorette Party Favor",               price:36.99, category:"Apparel",               tags:["beach towel","panther","chic"],        etsy:"https://i.etsystatic.com/40669879/r/il/77b973/7795351957/il_340x270.7795351957_ixu2.jpg",  url:"https://www.etsy.com/listing/4463173609", bestseller:false, isDigital:false, rating:4.9, reviews:4  },
  { id:15, name:"Cocktail Club Beach Towel",    fullName:"Cocktail Club Beach Towel, Girls Trip Beach Accessory, Bachelorette Party Favor",                  price:36.99, category:"Apparel",               tags:["beach towel","cocktail","summer"],     etsy:"https://i.etsystatic.com/40669879/r/il/32a856/7795306529/il_340x270.7795306529_ppp2.jpg",  url:"https://www.etsy.com/listing/4463167702", bestseller:false, isDigital:false, rating:4.7, reviews:3  },
  { id:16, name:"Floral Groovy Beach Towel",    fullName:"Floral Groovy Beach Towel, Girls Trip Beach Accessory, Bachelorette Party Favor",                  price:36.99, category:"Apparel",               tags:["beach towel","floral","groovy"],       etsy:"https://i.etsystatic.com/40669879/r/il/3ba46b/7743346430/il_340x270.7743346430_efzo.jpg",  url:"https://www.etsy.com/listing/4462571690", bestseller:false, isDigital:false, rating:4.8, reviews:6  },
  { id:17, name:"Fast Food Beach Towel",        fullName:"Fast Food Beach Towel, Girls Trip Beach Accessory, Bachelorette Party Favor",                      price:36.99, category:"Apparel",               tags:["beach towel","fast food","quirky"],    etsy:"https://i.etsystatic.com/40669879/r/il/df92e8/7791280017/il_340x270.7791280017_qdsr.jpg",  url:"https://www.etsy.com/listing/4462569176", bestseller:true,  isDigital:false, rating:4.9, reviews:11 },
];

export const PRODUCTS = RAW_PRODUCTS.map(p => ({ ...p, image: px(p.etsy) }));

// ─── DESTINATIONS ─────────────────────────────────────────────────────────────
// featured:true = shown on Home page (top 8 only)
// international:true = shown under the International section in Plan tab
export const DESTS = [
  // ── US ──────────────────────────────────────────────────────────────────────
  { id:"miami",       name:"Miami",           emoji:"🌴", vibe:"Beach & Rooftops",        trend:"#1 Trending",       airportCode:"MIA", toFull:"Miami, FL",            featured:true  },
  { id:"nashville",   name:"Nashville",       emoji:"🎸", vibe:"Honky Tonk Heaven",       trend:"Fan Fave",          airportCode:"BNA", toFull:"Nashville, TN",        featured:true  },
  { id:"vegas",       name:"Las Vegas",       emoji:"🎰", vibe:"24/7 Everything",         trend:"Classic",           airportCode:"LAS", toFull:"Las Vegas, NV",        featured:true  },
  { id:"nola",        name:"New Orleans",     emoji:"🎷", vibe:"Bourbon & Beads",         trend:"Party 🎉",         airportCode:"MSY", toFull:"New Orleans, LA",      featured:true  },
  { id:"scottsdale",  name:"Scottsdale",      emoji:"🌵", vibe:"Desert Pool Parties",     trend:"Rising ⭐",        airportCode:"PHX", toFull:"Scottsdale, AZ",       featured:true  },
  { id:"austin",      name:"Austin",          emoji:"🤠", vibe:"Live Music & Lake Days",  trend:"Hot Right Now",     airportCode:"AUS", toFull:"Austin, TX",           featured:true  },
  { id:"charleston",  name:"Charleston",      emoji:"🌺", vibe:"Southern Charm",          trend:"Romantic",          airportCode:"CHS", toFull:"Charleston, SC"                       },
  { id:"savannah",    name:"Savannah",        emoji:"🌿", vibe:"Moss & Open Cups",        trend:"Hidden Gem",        airportCode:"SAV", toFull:"Savannah, GA"                         },
  { id:"nyc",         name:"New York City",   emoji:"🗽", vibe:"City That Never Sleeps",  trend:"Always Iconic",     airportCode:"JFK", toFull:"New York City, NY"                    },
  { id:"chicago",     name:"Chicago",         emoji:"🌃", vibe:"Deep Dish & Nightlife",   trend:"Midwest Fave",      airportCode:"ORD", toFull:"Chicago, IL"                          },
  { id:"sandiego",    name:"San Diego",       emoji:"🏖️", vibe:"Beach & Craft Beer",     trend:"Chill Vibes",       airportCode:"SAN", toFull:"San Diego, CA"                        },
  { id:"palmsprings", name:"Palm Springs",    emoji:"🏜️", vibe:"Pool Glam & Desert",     trend:"Retro Cool",        airportCode:"PSP", toFull:"Palm Springs, CA"                     },
  { id:"napa",        name:"Napa Valley",     emoji:"🍷", vibe:"Wine Country Luxe",       trend:"Bougie Pick",       airportCode:"SFO", toFull:"Napa, CA"                             },
  { id:"keywest",     name:"Key West",        emoji:"🦜", vibe:"Sunset & Island Energy",  trend:"Tropical",          airportCode:"EYW", toFull:"Key West, FL"                         },
  { id:"sedona",      name:"Sedona",          emoji:"🔴", vibe:"Spa & Red Rock Retreats", trend:"Wellness ✨",       airportCode:"PHX", toFull:"Sedona, AZ"                           },
  { id:"denver",      name:"Denver / Aspen",  emoji:"⛰️", vibe:"Mountains & Brunch",     trend:"Year-Round",        airportCode:"DEN", toFull:"Denver, CO"                           },
  { id:"houston",        name:"Houston",          emoji:"🤘", vibe:"BBQ, Nightlife & Culture",   trend:"Local Fave",    airportCode:"IAH", toFull:"Houston, TX"              },
  { id:"corpuschristi", name:"Corpus Christi",   emoji:"🏖️", vibe:"Beach & Bay City Vibes",     trend:"Hidden Gem",    airportCode:"CRP", toFull:"Corpus Christi, TX"       },
  { id:"boston",        name:"Boston",           emoji:"🦞", vibe:"History, Bars & Brunch",      trend:"East Coast Cool", airportCode:"BOS", toFull:"Boston, MA"             },
  // ── International ───────────────────────────────────────────────────────────
  { id:"cabo",        name:"Cabo San Lucas",  emoji:"🌊", vibe:"Yacht Parties & Resorts", trend:"#1 International",  airportCode:"SJD", toFull:"Cabo San Lucas, Mexico",  featured:true, international:true },
  { id:"mykonos",     name:"Mykonos",         emoji:"🪩", vibe:"Windmills & Beach Clubs", trend:"TikTok Viral",      airportCode:"JMK", toFull:"Mykonos, Greece",         featured:true, international:true },
  { id:"cancun",      name:"Cancun / Tulum",  emoji:"🏝️", vibe:"All-Inclusive & Cenotes",trend:"Trending 🔥",      airportCode:"CUN", toFull:"Cancun, Mexico",          international:true },
  { id:"puertorico",  name:"Puerto Rico",     emoji:"🌺", vibe:"No Passport · Old San Juan",trend:"No Passport!",   airportCode:"SJU", toFull:"San Juan, Puerto Rico",   international:true },
  { id:"bahamas",     name:"Bahamas",         emoji:"🐚", vibe:"Crystal Water & Party Boats",trend:"2-Hr Flight",   airportCode:"NAS", toFull:"Nassau, Bahamas",         international:true },
  { id:"barcelona",   name:"Barcelona",       emoji:"🥂", vibe:"Beach + Nightlife + Tapas",  trend:"Euro Fave",     airportCode:"BCN", toFull:"Barcelona, Spain",        international:true },
  { id:"bali",        name:"Bali",            emoji:"🌸", vibe:"Clifftop Pools & Temples",   trend:"Up & Coming",   airportCode:"DPS", toFull:"Bali, Indonesia",         international:true },
];

// ─── FLIGHTS ──────────────────────────────────────────────────────────────────
export const FLIGHTS = [
  { id:1, from:"NYC", to:"Miami",       airline:"Delta",     date:"Jun 14", price:89,  seats:8,  tag:"🔥 Best Deal",    dest:"miami",      toFull:"Miami, FL"       },
  { id:2, from:"NYC", to:"Nashville",   airline:"Southwest", date:"Jun 14", price:67,  seats:12, tag:"💅 Most Popular", dest:"nashville",  toFull:"Nashville, TN"   },
  { id:3, from:"NYC", to:"Las Vegas",   airline:"Spirit",    date:"Jun 15", price:112, seats:5,  tag:"🎰 Vegas Baby",   dest:"vegas",      toFull:"Las Vegas, NV"   },
  { id:4, from:"NYC", to:"Scottsdale",  airline:"American",  date:"Jun 14", price:94,  seats:9,  tag:"☀️ Sun & Sip",   dest:"scottsdale", toFull:"Scottsdale, AZ"  },
  { id:5, from:"NYC", to:"New Orleans", airline:"United",    date:"Jun 15", price:78,  seats:14, tag:"🎷 Party City",   dest:"nola",       toFull:"New Orleans, LA" },
  { id:6, from:"NYC", to:"Charleston",  airline:"JetBlue",   date:"Jun 14", price:59,  seats:20, tag:"🌺 Best Value",   dest:"charleston", toFull:"Charleston, SC"  },
];

// ─── STAYS ────────────────────────────────────────────────────────────────────
export const STAYS = [
  {
    id:1, name:"The Darling Penthouse", city:"Miami", price:420, rating:4.9, rooms:4,
    img:"🌴", tags:["Pool","Rooftop","Ocean View"], platform:"airbnb",
    desc:"Stunning rooftop penthouse steps from South Beach. Private pool, full kitchen, sleeps 8+.",
    highlight:"Ocean views from every room",
  },
  {
    id:2, name:"Bachelorette Manor", city:"Nashville", price:280, rating:4.8, rooms:5,
    img:"🎸", tags:["Hot Tub","Full Bar","Firepit"], platform:"vrbo",
    desc:"A legendary Nashville bach house with a built-in bar, hot tub, and firepit. Walking distance to Broadway.",
    highlight:"Walk to Honky Tonk Highway",
  },
  {
    id:3, name:"Vegas Suite Dreams", city:"Las Vegas", price:510, rating:4.7, rooms:6,
    img:"🎰", tags:["Strip View","Butler","Pool"], platform:"booking",
    desc:"Sky-high Las Vegas suite with panoramic Strip views. Concierge service and rooftop pool access included.",
    highlight:"Panoramic Strip views",
  },
  {
    id:4, name:"Desert Rose Villa", city:"Scottsdale", price:390, rating:5.0, rooms:4,
    img:"🌵", tags:["Private Pool","Hot Tub","Chef"], platform:"vrbo",
    desc:"Stunning Scottsdale desert retreat with a private heated pool, hot tub, and optional private chef.",
    highlight:"Private heated pool & chef",
  },
  {
    id:5, name:"Garden District Estate", city:"New Orleans", price:310, rating:4.8, rooms:5,
    img:"🎷", tags:["Courtyard","Bar Cart","Historic"], platform:"airbnb",
    desc:"Historic NOLA mansion in the Garden District. Lush private courtyard, fully stocked bar cart, and original hardwood floors.",
    highlight:"Historic NOLA mansion",
  },
  {
    id:6, name:"Rainbow Row Townhouse", city:"Charleston", price:265, rating:4.9, rooms:3,
    img:"🌺", tags:["Garden","Walkable","Historic"], platform:"airbnb",
    desc:"Charming pastel Charleston townhouse on Rainbow Row. Private garden, steps from the best restaurants and bars.",
    highlight:"Steps from King Street",
  },
  {
    id:7, name:"South Beach Luxury Condo", city:"Miami", price:350, rating:4.8, rooms:3,
    img:"🌊", tags:["Beachfront","Pool","Gym"], platform:"booking",
    desc:"Modern beachfront condo right on South Beach. Hotel-quality amenities with the space and privacy of a rental.",
    highlight:"Beachfront — steps to sand",
  },
  {
    id:8, name:"Nashville Penthouse Loft", city:"Nashville", price:320, rating:4.9, rooms:4,
    img:"🎵", tags:["City Views","Rooftop","Modern"], platform:"vrbo",
    desc:"Downtown Nashville rooftop loft with floor-to-ceiling windows and a private rooftop terrace. Nashville skyline views.",
    highlight:"Private rooftop terrace",
  },
];

// ─── PLATFORMS ────────────────────────────────────────────────────────────────
export const PLATFORMS = {
  airbnb:  { name:"Airbnb",       color:"#FF5A5F", bg:"#fff0f0", border:"#ffcdd2", label:"Entire home",    commission:"~4%", signupUrl:"https://www.airbnb.com/d/affiliates" },
  vrbo:    { name:"Vrbo",         color:"#1A5CB5", bg:"#f0f5ff", border:"#c5d5f5", label:"Vacation rental", commission:"~3%", signupUrl:"https://www.vrbo.com/affiliates"     },
  booking: { name:"Booking.com",  color:"#003580", bg:"#f0f4ff", border:"#c5d0f0", label:"Hotel/suite",     commission:"~4%", signupUrl:"https://www.booking.com/affiliates"  },
};

// ─── EATS (legacy simple list) ────────────────────────────────────────────────
export const EATS = [
  { id:1, name:"Catch Miami",              type:"Restaurant", vibe:"Rooftop Seafood",    price:"$$$$", rating:4.8, icon:"🦞", city:"Miami"       },
  { id:2, name:"Bottomless Brunch Club",   type:"Brunch",     vibe:"Endless Mimosas",    price:"$$$",  rating:4.9, icon:"🥂", city:"Nashville"   },
  { id:3, name:"Sunset Yacht Charter",     type:"Activity",   vibe:"Open Water Party",   price:"$$$$", rating:5.0, icon:"⛵", city:"Miami"       },
  { id:4, name:"Drag Bingo Night",         type:"Show",       vibe:"Interactive + Fun",  price:"$$",   rating:4.9, icon:"👑", city:"Las Vegas"   },
  { id:5, name:"Pole Dance Experience",    type:"Activity",   vibe:"Empowering & Fun",   price:"$$",   rating:4.8, icon:"💃", city:"Nashville"   },
  { id:6, name:"Bourbon Street VIP Crawl", type:"Bar Tour",   vibe:"Guided + VIP Entry", price:"$$$",  rating:4.7, icon:"🎷", city:"New Orleans" },
];

// ─── EATS DATA (full with booking links) ─────────────────────────────────────
export const EATS_DATA = [
  // RESTAURANTS → OpenTable (earn per seated diner)
  {id:1, name:"Catch Miami",               city:"Miami",       cat:"Restaurant", type:"Dining",
   vibe:"Iconic rooftop seafood, celebrity crowd",              price:"$$$$", rating:4.8, icon:"🦞",
   desc:"Miami's most iconic rooftop restaurant. Order the lobster truffle mac. Book well in advance for groups.",
   bp:"opentable", bl:"Reserve via OpenTable", bc:"#DA3743", commission:"Per seated diner"},
  {id:2, name:"The Gulch Brunch",           city:"Nashville",   cat:"Restaurant", type:"Brunch",
   vibe:"Bottomless mimosas + live acoustic sets",               price:"$$$",  rating:4.9, icon:"🥂",
   desc:"Nashville's best bottomless brunch in the Gulch. Live music every Saturday. Get there early.",
   bp:"opentable", bl:"Reserve via OpenTable", bc:"#DA3743", commission:"Per seated diner"},
  {id:3, name:"Bourbon House",              city:"New Orleans", cat:"Restaurant", type:"Dining",
   vibe:"Southern classics on Bourbon Street",                   price:"$$$",  rating:4.7, icon:"🍸",
   desc:"Iconic NOLA dining on Bourbon Street. Turtle soup and bananas foster are legendary.",
   bp:"opentable", bl:"Reserve via OpenTable", bc:"#DA3743", commission:"Per seated diner"},
  {id:4, name:"FnB Restaurant",             city:"Scottsdale",  cat:"Restaurant", type:"Dining",
   vibe:"James Beard farm-to-table Arizona cuisine",             price:"$$$",  rating:4.9, icon:"🌵",
   desc:"Scottsdale's most celebrated farm-to-table. Incredible wine list. Book the private room.",
   bp:"opentable", bl:"Reserve via OpenTable", bc:"#DA3743", commission:"Per seated diner"},
  {id:5, name:"Husk Charleston",            city:"Charleston",  cat:"Restaurant", type:"Dining",
   vibe:"James Beard Award-winning Southern cuisine",            price:"$$$$", rating:5.0, icon:"🌿",
   desc:"Stunning historic house. The fried chicken and pimento cheese are unforgettable.",
   bp:"opentable", bl:"Reserve via OpenTable", bc:"#DA3743", commission:"Per seated diner"},
  // ACTIVITIES → Viator/GetYourGuide (earn 8%)
  {id:6, name:"Sunset Sailing Charter",     city:"Miami",       cat:"Activity",    type:"Adventure",
   vibe:"Private yacht · Champagne · Miami sunset",              price:"$$$$", rating:5.0, icon:"⛵",
   desc:"Private sailing charter for your whole group. Champagne + snorkeling + breathtaking Miami sunset.",
   bp:"viator", bl:"Book via Viator", bc:"#00B0A0", commission:"8% via Viator"},
  {id:7, name:"Nashville Pedal Tavern",     city:"Nashville",   cat:"Activity",    type:"Party",
   vibe:"BYOB 16-person pedal bar through downtown",             price:"$$",   rating:4.8, icon:"🍺",
   desc:"The quintessential Nashville bach activity. 90 mins of chaos. BYOB, 16 people, pure fun.",
   bp:"viator", bl:"Book via Viator", bc:"#00B0A0", commission:"8% via Viator"},
  {id:8, name:"Vegas VIP Club Night",       city:"Las Vegas",   cat:"Activity",    type:"Nightlife",
   vibe:"Party bus + 3 VIP clubs + open bar",                    price:"$$$",  rating:4.7, icon:"🎰",
   desc:"Party bus picks you up, takes you to 3 VIP clubs with skip-the-line entry. Open bar included.",
   bp:"viator", bl:"Book via Viator", bc:"#00B0A0", commission:"8% via Viator"},
  {id:9, name:"NOLA Haunted Cocktail Tour", city:"New Orleans", cat:"Activity",    type:"Experience",
   vibe:"Haunted streets + historic bar stops",                   price:"$$",   rating:4.9, icon:"👻",
   desc:"NOLA's most popular walking tour through haunted streets with cocktail stops. Unforgettable.",
   bp:"getyourguide", bl:"Book via GetYourGuide", bc:"#FF5700", commission:"8% via GetYourGuide"},
  {id:10,name:"Scottsdale Sunset Jeep Tour",city:"Scottsdale",  cat:"Activity",    type:"Adventure",
   vibe:"Off-road desert Jeep · Champagne at golden hour",       price:"$$$",  rating:4.9, icon:"🌵",
   desc:"Epic open-air Jeep tour through the Sonoran Desert at sunset. Champagne toast at the overlook.",
   bp:"viator", bl:"Book via Viator", bc:"#00B0A0", commission:"8% via Viator"},
  {id:11,name:"Private Pole Dance Class",   city:"Miami",       cat:"Activity",    type:"Fitness",
   vibe:"Private studio · Girls-only · Empowering AF",           price:"$$",   rating:4.8, icon:"💃",
   desc:"Private pole dance class for your whole group. No experience needed — just great music and vibes.",
   bp:"getyourguide", bl:"Book via GetYourGuide", bc:"#FF5700", commission:"8% via GetYourGuide"},
  {id:12,name:"Charleston Carriage Tour",   city:"Charleston",  cat:"Activity",    type:"Experience",
   vibe:"Horse-drawn carriage through historic downtown",         price:"$$",   rating:4.8, icon:"🐴",
   desc:"Beautifully romantic horse-drawn carriage tour through Charleston's most gorgeous streets.",
   bp:"viator", bl:"Book via Viator", bc:"#00B0A0", commission:"8% via Viator"},
  {id:13,name:"Drag Brunch Extravaganza",   city:"Las Vegas",   cat:"Activity",    type:"Show",
   vibe:"World-class drag queens · Mimosas · Crown ceremony",    price:"$$$",  rating:5.0, icon:"👑",
   desc:"The most fabulous bach activity in Vegas. World-class performers, unlimited mimosas, crown ceremony.",
   bp:"viator", bl:"Book via Viator", bc:"#00B0A0", commission:"8% via Viator"},
  {id:14,name:"Nashville VIP Bar Crawl",    city:"Nashville",   cat:"Activity",    type:"Nightlife",
   vibe:"Guided VIP crawl through Honky Tonk Highway",           price:"$$",   rating:4.7, icon:"🎸",
   desc:"Guided VIP bar crawl through Broadway. Skip-the-line access, VIP sections, dedicated guide.",
   bp:"getyourguide", bl:"Book via GetYourGuide", bc:"#FF5700", commission:"8% via GetYourGuide"},
  {id:15,name:"Scottsdale Luxury Spa Day",  city:"Scottsdale",  cat:"Activity",    type:"Wellness",
   vibe:"Full-day resort spa · Private cabana · Pure luxury",    price:"$$$$", rating:5.0, icon:"🧖",
   desc:"Full-day spa experience at a world-class Scottsdale resort. Private cabana, massages, facials.",
   bp:"viator", bl:"Book via Viator", bc:"#00B0A0", commission:"8% via Viator"},
];

// ─── DECOR THEMES ─────────────────────────────────────────────────────────────
export const DECOR_THEMES = [
  { id:1, name:"Coastal Cowgirl",    colors:["#D4A574","#8FB8D4","#F5E6D3"], emoji:"🤠🌊" },
  { id:2, name:"Old Hollywood Glam", colors:["#2a2a2a","#D4AF37","#F5F0E8"], emoji:"🎬✨" },
  { id:3, name:"Maximalist Pink",    colors:["#FF6B9D","#FFB3D1","#FFE4F0"], emoji:"🩷🎀" },
  { id:4, name:"Disco Fever",        colors:["#7B2FBE","#E040FB","#FFD700"], emoji:"🪩🕺" },
  { id:5, name:"Garden Party",       colors:["#6B8E23","#DDA0DD","#FFF8DC"], emoji:"🌸🍃" },
  { id:6, name:"Dark Romance",       colors:["#3D1B35","#8B0000","#C9A96E"], emoji:"🖤🌹" },
];

// ─── SHOP CATEGORIES ──────────────────────────────────────────────────────────
export const SHOP_CATS = [
  { id:"all",                    label:"All",         emoji:"✨", count:534 },
  { id:"Party Accessories",      label:"Accessories", emoji:"🎀", count:63  },
  { id:"Balloons",               label:"Balloons",    emoji:"🎈", count:81  },
  { id:"Apparel",                label:"Apparel",     emoji:"👙", count:18  },
  { id:"Cups",                   label:"Cups",        emoji:"🥂", count:23  },
  { id:"Curated Itineraries",    label:"Itineraries", emoji:"📋", count:2   },
  { id:"Bachelorette Templates", label:"Templates",   emoji:"📄", count:78  },
];

// ─── NAV ──────────────────────────────────────────────────────────────────────
export const NAV = [
  { id:"home",    label:"Home"      },
  { id:"flights", label:"Flights"   },
  { id:"stays",   label:"Stays"     },
  { id:"eats",    label:"Eats"      },
  { id:"plan",    label:"Plan"      },
  { id:"budget",  label:"Budget"    },
  { id:"mood",    label:"Vibes"     },
  { id:"moh",     label:"MOH Hub"   },
  { id:"dayof",   label:"Day-Of"    },
  { id:"split",   label:"Split"     },
  { id:"shop",    label:"Shop"      },
  { id:"decor",   label:"AI Décor"  },
  { id:"profile", label:"Me"        },
];

// ─── BRIDE TYPES ──────────────────────────────────────────────────────────────
export const BRIDE_TYPES = [
  {id:"laidback",    emoji:"🌊", label:"Laid-Back Bride",     desc:"Easy vibes, good food, no strict schedule",     color:"#5B9BD5", bg:"#EEF5FC", border:"#C5DCF0", vibe:"relaxed, go-with-the-flow, brunches over clubs, wine nights, scenic walks, cozy, no early wake-ups",                          activities:"bottomless brunch, wine tasting, beach day, rooftop sunset, spa, cooking class"},
  {id:"adventurous", emoji:"🏄", label:"Adventurous Bride",   desc:"Thrills, outdoor fun, stories to tell forever", color:"#E07B39", bg:"#FEF3EC", border:"#F5C9A5", vibe:"adrenaline, outdoor adventure, bucket-list moments, spontaneous, daring, physical activities",                                  activities:"jeep tour, kayaking, hiking, ATV, sailing, ziplining, escape room, axe throwing"},
  {id:"classy",      emoji:"🥂", label:"Classy & Chic Bride", desc:"Elevated experiences, fine dining, luxury",     color:"#8B6914", bg:"#FEF9EC", border:"#E8D5A0", vibe:"luxury, fine dining, champagne, rooftop lounges, private charters, elegant, sophisticated, Instagram-worthy moments",           activities:"private yacht, fine dining, champagne tasting, luxury spa, private chef dinner, rooftop bar"},
  {id:"nature",      emoji:"🌿", label:"Nature-Loving Bride", desc:"Outdoors, fresh air, beautiful scenery",        color:"#3a6b35", bg:"#EFF7EE", border:"#B8D9B5", vibe:"nature, hiking, botanical gardens, sunsets, scenic drives, farm-to-table food, peaceful, photography",                          activities:"botanical garden, sunset hike, horseback riding, picnic, kayaking, hot air balloon, farmers market"},
  {id:"party",       emoji:"🎉", label:"Party Animal Bride",  desc:"All night every night — LET'S GO",              color:"#7B2FBE", bg:"#F5EEFF", border:"#D4B8F0", vibe:"nightlife, dancing, clubs, bar hopping, party bus, VIP sections, shots, live music, DJ, confetti, staying out late",           activities:"VIP club access, party bus, drag show, bar crawl, karaoke, rooftop pool party, bottle service"},
  {id:"foodie",      emoji:"🍜", label:"Foodie Bride",        desc:"Eat your way through the city",                 color:"#C05621", bg:"#FEF0E8", border:"#F5C4A0", vibe:"food tours, tasting menus, cooking classes, local markets, food halls, wine pairing, culinary adventures, chef experiences",     activities:"food tour, cooking class with a chef, tasting menu, local market, wine and cheese pairing, cocktail masterclass"},
];
