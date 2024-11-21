"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsList = void 0;
var MyEvent_1 = require("./MyEvent");
var Room = /** @class */ (function () {
    function Room(name, id) {
        this.history = [];
        this.users = [];
        this.event = new MyEvent_1.RoomEvents();
        this.name = name;
        this.id = id;
    }
    Room.prototype.toJSON = function (includeHistory) {
        if (includeHistory === void 0) { includeHistory = false; }
        return {
            id: this.getID(),
            name: this.name,
            users: this.users,
            history: includeHistory ? this.history : undefined
        };
    };
    Room.prototype.getID = function () {
        return this.id;
    };
    Room.prototype.receive = function (data) {
        switch (data.type) {
            case 'message': {
                this.history.push(data);
            }
            case 'joinRoom': {
                this.users.push(data.user);
            }
            case 'leaveRoom': {
                var index = this.users.findIndex(function (user) { return user.id === data.user.id; });
                this.users.splice(index, 1);
            }
        }
        this.event.emit('message', data);
    };
    return Room;
}());
exports.default = Room;
var RoomsListEvents = /** @class */ (function (_super) {
    __extends(RoomsListEvents, _super);
    function RoomsListEvents() {
        var _this = _super.call(this) || this;
        _this.addEvent('addRoom');
        return _this;
    }
    return RoomsListEvents;
}(MyEvent_1.MyEvents));
var RoomsList = /** @class */ (function () {
    function RoomsList() {
        this.rooms = [];
        this.maxID = 0;
        this.events = new RoomsListEvents();
    }
    RoomsList.prototype.getRoomByID = function (id) {
        return this.rooms.find(function (room) { return room.getID() === id; });
    };
    RoomsList.prototype.addRoom = function (name) {
        var id = this.maxID++;
        var room = new Room(name, id);
        this.rooms.push(room);
        this.events.emit('addRoom', id);
        return room;
    };
    return RoomsList;
}());
exports.RoomsList = RoomsList;
