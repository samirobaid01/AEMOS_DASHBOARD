import React, { useState } from 'react';
import type { RuleChain } from '../../types/ruleEngine';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from 'react-i18next';
import { useRuleEnginePermissions } from '../../hooks/useRuleEnginePermissions';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteRule } from '../../state/slices/ruleEngine.slice';
import { toastService } from '../../services/toastService';
import type { AppDispatch } from '../../state/store';
import Modal from '../../components/common/Modal/Modal';
import { FormControl, Select, MenuItem } from '@mui/material';

interface RuleDetailsProps {
  rule: RuleChain | null;
  isLoading: boolean;
  error?: string | null;
  onBack?: () => void;
  windowWidth?: number;
  jwtToken?: string;
  organizationId?: number;
}

const RuleDetails: React.FC<RuleDetailsProps> = ({ 
  rule, 
  isLoading, 
  error,
  onBack,
  windowWidth = window.innerWidth,
  jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjcxLCJlbWFpbCI6InNhbWlyYWRtaW5AeW9wbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6WyJhcmVhLmNyZWF0ZSIsImFyZWEuZGVsZXRlIiwiYXJlYS51cGRhdGUiLCJhcmVhLnZpZXciLCJjb21tYW5kLmNhbmNlbCIsImNvbW1hbmQucmV0cnkiLCJjb21tYW5kLnNlbmQiLCJjb21tYW5kLnZpZXciLCJjb21tYW5kVHlwZS5jcmVhdGUiLCJjb21tYW5kVHlwZS5kZWxldGUiLCJjb21tYW5kVHlwZS51cGRhdGUiLCJjb21tYW5kVHlwZS52aWV3IiwiZGV2aWNlLmFuYWx5dGljcy52aWV3IiwiZGV2aWNlLmNvbnRyb2wiLCJkZXZpY2UuY3JlYXRlIiwiZGV2aWNlLmRlbGV0ZSIsImRldmljZS5oZWFydGJlYXQudmlldyIsImRldmljZS5tZXRhZGF0YS51cGRhdGUiLCJkZXZpY2Uuc3RhdHVzLnVwZGF0ZSIsImRldmljZS51cGRhdGUiLCJkZXZpY2UudmlldyIsIm1haW50ZW5hbmNlLmRlbGV0ZSIsIm1haW50ZW5hbmNlLmxvZyIsIm1haW50ZW5hbmNlLnNjaGVkdWxlIiwibWFpbnRlbmFuY2UudXBkYXRlIiwibWFpbnRlbmFuY2UudmlldyIsIm9yZ2FuaXphdGlvbi5jcmVhdGUiLCJvcmdhbml6YXRpb24uZGVsZXRlIiwib3JnYW5pemF0aW9uLnVwZGF0ZSIsIm9yZ2FuaXphdGlvbi52aWV3IiwicGVybWlzc2lvbi5tYW5hZ2UiLCJyZXBvcnQuZ2VuZXJhdGUiLCJyZXBvcnQudmlldyIsInJvbGUuYXNzaWduIiwicm9sZS52aWV3IiwicnVsZS5jcmVhdGUiLCJydWxlLmRlbGV0ZSIsInJ1bGUudXBkYXRlIiwicnVsZS52aWV3Iiwic2Vuc29yLmNyZWF0ZSIsInNlbnNvci5kZWxldGUiLCJzZW5zb3IudXBkYXRlIiwic2Vuc29yLnZpZXciLCJzZXR0aW5ncy51cGRhdGUiLCJzZXR0aW5ncy52aWV3Iiwic3RhdGUuY3JlYXRlIiwic3RhdGUudmlldyIsInN0YXRlVHJhbnNpdGlvbi5tYW5hZ2UiLCJzdGF0ZVRyYW5zaXRpb24udmlldyIsInN0YXRlVHlwZS5tYW5hZ2UiLCJzdGF0ZVR5cGUudmlldyIsInVzZXIuY3JlYXRlIiwidXNlci5kZWxldGUiLCJ1c2VyLnVwZGF0ZSIsInVzZXIudmlldyJdLCJyb2xlcyI6WyJBZG1pbiJdLCJpYXQiOjE3NDk1MzI0NjUsImV4cCI6MTc0OTYxODg2NX0.fcUWi5gGeasJj5U4pPmQpwkWyIWhmIyvAXC5qnNCLuA",
  organizationId = localStorage.getItem('organizationId'),
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { canUpdate, canDelete } = useRuleEnginePermissions();

  const handleEdit = () => {
    if (rule) {
      navigate(`/rule-engine/${rule.id}/edit`);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!rule) return;
      
      await dispatch(deleteRule(rule.id)).unwrap();
      toastService.success(t('ruleEngine.deleteSuccess'));
      setShowDeleteModal(false);
      navigate('/rule-engine');
    } catch (error) {
      toastService.error(t('ruleEngine.deleteError'));
      console.error('Failed to delete rule chain:', error);
      setShowDeleteModal(false);
    }
  };

  const handleNextNodeChange = async (nodeId: number, selectedNextNodeId: number | null) => {
    try {
      // Find the current node to get its data
      const currentNode = rule?.nodes.find(n => n.id === nodeId);
      if (!currentNode) return;

      const response = await fetch(
        `http://localhost:3000/api/v1/rule-chains/nodes/${nodeId}?organizationId=${organizationId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: currentNode.type,
            config: currentNode.config,
            nextNodeId: selectedNextNodeId
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update next node');
      }

      // Show success message
      toastService.success('Next node updated successfully');
      
      // Optionally refresh the rule details
      // You might want to implement a refresh function and call it here

    } catch (error) {
      console.error('Error updating next node:', error);
      toastService.error('Failed to update next node');
    }
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

  const containerStyle = {
    padding: isMobile ? '1rem' : '1.5rem 2rem',
    backgroundColor: darkMode ? colors.background : 'transparent',
  };

  const cardStyle = {
    backgroundColor: darkMode ? colors.cardBackground : 'white',
    borderRadius: '0.5rem',
    boxShadow: darkMode 
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    padding: isMobile ? '1rem' : '1.5rem',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center',
    flexDirection: isMobile ? 'column' as const : 'row' as const,
    marginBottom: '1.5rem',
    gap: isMobile ? '1rem' : '0',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: darkMode ? colors.textPrimary : '#111827',
    margin: 0,
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: isMobile ? 'wrap' as const : 'nowrap' as const,
    width: isMobile ? '100%' : 'auto',
  };

  const buttonStyle = (variant: 'primary' | 'danger') => ({
    padding: '0.5rem 1rem',
    backgroundColor:
      variant === 'primary'
        ? darkMode ? '#4d7efa' : '#3b82f6'
        : darkMode ? '#ef5350' : '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexGrow: isMobile ? 1 : 0,
    minWidth: isMobile ? '0' : '5rem',
  });

  const dividerStyle = {
    height: '1px',
    backgroundColor: darkMode ? colors.border : '#e5e7eb',
    margin: '1.5rem 0',
  };

  const sectionStyle = {
    marginBottom: '1.5rem',
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: darkMode ? colors.textSecondary : '#6b7280',
    marginBottom: '0.25rem',
  };

  const valueStyle = {
    fontSize: '1rem',
    color: darkMode ? colors.textPrimary : '#111827',
    margin: '0',
  };

  const codeBlockStyle = {
    backgroundColor: darkMode ? colors.surfaceBackground : '#f3f4f6',
    borderRadius: '0.375rem',
    padding: '1rem',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    overflowX: 'auto' as const,
    color: darkMode ? colors.textPrimary : '#111827',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
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

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: `4px solid ${darkMode ? '#4d7efa' : '#3b82f6'}`,
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <p style={{
          color: darkMode ? colors.dangerText : '#dc2626',
          margin: '1rem 0',
        }}>
          {error}
        </p>
      </div>
    );
  }

  if (!rule) {
    return (
      <div style={containerStyle}>
        <p style={{
          color: darkMode ? colors.textSecondary : '#6b7280',
          margin: '1rem 0',
        }}>
          {t('rules.notFound')}
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                padding: '0.5rem',
                cursor: 'pointer',
                borderRadius: '0.375rem',
                color: darkMode ? colors.textSecondary : '#6b7280',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? colors.surfaceBackground : '#f3f4f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          <h1 style={titleStyle}>{rule.name}</h1>
        </div>

        {(canUpdate || canDelete) && (
          <div style={buttonGroupStyle}>
            {canUpdate && (
              <button
                onClick={handleEdit}
                style={buttonStyle('primary')}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#5d8efa' : '#2563eb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#4d7efa' : '#3b82f6';
                }}
              >
                <svg
                  style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                {t('common.edit')}
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDeleteClick}
                style={buttonStyle('danger')}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#f44336' : '#dc2626';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#ef5350' : '#ef4444';
                }}
              >
                <svg
                  style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                {t('common.delete')}
              </button>
            )}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>{t('common.description')}</p>
          <p style={valueStyle}>{rule.description}</p>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>{t('common.createdAt')}</p>
          <p style={valueStyle}>{formatDate(rule.createdAt)}</p>

          <p style={{ ...labelStyle, marginTop: '1rem' }}>{t('common.lastUpdated')}</p>
          <p style={valueStyle}>{formatDate(rule.updatedAt)}</p>
        </div>

        <div style={dividerStyle} />

        <div>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: darkMode ? colors.textPrimary : '#111827',
            margin: '0 0 1rem 0',
          }}>
            {t('ruleEngine.ruleNode.title')}
          </h2>

          {rule?.nodes?.length === 0 ? (
            <p style={{
              color: darkMode ? colors.textSecondary : '#6b7280',
              margin: '1rem 0',
            }}>
              {t('rules.noNodes')}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {rule?.nodes?.map((node, index) => {
                // Create options for the dropdown
                const nodeOptions = rule.nodes
                  .filter(n => n.id !== node.id) // Exclude current node
                  .map(n => ({
                    id: n.id,
                    name: n.name || `${n.type.charAt(0).toUpperCase() + n.type.slice(1)} Node ${n.id}`
                  }));

                return (
                  <div
                    key={node.id}
                    style={{
                      ...cardStyle,
                      padding: '1rem',
                      marginBottom: index < rule.nodes.length - 1 ? '1rem' : 0,
                    }}
                  >
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: darkMode ? colors.textPrimary : '#111827',
                      margin: '0 0 0.5rem 0',
                    }}>
                      {node.name || `${node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node ${node.id}`}
                    </h3>

                    <p style={labelStyle}>{t('rules.configuration')}:</p>
                    <pre style={codeBlockStyle}>
                      {JSON.stringify(JSON.parse(node.config), null, 2)}
                    </pre>

                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <Select
                        value={node.nextNodeId === null ? '' : node.nextNodeId.toString()}
                        onChange={(e) => handleNextNodeChange(
                          node.id,
                          e.target.value === '' ? null : Number(e.target.value)
                        )}
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Select next node</em>
                        </MenuItem>
                        {nodeOptions.map((option) => (
                          <MenuItem key={option.id} value={option.id.toString()}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
        footer={deleteModalFooter}
      >
        <p style={{
          color: darkMode ? colors.textPrimary : '#111827',
          margin: '0 0 1rem 0',
        }}>
          {t('ruleEngine.deleteConfirmationMessage', { name: rule?.name })}
        </p>
        <p style={{
          color: darkMode ? colors.dangerText : '#dc2626',
          margin: '0',
          fontSize: '0.875rem',
        }}>
          {t('common.thisActionCannotBeUndone')}
        </p>
      </Modal>
    </div>
  );
};

export default RuleDetails; 