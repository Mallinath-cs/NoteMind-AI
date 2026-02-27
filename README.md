<h1 align="center">NoteMind AI</h1>
<h3 align="center">A full-stack Note Taking Application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js). Users can sign up, log in, and securely create, edit, delete, and search notes. The app also features an integrated AI-powered summarization tool that automatically generates concise summaries of notes for better productivity.</h3>

### Built with
Frontend
- React.js
- Framer motion

Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
  
<p align="center">
  🔗 <a target="_blank" href="https://notemind-ai.onrender.com">Live Demo</a>
</p>
<img alt="Hero-desktop" src="https://github.com/user-attachments/assets/aaf3e4a4-3993-41a6-81cf-35a5118746d7" />

## Prerequisites
- Download <a href="https://git-scm.com/downloads">Git</a>
- Download <a href="https://nodejs.org/en/download">Node.js</a>
- Download <a href="https://www.mongodb.com/try/download/community">MongoDB</a>
- Download <a href="https://www.postman.com/downloads/">Postman</a>

## Installation
```bash
git clone https://github.com/Mallinath-cs/NoteMind-AI.git
```
## Setup (Just run the following commands in the vs code terminal)

```bash
npm install
```
To view website both on your pc and mobile you have to connect both devices to the same wifi network and run the following command in terminal

```bash
npm run dev -- --host
```
It will create two links local and network, open the local link to view on desktop and the network link on your phone to view the website on mobile

Create a .env file to backend and add the following to it:
- MONGO_DB_URL=mongodb url from atlas
- PORT=Port Number
- ACCESS_TOKEN_SECRET=Create an access token
- OPENROUTER_API_KEY=openrouter api key
- NODE_ENV=development or production
## Project Structure
```
NOTES/
backend
│── database
│   ├── db.js
│── models
│   ├── notes.model.js
│   ├── users.model.js
│── server.js
│── utilities.js
│── .env
frontend
│── public
│── src
│   ├── assets
│   ├── components
│   │   ├── Cards
│   │   ├── EmptyCard
│   │   ├── Footer
│   │   ├── Input
│   │   ├── Navbar
│   │   ├── SearchBar
│   ├── pages
│   │   ├── Home
│   │   ├── Login
│   │   ├── Signup
│   ├── utils
│   │   ├── axiosinstance.js
│   │   ├── helper.js
│   ├── App.jsx
│   ├── main.jsx
```


                                                                                         
<h4 align="center">Thanks for exploring this project.</h4>
