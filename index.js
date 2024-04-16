import express from 'express';
import cors from 'cors';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';

import { Server } from 'socket.io';

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      '*',
      true,
      'localhost:3000',
      'http://localhost:3000',
      'https://sam-dad-chat-client-1565325be607.herokuapp.com',
      'sam-dad-chat-client-1565325be607.herokuapp.com',
      'https://sam-dad-chat-client-1565325be607.herokuapp.com/',
      'sam-dad-chat-client-1565325be607.herokuapp.com/'

    ],
    methods: ['GET', 'POST'],
  },
});

const convo = [];
const users = {};

io.on('connection', (socket) => {
  if(!users[socket.id]) {
    socket.emit('message', convo);
    socket.on('message', (data) => {
      convo.push({...data, id: uuidv4(), date: Date.now()});
      io.emit('message', convo);
    })
    socket.on('socketId', (data) => {
      users[socket.id] = data;
      io.emit('socketId', users);
    });
  }
  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('socketId', users);
  });
});

server.listen(process.env.PORT || 8080, () => 'Server is running on port 8080');
