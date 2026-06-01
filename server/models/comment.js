const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    recipeId: { type: String, required: true },
    username: { type: String, required: true },
    body: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
