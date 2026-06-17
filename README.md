# 🌧️ Vṛṣṭi — Online Clothing Store

> *Like rain nourishes the earth, Vṛṣṭi refreshes your wardrobe.*

A full-stack MERN (MongoDB, Express.js, React, Node.js) e-commerce clothing platform with a rain/nature-inspired design.

## Tech Stack

- **Frontend**: React 18 + Vite, React Router, Axios, CSS3
- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JWT + Google OAuth 2.0 (Passport.js)
- **File Uploads**: Multer

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google OAuth credentials (optional, for social login)

### Setup

1. **Clone and install:**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. **Configure environment:**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your values
   ```

3. **Seed the database:**
   ```bash
   cd server && npm run seed
   ```

4. **Run development servers:**
   ```bash
   # Terminal 1 — Backend
   cd server && npm run dev

   # Terminal 2 — Frontend
   cd client && npm run dev
   ```

5. Open `http://localhost:5173` in your browser.

## Features

- 🛍️ Browse clothing by categories, gender, age, size, color, price
- 🔍 Full-text search with real-time suggestions
- 🛒 Personalized shopping cart
- ❤️ Wishlist
- 💰 Virtual wallet system (₹10,000 starting balance)
- ⭐ Ratings & reviews (purchase-gated)
- 👤 User authentication (email/password + Google OAuth)
- 🔧 Admin panel for product management
- 🌧️ Beautiful rain-themed UI

## License

MIT
