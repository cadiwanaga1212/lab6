const express = require('express');
const router = express.Router()
const Message = require("../model/messages");
const Room = require("../model/room")

module.exports = router;

router.get('/:room', async (req, res) => {
    const {room} = req.params;
    const UserRoom = await Room.findOne({name: room})
    const messages = await Message.find({room: UserRoom}).populate('sender');
    const messageDetails = messages.map(message => ({
      id : message._id,
      text: message.message.text,
      username: message.sender.username
  }));
  res.json(messageDetails);
  });