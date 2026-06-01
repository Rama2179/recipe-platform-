const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");

// GET all comments for a recipe
router.get("/:recipeId", async (req, res) => {
    try {
        const comments = await Comment.find({ recipeId: req.params.recipeId }).sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: "Failed to load comments" });
    }
});

// POST a new comment - username from session
router.post("/", async (req, res) => {
    const username = req.session.userName;
    if (!username) return res.status(401).json({ error: "Not logged in" });

    const { recipeId, body, rating } = req.body;
    if (!recipeId || !body || !rating) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const ratingNum = parseInt(rating);
    if (ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ error: "Rating must be 1-5" });
    }

    try {
        const comment = new Comment({ recipeId, username, body, rating: ratingNum });
        await comment.save();
        res.json({ success: true, comment });
    } catch (err) {
        res.status(500).json({ error: "Failed to save comment" });
    }
});

// DELETE - only if session user matches comment owner
router.delete("/:id", async (req, res) => {
    const username = req.session.userName;
    if (!username) return res.status(401).json({ error: "Not logged in" });

    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: "Not found" });
        if (comment.username !== username) return res.status(403).json({ error: "Not your comment" });

        await Comment.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete comment" });
    }
});

module.exports = router;
