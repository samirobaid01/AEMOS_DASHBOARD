import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
        <p className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">
          {t('page_not_found')}
        </p>
        <p className="mt-4 text-base text-gray-500">
          {t('page_not_found_description')}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('back_to_home')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 