import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_BASE_URL 
  || 'http://localhost:3001';

export const socket = io(URL, {
  autoConnect:          true,
  reconnectionAttempts: 10,
  reconnectionDelay:    2000,
  transports:           ['websocket', 'polling'],
});

socket.on('connect_error', (err) => {
  console.warn('Socket connection error:', err.message);
});
