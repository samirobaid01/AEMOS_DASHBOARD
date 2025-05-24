import React, { useState } from 'react';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import StateDropdown from '../common/Select/StateDropdown';
import { useTranslation } from 'react-i18next';

interface DeviceStateModalProps {
  isOpen: boolean;
  onClose: () => void;
  stateName: string;
  currentValue: string;
  defaultValue: string;
  allowedValues: string[];
  onSave: (value: string) => void;
  isLoading: boolean;
}

const DeviceStateModal: React.FC<DeviceStateModalProps> = ({
  isOpen,
  onClose,
  stateName,
  currentValue,
  defaultValue,
  allowedValues,
  onSave,
  isLoading
}) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(currentValue);

  const handleSave = () => {
    onSave(selectedValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
  };

  const footer = (
    <>
      <Button
        variant="secondary"
        onClick={onClose}
        disabled={isLoading}
      >
        {t('cancel')}
      </Button>
      <Button
        variant="primary"
        onClick={handleSave}
        isLoading={isLoading}
        disabled={selectedValue === currentValue}
      >
        {t('save')}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('change_state', { name: stateName })}
      footer={footer}
    >
      <StateDropdown
        id={`modal-state-${stateName}`}
        name={`modal-state-${stateName}`}
        label={t('select_new_state')}
        value={selectedValue}
        defaultValue={defaultValue}
        allowedValues={allowedValues}
        onChange={handleChange}
      />
    </Modal>
  );
};

export default DeviceStateModal; 