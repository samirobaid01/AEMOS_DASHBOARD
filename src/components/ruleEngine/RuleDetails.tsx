import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Pencil, Trash2, Zap } from 'lucide-react';
import { useRuleEnginePermissions } from '../../hooks/useRuleEnginePermissions';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import NodeSummary from './NodeSummary';
import type { RuleDetailsProps } from './types';

const selectClasses =
  'w-full mt-2 px-3 py-2 rounded border border-border dark:border-border-dark bg-background dark:bg-background-dark text-textPrimary dark:text-textPrimary-dark text-sm outline-none focus:ring-2 focus:ring-primary';

const RuleDetails: React.FC<RuleDetailsProps> = ({
  rule,
  isLoading,
  error,
  onBack,
  onEdit,
  onDelete,
  onNextNodeChange,
}) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const { t } = useTranslation();
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
          className="w-10 h-10 rounded-full border-4 border-border dark:border-border-dark border-t-primary dark:border-t-primary-dark animate-spin"
          aria-hidden
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
        <p className="text-dangerText dark:text-dangerText-dark my-4 m-0">
          {error}
        </p>
      </div>
    );
  }

  if (!rule) {
    return (
      <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
        <p className="text-textSecondary dark:text-textSecondary-dark my-4 m-0">
          {t('rules.notFound')}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        {onBack && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="self-start"
          >
            {t('common.back')}
          </Button>
        )}

        <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
              <Zap className="w-6 h-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0 truncate">
                {rule.name}
              </h1>
              {rule.nodes && rule.nodes.length > 0 && (
                <div className="flex items-center flex-wrap gap-2 mt-1.5">
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 tabular-nums">
                    {t('rules.nodeCount', { count: rule.nodes.length, defaultValue: '{{count}} nodes' })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {(canUpdate || canDelete) && (
            <div className="flex gap-2 flex-wrap">
              {canUpdate && (
                <Button type="button" variant="primary" onClick={() => rule && onEdit(rule.id)} leftIcon={<Pencil className="w-4 h-4" />}>
                  {t('common.edit')}
                </Button>
              )}
              {canDelete && (
                <Button type="button" variant="danger" onClick={handleDeleteClick} leftIcon={<Trash2 className="w-4 h-4" />}>
                  {t('common.delete')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info card */}
      <div className="rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">
              {t('common.description')}
            </p>
            <p className="text-base text-textPrimary dark:text-textPrimary-dark m-0 leading-relaxed">
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
            <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark m-0 mb-4">
              {t('ruleEngine.ruleNode.title')}
            </h2>

            {rule?.nodes?.length === 0 ? (
              <p className="text-textSecondary dark:text-textSecondary-dark my-4 m-0">
                {t('rules.noNodes')}
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {rule?.nodes?.map((node) => {
                  const nodeOptions = rule.nodes
                    .filter((n) => n.id !== node.id)
                    .map((n) => ({
                      id: n.id,
                      name: n.name || `${n.type.charAt(0).toUpperCase() + n.type.slice(1)} Node ${n.id}`,
                    }));

                  return (
                    <div
                      key={node.id}
                      className="rounded-xl border border-border dark:border-border-dark bg-background dark:bg-background-dark p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="shrink-0 w-7 h-7 rounded-lg bg-ink-100 dark:bg-ink-800 text-textSecondary dark:text-textSecondary-dark grid place-items-center">
                          <Zap className="w-4 h-4" aria-hidden />
                        </span>
                        <h3 className="text-base font-medium text-textPrimary dark:text-textPrimary-dark m-0 min-w-0 truncate">
                          {node.name || `${node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node ${node.id}`}
                        </h3>
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 capitalize">
                          {node.type}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">
                        {t('rules.configuration')}:
                      </p>
                      <div className="mb-4">
                        <NodeSummary config={node.config} />
                      </div>

                      <label className="block text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-2">
                        {t('ruleEngine.nextNode')}
                      </label>
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
