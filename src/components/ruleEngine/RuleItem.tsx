import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRuleEnginePermissions } from '../../hooks/useRuleEnginePermissions';
import { useAppDispatch } from '../../state/store';
import { deleteRule } from '../../state/slices/ruleEngine.slice';
import { toastService } from '../../services/toastService';
import Button from '../common/Button/Button';
import Modal from '../common/Modal/Modal';
import type { RuleItemProps } from './types';

const RuleItem: React.FC<RuleItemProps> = ({ rule }) => {
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
        className="relative p-4 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm cursor-pointer transition-shadow hover:shadow-md"
        onClick={handleView}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark overflow-hidden text-ellipsis whitespace-nowrap m-0 min-w-0 flex-1">
            {rule.name}
          </h3>
          <div className="relative shrink-0" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <Button
              type="button"
              variant="secondary"
              className="p-1.5 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark cursor-pointer text-textSecondary dark:text-textSecondary-dark hover:text-textPrimary dark:hover:text-textPrimary-dark hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark transition-colors min-w-0 h-8 w-8 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8 3a1 1 0 110-2 1 1 0 010 2zm0 6a1 1 0 110-2 1 1 0 010 2zm0 6a1 1 0 110-2 1 1 0 010 2z"
                  fill="currentColor"
                />
              </svg>
            </Button>

            {showMenu && (
              <div className="absolute top-full right-0 mt-1 z-20 min-w-[8rem] rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-lg py-1">
                <div
                  className="flex items-center gap-2 px-4 py-2 text-sm text-textPrimary dark:text-textPrimary-dark cursor-pointer hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark"
                  onClick={handleView}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("common.view")}
                </div>
                {canUpdate && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 text-sm text-textPrimary dark:text-textPrimary-dark cursor-pointer hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark"
                    onClick={handleEdit}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    {t("common.edit")}
                  </div>
                )}
                {canDelete && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 text-sm text-danger dark:text-danger-dark cursor-pointer hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark"
                    onClick={handleDeleteClick}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t("common.delete")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-textSecondary dark:text-textSecondary-dark mb-3 line-clamp-2 overflow-hidden text-ellipsis m-0">
          {rule.description}
        </p>

        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-textMuted dark:text-textMuted-dark">
          <span>{t("common.created")}: {formatDate(rule.createdAt)}</span>
          <span>{t("common.updated")}: {formatDate(rule.updatedAt)}</span>
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
};

export default RuleItem;
