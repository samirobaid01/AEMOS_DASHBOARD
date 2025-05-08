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
import DeviceDetailsComponent from '../../components/devices/DeviceDetails';

const DeviceDetails = () => {
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
      console.log("Fetching device with ID:", deviceId);
      dispatch(fetchDeviceById(deviceId));
    }
  }, [dispatch, id]);

  useEffect(() => {
    console.log("Device updated:", device);
    console.log("Missing fields check:", {
      hasSerialNumber: Boolean(device?.serialNumber),
      hasType: Boolean(device?.type),
      hasOrganizationId: Boolean(device?.organizationId),
    });
    
    if (device?.organizationId) {
      console.log("Fetching organization with ID:", device.organizationId);
      dispatch(fetchOrganizationById(device.organizationId));
    }
  }, [dispatch, device]);

  useEffect(() => {
    console.log("Organization updated:", organization);
  }, [organization]);

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
    navigate('/devices');
  };

  return (
    <DeviceDetailsComponent
      device={device}
      organization={organization}
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