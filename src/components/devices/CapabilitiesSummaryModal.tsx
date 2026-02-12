import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button/Button';
import Modal from '../common/Modal/Modal';
import type { CapabilitiesSummaryModalProps } from './types';

const CapabilitiesSummaryModal: React.FC<CapabilitiesSummaryModalProps> = ({
  isOpen,
  capabilities,
  isSaving,
  error,
  onSave,
  onClose,
}) => {
  const { t } = useTranslation();

  const displayJson =
    typeof capabilities === 'string'
      ? capabilities
      : JSON.stringify(capabilities, null, 2);

  const footer = (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="secondary" onClick={onClose}>
        {t('common.cancel')}
      </Button>
      <Button type="button" onClick={onSave} disabled={isSaving}>
        {isSaving
          ? t('devices.capabilities.saving')
          : t('devices.capabilities.saveCapabilities')}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('devices.capabilities.title')}
      footer={footer}
      size="md"
    >
      {error && (
        <div className="mb-4 p-3 rounded text-sm bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark">
          {error}
        </div>
      )}

      <pre className="flex-1 overflow-auto m-0 p-4 text-[0.8125rem] leading-relaxed bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark rounded border border-border dark:border-border-dark font-mono min-h-[12rem]">
        {displayJson || '{}'}
      </pre>
    </Modal>
  );
};

export default CapabilitiesSummaryModal;
