import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../state/store';
import { selectOrganizations, fetchOrganizations } from '../../state/slices/organizations.slice';
import { selectAreas, fetchAreas } from '../../state/slices/areas.slice';
import { selectSensors, fetchSensors } from '../../state/slices/sensors.slice';
import { selectDevices, fetchDevices } from '../../state/slices/devices.slice';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  const organizations = useSelector(selectOrganizations);
  const areas = useSelector(selectAreas);
  const sensors = useSelector(selectSensors);
  const devices = useSelector(selectDevices);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchOrganizations()),
          dispatch(fetchAreas()),
          dispatch(fetchSensors()),
          dispatch(fetchDevices())
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  const stats = [
    { name: t('organizations'), count: organizations.length, path: '/organizations', color: 'bg-blue-500' },
    { name: t('areas'), count: areas.length, path: '/areas', color: 'bg-green-500' },
    { name: t('sensors'), count: sensors.length, path: '/sensors', color: 'bg-yellow-500' },
    { name: t('devices'), count: devices.length, path: '/devices', color: 'bg-purple-500' }
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{t('dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((item) => (
          <Link 
            key={item.name} 
            to={item.path}
            className="block bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${item.color}`}>
                  <div className="h-6 w-6 text-white"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{item.count}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('recent_organizations')}</h2>
          {organizations.length > 0 ? (
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {organizations.slice(0, 5).map((org) => (
                  <li key={org.id} className="py-4">
                    <Link to={`/organizations/${org.id}`} className="flex items-center hover:bg-gray-50 p-2 rounded">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{org.name}</p>
                        <p className="text-sm text-gray-500 truncate">{org.detail || t('no_details')}</p>
                      </div>
                      <div className={`ml-4 flex-shrink-0 rounded-full h-3 w-3 ${org.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </Link>
                  </li>
                ))}
              </ul>
              {organizations.length > 5 && (
                <div className="mt-4">
                  <Link to="/organizations" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    {t('view_all')}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">{t('no_organizations')}</p>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('recent_devices')}</h2>
          {devices.length > 0 ? (
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {devices.slice(0, 5).map((device) => (
                  <li key={device.id} className="py-4">
                    <Link to={`/devices/${device.id}`} className="flex items-center hover:bg-gray-50 p-2 rounded">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{device.name}</p>
                        <p className="text-sm text-gray-500 truncate">{device.serialNumber}</p>
                      </div>
                      <div className={`ml-4 flex-shrink-0 rounded-full h-3 w-3 ${device.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </Link>
                  </li>
                ))}
              </ul>
              {devices.length > 5 && (
                <div className="mt-4">
                  <Link to="/devices" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    {t('view_all')}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">{t('no_devices')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 