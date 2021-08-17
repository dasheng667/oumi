import React, { createContext, useContext } from 'react';
import openSocket from 'socket.io-client';

const host = import.meta.env.MODE === 'development' ? 'http://localhost:9000' : window.location.origin;

export const socket = openSocket(host);

socket.on('connect', () => {
  window.console.log('socket.connected');
});

export const SocketContext = createContext({ socket });

export const useSocket = () => {
  return useContext(SocketContext);
};
