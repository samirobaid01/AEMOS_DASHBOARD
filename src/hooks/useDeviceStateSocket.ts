import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface DeviceStateNotification {
  title: string;
  message: string;
  type: string;
  deviceType: string;
  deviceId: number;
  priority: 'high' | 'normal';
  timestamp: Date;
  metadata: {
    deviceId: number;
    deviceUuid: string;
    deviceName: string;
    deviceType: string;
    isCritical: boolean;
    stateName: string;
    oldValue: string | null;
    newValue: string;
    initiatedBy: string;
    initiatorId: number;
  };
}

interface UseDeviceStateSocketOptions {
  serverUrl: string;
  authToken: string;
  deviceUuid: string;
  onNotification?: (notification: DeviceStateNotification) => void;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: Error) => void;
  autoConnect?: boolean;
}

interface UseDeviceStateSocketReturn {
  isConnected: boolean;
  socketId: string | null;
  connect: () => void;
  disconnect: () => void;
  joinRoom: (deviceId: string) => void;
  joinDeviceUuidRoom: (deviceUuid: string) => void;
  lastError: Error | null;
}

export const useDeviceStateSocket = (options: UseDeviceStateSocketOptions): UseDeviceStateSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [lastError, setLastError] = useState<Error | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const connect = () => {
    try {
      if (socketRef.current?.connected) {
        return;
      }

      if (!options.authToken) {
        const error = new Error('Authentication token is required');
        setLastError(error);
        options.onError?.(error);
        return;
      }

      console.log('Connecting to socket server...');
      socketRef.current = io(options.serverUrl, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        auth: { token: options.authToken }
      });

      socketRef.current.on('connect', () => {
        const id = socketRef.current?.id;
        console.log('Connected with socket ID:', id);
        setIsConnected(true);
        setSocketId(id || null);
        options.onConnectionChange?.(true);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setLastError(error instanceof Error ? error : new Error(String(error)));
        options.onError?.(error instanceof Error ? error : new Error(String(error)));
        setIsConnected(false);
        setSocketId(null);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from socket server');
        setIsConnected(false);
        setSocketId(null);
        options.onConnectionChange?.(false);
      });

      socketRef.current.on('device-state-change', (data) => {
        console.log('Received device state change:', data);
        options.onNotification?.(data);
      });

    } catch (error) {
      console.error('Error creating socket:', error);
      setLastError(error instanceof Error ? error : new Error('Failed to create socket'));
      options.onError?.(error instanceof Error ? error : new Error('Failed to create socket'));
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      console.log('Disconnecting socket...');
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setSocketId(null);
    }
  };

  const joinRoom = (deviceId: string) => {
    if (!socketRef.current?.connected) {
      console.warn('Socket not connected. Cannot join room.');
      return;
    }
    const room = `device-${deviceId}`;
    console.log('Joining room:', room);
    socketRef.current.emit('join', room);
  };

  const joinDeviceUuidRoom = (deviceUuid: string) => {
    if (!socketRef.current?.connected) {
      console.warn('Socket not connected. Cannot join room.');
      return;
    }
    const room = `device-uuid-${deviceUuid}`;
    console.log('Joining room:', room);
    socketRef.current.emit('join', room);
  };

  useEffect(() => {
    if (options.autoConnect && options.authToken) {
      connect();
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [options.autoConnect, options.authToken]);

  return {
    isConnected,
    socketId,
    connect,
    disconnect,
    joinRoom,
    joinDeviceUuidRoom,
    lastError
  };
}; 