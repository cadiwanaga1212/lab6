const express = require('express');
const User = require('../model/user');
const router = express.Router()

module.exports = router;

router.post('/login', async (req, res) => {
    const {session} = req;
    const { username, password } = req.body;

    // check if user in database
    const user = await User.findOne({ username });
    
    if (!user)
      return res.json({ message: "Incorrect Username ", status: false });
    else if (user.password !== password)
      return res.json({ message: "Incorrect Password", status: false });
    else {
      session.authenticated = true;
      session.username = username;
      res.json({ message: "logged in", username: username, status: true });
    }
});

router.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const user = await newUser.save();

    // Start a new session for the user after successful registration
    // Commented out as you do not want to log in the user after registration
    // req.session.userId = user._id;

    res.status(201).json({ message: "Registration successful", status: true });
  } catch (err) {
    res.status(400).json({ message: "Registration failed", status: false });
  }
});


// Set up a route for the logout page
router.get('/logout', (req, res) => {
    // Clear the session data and redirect to the home page
    req.session.destroy();
    res.send({message: "Logged out", status: true})
  });