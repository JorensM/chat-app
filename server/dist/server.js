"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var socket_io_1 = require("socket.io");
var http_1 = require("http");
var cors_1 = __importDefault(require("cors"));
var ServerTransmitter_1 = __importDefault(require("./ServerTransmitter"));
var Room_1 = require("./Room");
var PORT = process.env.PORT || 4444;
var app = (0, express_1.default)();
app.use((0, cors_1.default)(), express_1.default.json());
var server = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    }
});
var rooms = new Room_1.RoomsList();
rooms.addRoom('Room1');
io.on('connection', function (socket) {
    var transmitter = new ServerTransmitter_1.default(socket, rooms);
    console.log('user connected');
    socket.join('lobby');
    socket.on('message', function (data) {
        transmitter.receive(data);
    });
});
app.post('/api/rooms', function (req, res) {
    console.log(req.body);
    var data = req.body;
    var room = rooms.addRoom(data.name);
    res.json(room.toJSON());
});
app.get('/api/rooms', function (req, res) {
    res.json(rooms.rooms.map(function (room) { return room.toJSON(); }));
});
app.get('/api/rooms/:id', function (req, res) {
    var room = rooms.getRoomByID(parseInt(req.params.id));
    res.json(room.toJSON(true));
});
server.listen(PORT, function () {
    console.log('Server listening on 4444');
});
