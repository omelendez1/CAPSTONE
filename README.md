# Card Generator – MERN Capstone Project

A full-stack MERN (MongoDB, Express, React, Node) web application that allows users to **generate, save, and manage custom cards** with authentication, profile management, and CRUD functionality.

---

## 🌐 Live Demo

[👉 **View the deployed app on Netlify**](#)  
(*Replace `#` with your actual Netlify link once deployed.*)

---

## 📸 Screenshots

> _(Add screenshots here for visual context)_  

- **Landing Page / Home View**  
![Home Screenshot](./public/1 Home.jpg)

- **Card Generation View**  
![Card Generation Screenshot](./public/2 Collection.jpg)

- **Delete Profile Confirmation Modal**  
![Delete Profile Screenshot](./public/3 delete.jpg)

---

## 📝 Project Overview

The **Card Generator** project is designed to demonstrate full-stack development skills, combining a **React frontend** with a **Node/Express backend** and **MongoDB database**.  

Users can:  
✅ **Register and log in** securely  
✅ **Generate new cards dynamically**  
✅ **Save, view, and manage cards**  
✅ **Delete their profile** (with confirmation)  

---

## 🚀 Features

- **User Authentication**  
  - Registration, login, logout  
  - Token-based authentication stored securely  

- **Profile Management**  
  - Users can delete their account and all associated cards  

- **CRUD Operations**  
  - Create: Generate and save cards  
  - Read: View generated cards  
  - Update: (Future enhancement – editing saved cards)  
  - Delete: Delete saved cards or entire profile  

- **Frontend**  
  - React Hooks for state management  
  - React Router for navigation  
  - Responsive modals for login, welcome messages, and profile deletion  

- **Backend**  
  - RESTful API with Express  
  - MongoDB database with Mongoose models  
  - Secure password handling & validation  

---

## 🏗 Tech Stack

- **Frontend:** React, React Router, CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Atlas)  
- **Authentication:** JWT (JSON Web Token)  
- **Deployment:**  
  - Frontend → Netlify (or Vercel)  
  - Backend → Render/Heroku  
  - Database → MongoDB Atlas  

---

## 📂 Project Structure

```
Card-Generator/
├── backend/            # Express + MongoDB API
│   ├── models/         # User & Card Mongoose schemas
│   ├── routes/         # Auth routes (login/register/delete)
│   └── server.js       # Express server entry point
│
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Login, DeleteConfirmationModal, etc.
│   │   ├── pages/      # Home, Cards, etc.
│   │   └── App.jsx     # Main React App
│   └── public/
│
├── README.md           # Project documentation
└── package.json        # Root config (optional)
```

---

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/omelendez1/CAPSTONE.git
   cd Card-Generator
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Create a .env file in the backend**
   ```
   MONGO_URI=your_mongodb_atlas_connection
   JWT_SECRET=your_secret_key
   PORT=8080
   ```

5. **Run backend server**
   ```bash
   cd backend
   npm start
   ```

6. **Run frontend app**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 📡 API Endpoints

- `POST /api/auth/register` → Create a new user  
- `POST /api/auth/login` → Authenticate user & return JWT  
- `DELETE /api/auth/delete` → Permanently delete user profile  
- `GET /api/cards` → Fetch user’s saved cards  
- `POST /api/cards` → Save a new card  
- `DELETE /api/cards/:id` → Delete a specific card  

---

## ✅ Capstone Requirements Checklist

- **MERN Stack:** ✔  
- **CRUD Operations:** ✔  
- **Authentication:** ✔  
- **React Router & Multiple Views:** ✔  
- **API Integration (Fetch):** ✔  
- **MongoDB Schema & Indexes:** ✔  
- **CSS Styling & Responsive Modals:** ✔  

---

## 🎯 Future Enhancements

- Add **OAuth login (Google/GitHub)**  
- Improve **card editing & updating maybe trading logic with other users**  
- Allow **public card sharing**  
- Better **UI/UX polish & animations**  

---

## 👨‍💻 Author

**Oliver Melendez**  
[GitHub Profile](https://github.com/omelendez1) | [LinkedIn Profile](www.linkedin.com/in/omelendez1)

---

## 📜 License

This project is for educational purposes as part of the **Per Scholas Full-Stack Developer Capstone Project**.
