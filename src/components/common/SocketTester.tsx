import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';

interface LogMessage {
  type: 'info' | 'error' | 'success';
  message: string;
  timestamp: Date;
}

const SocketTester: React.FC = () => {
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const [url, setUrl] = useState('http://localhost:3000');
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState('telemetry-1');
  const [event, setEvent] = useState('new-datastream');
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [telemetryId, setTelemetryId] = useState('1');
  const [sampleValue, setSampleValue] = useState('25.4');

  // Scroll to bottom of logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (type: 'info' | 'error' | 'success', message: string) => {
    setLogs((prev) => [...prev, { type, message, timestamp: new Date() }]);
  };

  const handleConnect = () => {
    if (socketRef.current) {
      addLog('info', 'Disconnecting existing socket...');
      socketRef.current.disconnect();
    }

    addLog('info', `Connecting to ${url}...`);
    
    try {
      socketRef.current = io(url, {
        transports: ['websocket'],
        path: '/socket.io',
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        addLog('success', `Connected to socket server! Socket ID: ${socketRef.current?.id}`);
        addLog('info', `Transport: ${socketRef.current?.io.engine.transport.name}`);
        setConnected(true);
      });

      socketRef.current.on('connect_error', (error) => {
        addLog('error', `Connection error: ${error.message}`);
        setConnected(false);
      });

      socketRef.current.on('disconnect', (reason) => {
        addLog('info', `Disconnected: ${reason}`);
        setConnected(false);
      });

      socketRef.current.onAny((eventName, ...args) => {
        addLog('success', `Event '${eventName}' received with data: ${JSON.stringify(args)}`);
      });
    } catch (error) {
      addLog('error', `Error creating socket: ${error}`);
    }
  };

  const handleDisconnect = () => {
    if (!socketRef.current) {
      addLog('error', 'No active socket connection');
      return;
    }

    socketRef.current.disconnect();
    socketRef.current = null;
    setConnected(false);
    addLog('info', 'Socket disconnected');
  };

  const handleJoinRoom = () => {
    if (!socketRef.current || !connected) {
      addLog('error', 'Socket not connected');
      return;
    }

    addLog('info', `Joining room: ${room}`);
    socketRef.current.emit('join', room);
  };

  const handleLeaveRoom = () => {
    if (!socketRef.current || !connected) {
      addLog('error', 'Socket not connected');
      return;
    }

    addLog('info', `Leaving room: ${room}`);
    socketRef.current.emit('leave', room);
  };

  const handleListenToEvent = () => {
    if (!socketRef.current || !connected) {
      addLog('error', 'Socket not connected');
      return;
    }

    addLog('info', `Listening to event: ${event}`);
    socketRef.current.on(event, (data) => {
      addLog('success', `Received data from event '${event}': ${JSON.stringify(data)}`);
    });
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleSendTestData = () => {
    if (!socketRef.current || !connected) {
      addLog('error', 'Socket not connected');
      return;
    }
    
    try {
      const telemetryIdNum = parseInt(telemetryId, 10);
      const testData = {
        dataStream: {
          id: Math.floor(Math.random() * 1000),
          value: sampleValue,
          telemetryDataId: telemetryIdNum,
          recievedAt: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
      
      addLog('info', `Sending test data for telemetry ID: ${telemetryIdNum}`);
      
      // Emit to the server to broadcast to room
      socketRef.current.emit('send-telemetry', {
        room: `telemetry-${telemetryIdNum}`,
        data: testData
      });
      
      addLog('success', `Test data sent: ${JSON.stringify(testData)}`);
    } catch (error) {
      addLog('error', `Error sending test data: ${error}`);
    }
  };

  const getLogColor = (type: 'info' | 'error' | 'success') => {
    switch (type) {
      case 'info':
        return darkMode ? '#94a3b8' : '#64748b';
      case 'error':
        return darkMode ? '#ef4444' : '#dc2626';
      case 'success':
        return darkMode ? '#10b981' : '#059669';
      default:
        return darkMode ? colors.textPrimary : '#111827';
    }
  };

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: darkMode ? colors.cardBackground : 'white',
      borderRadius: '0.5rem',
      boxShadow: darkMode 
        ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' 
        : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    }}>
      <h2 style={{ 
        fontSize: '1.25rem', 
        fontWeight: 600, 
        color: darkMode ? colors.textPrimary : '#111827',
        marginBottom: '1.5rem'
      }}>
        Socket Connection Tester
      </h2>

      {/* Connection Settings */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: darkMode ? colors.textSecondary : '#4b5563',
          marginBottom: '0.5rem'
        }}>
          Socket Server URL
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
            backgroundColor: darkMode ? colors.surfaceBackground : 'white',
            color: darkMode ? colors.textPrimary : '#111827',
            marginBottom: '0.75rem'
          }}
          placeholder="Enter socket server URL"
        />

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleConnect}
            disabled={connected}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: connected ? (darkMode ? '#1f2937' : '#e5e7eb') : (darkMode ? '#4d7efa' : '#3b82f6'),
              color: connected ? (darkMode ? '#6b7280' : '#9ca3af') : 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: 500,
              cursor: connected ? 'not-allowed' : 'pointer',
            }}
          >
            Connect
          </button>
          <button
            onClick={handleDisconnect}
            disabled={!connected}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: !connected ? (darkMode ? '#1f2937' : '#e5e7eb') : (darkMode ? '#ef4444' : '#dc2626'),
              color: !connected ? (darkMode ? '#6b7280' : '#9ca3af') : 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: 500,
              cursor: !connected ? 'not-allowed' : 'pointer',
            }}
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Room Management */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: darkMode ? colors.textSecondary : '#4b5563',
          marginBottom: '0.5rem'
        }}>
          Room Name
        </label>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
            backgroundColor: darkMode ? colors.surfaceBackground : 'white',
            color: darkMode ? colors.textPrimary : '#111827',
            marginBottom: '0.75rem'
          }}
          placeholder="Enter room name"
        />

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleJoinRoom}
            disabled={!connected}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: !connected ? (darkMode ? '#1f2937' : '#e5e7eb') : (darkMode ? '#4d7efa' : '#3b82f6'),
              color: !connected ? (darkMode ? '#6b7280' : '#9ca3af') : 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: 500,
              cursor: !connected ? 'not-allowed' : 'pointer',
            }}
          >
            Join Room
          </button>
          <button
            onClick={handleLeaveRoom}
            disabled={!connected}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: !connected ? (darkMode ? '#1f2937' : '#e5e7eb') : (darkMode ? '#ef4444' : '#dc2626'),
              color: !connected ? (darkMode ? '#6b7280' : '#9ca3af') : 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: 500,
              cursor: !connected ? 'not-allowed' : 'pointer',
            }}
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Event Listening */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: darkMode ? colors.textSecondary : '#4b5563',
          marginBottom: '0.5rem'
        }}>
          Event Name
        </label>
        <input
          type="text"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
            backgroundColor: darkMode ? colors.surfaceBackground : 'white',
            color: darkMode ? colors.textPrimary : '#111827',
            marginBottom: '0.75rem'
          }}
          placeholder="Enter event name"
        />

        <button
          onClick={handleListenToEvent}
          disabled={!connected}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: !connected ? (darkMode ? '#1f2937' : '#e5e7eb') : (darkMode ? '#4d7efa' : '#3b82f6'),
            color: !connected ? (darkMode ? '#6b7280' : '#9ca3af') : 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontWeight: 500,
            cursor: !connected ? 'not-allowed' : 'pointer',
          }}
        >
          Listen to Event
        </button>
      </div>

      {/* Test Data Sender */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: darkMode ? colors.textPrimary : '#111827',
          marginBottom: '0.75rem'
        }}>
          Send Test Data
        </h3>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ flex: '1' }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: darkMode ? colors.textSecondary : '#4b5563',
              marginBottom: '0.25rem'
            }}>
              Telemetry ID
            </label>
            <input
              type="text"
              value={telemetryId}
              onChange={(e) => setTelemetryId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.375rem 0.5rem',
                borderRadius: '0.375rem',
                border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
                backgroundColor: darkMode ? colors.surfaceBackground : 'white',
                color: darkMode ? colors.textPrimary : '#111827',
              }}
              placeholder="Telemetry ID"
            />
          </div>
          
          <div style={{ flex: '1' }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: darkMode ? colors.textSecondary : '#4b5563',
              marginBottom: '0.25rem'
            }}>
              Value
            </label>
            <input
              type="text"
              value={sampleValue}
              onChange={(e) => setSampleValue(e.target.value)}
              style={{
                width: '100%',
                padding: '0.375rem 0.5rem',
                borderRadius: '0.375rem',
                border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
                backgroundColor: darkMode ? colors.surfaceBackground : 'white',
                color: darkMode ? colors.textPrimary : '#111827',
              }}
              placeholder="Sample value"
            />
          </div>
        </div>
        
        <button
          onClick={handleSendTestData}
          disabled={!connected}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: !connected ? (darkMode ? '#1f2937' : '#e5e7eb') : (darkMode ? '#10b981' : '#059669'),
            color: !connected ? (darkMode ? '#6b7280' : '#9ca3af') : 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontWeight: 500,
            cursor: !connected ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          Send Test Data
        </button>
      </div>

      {/* Data Format Helper */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '0.5rem' 
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: darkMode ? colors.textSecondary : '#4b5563',
          }}>
            Expected Data Format
          </label>
        </div>
        <div style={{
          padding: '0.75rem',
          borderRadius: '0.375rem',
          border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
          backgroundColor: darkMode ? colors.surfaceBackground : '#f9fafb',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
        }}>
          <pre style={{ 
            margin: 0, 
            color: darkMode ? colors.textPrimary : '#111827',
            overflow: 'auto'
          }}>
{`{
  "dataStream": {
    "id": 123,
    "value": "25.4",
    "telemetryDataId": 1,
    "recievedAt": "2025-05-10T18:42:06.046Z"
  },
  "timestamp": "2025-05-10T18:42:06.046Z"
}`}
          </pre>
        </div>
      </div>

      {/* Logs */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '0.5rem' 
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: darkMode ? colors.textSecondary : '#4b5563',
          }}>
            Logs
          </label>
          <button
            onClick={handleClearLogs}
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: 'transparent',
              color: darkMode ? colors.textSecondary : '#6b7280',
              border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Clear Logs
          </button>
        </div>
        <div style={{
          height: '200px',
          overflow: 'auto',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
          backgroundColor: darkMode ? colors.surfaceBackground : '#f9fafb',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
        }}>
          {logs.length === 0 ? (
            <div style={{ color: darkMode ? colors.textSecondary : '#6b7280', fontStyle: 'italic' }}>
              No logs yet...
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={`log-${log.timestamp.getTime()}-${index}`} style={{ marginBottom: '0.5rem', color: getLogColor(log.type) }}>
                <span style={{ color: darkMode ? '#6b7280' : '#9ca3af' }}>
                  [{log.timestamp.toLocaleTimeString()}]
                </span>
                {' '}
                {log.message}
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>

      <div style={{
        padding: '0.75rem',
        backgroundColor: darkMode ? colors.surfaceBackground : '#f3f4f6',
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        color: darkMode ? colors.textSecondary : '#4b5563',
      }}>
        <p style={{ margin: 0 }}>
          <strong>Status:</strong> {connected ? 'Connected' : 'Disconnected'}
        </p>
        {socketRef.current && connected && (
          <p style={{ margin: '0.5rem 0 0 0' }}>
            <strong>Socket ID:</strong> {socketRef.current.id}
          </p>
        )}
      </div>
    </div>
  );
};

export default SocketTester; 