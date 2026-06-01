const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe.js");


router.post("/create", async (req, res) => {
  try {
    const prepTime = Number(req.body.prepTime) || 0;
    const cookTime = Number(req.body.cookTime) || 0;
    let ingredients = req.body.ingredients;

    if (typeof ingredients === "string") {
        ingredients = ingredients.split("\n");
    }

    if (!Array.isArray(ingredients)) {
        ingredients = [];
    }

    ingredients = ingredients.map(i => i.trim()).filter(Boolean);

    const recipe = new Recipe({
      title: req.body.title,
      prepTime,
      cookTime,
      totalTime: prepTime + cookTime,
      servings: req.body.servings,
      ingredients: ingredients,
      instructions: req.body.instructions,
      image: req.body.image || "https://png.pngtree.com/png-vector/20260114/ourlarge/pngtree-chef-hat-in-cartoon-style-isolated-vector-png-image_18494610.webp",
      username: req.session?.userName || "anonymous"
    });

    await recipe.save();

    res.redirect("/recipes.html");
  } catch (err) {
    console.error("Create recipe error:", err);
    res.status(500).json({ error: "Failed to create recipe" });
  }
});


router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id === "undefined") {
            return res.status(400).json({ error: "Invalid recipe id" });
        }

        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        res.json(recipe);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch recipe" });
    }
});

router.put("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
    }
    if (recipe.username !== req.session?.userName) {
    
    return res.status(403).json({ error: "Not allowed to edit this recipe" });
    }
    let ingredients = req.body.ingredients;

    if (typeof ingredients === "string") {
        ingredients = ingredients.split("\n");
    }

    if (!Array.isArray(ingredients)) {
        ingredients = [];
    }

    ingredients = ingredients.map(i => i.trim()).filter(Boolean);

    const prepTime = Number(req.body.prepTime) || 0;
    const cookTime = Number(req.body.cookTime) || 0;

        recipe.title = req.body.title;
        recipe.prepTime = prepTime;
        recipe.cookTime = cookTime;
        recipe.totalTime = prepTime + cookTime;
        recipe.servings = req.body.servings;
        recipe.ingredients = ingredients;
        recipe.instructions = req.body.instructions;
        recipe.image = req.body.image;

        await recipe.save();

        res.json(recipe);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update recipe" });
  }
});


router.delete("/:id", async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        return res.status(404).json({ error: "Not found" });
    }

    if (recipe.username !== req.session?.userName) {
        return res.status(403).json({ error: "Not allowed" });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({ success: true });
});

module.exports = router;