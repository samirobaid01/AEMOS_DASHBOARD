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
  const variablesRef = useRef(telemetryVariables);
  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

  // Keep variablesRef current without triggering reconnects
  useEffect(() => {
    variablesRef.current = telemetryVariables;
  });

  // Stable dependency: reconnect only when the set of IDs changes, not on every render
  const variableIds = telemetryVariables?.map((v) => v.id).join(',') ?? '';

  useEffect(() => {
    if (!variableIds) {
      return;
    }

    // Disconnect any existing socket before creating a new one
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(socketUrl, {
      transports: ['websocket'],
      path: '/socket.io',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      variablesRef.current?.forEach((variable) => {
        socket.emit('join', `telemetry-${variable.id}`);
      });
    });

    socket.on('connect_error', () => {
      setConnected(false);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('new-datastream', (payload: DataStreamPayload) => {
      const { dataStream, timestamp } = payload;
      const { telemetryDataId, value } = dataStream;

      setTelemetryValues((prev) => {
        const resetState = Object.entries(prev).reduce((acc, [id, val]) => {
          acc[Number(id)] = { ...val, isNew: false };
          return acc;
        }, {} as TelemetryValues);

        return {
          ...resetState,
          [telemetryDataId]: { value, timestamp, isNew: true },
        };
      });

      setTimeout(() => {
        setTelemetryValues((prev) => {
          if (!prev[telemetryDataId]) return prev;
          return {
            ...prev,
            [telemetryDataId]: { ...prev[telemetryDataId], isNew: false },
          };
        });
      }, 2000);
    });

    return () => {
      // Only emit leave if the socket is actually connected; emitting on a
      // mid-handshake socket is what causes "WebSocket closed before established"
      if (socket.connected) {
        variablesRef.current?.forEach((variable) => {
          socket.emit('leave', `telemetry-${variable.id}`);
        });
      }
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variableIds, socketUrl]);

  return { telemetryValues, connected };
}; 