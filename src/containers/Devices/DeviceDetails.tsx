import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../state/store';
import {
  fetchDeviceById,
  selectSelectedDevice,
  selectDevicesLoading,
  selectDevicesError,
  deleteDevice
} from '../../state/slices/devices.slice';
import { fetchOrganizationById, selectSelectedOrganization } from '../../state/slices/organizations.slice';
import { fetchAreaById, selectSelectedArea } from '../../state/slices/areas.slice';
import DeviceDetailsComponent from '../../components/devices/DeviceDetails';

const DeviceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const device = useSelector(selectSelectedDevice);
  const organization = useSelector(selectSelectedOrganization);
  const area = useSelector(selectSelectedArea);
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
    if (device?.areaId) {
      dispatch(fetchAreaById(device.areaId));
    }
  }, [dispatch, device]);

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

  const handleNavigateBack = () => {
    if (device?.organizationId) {
      navigate(`/organizations/${device.organizationId}`);
    } else {
      navigate('/devices');
    }
  };

  return (
    <DeviceDetailsComponent
      device={device}
      organization={organization}
      area={area}
      isLoading={isLoading}
      error={error}
      isDeleting={isDeleting}
      deleteModalOpen={deleteModalOpen}
      onDelete={handleDelete}
      onOpenDeleteModal={() => setDeleteModalOpen(true)}
      onCloseDeleteModal={() => setDeleteModalOpen(false)}
      onNavigateBack={handleNavigateBack}
    />
  );
};

export default DeviceDetails; 