
const express = require("express");
const socketIO = require('socket.io');
const http = require('http');
const cors  = require("cors");
const session = require('express-session');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require( 'body-parser');
const routes = require('./routes/auth');
const rooms = require('./routes/rooms');
const messages = require('./routes/message')
const Message = require("./model/messages");
const User = require("./model/user");
const Room = require("./model/room");

const app = express(); 
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});
app.use(cors({origin: 'http://localhost:3000', credentials:true}))


dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Connect to the database
// TODO: your code here

mongoose.connect(process.env.MONGO_URL);
const database = mongoose.connection;
database.on('error', (error) => console.error(error));
database.once('open' , () => console.log('Connected to Database'))

// Set up the session
// TODO: your code here

const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
})

app.use(sessionMiddleware)




app.get('/', (req, res) => {
  if (req.session && req.session.authenticated) {
    res.json({ message: "logged in", username: req.session.username });
  }
  else {  
    console.log("not logged in")
    res.json({ message: "not logged" });
  }
});


app.use("/api/auth/", routes);
app.use("/api/messages/", messages);

// checking the session before accessing the rooms
app.use((req, res, next) => {
  if (req.session && req.session.authenticated) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
});
app.use("/api/rooms/", rooms);


// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});


// TODO: make sure that the user is logged in before connecting to the socket
// TODO: your code here

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

io.use((socket, next) => {
  if (socket.request.session ){
    next();
  }
  else{
    console.log("unauthorized")
    next(new Error('unauthorized'));
  }
})


io.on('connection', (socket) => {
  let room;
  let userName;

  console.log("user connected");

  socket.on('join', (data) => {
    room = data.room;
    userName = data.username;
    console.log(`user ${userName} is joined to room ${room}`);
    io.emit('message', {text: `${userName} has joined the room`, room: room});
  });

  socket.on('message', async ({message, username}) => {
    // a user sends a message to the room
    console.log(`Message sent by ${username}: ${message}`);

    try {
      const user = await User.findOne({username: username});
      const UserRoom = await Room.findOne({name: room})
      const newMessage = new Message({
          message: {text: message},
          sender: user._id,
          room: UserRoom,
      });
      await newMessage.save();
      io.emit('message', {text: `${message}`, room: room, username: username, id : newMessage._id}); // This line broadcasts the message to all clients
  } catch(err) {
      console.log('Error saving message:', err);
  }
});

socket.on('leave', (data) => {
  console.log(`user ${data.username} left room ${data.room}`);
  io.emit('message', {text: `${data.username} has left the room`, room: room});
});

socket.on('edit', async ({index, newMessage, id}) => {
  console.log(`Message edited by ${userName}: ${newMessage}`);

  try {
      // Assuming you store the messages in an array in the Room document.
      // The message's position in the array is tracked by the client-side.
      const UserMessage = await Message.findOne({_id: id});
      UserMessage.message.text = newMessage;
      await UserMessage.save();

      io.emit('edit', {index: index, newMessage : newMessage, room: room});
  } catch(err) {
      console.log('Error updating message:', err);
  }
});


  socket.on('disconnect', () => {
    console.log(`user ${userName} disconnected from room ${room}`);
  });
});