import { Socket } from 'socket.io-client';
import { IOData } from '../../common/IOData';

export default class ClientTransmitter {
    socket: Socket;
    onReceive: (data: IOData) => void

    constructor(socket: Socket, onReceive: (data: IOData) => void) {
        console.log('constructing');
        this.socket = socket;
        this.onReceive = onReceive;
        this.socket.on('message', (data) => {
            this.onReceive(JSON.parse(data));
        })
    }

    send(data: IOData) {
        console.log('sending');
        this.socket.emit('message', data);
    }

    
}