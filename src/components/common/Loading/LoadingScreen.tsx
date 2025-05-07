import { useTranslation } from 'react-i18next';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message }: LoadingScreenProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-16 h-16 relative">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-ping"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-lg font-medium text-gray-700">
        {message || t('loading')}
      </p>
    </div>
  );
};

export default LoadingScreen; 