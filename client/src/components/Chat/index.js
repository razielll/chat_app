import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../InfoBar';
import Messages from '../Messages';
import Input from '../Input';
import TextContainer from '../TextContainer';


import './Chat.css';


let socket;


const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, seUsers] = useState([]);


    // const ENDPOINT = `localhost:5000`;
    const ENDPOINT = `https://chat-app-reacthooks.herokuapp.com`;



    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, (error) => {
            if (error) {
                alert(error);
            }
        });
        // fires on unmount
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });

        socket.on('roomData', ({ users }) => {
            seUsers(users);
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        };

    }, [messages]);

    // function for sending messages
    const sendMessage = (event) => {

        event.preventDefault();

        if (message) {
            // the back end runs the callback that clear the setMessage
            socket.emit('sendMessage', message, () => setMessage(''));
        };
    };

    console.log(message, messages);

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages name={name} messages={messages} />
                <Input message={message} sendMessage={sendMessage} setMessage={setMessage} />
            </div>
            <TextContainer users={users} />
        </div>
    );
};

export default Chat;