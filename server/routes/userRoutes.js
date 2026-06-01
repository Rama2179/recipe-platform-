const express = require('express');
const router = express.Router();
const User = require('../models/user');

//Post users - register
router.post('/register', async (req, res) => {
    const {name, email, occupation, password } = req.body; 

    if (!name || !email || !password) {
        return res.json({ error: 'Name, email and password are required.'});
    }

    try {
        const exists = await User.findOne({email});
        if (exists) return res.json({ error: 'Email already in use.'});

        const user = new User({name, email, occupation, password });
        await user.save();

        req.session.userId = user._id; 
        req.session.userName = user.name; 

        res.json({ message: 'Account registered.'});
    } catch (err) {
        console.error("REGISTER ERROR:", err); 
        res.status(500).json({ error: err.message });
    }
});

//POST users-login
router.post('/login', async (req, res) => {
    const {email, password} = req.body; 

    if (!email || !password) {
        return res.json({ error: 'Email and password are required.'});
    }

    try {
        const user = await User.findOne({email});
        if (!user) return res.json({error: 'Invalid email or password.'});

        const match = await user.comparePassword(password);
        if (!match) return res.json({ error: 'Invalid email or password.'});

        //Create the session 
        req.session.userId = user._id; 
        req.session.userName = user.name; 

        res.json({ message: 'Logged in.'});
    } catch (err) {
        res.json({error: 'Server error.'});
    }
});

//Post users - logout
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Logged out'});
    });
});

// GET - user - profile 
router.get('/profile', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({error: 'Not logged in.'});
    }
    res.json({ name: req.session.userName});
    });

module.exports = router; 

