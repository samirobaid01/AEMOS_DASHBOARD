import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { RuleChain } from '../../types/ruleEngine';
import { useRuleEnginePermissions } from '../../hooks/useRuleEnginePermissions';
import { useAppDispatch } from '../../state/store';
import { deleteRule } from '../../state/slices/ruleEngine.slice';
import { toastService } from '../../services/toastService';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import Modal from '../common/Modal/Modal';

interface RuleItemProps {
  rule: RuleChain;
  windowWidth: number;
}

const RuleItem: React.FC<RuleItemProps> = ({ rule, windowWidth }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { canUpdate, canDelete } = useRuleEnginePermissions();
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();

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

  const cardStyle = {
    backgroundColor: darkMode ? colors.cardBackground : "white",
    borderRadius: "0.5rem",
    border: `1px solid ${darkMode ? colors.border : "#e5e7eb"}`,
    padding: "1rem",
    marginBottom: "1rem",
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative" as const,
    boxShadow: darkMode
      ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
      : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    ":hover": {
      boxShadow: darkMode
        ? "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12)"
        : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
  };

  const titleStyle = {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: darkMode ? colors.textPrimary : "#111827",
    marginBottom: "0.5rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  };

  const descriptionStyle = {
    fontSize: "0.875rem",
    color: darkMode ? colors.textSecondary : "#6b7280",
    marginBottom: "1rem",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const menuButtonStyle = {
    position: "absolute" as const,
    top: "0.5rem",
    right: "0.5rem",
    padding: "0.25rem",
    borderRadius: "0.375rem",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    color: darkMode ? colors.textSecondary : "#6b7280",
    transition: "color 0.2s",
    ":hover": {
      color: darkMode ? colors.textPrimary : "#111827",
    },
  };

  const menuStyle = {
    position: "absolute" as const,
    top: "2rem",
    right: "0.5rem",
    backgroundColor: darkMode ? colors.cardBackground : "white",
    borderRadius: "0.375rem",
    border: `1px solid ${darkMode ? colors.border : "#e5e7eb"}`,
    boxShadow: darkMode
      ? "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12)"
      : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    zIndex: 10,
    minWidth: "8rem",
  };

  const menuItemStyle = {
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    color: darkMode ? colors.textPrimary : "#111827",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    ":hover": {
      backgroundColor: darkMode ? colors.background : "#f3f4f6",
    },
  };

  const deleteMenuItemStyle = {
    ...menuItemStyle,
    color: darkMode ? colors.dangerText : "#dc2626",
  };

  const dateStyle = {
    fontSize: "0.75rem",
    color: darkMode ? colors.textMuted : "#9ca3af",
  };

  const deleteModalFooter = (
    <>
      <button
        onClick={() => setShowDeleteModal(false)}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: darkMode ? colors.surfaceBackground : 'white',
          color: darkMode ? colors.textSecondary : '#4b5563',
          border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? colors.background : '#f3f4f6';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? colors.surfaceBackground : 'white';
        }}
      >
        {t('common.cancel')}
      </button>
      <button
        onClick={handleConfirmDelete}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: darkMode ? '#ef5350' : '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#f44336' : '#dc2626';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#ef5350' : '#ef4444';
        }}
      >
        {t('common.delete')}
      </button>
    </>
  );

  return (
    <>
      <div
        style={cardStyle}
        onClick={handleView}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = darkMode
            ? "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = darkMode
            ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
            : "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
        }}
      >
        <div style={{ position: "relative" }}>
          <button
            style={menuButtonStyle}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3a1 1 0 110-2 1 1 0 010 2zm0 6a1 1 0 110-2 1 1 0 010 2zm0 6a1 1 0 110-2 1 1 0 010 2z"
                fill="currentColor"
              />
            </svg>
          </button>

          {showMenu && (
            <div
              style={menuStyle}
              ref={menuRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={menuItemStyle} onClick={handleView}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
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
                <div style={menuItemStyle} onClick={handleEdit}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  {t("common.edit")}
                </div>
              )}
              {canDelete && (
                <div style={deleteMenuItemStyle} onClick={handleDeleteClick}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
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

        <h3 style={titleStyle}>{rule.name}</h3>
        <p style={descriptionStyle}>{rule.description}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <span style={dateStyle}>
            {t("common.created")}: {formatDate(rule.createdAt)}
          </span>
          <span style={dateStyle}>
            {t("common.updated")}: {formatDate(rule.updatedAt)}
          </span>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('ruleEngine.deleteConfirmation')}
        footer={deleteModalFooter}
      >
        <p style={{
          color: darkMode ? colors.textPrimary : '#111827',
          margin: '0 0 1rem 0',
        }}>
          {t('ruleEngine.deleteConfirmationMessage', { name: rule.name })}
        </p>
        <p style={{
          color: darkMode ? colors.dangerText : '#dc2626',
          margin: '0',
          fontSize: '0.875rem',
        }}>
          {t('common.thisActionCannotBeUndone')}
        </p>
      </Modal>
    </>
  );
};

export default RuleItem;
