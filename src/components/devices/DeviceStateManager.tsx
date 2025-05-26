import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import type { DeviceState } from '../../state/slices/deviceStates.slice';
import Button from '../common/Button/Button';

interface DeviceStateManagerProps {
  states: DeviceState[];
  onAddState: (state: Omit<DeviceState, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateState: (stateId: number, state: Partial<Omit<DeviceState, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  onDeactivateState: (stateId: number) => void;
  isLoading: boolean;
  error: string | null;
}

const DeviceStateManager: React.FC<DeviceStateManagerProps> = ({
  states = [],
  onAddState,
  onUpdateState,
  onDeactivateState,
  isLoading,
  error
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = window.innerWidth < 768;

  const [newState, setNewState] = useState<Omit<DeviceState, 'id' | 'createdAt' | 'updatedAt'>>({
    stateName: '',
    dataType: 'string',
    defaultValue: '',
    allowedValues: []
  });

  const [editingState, setEditingState] = useState<{
    id: number;
    state: Partial<Omit<DeviceState, 'id' | 'createdAt' | 'updatedAt'>>
  } | null>(null);

  const handleAddState = () => {
    onAddState(newState);
    setNewState({
      stateName: '',
      dataType: 'string',
      defaultValue: '',
      allowedValues: []
    });
  };

  const handleUpdateState = () => {
    if (editingState) {
      onUpdateState(editingState.id, editingState.state);
      setEditingState(null);
    }
  };

  const containerStyle = {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: darkMode ? colors.cardBackground : 'white',
    borderRadius: '0.5rem',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`
  };

  const headerStyle = {
    marginBottom: '1.5rem'
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: darkMode ? colors.textPrimary : '#111827',
    marginBottom: '0.5rem'
  };

  const descriptionStyle = {
    fontSize: '0.875rem',
    color: darkMode ? colors.textSecondary : '#6b7280'
  };

  const formStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
    backgroundColor: darkMode ? colors.background : 'white',
    color: darkMode ? colors.textPrimary : '#111827'
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    backgroundColor: darkMode ? '#4d7efa' : '#3b82f6',
    color: 'white',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    opacity: isLoading ? 0.7 : 1
  };

  const stateListStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem'
  };

  const stateCardStyle = {
    padding: '1rem',
    backgroundColor: darkMode ? colors.surfaceBackground : '#f9fafb',
    borderRadius: '0.375rem',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>{t('devices.deviceState.title')}</h3>
          <p style={descriptionStyle}>{t('devices.deviceState.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>{t('devices.deviceState.title')}</h3>
        <p style={descriptionStyle}>{t('devices.deviceState.description')}</p>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          backgroundColor: darkMode ? colors.dangerBackground : '#fee2e2',
          color: darkMode ? colors.dangerText : '#b91c1c',
          borderRadius: '0.375rem'
        }}>
          {error}
        </div>
      )}

      <div style={formStyle}>
        <input
          type="text"
          placeholder={t('devices.deviceState.stateName')}
          value={newState.stateName}
          onChange={(e) => setNewState({ ...newState, stateName: e.target.value })}
          style={inputStyle}
        />
        <select
          value={newState.dataType}
          onChange={(e) => setNewState({ ...newState, dataType: e.target.value })}
          style={inputStyle}
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
        </select>
        <input
          type="text"
          placeholder={t('devices.deviceState.defaultValue')}
          value={newState.defaultValue}
          onChange={(e) => setNewState({ ...newState, defaultValue: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder={t('devices.deviceState.allowedValues')}
          value={newState.allowedValues.join(',')}
          onChange={(e) => setNewState({ ...newState, allowedValues: e.target.value.split(',').map(v => v.trim()) })}
          style={inputStyle}
        />
        <Button
          variant="primary"
          onClick={handleAddState}
          disabled={isLoading || !newState.stateName}
        >
          {t('devices.deviceState.addState')}
        </Button>
      </div>

      <div style={stateListStyle}>
        {Array.isArray(states) && states.map((state) => (
          <div key={state.id} style={stateCardStyle}>
            <div style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: darkMode ? colors.textPrimary : '#111827' }}>
                {state.stateName}
              </strong>
              <span style={{ 
                marginLeft: '0.5rem',
                fontSize: '0.75rem',
                color: state.status === 'active' ? '#10b981' : '#ef4444'
              }}>
                ({state.status === 'active' ? t('devices.deviceState.active') : state.status === 'inactive' ? t('devices.deviceState.inactive') : t('devices.deviceState.suspended')})
              </span>
            </div>
            <div style={{ 
              fontSize: '0.875rem',
              color: darkMode ? colors.textSecondary : '#6b7280',
              marginBottom: '0.5rem'
            }}>
              <div>Type: {state.dataType}</div>
              <div>Default: {state.defaultValue}</div>
              <div>Allowed: {state.allowedValues.join(', ')}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditingState({
                  id: state.id,
                  state: {
                    stateName: state.stateName,
                    dataType: state.dataType,
                    defaultValue: state.defaultValue,
                    allowedValues: state.allowedValues,
                    status: state.status
                  }
                })}
                disabled={isLoading}
              >
                {t('devices.deviceState.editState')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDeactivateState(state.id)}
                disabled={isLoading || state.status === 'inactive' || state.status === 'suspended'}
              >
                {t('devices.deviceState.deactivate')}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingState && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: darkMode ? colors.cardBackground : 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            width: '100%',
            maxWidth: '500px'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: darkMode ? colors.textPrimary : '#111827',
              marginBottom: '1rem'
            }}>
              {t('devices.deviceState.editState')}
            </h3>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder={t('devices.deviceState.stateName')}
                value={editingState.state.stateName}
                onChange={(e) => setEditingState({
                  ...editingState,
                  state: { ...editingState.state, stateName: e.target.value }
                })}
                style={inputStyle}
              />
              <select
                value={editingState.state.dataType}
                onChange={(e) => setEditingState({
                  ...editingState,
                  state: { ...editingState.state, dataType: e.target.value }
                })}
                style={inputStyle}
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
              <input
                type="text"
                placeholder={t('devices.deviceState.defaultValue')}
                value={editingState.state.defaultValue}
                onChange={(e) => setEditingState({
                  ...editingState,
                  state: { ...editingState.state, defaultValue: e.target.value }
                })}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder={t('devices.deviceState.allowedValues')}
                value={editingState.state.allowedValues?.join(',')}
                onChange={(e) => setEditingState({
                  ...editingState,
                  state: { ...editingState.state, allowedValues: e.target.value.split(',').map(v => v.trim()) }
                })}
                style={inputStyle}
              />
              <select
                value={editingState.state.status}
                onChange={(e) => setEditingState({
                  ...editingState,
                  state: { ...editingState.state, status: e.target.value as 'active' | 'inactive' | 'suspended' }
                })}
              >
                <option value="active">{t('devices.deviceState.active')}</option>
                <option value="inactive">{t('devices.deviceState.inactive')}</option>
                <option value="suspended">{t('devices.deviceState.suspended')}</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button
                variant="secondary"
                onClick={() => setEditingState(null)}
                disabled={isLoading}
              >
                {t('cancel')}
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateState}
                disabled={isLoading}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceStateManager; 