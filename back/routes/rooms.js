const express = require('express');
const router = express.Router()
const Room = require('../model/room'); // Assuming Room model is in the models folder
const User = require('../model/user'); // Assuming User model is in the models folder

module.exports = router;

//Get all the rooms
router.get('/all', async (req, res) => {
    // Check the database to only return the rooms that the user is in
    const username = req.session.username;
    const user = await User.findOne({ username });
    if (user) {
        const rooms = await Room.find({_id: {$in: user.rooms}});
        res.json(rooms);
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

router.post('/create', async (req, res) => {
  // Check if room with the same name already exists
  const existingRoom = await Room.findOne({ name: req.body.name });
  if (existingRoom) {
      return res.status(400).json({ message: 'Room with this name already exists' });
  }

  // Create a new room
  const newRoom = new Room({ name: req.body.name });
  const savedRoom = await newRoom.save();

  // Add the room to the user's list of rooms
  const username = req.session.username;
  const user = await User.findOne({ username });
  if (user) {
      user.rooms.push(savedRoom._id);
      await user.save();
  }
  
  res.json({ message: 'Room created' });
});


router.post('/join', async (req, res) => {
    // Join a new room
    const username = req.session.username;
    const roomName = req.body.roomName;

    const room = await Room.findOne({ name: roomName });
    const user = await User.findOne({ username });

    if (room && user && !user.rooms.includes(room._id)) {
        user.rooms.push(room._id);
        await user.save();
        res.json({ message: 'Joined room' });
    } else {
        res.status(400).json({ message: 'Room does not exist or user is already in the room' });
    }
});

router.delete('/leave', async (req, res) => {
    // Leave a room
    const username = req.session.username;
    const roomName = req.body.roomName;

    const room = await Room.findOne({ name: roomName });
    const user = await User.findOne({ username });

    if (room && user && user.rooms.includes(room._id)) {
        const index = user.rooms.indexOf(room._id);
        if (index > -1) {
            user.rooms.splice(index, 1);
        }
        await user.save();
        res.json({ message: 'Left room' });
    } else {
        res.status(400).json({ message: 'Room does not exist or user is not in the room' });
    }
});
