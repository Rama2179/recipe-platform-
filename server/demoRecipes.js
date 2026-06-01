const mongoose = require("mongoose");
const Recipe = require("./models/recipe.js");

mongoose.connect("mongodb://localhost:27017/recipeapp");

async function seed() {

    const recipes = [
        {
            title: "Spaghetti Bolognese",
            prepTime: 15,
            cookTime: 30,
            totalTime: 45,
            servings: 4,
            ingredients: ["pasta", "ground beef", "tomato sauce"],
            instructions: "Cook pasta\n\nCook beef\n\nMix together",
            image: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/easy_spaghetti_bolognese_93639_16x9.jpg",
            username: "demoUser"
        },
        {
            title: "Pancakes",
            prepTime: 10,
            cookTime: 15,
            totalTime: 25,
            servings: 2,
            ingredients: ["flour", "milk", "eggs"],
            instructions: "Mix ingredients\n\nCook on pan",
            image: "https://www.inspiredtaste.net/wp-content/uploads/2025/07/Pancake-Recipe-1.jpg",
            username: "demoUser"
        },
        {
            title: "Grilled Cheese",
            prepTime: 5,
            cookTime: 10,
            totalTime: 15,
            servings: 1,
            ingredients: ["bread", "cheese", "butter"],
            instructions: "Butter bread\n\nGrill until golden",
            image: "https://www.sargento.com/assets/Uploads/Recipe/Image/Louie_Grilled_Cheese-v3__FocusFillWyIwLjAwIiwiMC4wMCIsODAwLDQ3OF0_CompressedW10.jpg",
            username: "demoUser"
        }
    ];

    await Recipe.insertMany(recipes);

    console.log(" Seeded recipes!");
    mongoose.disconnect();
}

seed();