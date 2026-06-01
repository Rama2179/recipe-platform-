const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    prepTime: {type: Number,default: 0},
    cookTime: {type: Number,default: 0},
    totalTime: {type: Number,default: 0},
    servings: {type: String,default: "1"},
    ingredients: {type: [String],default: []},
    instructions: {type: String,default: ""}, 
    image: {type: String,default: "https://png.pngtree.com/png-vector/20260114/ourlarge/pngtree-chef-hat-in-cartoon-style-isolated-vector-png-image_18494610.webp"},
    username: {type: String, default: "anonymous"}
  },
  {timestamps: true}
);

module.exports = mongoose.model("Recipe", recipeSchema);