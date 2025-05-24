import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useDeviceStateSocket } from '../../hooks/useDeviceStateSocket';
import type { DeviceStateNotification } from '../../hooks/useDeviceStateSocket';
import { TOKEN_STORAGE_KEY } from '../../config';

interface LogEvent {
  event: string;
  data: any;
  priority?: 'high' | 'normal';
  timestamp: Date;
}

const DeviceStateTest: React.FC = () => {
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const [deviceId, setDeviceId] = useState('');
  const [deviceUuid, setDeviceUuid] = useState('');
  const [events, setEvents] = useState<LogEvent[]>([]);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  // Get auth token from localStorage
  const authToken = localStorage.getItem(TOKEN_STORAGE_KEY) || '';

  const logEvent = (event: string, data: any, priority: 'high' | 'normal' = 'normal') => {
    setEvents(prev => [{
      event,
      data,
      priority,
      timestamp: new Date()
    }, ...prev]);
  };

  // Scroll to bottom of events
  useEffect(() => {
    if (eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events]);

  const {
    isConnected,
    socketId,
    connect,
    disconnect,
    joinRoom,
    joinDeviceUuidRoom,
    lastError
  } = useDeviceStateSocket({
    serverUrl: 'http://localhost:3000',
    authToken,
    deviceUuid,
    onNotification: (notification) => {
      logEvent('device-state-change', notification, notification.priority);
    },
    onConnectionChange: (connected) => {
      if (connected) {
        logEvent('connect', { socketId });
      } else {
        logEvent('disconnect', {});
      }
    },
    onError: (error) => {
      logEvent('connect_error', { error: error.message }, 'high');
    }
  });

  const handleConnect = () => {
    if (!authToken) {
      logEvent('error', { message: 'No authentication token found. Please log in first.' }, 'high');
      return;
    }
    connect();
  };

  const handleJoinDeviceRoom = () => {
    if (!deviceId) {
      logEvent('error', { message: 'Please enter a Device ID' }, 'high');
      return;
    }
    joinRoom(deviceId);
    logEvent('join-room', { room: `device-${deviceId}` });
  };

  const handleJoinDeviceUuidRoom = () => {
    if (!deviceUuid) {
      logEvent('error', { message: 'Please enter a Device UUID' }, 'high');
      return;
    }
    joinDeviceUuidRoom(deviceUuid);
    logEvent('join-room', { room: `device-uuid-${deviceUuid}` });
  };

  const handleTestStateChange = async () => {
    if (!deviceId) {
      logEvent('error', { message: 'Please enter a Device ID first' }, 'high');
      return;
    }

    try {
      const testData = {
        deviceId: parseInt(deviceId),
        stateId: 1,
        value: `test-value-${Math.floor(Math.random() * 100)}`,
        metadata: {
          deviceName: `Test Device ${deviceId}`,
          stateName: 'Test State',
          deviceType: 'TEST',
          deviceId: parseInt(deviceId),
          deviceUuid: deviceUuid || `test-uuid-${deviceId}`,
          oldValue: 'old-value',
          newValue: 'new-value'
        }
      };

      const response = await fetch('/api/v1/device-state-instances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(testData)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      logEvent('test-state-change', result);
    } catch (error) {
      logEvent('api-error', { error: error instanceof Error ? error.message : 'Unknown error' }, 'high');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: darkMode ? colors.textPrimary : '#333' }}>
        AEMOS Device State Socket Client
      </h1>

      <div style={{
        backgroundColor: '#fff3cd',
        borderLeft: '4px solid #856404',
        color: '#856404',
        padding: '10px',
        marginBottom: '20px',
        borderRadius: '4px',
        fontWeight: 'bold'
      }}>
        <p>⚠️ This is a development tool accessible from localhost only. Not for production use.</p>
      </div>

      <div style={{
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
        color: isConnected ? '#155724' : '#721c24'
      }}>
        {isConnected ? `Connected (Socket ID: ${socketId})` : 'Disconnected'}
      </div>

      <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <button
          onClick={handleConnect}
          disabled={isConnected}
          style={{
            padding: '8px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isConnected ? 'not-allowed' : 'pointer',
            opacity: isConnected ? 0.65 : 1
          }}
        >
          Connect
        </button>
        <button
          onClick={disconnect}
          disabled={!isConnected}
          style={{
            padding: '8px 12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !isConnected ? 'not-allowed' : 'pointer',
            opacity: !isConnected ? 0.65 : 1
          }}
        >
          Disconnect
        </button>
      </div>

      <div style={{ margin: '20px 0' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="Device ID"
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ced4da'
            }}
          />
          <button
            onClick={handleJoinDeviceRoom}
            disabled={!isConnected}
            style={{
              padding: '8px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !isConnected ? 'not-allowed' : 'pointer',
              opacity: !isConnected ? 0.65 : 1
            }}
          >
            Join Device Room
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={deviceUuid}
            onChange={(e) => setDeviceUuid(e.target.value)}
            placeholder="Device UUID"
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ced4da'
            }}
          />
          <button
            onClick={handleJoinDeviceUuidRoom}
            disabled={!isConnected}
            style={{
              padding: '8px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !isConnected ? 'not-allowed' : 'pointer',
              opacity: !isConnected ? 0.65 : 1
            }}
          >
            Join Device UUID Room
          </button>
        </div>
      </div>

      <div style={{ margin: '20px 0' }}>
        <button
          onClick={handleTestStateChange}
          disabled={!isConnected}
          style={{
            padding: '8px 12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !isConnected ? 'not-allowed' : 'pointer',
            opacity: !isConnected ? 0.65 : 1
          }}
        >
          Test State Change
        </button>
      </div>

      <h2 style={{ color: darkMode ? colors.textPrimary : '#333' }}>Event Log</h2>
      <div style={{
        marginTop: '20px',
        border: '1px solid #ddd',
        padding: '10px',
        height: '400px',
        overflowY: 'auto',
        backgroundColor: '#f9f9f9'
      }}>
        {events.map((event, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              padding: '8px',
              borderRadius: '4px',
              backgroundColor: event.priority === 'high' ? '#f8d7da' : '#d1ecf1',
              borderLeft: `4px solid ${event.priority === 'high' ? '#721c24' : '#0c5460'}`
            }}
          >
            <strong>{event.timestamp.toLocaleTimeString()} - {event.event}</strong>
            <pre style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(event.data, null, 2)}
            </pre>
          </div>
        ))}
        <div ref={eventsEndRef} />
      </div>
    </div>
  );
};

export default DeviceStateTest; 