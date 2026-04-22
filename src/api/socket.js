import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const socket = io(URL, {
  autoConnect: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});
