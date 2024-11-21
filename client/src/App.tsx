import { ChangeEvent, useEffect, useState } from 'react';
import { IOData } from '../../common/IOData'; 
import useClient from './useClient';

function App() {


  const { rooms, currentRoom, messages, send, fetchRooms, joinRoom, leaveRoom, user, addRoom, setUsername } = useClient();
  const [message, setMessage] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<'lobby' | 'chat' | 'welcome'>('welcome');

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.currentTarget.value);
  }

  const onSendClick = () => {
    const messageData: IOData = {
      type: 'message',
      text: message,
      timestamp: new Date().getTime(),
      user,
      roomId: currentRoom!.id
    }
    send(messageData);
    setMessage('');
  }

  useEffect(() => {
    fetchRooms();  
  }, [])

  const openNewRoomPrompt = async () => {
    const roomName = prompt('Please enter room\'s name');
    if(!roomName) return;
    const room = await addRoom(roomName);
    joinRoom(room.id);
  }

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  }

  const handleJoinClick = () => {
    setCurrentPage('lobby');
  }

  const handleJoinRoomClick = (roomID: number) => {
    joinRoom(roomID);
    setCurrentPage('chat');
  }

  const handleLeaveRoomClick = () => {
    leaveRoom();
    setCurrentPage('lobby');
  }

  return (
    <>
    <header>      
      <h1>Chat App</h1>
    </header>
      <h2>{currentRoom?.name || 'Lobby'}</h2>
      {currentPage === 'lobby' ? 
        <ul>
          {rooms.map(room => (
            <li>
              <button
                onClick={() => handleJoinRoomClick(room.id)}
              >
                {room.name}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={openNewRoomPrompt}
            >
              New Room
            </button>
          </li>
        </ul>
      : currentPage === 'chat' ? 
      <div>
        <button onClick={handleLeaveRoomClick}>
          Leave
        </button>
        <ul>
          {messages.map(message => (
            <li>
              <b>{message.user.username}: &nbsp;</b>{message.text}
            </li>
          ))}
        </ul>
        <input value={message} onChange={handleMessageChange}></input>
        <button onClick={onSendClick}>Send</button>
      </div>
      : currentPage === 'welcome' ?
      <div>
        <h1>Welcome to Chat App</h1>
        <p>Please enter your nickname</p>
        <input value={user.username} onChange={handleUsernameChange}/>
        <button
          onClick={handleJoinClick}
        >
          Join
        </button>
      </div>
      : "Error"}
      
      
    </>
  )
}

export default App
