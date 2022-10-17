import React, {createContext, useContext, useEffect, useState} from 'react';
import UserContext from './UserContext';
import io from 'socket.io-client';

const socket = io();

const ChatContext = createContext();

export const ChatProvider = ({children}) => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [lastPong, setLastPong] = useState(null);
    const [currentChat, setCurrentChat] = useState([]);
    const {currentUser} = useContext(UserContext);



    useEffect(() => {
        socket.on('connect', () => {
          setIsConnected(true);
          console.log("it's connected")
        });
    
        socket.on('disconnect', () => {
          setIsConnected(false);
        });
    
        socket.on('pong', () => {
          setLastPong(new Date().toISOString());
        });
    
        return () => {
          socket.off('connect');
          socket.off('disconnect');
          socket.off('pong');
        };
      }, [currentUser]);

      const sendPing = () => {
        socket.emit('ping');
      }

      const addMessageToConversation = ({recipient, content, sender}) => {
        
      }

      const sendMessage = (recipientId, content) => {
        addMessageToConversation({recipientId, content, sender: currentUser._id})
      }

    const value = { sendPing, currentChat, setCurrentChat, sendMessage }

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export default ChatContext;