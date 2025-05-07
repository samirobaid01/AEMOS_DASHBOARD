import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import { fetchSensors, selectSensors, selectSensorsLoading, selectSensorsError } from '../../state/slices/sensors.slice';
import Button from '../../components/common/Button/Button';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import type { Sensor } from '../../types/sensor';

const SensorList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const sensors = useSelector(selectSensors);
  const isLoading = useSelector(selectSensorsLoading);
  const error = useSelector(selectSensorsError);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  
  useEffect(() => {
    dispatch(fetchSensors());
  }, [dispatch]);
  
  const filteredSensors = sensors.filter(sensor => {
    const matchesSearch = 
      sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sensor.description && sensor.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      sensor.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === '' || sensor.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  // Get unique sensor types for filter
  const sensorTypes = Array.from(new Set(sensors.map(sensor => sensor.type)));
  
  if (isLoading && sensors.length === 0) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{t('sensors')}</h1>
          <Button
            variant="primary"
            onClick={() => navigate('/sensors/create')}
          >
            {t('add_sensor')}
          </Button>
        </div>
        
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={t('search_sensors')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <select
              id="typeFilter"
              name="typeFilter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">{t('all_types')}</option>
              {sensorTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        
        {error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        ) : (
          <>
            {filteredSensors.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t('no_sensors_found')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('no_sensors_found_description')}</p>
                <div className="mt-6">
                  <Button
                    variant="primary"
                    onClick={() => navigate('/sensors/create')}
                  >
                    {t('add_sensor')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {filteredSensors.map((sensor: Sensor) => (
                    <li key={sensor.id} className="hover:bg-gray-50">
                      <Link to={`/sensors/${sensor.id}`} className="block px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-blue-600 truncate">{sensor.name}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-2">
                                {sensor.type}
                              </span>
                              <p className="text-sm text-gray-500 truncate">
                                {sensor.description || t('no_description')}
                              </p>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex items-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                sensor.status
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {sensor.status ? t('active') : t('inactive')}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SensorList; 