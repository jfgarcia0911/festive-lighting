# 🎄 Festive Lighting Pros

A full-stack web app for a holiday & permanent lighting business — a marketing
site with an instant quote estimator that captures leads through a REST API.

Built as a portfolio project to demonstrate a modern **React + Node.js** stack.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)
![Node](https://img.shields.io/badge/Node-Express-339933?logo=node.js&logoColor=white)

## ✨ Features

- **Responsive marketing site** — hero, services, gallery, process, and footer
- **Live quote estimator** — price updates instantly as the user picks a package
  and enters their roofline length
- **Lead capture API** — the quote form submits to an Express backend that
  validates, recalculates the estimate server-side, and stores the lead
- **CRM-ready** — a clearly marked hook shows where leads forward to a real CRM

## 🛠️ Tech Stack

| Layer     | Tech                                  |
|-----------|---------------------------------------|
| Frontend  | React, Vite, Tailwind CSS v4          |
| Backend   | Node.js, Express                      |
| Storage   | JSON file (swappable for a database)  |

## 📂 Project Structure

festive-lighting/
├── src/                      # React frontend
│   ├── components/           # UI sections (Navbar, Hero, QuoteForm, ...)
│   │   └── ui/               # Reusable UI (Button)
│   ├── data/                 # Site content config
│   ├── App.jsx               # Page composition
│   └── index.css             # Tailwind import + theme
├── server/                   # Node.js + Express API
│   └── src/
│       ├── routes/           # Route definitions
│       ├── controllers/      # Request handlers
│       ├── middleware/       # Request validation
│       ├── lib/              # Lead storage
│       ├── app.js            # Express app setup
│       └── index.js          # Server entry point
└── README.md


## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### 1. Frontend
```bash
npm install
npm run dev          # http://localhost:5173
2. Backend

cd server
npm install
cp .env.example .env
npm run dev          # http://localhost:4000
Run both at the same time (two terminals) and submit the quote form — the lead
is saved to server/data/leads.json.

🔌 API Endpoints
Method	Endpoint	Description
POST	/api/quote	Submit a quote request
GET	/api/quotes	List all captured leads
GET	/api/health	Health check
🗺️ Roadmap
 Persist leads in a real database (PostgreSQL / MongoDB)
 Forward leads to a CRM (HubSpot / GoHighLevel) via webhook
 Email notification on new lead
 Admin dashboard to view submissions
👤 Author
John Garcia — Full-Stack Developer
