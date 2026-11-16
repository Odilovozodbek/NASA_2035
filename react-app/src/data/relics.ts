export interface BiLang { uz: string; en: string; }
export interface Hotspot { id: string; x: number; y: number; name: BiLang; health2026: number; statusType: 'ACTIVE' | 'PARTIAL' | 'OFFLINE'; engineering: BiLang; science: BiLang; }
export interface TimelineState { year: number; label: BiLang; power: number; dust: number; radiation: number; temp: string; log: BiLang; }
export interface RelicItem { id: string; region: 'moon' | 'mars' | 'deepspace'; name: BiLang; subtitle: BiLang; status: 'ACTIVE' | 'PARTIAL' | 'OFFLINE'; statusLabel: BiLang; launchYear: number; endYear: number; location: BiLang; distanceFromEarthKm: number; signalDelayText: BiLang; plannedDuration: BiLang; actualDuration: BiLang; nasaQuery: string; fallbackImages: Array<{ title: string; url: string; date: string }>; firstPersonIntro: BiLang; scienceSummary: BiLang; hotspots: Hotspot[]; timelineStates: TimelineState[]; quiz: { question: BiLang; options: BiLang[]; correctIndex: number; explanation: BiLang; }; }

// ============================================================================
// DATASET: 6 ICONIC NASA RELICS ACROSS THE MOON, MARS, AND DEEP SPACE
// ============================================================================
export const RELICS_DATA: RelicItem[] = [
  {
    id: 'apollo-lrv',
    region: 'moon',
    name: {
      uz: 'Apollo 15 Oy Elektromobili (LRV-1)',
      en: 'Apollo 15 Lunar Roving Vehicle (LRV-1)'
    },
    subtitle: {
      uz: 'Oydagi birinchi boshqariladigan "Oy Baggi" mashinasi',
      en: 'First Piloted "Moon Buggy" Left on the Lunar Surface'
    },
    status: 'PARTIAL', // ACTIVE, PARTIAL, OFFLINE
    statusLabel: {
      uz: 'PASSIV SAQLANGAN (Batareya 0%, Shassi 92%)',
      en: 'PASSIVELY INTACT (Battery 0%, Chassis 92%)'
    },
    launchYear: 1971,
    endYear: 1971,
    location: {
      uz: 'Hadley-Apennine vodiysi, Oy (26.13° N, 3.63° E)',
      en: 'Hadley-Apennine Valley, Moon (26.13° N, 3.63° E)'
    },
    distanceFromEarthKm: 384400,
    signalDelayText: { uz: '1.28 soniya (Yorug‘lik tezligida)', en: '1.28 sec (One-way Light Time)' },
    plannedDuration: { uz: '3 kun (78 soat)', en: '3 Days (78 hours)' },
    actualDuration: { uz: '27.8 km yo‘l / 55 yildan beri Oyda', en: '27.8 km Driven / 55 Years on Moon' },
    nasaQuery: 'Apollo 15 Lunar Rover',
    fallbackImages: [
      {
        title: 'Apollo 15 Lunar Roving Vehicle at Hadley Rille',
        url: 'https://images-assets.nasa.gov/image/as15-88-11901/as15-88-11901~orig.jpg',
        date: '1971-08-01'
      },
      {
        title: 'Astronaut Jim Irwin with Apollo 15 Rover',
        url: 'https://images-assets.nasa.gov/image/as15-86-11603/as15-86-11603~orig.jpg',
        date: '1971-07-31'
      }
    ],
    firstPersonIntro: {
      uz: "Salom, yosh muhandis! Men Apollo 15 ning Oy elektromobiliman. 1971-yilda Devid Skott va Jim Irvin meni Oy tog‘lari bo‘ylab 27.8 km haydashdi. Mening kumush-rux batareyalarim allaqachon tugagan bo‘lsa-da, Oyda havo va yomg‘ir yo‘qligi sababli po‘lat to‘rli g‘ildiraklarim hali ham Hadley Rille krateri yonida xuddi kechagidek turibdi!",
      en: "Greetings, young engineer! I am the Apollo 15 Lunar Roving Vehicle. In 1971, astronauts Dave Scott and Jim Irwin drove me 27.8 km across the lunar mountains. Although my silver-zinc batteries are long depleted, the Moon has no wind or rain—so my woven piano-wire wheels still sit near Hadley Rille waiting for future explorers!"
    },
    scienceSummary: {
      uz: "Apollo 15 roveri astronavtlarga qo‘nish modulidan uzoqqa borish imkonini berdi. Uning yordamida 77 kg Oy toshlari, jumladan, 4.1 milliard yillik mashhur 'Genesis Rock' (Ibtido toshi) topildi — bu Oyning qadimgi qobig‘i qanday paydo bo‘lganini isbotladi!",
      en: "The LRV allowed astronauts to travel far beyond walking distance from the Lunar Module. It enabled the collection of 77 kg of lunar samples, including the 4.1-billion-year-old 'Genesis Rock' (anorthosite), which revealed how the Moon's primordial crust formed!"
    },
    hotspots: [
      {
        id: 'wheels',
        x: 24,
        y: 72,
        name: { uz: 'Rux bilan qoplangan po‘lat to‘rli g‘ildiraklar', en: 'Zinc-Coated Woven Piano-Wire Mesh Wheels' },
        health2026: 92,
        statusType: 'ACTIVE',
        engineering: {
          uz: "Havo bilan shishiriladigan shinalar Oyda yorilib ketgan bo‘lardi. Shuning uchun NASA muhandislari titan chevarali va po‘lat simdan to‘qilgan g‘ildiraklar yasashdi. 2026-yilda ham ularning mexanik shakli 92% saqlangan.",
          en: "Rubber tires would burst or freeze on the Moon. NASA engineered flexible woven steel wire mesh wheels with titanium chevrons so it wouldn't sink in lunar dust. In 2026, their structure remains 92% intact."
        },
        science: {
          uz: "Yumshoq Oy regoliti (tuprog‘i) ustida cho‘kmasdan 14 km/soat tezlikda harakatlanish va tik qiyaliklarga chiqish imkonini berdi.",
          en: "Allowed traversal over fluffy lunar regolith at up to 14 km/h and climbing 12-degree mountain slopes at Mons Hadley."
        }
      },
      {
        id: 'battery',
        x: 48,
        y: 48,
        name: { uz: '36V Kumush-Rux (Ag-Zn) Batareyalar Bloki', en: 'Dual 36V Silver-Zinc (Ag-Zn) Battery Pack' },
        health2026: 0,
        statusType: 'OFFLINE',
        engineering: {
          uz: "Qayta quvvatlanmaydigan 2 ta 36 voltli kumush-rux batareyasi (har biri 121 Ah). 1971-yilda missiya yakunida quvvati tugagan va 55 yillik -170°C dan +120°C gacha harorat sikllarida kimyoviy parchalangan.",
          en: "Two non-rechargeable 36V silver-zinc batteries (121 Ah each). Depleted after the 1971 mission and chemically degraded after 55 years of extreme -170°C to +120°C lunar thermal cycles."
        },
        science: {
          uz: "Kosmik vakuumda elektromobillarni quvvatlantirish bo‘yicha ilk tarixiy tajriba bo‘lib, zamonaviy Artemis roverlari uchun asos bo‘ldi.",
          en: "Pioneered electric vehicle battery thermal management in a hard vacuum, laying the groundwork for NASA's upcoming Artemis Lunar Terrain Vehicle."
        }
      },
      {
        id: 'antenna',
        x: 34,
        y: 22,
        name: { uz: 'Soyabon ko‘rinishidagi Yuqori Sezgirlikdagi Antenna', en: 'Umbrella-Style High-Gain Dish Antenna' },
        health2026: 65,
        statusType: 'PARTIAL',
        engineering: {
          uz: "Oydan to‘g‘ridan-to‘g‘ri Yerga rangli TV signal uzatgan parabolik to‘rli antenna. Mikrometeoritlar va ultrabinafsha nurlar ta’sirida to‘ri qisman shikastlangan bo‘lsa-da, karkasi tik turibdi.",
          en: "Foldable parabolic mesh antenna that transmitted live color TV directly to Earth. Exposed to micrometeoroids for 55 years, the mesh has minor pitting, but the mast still stands."
        },
        science: {
          uz: "Yerdagi olimlarga astronavtlar bilan birga geologik qatlamlarni real vaqtda ko‘rish va qaysi toshni olishni maslahat berish imkonini yaratdi.",
          en: "Enabled geology scientists in Houston to view outcrops in real time and guide astronauts to the most scientifically valuable rocks."
        }
      },
      {
        id: 'camera',
        x: 68,
        y: 35,
        name: { uz: 'Masofadan boshqariladigan RCA Rangli TV Kamerasi', en: 'Remotely Controlled RCA Color TV Camera' },
        health2026: 15,
        statusType: 'OFFLINE',
        engineering: {
          uz: "Xyustondagi operatorlar Yerdan turib burishi mumkin bo‘lgan kamera. U Apollo 15 modulining Oydan uchib ketishini tarixda ilk bor tasvirga olgan! Linzasi kosmik radiatsiyadan qoraygan.",
          en: "Controlled remotely from Houston! It captured the first-ever live video of the Lunar Module blasting off from the Moon. Its glass optics have darkened over decades of solar radiation."
        },
        science: {
          uz: "Qo‘nish maydonining panoramali topografik va geologik arxivini Yerga uzatdi.",
          en: "Recorded panoramic geological surveys of the Hadley Rille volcanic channel and lunar highlands."
        }
      }
    ],
    timelineStates: [
      {
        year: 1971,
        label: { uz: '1971: Qo‘nish va 3 ta EVA sayohati', en: '1971: Landing & 3 Geological EVAs' },
        power: 100,
        dust: 5,
        radiation: 2,
        temp: '+105°C',
        log: {
          uz: 'Barcha tizimlar nominal. 27.8 km masofa bosib o‘tildi, 77 kg Oy namunasi yig‘ildi.',
          en: 'All systems nominal. 27.8 km traversed across Hadley-Apennine; 77 kg of lunar samples collected.'
        }
      },
      {
        year: 1995,
        label: { uz: '1995: 300 ta Oy kecha-kunduzi', en: '1995: 300 Lunar Day/Night Cycles' },
        power: 0,
        dust: 22,
        radiation: 48,
        temp: '-173°C',
        log: {
          uz: 'Batareyalar muzlagan. Har 14 kunda 290 graduslik harorat farqi plastik qismlarni mo‘rtlashtirdi.',
          en: 'Batteries frozen. Extreme 290°C temperature swings every 14 days cause thermal fatigue in plastics.'
        }
      },
      {
        year: 2026,
        label: { uz: '2026: LRO sun’iy yo‘ldoshi tasdiqlagan holat', en: '2026: Present Day (LRO Orbital Confirmation)' },
        power: 0,
        dust: 38,
        radiation: 95,
        temp: '+112°C',
        log: {
          uz: 'NASA Lunar Reconnaissance Orbiter (LRO) suratlari roverning hali ham o‘z joyida soya tashlab turganini tasdiqlaydi.',
          en: 'NASA Lunar Reconnaissance Orbiter (LRO) imagery confirms the LRV sits intact, casting a sharp shadow at Hadley site.'
        }
      }
    ],
    quiz: {
      question: {
        uz: "Nima uchun NASA muhandislari Apollo 15 Oy mashinasiga oddiy rezina shinalar o‘rniga rux bilan qoplangan po‘lat to‘rli g‘ildiraklar o‘rnatishgan?",
        en: "Why did NASA engineers build the Apollo 15 Rover's wheels out of woven steel wire mesh instead of rubber pneumatic tires?"
      },
      options: [
        {
          uz: "Oyda vakuum va -170°C dan +120°C gacha haroratda rezina yorilib ketardi hamda to‘rli g‘ildirak yumshoq changga botmaydi",
          en: "Rubber would burst or crack in the Moon's vacuum and extreme temperatures, while wire mesh floats over soft lunar dust"
        },
        {
          uz: "Po‘lat to‘rli g‘ildiraklar quyosh nuridan elektr energiyasi ishlab chiqarishi uchun",
          en: "Because steel mesh wheels generate solar electricity while rolling"
        },
        {
          uz: "Oyda tortishish kuchi Yerdagidan 10 barobar kuchli bo‘lgani uchun",
          en: "Because lunar gravity is 10 times stronger than Earth's gravity"
        }
      ],
      correctIndex: 0,
      explanation: {
        uz: "To‘ppa-to‘g‘ri! Vakuum va ekstremal haroratda rezina shinalar ishlamaydi. Po‘lat to‘rli g‘ildiraklar esa yengil, elastik va Oy changida cho‘kmaydi.",
        en: "Spot on! Pneumatic rubber fails in vacuum and extreme thermal swings. Woven steel mesh stayed flexible and floated effortlessly over lunar regolith."
      }
    }
  },

  {
    id: 'surveyor-lrrr',
    region: 'moon',
    name: {
      uz: 'Surveyor 3 va Apollo Lazer Reflektori (LRRR)',
      en: 'Surveyor 3 & Lunar Laser Ranging Retroreflector'
    },
    subtitle: {
      uz: '2026-yilda ham ishlayotgan Oy optik lazer oynalari va tarixiy zond',
      en: 'Still Active in 2026! Passive Optical Mirror Array & Historic Lander'
    },
    status: 'ACTIVE',
    statusLabel: {
      uz: 'FAOL (Lazer oynalari 2026-yilda 100% ishlamoqda!)',
      en: 'ACTIVE IN 2026 (Laser Mirrors 100% Operational!)'
    },
    launchYear: 1967,
    endYear: 2026,
    location: {
      uz: 'Bo‘ronlar Okeani / Tinchlik Dengizi, Oy',
      en: 'Oceanus Procellarum & Mare Tranquillitatis, Moon'
    },
    distanceFromEarthKm: 384402,
    signalDelayText: { uz: '2.56 soniya (Lazer borib-qaytishi)', en: '2.56 sec (Round-trip Laser Pulse)' },
    plannedDuration: { uz: '10 yil (Lazer eksperimenti)', en: '10 Years (Laser Ranging Experiment)' },
    actualDuration: { uz: '57+ yil (Bugun ham Yerga signal qaytarmoqda!)', en: '57+ Years (Still Reflecting Earth Lasers Today!)' },
    nasaQuery: 'Apollo 11 Laser Ranging Retroreflector Surveyor 3',
    fallbackImages: [
      {
        title: 'Apollo 11 Lunar Laser Ranging Retroreflector on the Moon',
        url: 'https://images-assets.nasa.gov/image/6900957/6900957~medium.jpg',
        date: '1969-07-21'
      },
      {
        title: 'Apollo 12 Astronaut Alan Bean Inspecting Surveyor 3 on the Moon',
        url: 'https://images-assets.nasa.gov/image/as12-48-7136/as12-48-7136~orig.jpg',
        date: '1969-11-20'
      }
    ],
    firstPersonIntro: {
      uz: "Salom! Men Oyda qoldirilgan Lazer Retroreflektor (LRRR) va Surveyor 3 majmuasiman. Menga batareya ham, elektr ham kerak emas! Menga 100 ta o‘ta aniq kvars prizma oynalari o‘rnatilgan. Hatto bugun — 2026-yilda ham Yerdagi rasadxonalar menga yashil lazer nurini otishadi va men uni millimetr aniqligida Yerga qaytaraman!",
      en: "Hello! I am the Lunar Laser Ranging Retroreflector (LRRR) & Surveyor 3 heritage site. I don't need batteries or electricity! Built with 100 fused-silica corner-cube prisms, observatories on Earth still shoot powerful laser pulses at me in 2026, and I bounce them right back to measure the Moon's exact orbit!"
    },
    scienceSummary: {
      uz: "Ushbu tashlab ketilgan oyna massivi insoniyatning eng uzoq davom etayotgan Oy tajribasidir! Uning yordamida olimlar Oyning Yerdan har yili 3.8 santimetr uzoqlashayotganini, Oyning ichida suyuq yadro borligini va Eynshteynning nisbiylik nazariyasi to‘g‘riligini aniqlashdi!",
      en: "This discarded passive mirror array is NASA's longest-running lunar experiment! By timing laser pulses to the picosecond, scientists discovered the Moon is spiraling away from Earth at 3.8 cm per year, proved the Moon has a fluid core, and tested Einstein's General Relativity!"
    },
    hotspots: [
      {
        id: 'prisms',
        x: 52,
        y: 38,
        name: { uz: '100 ta Kvars Burchakli Prizma Oynalari (LRRR)', en: '100 Fused-Silica Corner-Cube Prisms (LRRR)' },
        health2026: 88,
        statusType: 'ACTIVE',
        engineering: {
          uz: "Elektrsiz ishlaydigan passiv optik tizim. Har bir prizma tushgan nurni aynan kelgan yo‘nalishiga qaytaradi. Oy changi sababli samaradorligi biroz pasaygan bo‘lsa-da, 2026-yilda to‘liq ishchi holatda!",
          en: "Zero-power passive optical array. Corner-cube prisms reflect incoming laser photons straight back to their source on Earth. Still 88% effective in 2026 despite minor electrostatic lunar dust!"
        },
        science: {
          uz: "Oyning Yerdan yiliga 3.8 sm uzoqlashishini millimetr aniqligida o‘lchab kelmoqda.",
          en: "Measures the Earth-Moon distance to millimeter precision, proving the Moon recedes 3.8 cm/year."
        }
      },
      {
        id: 'scoop',
        x: 28,
        y: 66,
        name: { uz: 'Surveyor 3 Mexanik Tuproq Qazish Cho‘michi', en: 'Surveyor 3 Soil Mechanics Surface Sampler Scoop' },
        health2026: 75,
        statusType: 'PARTIAL',
        engineering: {
          uz: "1967-yilda Oy tuprog‘ini qazib ko‘rgan ilk robot qo‘l. 1969-yilda Apollo 12 astronavtlari uning yoniga qo‘nib, 2.5 yillik kosmik ta’sirni o‘rganish uchun uning bir qismini Yerga olib qaytishgan!",
          en: "The first robotic arm to dig trenches on the Moon in 1967. Visited by Apollo 12 astronauts in 1969, who cut off the scoop to study how hardware survives years in space!"
        },
        science: {
          uz: "Apollo astronavtlari qo‘nishidan oldin Oy tuprog‘i kosmik kema og‘irligini ko‘tara olishini isbotlab berdi.",
          en: "Proved prior to Apollo 11 that the lunar surface was firm enough to support the weight of human landers."
        }
      },
      {
        id: 'camera-mount',
        x: 68,
        y: 55,
        name: { uz: 'Apollo 12 tomonidan yechib olingan TV Kamera o‘rni', en: 'Surveyor 3 TV Camera Mount (Retrieved by Apollo 12)' },
        health2026: 100,
        statusType: 'PARTIAL',
        engineering: {
          uz: "Surveyor 3 ning 6,315 ta rasm olgan kamerasi 1969-yilda Apollo 12 astronavtlari Pit Konrad va Alan Bin tomonidan kesib olinib, Yerga qaytarilgan. Hozir Vashingtondagi muzeyda saqlanadi!",
          en: "Surveyor 3's camera took 6,315 photos before Apollo 12 astronauts Pete Conrad and Alan Bean physically removed it in 1969 and brought it back to Earth for engineering analysis!"
        },
        science: {
          uz: "Kosmik nurlanish va quyosh shamoli shisha hamda metallni 31 oy ichida qanday o‘zgartirishini laboratoriyada tekshirish imkonini berdi.",
          en: "Gave NASA engineers their only direct physical sample of long-term lunar radiation and micrometeoroid weathering."
        }
      },
      {
        id: 'thermal-shield',
        x: 45,
        y: 78,
        name: { uz: 'Alyuminiy Termo-Izolyatsiya va Qo‘nish Oyoqlari', en: 'Aluminum Thermal Frame & Shock-Absorbing Legs' },
        health2026: 82,
        statusType: 'PARTIAL',
        engineering: {
          uz: "Oydagi quyosh radiatsiyasi oq bo‘yoqni sarg‘ish-jigarrang tusga kiritgan, ammo alyuminiy konstruksiya korroziyasiz saqlanmoqda.",
          en: "Solar vacuum ultraviolet radiation tanned Surveyor's white paint to a light brown, while the aluminum airframe remains free of rust."
        },
        science: {
          uz: "Avtomatik yumshoq qo‘nish radarlarining Oyda ishlashini ilk bor muvaffaqiyatli sinovdan o‘tkazdi.",
          en: "Validated radar-guided retro-rocket soft landing technology required for all subsequent lunar missions."
        }
      }
    ],
    timelineStates: [
      {
        year: 1969,
        label: { uz: '1969: Apollo 11 LRRR o‘rnatilishi va Apollo 12 tashrifi', en: '1969: LRRR Deployed & Apollo 12 Visits Surveyor 3' },
        power: 100,
        dust: 2,
        radiation: 10,
        temp: '+95°C',
        log: {
          uz: 'Lazer reflektor o‘rnatildi. Lick rasadxonasi Oydan qaytgan ilk lazer fotonlarini qayd etdi!',
          en: 'LRRR deployed. Lick Observatory successfully detects the first return laser photons bounced off the Moon!'
        }
      },
      {
        year: 2000,
        label: { uz: '2000: 30 yillik uzluksiz lazer o‘lchovlari', en: '2000: Three Decades of Picosecond Laser Ranging' },
        power: 100,
        dust: 12,
        radiation: 55,
        temp: '-160°C',
        log: {
          uz: 'Passiv oynalar elektr talab qilmaydi. Oyning suyuq yadrosi mavjudligi lazer orqali isbotlandi.',
          en: 'Passive prisms require zero electric power. Fluid lunar core discovered via subtle rotational wobble.'
        }
      },
      {
        year: 2026,
        label: { uz: '2026: 57 yildan beri ishlayotgan rekordchi asbob!', en: '2026: 57+ Years Active — Still Reflecting Lasers!' },
        power: 100,
        dust: 20,
        radiation: 92,
        temp: '+108°C',
        log: {
          uz: 'Apache Point va Grasse rasadxonalari 2026-yilda ham ushbu oynalardan har kuni ilmiy ma’lumot olmoqda.',
          en: 'Apache Point and Grasse observatories continue firing lasers at the array in 2026 with millimeter accuracy.'
        }
      }
    ],
    quiz: {
      question: {
        uz: "Apollo astronavtlari Oyda qoldirgan Lazer Reflektor (LRRR) qanday qilib 2026-yilda ham hech qanday batareyasiz ishlayapti?",
        en: "How does the Apollo Lunar Laser Ranging Retroreflector (LRRR) still work in 2026 without any battery or solar panels?"
      },
      options: [
        {
          uz: "U maxsus kvars burchakli prizmalardan iborat bo‘lib, Yerdan otilgan lazer nurini optik qonun asosida o‘z manbasiga qaytaradi",
          en: "It uses passive fused-silica corner-cube optical prisms that naturally bounce Earth laser pulses straight back"
        },
        {
          uz: "U Oy ichidagi vulqon issiqligidan elektr oladi",
          en: "It harvests geothermal heat from active lunar volcanoes"
        },
        {
          uz: "Har yili yangi robotlar borib uning batareyasini almashtirib keladi",
          en: "Robotic drones swap its batteries every five years"
        }
      ],
      correctIndex: 0,
      explanation: {
        uz: "Ajoyib! Burchakli kub prizmalari (Corner-cube prisms) optik geometriya tufayli nurni hech qanday elektr energiyasisiz 180 gradus orqaga — Yerdagi teleskopga qaytaradi!",
        en: "Brilliant! Corner-cube optical prisms rely purely on physics and geometry to reflect light straight back to the source on Earth with zero electrical power."
      }
    }
  },

  {
    id: 'opportunity-rover',
    region: 'mars',
    name: {
      uz: 'Opportunity Roveri (MER-B "Oppy")',
      en: 'Opportunity Mars Exploration Rover (MER-B)'
    },
    subtitle: {
      uz: 'Marsda qadimgi suv izlarini topgan va 15 yil yashagan afsonaviy marsoxod',
      en: 'Planned for 90 Sols, Explored Mars for 15 Years & Proved Ancient Water'
    },
    status: 'OFFLINE',
    statusLabel: {
      uz: 'UYQUDA / OFFLINE (2018-yilgi global qum bo‘roni qoplagan)',
      en: 'DORMANT / OFFLINE (Covered by 2018 Global Mars Dust Storm)'
    },
    launchYear: 2004,
    endYear: 2018,
    location: {
      uz: 'Matonat Vodiysi (Perseverance Valley), Mars (2.05° S, 354.47° E)',
      en: 'Perseverance Valley, Endeavour Crater, Mars (2.05° S, 354.47° E)'
    },
    distanceFromEarthKm: 225000000,
    signalDelayText: { uz: '12 daqiqa 30 soniya (Radio-signal)', en: '12 min 30 sec (One-way Radio Delay)' },
    plannedDuration: { uz: '90 Sol (92 Yer kuni)', en: '90 Sols (92 Earth Days)' },
    actualDuration: { uz: '5,111 Sol (14.5 yil! 45.16 km marafon)', en: '5,111 Sols (14.5 Years! 45.16 km Marathon)' },
    nasaQuery: 'Opportunity Rover Mars',
    fallbackImages: [
      {
        title: 'Opportunity Rover Self-Portrait & Dust on Solar Panels',
        url: 'https://images-assets.nasa.gov/image/PIA17944/PIA17944~orig.jpg',
        date: '2014-03-27'
      },
      {
        title: 'Martian Hematite "Blueberries" Discovered by Opportunity',
        url: 'https://images-assets.nasa.gov/image/PIA05584/PIA05584~orig.jpg',
        date: '2004-03-18'
      }
    ],
    firstPersonIntro: {
      uz: "Salom, yosh tadqiqotchi! Mening ismim Opportunity. Muhandislar meni Marsda atigi 90 kun ishlaydi deb o‘ylashgandi, lekin men 5,111 kun — qariyb 15 yil yashadim va boshqa sayyorada to‘liq 45 km marafon masofasini bosib o‘tgan birinchi apparat bo‘ldim! 2018-yilda ulkan qum bo‘roni quyoshni to‘sib qo‘yganda, Yerga so‘nggi xabarimni yubordim: 'Batareyam kam qoldi va atrof qorong‘ilashyapti...'",
      en: "Hello, young explorer! I am Opportunity. Engineers designed me to survive just 90 sols on Mars, yet I explored for 5,111 sols—nearly 15 years—and became the first rover to complete a 45 km marathon on another world! In 2018, a planet-encircling dust storm blotted out the Sun, leaving my final telemetry poetic: 'My battery is low and it's getting dark.'"
    },
    scienceSummary: {
      uz: "Opportunity Marsda bir vaqtlar suyuq va hayot uchun yaroqli suv bo‘lganini ilk bor rad etib bo‘lmas dalillar bilan isbotladi! Uning spektrometrlari faqat suvli muhitda hosil bo‘ladigan 'gematit sharchalari' (blueberries) va neytral pH darajasiga ega loy minerallarini topdi.",
      en: "Opportunity provided the first definitive ground truth that ancient Mars had liquid water capable of supporting life! Its spectrometers discovered spherical hematite concretions ('Martian blueberries') and neutral-pH clay minerals inside Endeavour Crater."
    },
    hotspots: [
      {
        id: 'solar-wings',
        x: 50,
        y: 44,
        name: { uz: 'Uch qatlamli Galliy-Arsenid Quyosh Panellari', en: 'Triple-Junction Gallium Arsenide Solar Array Wings' },
        health2026: 0,
        statusType: 'OFFLINE',
        engineering: {
          uz: "14 yil davomida Mars shamollari ('dust devils') panellarni changdan tozalab roverni qutqarib keldi. Ammo 2018-yil iyundagi global bo‘ron (Tau > 10.8) quyosh nurini 99.9% to‘sib qo‘ydi va qalin chang qatlami batareyalarni muzlatdi.",
          en: "For 14 years, lucky Martian wind gusts ('cleaning events') swept dust off the panels. However, the June 2018 global dust storm blocked 99.9% of sunlight, burying the arrays in thick dust."
        },
        science: {
          uz: "Mars atmosferasidagi chang bo‘ronlari va shamol dinamikasini 7 ta Mars yili davomida o‘lchab berdi.",
          en: "Monitored atmospheric opacity (Tau) and seasonal dust storm dynamics across 7 full Martian years."
        }
      },
      {
        id: 'pancam',
        x: 58,
        y: 18,
        name: { uz: 'Pancam (Panoramali Kamera) va Mini-TES', en: 'Pancam Mast Assembly & Mini-TES Infrared Sensor' },
        health2026: 25,
        statusType: 'OFFLINE',
        engineering: {
          uz: "Inson ko‘zi balandligida (1.5 m) joylashgan 11 xil filtrli stereo kamera. Missiya davomida 228,771 ta xom suratni Yerga uzatdi! Optik linzalar chang qatlami ostida butun turibdi.",
          en: "Mounted at human eye-level (1.5m) with 11 spectral filters. Transmitted 228,771 raw images to Earth! The optical lenses remain physically intact beneath a fine coating of iron-oxide dust."
        },
        science: {
          uz: "Victoria va Endeavour kraterlarining qadimgi cho‘kindi jins qatlamlarini 3D formatda xaritalashtirdi.",
          en: "Mapped layered sedimentary bedrock across Eagle, Victoria, and Endeavour craters in multispectral 3D."
        }
      },
      {
        id: 'idd-arm',
        x: 78,
        y: 62,
        name: { uz: 'Robot Qo‘l: Mössbauer va APXS Spektrometrlari', en: 'Robotic Arm: Mössbauer, APXS & Rock Abrasion Tool' },
        health2026: 10,
        statusType: 'OFFLINE',
        engineering: {
          uz: "Inson qo‘lidek 5 bo‘g‘imli manipulyator. Toshlarni silliqlovchi olmos uchli 'RAT' burg‘usi, mikroskopik kamera va ikkita yadroviy spektrometrga ega. Kobalt-57 manbasi yarim yemirilish davri o‘tgan.",
          en: "5-degree-of-freedom robotic arm carrying a diamond-toothed Rock Abrasion Tool (RAT), Microscopic Imager, and two spectrometers. Its Cobalt-57 radioactive source has naturally decayed."
        },
        science: {
          uz: "Marsdagi 'ko‘k mevalar' (blueberries) aslida temirga boy gematit ekanini va ular qadimgi sho‘r suvda shakllanganini kashf qildi!",
          en: "Identified the iconic Martian 'blueberries' as iron-rich hematite concretions formed in ancient groundwater!"
        }
      },
      {
        id: 'rocker-bogie',
        x: 32,
        y: 76,
        name: { uz: '6 G‘ildirakli Rocker-Bogie Titanium Shassisi', en: '6-Wheel Rocker-Bogie Titanium Mobility System' },
        health2026: 70,
        statusType: 'PARTIAL',
        engineering: {
          uz: "O‘ng old g‘ildirakning burish motori 2005-yilda ishdan chiqqach, muhandislar roverni 13 yil davomida orqaga qarab haydashdi! Alyuminiy va titan g‘ildiraklar korroziyasiz saqlanmoqda.",
          en: "After the right-front steering actuator jammed in 2005, engineers drove Opportunity backward for 13 years to save the motor! Its machined aluminum wheels remain structurally sound."
        },
        science: {
          uz: "Boshqa sayyorada 45.16 km yo‘l bosib, insoniyat tarixidagi mutlaq masofa rekordini o‘rnatdi.",
          en: "Set the all-time off-Earth driving distance record of 45.16 km (28.06 miles)."
        }
      }
    ],
    timelineStates: [
      {
        year: 2004,
        label: { uz: '2004: Eagle krateriga qo‘nish va "Blueberries" kashfiyoti', en: '2004: Eagle Crater Landing & "Blueberries" Discovery' },
        power: 100,
        dust: 5,
        radiation: 5,
        temp: '-25°C',
        log: {
          uz: 'Qo‘nish muvaffaqiyatli! 90 kunlik missiya davomida Marsda qadimgi suv izlari topildi.',
          en: 'Touchdown in Eagle Crater! Within 60 sols, hematite spheres prove liquid water once soaked Meridiani Planum.'
        }
      },
      {
        year: 2015,
        label: { uz: '2015: 42.195 km Mars Marafoni rekordi!', en: '2015: Completes First 42.2 km Off-Earth Marathon!' },
        power: 68,
        dust: 35,
        radiation: 55,
        temp: '-55°C',
        log: {
          uz: 'Flash-xotira eskirgani sababli rover RAM rejimida ishlamoqda, shamollar quyosh panellarini tozalab turibdi.',
          en: 'Operating in RAM-only mode due to aging flash memory; seasonal wind gusts clean solar panels.'
        }
      },
      {
        year: 2026,
        label: { uz: '2026: Matonat vodiysidagi abadiy yodgorlik', en: '2026: Silent Monument in Perseverance Valley' },
        power: 0,
        dust: 96,
        radiation: 90,
        temp: '-78°C',
        log: {
          uz: '2018-yilgi bo‘rondan so‘ng ichki isitgichlar o‘chgan va ichki soat to‘xtagan. Qizil chang ostida uxlamoqda.',
          en: 'Internal heaters failed during the 2018 planetary dust storm. Sits preserved under fine iron-oxide dust.'
        }
      }
    ],
    quiz: {
      question: {
        uz: "Opportunity roveri 90 kun o‘rniga 15 yil ishlashiga qaysi tabiiy Mars hodisasi eng katta yordam bergan?",
        en: "What natural Martian phenomenon unexpectedly helped Opportunity survive for 15 years instead of just 90 days?"
      },
      options: [
        {
          uz: "Marsdagi kichik shamol uyurmalari ('dust devils') vaqti-vaqti bilan quyosh panellaridagi changni supurib ketgan",
          en: "Martian wind gusts and 'dust devils' periodically swept the dust off its solar panels ('cleaning events')"
        },
        {
          uz: "Marsda yomg‘ir yog‘ib quyosh panellarini yuvib turgan",
          en: "Seasonal rainstorms washed the solar panels clean every summer"
        },
        {
          uz: "Uning ichida yadroviy reaktor bor edi",
          en: "It was powered by an onboard plutonium fission reactor"
        }
      ],
      correctIndex: 0,
      explanation: {
        uz: "Barakalla! NASA muhandislari chang quyosh panellarini 3 oyda yopib qo‘yadi deb o‘ylashgandi, lekin Mars shamollari ularni qayta-qayta tozalab, rover umrini 60 barobar uzaytirdi!",
        en: "Correct! Engineers expected dust to coat the solar panels within 90 days, but Martian wind gusts repeatedly swept them clean, extending the mission 60-fold!"
      }
    }
  },

  {
    id: 'ingenuity-heli',
    region: 'mars',
    name: {
      uz: 'Ingenuity Mars Vertolyoti ("Ginny")',
      en: 'Ingenuity Mars Helicopter ("Ginny")'
    },
    subtitle: {
      uz: 'Boshqa sayyorada uchgan birinchi apparat — hozirda statsionar ob-havo stansiyasi!',
      en: 'First Aircraft on Another Planet — Now a Stationary Telemetry Archive!'
    },
    status: 'PARTIAL',
    statusLabel: {
      uz: 'QISMAN FAOL (Parragi singan, lekin kompyuteri va datchiklari tirik!)',
      en: 'PARTIAL / STATIONARY (Rotor Damaged, Avionics & Sensors Alive!)'
    },
    launchYear: 2021,
    endYear: 2024,
    location: {
      uz: 'Valinor Tepaliklari, Jezero Krateri, Mars (18.44° N, 77.45° E)',
      en: 'Valinor Hills, Jezero Crater, Mars (18.44° N, 77.45° E)'
    },
    distanceFromEarthKm: 225000000,
    signalDelayText: { uz: '12 daqiqa 30 soniya (UHF/DSN orqali)', en: '12 min 30 sec (Via DSN Relay)' },
    plannedDuration: { uz: '5 ta parvoz (30 Sol)', en: '5 Flights (30 Sols Tech Demo)' },
    actualDuration: { uz: '72 ta parvoz (17 km) + 2026-yilda stansiya sifatida faol!', en: '72 Flights (17 km) + Active Stationary Weather Logger!' },
    nasaQuery: 'Ingenuity Mars Helicopter',
    fallbackImages: [
      {
        title: 'Ingenuity Mars Helicopter on the Surface of Jezero Crater',
        url: 'https://images-assets.nasa.gov/image/PIA24542/PIA24542~orig.jpg',
        date: '2021-04-05'
      },
      {
        title: 'Damaged Rotor Blade Shadow After Flight 72 on Mars',
        url: 'https://images-assets.nasa.gov/image/PIA26243/PIA26243~orig.jpg',
        date: '2024-01-25'
      }
    ],
    firstPersonIntro: {
      uz: "Salom! Men Ingenuity — Mars osmonida uchgan tarixdagi birinchi vertolyotman! Mars havosi Yernikidan 100 barobar siyrak bo‘lishiga qaramay, men 5 marta emas, naqd 72 marta uchdim! 2024-yil yanvarda 72-parvoz paytida qum tepaligiga qo‘nayotib parragimning uchi sindi. Men endi ucha olmayman, lekin mening quyosh panelim, batareyam va kompyuterim hali ham tirik! Men har kuni Mars haroratini xotiramga yozib boryapman!",
      en: "Hi there! I'm Ingenuity—the Wright Brothers moment on Mars! Even though Mars's atmosphere is 99% thinner than Earth's, I flew 72 times instead of just 5! In January 2024, on Flight 72, my rotor blade tips struck a sand ripple. I can no longer fly, but surprise: my solar panel, batteries, and computer are STILL ALIVE in 2026, logging daily weather data in my memory!"
    },
    scienceSummary: {
      uz: "Ingenuity boshqa sayyoraning o‘ta siyrak atmosferasida aerodinamik parvoz mumkinligini isbotladi. U Perseverance roveri uchun havodan razvedkachi bo‘lib xizmat qildi va hozirda kelajakdagi astronavtlar olib ketishi uchun 20 yillik ichki ob-havo va texnik arxivni yig‘moqda!",
      en: "Ingenuity proved aerodynamic flight is possible in an atmosphere with just 1% of Earth's density. It served as an aerial scout for Perseverance over ancient river deltas and now operates as a long-term stationary weather and component testbed!"
    },
    hotspots: [
      {
        id: 'rotors',
        x: 50,
        y: 26,
        name: { uz: '2,537 ayl/daq Uglerod Tolali Qo‘shaloq Parraklar', en: '2,537 RPM Coaxial Carbon-Fiber Rotor Blades' },
        health2026: 15,
        statusType: 'OFFLINE',
        engineering: {
          uz: "Marsning 1% zichlikdagi havosida ko‘tarilish uchun Yerdagi vertolyotlardan 5 barobar tez — daqiqasiga 2,537 marta aylangan! 72-parvozda parrak uchi sinib, aerodinamik muvozanat buzilgan.",
          en: "Spun at an astonishing 2,537 RPM (5x faster than Earth helicopters) to generate lift in thin CO2 air. Blade tips fractured during Flight 72 landing in sandy terrain, preventing further flight."
        },
        science: {
          uz: "Kelajakdagi Mars Sample Recovery vertolyotlari va Dragonfly (Titan droni) uchun aerodinamik model yaratdi.",
          en: "Validated supersonic-tip low-Reynolds-number aerodynamics for future Mars choppers and Titan's Dragonfly."
        }
      },
      {
        id: 'solar-top',
        x: 50,
        y: 12,
        name: { uz: 'Parraklar ustidagi Quyosh Paneli va 6 ta Li-Ion Batareya', en: 'Top-Mounted Solar Array & 6 Sony Li-Ion Cells' },
        health2026: 84,
        statusType: 'ACTIVE',
        engineering: {
          uz: "2026-yilda ham to‘liq ishlamoqda! Quyosh paneli har kuni 6 ta litiy-ion akkumulyatorini quvvatlaydi, bu esa vertolyot kompyuterini -80°C tungi sovuqdan saqlab turibdi.",
          en: "Still operational in 2026! The solar array recharges 6 lithium-ion cells daily, keeping the avionics warm through frigid -80°C Martian nights."
        },
        science: {
          uz: "Tijoriy (off-the-shelf) litiy-ion batareyalarining Marsda 5+ yil ishlash chidamliligini isbotlamoqda.",
          en: "Demonstrates multi-year survival of commercial off-the-shelf lithium-ion batteries on the Martian surface."
        }
      },
      {
        id: 'avionics',
        x: 50,
        y: 52,
        name: { uz: 'Snapdragon 801 Linux Parvoz Kompyuteri (Qora Quti)', en: 'Snapdragon 801 Linux Avionics & Telemetry Memory' },
        health2026: 95,
        statusType: 'ACTIVE',
        engineering: {
          uz: "NASA Ingenuity dasturiy ta’minotini yangilab, uni avtonom stansiyaga aylantirdi: u har kuni uyg‘onadi, batareya va haroratni tekshiradi, rasm oladi va ichki xotirasiga yozadi!",
          en: "Before losing range with Perseverance, NASA patched Ingenuity's software: it wakes up daily, runs system health checks, snaps a photo, and stores 20 years of data onboard!"
        },
        science: {
          uz: "Kelajakda Marsga boradigan astronavtlar yoki roverlar unga yaqinlashsa, yillar davomida yig‘ilgan iqlim arxivini yuklab olishadi!",
          en: "Creates a multi-decade climate and hardware degradation dataset awaiting retrieval by future astronauts!"
        }
      },
      {
        id: 'navcam',
        x: 50,
        y: 72,
        name: { uz: '13 MP Rangli RTE Kamera va Lazer Altimetr', en: '13 MP Color RTE Camera & Garmin Lidar Altimeter' },
        health2026: 90,
        statusType: 'ACTIVE',
        engineering: {
          uz: "Pastga qaragan navigatsiya va rangli kamera. Hozirda Valinor tepaliklaridagi qum barxanlarining shamol ta’sirida qanday ko‘chishini har kuni suratga olmoqda.",
          en: "Downward-looking navigation and color cameras. Currently capturing a daily time-lapse of shifting sand ripples in Valinor Hills."
        },
        science: {
          uz: "Mars sirtidagi eol (shamol) jarayonlari va chang ko‘chishini bir nuqtadan uzoq muddatli kuzatish imkonini beradi.",
          en: "Tracks daily aeolian sand transport and dust accumulation at a fixed Martian dune location."
        }
      }
    ],
    timelineStates: [
      {
        year: 2021,
        label: { uz: '2021: 19-aprel — Boshqa sayyoradagi ilk parvoz!', en: '2021: April 19 — First Powered Flight on Another World!' },
        power: 100,
        dust: 2,
        radiation: 5,
        temp: '-15°C',
        log: {
          uz: '3 metr balandlikka ko‘tarilib 39 soniya havoda muallaq turdi. Aka-uka Raytlar matosi parchasi bortda!',
          en: 'Climbs to 3 meters and hovers for 39.1 seconds. Carries a postage-stamp piece of the 1903 Wright Flyer!'
        }
      },
      {
        year: 2024,
        label: { uz: '2024: 72-parvoz va Valinor tepaliklarida qo‘nish', en: '2024: Flight 72 Blade Strike & Final Software Patch' },
        power: 92,
        dust: 18,
        radiation: 35,
        temp: '-62°C',
        log: {
          uz: 'Parrak uchi shikastlandi. JPL muhandislari vertolyotni avtonom ob-havo stansiyasiga aylantiruvchi dastur yuklashdi.',
          en: 'Rotor blade tip damaged on landing. JPL uploads final patch turning Ginny into an autonomous data logger.'
        }
      },
      {
        year: 2026,
        label: { uz: '2026: Ucha olmaydi, ammo har kuni uyg‘onib ma’lumot yig‘moqda!', en: '2026: Grounded but Awake — Daily Weather Logging!' },
        power: 84,
        dust: 30,
        radiation: 52,
        temp: '-68°C',
        log: {
          uz: 'Ingenuity har kuni ertalab uyg‘onib, harorat va batareya holatini o‘lchab o‘z xotirasiga yozib bormoqda.',
          en: 'Ingenuity wakes every Martian morning, checks battery/thermal sensors, snaps a surface photo, and saves to flash.'
        }
      }
    ],
    quiz: {
      question: {
        uz: "2024-yilda 72-parvozda parragi singan Ingenuity vertolyoti 2026-yilda Marsda nima ish qilmoqda?",
        en: "After breaking its rotor blade tips on Flight 72 in 2024, what is the Ingenuity helicopter doing in 2026?"
      },
      options: [
        {
          uz: "Quyosh paneli va kompyuteri hali ham ishlayapti — u har kuni uyg‘onib, ob-havo va texnik ma’lumotlarni ichki xotirasiga yozib bormoqda",
          en: "Its solar panel and computer still work—it wakes up daily to record weather and engineering data in its onboard memory"
        },
        {
          uz: "Perseverance roveri uning parragini payvandlab tuzatdi va u yana uchyapti",
          en: "Perseverance welded a new rotor blade onto it so it could keep flying"
        },
        {
          uz: "U Yerga qaytib kelgan",
          en: "It flew all the way back to Earth"
        }
      ],
      correctIndex: 0,
      explanation: {
        uz: "To‘ppa-to‘g‘ri! Ingenuity ucha olmasa ham, uning elektron 'miyasi' va quyosh paneli sog‘lom. U kelajakdagi astronavtlar uchun 20 yillik Mars ob-havo kundaligini yozmoqda!",
        en: "Exactly! Even though it's grounded, NASA reprogrammed Ingenuity to wake up every sol, measure temperatures and battery health, and store a 20-year archive for future astronauts!"
      }
    }
  },

  {
    id: 'pioneer-10',
    region: 'deepspace',
    name: {
      uz: 'Pioneer 10 Yulduzlararo Zondi',
      en: 'Pioneer 10 Deep Space Probe'
    },
    subtitle: {
      uz: 'Asteroidlar belbog‘i va Yupiterni zabt etgan, Oltin Plastinka eltuvchi sokin elchi',
      en: 'First Through the Asteroid Belt & Jupiter — Carrying the Gold Pioneer Plaque'
    },
    status: 'OFFLINE',
    statusLabel: {
      uz: 'OFFLINE / SOKIN PARVOZDA (Aldebaran yulduzi tomon uchmoqda)',
      en: 'OFFLINE / SILENT DRIFT (Coasting at 137+ AU Toward Aldebaran)'
    },
    launchYear: 1972,
    endYear: 2003,
    location: {
      uz: 'Taur (Savr) yulduz turkumi yo‘nalishi, Yerdan 20.5 mlrd km uzoqda',
      en: 'Heading Toward Aldebaran (Taurus), ~20.5 Billion km (137.4 AU)'
    },
    distanceFromEarthKm: 20550000000,
    signalDelayText: { uz: '38 soat 05 daqiqa (Ikki tomonlama yorug‘lik vaqti)', en: '38 hrs 05 min (Round-trip Light Time)' },
    plannedDuration: { uz: '21 oy (Yupiter parvozigacha)', en: '21 Months (Jupiter Flyby Mission)' },
    actualDuration: { uz: '31 yil aloqa / 54+ yildan beri koinotda uchmoqda', en: '31 Years Active / 54+ Years Coasting in Space' },
    nasaQuery: 'Pioneer 10 Plaque Jupiter',
    fallbackImages: [
      {
        title: 'The Gold-Anodized Pioneer 10 Plaque Designed by Carl Sagan',
        url: 'https://images-assets.nasa.gov/image/ARC-1972-AC72-2135/ARC-1972-AC72-2135~medium.jpg',
        date: '1972-02-25'
      },
      {
        title: 'Pioneer 10 Spacecraft Artist Concept at Jupiter',
        url: 'https://images-assets.nasa.gov/image/ARC-1973-AC73-4247/ARC-1973-AC73-4247~medium.jpg',
        date: '1973-12-03'
      }
    ],
    firstPersonIntro: {
      uz: "Salom, Yerlik do‘stim! Men Pioneer 10 man. 1972-yilda uchirilganimda hech bir kema Asteroidlar belbog‘idan o‘tmagan va Yupiterning dahshatli radiatsiyasiga yaqinlashmagan edi. Men bu yo‘lni birinchi bo‘lib ochdim! 2003-yilda yadroviy batareyam quvvati Yerga radio-signal yetkazishga yetmay qoldi, ammo men to‘xtaganim yo‘q — soniyasiga 11.8 km tezlikda Aldebaran yulduzi tomon uchib ketyapman va ko‘ksimda insoniyatning Oltin Maktubini saqlayapman!",
      en: "Greetings, Earthling! I am Pioneer 10. When I launched in 1972, no spacecraft had ever dared cross the Asteroid Belt or survive Jupiter's intense radiation belts. I blazed that trail! In 2003, my nuclear power dropped too low for my radio transmitter to reach Earth, yet I never stopped—I am coasting at 11.8 km/s toward the star Aldebaran, carrying humanity's Gold Plaque!"
    },
    scienceSummary: {
      uz: "Pioneer 10 Asteroidlar belbog‘idan xavfsiz o‘tish mumkinligini isbotladi, Yupiterning ilk yaqin suratlarini oldi, uning ulkan magnitosferasini o‘lchadi va Quyosh tizimidan chiqish tezligiga erishgan ilk sun’iy jismga aylandi!",
      en: "Pioneer 10 proved spacecraft could safely cross the Asteroid Belt, captured the first close-up images of Jupiter, mapped Jupiter's massive magnetosphere and radiation belts, and became the first human artifact to achieve solar system escape velocity!"
    },
    hotspots: [
      {
        id: 'pioneer-plaque',
        x: 52,
        y: 58,
        name: { uz: 'Karl Saganning Oltin bilan qoplangan "Pioneer Plastinkasi"', en: 'Gold-Anodized Aluminum "Pioneer Plaque" (Carl Sagan)' },
        health2026: 99,
        statusType: 'ACTIVE',
        engineering: {
          uz: "15x23 sm o‘lchamdagi oltin bilan anodlangan alyuminiy lavha. Kosmik eroziyadan himoyalangan joyga o‘rnatilgan bo‘lib, u millionlab yillar davomida bus-butun saqlanadi!",
          en: "A 6x9-inch gold-anodized aluminum plate bolted to the antenna support struts to shield it from interstellar dust erosion. It will remain legible for hundreds of millions of years!"
        },
        science: {
          uz: "Unda vodorod atomi o‘tishi, 14 ta pulsar orqali Quyoshning galaktikadagi manzili hamda erkak va ayol tasviri kodlangan.",
          en: "Depicts the hyperfine transition of neutral hydrogen, a pulsar map pinpointing our Sun's galactic location, and figures of a man and woman."
        }
      },
      {
        id: 'dish',
        x: 50,
        y: 35,
        name: { uz: '2.74 metrli Parabolik Yuqori Sezgirlikdagi Antenna', en: '2.74-Meter Parabolic High-Gain Dish Antenna' },
        health2026: 90,
        statusType: 'PARTIAL',
        engineering: {
          uz: "Alyuminiy tovoq Yerga 8 Vatt quvvatli S-diapazonli signal uzatgan. Oxirgi marta 2003-yil 23-yanvarda Yerdan 12 milliard km uzoqlikdan kuchsiz 'bip' signali qabul qilingan.",
          en: "Beamed data across billions of kilometers using just an 8-watt transmitter (less than a bedroom nightlight!). Its last faint signal reached Earth on January 23, 2003."
        },
        science: {
          uz: "Uzoq yillar davomida 'Pioneer anomaliyasi' (infraqizil issiqlik qaytishi tufayli sekinlashish) fizikasini kashf etishga yordam berdi.",
          en: "Radio Doppler tracking led to the famous 'Pioneer Anomaly' physics investigation, solved as anisotropic thermal radiation pressure."
        }
      },
      {
        id: 'rtg-power',
        x: 16,
        y: 48,
        name: { uz: '4 ta SNAP-19 Plutoniy-238 Radioizotop Generatorlari', en: 'Four SNAP-19 Plutonium-238 RTG Nuclear Generators' },
        health2026: 8,
        statusType: 'OFFLINE',
        engineering: {
          uz: "Quyoshdan uzoqda quyosh panellari ishlamagani uchun Plutoniy-238 issiqligidan elektr olgan. Yarim yemirilish davri (87.7 yil) va termojuftlar eskirishi sababli quvvat radio uzatkich uchun yetarli emas.",
          en: "Powered by Plutonium-238 radioactive decay because sunlight at Jupiter is 27x weaker than at Earth. After 54 years, thermocouple wear and isotope decay dropped output below transmitter threshold."
        },
        science: {
          uz: "Tashqi sayyoralarga uchadigan barcha zamonaviy missiyalar (Voyager, Cassini, New Horizons, Perseverance) uchun RTG texnologiyasini sinovdan o‘tkazdi.",
          en: "Pioneered nuclear RTG power for outer solar system missions, enabling Voyager, Cassini, and New Horizons."
        }
      },
      {
        id: 'magnetometer',
        x: 86,
        y: 48,
        name: { uz: '6.5 metrli Geliy Vektorli Magnitometr Shtangasi', en: '6.5-Meter Helium Vector Magnetometer Boom' },
        health2026: 85,
        statusType: 'OFFLINE',
        engineering: {
          uz: "Kema korpusining o‘z magnit maydonidan uzoqroq bo‘lishi uchun 6.5 metrli uzun shtanga uchiga o‘rnatilgan. Mexanik tuzilmasi vakuumda o‘zgarmagan.",
          en: "Extended on a long 6.5-meter fiberglass boom to isolate the sensor from the spacecraft's own magnetic interference. Physically intact in deep space."
        },
        science: {
          uz: "Yupiterning magnit maydoni Yernikidan minglab marta kuchli ekanini va quyosh shamoli chegarasini o‘lchadi.",
          en: "Mapped Jupiter's immense magnetosphere and tracked the solar wind out beyond the orbit of Pluto."
        }
      }
    ],
    timelineStates: [
      {
        year: 1973,
        label: { uz: '1973: Yupiter yonidan tarixiy ilk parvoz!', en: '1973: First Spacecraft to Fly Past Jupiter!' },
        power: 95,
        dust: 2,
        radiation: 65,
        temp: '-110°C',
        log: {
          uz: 'Yupiter bulutlaridan 130,000 km masofada o‘tdi. Kuchli radiatsiya kamari ichida barcha asboblar omon qoldi!',
          en: 'Passes within 130,000 km of Jupiter cloud tops, surviving radiation 10,000x stronger than Earths Van Allen belts!'
        }
      },
      {
        year: 2003,
        label: { uz: '2003: Yerdan 80 AU uzoqlikdan so‘nggi "Xayr" signali', en: '2003: Final Radio Whisper from 80 AU (12 Billion km)' },
        power: 18,
        dust: 5,
        radiation: 80,
        temp: '-210°C',
        log: {
          uz: 'Deep Space Network 70 metrli antennalari Pioneer 10 ning so‘nggi kuchsiz signalini qayd etdi.',
          en: 'NASA Deep Space Network 70-meter dishes record Pioneer 10s final faint telemetry whisper.'
        }
      },
      {
        year: 2026,
        label: { uz: '2026: Yerdan 137.4 AU (20.5 mlrd km) uzoqlikda suzmoqda', en: '2026: Coasting Silently at 137.4 AU Toward Aldebaran' },
        power: 0,
        dust: 8,
        radiation: 95,
        temp: '-268°C',
        log: {
          uz: '2 million yildan so‘ng u Savr yulduz turkumidagi Aldebaran yulduzi yonidan o‘tadi. Oltin plastinka 99% butun!',
          en: 'Coasting at 11.8 km/s; will pass near the red giant star Aldebaran in ~2 million years with the Gold Plaque intact!'
        }
      }
    ],
    quiz: {
      question: {
        uz: "Pioneer 10 zondi bortidagi Oltin Plastinkada begona sivilizatsiyalarga Quyosh tizimimiz manzili qanday tushuntirilgan?",
        en: "How does the Gold Plaque aboard Pioneer 10 show extraterrestrials where our Solar System is located?"
      },
      options: [
        {
          uz: "14 ta kosmik pulsar (neytron yulduzlar) ning chastotasi va Quyoshga nisbatan masofalarini ko‘rsatuvchi xarita orqali",
          en: "Using a radial map of 14 cosmic pulsars (rotating neutron stars) and their exact pulse frequencies relative to our Sun"
        },
        {
          uz: "Ingliz va lotin tilida Yerdagi pochta indeksi yozilgan",
          en: "It has Earth's address written in English and Latin"
        },
        {
          uz: "Kema orqasidan rangli tutun chiqarib yo‘l qoldiradi",
          en: "It leaves a trail of glowing neon gas behind it"
        }
      ],
      correctIndex: 0,
      explanation: {
        uz: "Qoyil! Astronomlar Karl Sagan va Frenk Dreyk 14 ta pulsarning aniq miltillash davrini ikkilik sanoq tizimida chizishgan — har qanday ilmiy sivilizatsiya bu orqali Quyoshimizni va uchirilgan yilni (1972) hisoblab topa oladi!",
        en: "Awesome! Carl Sagan and Frank Drake encoded the precise binary frequencies of 14 pulsars converging on the Sun—acting as a cosmic GPS and timestamp!"
      }
    }
  },

  {
    id: 'voyager-1',
    region: 'deepspace',
    name: {
      uz: 'Voyager 1 Yulduzlararo Kemasi',
      en: 'Voyager 1 Interstellar Probe'
    },
    subtitle: {
      uz: 'Insoniyatning eng uzoqdagi (24.9 mlrd km!) va 2026-yilda ham gapirayotgan elchisi',
      en: 'Farthest Human-Made Object (24.9B km!) — Still Transmitting from Interstellar Space!'
    },
    status: 'ACTIVE',
    statusLabel: {
      uz: 'FAOL (Yulduzlararo fazodan 2026-yilda ham telemetriya uzatmoqda!)',
      en: 'ACTIVE IN 2026 (Transmitting Live Interstellar Telemetry!)'
    },
    launchYear: 1977,
    endYear: 2026,
    location: {
      uz: 'Yulduzlararo fazo (Ophiuchus), Yerdan 166.2 AU (24.9 mlrd km)',
      en: 'Interstellar Space (Ophiuchus), ~24.9 Billion km (166.2 AU)'
    },
    distanceFromEarthKm: 24890000000,
    signalDelayText: { uz: '46 soat 08 daqiqa (Ikki tomonlama radio signal)', en: '46 hrs 08 min (Round-trip Light Time)' },
    plannedDuration: { uz: '5 yil (Yupiter va Saturn missiyasi)', en: '5 Years (Jupiter & Saturn Flybys)' },
    actualDuration: { uz: '49 yil! (1977-yildan beri faol va aloqada!)', en: '49 Years! (Continuously Active Since Sept 1977!)' },
    nasaQuery: 'Voyager 1 Golden Record',
    fallbackImages: [
      {
        title: 'The Voyager Golden Record — Sounds and Images of Earth',
        url: 'https://images-assets.nasa.gov/image/PIA00342/PIA00342~orig.jpg',
        date: '1977-08-01'
      },
      {
        title: 'Voyager 1 Pale Blue Dot — Earth from 6 Billion Kilometers',
        url: 'https://images-assets.nasa.gov/image/PIA23645/PIA23645~orig.jpg',
        date: '1990-02-14'
      }
    ],
    firstPersonIntro: {
      uz: "Salom, Yer sayyorasi! Men Voyager 1 man! Men hozir Yerdan qariyb 25 milliard kilometr uzoqlikda — Quyoshning heliosferasidan tashqarida, haqiqiy yulduzlararo fazoda uchyapman! Mening kompyuterim xotirasi atigi 69 kilobayt (zamonaviy rasm faylidan 100 barobar kichik!), kameralarim va ko‘p isitgichlarim quvvatni tejash uchun o‘chirilgan, lekin mening yuragim — plazma va magnit datchiklarim 2026-yilda ham Yerga yulduzlararo fazo sirlarini yubormoqda!",
      en: "Hello, Pale Blue Dot! I am Voyager 1! I am currently nearly 25 billion kilometers away—beyond the Sun's heliosphere, flying through true interstellar space! My 1970s computer has just 69 kilobytes of memory, and engineers shut down my cameras and heaters to save power, yet in 2026 I am STILL ALIVE and beaming interstellar plasma data back to Earth!"
    },
    scienceSummary: {
      uz: "Voyager 1 Yupiterning Io yo‘ldoshida faol vulqonlarni, Saturnning Titan yo‘ldoshida qalin azot atmosferasini kashf etdi, 6 mlrd km dan Yerning mashhur 'Pale Blue Dot' (Xira Moviy Nuqta) suratini oldi va 2012-yilda yulduzlararo fazoga chiqqan ilk insoniyat elchisiga aylandi!",
      en: "Voyager 1 discovered active volcanoes on Jupiter's moon Io, revealed Titan's thick nitrogen atmosphere at Saturn, snapped the iconic 'Pale Blue Dot' portrait of Earth from 6 billion km, and in 2012 crossed the heliopause into interstellar space!"
    },
    hotspots: [
      {
        id: 'golden-record',
        x: 52,
        y: 62,
        name: { uz: 'Voyager Oltin Gramplastinkasi (The Golden Record)', en: '12-Inch Gold-Plated Copper "Voyager Golden Record"' },
        health2026: 100,
        statusType: 'ACTIVE',
        engineering: {
          uz: "Alyuminiy g‘ilof bilan himoyalangan 30 sm li oltin bilan qoplangan mis plastinka va igna. Ichida 55 tilda salomlashuv, Yer tovushlari (yomg‘ir, chaqaloq yig‘isi, yurak urishi), musiqa va 115 ta rasm yozilgan. Yaroqlilik muddati: 1 milliard yil!",
          en: "Encased in a protective aluminum jacket with a stylus cartridge and pure Uranium-238 clock. Contains greetings in 55 languages, sounds of Earth, music (Bach to Chuck Berry), and 115 images. Rated to last 1 billion years!"
        },
        science: {
          uz: "Insoniyat madaniyati va biologiyasining koinotdagi abadiy vaqt kapsulasi.",
          en: "Serves as humanity's ultimate cultural and scientific time capsule drifting through the Milky Way."
        }
      },
      {
        id: 'pws-mag',
        x: 84,
        y: 36,
        name: { uz: 'Plazma To‘lqinlari (PWS) va Yulduzlararo Magnitometr', en: 'Plasma Wave Subsystem (PWS) & Magnetometer' },
        health2026: 78,
        statusType: 'ACTIVE',
        engineering: {
          uz: "10 metrli ikkita antenna. Kameralar 1990-yilda o‘chirilgan bo‘lsa ham, ushbu datchiklar 2026-yilda ham ishlab turibdi va yulduzlararo muhit zichligini o‘lchamoqda!",
          en: "Two 10-meter V-antennas. Although Voyager's cameras were turned off in 1990 to save power, PWS and the Magnetometer remain ACTIVE in 2026, listening to the hum of interstellar plasma!"
        },
        science: {
          uz: "2012-yilda plazma zichligi 40 barobar oshganini o‘lchab, Voyager 1 Quyosh tizimidan yulduzlararo fazoga chiqqanini isbotladi!",
          en: "Detected the 40-fold jump in plasma density in 2012 that proved Voyager 1 had exited the solar heliosphere!"
        }
      },
      {
        id: 'mhw-rtg',
        x: 18,
        y: 52,
        name: { uz: '3 ta MHW-RTG Plutoniy-238 Yadroviy Batareyasi', en: 'Three MHW-RTG Plutonium-238 Nuclear Generators' },
        health2026: 46,
        statusType: 'PARTIAL',
        engineering: {
          uz: "1977-yilda 470 Vatt elektr bergan bo‘lsa, har yili quvvati ~4 Vattga kamayib, 2026-yilda ~215 Vatt atrofida ishlamoqda. Muhandislar asboblarni navbatma-navbat o‘chirib quvvatni tejashmoqda.",
          en: "Generated 470 Watts at launch in 1977; decays by ~4 Watts per year to ~215W in 2026. JPL engineers carefully shut down heaters and non-essential instruments to keep Voyager talking."
        },
        science: {
          uz: "Yarim asr davomida koinotning -270°C sovug‘ida uzluksiz energiya ta’minotini namoyish etdi.",
          en: "Demonstrated nearly half a century of continuous deep-space thermoelectric nuclear power generation."
        }
      },
      {
        id: 'fds-computer',
        x: 48,
        y: 42,
        name: { uz: '69 KB Xotirali Parvoz Ma’lumotlari Kompyuteri (FDS)', en: '69 KB Flight Data Subsystem (FDS) & S/X-Band Radio' },
        health2026: 72,
        statusType: 'ACTIVE',
        engineering: {
          uz: "2024-yilda xotira chipi buzilganda, NASA muhandislari 24 milliard km uzoqlikdagi kemaning kodini boshqa xotira kataklariga ko‘chirib, Voyager 1 ni mo‘jizaviy tarzda tuzatishdi!",
          en: "When a memory chip failed in 2024, JPL engineers beamed a custom code patch across 24 billion km to relocate the software into healthy memory slots—rescuing Voyager 1!"
        },
        science: {
          uz: "23 Vattli radio-uzatkich orqali Yerdagi Deep Space Network antennalariga sekundiga 160 bit tezlikda ma’lumot yuboradi.",
          en: "Transmits interstellar science data across 24.9 billion km at 160 bits per second using a 23-watt transmitter."
        }
      }
    ],
    timelineStates: [
      {
        year: 1979,
        label: { uz: '1979–1980: Yupiter va Saturn kashfiyotlari', en: '1979–1980: Historic Jupiter & Saturn Encounters' },
        power: 96,
        dust: 1,
        radiation: 35,
        temp: '-135°C',
        log: {
          uz: 'Barcha 11 ta ilmiy asbob va kameralar 100% faol. Io vulqonlari va Saturn halqalari suratga olindi.',
          en: 'All 11 science instruments and cameras 100% active. Active volcanoes discovered on Io; Titan atmosphere probed.'
        }
      },
      {
        year: 1990,
        label: { uz: '1990: "Pale Blue Dot" surati va kameralarning o‘chirilishi', en: '1990: "Pale Blue Dot" Portrait & Camera Shutdown' },
        power: 75,
        dust: 3,
        radiation: 60,
        temp: '-220°C',
        log: {
          uz: '6 mlrd km uzoqlikdan Yerning so‘nggi rasmi olindi va energiyani tejash uchun kameralar abadiy o‘chirildi.',
          en: 'Takes final Family Portrait of Earth from 6 billion km; cameras powered down permanently to save electricity.'
        }
      },
      {
        year: 2026,
        label: { uz: '2026: 166.2 AU — Yulduzlararo fazodan jonli aloqa!', en: '2026: 166.2 AU — Live in Interstellar Space!' },
        power: 46,
        dust: 6,
        radiation: 98,
        temp: '-269°C',
        log: {
          uz: '2024-yilgi FDS xotira ta’miridan so‘ng Voyager 1 yulduzlararo plazma va magnit ma’lumotlarini uzatishda davom etmoqda!',
          en: 'Following the heroic remote FDS memory rescue, Voyager 1 continues beaming interstellar telemetry in 2026!'
        }
      }
    ],
    quiz: {
      question: {
        uz: "Nima uchun NASA muhandislari 1990-yilda Voyager 1 ning kameralarini va keyinchalik bir nechta isitgichlarini o‘chirib qo‘yishgan?",
        en: "Why did NASA engineers intentionally turn off Voyager 1's cameras in 1990 and selectively shut down heaters over the years?"
      },
      options: [
        {
          uz: "Plutoniy-238 yadroviy batareyasi quvvati yiliga ~4 Vattga kamayib borayotgani sababli, eng muhim yulduzlararo datchiklar va radio-uzatkich ishlashi uchun elektrni tejash maqsadida",
          en: "Because its Plutonium-238 RTG power decays by ~4 Watts per year, so shutting down cameras conserved power for interstellar sensors and the radio transmitter"
        },
        {
          uz: "Yulduzlararo fazoda suratga olish taqiqlangani uchun",
          en: "Because interstellar dust broke the camera lenses in 1990"
        },
        {
          uz: "Kamera xotirasi to‘lib qolgani uchun",
          en: "Because its 69 KB memory ran out of space for photos"
        }
      ],
      correctIndex: 0,
      explanation: {
        uz: "Mutlaqo to‘g‘ri! Muhandislikda bu 'resurslarni oqilona boshqarish' deyiladi: kameralarni o‘chirish orqali tejalgan elektr Voyager 1 ga 2026-yilgacha yulduzlararo fazodan ma’lumot yuborish imkonini berdi!",
        en: "Spot on! By powering down the imaging cameras after the 'Pale Blue Dot' photo, engineers conserved vital watts so Voyager 1 could keep transmitting interstellar science in 2026!"
      }
    }
  }
];
