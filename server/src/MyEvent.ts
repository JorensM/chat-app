export class MyEvent {

    maxID = 0;

    listeners: Record<string, (...args: any) => void> = {};

    emit(...args) {
        for(const listener of Object.values(this.listeners)) {
            listener(...args);
        }
    }

    addListener(listener) {
        const id = this.maxID++;
        this.listeners[id.toString()] = listener
        return id;
    }

    removeListener(id) {
        delete this.listeners[id];
    }

    cleanup() {
        this.listeners = {};
    }
}

export class MyEvents {

    maxID = 0;

    /** @type Record<string, MyEvent> */
    events = {};

    addEvent(eventName) {
        const e = new MyEvent();
        this.events[eventName] = e;
    }

    on(eventName, callback) {
        return this.events[eventName].addListener(callback);
    }

    emit(eventName, ...args) {
        console.log(eventName);
        this.events[eventName].emit(...args);
    }
}

export class RoomEvents extends MyEvents {
    constructor() {
        super();

        this.addEvent('message');
    }
}