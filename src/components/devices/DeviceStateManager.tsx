import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import Card from '../common/Card/Card';
import Modal from '../common/Modal/Modal';
import type { DeviceState } from '../../state/slices/deviceStates.slice';
import Button from '../common/Button/Button';
import type { DeviceStateManagerProps } from './types';

const DeviceStateManager: React.FC<DeviceStateManagerProps> = ({
  states = [],
  onAddState,
  onUpdateState,
  onDeactivateState,
  isLoading,
  error
}) => {
  const { t } = useTranslation();
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

  const inputClassName = "w-full px-3 py-2 rounded-md border border-border dark:border-border-dark bg-background dark:bg-background-dark text-textPrimary dark:text-textPrimary-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark";

  if (isLoading) {
    return (
      <Card className="mt-8">
        <div>
          <h3 className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark mb-2">
            {t('devices.deviceState.title')}
          </h3>
          <p className="text-sm text-textSecondary dark:text-textSecondary-dark">
            {t('devices.deviceState.loading')}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark mb-2">
          {t('devices.deviceState.title')}
        </h3>
        <p className="text-sm text-textSecondary dark:text-textSecondary-dark">
          {t('devices.deviceState.description')}
        </p>
      </div>

      {error && (
        <div className="bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className={cn(
        'grid gap-4 mb-6',
        isMobile ? 'grid-cols-1' : 'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]'
      )}>
        <input
          type="text"
          placeholder={t('devices.deviceState.stateName')}
          value={newState.stateName}
          onChange={(e) => setNewState({ ...newState, stateName: e.target.value })}
          className={inputClassName}
        />
        <select
          value={newState.dataType}
          onChange={(e) => setNewState({ ...newState, dataType: e.target.value })}
          className={inputClassName}
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
          className={inputClassName}
        />
        <input
          type="text"
          placeholder={t('devices.deviceState.allowedValues')}
          value={newState.allowedValues.join(',')}
          onChange={(e) => setNewState({ ...newState, allowedValues: e.target.value.split(',').map(v => v.trim()) })}
          className={inputClassName}
        />
        <Button
          variant="primary"
          onClick={handleAddState}
          disabled={isLoading || !newState.stateName}
        >
          {t('devices.deviceState.addState')}
        </Button>
      </div>

      <div className={cn(
        'grid gap-4',
        isMobile ? 'grid-cols-1' : 'grid-cols-[repeat(auto-fill,minmax(300px,1fr))]'
      )}>
        {Array.isArray(states) && states.map((state) => (
          <div key={state.id} className="p-4 bg-surface dark:bg-surface-dark rounded-md border border-border dark:border-border-dark">
            <div className="mb-3">
              <strong className="text-textPrimary dark:text-textPrimary-dark">
                {state.stateName}
              </strong>
              <span className={cn(
                'ml-2 text-xs',
                state.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
              )}>
                ({state.status === 'active' ? t('devices.deviceState.active') : state.status === 'inactive' ? t('devices.deviceState.inactive') : t('devices.deviceState.suspended')})
              </span>
            </div>
            <div className="text-sm text-textSecondary dark:text-textSecondary-dark mb-2 space-y-1">
              <div>Type: {state.dataType}</div>
              <div>Default: {state.defaultValue}</div>
              <div>Allowed: {(Array.isArray(state.allowedValues) ? state.allowedValues : []).join(', ')}</div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditingState({
                  id: state.id,
                  state: {
                    stateName: state.stateName,
                    dataType: state.dataType,
                    defaultValue: state.defaultValue,
                    allowedValues: Array.isArray(state.allowedValues) ? state.allowedValues : [],
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
        <Modal
          isOpen={true}
          onClose={() => setEditingState(null)}
          title={t('devices.deviceState.editState')}
        >
          <div className="grid gap-4 mb-6">
            <input
              type="text"
              placeholder={t('devices.deviceState.stateName')}
              value={editingState.state.stateName}
              onChange={(e) => setEditingState({
                ...editingState,
                state: { ...editingState.state, stateName: e.target.value }
              })}
              className={inputClassName}
            />
            <select
              value={editingState.state.dataType}
              onChange={(e) => setEditingState({
                ...editingState,
                state: { ...editingState.state, dataType: e.target.value }
              })}
              className={inputClassName}
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
              className={inputClassName}
            />
            <input
              type="text"
              placeholder={t('devices.deviceState.allowedValues')}
              value={editingState.state.allowedValues?.join(',')}
              onChange={(e) => setEditingState({
                ...editingState,
                state: { ...editingState.state, allowedValues: e.target.value.split(',').map(v => v.trim()) }
              })}
              className={inputClassName}
            />
            <select
              value={editingState.state.status}
              onChange={(e) => setEditingState({
                ...editingState,
                state: { ...editingState.state, status: e.target.value as 'active' | 'inactive' | 'suspended' }
              })}
              className={inputClassName}
            >
              <option value="active">{t('devices.deviceState.active')}</option>
              <option value="inactive">{t('devices.deviceState.inactive')}</option>
              <option value="suspended">{t('devices.deviceState.suspended')}</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end">
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
        </Modal>
      )}
    </Card>
  );
};

export default DeviceStateManager; 