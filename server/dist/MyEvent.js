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
exports.RoomEvents = exports.MyEvents = exports.MyEvent = void 0;
var MyEvent = /** @class */ (function () {
    function MyEvent() {
        this.maxID = 0;
        this.listeners = {};
    }
    MyEvent.prototype.emit = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        for (var _a = 0, _b = Object.values(this.listeners); _a < _b.length; _a++) {
            var listener = _b[_a];
            listener.apply(void 0, args);
        }
    };
    MyEvent.prototype.addListener = function (listener) {
        var id = this.maxID++;
        this.listeners[id.toString()] = listener;
        return id;
    };
    MyEvent.prototype.removeListener = function (id) {
        delete this.listeners[id];
    };
    MyEvent.prototype.cleanup = function () {
        this.listeners = {};
    };
    return MyEvent;
}());
exports.MyEvent = MyEvent;
var MyEvents = /** @class */ (function () {
    function MyEvents() {
        this.maxID = 0;
        /** @type Record<string, MyEvent> */
        this.events = {};
    }
    MyEvents.prototype.addEvent = function (eventName) {
        var e = new MyEvent();
        this.events[eventName] = e;
    };
    MyEvents.prototype.on = function (eventName, callback) {
        return this.events[eventName].addListener(callback);
    };
    MyEvents.prototype.emit = function (eventName) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log(eventName);
        (_a = this.events[eventName]).emit.apply(_a, args);
    };
    return MyEvents;
}());
exports.MyEvents = MyEvents;
var RoomEvents = /** @class */ (function (_super) {
    __extends(RoomEvents, _super);
    function RoomEvents() {
        var _this = _super.call(this) || this;
        _this.addEvent('message');
        return _this;
    }
    return RoomEvents;
}(MyEvents));
exports.RoomEvents = RoomEvents;
