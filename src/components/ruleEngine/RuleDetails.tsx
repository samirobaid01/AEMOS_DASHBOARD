import React from 'react';
import type { RuleChain } from '../../types/ruleEngine';
import { useTranslation } from 'react-i18next';
import { useRuleEnginePermissions } from '../../hooks/useRuleEnginePermissions';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';

const selectClasses =
  'w-full mt-2 px-3 py-2 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm outline-none focus:ring-2 focus:ring-primary';

interface RuleDetailsProps {
  rule: RuleChain | null;
  isLoading: boolean;
  error?: string | null;
  onBack?: () => void;
  onEdit: (ruleId: number) => void;
  onDelete: (ruleId: number) => Promise<void>;
  onNextNodeChange: (nodeId: number, nextNodeId: number | null) => Promise<void>;
  windowWidth?: number;
}

const RuleDetails: React.FC<RuleDetailsProps> = ({
  rule,
  isLoading,
  error,
  onBack,
  onEdit,
  onDelete,
  onNextNodeChange,
  windowWidth = window.innerWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const { t } = useTranslation();
  const isMobile = windowWidth < 768;
  const { canUpdate, canDelete } = useRuleEnginePermissions();

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div
          className="w-10 h-10 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-primary dark:border-t-primary-dark animate-spin"
          aria-hidden
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-background dark:bg-background-dark ${isMobile ? 'p-4' : 'p-6 px-8'}`}>
        <p className="text-dangerText dark:text-dangerText-dark my-4 m-0">
          {error}
        </p>
      </div>
    );
  }

  if (!rule) {
    return (
      <div className={`bg-background dark:bg-background-dark ${isMobile ? 'p-4' : 'p-6 px-8'}`}>
        <p className="text-textSecondary dark:text-textSecondary-dark my-4 m-0">
          {t('rules.notFound')}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-background dark:bg-background-dark ${isMobile ? 'p-4' : 'p-6 px-8'}`}>
      <div className={`flex ${isMobile ? 'flex-col items-stretch' : 'flex-row justify-between items-center'} gap-4 mb-6`}>
        <div className="flex items-center gap-4">
          {onBack && (
            <Button type="button" variant="secondary" onClick={onBack} className="p-2 min-w-0">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Button>
          )}
          <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">
            {rule.name}
          </h1>
        </div>

        {(canUpdate || canDelete) && (
          <div className={`flex gap-2 ${isMobile ? 'flex-wrap w-full' : 'flex-nowrap'}`}>
            {canUpdate && (
              <Button type="button" variant="primary" onClick={() => rule && onEdit(rule.id)}>
                <svg className="w-4 h-4 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                {t('common.edit')}
              </Button>
            )}
            {canDelete && (
              <Button type="button" variant="danger" onClick={handleDeleteClick}>
                <svg className="w-4 h-4 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                {t('common.delete')}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className={`rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="mb-6">
          <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">
            {t('common.description')}
          </p>
          <p className="text-base text-textPrimary dark:text-textPrimary-dark m-0">
            {rule.description}
          </p>
        </div>

        <div className="h-px bg-border dark:bg-border-dark my-6" />

        <div className="mb-6">
          <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">
            {t('common.createdAt')}
          </p>
          <p className="text-base text-textPrimary dark:text-textPrimary-dark m-0">
            {formatDate(rule.createdAt)}
          </p>
          <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mt-4 mb-1 m-0">
            {t('common.lastUpdated')}
          </p>
          <p className="text-base text-textPrimary dark:text-textPrimary-dark m-0">
            {formatDate(rule.updatedAt)}
          </p>
        </div>

        <div className="h-px bg-border dark:bg-border-dark my-6" />

        <div>
          <h2 className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0 mb-4">
            {t('ruleEngine.ruleNode.title')}
          </h2>

          {rule?.nodes?.length === 0 ? (
            <p className="text-textSecondary dark:text-textSecondary-dark my-4 m-0">
              {t('rules.noNodes')}
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {rule?.nodes?.map((node, index) => {
                const nodeOptions = rule.nodes
                  .filter((n) => n.id !== node.id)
                  .map((n) => ({
                    id: n.id,
                    name: n.name || `${n.type.charAt(0).toUpperCase() + n.type.slice(1)} Node ${n.id}`,
                  }));

                return (
                  <div
                    key={node.id}
                    className={`rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4 ${index < rule.nodes.length - 1 ? 'mb-4' : ''}`}
                  >
                    <h3 className="text-base font-medium text-textPrimary dark:text-textPrimary-dark m-0 mb-2">
                      {node.name || `${node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node ${node.id}`}
                    </h3>

                    <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">
                      {t('rules.configuration')}:
                    </p>
                    <pre className="bg-surfaceHover dark:bg-surfaceHover-dark rounded border border-border dark:border-border-dark p-4 font-mono text-sm overflow-x-auto text-textPrimary dark:text-textPrimary-dark m-0">
                      {JSON.stringify(node.config, null, 2)}
                    </pre>

                    <select
                      className={selectClasses}
                      value={node.nextNodeId === null ? '' : node.nextNodeId.toString()}
                      onChange={(e) =>
                        onNextNodeChange(
                          node.id,
                          e.target.value === '' ? null : Number(e.target.value)
                        )
                      }
                    >
                      <option value="">Select next node</option>
                      {nodeOptions.map((option) => (
                        <option key={option.id} value={option.id.toString()}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('ruleEngine.deleteConfirmation')}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setShowDeleteModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={async () => {
                if (rule) {
                  await onDelete(rule.id);
                  setShowDeleteModal(false);
                }
              }}
            >
              {t('common.delete')}
            </Button>
          </>
        }
      >
        <p className="text-textPrimary dark:text-textPrimary-dark m-0 mb-4">
          {t('ruleEngine.deleteConfirmationMessage', { name: rule?.name })}
        </p>
        <p className="text-dangerText dark:text-dangerText-dark m-0 text-sm">
          {t('common.thisActionCannotBeUndone')}
        </p>
      </Modal>
    </div>
  );
};

export default RuleDetails;
