const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Recipe = require("../models/recipe.js");
// toggle favorite
router.post("/:recipeId", async (req, res) => {
    const userId = req.session.userId;
    const recipeId = req.params.recipeId;

    if (!userId) return res.status(401).json({ error: "Not logged in" });

    const user = await User.findById(userId);

    const index = user.favorites.indexOf(recipeId);

    if (index === -1) {
        user.favorites.push(recipeId); // add
    } else {
        user.favorites.splice(index, 1); // remove
    }

    await user.save();

    res.json({ success: true, favorites: user.favorites });
});

// get favorites
router.get("/", async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(401).json({ error: "Not logged in" });
        }

        const recipes = await Recipe.find({
            _id: { $in: user.favorites }
        });

        res.json(recipes);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;