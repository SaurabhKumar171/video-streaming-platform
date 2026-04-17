# 🎬 Video Streaming App

A full-stack video streaming platform built with Node.js, Express, MongoDB, and React. Supports secure uploads, streaming, and role-based access.

---

## 🚀 Features

- 🔐 JWT Authentication & Authorization  
- 📹 Video Upload & Streaming  
- ☁️ Cloudinary Integration  
- 👥 Role-Based Access (Viewer, Editor, Admin)  
- ⚡ Scalable Backend  
- 🎨 React + Vite Frontend  

---

## 📁 Project Structure

video-streaming-app/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
│
├── frontend/
│   ├── src/
│   └── index.html
│
└── README.md

---

## ⚙️ Installation Guide

### 🛠️ Phase 1: Environment Setup

Create a `.env` file in backend:

PORT=8000  
MONGO_URI=your_mongodb_atlas_uri  
JWT_SECRET=your_super_secret_key  

CLOUDINARY_CLOUD_NAME=your_name  
CLOUDINARY_API_KEY=your_key  
CLOUDINARY_API_SECRET=your_secret  

FRONTEND_URL=http://localhost:5173  
NODE_ENV=development  

---

### 🛰️ Phase 2: Backend Setup

cd backend  

Install dependencies:
npm install --legacy-peer-deps  

Install nodemon:
npm install -g nodemon  

Run server:
npm run dev  

Expected:
🚀 SYSTEM CORE INITIALIZED  

Server: http://localhost:8000  

---

### 💻 Phase 3: Frontend Setup

cd frontend  

Install:
npm install  

Create `.env`:

VITE_API_URL=http://localhost:8000  

Run:
npm run dev  

Frontend: http://localhost:5173  

---

## 🔗 Flow

Frontend → Backend → MongoDB + Cloudinary  

---

## 🧪 Testing

1. Start backend  
2. Start frontend  
3. Login/Register  
4. Upload videos  
5. Stream videos  

---

## ⚠️ Common Issues

Dependency error:
npm install --legacy-peer-deps  

Port issue:
Change PORT in .env  

Cloudinary error:
Check credentials  

---

## 📌 Tech Stack

Frontend: React, Vite  
Backend: Node.js, Express  
Database: MongoDB  
Storage: Cloudinary  
Auth: JWT  

---

## 👨‍💻 Author

Saurabh Kumar Jha  

---

## 📄 License

MIT License



advance-features.md
