const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const { getAnswer } = require('./crawler');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `Hi ${user.name}, welcome to room ${user.room}.`});
    // socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    // io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', async (message, callback) => {
    const user = getUser(socket.id);

    await io.to(user.room).emit('typing', true);
    await io.to(user.room).emit('message', { user: user.name, text: message });

    const adminAnswer = await getAnswer(message)
    await socket.emit('message', { user: 'admin', html: adminAnswer});
    await io.to(user.room).emit('typing', false);

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
      // io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));