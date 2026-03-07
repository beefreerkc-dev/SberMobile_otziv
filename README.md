# Монитор отзывов СберМобайл

Прототип веб-приложения для сбора и отображения отзывов о СберМобайле с Otzovik, Яндекс.Карт, RuStore, 2ГИС и ВКонтакте. This version uses **mock data** for the current week (March 1–7, 2026).

## Features

- **Header** — Title and subtitle
- **Statistics** — Total reviews, positive/neutral/negative counts, daily trend chart, distribution by source (pie chart)
- **Filters** — By source, date range, sentiment; state synced to URL query params for shareable links
- **Reviews list** — Cards with source, date, text (expandable “read more”), sentiment, optional rating; “Load more” pagination
- **Responsive** — Desktop: sidebar filters; mobile: filters in a slide-out panel (hamburger-style trigger)
- **Брендинг** — цвета СберМобайл (основной зелёный `#2dbd4f`, тёмно-зелёный `#1e7e34`, светлый фон)

## Tech stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS** for styling
- **Recharts** for bar and pie charts
- **Lucide React** for icons
- **React Router** for URL state (query params)

## Run locally

```bash
cd SberMobile_otziv
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Filter state is in the URL (e.g. `?sources=otzovik,yandex&sentiment=positive`), so you can share links with the same filters.

## Deploy on Vercel (через GitHub)

1. Создайте репозиторий на [GitHub](https://github.com/new), например `SberMobile_otziv`.
2. В папке проекта выполните:
   ```bash
   cd SberMobile_otziv
   git init
   git add .
   git commit -m "Initial commit: Монитор отзывов СберМобайл"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/SberMobile_otziv.git
   git push -u origin main
   ```
   (подставьте свой логин вместо `YOUR_USERNAME` и URL вашего репозитория).
3. Зайдите на [vercel.com](https://vercel.com), войдите через GitHub.
4. **Add New… → Project** → выберите репозиторий `SberMobile_otziv`.
5. Настройки оставьте как есть (Vercel подставит Build Command и Output Directory из `vercel.json`).
6. Нажмите **Deploy**. После сборки получите ссылку на прототип.

## Build

```bash
npm run build
npm run preview   # serve production build
```

## Project structure

- `src/App.tsx` — Router and main page
- `src/components/` — Header, Statistics, Filters, ReviewCard, ReviewList
- `src/data/mockReviews.ts` — Static mock reviews (March 1–7, 2026)
- `src/hooks/useFilterFromUrl.ts` — Read/write filters from URL
- `src/lib/filterReviews.ts` — Filter logic and date formatting
- `src/types.ts` — Review, FilterState, source labels
