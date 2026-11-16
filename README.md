# ECHO-RELIC // 2035

NASA Space Apps Challenge uchun kosmik qurilmalar tarixini o‘rganish va vizual ko‘rsatish loyihasi.

## Demo
`index.html` — bitta fayldagi demo. GitHub Pages (branch `main`, folder `/ (root)`) orqali ochish mumkin.

## React dastlabki kodlari
`react-app/` ichida React + TypeScript, 3D apparatlar, katalog, NASA ma’lumotlari, CSS va funksiyalar mavjud.

Ishga tushirish:

```bash
cd react-app
npm install
npm run dev
```

## AI ishlashi
Bitta HTML demo internetga chiqarilmaguncha Gemini server funksiyalarini ishlatmaydi. Oddiy arxiv javoblari Gemini bilan teng emas. Jonli Gemini va sifatli bulutli ovoz uchun Netlify Functions (`netlify/functions/`) va server tomonida `GEMINI_API_KEY` talab qilinadi. **Hech qachon API kalitini GitHub'ga joylamang.**

NASA'ning ayrim 3D modellariga internetdan ulaniladi; bu muhit va tarmoq siyosatiga bog‘liq. Demo apparat geometriyalari hammasi NASA original modeliga aynan mos bo‘lishi kafolatlanmagan.

## Tahrirlash
React kodlari `react-app/src/` ostida; o‘zgarishlardan keyin yangi build yaratish zarur.

## Manbalar
`NASA_MANBALAR.txt` faylini ko‘ring.