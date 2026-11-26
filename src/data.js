// ===== DEMO DATA LAYER =====
// Replace these arrays with API calls (see services/api.js) — the UI only reads from here.

const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
export const rnd = (seed, min, max) => min + (hash(String(seed)) % 1000) / 1000 * (max - min);

// Title|Year|Players(M)|Rating|Platform|Mode|OfficialURL(optional)
const RAW = {
  FPS: `Counter-Strike 2|2023|1.5|9.3|PC|Multi|https://www.counter-strike.net
Valorant|2020|22|9.1|PC|Multi|https://playvalorant.com
Overwatch 2|2023|25|8.2|PC,Console|Multi|https://overwatch.blizzard.com
Rainbow Six Siege|2015|85|8.8|PC,Console|Multi|https://www.ubisoft.com/game/rainbow-six/siege
Call of Duty: MW III|2023|30|7.9|PC,Console|Both|https://www.callofduty.com
Battlefield 2042|2021|10|7.4|PC,Console|Multi|https://www.ea.com/games/battlefield
Halo Infinite|2021|20|8.4|PC,Console|Both|https://www.halowaypoint.com
Destiny 2|2017|40|8.5|PC,Console|Both|https://www.bungie.net
Team Fortress 2|2007|2|9.0|PC|Multi|https://www.teamfortress.com
Doom Eternal|2020|5|9.2|PC,Console|Single|https://slayersclub.bethesda.net
Titanfall 2|2016|3|9.0|PC,Console|Both|https://www.ea.com/games/titanfall
Escape from Tarkov|2017|4|8.0|PC|Multi|https://www.escapefromtarkov.com
Deep Rock Galactic|2020|6|9.1|PC,Console|Multi|https://www.deeprockgalactic.com
Payday 3|2023|2|6.8|PC,Console|Multi|https://www.paydaythegame.com
Borderlands 3|2019|18|8.3|PC,Console|Both|https://borderlands.com
Left 4 Dead 2|2009|3|9.4|PC|Multi|https://store.steampowered.com/app/550
Half-Life: Alyx|2020|2|9.6|PC|Single|https://www.half-life.com
Paladins|2018|10|7.9|PC,Console|Multi|https://www.paladins.com
Ready or Not|2023|2|8.5|PC|Both|https://readyornotgame.com
Delta Force|2024|8|7.8|PC,Console|Multi|https://www.playdeltaforce.com`,
  'Battle Royale': `Fortnite|2017|110|8.9|PC,Console,Mobile|Multi|https://www.fortnite.com
PUBG: Battlegrounds|2017|75|8.4|PC,Console|Multi|https://pubg.com
Apex Legends|2019|130|9.0|PC,Console|Multi|https://www.ea.com/games/apex-legends
Call of Duty: Warzone|2020|100|8.1|PC,Console|Multi|https://www.callofduty.com/warzone
Fall Guys|2020|50|8.2|PC,Console|Multi|https://www.fallguys.com
Naraka: Bladepoint|2021|12|8.1|PC,Console|Multi|https://www.narakathegame.com
The Finals|2023|13|8.6|PC,Console|Multi|https://www.reachthefinals.com
Hunt: Showdown 1896|2019|3|8.7|PC,Console|Multi|https://www.huntshowdown.com
Free Fire|2017|100|7.6|Mobile|Multi|https://ff.garena.com
PUBG Mobile|2018|100|8.0|Mobile|Multi|https://www.pubgmobile.com
Blood Strike|2023|20|7.5|Mobile|Multi|https://www.bloodstrike.com
Super Animal Royale|2018|5|7.9|PC,Console|Multi|https://animalroyale.com`,
  MOBA: `Dota 2|2013|60|9.0|PC|Multi|https://www.dota2.com
League of Legends|2009|130|8.7|PC|Multi|https://www.leagueoflegends.com
Mobile Legends|2016|110|7.9|Mobile|Multi|https://m.mobilelegends.com
Honor of Kings|2015|100|8.0|Mobile|Multi|https://www.honorofkings.com
Smite 2|2024|3|7.8|PC,Console|Multi|https://www.smitegame.com
Heroes of the Storm|2015|2|8.0|PC|Multi|https://heroesofthestorm.blizzard.com
Wild Rift|2020|20|8.2|Mobile|Multi|https://wildrift.leagueoflegends.com
Pokémon UNITE|2021|15|7.7|Mobile,Console|Multi|https://unite.pokemon.com
Arena of Valor|2016|30|7.6|Mobile|Multi|https://www.arenaofvalor.com
Marvel Rivals|2024|40|8.3|PC,Console|Multi|https://www.marvelrivals.com`,
  Racing: `Forza Horizon 5|2021|40|9.2|PC,Console|Both|https://forzamotorsport.net
Gran Turismo 7|2022|9|8.8|Console|Both|https://www.gran-turismo.com
Rocket League|2015|90|9.0|PC,Console|Multi|https://www.rocketleague.com
Need for Speed Unbound|2022|8|8.0|PC,Console|Both|https://www.ea.com/games/need-for-speed
Assetto Corsa|2014|5|8.9|PC,Console|Both|https://www.assettocorsa.net
iRacing|2008|0.2|8.5|PC|Multi|https://www.iracing.com
F1 24|2024|6|8.1|PC,Console|Both|https://www.ea.com/games/ea-sports-f1
Asphalt 9: Legends|2018|30|8.0|Mobile,PC|Both|https://www.gameloft.com/asphalt9
Trackmania|2020|3|8.6|PC,Console|Both|https://www.trackmania.com
Mario Kart 8 Deluxe|2017|60|9.3|Console|Both|https://www.nintendo.com/mario-kart`,
  RPG: `Elden Ring|2022|25|9.6|PC,Console|Both|https://en.bandainamcoent.eu/elden-ring
Cyberpunk 2077|2020|30|8.8|PC,Console|Single|https://www.cyberpunk.net
The Witcher 3|2015|50|9.7|PC,Console|Single|https://www.thewitcher.com
Baldur's Gate 3|2023|15|9.7|PC,Console|Both|https://baldursgate3.game
Skyrim|2011|60|9.4|PC,Console|Single|https://elderscrolls.bethesda.net
Genshin Impact|2020|60|8.6|PC,Console,Mobile|Both|https://genshin.hoyoverse.com
Honkai: Star Rail|2023|40|8.7|PC,Mobile|Single|https://hsr.hoyoverse.com
Final Fantasy XIV|2013|30|9.1|PC,Console|Multi|https://www.finalfantasyxiv.com
World of Warcraft|2004|7|8.5|PC|Multi|https://worldofwarcraft.blizzard.com
Diablo IV|2023|10|8.1|PC,Console|Both|https://diablo4.blizzard.com
Path of Exile 2|2024|4|8.8|PC,Console|Both|https://pathofexile2.com
Red Dead Redemption 2|2018|65|9.6|PC,Console|Both|https://www.rockstargames.com/reddeadredemption2
GTA V|2013|190|9.5|PC,Console|Both|https://www.rockstargames.com/gta-v
Zelda: Tears of the Kingdom|2023|20|9.7|Console|Single|https://www.zelda.com
Starfield|2023|15|7.8|PC,Console|Single|https://bethesda.net/game/starfield
Fallout 4|2015|25|8.7|PC,Console|Single|https://fallout.bethesda.net
Dark Souls III|2016|10|9.1|PC,Console|Both|https://www.darksouls.jp
Hogwarts Legacy|2023|30|8.5|PC,Console|Single|https://www.hogwartslegacy.com
Black Myth: Wukong|2024|20|9.0|PC,Console|Single|https://www.heishenhua.com
Lies of P|2023|3|8.9|PC,Console|Single|https://www.liesofp.com`,
  Sports: `EA SPORTS FC 25|2024|25|7.2|PC,Console|Both|https://www.ea.com/games/ea-sports-fc
NBA 2K25|2024|8|7.0|PC,Console|Both|https://nba.2k.com
eFootball|2021|40|6.9|PC,Console,Mobile|Both|https://www.konami.com/efootball
Madden NFL 25|2024|4|7.1|PC,Console|Both|https://www.ea.com/games/madden-nfl
UFC 5|2023|3|7.6|Console|Both|https://www.ea.com/games/ufc
WWE 2K24|2024|2|8.0|PC,Console|Both|https://wwe.2k.com
NHL 24|2023|2|7.5|Console|Both|https://www.ea.com/games/nhl
Top Spin 2K25|2024|1|7.9|PC,Console|Both|https://2k.com/topspin
PGA Tour 2K23|2022|1|7.5|PC,Console|Both|https://pgatour.2k.com
Football Manager 2024|2023|3|8.1|PC,Console,Mobile|Single|https://www.footballmanager.com`,
  Survival: `Minecraft|2011|140|9.4|PC,Console,Mobile|Both|https://www.minecraft.net
Rust|2018|4|8.4|PC,Console|Multi|https://rust.facepunch.com
ARK: Survival Ascended|2023|3|7.0|PC,Console|Both|https://playark.com
The Forest|2018|2|8.8|PC,Console|Both|https://survivetheforest.net
Sons of the Forest|2023|3|8.5|PC|Both|https://sonsoftheforestgame.com
Resident Evil 4|2023|5|9.3|PC,Console|Single|https://www.residentevil.com
Dead by Daylight|2016|6|8.2|PC,Console,Mobile|Multi|https://deadbydaylight.com
Phasmophobia|2020|3|8.9|PC,Console|Both|https://kineticgames.co.uk/phasmophobia
Subnautica|2018|4|9.0|PC,Console|Single|https://unknownworlds.com/subnautica
Lethal Company|2023|3|9.0|PC|Multi|https://store.steampowered.com/app/1966720`,
  Strategy: `Age of Empires IV|2021|2|8.3|PC,Console|Both|https://www.ageofempires.com
Civilization VI|2016|6|8.6|PC,Console,Mobile|Both|https://civilization.com
StarCraft II|2010|3|9.0|PC|Both|https://starcraft2.blizzard.com
Clash Royale|2016|70|8.3|Mobile|Multi|https://clashroyale.com
Hearthstone|2014|10|8.2|PC,Mobile|Multi|https://hearthstone.blizzard.com
Among Us|2018|20|8.1|PC,Console,Mobile|Multi|https://www.innersloth.com
Stardew Valley|2016|20|9.6|PC,Console,Mobile|Both|https://www.stardewvalley.net
Terraria|2011|18|9.5|PC,Console,Mobile|Both|https://terraria.org
Hades|2020|5|9.5|PC,Console|Single|https://www.supergiantgames.com/games/hades
Cities: Skylines II|2023|2|6.5|PC,Console|Single|https://www.paradoxinteractive.com/games/cities-skylines-ii
Total War: Warhammer III|2022|3|8.0|PC|Both|https://www.totalwar.com
Teamfight Tactics|2019|40|8.4|PC,Mobile|Multi|https://teamfighttactics.leagueoflegends.com
Palworld|2024|25|8.0|PC,Console|Both|https://www.pocketpair.jp/palworld
Helldivers 2|2024|12|8.7|PC,Console|Multi|https://www.playstation.com/games/helldivers-2
Balatro|2024|5|9.3|PC,Console,Mobile|Single|https://www.playbalatro.com`,
};
const GENRE_ACCENT = { FPS: ['#8b5cf6','#ff3d81'], 'Battle Royale': ['#00d9ff','#8b5cf6'], MOBA: ['#a855f7','#00d9ff'], Racing: ['#ff9d32','#ff3d81'], RPG: ['#a3ff4f','#00d9ff'], Sports: ['#00d9ff','#a3ff4f'], Survival: ['#ff3d81','#ff9d32'], Strategy: ['#8b5cf6','#a3ff4f'] };
const DESC = {
  FPS: 'Precision gunplay, tight map control and high-skill competitive play.',
  'Battle Royale': 'Drop in, loot up and outlast everyone in a shrinking arena.',
  MOBA: 'Draft your team, own your lane and break the enemy nexus.',
  Racing: 'Tuned machines, perfect lines and razor-thin finishes.',
  RPG: 'Vast worlds, deep builds and stories you will not forget.',
  Sports: 'Stadium atmosphere and competitive career modes.',
  Survival: 'Gather, build and survive whatever the night throws at you.',
  Strategy: 'Outthink opponents with economy, tactics and timing.',
};
export const GENRES = Object.keys(RAW);
const COVER_APP_IDS = {
  'counter-strike-2': 730,
  'dota-2': 570,
  'counter-strike': 10,
  'team-fortress-2': 440,
  'left-4-dead-2': 550,
  'half-life-alyx': 546560,
  'deep-rock-galactic': 548430,
  'apex-legends': 1172470,
  'pubg-battlegrounds': 578080,
  'forza-horizon-5': 1551360,
  'rocket-league': 252950,
  'elden-ring': 1245620,
  'cyberpunk-2077': 1091500,
  'the-witcher-3': 292030,
  'baldur-s-gate-3': 1086940,
  'red-dead-redemption-2': 1174180,
  'gta-v': 271590,
  'stardew-valley': 413150,
  'terraria': 105600,
  'hades': 1145360,
  'hearthstone': 583950,
  'minecraft': 0,
  'valorant': 0,
  'overwatch-2': 0,
  'rainbow-six-siege': 359550,
  'call-of-duty-mw-iii': 0,
  'battlefield-2042': 0,
  'halo-infinite': 0,
  'doom-eternal': 782330,
  'titanfall-2': 1237970,
  'escape-from-tarkov': 0,
  'borderlands-3': 397540,
  'payday-3': 1272080,
  'ready-or-not': 1144200,
  'delta-force': 2507950,
  'fortnite': 0,
  'pubg-battlegrounds': 578080,
  'apex-legends': 1172470,
  'fall-guys': 1097150,
  'naraka-bladepoint': 1203220,
  'the-finals': 2073850,
  'hunt-showdown-1896': 594650,
  'league-of-legends': 0,
  'honor-of-kings': 0,
  'smite-2': 2437170,
  'heroes-of-the-storm': 0,
  'pokemon-unite': 0,
  'forza-horizon-5': 1551360,
  'gran-turismo-7': 0,
  'rocket-league': 252950,
  'need-for-speed-unbound': 1846380,
  'assetto-corsa': 284160,
  'iracing': 0,
  'f1-24': 2488620,
  'trackmania': 2225070,
  'mario-kart-8-deluxe': 0,
  'cyberpunk-2077': 1091500,
  'the-witcher-3': 292030,
  'baldur-s-gate-3': 1086940,
  'genshin-impact': 0,
  'honkai-star-rail': 0,
  'final-fantasy-xiv': 0,
  'world-of-warcraft': 0,
  'diablo-iv': 0,
  'path-of-exile-2': 2694490,
  'skyrim': 72850,
  'zelda-tears-of-the-kingdom': 0,
  'starfield': 1716740,
  'fallout-4': 377160,
  'dark-souls-iii': 374320,
  'hogwarts-legacy': 990080,
  'lies-of-p': 1627720,
  'black-myth-wukong': 2358720,
  'ea-sports-fc-25': 0,
  'nba-2k25': 0,
  'efootball': 0,
  'madden-nfl-25': 0,
  'ufc-5': 0,
  'wwe-2k24': 0,
  'rust': 252490,
  'ark-survival-ascended': 2399830,
  'the-forest': 242760,
  'sons-of-the-forest': 1326470,
  'resident-evil-4': 2050650,
  'dead-by-daylight': 381210,
  'phasmophobia': 739630,
  'subnautica': 264710,
  'lethal-company': 1966720,
  'age-of-empires-iv': 1466860,
  'civilization-vi': 289070,
  'starcraft-ii': 0,
  'clash-royale': 0,
  'among-us': 945360,
  'stardew-valley': 413150,
  'terraria': 105600,
  'hades': 1145360,
  'cities-skylines-ii': 949230,
  'total-war-warhammer-iii': 1142710,
  'teamfight-tactics': 0,
  'palworld': 1623730,
  'helldivers-2': 553850,
  'balatro': 2379780,
};
export const GAMES = Object.entries(RAW).flatMap(([genre, block]) => block.split('\n').map((l) => {
  const [title, year, players, rating, platform, mode, url] = l.split('|');
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const directCovers = {
    'league-of-legends': 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg',
    'teamfight-tactics': 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg',
  };
  return {
    id,
    title, genre, year: +year, players: +players, rating: +rating,
    platforms: platform.split(','), mode,
    url: url || `https://store.steampowered.com/search/?term=${encodeURIComponent(title)}`,
    coverUrl: directCovers[id]
      ? directCovers[id]
      : (COVER_APP_IDS[id] ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${COVER_APP_IDS[id]}/library_600x900.jpg` : null),
    colors: GENRE_ACCENT[genre], desc: DESC[genre],
  };
}));
export const gameById = (id) => GAMES.find((g) => g.id === id);
export const fmtPlayers = (m) => (m >= 1 ? `${m % 1 ? m.toFixed(1) : m}M` : `${Math.round(m * 1000)}K`);
export const fmt = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n));

export const STREAMERS = [
  ['ZenixPlay', 'counter-strike-2', 'CS2 — Ranked Match', 24700], ['FrostyFPS', 'valorant', 'Valorant Immortal climb', 12300],
  ['GameMaster', 'pubg-battlegrounds', 'PUBG Squad Night', 9800], ['DotaLegend', 'dota-2', 'Dota 2 7.0 meta', 8100],
  ['NovaQueen', 'apex-legends', 'Apex Predator Road', 7600], ['PixelDream', 'minecraft', 'Hardcore world day 40', 6900],
  ['AzizGG', 'fortnite', 'Zero Build Cups', 6100], ['SamuraiX', 'elden-ring', 'No-hit run attempt', 5400],
  ['TenZ_Fan', 'valorant', 'Aim lab + Deathmatch', 4800], ['RaceKing', 'forza-horizon-5', 'Midnight Festival', 3900],
  ['SilentWolf', 'rainbow-six-siege', 'Ranked 5-stack', 3500], ['LunaPlays', 'baldur-s-gate-3', 'Honour mode finale', 3100],
].map(([name, game, title, viewers], i) => ({ id: name.toLowerCase(), name, game, title, viewers, followers: Math.round(viewers * (8 + (i % 5))), verified: i % 3 !== 2 }));

export const TOURNAMENTS = [
  { id: 'vyron-championship', name: 'VYRON Championship', game: 'counter-strike-2', prize: 100000, status: 'upcoming', type: '5v5 Double Elim', teams: 128, slots: 128, start: Date.now() + 12 * 864e5 + 14 * 36e5 },
  { id: 'neon-cup', name: 'Neon Valorant Cup', game: 'valorant', prize: 25000, status: 'live', type: '5v5 Single Elim', teams: 64, slots: 64, start: Date.now() - 36e5 },
  { id: 'apex-rush', name: 'Apex Rush Invitational', game: 'apex-legends', prize: 15000, status: 'upcoming', type: '3v3 Points', teams: 40, slots: 60, start: Date.now() + 4 * 864e5 },
  { id: 'dota-clash', name: 'Dota Clash Series', game: 'dota-2', prize: 50000, status: 'upcoming', type: '5v5 Swiss', teams: 22, slots: 32, start: Date.now() + 20 * 864e5 },
  { id: 'rocket-sprint', name: 'Rocket Sprint 3v3', game: 'rocket-league', prize: 8000, status: 'live', type: '3v3 Bracket', teams: 32, slots: 32, start: Date.now() - 2 * 36e5 },
  { id: 'pubg-arena', name: 'PUBG Arena Open', game: 'pubg-battlegrounds', prize: 12000, status: 'completed', type: 'Squad Points', teams: 25, slots: 25, start: Date.now() - 9 * 864e5 },
  { id: 'fc-legends', name: 'FC Legends 1v1', game: 'ea-sports-fc-25', prize: 5000, status: 'completed', type: '1v1 Ladder', teams: 128, slots: 128, start: Date.now() - 20 * 864e5 },
  { id: 'tarkov-raid', name: 'Raid Masters Cup', game: 'escape-from-tarkov', prize: 10000, status: 'upcoming', type: '2v2 Raid', teams: 12, slots: 24, start: Date.now() + 8 * 864e5 },
];

export const COURSES = [
  ['CS2 Pro Tips: Smokes & Utility', 'CS2 Pro Tips', 'Zynx', '14:25', 'Intermediate', 4.9, 'counter-strike-2'],
  ['Valorant Guide: Dominate Duelists', 'Valorant Guides', 'TenZ_Fan', '18:30', 'Beginner', 4.8, 'valorant'],
  ['Aim Training Methods That Work', 'Aim Training', 'Zynx', '12:40', 'Beginner', 4.9, 'counter-strike-2'],
  ['Dota 2 Draft Strategy 101', 'Strategies', 'DotaLegend', '26:10', 'Advanced', 4.7, 'dota-2'],
  ['Apex Movement Masterclass', 'Advanced Techniques', 'NovaQueen', '21:05', 'Advanced', 4.9, 'apex-legends'],
  ['Minecraft: First 10 Nights', 'Beginner Tutorials', 'PixelDream', '16:20', 'Beginner', 4.6, 'minecraft'],
  ['Rainbow Six: Site Anchoring', 'Strategies', 'SilentWolf', '19:45', 'Intermediate', 4.7, 'rainbow-six-siege'],
  ['Elden Ring: Boss Fundamentals', 'Beginner Tutorials', 'SamuraiX', '24:00', 'Beginner', 4.8, 'elden-ring'],
  ['Crosshair Placement Deep Dive', 'Advanced Techniques', 'FrostyFPS', '11:15', 'Advanced', 4.9, 'valorant'],
].map(([title, cat, creator, dur, level, rating, game], i) => ({ id: 'c' + i, title, cat, creator, dur, level, rating, game, lessons: 6 + (i % 4) * 2 }));

export const NEWS = [
  ['New CS2 Update Brings Major Map Changes', 'Updates', '2 hours ago', 'counter-strike-2', 'Valve rolled out a patch reworking mid-control on several competitive maps and adjusting utility lineups.'],
  ['Valorant Champions 2026 Announced', 'Esports', '4 hours ago', 'valorant', 'The finals return with a bigger prize pool, a new host city and an expanded qualifier path.'],
  ['GTA VI Trailer Breaks Records', 'Releases', '6 hours ago', 'gta-v', 'Rockstar fans pushed the latest trailer past every previous launch-day view count on the platform.'],
  ['Dota 2 Patch Rewrites the Jungle', 'Updates', '1 day ago', 'dota-2', 'Neutral item changes and a new objective reshape early-game routes for pro teams.'],
  ['Apex Legends Season Adds New Legend', 'Updates', '1 day ago', 'apex-legends', 'A mobile support legend arrives together with a refreshed ranked reward track.'],
  ['VYRON Championship Registration Opens', 'Tournaments', '2 days ago', 'counter-strike-2', 'Teams can now register for the $100,000 VYRON Championship with open qualifiers.'],
  ['Elden Ring Community Hits New Milestone', 'Industry', '3 days ago', 'elden-ring', 'Modders and speedrunners celebrate record-breaking runs across challenge categories.'],
  ['Indie Spotlight: Balatro-Style Hits Rise', 'Industry', '4 days ago', 'balatro', 'Small studios continue to dominate award shortlists with tight, inventive design.'],
].map(([title, cat, date, game, sum], i) => ({ id: 'n' + i, title, cat, date, game, sum, author: ['Aziza K.', 'Rustam B.', 'Mina L.'][i % 3] }));

export const COMMUNITIES = [
  ['CS2 Uzbekistan', 'counter-strike-2', 48200], ['Valorant Squad Finder', 'valorant', 126000], ['Minecraft Builders', 'minecraft', 310000],
  ['Elden Ring Lore', 'elden-ring', 85400], ['Apex Legends Hub', 'apex-legends', 92100], ['Indie Gems', 'balatro', 41000],
].map(([name, game, members], i) => ({ id: 'g' + i, name, game, members }));

export const POSTS = [
  { id: 1, user: 'ZenixPlay', game: 'counter-strike-2', text: 'Insane 1v4 clutch on Mirage last night — full clip is on my channel. Who else is hyped for the Championship?', likes: 482, comments: 36, time: '12m' },
  { id: 2, user: 'NovaQueen', game: 'apex-legends', text: 'Looking for 2 chill teammates for Diamond ranked. Mic required, good vibes only. DM me!', likes: 129, comments: 54, time: '41m' },
  { id: 3, user: 'PixelDream', game: 'minecraft', text: 'Finished my cyberpunk city build after 3 weeks. Screenshots in the gallery — feedback welcome!', likes: 903, comments: 88, time: '2h' },
  { id: 4, user: 'SamuraiX', game: 'elden-ring', text: 'Tip: use spirit ash summons on Malenia only if you can handle the waterfowl. Learn the dodge timing first.', likes: 311, comments: 22, time: '5h' },
];

export const PRODUCTS = [
  ['VYRON Pro Mechanical Keyboard', 'Keyboards', 129], ['Phantom 60K Gaming Mouse', 'Mice', 79], ['Aether 7.1 Headset', 'Headsets', 149],
  ['Pulse Wireless Controller', 'Controllers', 69], ['Titan Ergonomic Chair', 'Chairs', 349], ['VYRON Hoodie — Neon Edition', 'Merch', 59],
  ['Stealth XL Mousepad', 'Accessories', 29], ['Orbit Streaming Mic', 'Headsets', 119], ['Mesh Wireless Keyboard 75%', 'Keyboards', 99],
  ['VYRON Cap', 'Merch', 29], ['Apex Pad Controller Pro', 'Controllers', 129], ['Command Desk Light Bar', 'Accessories', 49],
].map(([name, cat, price], i) => ({
  id: 'p' + i,
  name,
  cat,
  price,
  rating: +(rnd(name, 4.3, 5)).toFixed(1),
  colors: [['#8b5cf6','#ff3d81'],['#00d9ff','#8b5cf6'],['#ff9d32','#ff3d81'],['#a3ff4f','#00d9ff']][i % 4],
  image: [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    'https://images.unsplash.com/photo-1527814050087-3793815479db',
    'https://images.unsplash.com/photo-1599669454699-248893623440',
    'https://images.unsplash.com/photo-1592840496694-26d035b9da99',
    'https://images.unsplash.com/photo-1598550476439-6847785fcea8',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
    'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2',
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    'https://images.unsplash.com/photo-1521369909029-2afed882baee',
    'https://images.unsplash.com/photo-1592840496694-26d035b9da99',
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15',
  ][i] + '?auto=format&fit=crop&w=700&q=85',
}));

export const NOTIFICATIONS = [
  { id: 1, type: 'follow', text: 'FrostyFPS started following you', time: '2m' },
  { id: 2, type: 'live', text: 'ZenixPlay is live: CS2 — Ranked Match', time: '8m' },
  { id: 3, type: 'tournament', text: 'Neon Valorant Cup bracket updated', time: '1h' },
  { id: 4, type: 'community', text: 'New reply in Valorant Squad Finder', time: '3h' },
  { id: 5, type: 'achievement', text: 'Achievement unlocked: Clutch Master 🏆', time: '1d' },
];
export const ACHIEVEMENTS = ['Clutch Master', 'First Blood', 'Marathon Viewer', 'Team Captain', 'Top 100', 'Early Adopter'];
