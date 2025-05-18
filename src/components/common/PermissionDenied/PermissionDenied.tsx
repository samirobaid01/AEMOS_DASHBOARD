import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';

interface PermissionDeniedProps {
  message?: string;
  redirectPath?: string;
  redirectLabel?: string;
}

const PermissionDenied: React.FC<PermissionDeniedProps> = ({
  message,
  redirectPath = '/dashboard',
  redirectLabel,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-6 max-w-md">
        <div className="mb-4">
          <svg
            className="h-16 w-16 text-red-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V8m6 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2">{t('common.permission_denied')}</h2>
        <p className="text-gray-600 mb-6">
          {message || t('common.no_access_permission')}
        </p>
        <Button
          variant="primary"
          onClick={() => navigate(redirectPath)}
        >
          {redirectLabel || t('common.go_to_dashboard')}
        </Button>
      </div>
    </div>
  );
};

export default PermissionDenied; 