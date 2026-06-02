# Recipe-platform
Full-stack recipe sharing platform where users can register, browse recipes, and leave ratings and reviews. 

## Tech Stack 
- **Backend:** Node.js, Express.js
- **DataBase:** MongoDB + Mongoose (users), JSON files (recipes, comments)
- **Auth:** bcrypt, express-session
- **Frontend:** HTML, CSS, Vanilla JavaScript

## Features 
- User registration and login with secure password hashing
- Session-based authentication across all pages
- Browse and create recipes with ingredients and instructions
- Leave star ratins and written reviews on recipes

## How to run 
1. Install dependencies:
   a. nmp install express express-session mongoose bcrypt
2. Make sure MongoDB is running locally
3. Start the server:
   a. node server.js
4. Open your browser at `http://localhost:8080`

## Project Structure 
recipe-platform/
├── server.js                                                      # Main Express server

├── userRoutes.js                                                  # User authentication routes

├── User.js                                                        # MongoDB user model

├── server/

│   └── routes/

│       ├── recipes.js                            # Recipe routes
 
│       └── module3.js                            # Comments routes

└── public/

├── css/

├── js/

└── *.html


----
*Designed and built the complete User module:*
- REST API endpoints for register, login, logout, and profile 
- MongoDB schema with bcrypt password hashing
- Server-side session management
- Login, register, and home HTML pages with full frontend JS
- Integrated all three modules into the final combined server.js
  
*Collaborated with two teammates who developed the recipe module and comments module.* 
