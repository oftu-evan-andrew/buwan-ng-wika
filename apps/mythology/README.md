# Likha: Philippine Mythology

A scroll-based interactive website showcasing 8 creatures and figures from Philippine folklore.

---

## Featured Characters

1. **Diwata** – Forest guardian spirit from ancient Anito traditions.
2. **Kapre** – Tree-dwelling giant who smokes an endless cigar.
3. **Tikbalang** – Half-human, half-horse creature that leads travelers astray.
4. **Bakunawa** – Giant sea serpent believed to cause eclipses by eating the moon.
5. **Aswang** – Shape-shifter of Visayan folklore.
6. **Maria Makiling** – Mountain protector of Mount Makiling.
7. **Daragang Magayon** – The maiden from the Bicol legend of Mount Mayon.
8. **Lam-Ang** – The warrior hero from the Ilocano epic *Biag ni Lam-Ang*.

---

## Tech Stack

- **React 18**
- **Tailwind CSS**
- **GSAP (ScrollTrigger)** – scroll-driven timeline & transitions
- **Three.js** – background particle / atmosphere effects
- **Lucide React & Radix UI** – UI icons and dialog components

---

## Setup & Local Development

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Start the dev server
```bash
npm start
```
Runs at `http://localhost:3000`.

---

## Build

To create an optimized production build:

```bash
cd frontend
npm run build
```

The output files will be in `frontend/build`, ready to deploy on platforms like Vercel or Netlify.

---

## Project Structure

```text
Mythology/
├── frontend/
│   ├── public/              # Images, assets, audio
│   ├── src/
│   │   ├── components/      # UI components & WebGL canvas
│   │   ├── data/            # Character stories and data (myths.js)
│   │   ├── App.js           # Main scroll timeline & stage
│   │   ├── App.css          # Core animations & custom styles
│   │   └── index.css        # Tailwind config / theme variables
│   ├── package.json
│   └── craco.config.js
└── README.md
```
