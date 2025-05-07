import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import {
  fetchAreaById,
  selectSelectedArea,
  selectAreasLoading,
  selectAreasError,
  deleteArea
} from '../../state/slices/areas.slice';
import { fetchSensorsByAreaId, selectSensors } from '../../state/slices/sensors.slice';
import { fetchOrganizationById, selectSelectedOrganization } from '../../state/slices/organizations.slice';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import Button from '../../components/common/Button/Button';

const AreaDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const area = useSelector(selectSelectedArea);
  const sensors = useSelector(selectSensors);
  const isLoading = useSelector(selectAreasLoading);
  const error = useSelector(selectAreasError);
  const organization = useSelector(selectSelectedOrganization);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      const areaId = parseInt(id, 10);
      dispatch(fetchAreaById(areaId));
      dispatch(fetchSensorsByAreaId(areaId));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (area?.organizationId) {
      dispatch(fetchOrganizationById(area.organizationId));
    }
  }, [dispatch, area?.organizationId]);

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const resultAction = await dispatch(deleteArea(parseInt(id, 10)));
      if (deleteArea.fulfilled.match(resultAction)) {
        if (area?.organizationId) {
          navigate(`/organizations/${area.organizationId}`);
        } else {
          navigate('/areas');
        }
      }
    } catch (error) {
      console.error('Error deleting area:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/areas')}
            >
              {t('back_to_areas')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!area) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-yellow-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800">{t('area_not_found')}</h3>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/areas')}
            >
              {t('back_to_areas')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{area.name}</h1>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/areas')}
            >
              {t('back')}
            </Button>
            <Link to={`/areas/${id}/edit`}>
              <Button variant="primary">
                {t('edit')}
              </Button>
            </Link>
            <Button
              variant="danger"
              onClick={() => setDeleteModalOpen(true)}
            >
              {t('delete')}
            </Button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Area Details */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('area_details')}</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">{t('status')}</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      area.status
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {area.status ? t('active') : t('inactive')}
                  </span>
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">{t('organization')}</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {organization ? (
                    <Link 
                      to={`/organizations/${area.organizationId}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {organization.name}
                    </Link>
                  ) : (
                    t('not_available')
                  )}
                </dd>
              </div>

              {area.description && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">{t('description')}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{area.description}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Sensors Section */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">{t('sensors')}</h2>
              <Link to={`/sensors/create?areaId=${id}`}>
                <Button variant="outline" size="sm">
                  {t('add_sensor')}
                </Button>
              </Link>
            </div>
            
            {sensors.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {sensors.map(sensor => (
                  <li key={sensor.id} className="py-3">
                    <Link
                      to={`/sensors/${sensor.id}`}
                      className="flex items-center hover:bg-gray-50 p-2 rounded-md"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-blue-600">{sensor.name}</p>
                        <p className="text-sm text-gray-500 truncate">{sensor.description || t('no_description')}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">{sensor.type}</span>
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
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">{t('no_sensors')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium text-gray-900">{t('delete_area')}</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {t('delete_area_confirm', { name: area.name })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  type="button"
                  variant="danger"
                  isLoading={isDeleting}
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="w-full sm:w-auto sm:ml-3"
                >
                  {t('delete')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteModalOpen(false)}
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                >
                  {t('cancel')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaDetails; 