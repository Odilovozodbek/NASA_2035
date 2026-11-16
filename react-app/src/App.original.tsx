import React, { useState, useEffect, useRef } from 'react';
import {
  Radar,
  Radio,
  BatteryCharging,
  Cpu,
  Compass,
  Sparkles,
  Award,
  MessageSquare,
  Microscope,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Volume2,
  VolumeX,
  Globe,
  Send,
  Eye,
  Zap,
  Thermometer,
  ShieldAlert,
  Camera,
  ChevronRight,
  Info,
  HelpCircle,
  Trophy,
  RefreshCw,
  ExternalLink,
  Layers
} from 'lucide-react';

// ============================================================================
// DATASET: 6 ICONIC NASA RELICS ACROSS THE MOON, MARS, AND DEEP SPACE
// ============================================================================
const RELICS_DATA = [
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
        url: 'https://images-assets.nasa.gov/image/as11-40-5952/as11-40-5952~orig.jpg',
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
        url: 'https://images-assets.nasa.gov/image/ARC-1972-AC72-1228/ARC-1972-AC72-1228~orig.jpg',
        date: '1972-02-25'
      },
      {
        title: 'Pioneer 10 Spacecraft Artist Concept at Jupiter',
        url: 'https://images-assets.nasa.gov/image/ARC-1973-AC73-9311/ARC-1973-AC73-9311~orig.jpg',
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

// ============================================================================
// CUSTOM SVG SPACECRAFT SCHEMATIC RENDERER (X-RAY BLUEPRINT ENGINE)
// ============================================================================
const SpacecraftBlueprintSVG = ({ relicId, xrayMode, dustLevel, activeHotspotId, pingWave }) => {
  const strokeMain = xrayMode ? '#22d3ee' : '#38bdf8';
  const strokeInternal = xrayMode ? '#f43f5e' : 'rgba(56, 189, 248, 0.25)';
  const fillBody = xrayMode ? 'rgba(8, 47, 73, 0.35)' : 'rgba(15, 23, 42, 0.85)';

  return (
    <svg
      viewBox="0 0 800 460"
      className="w-full h-full select-none transition-all duration-500"
      style={{ filter: xrayMode ? 'drop-shadow(0 0 12px rgba(34,211,238,0.35))' : 'none' }}
    >
      <defs>
        <pattern id="blueprintGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" />
          <circle cx="20" cy="20" r="0.8" fill="rgba(56, 189, 248, 0.25)" />
        </pattern>
        <linearGradient id="solarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" stopOpacity={xrayMode ? 0.35 : 0.75} />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity={xrayMode ? 0.35 : 0.85} />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Background Technical Grid */}
      <rect width="800" height="460" fill="url(#blueprintGrid)" />

      {/* Technical HUD Corner Brackets */}
      <g stroke="rgba(34, 211, 238, 0.45)" strokeWidth="2" fill="none">
        <path d="M 18 45 L 18 18 L 45 18" />
        <path d="M 755 18 L 782 18 L 782 45" />
        <path d="M 18 415 L 18 442 L 45 442" />
        <path d="M 755 442 L 782 442 L 782 415" />
      </g>

      {/* Ping Radar Wave Effect */}
      {pingWave && (
        <g>
          <circle cx="400" cy="230" r="60" fill="none" stroke="#22d3ee" strokeWidth="3" opacity="0.8">
            <animate attributeName="r" from="20" to="380" dur="1.4s" repeatCount="1" />
            <animate attributeName="opacity" from="0.9" to="0" dur="1.4s" repeatCount="1" />
          </circle>
          <circle cx="400" cy="230" r="20" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.6">
            <animate attributeName="r" from="10" to="320" dur="1.4s" begin="0.2s" repeatCount="1" />
            <animate attributeName="opacity" from="0.8" to="0" dur="1.4s" begin="0.2s" repeatCount="1" />
          </circle>
        </g>
      )}

      {/* 1. APOLLO 15 LUNAR ROVING VEHICLE (LRV) */}
      {relicId === 'apollo-lrv' && (
        <g transform="translate(0, 10)">
          {/* Lunar Terrain Horizon */}
          <path d="M 40 365 Q 240 345 420 362 T 760 355" fill="none" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="2" strokeDasharray="6 4" />
          {/* Chassis Frame */}
          <rect x="210" y="245" width="360" height="28" rx="6" fill={fillBody} stroke={strokeMain} strokeWidth="2.5" />
          {/* Internal X-Ray Wiring & Dual 36V Ag-Zn Battery Pack */}
          <rect x="335" y="195" width="95" height="50" rx="4" fill={xrayMode ? 'rgba(244,63,94,0.25)' : 'rgba(30,41,59,0.9)'} stroke={xrayMode ? '#fb7185' : strokeMain} strokeWidth="2" />
          <text x="382" y="224" textAnchor="middle" fill="#f8fafc" fontSize="11" fontFamily="monospace">2x 36V Ag-Zn</text>
          {xrayMode && (
            <path d="M 382 245 L 382 260 L 195 260 M 382 260 L 585 260" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />
          )}
          {/* Astronaut Seats */}
          <path d="M 305 245 L 290 175 L 265 175 M 455 245 L 440 175 L 415 175" fill="none" stroke={strokeMain} strokeWidth="4" strokeLinecap="round" />
          {/* High-Gain Umbrella Antenna (Left/Front) */}
          <line x1="272" y1="245" x2="272" y2="115" stroke={strokeMain} strokeWidth="3" />
          <path d="M 212 125 Q 272 60 332 125 Z" fill="rgba(56, 189, 248, 0.18)" stroke={strokeMain} strokeWidth="2" />
          <line x1="272" y1="92" x2="272" y2="62" stroke="#fbbf24" strokeWidth="2.5" />
          {/* RCA Color TV Camera (Right/Front) */}
          <line x1="544" y1="245" x2="544" y2="165" stroke={strokeMain} strokeWidth="3" />
          <rect x="522" y="142" width="48" height="28" rx="4" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="1.5" />
          <circle cx="574" cy="156" r="7" fill="#0ea5e9" stroke="#e0f2fe" strokeWidth="1.5" />
          {/* Woven Mesh Wheels (Left & Right) */}
          {[195, 585].map((cx, idx) => (
            <g key={idx}>
              <circle cx={cx} cy="320" r="56" fill="rgba(15, 23, 42, 0.65)" stroke={strokeMain} strokeWidth="3" strokeDasharray="8 3" />
              <circle cx={cx} cy="320" r="42" fill="none" stroke={strokeInternal} strokeWidth="1.5" />
              <circle cx={cx} cy="320" r="16" fill="#0f172a" stroke="#fbbf24" strokeWidth="2.5" />
              {[0, 30, 60, 90, 120, 150].map(angle => (
                <line
                  key={angle}
                  x1={cx - 54 * Math.cos((angle * Math.PI) / 180)}
                  y1={320 - 54 * Math.sin((angle * Math.PI) / 180)}
                  x2={cx + 54 * Math.cos((angle * Math.PI) / 180)}
                  y2={320 + 54 * Math.sin((angle * Math.PI) / 180)}
                  stroke="rgba(148, 163, 184, 0.35)"
                  strokeWidth="1"
                />
              ))}
            </g>
          ))}
        </g>
      )}

      {/* 2. SURVEYOR 3 & APOLLO LASER RETROREFLECTOR (LRRR) */}
      {relicId === 'surveyor-lrrr' && (
        <g transform="translate(0, 10)">
          <path d="M 40 375 Q 380 350 760 375" fill="none" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="2" strokeDasharray="6 4" />
          {/* Incoming & Returning Green Earth Laser Beam! */}
          <line x1="90" y1="20" x2="416" y2="165" stroke="#10b981" strokeWidth="3" strokeDasharray="10 6">
            <animate attributeName="stroke-dashoffset" from="32" to="0" dur="0.8s" repeatCount="indefinite" />
          </line>
          <line x1="416" y1="165" x2="120" y2="20" stroke="#34d399" strokeWidth="2" opacity="0.75" />
          <text x="155" y="52" fill="#34d399" fontSize="11" fontFamily="monospace">532nm EARTH LASER PULSE (ACTIVE 2026)</text>

          {/* Tripod Lander Frame */}
          <polygon points="360,130 265,330 465,330" fill={fillBody} stroke={strokeMain} strokeWidth="2.5" />
          {/* Landing Pads */}
          <line x1="265" y1="330" x2="185" y2="365" stroke={strokeMain} strokeWidth="4" />
          <line x1="465" y1="330" x2="555" y2="365" stroke={strokeMain} strokeWidth="4" />
          <rect x="155" y="362" width="55" height="10" rx="3" fill="#38bdf8" />
          <rect x="530" y="362" width="55" height="10" rx="3" fill="#38bdf8" />

          {/* LRRR 100 Corner-Cube Prism Array */}
          <g transform="translate(366, 138)">
            <rect x="0" y="0" width="105" height="62" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
            {[0, 1, 2, 3, 4].map(col =>
              [0, 1, 2].map(row => (
                <circle key={`${col}-${row}`} cx={15 + col * 19} cy={14 + row * 17} r="6.5" fill="rgba(16, 185, 129, 0.35)" stroke="#34d399" strokeWidth="1.2" />
              ))
            )}
          </g>

          {/* Soil Mechanics Scoop Arm (Left) */}
          <path d="M 295 275 L 220 295 L 195 320 L 235 305" fill="none" stroke="#fbbf24" strokeWidth="3" />
          <rect x="200" y="290" width="32" height="22" fill="url(#goldGrad)" />

          {/* Retrieved TV Camera Mount (Right) */}
          <rect x="520" y="225" width="52" height="58" rx="4" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
          <text x="546" y="258" textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="monospace">APOLLO 12 CUT</text>
        </g>
      )}

      {/* 3. OPPORTUNITY ROVER (MER-B) */}
      {relicId === 'opportunity-rover' && (
        <g transform="translate(0, 10)">
          {/* Martian Horizon */}
          <path d="M 40 375 Q 290 355 510 368 T 760 360" fill="none" stroke="rgba(251, 146, 60, 0.45)" strokeWidth="2" strokeDasharray="6 4" />
          {/* Solar Array Wings (Perspective Trapezoid) */}
          <polygon points="150,195 635,195 575,248 210,248" fill="url(#solarGrad)" stroke={strokeMain} strokeWidth="2.5" />
          {/* Solar Cell Grid Lines */}
          <line x1="270" y1="195" x2="295" y2="248" stroke="rgba(186, 230, 253, 0.35)" strokeWidth="1.5" />
          <line x1="395" y1="195" x2="395" y2="248" stroke="rgba(186, 230, 253, 0.35)" strokeWidth="1.5" />
          <line x1="515" y1="195" x2="490" y2="248" stroke="rgba(186, 230, 253, 0.35)" strokeWidth="1.5" />

          {/* Warm Electronics Box (WEB Body) */}
          <rect x="285" y="248" width="215" height="62" rx="6" fill={fillBody} stroke="#fbbf24" strokeWidth="2.5" />
          {xrayMode && (
            <g>
              <rect x="305" y="258" width="85" height="40" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="347" y="282" textAnchor="middle" fill="#fda4af" fontSize="10" fontFamily="monospace">WEB + RHU</text>
              <rect x="405" y="258" width="75" height="40" fill="rgba(34, 211, 238, 0.2)" stroke="#22d3ee" strokeWidth="1.5" />
              <text x="442" y="282" textAnchor="middle" fill="#a5f3fc" fontSize="10" fontFamily="monospace">RAD6000 CPU</text>
            </g>
          )}

          {/* Pancam Mast Assembly */}
          <line x1="464" y1="205" x2="464" y2="88" stroke={strokeMain} strokeWidth="5" />
          <rect x="432" y="64" width="66" height="28" rx="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
          <circle cx="448" cy="78" r="6" fill="#22d3ee" />
          <circle cx="482" cy="78" r="6" fill="#22d3ee" />

          {/* Instrument Deployment Device (IDD Robotic Arm & Spectrometers) */}
          <path d="M 500 285 L 575 245 L 625 278" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="628" cy="282" r="18" fill="#1e293b" stroke="#fbbf24" strokeWidth="2.5" />
          <text x="628" y="286" textAnchor="middle" fill="#fde047" fontSize="9" fontFamily="monospace">APXS</text>

          {/* 6-Wheel Rocker-Bogie Suspension */}
          <path d="M 215 348 L 265 295 L 365 348 M 365 348 L 430 290 L 545 348" fill="none" stroke={strokeMain} strokeWidth="3.5" />
          {[215, 365, 545].map((cx, i) => (
            <g key={i}>
              <circle cx={cx} cy="348" r="32" fill="#0f172a" stroke={strokeMain} strokeWidth="3" />
              <circle cx={cx} cy="348" r="20" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx={cx} cy="348" r="7" fill="#38bdf8" />
            </g>
          ))}
        </g>
      )}

      {/* 4. INGENUITY MARS HELICOPTER (GINNY) */}
      {relicId === 'ingenuity-heli' && (
        <g transform="translate(0, 10)">
          <path d="M 60 380 Q 400 345 740 380" fill="none" stroke="rgba(251, 146, 60, 0.45)" strokeWidth="2" strokeDasharray="6 4" />
          {/* Top Solar Array */}
          <rect x="330" y="45" width="140" height="18" rx="3" fill="url(#solarGrad)" stroke="#10b981" strokeWidth="2" />
          {/* Central Mast */}
          <line x1="400" y1="63" x2="400" y2="185" stroke={strokeMain} strokeWidth="6" />
          {/* Coaxial Carbon-Fiber Rotors (Showing Flight 72 Damaged Tip on Right!) */}
          <path d="M 145 102 Q 270 86 400 102 Q 530 86 645 102 Q 530 116 400 102 Q 270 116 145 102 Z" fill="rgba(56, 189, 248, 0.25)" stroke={strokeMain} strokeWidth="2" />
          <path d="M 160 132 Q 280 118 400 132 Q 510 118 595 132 L 585 142 Q 500 138 400 132 Q 280 146 160 132 Z" fill="rgba(244, 63, 94, 0.22)" stroke="#fb7185" strokeWidth="2" strokeDasharray="8 2" />
          <circle cx="600" cy="135" r="14" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
          <text x="665" y="139" fill="#fda4af" fontSize="10" fontFamily="monospace">FLIGHT 72 TIP DAMAGE</text>

          {/* Tissue-Box Avionics Fuselage */}
          <rect x="335" y="185" width="130" height="115" rx="8" fill={fillBody} stroke="#fbbf24" strokeWidth="2.5" />
          {xrayMode && (
            <g>
              <rect x="352" y="200" width="96" height="45" rx="4" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1.5" />
              <text x="400" y="226" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">6x SONY Li-ION</text>
              <rect x="352" y="252" width="96" height="32" rx="4" fill="rgba(34, 211, 238, 0.25)" stroke="#22d3ee" strokeWidth="1.5" />
              <text x="400" y="272" textAnchor="middle" fill="#a5f3fc" fontSize="10" fontFamily="monospace">SNAPDRAGON 801</text>
            </g>
          )}
          {/* Downward NavCam & RTE Camera */}
          <circle cx="400" cy="312" r="14" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="400" cy="312" r="5" fill="#34d399" />

          {/* 4 Ultra-Light Carbon Fiber Landing Legs */}
          <line x1="340" y1="275" x2="215" y2="372" stroke={strokeMain} strokeWidth="3.5" />
          <line x1="355" y1="295" x2="275" y2="375" stroke={strokeMain} strokeWidth="2.5" />
          <line x1="460" y1="275" x2="585" y2="372" stroke={strokeMain} strokeWidth="3.5" />
          <line x1="445" y1="295" x2="525" y2="375" stroke={strokeMain} strokeWidth="2.5" />
        </g>
      )}

      {/* 5. PIONEER 10 DEEP SPACE PROBE */}
      {relicId === 'pioneer-10' && (
        <g transform="translate(0, 5)">
          {/* 2.74m Parabolic Dish Antenna */}
          <ellipse cx="400" cy="160" rx="165" ry="62" fill="rgba(30, 41, 59, 0.85)" stroke={strokeMain} strokeWidth="3" />
          <ellipse cx="400" cy="160" rx="115" ry="40" fill="none" stroke={strokeInternal} strokeWidth="1.5" strokeDasharray="5 5" />
          {/* Feed Horn Struts */}
          <line x1="290" y1="145" x2="400" y2="62" stroke={strokeMain} strokeWidth="2.5" />
          <line x1="510" y1="145" x2="400" y2="62" stroke={strokeMain} strokeWidth="2.5" />
          <rect x="382" y="48" width="36" height="20" rx="3" fill="#0ea5e9" />

          {/* Hexagonal Equipment Compartment */}
          <polygon points="335,222 465,222 485,295 315,295" fill={fillBody} stroke={strokeMain} strokeWidth="2.5" />

          {/* SNAP-19 RTG Boom (Left) */}
          <line x1="325" y1="245" x2="125" y2="215" stroke={strokeMain} strokeWidth="3.5" />
          <rect x="92" y="192" width="44" height="46" rx="4" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="2" />
          <text x="114" y="219" textAnchor="middle" fill="#fda4af" fontSize="9" fontFamily="monospace">RTG</text>

          {/* 6.5m Helium Vector Magnetometer Boom (Right) */}
          <line x1="475" y1="245" x2="700" y2="215" stroke={strokeMain} strokeWidth="3" strokeDasharray="8 3" />
          <circle cx="705" cy="215" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />

          {/* Famous Gold-Anodized Pioneer Plaque */}
          <rect x="385" y="242" width="58" height="40" rx="3" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="2" />
          <circle cx="400" cy="256" r="5" fill="none" stroke="#451a03" strokeWidth="1.2" />
          <line x1="418" y1="250" x2="418" y2="274" stroke="#451a03" strokeWidth="1.5" />
          <line x1="430" y1="252" x2="430" y2="274" stroke="#451a03" strokeWidth="1.5" />
        </g>
      )}

      {/* 6. VOYAGER 1 INTERSTELLAR PROBE */}
      {relicId === 'voyager-1' && (
        <g transform="translate(0, 5)">
          {/* 3.7-Meter High-Gain Parabolic Dish */}
          <ellipse cx="400" cy="148" rx="175" ry="66" fill="rgba(15, 23, 42, 0.9)" stroke={strokeMain} strokeWidth="3" />
          <ellipse cx="400" cy="148" rx="125" ry="44" fill="none" stroke={strokeInternal} strokeWidth="1.5" />
          <line x1="280" y1="130" x2="400" y2="48" stroke={strokeMain} strokeWidth="2.5" />
          <line x1="520" y1="130" x2="400" y2="48" stroke={strokeMain} strokeWidth="2.5" />
          <circle cx="400" cy="48" r="12" fill="#10b981" />

          {/* Decagonal Bus (10-sided main body + 69KB FDS Computer) */}
          <rect x="330" y="214" width="140" height="86" rx="8" fill={fillBody} stroke={strokeMain} strokeWidth="2.5" />
          {xrayMode && (
            <text x="400" y="245" textAnchor="middle" fill="#22d3ee" fontSize="11" fontFamily="monospace">69 KB FDS MEMORY</text>
          )}

          {/* The Voyager Golden Record (Center-Right of Bus) */}
          <circle cx="416" cy="276" r="24" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="2" />
          <circle cx="416" cy="276" r="6" fill="#78350f" />

          {/* Three MHW-RTG Plutonium-238 Boom (Left) */}
          <line x1="330" y1="255" x2="145" y2="235" stroke={strokeMain} strokeWidth="4" />
          <rect x="105" y="214" width="58" height="38" rx="5" fill="rgba(245, 158, 11, 0.25)" stroke="#fbbf24" strokeWidth="2" />
          <text x="134" y="237" textAnchor="middle" fill="#fde047" fontSize="9" fontFamily="monospace">3x RTG</text>

          {/* 10m Plasma Wave Subsystem (PWS) Antennas & Science Boom (Right) */}
          <line x1="470" y1="240" x2="695" y2="145" stroke="#10b981" strokeWidth="2.5" />
          <line x1="470" y1="265" x2="705" y2="295" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="672" cy="165" r="12" fill="rgba(16, 185, 129, 0.3)" stroke="#34d399" strokeWidth="2" />
        </g>
      )}

      {/* Environmental Dust / Weathering Particle Overlay Driven by Time Slider */}
      {dustLevel > 10 && (
        <g opacity={Math.min(0.85, dustLevel / 115)}>
          <rect
            x="0"
            y="0"
            width="800"
            height="460"
            fill={relicId.includes('opportunity') || relicId.includes('ingenuity') ? 'rgba(194, 65, 12, 0.18)' : 'rgba(148, 163, 184, 0.12)'}
          />
          {[80, 160, 240, 320, 410, 490, 580, 670, 720].map((px, idx) => (
            <circle
              key={idx}
              cx={px}
              cy={(idx * 67) % 390 + 30}
              r={(idx % 3) + 1.5}
              fill={relicId.includes('opportunity') || relicId.includes('ingenuity') ? '#fdba74' : '#cbd5e1'}
            />
          ))}
        </g>
      )}

      {/* X-Ray Diagnostic Sweeping Laser Scanline */}
      {xrayMode && (
        <line x1="20" y1="0" x2="780" y2="0" stroke="#22d3ee" strokeWidth="2" opacity="0.7">
          <animate attributeName="y1" values="20;440;20" dur="4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="20;440;20" dur="4s" repeatCount="indefinite" />
        </line>
      )}
    </svg>
  );
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Language State ('uz' or 'en')
  const [lang, setLang] = useState('uz');

  // Region & Selected Relic State
  const [selectedRegion, setSelectedRegion] = useState('moon'); // 'moon' | 'mars' | 'deepspace'
  const [selectedRelicId, setSelectedRelicId] = useState('apollo-lrv');

  // Selected Hotspot & Time Slider State
  const [selectedHotspotId, setSelectedHotspotId] = useState('wheels');
  const [timelineIndex, setTimelineIndex] = useState(2); // 0: Launch, 1: Mid, 2: 2026 Present
  const [xrayMode, setXrayMode] = useState(true);

  // Right Panel Active Tab ('science' | 'chat')
  const [rightTab, setRightTab] = useState('science');

  // Ping Telemetry Effect & Audio State
  const [pingActive, setPingActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [liveDistanceOffset, setLiveDistanceOffset] = useState(0);

  // Student Progress / XP & Quiz State
  const [solvedQuizzes, setSolvedQuizzes] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);

  // NASA Live Image API State
  const [nasaPhotos, setNasaPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [activePhotoModal, setActivePhotoModal] = useState(null);

  // Black-Box AI Chat State
  const [chatHistory, setChatHistory] = useState({});
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Derived Current Relic & Hotspot
  const currentRelic = RELICS_DATA.find(r => r.id === selectedRelicId) || RELICS_DATA[0];
  const currentHotspot =
    currentRelic.hotspots.find(h => h.id === selectedHotspotId) || currentRelic.hotspots[0];
  const currentTimeline = currentRelic.timelineStates[timelineIndex] || currentRelic.timelineStates[2];

  // Total XP Calculation (250 XP per solved quiz + 50 XP base)
  const solvedCount = Object.keys(solvedQuizzes).length;
  const totalXP = solvedCount * 250;

  // Live Distance Ticker for Deep Space Probes (Voyager 1 moves ~17 km/s, Pioneer 10 ~11.8 km/s)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDistanceOffset(prev => prev + 1.7);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Sync default hotspot & reset quiz selection when relic changes
  useEffect(() => {
    setSelectedHotspotId(currentRelic.hotspots[0].id);
    setTimelineIndex(2);
    setSelectedAnswer(
      solvedQuizzes[currentRelic.id] !== undefined ? currentRelic.quiz.correctIndex : null
    );
  }, [selectedRelicId]);

  // Fetch Real Historical Imagery from NASA Image and Video Library API
  useEffect(() => {
    let isMounted = true;
    const fetchNasaImages = async () => {
      setLoadingPhotos(true);
      try {
        const res = await fetch(
          `https://images-api.nasa.gov/search?q=${encodeURIComponent(
            currentRelic.nasaQuery
          )}&media_type=image`
        );
        const data = await res.json();
        const items = data?.collection?.items || [];
        const parsed = items
          .slice(0, 4)
          .map(item => ({
            title: item.data?.[0]?.title || currentRelic.name.en,
            url: item.links?.[0]?.href,
            date: (item.data?.[0]?.date_created || '').slice(0, 10)
          }))
          .filter(img => img.url);

        if (isMounted) {
          setNasaPhotos(parsed.length > 0 ? parsed : currentRelic.fallbackImages);
        }
      } catch (e) {
        if (isMounted) {
          setNasaPhotos(currentRelic.fallbackImages);
        }
      } finally {
        if (isMounted) setLoadingPhotos(false);
      }
    };

    fetchNasaImages();
    return () => {
      isMounted = false;
    };
  }, [selectedRelicId]);

  // Web Audio Synthesizer for Sci-Fi Telemetry Ping & UI Clicks
  const playSynthTone = (type = 'ping') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'ping') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.18);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc.start(now);
        osc.stop(now + 0.65);
      } else if (type === 'hotspot') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(780, now + 0.06);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(1046.5, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      // Audio context blocked or unsupported
    }
  };

  // Trigger Telemetry Ping
  const handlePingSignal = () => {
    playSynthTone('ping');
    setPingActive(true);
    setTimeout(() => setPingActive(false), 1500);
  };

  // Switch Region Handler
  const handleSelectRegion = region => {
    setSelectedRegion(region);
    const firstInRegion = RELICS_DATA.find(r => r.region === region);
    if (firstInRegion) {
      setSelectedRelicId(firstInRegion.id);
    }
    playSynthTone('hotspot');
  };

  // Handle Quiz Option Selection
  const handleQuizAnswer = idx => {
    setSelectedAnswer(idx);
    if (idx === currentRelic.quiz.correctIndex) {
      playSynthTone('success');
      setSolvedQuizzes(prev => ({ ...prev, [currentRelic.id]: true }));
    } else {
      playSynthTone('hotspot');
    }
  };

  // Generate First-Person Black-Box AI Response (Gemini API + Instant Rich Fallbacks)
  const handleSendChatMessage = async customQuestion => {
    const questionText = (customQuestion || chatInput).trim();
    if (!questionText || isAiTyping) return;

    const currentMessages = chatHistory[currentRelic.id] || [
      { role: 'model', text: currentRelic.firstPersonIntro[lang] }
    ];

    const updatedMessages = [...currentMessages, { role: 'user', text: questionText }];
    setChatHistory(prev => ({ ...prev, [currentRelic.id]: updatedMessages }));
    if (!customQuestion) setChatInput('');
    setIsAiTyping(true);
    playSynthTone('hotspot');

    // Prepare fallback response in case offline or API throttled
    const buildSmartFallback = q => {
      const lower = q.toLowerCase();
      if (lower.includes('kashfiyot') || lower.includes('discover') || lower.includes('science')) {
        return `🔬 [${currentRelic.name[lang]}]: ${currentRelic.scienceSummary[lang]}`;
      }
      if (lower.includes('2026') || lower.includes('holat') || lower.includes('work') || lower.includes('status')) {
        return `📡 [${currentRelic.name[lang]} — 2026 Telemetry]: ${currentRelic.timelineStates[2].log[lang]} (${currentHotspot.name[lang]}: ${currentHotspot.health2026}%)`;
      }
      return `🚀 [${currentRelic.name[lang]}]: ${currentHotspot.engineering[lang]} ${currentHotspot.science[lang]}`;
    };

    try {
      const apiKey = '';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const systemPrompt = `You are the living "Black Box" AI memory of the NASA spacecraft "${currentRelic.name.en}" (${currentRelic.name.uz}), located at ${currentRelic.location.en}.
Speak in the FIRST PERSON ("I", "Men") with an inspiring, warm, educational tone suitable for school-age space enthusiasts and NASA hackathon judges.
Respond in ${lang === 'uz' ? 'Uzbek language (O‘zbek tilida)' : 'English'}.
Keep your answer concise (2-4 sentences) and scientifically accurate based on these facts:
- Status in 2026: ${currentRelic.statusLabel.en}
- Science unlocked: ${currentRelic.scienceSummary.en}
- Hardware details: ${currentRelic.hotspots.map(h => `${h.name.en} (${h.health2026}% in 2026)`).join(', ')}.`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: questionText }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      if (!response.ok) throw new Error('API fallback');
      const data = await response.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || buildSmartFallback(questionText);

      setChatHistory(prev => ({
        ...prev,
        [currentRelic.id]: [...updatedMessages, { role: 'model', text: reply }]
      }));
    } catch (err) {
      setChatHistory(prev => ({
        ...prev,
        [currentRelic.id]: [
          ...updatedMessages,
          { role: 'model', text: buildSmartFallback(questionText) }
        ]
      }));
    } finally {
      setIsAiTyping(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAiTyping]);

  const activeMessages = chatHistory[currentRelic.id] || [
    { role: 'model', text: currentRelic.firstPersonIntro[lang] }
  ];

  // Status Badge Helper
  const getStatusStyle = status => {
    if (status === 'ACTIVE')
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]';
    if (status === 'PARTIAL')
      return 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]';
    return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
  };

  return (
    <div className="min-h-screen bg-[#050b16] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      {/* ==================================================================== */}
      {/* TOP MISSION CONTROL HEADER                                           */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-30 bg-[#071022]/90 backdrop-blur-md border-b border-cyan-500/25 px-3 sm:px-6 py-2.5">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.25)]">
              <Radar className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-wider text-base sm:text-lg bg-gradient-to-r from-cyan-300 via-sky-200 to-emerald-300 bg-clip-text text-transparent">
                  ECHO-RELIC // 2035
                </span>
                <span className="hidden md:inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  NASA Space Apps 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {lang === 'uz'
                  ? 'Tashlab ketilgan kosmik qurilmalar diagnostikasi va jonli xotirasi'
                  : "Abandoned But Not Forgotten — Space Hardware Diagnostic & Living Memory"}
              </p>
            </div>
          </div>

          {/* 3 Region Selector Tabs */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/70">
            {[
              { id: 'moon', labelUz: '🌙 OY (MOON)', labelEn: '🌙 THE MOON', count: 2 },
              { id: 'mars', labelUz: '🔴 MARS', labelEn: '🔴 MARS', count: 2 },
              { id: 'deepspace', labelUz: '🌌 OCHIQ KOINOT', labelEn: '🌌 DEEP SPACE', count: 2 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleSelectRegion(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                  selectedRegion === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{lang === 'uz' ? tab.labelUz : tab.labelEn}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/50 text-cyan-200">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Right Controls: Ping, XP Badge, Judge Pitch, Language & Sound */}
          <div className="flex items-center gap-2">
            {/* Live Telemetry Ping Button */}
            <button
              onClick={handlePingSignal}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            >
              <Radio className={`w-4 h-4 ${pingActive ? 'animate-ping text-emerald-200' : ''}`} />
              <span className="hidden sm:inline">
                {lang === 'uz' ? 'PING SIGNAL' : 'SEND PING'}
              </span>
            </button>

            {/* Student Detective XP & Certificate Button */}
            <button
              onClick={() => setShowCertificateModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Space Relic Detective Badge"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{totalXP} XP</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-200">
                {solvedCount}/6
              </span>
            </button>

            {/* Judge Pitch / Presentation Helper Modal */}
            <button
              onClick={() => setShowPitchModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/40 text-purple-300 text-xs font-bold flex items-center gap-1 transition-all"
              title="Hackathon Pitch Script & Architecture"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{lang === 'uz' ? 'Pitch & Info' : 'Judge Pitch'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300"
              title="Toggle Telemetry Audio"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Language Switcher UZ / EN */}
            <button
              onClick={() => setLang(lang === 'uz' ? 'en' : 'uz')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN 3-COLUMN MISSION CONTROL WORKSPACE                              */}
      {/* ==================================================================== */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ------------------------------------------------------------------ */}
        {/* LEFT COLUMN (3 cols): RELIC SELECTOR & LIVE TELEMETRY METRICS      */}
        {/* ------------------------------------------------------------------ */}
        <section className="lg:col-span-3 flex flex-col gap-3">
          <div className="bg-[#09152b]/90 border border-slate-800 rounded-2xl p-3.5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                {lang === 'uz' ? '1. Kosmik Qurilmani Tanlang' : '1. Select Discarded Hardware'}
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedRegion.toUpperCase()}
              </span>
            </div>

            {/* Cards for Relics in Current Region */}
            <div className="space-y-2.5">
              {RELICS_DATA.filter(r => r.region === selectedRegion).map(relic => {
                const isSelected = relic.id === selectedRelicId;
                const isQuizDone = solvedQuizzes[relic.id];
                return (
                  <button
                    key={relic.id}
                    onClick={() => {
                      setSelectedRelicId(relic.id);
                      playSynthTone('hotspot');
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.18)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getStatusStyle(
                          relic.status
                        )}`}
                      >
                        ● {relic.status}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isQuizDone && (
                          <span className="text-emerald-400 text-xs flex items-center gap-0.5 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" /> +250XP
                          </span>
                        )}
                        <span className="text-xs font-mono text-slate-400">{relic.launchYear}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-white leading-snug mb-1">
                      {relic.name[lang]}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-2.5">
                      {relic.subtitle[lang]}
                    </p>

                    <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
                      <div className="bg-slate-950/60 px-2 py-1 rounded">
                        <span className="text-slate-500 block text-[9px] uppercase font-mono">
                          {lang === 'uz' ? 'Reja bo‘yicha' : 'Planned'}
                        </span>
                        <span className="text-slate-200 font-medium">{relic.plannedDuration[lang]}</span>
                      </div>
                      <div className="bg-cyan-950/30 px-2 py-1 rounded border border-cyan-500/20">
                        <span className="text-cyan-400 block text-[9px] uppercase font-mono">
                          {lang === 'uz' ? 'Amalda ishladi' : 'Actual Legacy'}
                        </span>
                        <span className="text-cyan-200 font-semibold">{relic.actualDuration[lang]}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick All-6 Relics Switcher Pills */}
            <div className="mt-3 pt-3 border-t border-slate-800/80">
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-2">
                {lang === 'uz' ? 'Barcha 6 ta missiya tezkor ro‘yxati:' : 'Quick Jump (All 6 Relics):'}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {RELICS_DATA.map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelectedRegion(r.region);
                      setSelectedRelicId(r.id);
                      playSynthTone('hotspot');
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-medium truncate flex items-center justify-between border ${
                      r.id === selectedRelicId
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{r.name.en.split(' ')[0]} {r.name.en.split(' ')[1]}</span>
                    {solvedQuizzes[r.id] ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    ) : (
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          r.status === 'ACTIVE'
                            ? 'bg-emerald-400'
                            : r.status === 'PARTIAL'
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live NASA JPL Horizons Distance & Signal Delay Box */}
          <div className="bg-[#09152b]/90 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-emerald-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                {lang === 'uz' ? 'Jonli Telemetriya (2026)' : 'Live DSN Telemetry (2026)'}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                JPL HORIZONS
              </span>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                {lang === 'uz' ? 'Yerdan masofa (Real vaqtda):' : 'Distance from Earth (Live):'}
              </div>
              <div className="text-base font-mono font-bold text-cyan-300 tracking-tight mt-0.5">
                {(
                  currentRelic.distanceFromEarthKm +
                  (currentRelic.region === 'deepspace' ? liveDistanceOffset : 0)
                ).toLocaleString(undefined, { maximumFractionDigits: 1 })}{' '}
                km
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{currentRelic.signalDelayText[lang]}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 bg-slate-900/70 rounded-xl p-2.5 border border-slate-800/80">
              <span className="text-slate-500 font-mono uppercase text-[10px] block">
                {lang === 'uz' ? 'Joylashuv koordinatasi:' : 'Coordinates / Sector:'}
              </span>
              {currentRelic.location[lang]}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* CENTER STAGE (5 cols): INTERACTIVE X-RAY SCANNER & TIME SLIDER     */}
        {/* ------------------------------------------------------------------ */}
        <section className="lg:col-span-5 flex flex-col gap-3">
          {/* Interactive Blueprint & Hotspot Scanner Card */}
          <div className="bg-[#081226] border border-cyan-500/30 rounded-2xl p-3.5 shadow-2xl flex flex-col relative overflow-hidden">
            {/* Scanner Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getStatusStyle(
                      currentRelic.status
                    )}`}
                  >
                    {currentRelic.statusLabel[lang]}
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-black text-white mt-1">
                  {currentRelic.name[lang]}
                </h1>
              </div>

              {/* X-Ray Diagnostic Toggle */}
              <button
                onClick={() => {
                  setXrayMode(!xrayMode);
                  playSynthTone('hotspot');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 transition-all ${
                  xrayMode
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{xrayMode ? 'X-RAY: ON' : 'X-RAY: OFF'}</span>
              </button>
            </div>

            {/* Instruction Banner */}
            <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl px-3 py-1.5 mb-2.5 flex items-center justify-between text-xs text-cyan-200">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-bounce" />
                {lang === 'uz'
                  ? 'Qurilma ustidagi 4 ta miltillovchi nuqtani bosing va ichki qismlarini tekshiring!'
                  : 'Click the 4 pulsing hardware nodes on the blueprint to inspect 2026 functionality!'}
              </span>
              <span className="font-mono text-[10px] text-cyan-400 shrink-0 ml-2">
                {currentTimeline.year} VIEW
              </span>
            </div>

            {/* Interactive SVG Schematic Canvas with Clickable Hotspots */}
            <div className="relative w-full aspect-[16/9] bg-[#040914] rounded-xl border border-slate-800 overflow-hidden">
              <SpacecraftBlueprintSVG
                relicId={currentRelic.id}
                xrayMode={xrayMode}
                dustLevel={currentTimeline.dust}
                activeHotspotId={selectedHotspotId}
                pingWave={pingActive}
              />

              {/* Pulsing Interactive Hotspot Pins */}
              {currentRelic.hotspots.map((spot, idx) => {
                const isSelected = spot.id === selectedHotspotId;
                const dotColor =
                  spot.statusType === 'ACTIVE'
                    ? 'bg-emerald-400 border-emerald-200'
                    : spot.statusType === 'PARTIAL'
                    ? 'bg-amber-400 border-amber-200'
                    : 'bg-rose-500 border-rose-200';

                return (
                  <button
                    key={spot.id}
                    onClick={() => {
                      setSelectedHotspotId(spot.id);
                      playSynthTone('hotspot');
                    }}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    className={` -translate-x-1/2 -translate-y-1/2 absolute z-20 group focus:outline-none`}
                  >
                    <span
                      className={`absolute -inset-2 rounded-full animate-ping opacity-75 ${
                        isSelected ? 'bg-cyan-400' : dotColor.split(' ')[0]
                      }`}
                    />
                    <div
                      className={`relative w-7 h-7 rounded-full border-2 flex items-center justify-center font-mono text-xs font-black transition-transform ${
                        isSelected
                          ? 'scale-125 bg-cyan-400 text-slate-950 border-white shadow-[0_0_20px_#22d3ee]'
                          : `${dotColor} text-slate-950 hover:scale-110`
                      }`}
                    >
                      {idx + 1}
                    </div>
                    {/* Tooltip Label */}
                    <div
                      className={`pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 rounded bg-slate-950/95 border border-cyan-500/40 text-[10px] font-mono whitespace-nowrap transition-opacity ${
                        isSelected ? 'opacity-100 text-cyan-300' : 'opacity-0 group-hover:opacity-100 text-slate-200'
                      }`}
                    >
                      {spot.name[lang].slice(0, 28)} ({spot.health2026}%)
                    </div>
                  </button>
                );
              })}

              {/* Ping Signal Overlay Toast */}
              {pingActive && (
                <div className="absolute inset-x-4 bottom-3 bg-emerald-950/90 border border-emerald-400/60 text-emerald-200 px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between shadow-lg animate-pulse">
                  <span>
                    📡 PING: {currentRelic.name[lang]} ({currentRelic.signalDelayText[lang]})
                  </span>
                  <span className="font-bold">{currentRelic.status}</span>
                </div>
              )}
            </div>

            {/* Selected Hotspot Diagnostic Detail Box */}
            <div className="mt-3 bg-slate-900/90 border border-cyan-500/30 rounded-xl p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
                    #{currentRelic.hotspots.findIndex(h => h.id === currentHotspot.id) + 1}
                  </span>
                  <h3 className="font-bold text-sm text-cyan-200">{currentHotspot.name[lang]}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    {lang === 'uz' ? '2026 Ishlash holati:' : '2026 Functionality:'}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      currentHotspot.health2026 > 70
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : currentHotspot.health2026 > 20
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {currentHotspot.health2026}%
                  </span>
                </div>
              </div>

              {/* Health Progress Bar */}
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden mb-2.5 border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 ${
                    currentHotspot.health2026 > 70
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                      : currentHotspot.health2026 > 20
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-rose-600 to-orange-500'
                  }`}
                  style={{ width: `${Math.max(4, currentHotspot.health2026)}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">
                    ⚙️ {lang === 'uz' ? 'Muhandislik Diagnostikasi (2026)' : 'Engineering Status (2026)'}
                  </span>
                  <p className="text-slate-300 leading-relaxed">{currentHotspot.engineering[lang]}</p>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-1">
                    🔬 {lang === 'uz' ? 'Ushbu qism ochgan ilmiy kashfiyot' : 'Science Unlocked by Component'}
                  </span>
                  <p className="text-slate-300 leading-relaxed">{currentHotspot.science[lang]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* TIME & ENVIRONMENT DECAY SLIDER (VAQT VA MUHIT SLAYDERI)         */}
          {/* ---------------------------------------------------------------- */}
          <div className="bg-[#09152b]/90 border border-slate-800 rounded-2xl p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase text-amber-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {lang === 'uz'
                  ? '2. Vaqt va Kosmik Muhit Slayderi (1967–2026)'
                  : '2. Time-Lapse Environmental Decay Simulator'}
              </span>
              <span className="text-xs font-bold text-white bg-amber-500/20 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
                {currentTimeline.label[lang]}
              </span>
            </div>

            {/* 3-Step Timeline Buttons + Range Slider */}
            <div className="px-1 my-2">
              <input
                type="range"
                min={0}
                max={2}
                step={1}
                value={timelineIndex}
                onChange={e => {
                  setTimelineIndex(Number(e.target.value));
                  playSynthTone('hotspot');
                }}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                {currentRelic.timelineStates.map((st, idx) => (
                  <button
                    key={st.year}
                    onClick={() => {
                      setTimelineIndex(idx);
                      playSynthTone('hotspot');
                    }}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      timelineIndex === idx
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                        : 'hover:text-slate-200'
                    }`}
                  >
                    {idx === 0
                      ? `${st.year} (Launch)`
                      : idx === 1
                      ? `${st.year} (Mid-Mission)`
                      : `${st.year} (Present)`}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Live Environmental Gauges */}
            <div className="grid grid-cols-4 gap-2 mt-2.5">
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
                <BatteryCharging className="w-4 h-4 text-emerald-400 mx-auto mb-0.5" />
                <div className="text-[10px] text-slate-400 font-mono">
                  {lang === 'uz' ? 'Energiya' : 'Power'}
                </div>
                <div className="text-sm font-mono font-bold text-emerald-300">
                  {currentTimeline.power}%
                </div>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
                <Layers className="w-4 h-4 text-amber-400 mx-auto mb-0.5" />
                <div className="text-[10px] text-slate-400 font-mono">
                  {lang === 'uz' ? 'Chang / Eroziya' : 'Dust / Wear'}
                </div>
                <div className="text-sm font-mono font-bold text-amber-300">
                  {currentTimeline.dust}%
                </div>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
                <ShieldAlert className="w-4 h-4 text-rose-400 mx-auto mb-0.5" />
                <div className="text-[10px] text-slate-400 font-mono">
                  {lang === 'uz' ? 'Radiatsiya' : 'Radiation'}
                </div>
                <div className="text-sm font-mono font-bold text-rose-300">
                  {currentTimeline.radiation} krad
                </div>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
                <Thermometer className="w-4 h-4 text-cyan-400 mx-auto mb-0.5" />
                <div className="text-[10px] text-slate-400 font-mono">
                  {lang === 'uz' ? 'Harorat' : 'Surface Temp'}
                </div>
                <div className="text-sm font-mono font-bold text-cyan-300">
                  {currentTimeline.temp}
                </div>
              </div>
            </div>

            <p className="mt-2.5 text-xs text-slate-300 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800/80 font-mono">
              📋 {currentTimeline.log[lang]}
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* RIGHT COLUMN (4 cols): SCIENCE + QUIZ & BLACK-BOX AI STORYTELLER   */}
        {/* ------------------------------------------------------------------ */}
        <section className="lg:col-span-4 flex flex-col gap-3">
          {/* Tab Switcher */}
          <div className="bg-[#09152b]/90 border border-slate-800 rounded-2xl p-3.5 flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-3">
              <button
                onClick={() => {
                  setRightTab('science');
                  playSynthTone('hotspot');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  rightTab === 'science'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Microscope className="w-4 h-4" />
                <span>{lang === 'uz' ? 'Ilmiy Meros va Viktorina' : 'Science & Detective Quiz'}</span>
              </button>
              <button
                onClick={() => {
                  setRightTab('chat');
                  playSynthTone('hotspot');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  rightTab === 'chat'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{lang === 'uz' ? 'Qora Quti AI Suhbat' : 'Black-Box AI Chat'}</span>
              </button>
            </div>

            {/* TAB 1: SCIENCE UNLOCKED, NASA API ARCHIVE & MISSION QUIZ */}
            {rightTab === 'science' ? (
              <div className="flex-1 flex flex-col justify-between space-y-3">
                {/* Science Discovery Story Card */}
                <div className="bg-gradient-to-br from-cyan-950/50 to-slate-900/90 border border-cyan-500/30 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-300 mb-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {lang === 'uz'
                      ? 'Ushbu qurilma insoniyatga nima berdi?'
                      : 'Science Made Possible by This Hardware'}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {currentRelic.scienceSummary[lang]}
                  </p>
                </div>

                {/* Live NASA Image & Video Library API Gallery */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase text-slate-300 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                      {lang === 'uz'
                        ? 'NASA API Haqiqiy Arxiv Suratlari'
                        : 'Live NASA Image Library Archive'}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      images-api.nasa.gov
                    </span>
                  </div>

                  {loadingPhotos ? (
                    <div className="h-24 flex items-center justify-center text-xs text-slate-400 font-mono animate-pulse">
                      Fetching NASA Mission Imagery...
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {nasaPhotos.slice(0, 2).map((photo, i) => (
                        <button
                          key={i}
                          onClick={() => setActivePhotoModal(photo)}
                          className="group relative h-24 rounded-lg overflow-hidden border border-slate-700 hover:border-cyan-400 transition-all text-left"
                        >
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={e => {
                              e.target.src =
                                'https://images-assets.nasa.gov/image/PIA17944/PIA17944~orig.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent p-1.5 flex flex-col justify-end">
                            <span className="text-[10px] text-white font-medium line-clamp-1">
                              {photo.title}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interactive "Space Relic Detective" Engineering Quiz */}
                <div className="bg-slate-900/95 border border-amber-500/40 rounded-xl p-3.5 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase text-amber-300 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      {lang === 'uz'
                        ? 'Yosh Kosmik Muhandis Sinovi (+250 XP)'
                        : 'Space Relic Detective Challenge (+250 XP)'}
                    </span>
                    {solvedQuizzes[currentRelic.id] && (
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                        ✓ SOLVED
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-white mb-2.5">
                    {currentRelic.quiz.question[lang]}
                  </p>

                  <div className="space-y-2">
                    {currentRelic.quiz.options.map((opt, idx) => {
                      const isPicked = selectedAnswer === idx;
                      const isCorrect = idx === currentRelic.quiz.correctIndex;
                      let btnStyle =
                        'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-600';
                      if (selectedAnswer !== null) {
                        if (isCorrect) {
                          btnStyle =
                            'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-medium';
                        } else if (isPicked && !isCorrect) {
                          btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(idx)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-start gap-2 ${btnStyle}`}
                        >
                          <span className="font-mono font-bold text-cyan-400 shrink-0">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span>{opt[lang]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedAnswer !== null && (
                    <div
                      className={`mt-2.5 p-2.5 rounded-lg text-xs border ${
                        selectedAnswer === currentRelic.quiz.correctIndex
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                          : 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                      }`}
                    >
                      {currentRelic.quiz.explanation[lang]}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* TAB 2: BLACK-BOX AI FIRST-PERSON STORYTELLER */
              <div className="flex-1 flex flex-col h-[520px]">
                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-2.5 mb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      {currentRelic.name[lang]} — AI QORA QUTI XOTIRASI
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">1-SHAXS HIKOYA</span>
                </div>

                {/* Chat Messages Scroll Container */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 bg-slate-950/70 rounded-xl p-3 border border-slate-800">
                  {activeMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-cyan-600 text-white rounded-br-none'
                            : 'bg-slate-900 border border-emerald-500/30 text-slate-200 rounded-bl-none'
                        }`}
                      >
                        {msg.role === 'model' && (
                          <div className="text-[10px] font-mono text-emerald-400 mb-1 font-bold">
                            🤖 {currentRelic.name[lang]}:
                          </div>
                        )}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="text-xs font-mono text-emerald-400 animate-pulse px-2">
                      📡 Decoding telemetry transmission...
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Preset Quick-Ask Buttons for Students & Live Demo */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {[
                    lang === 'uz'
                      ? '🔬 Eng katta kashfiyoting nima?'
                      : '🔬 What was your biggest discovery?',
                    lang === 'uz'
                      ? '⚙️ 2026-yilda qaysi qisming ishlayapti?'
                      : '⚙️ Which parts still work in 2026?',
                    lang === 'uz'
                      ? '🚀 Kelajak astronavtlariga xabaring?'
                      : '🚀 Message for future astronauts?'
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendChatMessage(q)}
                      className="text-[11px] bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-200 px-2.5 py-1 rounded-full transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Custom Chat Input */}
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSendChatMessage();
                  }}
                  className="mt-2.5 flex gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder={
                      lang === 'uz'
                        ? `${currentRelic.name.uz.split(' ')[0]} ga savol yozing...`
                        : `Ask ${currentRelic.name.en} a question...`
                    }
                    className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isAiTyping}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white text-xs font-bold flex items-center gap-1 hover:opacity-95 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ==================================================================== */}
      {/* MODAL 1: SPACE RELIC DETECTIVE CERTIFICATE & XP PROGRESS             */}
      {/* ==================================================================== */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b172e] border-2 border-amber-400/60 rounded-2xl max-w-lg w-full p-6 text-center relative shadow-[0_0_50px_rgba(245,158,11,0.25)]">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-9 h-9 text-amber-400" />
            </div>

            <div className="text-xs font-mono uppercase tracking-widest text-amber-400">
              NASA Space Apps Challenge 2026 // Official Badge
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              SPACE RELIC DETECTIVE
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {lang === 'uz'
                ? 'Oy, Mars va Ochiq koinotdagi NASA merosini o‘rganish sertifikati'
                : 'Certificate of Mastery in Lunar, Martian & Deep Space Hardware Archaeology'}
            </p>

            <div className="my-4 bg-slate-950/90 border border-slate-800 rounded-xl p-4">
              <div className="text-3xl font-mono font-black text-amber-300">
                {totalXP} / 1500 XP
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {lang === 'uz'
                  ? `Yechilgan muhandislik jumboqlari: ${solvedCount} / 6`
                  : `Solved Hardware Engineering Mysteries: ${solvedCount} / 6`}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                {RELICS_DATA.map(r => (
                  <div
                    key={r.id}
                    className={`p-2 rounded-lg border text-[11px] font-mono ${
                      solvedQuizzes[r.id]
                        ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {solvedQuizzes[r.id] ? '★ ' : '○ '}
                    {r.name.en.split(' ')[0]}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowCertificateModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider"
            >
              {lang === 'uz' ? 'Tadqiqotni davom ettirish' : 'Continue Mission Exploration'}
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: HACKATHON JUDGE PITCH & DEMO GUIDE                          */}
      {/* ==================================================================== */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#09152b] border border-cyan-400/50 rounded-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto relative">
            <button
              onClick={() => setShowPitchModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <span className="text-xs font-mono uppercase text-cyan-400">
              NASA Space Apps 2026 — Fergana & Global Judging Guide
            </span>
            <h2 className="text-xl font-black text-white mt-1 mb-3">
              Why ECHO-RELIC Wins "Abandoned but not Forgotten"
            </h2>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <h3 className="font-bold text-cyan-300 mb-1">
                  1. How We Differ From Other Submissions (Offworld Legacy / Mission Archives)
                </h3>
                <p>
                  Instead of a static Wikipedia-style catalog of dates, ECHO-RELIC turns school-age students into
                  <strong> Space Hardware Diagnostics Engineers</strong>. Students inspect interactive X-Ray blueprints,
                  test which parts still work in 2026 (like the battery-free Apollo Laser Retroreflector and Ingenuity's
                  active weather computer!), simulate 50+ years of dust/radiation decay, and chat with the spacecraft in
                  the 1st person.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <h3 className="font-bold text-emerald-300 mb-1">
                  2. NASA Open Data & APIs Integrated
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>NASA Image and Video Library API</strong> (`images-api.nasa.gov`) for real mission photography.</li>
                  <li><strong>NASA JPL Horizons & Deep Space Network (DSN)</strong> telemetry metrics for live AU distance & light-time delay.</li>
                  <li><strong>NASA NSSDCA & LRO/MRO Orbital Assessments</strong> for accurate 2026 component functionality percentages.</li>
                </ul>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-amber-500/30">
                <h3 className="font-bold text-amber-300 mb-1">
                  3. 60-Second Live Stage Pitch Script (English)
                </h3>
                <p className="italic text-slate-200">
                  "Hello Judges! Since the 1960s, NASA has left iconic hardware across the Moon, Mars, and Deep Space.
                  Most people call it 'space junk'—and existing apps just show boring tables of dates. We built
                  ECHO-RELIC to bring these silent pioneers to life for students! With one click, students scan the
                  internal anatomy of Apollo 15's rover, Opportunity, Ingenuity, and Voyager 1. They discover that
                  Apollo's laser mirror on the Moon still reflects Earth lasers in 2026 without batteries, and
                  Ingenuity still logs Martian weather every morning despite a broken rotor! With our Time-Decay
                  Slider, NASA Image API, and 1st-person Black-Box AI, ECHO-RELIC proves that NASA's hardware is
                  abandoned, but never forgotten!"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: NASA PHOTO LIGHTBOX                                         */}
      {/* ==================================================================== */}
      {activePhotoModal && (
        <div
          onClick={() => setActivePhotoModal(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
          >
            <img
              src={activePhotoModal.url}
              alt={activePhotoModal.title}
              className="w-full max-h-[65vh] object-contain bg-black"
            />
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white">{activePhotoModal.title}</h4>
                <span className="text-xs font-mono text-cyan-400">
                  NASA Official Archive • {activePhotoModal.date}
                </span>
              </div>
              <button
                onClick={() => setActivePhotoModal(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700"
              >
                {lang === 'uz' ? 'Yopish' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}