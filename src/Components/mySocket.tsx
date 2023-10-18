import { io } from 'socket.io-client';

// export const socket = io('http://localhost:4500',{ reconnection: false});
export const socket = io('https://server.livechatez.com',{ reconnection: false});
export let socketID = '';
socket.on('connect', () => {
    socketID = socket.id
})
