# NASA_2035 — ECHO-RELIC // 2035

NASA Space Apps loyihasi: tarixiy kosmik apparatlar katalogi, 3D ko‘rinish, diagnostika, ma’lumotlar va AI arxiv chat.

## Demo (GitHub Pages)
Repozitoriyda `index.html` va `site/segment-01.txt` dan `site/segment-07.txt` gacha demo qismlari mavjud. `index.html` ularni internet orqali birlashtirib yuklaydi.

GitHub → **Settings → Pages** → **Deploy from a branch** → **main** → **/(root)** → **Save**.

Saytning kutilayotgan manzili: https://odilovozodbek.github.io/NASA_2035/

## Manba kod
Tahrir qilinadigan React/TypeScript fayllari `react-app/` katalogida, jumladan `src/App.tsx`, komponentlar, katalog va 3D Viewer. `netlify/functions/` ichida server AI, model proksi va TTS funksiyalari bor.

## Muhim cheklovlar
* GitHub Pages faqat statik sahifani xizmat qiladi: `netlify/functions/` funksiyalari bu yerda avtomatik ishlamaydi.
* Jonli Gemini AI va bulutli nutq uchun serverga xavfsiz o‘rnatilgan `GEMINI_API_KEY` hamda Netlify kabi funksiyalarni bajaradigan hosting talab etiladi.
* Demo AI'ning arxiv rejimi jonli Gemini emas.
* Ba’zi 3D shakllar dasturiy chizilgan namunalardir. Barcha modellarni NASA'ning asl GLB modellari bilan bir xilligiga kafolat berilmaydi.
* Maxfiy API kalitlarini repozitoriyga joylamang.
