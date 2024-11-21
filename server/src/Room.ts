import { User } from '../../common/User';
import { MyEvents, RoomEvents } from './MyEvent';
import { Message } from '../../common/Message';
import { IOData } from '../../common/IOData';

export default class Room {
    id: number;
    name: string;

    history: Message[] = [];
    users: User[] = [];

    event = new RoomEvents();

    constructor(name, id) {
        this.name = name;
        this.id = id;
    }

    toJSON(includeHistory: boolean = false) {
        return {
            id: this.getID(),
            name: this.name,
            users: this.users,
            history: includeHistory ? this.history : undefined
        }
    }

    getID() {
        return this.id;
    }

    receive(data: IOData) {
        switch(data.type) {
            case 'message': {
                this.history.push(data);
            }
            case 'joinRoom': {
                this.users.push(data.user);
            }
            case 'leaveRoom': {
                const index = this.users.findIndex(user => user.id === data.user.id);
                this.users.splice(index, 1);
            }
        }

        this.event.emit('message', data);
    }
}

class RoomsListEvents extends MyEvents {
    constructor() {
        super();

        this.addEvent('addRoom');
    }
}

export class RoomsList {
    rooms: Room[] = [];

    maxID = 0;

    events = new RoomsListEvents();

    constructor() {

    }

    getRoomByID(id) {
        return this.rooms.find(room => room.getID() === id);
    }

    addRoom(name) {
        const id = this.maxID++;
        const room = new Room(name, id);
        this.rooms.push(room);
        this.events.emit('addRoom', id);
        return room;
    }
}