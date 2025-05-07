import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-leaf-50 to-soil-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-soft p-10 text-center border border-leaf-100">
        <div className="text-6xl mb-4">🍂</div>
        <h1 className="text-9xl font-extrabold text-leaf-600">404</h1>
        <p className="mt-2 text-3xl font-bold text-soil-800 tracking-tight">
          {t('page_not_found')}
        </p>
        <p className="mt-4 text-base text-soil-600">
          {t('page_not_found_description')}
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-soft text-white bg-leaf-600 hover:bg-leaf-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-leaf-500"
          >
            {t('back_to_home')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 