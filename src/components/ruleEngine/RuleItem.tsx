import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react';
import { useRuleEnginePermissions } from '../../hooks/useRuleEnginePermissions';
import { useAppDispatch } from '../../state/store';
import { deleteRule } from '../../state/slices/ruleEngine.slice';
import { toastService } from '../../services/toastService';
import Button from '../common/Button/Button';
import Modal from '../common/Modal/Modal';
import type { RuleItemProps } from './types';

const RuleItem: React.FC<RuleItemProps> = React.memo(({ rule }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { canUpdate, canDelete } = useRuleEnginePermissions();
  const { t } = useTranslation();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleView = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    setShowMenu(false);
    navigate(`/rule-engine/${rule.id}`);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowMenu(false);
    navigate(`/rule-engine/${rule.id}/edit`);
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteRule(rule.id)).unwrap();
      toastService.success(t("ruleEngine.deleteSuccess"));
      setShowDeleteModal(false);
    } catch (error) {
      toastService.error(t("ruleEngine.deleteError"));
      console.error("Failed to delete rule chain:", error);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const deleteModalFooter = (
    <>
      <Button type="button" variant="secondary" onClick={() => setShowDeleteModal(false)}>
        {t('common.cancel')}
      </Button>
      <Button type="button" variant="danger" onClick={handleConfirmDelete}>
        {t('common.delete')}
      </Button>
    </>
  );

  return (
    <>
      <div
        className="group relative flex items-start gap-4 p-4 rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-leaf-300 dark:hover:border-leaf-600"
        onClick={handleView}
      >
        {/* Icon tile */}
        <div className="shrink-0 w-11 h-11 rounded-lg bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
          <Zap className="w-5 h-5" aria-hidden />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-textPrimary dark:text-textPrimary-dark overflow-hidden text-ellipsis whitespace-nowrap m-0 mb-1.5">
            {rule.name}
          </h3>
          <p className="text-sm text-textMuted dark:text-textMuted-dark mb-2 line-clamp-2 overflow-hidden text-ellipsis m-0">
            {rule.description}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-textMuted dark:text-textMuted-dark">
            <span>{t("common.created")}: {formatDate(rule.createdAt)}</span>
            <span>{t("common.updated")}: {formatDate(rule.updatedAt)}</span>
          </div>
        </div>

        <div className="relative shrink-0" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <Button
            type="button"
            variant="secondary"
            className="p-1.5 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark cursor-pointer text-textSecondary dark:text-textSecondary-dark hover:text-textPrimary dark:hover:text-textPrimary-dark hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark transition-colors min-w-0 h-8 w-8 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <MoreVertical className="w-4 h-4" aria-hidden />
          </Button>

          {showMenu && (
            <div className="absolute top-full right-0 mt-1 z-20 min-w-[8rem] rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-lg py-1">
              <div
                className="flex items-center gap-2 px-4 py-2 text-sm text-textPrimary dark:text-textPrimary-dark cursor-pointer hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark"
                onClick={handleView}
              >
                <Eye className="w-4 h-4" aria-hidden />
                {t("common.view")}
              </div>
              {canUpdate && (
                <div
                  className="flex items-center gap-2 px-4 py-2 text-sm text-textPrimary dark:text-textPrimary-dark cursor-pointer hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark"
                  onClick={handleEdit}
                >
                  <Pencil className="w-4 h-4" aria-hidden />
                  {t("common.edit")}
                </div>
              )}
              {canDelete && (
                <div
                  className="flex items-center gap-2 px-4 py-2 text-sm text-danger dark:text-danger-dark cursor-pointer hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="w-4 h-4" aria-hidden />
                  {t("common.delete")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('ruleEngine.deleteConfirmation')}
        footer={deleteModalFooter}
      >
        <p className="text-textPrimary dark:text-textPrimary-dark m-0 mb-4">
          {t('ruleEngine.deleteConfirmationMessage', { name: rule.name })}
        </p>
        <p className="text-dangerText dark:text-dangerText-dark m-0 text-sm">
          {t('common.thisActionCannotBeUndone')}
        </p>
      </Modal>
    </>
  );
});

export default RuleItem;
