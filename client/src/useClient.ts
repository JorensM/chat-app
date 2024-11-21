import { io } from 'socket.io-client';
import ClientTransmitter from './ClientTransmitter'
import { IOData } from '../../common/IOData';
import { useCallback, useRef, useState } from 'react';
import { Room } from './types';
import { addRoom as addRoomAPI, getRoom, getRooms } from './api';
import { User } from '../../common/User';

const SERVER_URL = import.meta.env.VITE_PUBLIC_SERVER_URL || 'http://localhost:4444';

const socket = io(SERVER_URL);

type Message = IOData & { text: string };

export default function useClient() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [user, setUser] = useState<User>({
        id: 0,
        username: 'guest'
    });

    const [messages, setMessages] = useState<Message[]>([]);

    const appendMessage = (message: Message) => {
        setMessages((prevState) => [
          ...prevState,
          message
        ]);
    }

    const fetchRooms = async () => {
        const _rooms = await getRooms();
        setRooms(_rooms);
    }

    const onReceive = useCallback((data: IOData) => {
        console.log('received message');
        switch(data.type) {
            case 'message': {
                appendMessage(data);
            }
        }
    }, []);

    const joinRoom = async (roomId: number) => {
        console.log('joining room');
        if(currentRoom?.id === roomId) return;
        if(currentRoom) {
          const data: IOData = {
            type: 'leaveRoom',
            roomId: currentRoom.id,
            user
          }
          socket.emit('message', data);
        }
        const data: IOData = {
          type: 'joinRoom',
          roomId,
          user
        }
        socket.emit('message', data);
        const newRoom = rooms.find(room => room.id === roomId) 
        if(!newRoom) {
            throw new Error('Could not find new room');
        }
        const newRoomDetailed = await getRoom(newRoom.id);
        setMessages(newRoomDetailed.history);
        setCurrentRoom(newRoom || null);
    }

    const leaveRoom = () => {
        if(!currentRoom) throw new Error('Cannot leave room because you aren\'t part of any room');
        const data: IOData = {
            user,
            roomId: currentRoom.id,
            type: 'leaveRoom'
        }

        transmitterRef.current?.send(data);
        setCurrentRoom(null);
        setMessages([]);
    }

    const transmitterRef = useRef<ClientTransmitter>();

    if(!transmitterRef.current) {
        transmitterRef.current = new ClientTransmitter(socket, onReceive);
    }

    const addRoom = async (name: string) => {
        const room = await addRoomAPI(name);
        setRooms((prevRooms) => [
            ...prevRooms,
            room
        ]);
        return room;
    }

    const setUsername = (username: string) => {
        setUser({
            ...user,
            username
        })
    }

    return {
        rooms,
        currentRoom,
        messages,
        fetchRooms,
        joinRoom,
        leaveRoom,
        user,
        setUsername,
        addRoom,
        send: (data: IOData) => transmitterRef.current?.send(data)
    }
}