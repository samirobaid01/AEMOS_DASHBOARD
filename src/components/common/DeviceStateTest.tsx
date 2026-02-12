import React, { useState, useEffect, useRef } from 'react';
import Button from './Button/Button';
import { useDeviceStateSocket } from '../../hooks/useDeviceStateSocket';
import { TOKEN_STORAGE_KEY } from '../../config';

interface LogEvent {
  event: string;
  data: unknown;
  priority?: 'high' | 'normal';
  timestamp: Date;
}

const DeviceStateTest: React.FC = () => {
  const [deviceId, setDeviceId] = useState('');
  const [deviceUuid, setDeviceUuid] = useState('');
  const [events, setEvents] = useState<LogEvent[]>([]);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  const authToken = localStorage.getItem(TOKEN_STORAGE_KEY) || '';

  const logEvent = (event: string, data: unknown, priority: 'high' | 'normal' = 'normal') => {
    setEvents(prev => [{ event, data, priority, timestamp: new Date() }, ...prev]);
  };

  useEffect(() => {
    if (eventsEndRef.current) eventsEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  const {
    isConnected,
    socketId,
    connect,
    disconnect,
    joinRoom,
    joinDeviceUuidRoom,
  } = useDeviceStateSocket({
    serverUrl: 'http://localhost:3000',
    authToken,
    deviceUuid,
    onNotification: (notification) => logEvent('device-state-change', notification, notification.priority),
    onConnectionChange: (connected) => {
      if (connected) logEvent('connect', { socketId });
      else logEvent('disconnect', {});
    },
    onError: (error) => logEvent('connect_error', { error: error.message }, 'high')
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(testData)
      });
      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
      const result = await response.json();
      logEvent('test-state-change', result);
    } catch (error) {
      logEvent('api-error', { error: error instanceof Error ? error.message : 'Unknown error' }, 'high');
    }
  };

  const inputClasses = "px-3 py-2 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="max-w-[800px] mx-auto p-5">
      <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark mb-4">
        AEMOS Device State Socket Client
      </h1>

      <div className="bg-warningBg dark:bg-warningBg-dark border-l-4 border-warning dark:border-warning-dark text-warningText dark:text-warningText-dark py-2.5 px-3 rounded mb-5 font-semibold text-sm">
        <p className="m-0">⚠️ This is a development tool accessible from localhost only. Not for production use.</p>
      </div>

      <div
        className={`py-2.5 px-3 rounded text-sm font-medium ${
          isConnected
            ? 'bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark'
            : 'bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark'
        }`}
      >
        {isConnected ? `Connected (Socket ID: ${socketId})` : 'Disconnected'}
      </div>

      <div className="flex gap-2 my-5">
        <Button type="button" onClick={handleConnect} disabled={isConnected}>
          Connect
        </Button>
        <Button type="button" variant="danger" onClick={disconnect} disabled={!isConnected}>
          Disconnect
        </Button>
      </div>

      <div className="my-5 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="Device ID"
            className={inputClasses}
          />
          <Button type="button" onClick={handleJoinDeviceRoom} disabled={!isConnected}>
            Join Device Room
          </Button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={deviceUuid}
            onChange={(e) => setDeviceUuid(e.target.value)}
            placeholder="Device UUID"
            className={inputClasses}
          />
          <Button type="button" onClick={handleJoinDeviceUuidRoom} disabled={!isConnected}>
            Join Device UUID Room
          </Button>
        </div>
      </div>

      <div className="my-5">
        <Button type="button" onClick={handleTestStateChange} disabled={!isConnected}>
          Test State Change
        </Button>
      </div>

      <h2 className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark mb-2">
        Event Log
      </h2>
      <div className="mt-5 border border-border dark:border-border-dark rounded p-3 h-[400px] overflow-y-auto bg-surfaceHover dark:bg-surfaceHover-dark">
        {events.map((event, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded border-l-4 ${
              event.priority === 'high'
                ? 'bg-dangerBg dark:bg-dangerBg-dark border-danger dark:border-danger-dark'
                : 'bg-infoBg dark:bg-infoBg-dark border-info dark:border-info-dark'
            }`}
          >
            <strong className="text-sm text-textPrimary dark:text-textPrimary-dark">
              {event.timestamp.toLocaleTimeString()} - {event.event}
            </strong>
            <pre className="m-1 mt-1 text-xs whitespace-pre-wrap text-textPrimary dark:text-textPrimary-dark">
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
