# 📝 MERN Notes App

A simple and clean **full-stack notes application** built using the **MERN stack**  
(MongoDB, Express, React, Node.js).

I built this project to practice **real-world authentication**, **protected routes**, and **CRUD operations**, while also focusing on a clean UI with **light & dark mode support**.

---

## 🚀 Features

- User registration & login
- JWT-based authentication
- Protected routes (only logged-in users can access notes)
- Create, edit, and delete personal notes
- Each user can see only their own notes
- Light mode & dark mode 🌙
- Clean and responsive UI

---

## 🛠 Tech Stack

### Frontend
- React
- React Router
- Axios
- CSS (custom styling)

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT Authentication
- bcryptjs

---

## 🔐 Authentication Flow (Simple Explanation)

1. User logs in with email & password  
2. Backend generates a JWT token  
3. Token is stored in `localStorage`  
4. Token is sent in `Authorization` header  
5. Backend middleware verifies the token  
6. Access is granted to protected routes  

---

## 📂 Project Structure

mern-notes-app
├── backend
│ ├── middleware
│ ├── models
│ ├── routes
│ └── server.js
│
├── frontend
│ ├── src
│ │ ├── pages
│ │ ├── App.js
│ │ └── index.js
│ └── public
│
└── README.md



---

## ⚙️ How to Run Locally

### Backend
```bash
cd backend
npm install
npm start
Create a .env file in backend:

env

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
Frontend
bash

cd frontend
npm install
npm start
🌱 What I Learned from This Project
How JWT authentication works end-to-end

How to protect routes using middleware

Connecting frontend with backend APIs

Managing user-specific data securely

Debugging real-world issues like token mismatch

Structuring a MERN project properly

🚧 Future Improvements
Search notes

Pin important notes

Auto logout on token expiry

User profile section

👤 Author
Surya Kiran
Aspiring Full-Stack Developer 🚀
GitHub: https://github.com/kiranmedida


