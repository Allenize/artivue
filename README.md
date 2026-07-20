<p align="center">
  <img src="public/artivue-logo.png" alt="Artivue Logo" width="180">
</p>

<h1 align="center">Artivue</h1>

<p align="center">
A web platform for discovering, showcasing, and exploring digital artwork.
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/Allenize/artivue?style=flat-square">
  <img src="https://img.shields.io/github/stars/Allenize/artivue?style=flat-square">
  <img src="https://img.shields.io/github/forks/Allenize/artivue?style=flat-square">
  <img src="https://img.shields.io/github/last-commit/Allenize/artivue?style=flat-square">
</p>

---

## Overview

Artivue (internally named `artistic-vision` in `package.json`) is a single-page React application for discovering, showcasing, and discussing digital artwork. It's built with Vite and uses Firebase (Auth + Firestore) as its backend, and is deployed to Vercel at [artivue-tawny.vercel.app](https://artivue-tawny.vercel.app).

## Features

- **Email/password auth** — sign up and log in via Firebase Authentication, with user profiles stored in Firestore
- **Home, Explore, and Gallery screens** — browse curated and searchable collections of artworks and artists
- **Artwork detail & artist profile pages** — dedicated routes for individual artworks (`/artwork/:id`) and artists (`/artist/:id`)
- **Favorites** — save artworks to a personal favorites list
- **Community feed** — post, like, comment, and sort discussions by newest, most liked, or most discussed
- **Admin dashboard** (`/admin`, role-gated) — create, edit, and delete artworks and artists, including image uploads
- **Animated UI** — transitions and micro-interactions powered by Framer Motion, icons from Lucide


## Tech Stack

- **React 18** with **React Router v6** for client-side routing
- **Vite 5** as the build tool/dev server
- **Firebase** (`firebase/auth`, `firebase/firestore`) for authentication and data storage
- **Framer Motion** for animation
- **Lucide React** for icons
- Deployed on **Vercel** (see `vercel.json`)

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Allenize/artivue.git
cd artivue
```

### Install dependencies

```bash
npm install
```

### Configure Firebase

The app expects a Firebase project with **Authentication** (Email/Password) and **Firestore** enabled. Firebase config currently lives in `src/firebase/config.js` — replace the values there with your own project's credentials if you're standing up your own backend, rather than committing real keys to source control.

### Run the dev server

```bash
npm run dev
```

Vite will start a local dev server (default: `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview   # optional, serves the production build locally
```

## Project Structure

```
artivue
├── public/
│   └── artivue-logo.png
├── src/
│   ├── admin/
│   │   └── AdminScreen.jsx        # Role-gated dashboard for managing artworks/artists
│   ├── components/                # AppShell, Sidebar, ImageUpload, logo components
│   ├── context/
│   │   └── AppContext.jsx         # Global app state (auth, data, favorites, etc.)
│   ├── firebase/
│   │   ├── config.js              # Firebase app initialization
│   │   ├── auth.js                # Register/login/logout helpers
│   │   └── db.js                  # Firestore CRUD for artworks/artists/etc.
│   ├── screens/                   # Home, Explore, Gallery, Artwork/Artist detail,
│   │   │                          # Community, Login, Splash screens
│   ├── App.jsx                    # Route definitions
│   ├── main.jsx                   # React entry point
│   └── index.css
├── index.html
├── vite.config.js
├── vercel.json
├── package.json
└── README.md
```

## Contributing

Contributions are welcome. Feel free to fork the repository and submit a pull request.

## License

No license file is currently included in this repository, so the project defaults to standard copyright — all rights reserved unless the maintainer adds a license.
