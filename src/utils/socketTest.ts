import { io, Socket } from 'socket.io-client';

/**
 * Socket tester utility for debugging socket connections
 * Usage from browser console:
 * 
 * 1. import { socketTest } from './utils/socketTest';
 * 2. const tester = socketTest();
 * 3. tester.connect(); // Connect to the socket server
 * 4. tester.joinRoom('telemetry-1'); // Join a specific room
 * 5. tester.listenToEvent('new-datastream'); // Listen to a specific event
 * 6. tester.disconnect(); // Disconnect when done
 */
export const socketTest = () => {
  let socket: Socket | null = null;
  
  const connect = (url = 'http://localhost:3000') => {
    if (socket) {
      console.log('Socket already connected, disconnecting first');
      socket.disconnect();
    }
    
    console.log(`Connecting to socket server at: ${url}`);
    socket = io(url, {
      transports: ['websocket'],
      path: '/socket.io',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    socket.on('connect', () => {
      console.log('Socket connected successfully:', socket?.id);
      console.log('Transport:', socket?.io.engine.transport.name);
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
    
    // Listen to all events by default
    socket.onAny((eventName, ...args) => {
      console.log(`Event received: ${eventName}`, args);
    });
    
    return socket;
  };
  
  const joinRoom = (roomName: string) => {
    if (!socket || !socket.connected) {
      console.error('Socket not connected, call connect() first');
      return;
    }
    
    console.log(`Joining room: ${roomName}`);
    socket.emit('join', roomName);
  };
  
  const leaveRoom = (roomName: string) => {
    if (!socket || !socket.connected) {
      console.error('Socket not connected');
      return;
    }
    
    console.log(`Leaving room: ${roomName}`);
    socket.emit('leave', roomName);
  };
  
  const listenToEvent = (eventName: string) => {
    if (!socket || !socket.connected) {
      console.error('Socket not connected, call connect() first');
      return;
    }
    
    console.log(`Listening to event: ${eventName}`);
    socket.on(eventName, (data) => {
      console.log(`Received data from event ${eventName}:`, data);
    });
  };
  
  const emitEvent = (eventName: string, data: any) => {
    if (!socket || !socket.connected) {
      console.error('Socket not connected, call connect() first');
      return;
    }
    
    console.log(`Emitting event: ${eventName}`, data);
    socket.emit(eventName, data);
  };
  
  const disconnect = () => {
    if (!socket) {
      console.log('No socket connection to disconnect');
      return;
    }
    
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected and reference cleared');
  };
  
  return {
    connect,
    joinRoom,
    leaveRoom,
    listenToEvent,
    emitEvent,
    disconnect,
    getSocket: () => socket
  };
}; 