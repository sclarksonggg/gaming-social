import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const GroupChat = ({ currentUser, category }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.emit('joinRoom', category);

    newSocket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => newSocket.close();
  }, [category]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage && socket) {
      socket.emit('chatMessage', {
        room: category,
        user: currentUser.username,
        message: newMessage
      });
      setNewMessage('');
    }
  };

  return (
    <div>
      <h2>{category} Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.user}: {msg.message}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default GroupChat;