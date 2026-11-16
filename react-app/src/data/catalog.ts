// ============================================================================
// v2.0 EXPANSION — GLOBAL NASA RELIC CATALOG (6 DEEP-DIVE + 23 NEW HARDWARE)
// Coordinates: planetocentric latitude / east-positive longitude (-180..180).
// Deep-space items use heliocentric distance (AU) + schematic direction angle.
// ============================================================================

export type Lang = 'uz' | 'en';
export type BodyType = 'moon' | 'mars' | 'deepspace';
export type RelicStatus = 'ACTIVE' | 'PARTIAL' | 'OFFLINE';

export interface BiText {
  uz: string;
  en: string;
}

export interface CatalogItem {
  id: string;
  deepId?: string;
  body: BodyType;
  lat?: number;
  lon?: number;
  au?: number;
  angle?: number;
  planet?: string;
  year: number;
  endYear: number | null;
  status: RelicStatus;
  icon: string;
  kind: BiText;
  name: BiText;
  site: BiText;
  story: BiText;
  fact: BiText;
  nasaQuery: string;
}

export interface SurfaceFeature {
  name: BiText;
  lat: number;
  lon: number;
  rx: number;
  ry: number;
  dark?: boolean;
  crater?: boolean;
  basin?: boolean;
  volcano?: boolean;
  canyon?: boolean;
  minor?: boolean;
}

export const STATUS_LABELS: Record<RelicStatus, BiText> = {
  ACTIVE: { uz: 'FAOL', en: 'ACTIVE' },
  PARTIAL: { uz: 'QISMAN', en: 'PARTIAL' },
  OFFLINE: { uz: 'O‘CHGAN', en: 'OFFLINE' }
};

export const BODY_LABELS: Record<BodyType, BiText> = {
  moon: { uz: '🌙 Oy', en: '🌙 Moon' },
  mars: { uz: '🔴 Mars', en: '🔴 Mars' },
  deepspace: { uz: '🌌 Ochiq koinot', en: '🌌 Deep Space' }
};

export const STATUS_HEX: Record<RelicStatus, string> = {
  ACTIVE: '#34d399',
  PARTIAL: '#fbbf24',
  OFFLINE: '#fb7185'
};

export const CATALOG_DATA: CatalogItem[] = [
  // ------------------------------- THE MOON -------------------------------
  {
    id: 'cat-apollo15', deepId: 'apollo-lrv', body: 'moon', lat: 26.13, lon: 3.63,
    year: 1971, endYear: 1971, status: 'PARTIAL', icon: '🚙',
    kind: { uz: 'Oy avtomobili', en: 'Lunar rover' },
    name: { uz: 'Apollo 15 Oy Baggisi (LRV-1)', en: 'Apollo 15 Lunar Rover (LRV-1)' },
    site: { uz: 'Hadli-Apennin vodiysi', en: 'Hadley–Apennine' },
    story: {
      uz: "Men Oyda haydalgan birinchi mashinaman! Astronavtlar meni 27.8 km haydab, 4 milliard yillik «Ibtido toshi»ni topishdi.",
      en: "I'm the first car ever driven on the Moon! Astronauts drove me 27.8 km and found the 4-billion-year-old 'Genesis Rock'."
    },
    fact: {
      uz: "Oyda shamol ham, yomg‘ir ham yo‘q — shuning uchun g‘ildirak izlarim 55 yildan beri o‘chmagan.",
      en: "There is no wind or rain on the Moon, so my tire tracks are still there after 55 years."
    },
    nasaQuery: 'Apollo 15 Lunar Rover'
  },
  {
    id: 'cat-surveyor3', deepId: 'surveyor-lrrr', body: 'moon', lat: -3.01, lon: -23.42,
    year: 1967, endYear: null, status: 'ACTIVE', icon: '🪞',
    kind: { uz: 'Qo‘nuvchi zond + lazer oynasi', en: 'Lander + laser mirror' },
    name: { uz: 'Surveyor 3 va Lazer Reflektori', en: 'Surveyor 3 & Laser Retroreflector' },
    site: { uz: 'Bo‘ronlar okeani', en: 'Oceanus Procellarum' },
    story: {
      uz: "1967-yilda Oyga qo‘nib, tuproqni qazib ko‘rdim. Ikki yildan keyin Apollo 12 astronavtlari oldimga piyoda kelib, kameramni Yerga olib ketishdi!",
      en: "I landed in 1967 and dug the lunar soil. Two years later, Apollo 12 astronauts walked over and took my camera home to Earth!"
    },
    fact: {
      uz: "Apollo oynalari batareyasiz ishlaydi — olimlar bugun ham ularga lazer otib, Oy har yili 3.8 sm uzoqlashayotganini o‘lchashadi.",
      en: "The Apollo mirrors need no battery — scientists still bounce lasers off them and measure the Moon drifting 3.8 cm away each year."
    },
    nasaQuery: 'Surveyor 3 Apollo 12'
  },
  {
    id: 'cat-apollo11', body: 'moon', lat: 0.674, lon: 23.473,
    year: 1969, endYear: null, status: 'PARTIAL', icon: '🦅',
    kind: { uz: 'Oy moduli qo‘nish bosqichi', en: 'Lunar Module descent stage' },
    name: { uz: 'Apollo 11 «Eagle» qo‘nish bosqichi', en: 'Apollo 11 "Eagle" Descent Stage' },
    site: { uz: 'Tinchlik bazasi, Tinchlik dengizi', en: 'Tranquility Base, Mare Tranquillitatis' },
    story: {
      uz: "1969-yil 20-iyulda Nil Armstrong va Bazz Oldrin aynan mening narvonimdan tushib, Oyga qadam qo‘yishdi. Ular ketganda men uchish maydonchasi bo‘lib qoldim — oyoqlarim hali ham o‘sha yerda turibdi!",
      en: "On July 20, 1969, Neil Armstrong and Buzz Aldrin climbed down my ladder onto the Moon. When they left, I became their launch pad — my legs are still standing there!"
    },
    fact: {
      uz: "Oyog‘imdagi lavhada «Biz butun insoniyat nomidan tinchlik bilan keldik» deb yozilgan. Yonimdagi lazer oynasi esa hali ham ishlaydi!",
      en: "My leg carries a plaque: 'We came in peace for all mankind.' The laser mirror next to me still works today!"
    },
    nasaQuery: 'Apollo 11 Lunar Module Eagle'
  },
  {
    id: 'cat-apollo14', body: 'moon', lat: -3.645, lon: -17.471,
    year: 1971, endYear: null, status: 'PARTIAL', icon: '⛳',
    kind: { uz: 'Qo‘nish bosqichi + MET aravacha', en: 'Descent stage + MET cart' },
    name: { uz: 'Apollo 14 «Antares» va golf to‘plari', en: 'Apollo 14 "Antares" & the Moon Golf Balls' },
    site: { uz: 'Fra Mauro tepaliklari', en: 'Fra Mauro highlands' },
    story: {
      uz: "Astronavt Alan Shepard Oyda golf o‘ynagan yagona odam! U ikkita golf to‘pini urgan — ular hali ham Oy changida yotibdi. Yonimda qo‘lda tortiladigan aravacha (MET) ham qolgan.",
      en: "Astronaut Alan Shepard is the only person to play golf on the Moon! He hit two golf balls — they still lie in the lunar dust, next to the hand-pulled cart (MET) left behind."
    },
    fact: {
      uz: "Oyda tortishish kuchi Yerdagidan 6 marta kuchsiz, shuning uchun to‘p ancha uzoqqa va sekin uchadi.",
      en: "Lunar gravity is 6 times weaker than Earth's, so a golf ball flies farther and floats longer."
    },
    nasaQuery: 'Apollo 14 Shepard'
  },
  {
    id: 'cat-apollo16', body: 'moon', lat: -8.973, lon: 15.5,
    year: 1972, endYear: 1972, status: 'OFFLINE', icon: '🏎️',
    kind: { uz: 'Oy avtomobili', en: 'Lunar rover' },
    name: { uz: 'Apollo 16 Oy Baggisi (LRV-2)', en: 'Apollo 16 Lunar Rover (LRV-2)' },
    site: { uz: 'Dekart tog‘liklari', en: 'Descartes Highlands' },
    story: {
      uz: "Men Oydagi «Gran-pri» sinovida 17 km/soat tezlikka erishdim! Astronavt Charli Dyuk yonimda o‘z oilasining suratini qoldirib ketgan.",
      en: "I hit 17 km/h in a 'Grand Prix' test drive on the Moon! Astronaut Charlie Duke left a photo of his family on the ground near me."
    },
    fact: {
      uz: "Suratning orqasida «Bu — Yer sayyorasidan astronavt Dyukning oilasi» deb yozilgan.",
      en: "The back of the photo reads: 'This is the family of Astronaut Duke from Planet Earth.'"
    },
    nasaQuery: 'Apollo 16 Lunar Rover'
  },
  {
    id: 'cat-apollo17', body: 'moon', lat: 20.191, lon: 30.772,
    year: 1972, endYear: 1972, status: 'OFFLINE', icon: '🛞',
    kind: { uz: 'Oy avtomobili', en: 'Lunar rover' },
    name: { uz: 'Apollo 17 Oy Baggisi (LRV-3)', en: 'Apollo 17 Lunar Rover (LRV-3)' },
    site: { uz: 'Taurus-Littrou vodiysi', en: 'Taurus–Littrow Valley' },
    story: {
      uz: "Men Oydagi so‘nggi odamlar — Yujin Sernan va Xarrison Shmittni 35 km yo‘lga olib yurdim. 1972-yildan beri u yerga hech kim qadam qo‘ymagan — Artemis missiyalari buni o‘zgartirmoqchi!",
      en: "I carried the last humans on the Moon, Gene Cernan and Harrison Schmitt, for 35 km. Nobody has walked there since 1972 — Artemis missions plan to change that!"
    },
    fact: {
      uz: "Qanotim sinib qolganda astronavtlar uni xarita varaqlari va skotch bilan tuzatishgan!",
      en: "When my fender broke, the astronauts fixed it with maps and duct tape!"
    },
    nasaQuery: 'Apollo 17 Lunar Rover'
  },
  {
    id: 'cat-surveyor1', body: 'moon', lat: -2.474, lon: -43.339,
    year: 1966, endYear: 1967, status: 'OFFLINE', icon: '📷',
    kind: { uz: 'Robot qo‘nuvchi zond', en: 'Robotic lander' },
    name: { uz: 'Surveyor 1', en: 'Surveyor 1' },
    site: { uz: 'Bo‘ronlar okeani (Flemstid yaqini)', en: 'Oceanus Procellarum (near Flamsteed)' },
    story: {
      uz: "Men Oyga yumshoq qo‘ngan birinchi Amerika robotiman (1966). Oy yuzasi qattiq ekanini — u yerga odamlar xavfsiz qo‘nishi mumkinligini isbotladim.",
      en: "I was America's first robot to soft-land on the Moon (1966). I proved the ground was firm enough for astronauts to land safely."
    },
    fact: {
      uz: "Men Yerga 11 000 dan ortiq surat yubordim.",
      en: "I sent more than 11,000 photos back to Earth."
    },
    nasaQuery: 'Surveyor 1 Moon'
  },
  {
    id: 'cat-ranger7', body: 'moon', lat: -10.63, lon: -20.68,
    year: 1964, endYear: 1964, status: 'OFFLINE', icon: '💥',
    kind: { uz: 'Urilib tushuvchi zond', en: 'Impactor probe' },
    name: { uz: 'Ranger 7', en: 'Ranger 7' },
    site: { uz: 'Ma’lum dengiz (Mare Cognitum)', en: 'Mare Cognitum (the "Known Sea")' },
    story: {
      uz: "Men Oyga to‘g‘ridan-to‘g‘ri uchib borib urildim — lekin so‘nggi 17 daqiqada Yerga 4 308 ta yaqin surat yubordim! Bu Oyni yaqindan ko‘rsatgan ilk Amerika suratlari edi.",
      en: "I flew straight into the Moon on purpose — but in my last 17 minutes I beamed back 4,308 close-up photos, America's first close look at the Moon!"
    },
    fact: {
      uz: "Men urilgan joy «Ma’lum dengiz» deb nomlandi — chunki endi u juda yaxshi ma’lum edi!",
      en: "My crash site was named Mare Cognitum, the 'Known Sea', because now it was well known!"
    },
    nasaQuery: 'Ranger 7 Moon'
  },
  {
    id: 'cat-lcross', body: 'moon', lat: -84.68, lon: -48.7,
    year: 2009, endYear: 2009, status: 'OFFLINE', icon: '💧',
    kind: { uz: 'Urilib tushuvchi zond', en: 'Impactor probe' },
    name: { uz: 'LCROSS', en: 'LCROSS' },
    site: { uz: 'Kabeus krateri, janubiy qutb', en: 'Cabeus Crater, south pole' },
    story: {
      uz: "2009-yilda men va raketa bosqichim ataylab abadiy qorong‘i kraterga urildik. Ko‘tarilgan chang ichida olimlar SUV MUZINI topishdi!",
      en: "In 2009, my rocket stage and I crashed on purpose into a permanently dark crater. In the dust plume, scientists found WATER ICE!"
    },
    fact: {
      uz: "Bu muz kelajakda Artemis astronavtlari uchun ichimlik suvi va raketa yoqilg‘isi bo‘lishi mumkin.",
      en: "That ice could someday become drinking water and rocket fuel for Artemis astronauts."
    },
    nasaQuery: 'LCROSS impact'
  },
  {
    id: 'cat-prospector', body: 'moon', lat: -87.7, lon: 42.1,
    year: 1998, endYear: 1999, status: 'OFFLINE', icon: '🕊️',
    kind: { uz: 'Orbital zond (urilgan)', en: 'Orbiter (crashed)' },
    name: { uz: 'Lunar Prospector', en: 'Lunar Prospector' },
    site: { uz: 'Shoumeyker krateri, janubiy qutb', en: 'Shoemaker Crater, south pole' },
    story: {
      uz: "Men Oy atrofida aylanib, qutblarda vodorod — ya’ni muz belgilarini topdim. Missiya oxirida meni ataylab qutbdagi kraterga yo‘naltirishdi.",
      en: "I orbited the Moon and found hydrogen at the poles — a sign of ice. At the end of my mission I was steered into a polar crater."
    },
    fact: {
      uz: "Bortimda olim Yujin Shoumeykerning xoki bor edi — u Oyga «dafn etilgan» yagona inson.",
      en: "I carried the ashes of scientist Eugene Shoemaker — the only person ever laid to rest on the Moon."
    },
    nasaQuery: 'Lunar Prospector'
  },
  {
    id: 'cat-grail', body: 'moon', lat: 75.62, lon: -26.63,
    year: 2011, endYear: 2012, status: 'OFFLINE', icon: '👯',
    kind: { uz: 'Egizak orbital zondlar', en: 'Twin orbiters' },
    name: { uz: 'GRAIL «Ebb» va «Flow»', en: 'GRAIL "Ebb" & "Flow"' },
    site: { uz: 'Salli Rayd urilish joyi, shimoliy qutb yaqini', en: 'Sally K. Ride Impact Site, near north pole' },
    story: {
      uz: "Biz egizak zondlarmiz! Bir-birimiz orasidagi masofani o‘lchab, Oyning tortishish xaritasini tuzdik. 2012-yilda tog‘ yonbag‘riga birin-ketin urildik.",
      en: "We were twin spacecraft! By measuring the distance between us, we mapped the Moon's gravity. In 2012 we crashed into a mountain one after the other."
    },
    fact: {
      uz: "MoonKAM kameramiz orqali maktab o‘quvchilari Oyning qaysi joyini suratga olishni o‘zlari tanlashgan!",
      en: "Through our MoonKAM cameras, middle-school students chose which parts of the Moon to photograph!"
    },
    nasaQuery: 'GRAIL Ebb Flow'
  },

  // -------------------------------- MARS ---------------------------------
  {
    id: 'cat-opportunity', deepId: 'opportunity-rover', body: 'mars', lat: -2.05, lon: -5.53,
    year: 2004, endYear: 2018, status: 'OFFLINE', icon: '🤖',
    kind: { uz: 'Marsoxod', en: 'Mars rover' },
    name: { uz: 'Opportunity («Oppi»)', en: 'Opportunity ("Oppy")' },
    site: { uz: 'Matonat vodiysi, Endeavour krateri', en: 'Perseverance Valley, Endeavour Crater' },
    story: {
      uz: "Meni 90 kun ishlaydi deyishgandi, men esa 15 yil ishladim va 45 km marafon masofasini bosib o‘tdim! Marsda qadimda suv bo‘lganini isbotladim.",
      en: "They expected me to last 90 days — I worked for 15 years and drove a 45 km marathon! I proved Mars once had water."
    },
    fact: {
      uz: "Mars shamollari quyosh panellarimni changdan tozalab, umrimni 60 barobar uzaytirgan.",
      en: "Lucky Martian wind gusts kept cleaning dust off my solar panels, stretching my life 60-fold."
    },
    nasaQuery: 'Opportunity Rover Mars'
  },
  {
    id: 'cat-ingenuity', deepId: 'ingenuity-heli', body: 'mars', lat: 18.44, lon: 77.45,
    year: 2021, endYear: 2024, status: 'PARTIAL', icon: '🚁',
    kind: { uz: 'Mars vertolyoti', en: 'Mars helicopter' },
    name: { uz: 'Ingenuity («Jinni»)', en: 'Ingenuity ("Ginny")' },
    site: { uz: 'Valinor tepaliklari, Jezero krateri', en: 'Valinor Hills, Jezero Crater' },
    story: {
      uz: "Men boshqa sayyorada uchgan birinchi vertolyotman! 5 marta uchishim kerak edi — 72 marta uchdim.",
      en: "I'm the first aircraft to fly on another planet! I was meant to fly 5 times — I flew 72."
    },
    fact: {
      uz: "Bortimda aka-uka Raytlarning 1903-yilgi samolyotidan kichkina mato bo‘lagi bor.",
      en: "I carry a tiny swatch of fabric from the Wright brothers' 1903 airplane."
    },
    nasaQuery: 'Ingenuity Mars Helicopter'
  },
  {
    id: 'cat-viking1', body: 'mars', lat: 22.27, lon: -47.95,
    year: 1976, endYear: 1982, status: 'OFFLINE', icon: '🛸',
    kind: { uz: 'Mars qo‘nuvchi zondi', en: 'Mars lander' },
    name: { uz: 'Viking 1', en: 'Viking 1' },
    site: { uz: 'Krayse tekisligi (Chryse Planitia)', en: 'Chryse Planitia' },
    story: {
      uz: "1976-yilda men Mars yuzasidan olingan birinchi suratni Yerga yubordim! Olti yil davomida Mars ob-havosini o‘lchab, tuproqda hayot izlarini qidirdim.",
      en: "In 1976, I sent the very first photo from the surface of Mars! For six years I measured Martian weather and searched the soil for signs of life."
    },
    fact: {
      uz: "Mars osmoni ko‘k emas, balki pushti-sarg‘ish rangda ekanini dunyoga men ko‘rsatganman.",
      en: "I showed the world that the Martian sky is butterscotch-pink, not blue."
    },
    nasaQuery: 'Viking 1 lander Mars'
  },
  {
    id: 'cat-viking2', body: 'mars', lat: 47.64, lon: 134.29,
    year: 1976, endYear: 1980, status: 'OFFLINE', icon: '❄️',
    kind: { uz: 'Mars qo‘nuvchi zondi', en: 'Mars lander' },
    name: { uz: 'Viking 2', en: 'Viking 2' },
    site: { uz: 'Utopiya tekisligi', en: 'Utopia Planitia' },
    story: {
      uz: "Men Marsning shimoliy tekisligiga qo‘ndim va qishda yer yuzasini yupqa oq qirov qoplaganini suratga oldim.",
      en: "I landed on Mars's northern plains and photographed a thin layer of white frost covering the ground in winter."
    },
    fact: {
      uz: "Men 1980-yilgacha — 3.5 yildan ko‘proq ishladim, batareyam ishdan chiqqach jim bo‘lib qoldim.",
      en: "I worked until 1980 — over 3.5 years — until my batteries failed."
    },
    nasaQuery: 'Viking 2 Utopia Planitia'
  },
  {
    id: 'cat-sojourner', body: 'mars', lat: 19.13, lon: -33.22,
    year: 1997, endYear: 1997, status: 'OFFLINE', icon: '🧸',
    kind: { uz: 'Birinchi marsoxod + qo‘nuvchi', en: 'First rover + lander' },
    name: { uz: 'Mars Pathfinder va Sojourner', en: 'Mars Pathfinder & Sojourner' },
    site: { uz: 'Ares vodiysi', en: 'Ares Vallis' },
    story: {
      uz: "Men — Sojourner, boshqa sayyoradagi birinchi marsoxodman! Hajmim mikroto‘lqinli pechdek, og‘irligim atigi 11.5 kg. Biz havo yostiqlariga o‘ralib, Mars bo‘ylab sakrab-sakrab qo‘nganmiz!",
      en: "I'm Sojourner, the first rover on another planet! I'm about the size of a microwave oven and weigh just 11.5 kg. We landed by bouncing across Mars wrapped in airbags!"
    },
    fact: {
      uz: "Mening ismimni 12 yoshli qizcha Valeri Ambruaz insho tanlovida taklif qilgan.",
      en: "My name was suggested by 12-year-old Valerie Ambroise in a student essay contest."
    },
    nasaQuery: 'Sojourner rover Pathfinder'
  },
  {
    id: 'cat-spirit', body: 'mars', lat: -14.57, lon: 175.47,
    year: 2004, endYear: 2010, status: 'OFFLINE', icon: '🔧',
    kind: { uz: 'Marsoxod', en: 'Mars rover' },
    name: { uz: 'Spirit (MER-A)', en: 'Spirit (MER-A)' },
    site: { uz: 'Gusev krateri, «Troya» qumligi', en: '"Troy", Gusev Crater' },
    story: {
      uz: "Men Opportunity’ning egizagiman. 2009-yilda yumshoq qumga botib qoldim va o‘sha yerda qimirlamaydigan laboratoriyaga aylandim. Oxirgi signalim 2010-yilda kelgan.",
      en: "I'm Opportunity's twin. In 2009 I got stuck in soft sand and became a stationary science lab. My last signal came in 2010."
    },
    fact: {
      uz: "Singan g‘ildiragimni sudrab yurganimda u tuproqni tirnab, qadimiy issiq buloqlar izi — oppoq kremniy qatlamini ochib qo‘ydi!",
      en: "My broken wheel dragged through the soil and dug up bright white silica — a clue to ancient hot springs!"
    },
    nasaQuery: 'Spirit rover Mars'
  },
  {
    id: 'cat-phoenix', body: 'mars', lat: 68.22, lon: -125.75,
    year: 2008, endYear: 2008, status: 'OFFLINE', icon: '🧊',
    kind: { uz: 'Qutb qo‘nuvchi zondi', en: 'Polar lander' },
    name: { uz: 'Phoenix', en: 'Phoenix' },
    site: { uz: 'Shimoliy qutb tekisligi (Vastitas Borealis)', en: 'Vastitas Borealis, arctic plains' },
    story: {
      uz: "Men Marsning shimoliy qutbiga qo‘nib, robot qo‘lim bilan tuproq ostidagi haqiqiy suv muzini qazib topdim! Hatto bulutlardan qor yog‘ayotganini ham ko‘rdim.",
      en: "I landed in Mars's arctic, dug with my robotic arm, and touched real water ice under the soil! I even saw snow falling from the clouds."
    },
    fact: {
      uz: "Bortimda Mars haqidagi kitob va rasmlar yozilgan DVD bor — bu boshqa sayyoradagi birinchi kutubxona!",
      en: "I carry a DVD of Mars stories and art called 'Visions of Mars' — the first library on another planet!"
    },
    nasaQuery: 'Phoenix Mars Lander'
  },
  {
    id: 'cat-insight', body: 'mars', lat: 4.5, lon: 135.62,
    year: 2018, endYear: 2022, status: 'OFFLINE', icon: '🎧',
    kind: { uz: 'Seysmik stansiya', en: 'Seismic station' },
    name: { uz: 'InSight', en: 'InSight' },
    site: { uz: 'Elizium tekisligi', en: 'Elysium Planitia' },
    story: {
      uz: "Men Marsning «yurak urishini» tinglovchi stansiyaman. Seysmometrim 1 300 dan ortiq «mars-zilzila»ni yozib oldi va Mars yadrosining kattaligini o‘lchadi.",
      en: "I was Mars's stethoscope! My seismometer recorded over 1,300 marsquakes and measured the size of Mars's core."
    },
    fact: {
      uz: "2022-yilda quyosh panellarimni chang qoplab, Yerga oxirgi xabarimni yubordim.",
      en: "In 2022, dust covered my solar panels and I sent my final message to Earth."
    },
    nasaQuery: 'InSight lander Mars'
  },
  {
    id: 'cat-curiosity', body: 'mars', lat: -4.59, lon: 137.44,
    year: 2012, endYear: null, status: 'ACTIVE', icon: '🔬',
    kind: { uz: 'Yadro quvvatli marsoxod', en: 'Nuclear-powered rover' },
    name: { uz: 'Curiosity', en: 'Curiosity' },
    site: { uz: 'Geyl krateri, Sharp tog‘i', en: 'Gale Crater, Mount Sharp' },
    story: {
      uz: "Men avtomobil kattaligidagi marsoxodman va 2026-yilda ham ishlayapman! Plutoniy batareyam kechayu kunduz quvvat beradi, men esa Sharp tog‘iga chiqib, qadimgi ko‘l izlarini o‘rganyapman.",
      en: "I'm a car-sized rover and still working in 2026! My plutonium power source runs day and night as I climb Mount Sharp studying an ancient lake."
    },
    fact: {
      uz: "2013-yilda Marsdagi birinchi «tug‘ilgan kunim»da asbobimni titratib, o‘zimga «Happy Birthday» qo‘shig‘ini kuylaganman!",
      en: "On my first landing anniversary in 2013, I vibrated an instrument to hum 'Happy Birthday' to myself!"
    },
    nasaQuery: 'Curiosity rover selfie'
  },
  {
    id: 'cat-perseverance', body: 'mars', lat: 18.52, lon: 77.3,
    year: 2021, endYear: null, status: 'ACTIVE', icon: '🧪',
    kind: { uz: 'Namuna yig‘uvchi marsoxod', en: 'Sample-collecting rover' },
    name: { uz: 'Perseverance', en: 'Perseverance' },
    site: { uz: 'Jezero krateri cheti', en: 'Jezero Crater rim' },
    story: {
      uz: "Men qadimiy daryo deltasida tosh namunalarini yig‘yapman va 2026-yilda ham faolman. «Uch ayri» (Three Forks) degan joyda 10 ta namuna probirkasini ataylab qoldirdim — kelajakda ular Yerga olib kelinishi mumkin!",
      en: "I'm collecting rock samples in an ancient river delta and still active in 2026. I deliberately left 10 sample tubes at 'Three Forks' so a future mission could bring them to Earth!"
    },
    fact: {
      uz: "Mikrofonlarim orqali Mars shamolining haqiqiy ovozini yozib olganman.",
      en: "My microphones recorded the real sound of wind on Mars."
    },
    nasaQuery: 'Perseverance rover'
  },
  {
    id: 'cat-mpl', body: 'mars', lat: -76.57, lon: 165.2,
    year: 1999, endYear: 1999, status: 'OFFLINE', icon: '❓',
    kind: { uz: 'Yo‘qolgan qo‘nuvchi', en: 'Lost lander' },
    name: { uz: 'Mars Polar Lander', en: 'Mars Polar Lander' },
    site: { uz: 'Janubiy qutb hududi (taxminiy)', en: 'South polar terrain (estimated)' },
    story: {
      uz: "1999-yilda qo‘nish paytida aloqa uzildi va meni hech kim topa olmadi. Ehtimol, oyoqlarim ochilgandagi silkinishni sensorim «qo‘ndim» deb o‘ylab, dvigatellarni 40 metr balandlikda o‘chirib qo‘ygan.",
      en: "In 1999 contact was lost during landing and I was never found. Most likely my sensor mistook the jolt of my legs deploying for touchdown and shut off my engines 40 m up."
    },
    fact: {
      uz: "Muhandislar bu xatodan saboq olib, Phoenix zondi dasturini tuzatishdi — xatolar ham fan uchun dars!",
      en: "Engineers learned from this mistake and fixed the software for Phoenix — failures teach science too!"
    },
    nasaQuery: 'Mars Polar Lander'
  },

  // ----------------------------- DEEP SPACE ------------------------------
  {
    id: 'cat-voyager1', deepId: 'voyager-1', body: 'deepspace', au: 166.4, angle: 255,
    year: 1977, endYear: null, status: 'ACTIVE', icon: '📀',
    kind: { uz: 'Yulduzlararo zond', en: 'Interstellar probe' },
    name: { uz: 'Voyager 1', en: 'Voyager 1' },
    site: { uz: 'Yulduzlararo fazo (Ilonchi turkumi tomon)', en: 'Interstellar space (toward Ophiuchus)' },
    story: {
      uz: "Men insoniyat yaratgan eng uzoq apparatman va 2026-yilda ham Yerga signal yuboryapman! 2012-yilda Quyosh «pufagi»dan chiqib, yulduzlararo fazoga kirdim.",
      en: "I'm the farthest human-made object, still sending signals in 2026! In 2012 I left the Sun's bubble and entered interstellar space."
    },
    fact: {
      uz: "Bortimda 55 tildagi salomlashuv, musiqa va Yer tovushlari yozilgan Oltin plastinka bor.",
      en: "I carry the Golden Record with greetings in 55 languages, music and the sounds of Earth."
    },
    nasaQuery: 'Voyager 1 Golden Record'
  },
  {
    id: 'cat-pioneer10', deepId: 'pioneer-10', body: 'deepspace', au: 137.4, angle: 72,
    year: 1972, endYear: 2003, status: 'OFFLINE', icon: '🛰️',
    kind: { uz: 'Yulduzlararo zond', en: 'Interstellar probe' },
    name: { uz: 'Pioneer 10', en: 'Pioneer 10' },
    site: { uz: 'Aldebaran yulduzi tomon', en: 'Toward the star Aldebaran' },
    story: {
      uz: "Men Asteroidlar belbog‘idan o‘tgan va Yupiterga yetgan birinchi kemaman. Oxirgi signalim 2003-yilda kelgan.",
      en: "I was the first spacecraft to cross the asteroid belt and visit Jupiter. My last signal arrived in 2003."
    },
    fact: {
      uz: "Aldebaran yulduzigacha yetib borishim uchun taxminan 2 million yil kerak!",
      en: "It will take me about 2 million years to reach Aldebaran!"
    },
    nasaQuery: 'Pioneer 10'
  },
  {
    id: 'cat-voyager2', body: 'deepspace', au: 143, angle: 300,
    year: 1977, endYear: null, status: 'ACTIVE', icon: '🪐',
    kind: { uz: 'Yulduzlararo zond', en: 'Interstellar probe' },
    name: { uz: 'Voyager 2', en: 'Voyager 2' },
    site: { uz: 'Yulduzlararo fazo (Tovus turkumi tomon)', en: 'Interstellar space (toward Pavo)' },
    story: {
      uz: "Men Uran va Neptunga tashrif buyurgan yagona kemaman! 2018-yilda yulduzlararo fazoga kirdim va energiyani tejash uchun ba’zi asboblarimni o‘chirib, hamon ishlayapman.",
      en: "I'm the only spacecraft ever to visit Uranus and Neptune! I entered interstellar space in 2018 and keep working by switching off instruments to save power."
    },
    fact: {
      uz: "Qizig‘i, men Voyager 1 dan 16 kun oldin uchirilganman!",
      en: "Fun twist: I actually launched 16 days before Voyager 1!"
    },
    nasaQuery: 'Voyager 2 Neptune'
  },
  {
    id: 'cat-pioneer11', body: 'deepspace', au: 117, angle: 280,
    year: 1973, endYear: 1995, status: 'OFFLINE', icon: '💫',
    kind: { uz: 'Yulduzlararo zond', en: 'Interstellar probe' },
    name: { uz: 'Pioneer 11', en: 'Pioneer 11' },
    site: { uz: 'Burgut (Aquila) turkumi tomon', en: 'Toward the constellation Aquila' },
    story: {
      uz: "Men Saturnga yetib borgan birinchi kemaman (1979)! Yupiter va Saturn yonidan o‘tib, koinot qa’riga yo‘l oldim. 1995-yilda quvvatim susayib, jim bo‘lib qoldim.",
      en: "I was the first spacecraft to reach Saturn (1979)! After Jupiter and Saturn I headed into deep space. In 1995 my power faded and I fell silent."
    },
    fact: {
      uz: "Men ham Pioneer 10 kabi odamlar surati va Yerning manzili chizilgan oltin plastinkani olib ketyapman.",
      en: "Like Pioneer 10, I carry a golden plaque showing humans and our address in space."
    },
    nasaQuery: 'Pioneer 11 Saturn'
  },
  {
    id: 'cat-newhorizons', body: 'deepspace', au: 64, angle: 288,
    year: 2006, endYear: null, status: 'ACTIVE', icon: '🚀',
    kind: { uz: 'Pluton zondi', en: 'Pluto probe' },
    name: { uz: 'New Horizons', en: 'New Horizons' },
    site: { uz: 'Koyper belbog‘i', en: 'Kuiper Belt' },
    story: {
      uz: "2015-yilda men Plutonning birinchi yaqin suratlarini oldim va u yerda ulkan yurak shaklidagi muzlik borligini ko‘rsatdim! Hozir Koyper belbog‘ida uchyapman.",
      en: "In 2015 I took the first close-up photos of Pluto and revealed a giant heart-shaped glacier! Now I'm flying through the Kuiper Belt."
    },
    fact: {
      uz: "Bortimda Plutonni kashf etgan astronom Klayd Tombo xokining bir qismi bor.",
      en: "I carry some of the ashes of Clyde Tombaugh, the astronomer who discovered Pluto."
    },
    nasaQuery: 'New Horizons Pluto'
  },
  {
    id: 'cat-galileo', body: 'deepspace', au: 5.2, angle: 35, planet: 'jupiter',
    year: 1989, endYear: 2003, status: 'OFFLINE', icon: '🟠',
    kind: { uz: 'Yupiter orbital zondi', en: 'Jupiter orbiter' },
    name: { uz: 'Galileo', en: 'Galileo' },
    site: { uz: 'Yupiter atmosferasi ichida', en: "Inside Jupiter's atmosphere" },
    story: {
      uz: "Men 8 yil Yupiter atrofida aylandim. 2003-yilda meni ataylab Yupiterga sho‘ng‘itishdi — Yevropa yo‘ldoshidagi muzli okeanni Yer mikroblaridan himoya qilish uchun.",
      en: "I orbited Jupiter for 8 years. In 2003 I was deliberately sent into Jupiter to protect the icy ocean moon Europa from Earth germs."
    },
    fact: {
      uz: "Men Yevropa muzi ostida ulkan sho‘r okean borligiga dalil topdim.",
      en: "I found evidence of a huge salty ocean under Europa's ice."
    },
    nasaQuery: 'Galileo spacecraft Jupiter'
  },
  {
    id: 'cat-cassini', body: 'deepspace', au: 9.5, angle: 145, planet: 'saturn',
    year: 1997, endYear: 2017, status: 'OFFLINE', icon: '💍',
    kind: { uz: 'Saturn orbital zondi', en: 'Saturn orbiter' },
    name: { uz: 'Cassini (va Huygens)', en: 'Cassini (& Huygens)' },
    site: { uz: 'Saturn atmosferasi / Titan yuzasi', en: "Saturn's atmosphere / Titan's surface" },
    story: {
      uz: "Men 13 yil Saturn va uning halqalarini o‘rgandim, so‘ng 2017-yilda «Buyuk final» bilan Saturnga sho‘ng‘idim. Hamrohim — ESA ning Huygens zondi esa hamon Titan yo‘ldoshi yuzasida yotibdi!",
      en: "I studied Saturn and its rings for 13 years, then dove into Saturn in a 2017 'Grand Finale'. My partner, ESA's Huygens probe, still sits on the surface of the moon Titan!"
    },
    fact: {
      uz: "Men Enselad yo‘ldoshidan koinotga suv favvoralari otilib chiqayotganini kashf qildim.",
      en: "I discovered water geysers shooting into space from the moon Enceladus."
    },
    nasaQuery: 'Cassini Saturn'
  }
];

export const MOON_FEATURES: SurfaceFeature[] = [
  { name: { uz: 'Bo‘ronlar okeani', en: 'Oceanus Procellarum' }, lat: 18.4, lon: -57.4, rx: 22, ry: 24, dark: true },
  { name: { uz: 'Yomg‘irlar dengizi', en: 'Mare Imbrium' }, lat: 32.8, lon: -15.6, rx: 17, ry: 13, dark: true },
  { name: { uz: 'Osoyishtalik dengizi', en: 'Mare Serenitatis' }, lat: 28, lon: 17.5, rx: 10, ry: 9, dark: true },
  { name: { uz: 'Tinchlik dengizi', en: 'Mare Tranquillitatis' }, lat: 8.5, lon: 31.4, rx: 12, ry: 9, dark: true },
  { name: { uz: 'Inqirozlar dengizi', en: 'Mare Crisium' }, lat: 17, lon: 59.1, rx: 7, ry: 5.5, dark: true },
  { name: { uz: 'Serhosillik dengizi', en: 'Mare Fecunditatis' }, lat: -7.8, lon: 51.3, rx: 8, ry: 9, dark: true },
  { name: { uz: 'Nektar dengizi', en: 'Mare Nectaris' }, lat: -15.2, lon: 35.5, rx: 5, ry: 5, dark: true },
  { name: { uz: 'Bulutlar dengizi', en: 'Mare Nubium' }, lat: -21.3, lon: -16.6, rx: 10, ry: 8, dark: true },
  { name: { uz: 'Namlik dengizi', en: 'Mare Humorum' }, lat: -24.4, lon: -38.6, rx: 5, ry: 5, dark: true },
  { name: { uz: 'Sovuq dengizi', en: 'Mare Frigoris' }, lat: 56, lon: 1.4, rx: 30, ry: 4, dark: true },
  { name: { uz: 'Sharq dengizi', en: 'Mare Orientale' }, lat: -19.4, lon: -92.8, rx: 5, ry: 5, dark: true },
  { name: { uz: 'Moskva dengizi', en: 'Mare Moscoviense' }, lat: 27.3, lon: 147.9, rx: 4, ry: 4, dark: true },
  { name: { uz: 'Tixo krateri', en: 'Tycho crater' }, lat: -43.3, lon: -11.2, rx: 2.5, ry: 2.5, crater: true },
  { name: { uz: 'Kopernik krateri', en: 'Copernicus crater' }, lat: 9.6, lon: -20.1, rx: 2.8, ry: 2.8, crater: true },
  { name: { uz: 'Janubiy qutb – Aytken havzasi', en: 'South Pole–Aitken Basin' }, lat: -53, lon: -169, rx: 22, ry: 16, basin: true }
];

export const MARS_FEATURES: SurfaceFeature[] = [
  { name: { uz: 'Olimp tog‘i (eng baland vulqon)', en: 'Olympus Mons (tallest volcano)' }, lat: 18.65, lon: -133.8, rx: 6, ry: 6, volcano: true },
  { name: { uz: 'Arsiya tog‘i', en: 'Arsia Mons' }, lat: -8.3, lon: -120.5, rx: 3, ry: 3, volcano: true, minor: true },
  { name: { uz: 'Pavonis tog‘i', en: 'Pavonis Mons' }, lat: 1.5, lon: -112.9, rx: 2.5, ry: 2.5, volcano: true, minor: true },
  { name: { uz: 'Askreus tog‘i', en: 'Ascraeus Mons' }, lat: 11.9, lon: -104.5, rx: 2.8, ry: 2.8, volcano: true, minor: true },
  { name: { uz: 'Elizium tog‘i', en: 'Elysium Mons' }, lat: 24.8, lon: 146.9, rx: 3, ry: 3, volcano: true },
  { name: { uz: 'Marineris vodiylari (4000 km kanyon)', en: 'Valles Marineris (4,000 km canyon)' }, lat: -13.9, lon: -59.2, rx: 28, ry: 2.5, canyon: true },
  { name: { uz: 'Ellada havzasi', en: 'Hellas Basin' }, lat: -42.4, lon: 70.5, rx: 17, ry: 11, basin: true },
  { name: { uz: 'Argir havzasi', en: 'Argyre Basin' }, lat: -49.7, lon: -43.4, rx: 8, ry: 6, basin: true },
  { name: { uz: 'Utopiya tekisligi', en: 'Utopia Planitia' }, lat: 49.7, lon: 118, rx: 20, ry: 10, dark: true },
  { name: { uz: 'Katta Sirt', en: 'Syrtis Major' }, lat: 8.4, lon: 69.5, rx: 8, ry: 12, dark: true },
  { name: { uz: 'Asidaliya tekisligi', en: 'Acidalia Planitia' }, lat: 46.7, lon: -22, rx: 16, ry: 10, dark: true },
  { name: { uz: 'Geyl krateri', en: 'Gale Crater' }, lat: -5.4, lon: 137.8, rx: 1.5, ry: 1.5, crater: true, minor: true },
  { name: { uz: 'Jezero krateri', en: 'Jezero Crater' }, lat: 18.38, lon: 77.58, rx: 1.2, ry: 1.2, crater: true, minor: true }
];

export const AU_KM = 149597870.7;
export const C_KMS = 299792.458;
export const XP_PER_QUIZ = 250;
export const XP_PER_EXPLORE = 50;

export const itemDistanceKm = (item: CatalogItem): number =>
  item.body === 'moon' ? 384400 : item.body === 'mars' ? 225000000 : (item.au || 1) * AU_KM;

export const itemLightSeconds = (item: CatalogItem): number =>
  itemDistanceKm(item) / C_KMS;

export const formatLightTime = (seconds: number, lang: Lang): string => {
  if (seconds < 60) return `${seconds.toFixed(2)} ${lang === 'uz' ? 'soniya' : 'sec'}`;
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return lang === 'uz' ? `${m} daqiqa ${s} soniya` : `${m} min ${s} s`;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return lang === 'uz' ? `${h} soat ${m} daqiqa` : `${h} h ${m} min`;
};

export const formatCoords = (item: CatalogItem): string => {
  if (item.body === 'deepspace') return `≈ ${item.au} AU`;
  const lat = item.lat ?? 0;
  const lon = item.lon ?? 0;
  const la = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lo = `${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`;
  return `${la}, ${lo}`;
};

export const RANKS = [
  { min: 0, icon: '🧑‍🚀', uz: 'Kosmik Kadet', en: 'Space Cadet' },
  { min: 500, icon: '🔭', uz: 'Relic Tadqiqotchisi', en: 'Relic Explorer' },
  { min: 1200, icon: '🛠️', uz: 'Missiya Muhandisi', en: 'Mission Engineer' },
  { min: 2200, icon: '🏆', uz: 'Bosh Relic Detektivi', en: 'Chief Relic Detective' }
];

export const getRank = (xp: number) => [...RANKS].reverse().find(r => xp >= r.min) || RANKS[0];
export const getNextRank = (xp: number) => RANKS.find(r => r.min > xp) || null;
