# AI Exam: Frontend

React 19 + Vite, Tailwind CSS v4, shadcn/ui and Font Awesome.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## What's included

- **Tailwind CSS v4** via `@tailwindcss/vite` (see `src/index.css`)
- **shadcn/ui** configured (`components.json`, `@/` alias, theme variables in `src/index.css`)
  with `Button` and `Card` in `src/components/ui`. Add more components with:
  ```bash
  npx shadcn@latest add dialog input table
  ```
- **Font Awesome** (solid, regular and brand icons):
  ```jsx
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
  import { faHouse } from "@fortawesome/free-solid-svg-icons"
  <FontAwesomeIcon icon={faHouse} />
  ```
- **Plain CSS** in `src/App.css` for anything outside Tailwind

## Scripts

- `npm run dev`: start dev server
- `npm run build`: production build into `dist/`
- `npm run preview`: preview the build
- `npm run lint`: lint with oxlint
