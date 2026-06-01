const express = require("express");
const session = require('express-session');
const path = require("path");
const mongoose = require('mongoose'); 
const app = express();
mongoose.connect('mongodb://localhost:27017/recipeapp')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(session({
    secret: 'recipe_secret_key',
    resave: false,
    saveUninitialized: false, 
    cookie: { maxAge: 1000 * 60 * 60 }
}));
app.use('/api/users', require('./routes/userRoutes.js'));
app.use("/api/recipes", require("./routes/recipes.js"));
app.use("/api/comments", require("./routes/comments.js"));
app.use("/api/favorites", require("./routes/favorites.js"))
app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "../public", "recipes.html")); });
app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});