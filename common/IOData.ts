import { User } from './User'

export type IOData = {
    user: User,
    roomId: number
} & (
    {
        type: 'message',
        text: string,
        timestamp: number
    }
|   
    {
        type: 'joinRoom',
    }
|
    {
        type: 'leaveRoom'
    }    
) | CreateRoomData;

type IODataBase = {
    user: User,
    roomId: number
}

export type CreateRoomData = IODataBase & {
    type: 'createRoom',
    name: string
} 
