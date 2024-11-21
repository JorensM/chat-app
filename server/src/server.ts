import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

import { IOData } from '../../common/IOData';

import ServerTransmitter from './ServerTransmitter';
import { RoomsList } from './Room';

const PORT = process.env.PORT || 4444;

const app = express();
app.use(cors(), express.json());
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

const rooms = new RoomsList();

rooms.addRoom('Room1');

io.on('connection', (socket) => {

    const transmitter = new ServerTransmitter(socket, rooms);

    console.log('user connected');

    socket.join('lobby');

    socket.on('message', (data: IOData) => {
        transmitter.receive(data);
    })
})

app.post('/api/rooms', (req, res) => {
    console.log(req.body);
    const data = req.body;

    const room = rooms.addRoom(data.name);

    res.json(room.toJSON());
})

app.get('/api/rooms', (req, res) => {
    res.json(rooms.rooms.map(room => room.toJSON()));
})

app.get('/api/rooms/:id', (req, res) => {
    const room = rooms.getRoomByID(parseInt(req.params.id));

    res.json(room.toJSON(true));

})

    

server.listen(PORT, () => {
    console.log('Server listening on 4444');
})