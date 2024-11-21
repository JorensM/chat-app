import { SERVER_URL } from './constants'

export const getRooms = async () => {
    const res = fetch(SERVER_URL + '/api/rooms');
    return (await res).json();
}

export const getRoom = async (id: number) => {
    const res = fetch(SERVER_URL + '/api/rooms/' + id);
    return (await res).json();
}

export const addRoom = async (name: string) => {
    const res = fetch(SERVER_URL + '/api/rooms', {
        method: 'POST',
        body: JSON.stringify({
            name
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = (await res).json();
    return data;
}