"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServerTransmitter = /** @class */ (function () {
    function ServerTransmitter(socket, rooms) {
        var _this = this;
        this.rooms = rooms;
        this.io = socket;
        this.rooms.rooms.forEach(function (room) {
            _this.addRoomListeners(room.getID());
        });
        this.rooms.events.on('addRoom', function (roomID) {
            console.log('added room with ID: ', roomID);
            console.log('all rooms: ', _this.rooms);
            _this.addRoomListeners(roomID);
        });
    }
    ServerTransmitter.prototype.addRoomListeners = function (roomID) {
        var _this = this;
        this.rooms.getRoomByID(roomID).event.on('message', function (data) {
            _this.send(data);
        });
    };
    ServerTransmitter.prototype.receive = function (data) {
        var room = this.rooms.getRoomByID(data.roomId);
        if (!room) {
            console.error('could not find room', data);
            return;
        }
        console.log('message: ', data);
        if (data.type === 'joinRoom') {
            this.io.join(data.roomId.toString());
        }
        else if (data.type === 'leaveRoom') {
            this.io.leave(data.roomId.toString());
            this.io.join('lobby');
        }
        room.receive(data);
    };
    ServerTransmitter.prototype.send = function (data) {
        console.log('sending: ', data);
        console.log(this.io.rooms);
        this.io.emit('message', JSON.stringify(data));
    };
    return ServerTransmitter;
}());
exports.default = ServerTransmitter;
