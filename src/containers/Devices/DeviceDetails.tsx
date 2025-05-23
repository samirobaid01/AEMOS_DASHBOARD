import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../state/store';
import {
  fetchDeviceDetails,
  updateDeviceState,
  selectDeviceDetails,
  selectDeviceDetailsLoading,
  selectDeviceDetailsError,
  clearDeviceDetails
} from '../../state/slices/deviceDetails.slice';
import { selectSelectedOrganization } from '../../state/slices/organizations.slice';
import { selectSelectedOrganizationId } from '../../state/slices/auth.slice';
import { fetchAreaById, selectSelectedArea } from '../../state/slices/areas.slice';
import DeviceDetailsComponent from '../../components/devices/DeviceDetails';

const DeviceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const device = useSelector(selectDeviceDetails);
  const organization = useSelector(selectSelectedOrganization);
  const organizationId = useSelector(selectSelectedOrganizationId);
  const area = useSelector(selectSelectedArea);
  const isLoading = useSelector(selectDeviceDetailsLoading);
  const error = useSelector(selectDeviceDetailsError);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id && organizationId) {
     dispatch(fetchDeviceDetails({ 
        deviceId: parseInt(id, 10),
        organizationId 
      }));
    }
    
    return () => {
      dispatch(clearDeviceDetails());
    };
  }, [dispatch, id, organizationId]);

  // Fetch area data when device changes
  useEffect(() => {
    if (device?.areaId) {
      dispatch(fetchAreaById(device.areaId));
    }
  }, [dispatch, device?.areaId]);

  const handleStateChange = async (stateId: number, value: string) => {
    if (!id || !organizationId) return;
    
    try {
      await dispatch(updateDeviceState({
        deviceId: parseInt(id, 10),
        stateId,
        value,
        organizationId
      })).unwrap();
    } catch (error) {
      console.error('Error updating device state:', error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      if (organizationId) {
        navigate(`/organizations/${organizationId}/devices`);
      } else {
        navigate('/devices');
      }
    } catch (error) {
      console.error('Error deleting device:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleNavigateBack = () => {
    if (organizationId) {
      navigate(`/organizations/${organizationId}/devices`);
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
      onStateChange={handleStateChange}
    />
  );
};

export default DeviceDetails; 