# My Portfolio

A modern, animated portfolio website built for Akshay, a Full Stack Developer specializing in MERN stack, Next.js, and AWS.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)

## Features

- **Smooth Animations** - GSAP-powered animations for engaging user experience
- **Smooth Scrolling** - Lenis library for buttery-smooth scroll behavior
- **Dark Theme** - Modern dark UI with custom font variables
- **Project Case Studies** - Dedicated pages for each project with detailed breakdowns
- **Custom Cursor** - Enhanced interaction with custom cursor component
- **Responsive Design** - Mobile-first design using Tailwind CSS

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 |
| Animations | GSAP 3.12 |
| Smooth Scroll | Lenis 1.1 |
| Text Animations | Split Type 0.3 |

## Project Structure

```
my-portfolio/
├── app/
│   ├── layout.tsx          # Root layout with fonts and providers
│   ├── page.tsx            # Home page with all sections
│   ├── globals.css         # Global styles
│   └── projects/
│       └── [slug]/
│           └── page.tsx    # Dynamic project case study pages
├── components/
│   ├── Cursor.tsx          # Custom cursor component
│   ├── IntroOverlay.tsx    # Intro animation overlay
│   ├── LenisProvider.tsx   # Smooth scroll provider
│   ├── Navbar.tsx          # Navigation component
│   ├── project/
│   │   └── ProjectCaseStudy.tsx
│   └── sections/           # Page section components
├── lib/
│   └── data.ts             # Project data and content
└── public/                 # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

## Sections

The portfolio includes the following sections:

1. **Hero** - Introduction and headline
2. **Expertise** - Skills and services offered
3. **About** - Personal background
4. **Work** - Project showcase with slider
5. **Experience** - Professional timeline
6. **Contact** - Contact information and links

## Fonts

This project uses Google Fonts:

- **Noto Serif** - Headings and accents
- **Manrope** - Body text
- **Space Grotesk** - Technical/display text
- **Material Symbols Outlined** - Icons

## Deployment

The site can be deployed to any platform that supports Next.js:

- [Vercel](https://vercel.com) (recommended)
- Netlify
- AWS Amplify
- Docker

## License

MIT

---

Built with ❤️ using Next.js and Tailwind CSS
