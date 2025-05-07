import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import {
  fetchDeviceById,
  selectSelectedDevice,
  selectDevicesLoading,
  selectDevicesError,
  deleteDevice
} from '../../state/slices/devices.slice';
import { fetchOrganizationById, selectSelectedOrganization } from '../../state/slices/organizations.slice';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import Button from '../../components/common/Button/Button';

const DeviceDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const device = useSelector(selectSelectedDevice);
  const organization = useSelector(selectSelectedOrganization);
  const isLoading = useSelector(selectDevicesLoading);
  const error = useSelector(selectDevicesError);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      const deviceId = parseInt(id, 10);
      dispatch(fetchDeviceById(deviceId));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (device?.organizationId) {
      dispatch(fetchOrganizationById(device.organizationId));
    }
  }, [dispatch, device?.organizationId]);

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const resultAction = await dispatch(deleteDevice(parseInt(id, 10)));
      if (deleteDevice.fulfilled.match(resultAction)) {
        if (device?.organizationId) {
          navigate(`/organizations/${device.organizationId}`);
        } else {
          navigate('/devices');
        }
      }
    } catch (error) {
      console.error('Error deleting device:', error);
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
              onClick={() => navigate('/devices')}
            >
              {t('back_to_devices')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-yellow-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800">{t('device_not_found')}</h3>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/devices')}
            >
              {t('back_to_devices')}
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
          <h1 className="text-2xl font-semibold text-gray-900">{device.name}</h1>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/devices')}
            >
              {t('back')}
            </Button>
            <Link to={`/devices/${id}/edit`}>
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
          {/* Device Details */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('device_details')}</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">{t('type')}</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                    {device.type}
                  </span>
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">{t('status')}</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      device.status
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {device.status ? t('active') : t('inactive')}
                  </span>
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">{t('serial_number')}</dt>
                <dd className="mt-1 text-sm text-gray-900">{device.serialNumber}</dd>
              </div>
              
              {device.firmware && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('firmware')}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{device.firmware}</dd>
                </div>
              )}
              
              <div>
                <dt className="text-sm font-medium text-gray-500">{t('organization')}</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {organization ? (
                    <Link 
                      to={`/organizations/${device.organizationId}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {organization.name}
                    </Link>
                  ) : (
                    t('not_available')
                  )}
                </dd>
              </div>

              {device.description && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">{t('description')}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{device.description}</dd>
                </div>
              )}

              {Object.keys(device.configuration || {}).length > 0 && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 mb-2">{t('configuration')}</dt>
                  <dd className="mt-1">
                    <div className="bg-gray-50 rounded-md p-4">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        {Object.entries(device.configuration || {}).map(([key, value]) => (
                          <div key={key}>
                            <dt className="text-xs font-medium text-gray-500">{key}</dt>
                            <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </dd>
                </div>
              )}
            </dl>
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
                    <h3 className="text-lg font-medium text-gray-900">{t('delete_device')}</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {t('delete_device_confirm', { name: device.name })}
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

export default DeviceDetails; 