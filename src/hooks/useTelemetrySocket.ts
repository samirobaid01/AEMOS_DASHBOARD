import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { TelemetryVariable } from '../types/sensor';

// Update the interface to match the actual server response
interface DataStreamPayload {
  dataStream: {
    id: number;
    value: string | number;
    telemetryDataId: number;
    recievedAt: string; // Note the typo in the field name from the server
  };
  timestamp: string;
}

interface TelemetryValues {
  [key: number]: {
    value: number | string | boolean;
    timestamp: string;
    isNew: boolean;
  };
}

export const useTelemetrySocket = (telemetryVariables: TelemetryVariable[] | undefined) => {
  const [telemetryValues, setTelemetryValues] = useState<TelemetryValues>({});
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

  useEffect(() => {
    // Only connect if we have telemetry variables
    if (!telemetryVariables || telemetryVariables.length === 0) {
      return;
    }

    console.log('Attempting to connect to socket server at:', socketUrl);
    
    // Create socket connection
    socketRef.current = io(socketUrl, {
      transports: ['websocket'],
      path: '/socket.io',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Set up connection handlers
    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to telemetry socket:', socket.id);
      console.log('Socket transport:', socket.io.engine.transport.name);
      setConnected(true);

      // Join rooms for each telemetry variable
      telemetryVariables.forEach((variable) => {
        const roomName = `telemetry-${variable.id}`;
        console.log(`Joining telemetry room: ${roomName} for variable: ${variable.variableName}`);
        socket.emit('join', roomName);
      });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      console.error('Socket connection error details:', error.message);
      setConnected(false);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from socket:', reason);
      setConnected(false);
    });

    // Listen for new datastreams, now using the updated format
    socket.on('new-datastream', (payload: DataStreamPayload) => {
      console.log('New datastream received:', payload);
      
      // Extract the relevant data from the nested structure
      const { dataStream, timestamp } = payload;
      const { telemetryDataId, value } = dataStream;

      setTelemetryValues((prev) => {
        // Mark all existing values as not new
        const resetState = Object.entries(prev).reduce((acc, [id, value]) => {
          acc[Number(id)] = { ...value, isNew: false };
          return acc;
        }, {} as TelemetryValues);

        // Add or update the value that just came in, marking it as new
        return {
          ...resetState,
          [telemetryDataId]: {
            value: value,
            timestamp: timestamp,
            isNew: true
          }
        };
      });

      // Reset the "isNew" flag after animation time
      setTimeout(() => {
        setTelemetryValues((prev) => {
          if (prev[telemetryDataId]) {
            return {
              ...prev,
              [telemetryDataId]: {
                ...prev[telemetryDataId],
                isNew: false
              }
            };
          }
          return prev;
        });
      }, 2000);
    });

    // Add a catch-all listener to see all events
    socket.onAny((eventName, ...args) => {
      console.log(`Received socket event: ${eventName}`, args);
    });

    // Cleanup function
    return () => {
      // Leave telemetry rooms before disconnecting
      if (socket && telemetryVariables) {
        telemetryVariables.forEach((variable) => {
          const roomName = `telemetry-${variable.id}`;
          console.log(`Leaving telemetry room: ${roomName}`);
          socket.emit('leave', roomName);
        });
        socket.disconnect();
        setConnected(false);
      }
    };
  }, [telemetryVariables]);

  return { telemetryValues, connected };
}; 