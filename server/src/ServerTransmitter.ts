import { Server, Socket } from 'socket.io';
import { IOData } from '../../common/IOData';
import { Message } from '../../common/Message';
import Room, { RoomsList } from './Room';

export default class ServerTransmitter {

    rooms: RoomsList;

    io: Socket;

    constructor(socket: Socket, rooms: RoomsList) {
        this.rooms = rooms;
        this.io = socket;
        this.rooms.rooms.forEach(room => {
            this.addRoomListeners(room.getID());
        }) 
        this.rooms.events.on('addRoom', (roomID: number) => {
            console.log('added room with ID: ', roomID);
            console.log('all rooms: ', this.rooms);
          this.addRoomListeners(roomID);  
        })
    }

    addRoomListeners(roomID) {
        this.rooms.getRoomByID(roomID).event.on('message', (data: IOData) => {
            this.send(data);
        })
    }

    receive(data: IOData) {
        const room = this.rooms.getRoomByID(data.roomId);
        if(!room) {
            console.error('could not find room', data);
            return;
        }
        console.log('message: ', data);
        if(data.type === 'joinRoom') {
            this.io.join(data.roomId.toString());
        } else if(data.type === 'leaveRoom') {
            this.io.leave(data.roomId.toString());
            this.io.join('lobby');
        }
        room.receive(data);
    }
    send(data: IOData) {
        console.log('sending: ', data); 
        console.log(this.io.rooms);
        this.io.emit('message', JSON.stringify(data));
    }
}